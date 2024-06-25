import {socials} from "@/app/constants";
import {Button} from "@/components/ui/button";
import React from "react";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-4xl font-bold my-4">Contact</h1>
      <p className="my-4">
        You can reach me via email at pw (at) regulad.xyz, or on any of the social media platforms linked below. I am
        likely to repond fastest on Twitter (X), LinkedIn, or Discord.
      </p>
      <div className="my-4">
        <div className="flex items-center space-x-4">
          {[...socials].map((social) => (
            <a href={social.url} key={social.name} title={social.name}>
              <Button variant="outline" size="icon">
                {React.createElement(social.iconComponent, {className: "w-6 h-6"})}
                <span className="sr-only">{social.name}</span>
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
