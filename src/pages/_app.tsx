import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout
      headMetas={pageProps.headMetas}
      structuredData={pageProps.structuredData}
    >
      <Component {...pageProps} />
    </Layout>
  );
}
