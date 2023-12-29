/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.furryeventchina.com",
  generateRobotsTxt: true, // (optional)
  outDir: "./out",
  alternateRefs: [
    {
      href: "https://www.furrycons.cn",
      hreflang: "zh-cn",
    },
    {
      href: "https://cn.furryeventchina.com",
      hreflang: "zh",
    },
  ],
  // ...other options
};
