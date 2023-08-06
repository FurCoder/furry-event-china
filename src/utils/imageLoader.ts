import { ImageLoaderProps } from "next/image";

const ENABLE_CN_DOMAIN = process.env.ENABLE_CN_DOMAIN === "true";
const CNURL = process.env.CNURL;

const isEnableCN = () => {
  if (typeof window != "undefined") {
    return window.location.hostname === "cn.furryeventchina.com";
  } else {
    return ENABLE_CN_DOMAIN;
  }
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .trim();

  const isEnableCNCalc = isEnableCN();

  if (isEnableCNCalc) {
    return `https://${CNURL}/${withoutDefaultHostSrc}?w=${width}&q=${
      quality || 75
    }`;
  } else {
    return `https://cdn.furryeventchina.com/${withoutDefaultHostSrc}?w=${width}&q=${
      quality || 75
    }`;
  }
};

export default imageLoader;
