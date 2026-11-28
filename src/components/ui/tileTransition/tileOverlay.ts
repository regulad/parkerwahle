// The main thread's handle on the tile transition's renderer: a <canvas> over the page whose
// drawing tileOverlay.worker.ts does through an OffscreenCanvas.

/** The window, in CSS pixels, and the device pixel ratio to draw at. */
export interface Viewport {
  width: number;
  height: number;
  dpr: number;
}

export type ToWorker =
  | { type: "init"; canvas: OffscreenCanvas }
  /** Draws `page` (a capture of the viewport) over the whole canvas, answered once it's drawn. */
  | { type: "show"; id: number; page: ImageBitmap; viewport: Viewport }
  /** Flips the shown capture away, answered once it's gone. */
  | { type: "play"; id: number }
  | { type: "resize"; viewport: Viewport }
  | { type: "hide" };

export type FromWorker =
  | { type: "ready"; maxTextureSize: number }
  | { type: "done"; id: number }
  | { type: "failed"; message: string };

/** Everything above the 1-minute mark is a renderer that stopped answering. */
const REQUEST_TIMEOUT_MS = 60_000;

/**
 * The whole window, scrollbars' strips included: the overlay covers exactly this, so a new page
 * without the old one's scrollbars can't show around the capture or stretch it.
 */
export function currentViewport(): Viewport {
  return { width: innerWidth, height: innerHeight, dpr: devicePixelRatio };
}

export class TileOverlay {
  static supported(): boolean {
    return typeof OffscreenCanvas !== "undefined" && "transferControlToOffscreen" in HTMLCanvasElement.prototype;
  }

  /** Resolves to the largest texture the renderer takes, in pixels per side. */
  readonly ready: Promise<number>;

  private readonly canvas: HTMLCanvasElement;
  private readonly worker: Worker;
  private nextId = 0;
  private readonly pending = new Map<number, { resolve: () => void; reject: (error: Error) => void }>();
  private failure: Error | null = null;
  private failReady: (error: Error) => void = () => {};

  constructor(container: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "block";
    this.canvas.hidden = true;
    this.canvas.setAttribute("aria-hidden", "true");
    container.append(this.canvas);
    const offscreen = this.canvas.transferControlToOffscreen();

    this.worker = new Worker(new URL("./tileOverlay.worker.ts", import.meta.url), { type: "module" });
    let resolveReady: (maxTextureSize: number) => void = () => {};
    this.ready = new Promise((resolve, reject) => {
      resolveReady = resolve;
      this.failReady = reject;
    });
    // A renderer that fails before anyone waits on it isn't an unhandled rejection.
    this.ready.catch(() => {});
    this.worker.onmessage = ({ data: message }: MessageEvent<FromWorker>) => {
      switch (message.type) {
        case "ready":
          resolveReady(message.maxTextureSize);
          break;
        case "done":
          this.pending.get(message.id)?.resolve();
          this.pending.delete(message.id);
          break;
        case "failed":
          this.fail(new Error(`tile renderer: ${message.message}`));
          break;
      }
    };
    this.worker.onerror = (event) => this.fail(new Error(`tile renderer: ${event.message}`));
    this.post({ type: "init", canvas: offscreen }, [offscreen]);
    window.addEventListener("resize", this.onResize);
  }

  /** The error that broke the renderer, after which this overlay should be replaced. */
  get failed(): Error | null {
    return this.failure;
  }

  /** Covers `viewport` with `page`, a capture of it, resolving once the renderer has drawn it. */
  async show(page: ImageBitmap, viewport: Viewport): Promise<void> {
    this.fit(viewport);
    this.canvas.hidden = false;
    await this.request({ type: "show", id: this.nextId, page, viewport }, [page]);
  }

  /** Flips the shown page away, resolving once it's gone and the canvas is hidden again. */
  async play(): Promise<void> {
    try {
      await this.request({ type: "play", id: this.nextId });
    } finally {
      this.canvas.hidden = true;
    }
  }

  hide(): void {
    this.canvas.hidden = true;
    if (!this.failure) this.post({ type: "hide" });
  }

  dispose(): void {
    window.removeEventListener("resize", this.onResize);
    this.worker.terminate();
    this.canvas.remove();
    this.fail(new Error("tile renderer disposed"));
  }

  private readonly onResize = () => {
    if (this.failure) return;
    const viewport = currentViewport();
    this.fit(viewport);
    this.post({ type: "resize", viewport });
  };

  private fit({ width, height }: Viewport): void {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  private post(message: ToWorker, transfer: Transferable[] = []): void {
    this.worker.postMessage(message, transfer);
  }

  private request(message: ToWorker & { id: number }, transfer: Transferable[] = []): Promise<void> {
    if (this.failure) return Promise.reject(this.failure);
    const { id } = message;
    this.nextId++;
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => this.fail(new Error(`tile renderer didn't answer ${message.type}`)), REQUEST_TIMEOUT_MS);
      this.pending.set(id, {
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });
      this.post(message, transfer);
    });
  }

  private fail(error: Error): void {
    this.failure ??= error;
    this.canvas.hidden = true;
    this.failReady(this.failure);
    for (const { reject } of this.pending.values()) reject(this.failure);
    this.pending.clear();
  }
}
