// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { dataCollection } from "./sentry.data-collection";
import { dsn, enabled } from "./sentry.dsn";

Sentry.init({
  dsn,
  enabled,

  // A low-traffic site: every trace is kept
  tracesSampleRate: 1,

  dataCollection,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
