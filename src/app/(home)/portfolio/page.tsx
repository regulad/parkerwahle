import {socials} from "@/app/constants";

export const metadata = {
  title: "Portfolio",
};

export default function Portfolio() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-4xl font-bold my-4">Portfolio</h1>
      <p>
        A more fleshed out portfolio will be coming soon. In the meantime, please check my
        &nbsp;
        <a
          href={[...socials].filter((social) => social.name.startsWith("GitHub")).pop()!.url}
          className="classic-link"
        >
          GitHub
        </a>
        &nbsp;
        for my most recent work. My pinned repositories are a good place to start.
      </p>
    </section>
  );
}
