import type * as Sentry from "@sentry/nextjs";

// Header and query parameter names that carry client addresses
const addressTerms = ["forwarded", "-ip", "remote-", "via", "-user"];

// Nothing that identifies a person: no user info, cookies or HTTP bodies, and
// no headers or query parameters carrying client addresses. From v11, an unset
// dataCollection collects all of those, so every category is set here. This is
// regulad/doppelganger's apps/web/sentry.data-collection.ts, the baseline from
// Sentry's v10-to-v11 migration guide, with the categories 11.19 adds.
export const dataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: { deny: addressTerms },
    response: { deny: addressTerms },
  },
  httpBodies: [],
  urlQueryParams: { deny: addressTerms },
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  graphQL: { document: false, variables: false },
  queues: false,
} satisfies NonNullable<Parameters<typeof Sentry.init>[0]>["dataCollection"];
