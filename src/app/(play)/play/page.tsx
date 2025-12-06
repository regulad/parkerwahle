import Link from "next/link";

export default function Play() {
    return (
        <>
            <p>
                Hey. I&apos;m Parker. Welcome to my webzone. Depending on when you&apos;re reading this, I&apos;m either a eighteen-nineteen-or-twenty-something student or mid-to-late-twenty-something career engineer. Cool self-portrait pending.
            </p>
            <p>
                If you&apos;re as curious as I am about the way things work, you&apos;ll be amazed that the transition to this page was not nearly as <span title="Wanna see CSS & JS pushed to it's limits? Zoom all the way out and try the transition! You can also resize it during the transition." className="tooltip-span">performance intensive</span> as I thought it would be before I made it.
            </p>
            <p>
                The transition is my best attempt at emulating the Play &harr; Make animation from the editor of <span title="LEGAL DISCLAIMER: Nintendo had nothing to do with this website. Thank goodness!" className="tooltip-span"><i>Super Mario Maker</i> for the Nintendo Wii U.</span>
            </p>
            <p>
                As a kid, <i>Super Mario Maker</i>, along with a menagerie of YouTube channels including <a href="https://www.youtube.com/@williamosman">William Osman</a> and <a href="https://www.youtube.com/@carykh">carykh</a>, helped me realize that I felt a pull to the core engineering loop of &quot;trying,&quot; &quot;failing,&quot; and &quot;trying it again.&quot;
            </p>
            <p>
                Photography, once I started viewing it as an art form and not just &quot;a way to take pictures of things,&quot; became my way of expressing myself. I approach making art the same I approach engineering problems. First, I use my imagination to visualize what I want to make, and then I iterate towards it using the tools I have available. The picture formed by my imagination becomes my goal. On my way there, every failure just means I&apos;m one click closer to what I want. <small><a href="https://www.kenrockwell.com/tech/fart.htm">And yes, I did develop this thought process independently to <span title= "And unlike him, I proudly shoot RAW! Get off your high horse, geezer! (Just kidding, Ken Rockwell's website is the best.)" className="tooltip-span">Ken Rockwell</span>.</a></small>
            </p>
            <p>
                Since constraints tend to make art better, it&apos;s no surprise that solutions to engineering problems also tend to blossom in elegance when constraints are applied. For example, let&apos;s look at software engineering, one of my pastimes: I&apos;m much more experienced with backend engineering, but I love web design/development more, and find my solutions to problems to be much more creative than in the accompanying backend code. Why? Well, you have all of the tools the browser gives you, and it&apos;s up to you to use them to recreate the image in your mind&apos;s eye. Sure, you can find some random library on <code>npm</code> with 35 downloads or write a massive module yourself, but you&apos;re going to end up sticking to whatever the browser and your framework provides to get the job done 99% of the time. You have to get creative with those limited tools, and will find yourself using them in completely different ways depending on the context. Your mental muscles grow a little stronger every time you have to abuse some obtuse connection between two obscure DOM features to do <span className="tooltip-span" title="If anybody figures out how to polyfill everything Next.js 15 requires, that would be wonderful... This website deserves to be seen in its full glory on a Windows XP machine.">something others thought was impossible.</span>
            </p>
            <p>
                This is as opposed to backend/desktop software development, where you can just keep throwing things at the wall until something sticks, ignoring the mess you&apos;ve made on the floor (technical debt).
            </p>
            <p>
                <i>&quot;But this side of your website looks like old, unstyled HTML! Why even extol the virtues of the glorious DOM if you&apos;re not even going to use it to it&apos;s full potential?&quot;</i>
            </p>
            <p>
                Believe it or not, It&apos;s not just so I can be subtly <i>Y2K</i> or <i>Frutiger Aero</i>. Or, maybe it is. It depends on how you slice it. I miss the web I interacted with while growing up, even though I only caught the tail end of it in the early 2010s. People made blogs, channels, and galleries not to turn a profit, but just to express themselves while entertaining, educating and prompting to think deeper. My childhood YouTube channels did this fantastically, and my adult followees like <i><a href="https://xkcd.com/">xkcd</a></i> and <i>William Osman</i> (<span title="In hindsight, I made pretty good choices as a kid of whose content I wanted to consume.  No sell-outs here!" className="tooltip-span">still</span>) never stopped. That&apos;s why my website looks like this. It&apos;s meant to harken you back to the era of the web when every website just existed to exist.
            </p>
            <p>
                So, finally, welcome to my website. This website exists to exist. Lucky  me, I get to express myself through the information super-highway! A real, old-school website! Of course, I much prefer the esoteric <i>webzone</i> instead of website, but you&apos;re welcome to call it whatever you choose.
            </p>
            <p>
                Check out my <Link href="/gallery">gallery</Link> and <Link href="/blog">periodical blog</Link>!
            </p>
        </>
    )
}
