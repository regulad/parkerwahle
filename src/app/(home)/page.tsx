import Image from "next/image";
import {Button} from "@/components/ui/button";
import {bio, socials} from "@/app/constants";
import React from "react";
import portraitPicture from "@/assets/portrait.jpeg";
import {StaticRequire} from "next/dist/shared/lib/get-img-props";
import dynamic from "next/dynamic";
import Link from "next/link";

const ParticleBackground = dynamic(() => import("@/app/ui/particleBackground/particleBackground"), {ssr: false});

export const metadata = {
  title: "About Me",
};

export default function Home() {
  return (
    <>
      <ParticleBackground/>
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
                  {React.createElement(social.iconComponent, {className: "w-6 h-6"})}
                  <span className="sr-only">{social.name}</span>
                </Button>
              </a>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Image
            src={portraitPicture as StaticRequire}
            width={400}
            height={400}
            priority={true}
            placeholder="blur"
            alt="Parker Wahle Portrait"
            className="rounded-xl w-full max-w-[400px] h-auto"
          />
        </div>
      </div>
      {/*<section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">*/}
      {/*  <div className="space-y-8">*/}
      {/*    <div className="space-y-4">*/}
      {/*      <h2 className="text-3xl md:text-4xl font-bold">Latest from the Blog</h2>*/}
      {/*      <p className="text-muted-foreground text-lg md:text-xl">Check out the latest posts from my blog.</p>*/}
      {/*    </div>*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Blog Post 1</CardTitle>*/}
      {/*          <CardDescription>This is a description of the first blog post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <p>This is the content of the first blog post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <Link href="#" className="text-primary" prefetch={false}>*/}
      {/*            Read More*/}
      {/*          </Link>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Blog Post 2</CardTitle>*/}
      {/*          <CardDescription>This is a description of the second blog post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <p>This is the content of the second blog post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <Link href="#" className="text-primary" prefetch={false}>*/}
      {/*            Read More*/}
      {/*          </Link>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Blog Post 3</CardTitle>*/}
      {/*          <CardDescription>This is a description of the third blog post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <p>This is the content of the third blog post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <Link href="#" className="text-primary" prefetch={false}>*/}
      {/*            Read More*/}
      {/*          </Link>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Blog Post 4</CardTitle>*/}
      {/*          <CardDescription>This is a description of the fourth blog post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <p>This is the content of the fourth blog post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <Link href="#" className="text-primary" prefetch={false}>*/}
      {/*            Read More*/}
      {/*          </Link>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Blog Post 5</CardTitle>*/}
      {/*          <CardDescription>This is a description of the fifth blog post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <p>This is the content of the fifth blog post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <Link href="#" className="text-primary" prefetch={false}>*/}
      {/*            Read More*/}
      {/*          </Link>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card className="bg-muted text-muted-foreground">*/}
      {/*        <CardContent className="flex items-center justify-center h-full">*/}
      {/*          <Link href="#" className="text-primary hover:underline" prefetch={false}>*/}
      {/*            Show more*/}
      {/*          </Link>*/}
      {/*        </CardContent>*/}
      {/*      </Card>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
      {/*<section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">*/}
      {/*  <div className="space-y-8">*/}
      {/*    <div className="space-y-4">*/}
      {/*      <h2 className="text-3xl md:text-4xl font-bold">Latest from Social Media</h2>*/}
      {/*      <p className="text-muted-foreground text-lg md:text-xl">Check out my latest social media posts.</p>*/}
      {/*    </div>*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Instagram Post 1</CardTitle>*/}
      {/*          <CardDescription>This is a description of the first Instagram post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <img*/}
      {/*            src="/placeholder.svg"*/}
      {/*            width={400}*/}
      {/*            height={400}*/}
      {/*            alt="Instagram Post 1"*/}
      {/*            className="rounded-lg w-full h-auto"*/}
      {/*          />*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <div className="flex items-center space-x-2">*/}
      {/*            <FiHeart className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">120 likes</span>*/}
      {/*            <FiMessageCircle className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">15 comments</span>*/}
      {/*          </div>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Twitter Post 1</CardTitle>*/}
      {/*          <CardDescription>This is a description of the first Twitter post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <div className="flex items-center space-x-4">*/}
      {/*            <Avatar className="w-12 h-12 border">*/}
      {/*              <AvatarImage src="/placeholder-user.jpg"/>*/}
      {/*              <AvatarFallback>JD</AvatarFallback>*/}
      {/*            </Avatar>*/}
      {/*            <div>*/}
      {/*              <p className="font-medium">John Doe</p>*/}
      {/*              <p className="text-muted-foreground">@johndoe</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p className="mt-4">This is the content of the first Twitter post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <div className="flex items-center space-x-2">*/}
      {/*            <FiHeart className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">50 likes</span>*/}
      {/*            <FiMessageCircle className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">10 comments</span>*/}
      {/*            <RiTwitterXLine className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">20 retweets</span>*/}
      {/*          </div>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>LinkedIn Post 1</CardTitle>*/}
      {/*          <CardDescription>This is a description of the first LinkedIn post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <div className="flex items-center space-x-4">*/}
      {/*            <Avatar className="w-12 h-12 border">*/}
      {/*              <AvatarImage src="/placeholder-user.jpg"/>*/}
      {/*              <AvatarFallback>JD</AvatarFallback>*/}
      {/*            </Avatar>*/}
      {/*            <div>*/}
      {/*              <p className="font-medium">John Doe</p>*/}
      {/*              <p className="text-muted-foreground">Software Developer</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p className="mt-4">This is the content of the first LinkedIn post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <div className="flex items-center space-x-2">*/}
      {/*            <FiThumbsUp className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">75 likes</span>*/}
      {/*            <FiMessageCircle className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">20 comments</span>*/}
      {/*            <FiShare className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">10 shares</span>*/}
      {/*          </div>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Instagram Post 2</CardTitle>*/}
      {/*          <CardDescription>This is a description of the second Instagram post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <img*/}
      {/*            src="/placeholder.svg"*/}
      {/*            width={400}*/}
      {/*            height={400}*/}
      {/*            alt="Instagram Post 2"*/}
      {/*            className="rounded-lg w-full h-auto"*/}
      {/*          />*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <div className="flex items-center space-x-2">*/}
      {/*            <FiHeart className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">100 likes</span>*/}
      {/*            <FiMessageCircle className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">12 comments</span>*/}
      {/*          </div>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card>*/}
      {/*        <CardHeader>*/}
      {/*          <CardTitle>Twitter Post 2</CardTitle>*/}
      {/*          <CardDescription>This is a description of the second Twitter post.</CardDescription>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <div className="flex items-center space-x-4">*/}
      {/*            <Avatar className="w-12 h-12 border">*/}
      {/*              <AvatarImage src="/placeholder-user.jpg"/>*/}
      {/*              <AvatarFallback>JD</AvatarFallback>*/}
      {/*            </Avatar>*/}
      {/*            <div>*/}
      {/*              <p className="font-medium">John Doe</p>*/}
      {/*              <p className="text-muted-foreground">@johndoe</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p className="mt-4">This is the content of the second Twitter post. It can be as long as needed.</p>*/}
      {/*        </CardContent>*/}
      {/*        <CardFooter>*/}
      {/*          <div className="flex items-center space-x-2">*/}
      {/*            <FiHeart className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">40 likes</span>*/}
      {/*            <FiMessageCircle className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">8 comments</span>*/}
      {/*            <RiTwitterXLine className="h-5 w-5 text-muted-foreground"/>*/}
      {/*            <span className="text-muted-foreground">15 retweets</span>*/}
      {/*          </div>*/}
      {/*        </CardFooter>*/}
      {/*      </Card>*/}
      {/*      <Card className="bg-muted text-muted-foreground">*/}
      {/*        <CardContent className="flex items-center justify-center h-full">*/}
      {/*          <Link href="#" className="text-primary hover:underline" prefetch={false}>*/}
      {/*            Show more*/}
      {/*          </Link>*/}
      {/*        </CardContent>*/}
      {/*      </Card>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
      <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <p className="text-muted-foreground text-lg md:text-xl my-4">
          <Link href="/contact" className="classic-link">Reach out today!</Link> I love meeting new people and am always
          open to new opportunities.
        </p>
        <p className="text-muted-foreground text-lg md:text-xl my-4">
          Copyright © 2024 Parker Wahle
        </p>
      </section>
    </>
  );
}
