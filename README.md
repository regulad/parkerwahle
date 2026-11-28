This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Pinned versions

TypeScript is pinned to an exact version, as it doesn't follow Semantic Versioning: its minor releases can make
breaking changes, and it declined to adopt SemVer in
[microsoft/TypeScript#14116](https://github.com/microsoft/TypeScript/issues/14116).

The tsParticles packages are pinned exactly too: `@tsparticles/react` requires `@tsparticles/engine` at its own exact
version, so the three move together.

`@zumer/snapdom` is pinned exactly: its versions look like SemVer, but it doesn't say it follows SemVer, and its
releases remove public options within a major, as 3.3.6 dropped `layoutZoom` (its CHANGELOG, checked 2026-11-27).

## Licence

Free software, under the GNU Affero General Public License, version 3 or (at your option) any later version
([`LICENSE.md`](LICENSE.md)).
