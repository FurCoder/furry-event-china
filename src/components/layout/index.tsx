import Head from "next/head";
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Layout({
  children,
  headMetas,
}: {
  children: React.ReactNode;
  headMetas?: { title?: string; des?: string; url?: string; cover?: string };
}) {
  return (
    <div className="sm:max-w-screen-lg mx-auto flex flex-col min-h-screen">
      <Head>
        <title>{headMetas?.title || "FEC·兽展日历"}</title>
        <meta
          name="description"
          content={headMetas?.des || "欢迎来到FEC·兽展日历！FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！"}
          key="description"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content={headMetas?.title || "FEC·兽展日历"}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={headMetas?.url || "https://www.furryeventchina.com"}
          key="url"
        />
        <meta
          property="og:image"
          content={
            headMetas?.cover || "https://cdn.furryeventchina.com/banner.png"
          }
          key="image"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex-grow mx-1 lg:mx-0">{children}</div>
      <Footer />
    </div>
  );
}
