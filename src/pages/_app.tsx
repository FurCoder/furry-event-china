import Layout from "@/components/layout";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

const isEnableTrack = process.env.ENABLE_TRACK === "true";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout
      headMetas={pageProps.headMetas}
      structuredData={pageProps.structuredData}
    >
      <Component {...pageProps} />
      {isEnableTrack && <GoogleAnalytics gaId="G-RBND7XQ43D" />}
    </Layout>
  );
}
