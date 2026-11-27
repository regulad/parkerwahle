// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { dataCollection } from "./sentry.data-collection";
import { dsn, enabled } from "./sentry.dsn";

Sentry.init({
  dsn,
  enabled,

  integrations: [
    // Forwards the browser's events, which it sends to this site (`tunnel` in
    // src/instrumentation-client.ts), to Sentry, so that ad-blockers can't drop
    // them
    Sentry.serveTunnelIntegration(),
  ],

  // A low-traffic site: every trace is kept
  tracesSampleRate: 1,

  dataCollection,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
