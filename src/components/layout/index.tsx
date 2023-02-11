import Head from "next/head";
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-screen-lg mx-auto flex flex-col min-h-screen">
      <Head>
        <meta name="description" content="小动物们的展子日历" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
