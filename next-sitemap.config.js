/** @type {import('next-sitemap').IConfig} */

const URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
module.exports = {
  siteUrl: `https://${URL}`,
  generateRobotsTxt: true,
};
