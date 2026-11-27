// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { dataCollection } from "../sentry.data-collection";
import { dsn, enabled } from "../sentry.dsn";

Sentry.init({
  dsn,
  enabled,

  // Sends events to this site, at a path derived from the DSN, rather than
  // straight to Sentry, so that ad-blockers can't drop them. The server
  // (serveTunnelIntegration in sentry.server.config.ts) forwards them; on
  // Vercel, withSentryConfig writes a route for it into the build.
  tunnel: true,

  // A low-traffic site: every trace is kept
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Every session that has an error is recorded, and one in ten of the rest
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    // Session Replay, with every text masked and every image, video and
    // canvas blocked, so that a replay shows the page's layout and not what
    // it says
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  dataCollection,
});

// Traces client-side navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
