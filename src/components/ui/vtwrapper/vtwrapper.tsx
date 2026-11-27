"use client";

import "./vtwrapper.css"
import React, { MutableRefObject, ViewTransition, type ViewTransitionInstance, addTransitionType, startTransition, useEffect, useRef, useState } from "react";
import { toBlob, toCanvas } from 'html-to-image';
import { Clapboard } from "../clapboard/clapboard";
import { useRouter } from "next/navigation";

type TransitionCallback = (instance: ViewTransitionInstance, types: Array<string>) => void

function cloneCanvas(originalCanvas: HTMLCanvasElement): HTMLCanvasElement {
    // Create a new canvas element
    const clonedCanvas = originalCanvas.cloneNode() as HTMLCanvasElement;
    const clonedCtx = clonedCanvas.getContext('2d')!!;
    
    // Draw the original canvas onto the new one
    clonedCtx.drawImage(originalCanvas, 0, 0);
    
    return clonedCanvas;
}

export function VTClapboardWrapper({ children, destination, text, classic = false }: Readonly<{ children: React.ReactNode, destination: string, text: string, classic?: boolean }>) {
    const router = useRouter();
    const [lastCanvas, setLastCanvas] = useState<HTMLCanvasElement | null>();
    // the overlay is only touched by the transition callback, never rendered, so it lives in a ref
    const overlayRef = useRef<HTMLDivElement | null>(null);

    // we place an item directly into the
    useEffect(() => {
        const maybeOverlay = document.getElementById("effectOverlay");
        if (!maybeOverlay) {
            const overlayElement = document.createElement("div");

            overlayElement.id = "effectOverlay";

            document.body.appendChild(overlayElement);
            overlayRef.current = overlayElement;
        } else {
            overlayRef.current = maybeOverlay as HTMLDivElement;
        }
    }, []);

    const onUpdate: TransitionCallback = async (instance, types) => {
        const overlay = overlayRef.current;
        if (!overlay) {
            console.warn("Can't do an imperative transition without an effect overlay!")
            return;
        }

        // reset overlay
        overlay.innerHTML = "";

        if (types.includes("mm_grid")) {
            if (lastCanvas == null) {
                console.warn("mm_grid transition was somehow called without a blob in statae!")
                return;
            }

            const workingCanvas = cloneCanvas(lastCanvas);

            workingCanvas.style.position = "absolute";

            workingCanvas.style.width = "100%";
            workingCanvas.style.height = "100%";

            overlay.appendChild(workingCanvas);

            // now with the working canvas above the viewport, we can finally do effects!

            // mario maker grid resolution for one 1920x1080 screen: 30x16
            // let's call a block 64px by 64px

            // with the canvas to cover our work, we can now create a new grid of cubes underneath

            const blocksHorizontal = Math.ceil(overlay.clientWidth / 48);
            const blocksVertical = Math.ceil(overlay.clientHeight / 48);

            const canvasIntervalX = Math.floor(workingCanvas.width / blocksHorizontal);
            const canvasIntervalY = Math.floor(workingCanvas.height / blocksVertical);

            for (let i = 0; i < blocksHorizontal; i++) {
                for (let j = 0; j < blocksVertical; j++) {
                    const thisSubcanvasWrapper = document.createElement("div");
                    const thisSubcanvas = document.createElement("canvas");
                    thisSubcanvasWrapper.appendChild(thisSubcanvas)

                    thisSubcanvas.width = canvasIntervalX;
                    thisSubcanvas.height = canvasIntervalY;

                    thisSubcanvas.style.width = "100%";
                    thisSubcanvas.style.height = "100%";

                    thisSubcanvasWrapper.style.width = (100 / blocksHorizontal) + "%";
                    thisSubcanvasWrapper.style.height = (100 / blocksVertical) + "%"

                    thisSubcanvasWrapper.style.left = (i * (100 / blocksHorizontal)) + "%";
                    thisSubcanvasWrapper.style.top = (j * (100 / blocksVertical)) + "%";

                    thisSubcanvasWrapper.className = "mmGridSubcanvasWrapper"

                    const thisSubcanvasCtx = thisSubcanvas.getContext("2d")!!

                    thisSubcanvasCtx.drawImage(
                        workingCanvas,
                        canvasIntervalX * (i), canvasIntervalY * (j),
                        canvasIntervalX, canvasIntervalY,
                        0, 0,
                        canvasIntervalX, canvasIntervalY,
                    )

                    thisSubcanvasWrapper.setAttribute("animation-offset", (i + j).toString())

                    overlay.appendChild(thisSubcanvasWrapper);
                }
            }

            overlay.removeChild(workingCanvas)

            // grid items have been created
            // className: mmGridSubcanvas
            await Promise.all(Array.from(overlay.querySelectorAll(".mmGridSubcanvasWrapper")).map(element => {
                const animationOffsetString = element.getAttribute("animation-offset")!!
                const animationOffsetInt = parseInt(animationOffsetString)

                return element.animate([
                    { 
                        outline: '0px solid transparent',
                        opacity: 100 
                    },
                    { 
                        outline: '3px solid #6666',
                        opacity: 50 
                    }
                ], {
                    duration: 200,
                    delay: animationOffsetInt * 5,
                    easing: 'ease-out',
                    fill: 'forwards'
                }).finished.then(() => element.animate([
                    { 
                        transform: 'perspective(1000px) rotate3d(-1, 1, 0, 0deg)' 
                    },
                    { 
                        transform: 'perspective(1000px) rotate3d(-1, 1, 0, 90deg)' 
                    }
                ], {
                    duration: 400,
                    delay: animationOffsetInt * 5,
                    easing: 'ease-out',
                    fill: 'forwards'
                }).finished)
            }));

            
            // reset overlay, animation is complete
            overlay.innerHTML = "";
        }
    }

    // changing the page is an "update" transition
    // the imperative onUpdate only gets called if the update actually has an animation to call

    // we need to create a domimage before we push to the router to start a transition 

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null)

    return (
        <>
            <Clapboard text={text} playing={classic} doTransition={() => {
                startTransition(async () => {
                    addTransitionType("mm_grid")

                    const domImage = await toCanvas(ref.current!!, {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        backgroundColor: "white"
                    });
                    setLastCanvas(domImage);

                    router.push(destination)
                });
            }} />
            <ViewTransition
                name="main"
                // default viewTransition is included, but we override for the mm_grid
                default={classic ? "none" : undefined}
                share={{
                    mm_grid: "dummy",
                    // other transition types fall back to the same class as the default prop
                    default: classic ? "none" : "auto",
                }}
                // imperative animations
                onShare={onUpdate}
            >
                <div id="capture" ref={ref}>
                    {children}
                </div>
            </ViewTransition>
        </>
    );
}
