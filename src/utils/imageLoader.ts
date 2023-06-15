import { ImageLoaderProps } from "next/image";

const isEnableCN = process.env.ENABLE_CN_DOMAIN === "true";
const CNURL = process.env.CNURL;

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const withoutDefaultHostSrc = src.replace(
    "https://cdn.furryeventchina.com/",
    ""
  );
  if (isEnableCN) {
    return `https://${CNURL}/${withoutDefaultHostSrc}?w=${width}&q=${quality || 75}`;
  } else {
    return `https://cdn.furryeventchina.com/${withoutDefaultHostSrc}?w=${width}&q=${
      quality || 75
    }`;
  }
};

export default imageLoader;
