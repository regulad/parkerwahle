# Agent notes for `regulad/parkerwahle`

This repository is the source of Parker Wahle's homepage at regulad.xyz, a Next.js site that Vercel builds and deploys
from `master`. [README.md](README.md) covers running it.

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
