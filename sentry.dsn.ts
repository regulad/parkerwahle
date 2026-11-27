// Where the site reports to Sentry: the project regulad/landing, which
// regulad/homelab's tofu/sentry makes. homelab's tofu/vercel sets
// NEXT_PUBLIC_SENTRY_DSN on the Vercel project from tofu/sentry's output; unset,
// the same DSN is the default. Next.js writes NEXT_PUBLIC_ values into its
// bundles at build time. A DSN is public by nature: the browser sends it with
// every event, and it only lets a client send events to the project.
export const dsn =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://a747fa6757cb959e5f96a0469cb1f3b5@o4506961510596608.ingest.us.sentry.io/4512504562122752";

// Only Vercel's production deployments report: local builds and preview
// deployments send nothing. Vercel exposes its system environment variables to
// the build, and Next.js writes this one into the bundles there.
export const enabled = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
