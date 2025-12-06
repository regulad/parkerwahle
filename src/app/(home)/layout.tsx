import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import {FiExternalLink} from "react-icons/fi";
import { VTClapboardWrapper } from "@/components/ui/vtwrapper/vtwrapper";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <VTClapboardWrapper text="Play" destination="/play"> 
        <main lang="en" className="mb-32">
          <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-lg font-medium">
                Parker Wahle
              </Link>
              {/* Doesn't really matter on mobile */}
              <div className="hidden md:flex items-center space-x-4">
                <a href="https://github.com/regulad" className="text-muted-foreground hover:text-foreground">
                  Portfolio&nbsp;<FiExternalLink className="inline w-4 h-4"/>
                </a>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              {/* we want the linktree button here */}
              <a href="https://linktr.ee/regulad" className="text-muted-foreground hover:text-foreground">
                <Button variant="outline">
                  <span>Linktree</span>
                  &nbsp;
                  <FiExternalLink className="w-4 h-4"/>
                </Button>
              </a>
            </div>
          </header>
          {children}
        </main>
      </VTClapboardWrapper>
    </>
  );
}
