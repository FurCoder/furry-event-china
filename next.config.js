// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { format } = require("date-fns");
const { zhCN } = require("date-fns/locale");

const { withSentryConfig } = require("@sentry/nextjs");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled:
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_TRACK === "true",
});

const { i18n } = require("./next-i18next.config");

const isProd = process.env.NODE_ENV === "production";
const IS_CN_REGION = process.env.NEXT_PUBLIC_REGION === "CN";
const STATIC_CDN_URL = process.env.NEXT_PUBLIC_STATIC_CDN_URL;

const gitRevisionPlugin = new GitRevisionPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: false,
    loader: "custom",
    loaderFile: "./src/utils/imageLoader.ts",
  },
  assetPrefix: isProd && STATIC_CDN_URL ? STATIC_CDN_URL : undefined,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash().slice(0, 7)),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        // LASTCOMMITDATETIME: JSON.stringify(
        //   gitRevisionPlugin.lastcommitdatetime()
        // ),
        LASTCOMMITDATETIME: JSON.stringify(
          format(Date.now(), "yyyy/MM/dd", { locale: zhCN })
        ),
        __SENTRY_DEBUG__: false,
      })
    );
    return config;
  },
  i18n,
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  org: IS_CN_REGION ? "kemono-games" : "jipai",
  project: IS_CN_REGION ? "fec-web" : "furryeventchina",

  silent: true, // Suppresses all logs
  disableLogger: true,
  hideSourceMaps: true,
  deleteSourceMapsAfterUpload: true,

  errorHandler: (err, invokeErr, compilation) => {
    compilation.warnings.push("Sentry CLI Plugin: " + err.message);
  },

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions
);
