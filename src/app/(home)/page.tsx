import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { bio, socials } from "@/constants";
import React from "react";
import portraitPicture from "@/assets/portrait.jpeg";
import Link from "next/link";
import ParticleBackground from "@/components/ui/particleBackground/particleBackground";

export const metadata = {
  title: "About Me",
};

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <div className={"z-10 relative"}>
        <div
          className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Parker Wahle</h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              {bio}
            </p>
            <div className="flex items-center space-x-4">
              {socials.filter((social) => social.isPriority).map((social) => (
                <a href={social.url} key={social.name} title={social.name}>
                  <Button variant="outline" size="icon">
                    {React.createElement(social.iconComponent, { className: "w-6 h-6" })}
                    <span className="sr-only">{social.name}</span>
                  </Button>
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Image
              src={portraitPicture as StaticImageData}
              width={400}
              height={400}
              priority={true}
              placeholder="blur"
              alt="Parker Wahle Portrait"
              className="rounded-xl w-full max-w-[400px] h-auto"
            />
          </div>
        </div>
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-muted-foreground text-lg md:text-xl my-4">
            <Link href="/contact" className="classic-link">Reach out today!</Link> I love meeting new people and am always
            open to new opportunities.
          </p>
          <p className="text-muted-foreground text-lg md:text-xl my-4">
            Copyright © 2025 Parker Wahle
          </p>
        </section>
      </div>
    </>
  );
}
