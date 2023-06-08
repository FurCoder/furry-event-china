// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

//disabled due to https://github.com/getsentry/sentry-javascript/issues/7522
// import * as Sentry from "@sentry/nextjs";

// const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// if (process.env.NODE_ENV === "production") {
//   Sentry.init({
//     dsn:
//       SENTRY_DSN ||
//       "https://1ed2ba43a45f4dee8874d80de24b3e73@o4504660600684544.ingest.sentry.io/4504660602978304",
//     // Adjust this value in production, or use tracesSampler for greater control
//     tracesSampleRate: 1.0,
//     // ...
//     // Note: if you want to override the automatic release value, do not set a
//     // `release` value here - use the environment variable `SENTRY_RELEASE`, so
//     // that it will also get attached to your source maps
//   });
// }
