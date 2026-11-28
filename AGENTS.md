# Agent notes for `regulad/landing`

This repository is the source of Parker Wahle's homepage at regulad.net, a Next.js site that Vercel builds and deploys
from `master`. [README.md](README.md) covers running it.

## Domains

- The site is served at `regulad.net`. regulad/homelab's Cloudflare `redirect` Worker sends `www.regulad.net`,
  `regulad.xyz` and `www.regulad.xyz` to it.
- The Matrix `.well-known` files (`/.well-known/matrix/client`, `server` and `support`) belong to `regulad.xyz`, the
  server name in `@regulad:regulad.xyz`. A Worker in regulad/homelab serves them there, so the site has no
  `.well-known` routes of its own.

## Version

`package.json`'s version stays `0.1.0` for good, rather than taking a release date as its version. Nothing ships out of
this repository: it's the source of a web page that Vercel builds and hosts, with no releases, tags or packages, so
there's nothing for a version to name.

## Config files

- The ESLint config is `.config/eslint.config.ts`, as ESLint's maintainers suggest for keeping it out of the root
  (eslint/eslint#18294). ESLint doesn't look in `.config/` by itself, so `pnpm run lint` passes `--config`, and with
  `--config` the patterns in `files` and `ignores` resolve against the working directory, the repository root.
  `tsconfig.json` includes `.config/**/*.ts`, since its `**` globs skip dot-directories. Editors need the path too:
  `.vscode/settings.json` gives it to VS Code's ESLint extension through `eslint.options`.
- `postcss.config.mjs` stays at the root, in JavaScript. `next build` (webpack) reads `package.json`'s `postcss` key,
  `.postcssrc.json`, `postcss.config.json` and `postcss.config.{js,mjs,cjs}` (`next/dist/lib/find-config.js`), and
  `next dev` (Turbopack) reads `postcss.config.{js,mjs,cjs,ts,mts,cts}`, so `.js`, `.mjs` and `.cjs` are the only
  formats both see. Neither looks for it outside the root.
- `next.config.ts`, `tsconfig.json`, `components.json`, pnpm's files, `.pre-commit-config.yaml` and
  `git-conventional-commits.yaml` stay at the root too: Next.js, editors, the shadcn CLI, pnpm, pre-commit and
  git-conventional-commits look for them only there.

## Sentry's files

- `sentry.server.config.ts` and `sentry.edge.config.ts` stay at the project root, not in `src/` or a config directory.
  That is where Sentry's setup wizard puts them in a project with `src/`: its `instrumentation.ts` template imports
  `../sentry.server.config` and `../sentry.edge.config` when it writes `src/instrumentation.ts`
  (`getInstrumentationHookContent` in getsentry/sentry-wizard's `src/nextjs/templates.ts`). Sentry's
  [manual setup guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/) allows the root too, and
  regulad/doppelganger's web app has the same layout.
- `sentry.dsn.ts` and `sentry.data-collection.ts` sit beside them, as in doppelganger, since both configs and
  `src/instrumentation-client.ts` import them.
- `src/instrumentation.ts` and `src/instrumentation-client.ts` stay in `src/`, next to `src/app/`: Next.js production
  builds don't pick up instrumentation from other folders.

## Commits

- Conventional commits, `<type>(<scope>): <summary>`, which the conventional-commits hook checks. The types are
  git-conventional-commits' defaults and `ci`, for workflow changes (`git-conventional-commits.yaml`). Scopes are
  free-form, such as `deps`, `eslint`, `pnpm`, or `agents` for this file.
