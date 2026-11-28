"use client";

// The tile transition between the site's two halves, "/" and "/play". The clapboard's click
// captures the part of the page in view and holds that capture over the viewport while the router
// navigates beneath it. Once the new route has committed, the capture flips away in tiles
// (tileOverlay.worker.ts) to reveal it.
//
// The provider sits in the root layout, which stays mounted when the route group changes, so the
// overlay outlives the layout that started the transition.

import * as Sentry from "@sentry/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { currentViewport, TileOverlay, type Viewport } from "./tileOverlay";

/** The type the tile navigation's transition carries, so that <ViewTransition>s can sit it out. */
export const TILE_TRANSITION_TYPE = "tiles";

// React starts a view transition for the tile navigation even so: the new route group's layout
// mounts a <ViewTransition>, and React counts any mounting one as entering, whatever class it
// resolves to (trackEnterViewTransitions in react-dom-client). The overlay covers the page by then,
// so that view transition shows the new state at once rather than crossfading the root under the
// tiles.
const SILENCE_VIEW_TRANSITION = `
:root:active-view-transition-type(${TILE_TRANSITION_TYPE})::view-transition-group(*),
:root:active-view-transition-type(${TILE_TRANSITION_TYPE})::view-transition-image-pair(*),
:root:active-view-transition-type(${TILE_TRANSITION_TYPE})::view-transition-new(*) {
  animation: none;
}
:root:active-view-transition-type(${TILE_TRANSITION_TYPE})::view-transition-old(*) {
  display: none;
}
`;

/** How long the capture waits for the navigation to commit before it gives way. */
const COMMIT_TIMEOUT_MS = 10_000;

interface TileTransition {
  /** Loads what a transition needs, on a sign that one is about to start. */
  prepare(): void;
  /** Navigates to `destination`, flipping away a capture of the part of `page` in view. */
  navigate(destination: string, page: HTMLElement): void;
}

const TileTransitionContext = createContext<TileTransition | null>(null);

export function useTileTransition(): TileTransition {
  const transition = useContext(TileTransitionContext);
  if (!transition) throw new Error("useTileTransition needs a TileTransitionProvider");
  return transition;
}

let snapdomModule: Promise<typeof import("@zumer/snapdom")> | null = null;

/** Fetches snapdom, the capture library, which only visitors heading for the clapboard need. */
function loadSnapdom() {
  snapdomModule ??= import("@zumer/snapdom");
  return snapdomModule;
}

/**
 * Marks an element whose canvases paint beneath everything else on the page, as the particle
 * background's does. The capture leaves those canvases out of snapdom's and draws their pixels
 * under it instead, with their ancestors' opacity and nothing else of their styling.
 *
 * snapdom serializes a canvas into its SVG as a PNG, which a full-viewport canvas makes cost
 * hundreds of milliseconds at 2560×1440 (encoding, re-inlining and decoding it), where copying
 * the canvas's bitmap costs nothing. snapdom 3.8.3 also draws a canvas whose control went to an
 * OffscreenCanvas, as tsParticles' does, blank: it calls getContext() on it first, which throws.
 */
export const TILE_BACKDROP = "data-tile-backdrop";

/** The opacity `element` paints with, its ancestors' up to `root` included. */
function opacityWithin(element: Element, root: Element): number {
  let opacity = 1;
  for (let node: Element | null = element; node; node = node === root ? null : node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity);
  }
  return opacity;
}

/** The page's own background, which shows wherever nothing else paints. */
function pageBackground(): string {
  for (const element of [document.body, document.documentElement]) {
    const colour = getComputedStyle(element).backgroundColor;
    if (colour !== "rgba(0, 0, 0, 0)" && colour !== "transparent") return colour;
  }
  return "#ffffff";
}

/** Captures the part of `page` in `viewport`. */
async function capture(
  page: HTMLElement,
  { width, height, dpr }: Viewport,
  maxTextureSize: number,
): Promise<ImageBitmap> {
  const { snapdom } = await loadSnapdom();
  const backdropCanvases = `[${TILE_BACKDROP}] canvas`;
  // Taken before snapdom's capture starts, so that both show the same moment
  const backdrops = await Promise.all(
    Array.from(page.querySelectorAll<HTMLCanvasElement>(backdropCanvases), async (canvas) => ({
      bitmap: await createImageBitmap(canvas),
      rect: canvas.getBoundingClientRect(),
      opacity: opacityWithin(canvas, page),
    })),
  );
  const content = await snapdom.toCanvas(page, {
    // In page coordinates
    clip: { x: scrollX, y: scrollY, width, height },
    // A page zoomed far out can have more device pixels than the GPU takes in one texture.
    dpr: Math.min(dpr, maxTextureSize / Math.max(width, height)),
    exclude: backdropCanvases,
  });

  const frame = new OffscreenCanvas(content.width, content.height);
  const context = frame.getContext("2d")!;
  const scale = content.width / width;
  // Opaque, so the new page can't show through before it's revealed
  context.fillStyle = pageBackground();
  context.fillRect(0, 0, frame.width, frame.height);
  for (const { bitmap, rect, opacity } of backdrops) {
    context.globalAlpha = opacity;
    context.drawImage(bitmap, rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale);
    bitmap.close();
  }
  context.globalAlpha = 1;
  context.drawImage(content, 0, 0);
  return frame.transferToImageBitmap();
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function TileTransitionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const overlay = useRef<TileOverlay | null>(null);
  const running = useRef(false);
  /** Told each committed pathname while a transition waits for its navigation. */
  const onCommit = useRef<((pathname: string) => void) | null>(null);

  useEffect(() => {
    onCommit.current?.(pathname);
  }, [pathname]);

  useEffect(
    () => () => {
      overlay.current?.dispose();
      overlay.current = null;
    },
    [],
  );

  const transition = useMemo<TileTransition>(() => {
    /** The overlay, made on first use and remade after a failure; null where it can't run. */
    const getOverlay = (): TileOverlay | null => {
      if (overlay.current?.failed) {
        overlay.current.dispose();
        overlay.current = null;
      }
      if (!overlay.current && container.current && TileOverlay.supported()) {
        overlay.current = new TileOverlay(container.current);
      }
      return overlay.current;
    };

    return {
      prepare() {
        void loadSnapdom();
        getOverlay();
      },

      navigate(destination, page) {
        if (running.current) return;
        const tiles = matchMedia("(prefers-reduced-motion: reduce)").matches ? null : getOverlay();
        if (!tiles) {
          router.push(destination);
          return;
        }

        running.current = true;
        const origin = location.pathname;
        void (async () => {
          try {
            const viewport = currentViewport();
            await tiles.show(await capture(page, viewport, await tiles.ready), viewport);
            // Two frames for the capture to reach the screen before the page beneath it changes
            await nextFrame();
            await nextFrame();
            const arrived = await new Promise<boolean>((resolve) => {
              const timeout = setTimeout(() => resolve(false), COMMIT_TIMEOUT_MS);
              onCommit.current = (committed) => {
                if (committed === origin) return;
                clearTimeout(timeout);
                resolve(true);
              };
              router.push(destination, { transitionTypes: [TILE_TRANSITION_TYPE] });
            });
            if (arrived) await tiles.play();
            else tiles.hide();
          } catch (error) {
            Sentry.captureException(error);
            tiles.hide();
            if (location.pathname === origin) router.push(destination);
          } finally {
            onCommit.current = null;
            running.current = false;
          }
        })();
      },
    };
  }, [router]);

  return (
    <TileTransitionContext value={transition}>
      <style href="tile-transition" precedence="default">
        {SILENCE_VIEW_TRANSITION}
      </style>
      {children}
      {/* Above the page, below the clapboard (z-50); the overlay's canvas goes in here. */}
      <div ref={container} className="pointer-events-none fixed left-0 top-0 z-40" />
    </TileTransitionContext>
  );
}
