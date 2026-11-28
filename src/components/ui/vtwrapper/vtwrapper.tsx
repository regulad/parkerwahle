"use client";

import React, { ViewTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clapboard } from "../clapboard/clapboard";
import { TILE_TRANSITION_TYPE, useTileTransition } from "../tileTransition/tileTransition";

export function VTClapboardWrapper({ children, destination, text, classic = false }: Readonly<{ children: React.ReactNode, destination: string, text: string, classic?: boolean }>) {
    const router = useRouter();
    const tiles = useTileTransition();
    const page = useRef<HTMLDivElement>(null);

    // The clapboard isn't a <Link>, so nothing else prefetches where it goes.
    useEffect(() => {
        router.prefetch(destination);
    }, [router, destination]);

    return (
        <>
            <Clapboard
                text={text}
                playing={classic}
                onIntent={tiles.prepare}
                doTransition={() => {
                    if (page.current) tiles.navigate(destination, page.current);
                }}
            />
            <ViewTransition
                name="main"
                // The tile transition draws itself (tileTransition.tsx), so it sits that type out.
                // Other navigations crossfade on the modern side and cut on the classic side.
                default={{ [TILE_TRANSITION_TYPE]: "none", default: classic ? "none" : "auto" }}
            >
                <div ref={page}>
                    {children}
                </div>
            </ViewTransition>
        </>
    );
}
