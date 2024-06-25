import {socials} from "@/app/constants";

export const metadata = {
  title: "Blog",
};

export default function Blog() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-4xl font-bold my-4">Blog</h1>
      <p>
        My blog is coming soon. Please stay tuned and check my&nbsp;
        <a
          href={[...socials].filter((social) => social.name.startsWith("X")).pop()!.url}
          className="classic-link"
        >
          X
        </a>
        &nbsp;for updates and short-form content in the interim.</p>
    </section>
  );
}
