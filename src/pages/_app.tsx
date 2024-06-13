import { Noto_Sans_SC, Rubik } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import Layout from "@/components/layout";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { isEnableTrack } from "./_document";

const notoSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
  preload: true,
});

const rubik = Rubik({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rubik",
  preload: true,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-noto-sans: ${notoSC.style.fontFamily};
          --font-rubik: ${rubik.style.fontFamily};
        }
      `}</style>
      <Layout
        headMetas={pageProps.headMetas}
        structuredData={pageProps.structuredData}
      >
        <Component {...pageProps} />
      </Layout>
      {isEnableTrack && <GoogleAnalytics gaId="G-RBND7XQ43D" />}
    </>
  );
}
