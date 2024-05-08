import Layout from "@/components/layout";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

const isEnableTrack = process.env.ENABLE_TRACK === "true";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init("phc_zvonG6HYl80V3hEnI3ubH36ZM0mJkG5u6RbiUI1yOkh", {
    api_host: "https://us.i.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PostHogProvider client={posthog}>
      <Layout
        headMetas={pageProps.headMetas}
        structuredData={pageProps.structuredData}
      >
        <Component {...pageProps} />
        {isEnableTrack && <GoogleAnalytics gaId="G-RBND7XQ43D" />}
      </Layout>
    </PostHogProvider>
  );
}
