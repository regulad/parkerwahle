# Agent notes for `regulad/parkerwahle`

This repository is the source of Parker Wahle's homepage at regulad.xyz, a Next.js site that Vercel builds and deploys
from `master`. [README.md](README.md) covers running it.

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
- `next.config.ts`, `tsconfig.json`, `components.json` and pnpm's files stay at the root too: Next.js, editors, the
  shadcn CLI and pnpm look for them only there.

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
