import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Off, so next dev doesn't write an AGENTS.md when it detects a coding
  // agent: agent instructions stay out of this repository.
  agentRules: false,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/

  org: "regulad",
  project: "parkerwahle",

  // Uploads source maps and creates the release. regulad/homelab's tofu/vercel
  // sets it on production builds only; without it the plugin skips both with a
  // warning, so other builds still pass.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // The bundler plugin sends no telemetry of its own to Sentry
  telemetry: false,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Fail the build when creating the release or uploading source maps fails,
  // which would otherwise only be logged (and not at all while silent)
  errorHandler: (err) => {
    throw err;
  },

  // Off, as in regulad/doppelganger: in @sentry/nextjs 11.10 this prepended a
  // marker to each server entry bundle after webpack had written its source
  // map, so every frame on that bundle's first line resolved to the wrong
  // place. It only compiles tracing hooks into bundled server packages, which
  // this site has none of.
  buildTimeInstrumentation: false,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // The client source maps are hidden (no sourceMappingURL in the bundles)
  // and deleted once uploaded, so the site never serves them
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
