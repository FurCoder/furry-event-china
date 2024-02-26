import Head from "next/head";
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/router";

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
    <div className="sm:max-w-screen-lg mx-auto flex flex-col min-h-screen">
      <Head>
        <title>{headMetas?.title || "FEC·兽展日历 | FEC·兽聚日历"}</title>
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
              ? headMetas.keywords.concat(', ').concat(defaultKeywords)
              : defaultKeywords
          }
          key="keywords"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content={headMetas?.title || "FEC·兽展日历"}
        />
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
          content={
            headMetas?.cover || "https://images.furrycons.cn/banner.png"
          }
          key="image"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="furryeventchina.com" />
        <meta
          property="twitter:url"
          content={headMetas?.url || "https://www.furryeventchina.com"}
        />
        <meta
          name="twitter:title"
          content={headMetas?.title || "FEC·兽展日历"}
        />
        <meta
          name="twitter:description"
          content={
            headMetas?.des ||
            "欢迎来到FEC·兽展日历！FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！"
          }
        />
        <meta
          name="twitter:image"
          content={
            headMetas?.cover || "https://images.furrycons.cn/banner.png"
          }
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={`https://www.furryeventchina.com${asPath}`}
        />
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
      <Header />
      {!IS_CN_REGION && (
        <div className="px-4 py-4 bg-white border border-gray-200 mb-6 rounded-xl text-red-400">
          如您感觉加载速度较慢，请访问我们的境内域名地址:{" "}
          <a
            href={`https://www.furrycons.cn${asPath}`}
            className="underline cursor-pointer"
          >
            www.furrycons.cn
          </a>
          ，放心点击，您的路径将保持一致。
        </div>
      )}
      <div className="flex-grow mx-1 lg:mx-0">{children}</div>
      <Footer isCNRegion={IS_CN_REGION} />
    </div>
  );
}
