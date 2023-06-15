/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.furryeventchina.com",
  generateRobotsTxt: true, // (optional)
  outDir: "./out",
  alternateRefs: [
    {
      href: "https://cn.furryeventchina.com",
      hreflang: "zh",
    },
  ],
  // ...other options
};
