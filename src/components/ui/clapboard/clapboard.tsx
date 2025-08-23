"use client";

import "./clapboard.css"
import { cn } from "@/lib/utils"
import { League_Spartan } from "next/font/google"
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { toBlob } from "html-to-image";

const leagueSpartan = League_Spartan({
    subsets: ["latin"],
});

export function Clapboard({ text, doTransition, playing }: Readonly<{ text: string, doTransition: () => void, playing: boolean }>) {
    const router = useRouter();

    return (
        <div
            className={cn("z-50 fixed bottom-5 hover:bottom-7 left-5 hover:-rotate-6 bg-gray-800 w-28 h-20 text-white border-l-4 border-r-4 border-b-4 border-gray-900 immune opacity-30 hover:opacity-100 grid grid-cols-1 content-center justify-items-center gap-1 pt-4 transition-all duration-100 rounded-sm text-3xl cursor-pointer", leagueSpartan.className)}
            onClick={doTransition}
        >
            <div className="w-32 h-5 -top-2 bg-gray-800 absolute z-50 rounded-[2px] overflow-hidden">
                <div className="seg-stripes-top" />
                <div className="seg-stripes-bottom" />
            </div>
            <PlayIcon className={
                cn("stroke-white stroke-[4.5] size-5", playing && "opacity-0 aria-hidden")
            } />
            {
                playing ?
                <PauseIcon className="absolute stroke-white top-3 size-8" /> : null
            }
            <div>
                {text}
            </div>
        </div>
    )
}
