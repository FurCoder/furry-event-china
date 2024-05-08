import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Sans_SC, Rubik } from "next/font/google";

import Layout from "@/components/layout";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

const isEnableTrack = process.env.ENABLE_TRACK === "true";

const notoSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
  preload: false,
});

const rubik = Rubik({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rubik",
  preload: false,
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
        fonts={[notoSC]}
      >
        <Component {...pageProps} />
        {isEnableTrack && <GoogleAnalytics gaId="G-RBND7XQ43D" />}
      </Layout>
    </>
  );
}
