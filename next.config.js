// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.NODE_ENV === "production",
});

const gitRevisionPlugin = new GitRevisionPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.furryeventchina.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // images: { unoptimized: true },
  optimizeFonts: false,
  experimental: {
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
  },
  trailingSlash: true,
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
    hideSourcemaps: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        LASTCOMMITDATETIME: JSON.stringify(
          gitRevisionPlugin.lastcommitdatetime()
        ),
        __SENTRY_DEBUG__: false,
      })
    );
    return config;
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  org: "jipai",
  project: "furryeventchina",

  silent: true, // Suppresses all logs
  hideSourcemaps: true,

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions
);
