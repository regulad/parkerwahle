import Link from "next/link";
import "./classic.css";
import "./classicAddendum.css"
import { VTClapboardWrapper } from "@/components/ui/vtwrapper/vtwrapper";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    // we treat htmlSurrogate the same as an html for the purpose of applying the IE9 style after the style reset
    return (
        <>
            <VTClapboardWrapper text="Work" destination="/" classic>
                <main lang="en" className="mb-32">
                    <div id="htmlSurrogate">
                        <div id="bodySurrogate">
                            <nav>
                                <span className="text-2xl">
                                    <Link href="/play">
                                        <b>Parker&apos;s Webzone</b>
                                    </Link>
                                </span>
                                &#8203;
                                <span className="ml-2">
                                    <a href="https://github.com/regulad">
                                        Portfolio
                                    </a>
                                </span>
                                <span className="ml-2">
                                    <Link href="/gallery">
                                        Gallery
                                    </Link>
                                </span>
                                &#8203;
                                <span className="ml-2">
                                    <Link href="/blog">
                                        Blog
                                    </Link>
                                </span>
                            </nav>
                            <hr />
                            {children}
                            <hr />
                            <p>
                                Copyright &copy; 2006-2025 Parker Edward Wahle
                            </p>
                            <p>
                                All content on this website is available for use under license <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>  unless otherwise noted. Please see the <a href="https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution">CC attribution guide</a> if you are interested in using or making a derivative of my work. Cheers, and good luck!
                            </p>
                            <p>
                                Source code used to produce visual effects/construct web pages may be available on <a href="https://github.com/regulad">my GitHub</a> under a GPL license or similar copyleft license.
                            </p>
                            <p>
                                If you would like to reach out to me, please write me an email. My address is <code>regulad (at) regulad (dot) xyz</code>.
                            </p>
                            <p>
                                Alternatively, if you have an issue with the website (i.e. DMCA request) or have a comment and/or concern, please contact me at my alternative email <code>webmaster (at) regulad (dot) xyz</code>.
                            </p>
                        </div>
                    </div>
                </main>
            </VTClapboardWrapper>
        </>
    )
}
