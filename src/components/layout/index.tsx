import Head from "next/head";
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { titleGenerator, universalKeywords } from "@/utils/meta";
import AnnouncementSlider from "@/components/announcementSlider";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

const IS_CN_REGION = process.env.NEXT_PUBLIC_REGION === "CN";

const defaultKeywords = "兽聚, 兽展, 兽展日历, 兽聚日历, fec 兽展, fcc 兽展";
export default function Layout({
  children,
  headMetas,
  structuredData,
}: {
  children: React.ReactNode;
  headMetas?: {
    title?: string;
    des?: string;
    url?: string;
    cover?: string;
    keywords?: string;
  };
  structuredData?: { [key: string]: { [key: string]: string } };
}) {
  const router = useRouter();
  const asPath = router.asPath;

  return (
    <div className="sm:max-w-screen-lg mx-auto flex flex-col min-h-screen relative">
      <Head>
        <title>{titleGenerator(headMetas?.title)}</title>
        <meta
          name="description"
          content={
            headMetas?.des ||
            "欢迎来到FEC·兽展日历！FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展、兽聚等相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！"
          }
          key="description"
        />
        <meta
          name="keywords"
          content={
            headMetas?.keywords
              ? headMetas.keywords
                  .concat(",")
                  .concat(universalKeywords.join(","))
              : universalKeywords.join(",")
          }
          key="keywords"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={titleGenerator(headMetas?.title)} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={
            headMetas?.des ||
            "欢迎来到FEC·兽展日历！FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展、兽聚相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！"
          }
        />
        <meta
          property="og:url"
          content={headMetas?.url || "https://www.furryeventchina.com"}
          key="url"
        />
        <meta
          property="og:image"
          content={headMetas?.cover || "https://images.furrycons.cn/banner.png"}
          key="image"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="furryeventchina.com" />
        <meta
          property="twitter:url"
          content={headMetas?.url || "https://www.furryeventchina.com"}
        />
        <meta name="twitter:title" content={titleGenerator(headMetas?.title)} />
        <meta
          name="twitter:description"
          content={
            headMetas?.des ||
            "欢迎来到FEC·兽展日历！FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！"
          }
        />
        <meta
          name="twitter:image"
          content={headMetas?.cover || "https://images.furrycons.cn/banner.png"}
        />
        <meta
          name="baidu-site-verification"
          content={IS_CN_REGION ? "codeva-GHH5uUsoan" : "codeva-UlpDYpags1"}
        />
        <link rel="icon" href="/favicon.ico" />
        {/* <link
          rel="canonical"
          href={`https://www.furryeventchina.com${asPath}`}
        /> */}
        {structuredData?.event && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData.event),
            }}
          />
        )}
        {structuredData?.breadcrumb && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData.breadcrumb),
            }}
          />
        )}
        {structuredData?.imageObject && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData.imageObject),
            }}
          />
        )}
      </Head>
      <Toaster />
      <Header />
      <AnnouncementSlider />
      <div className="flex-grow mx-1 lg:mx-0">{children}</div>
      <Sidebar />
      <Footer isCNRegion={IS_CN_REGION} />
    </div>
  );
}
