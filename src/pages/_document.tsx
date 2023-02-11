import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="zh-Hans">
      <Head />

      <body>
        <Main />
        <NextScript />
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-RBND7XQ43D"
        />
        <Script id="ga" strategy="lazyOnload">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-RBND7XQ43D');
                `}
        </Script>
        <Script
          data-website-id="a12ca72b-5704-4910-bb28-9dd09d576e91"
          strategy="lazyOnload"
          src="https://analytics.umami.is/script.js"
        />
      </body>
    </Html>
  );
}
