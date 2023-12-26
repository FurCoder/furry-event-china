import { ImageLoaderProps } from "next/image";
import { EventRecord } from "@/xata/xata";

const ENABLE_CN_DOMAIN = process.env.NEXT_PUBLIC_ENABLE_CN_DOMAIN === "true";
const CN_IMAGE_URL = "images.furrycons.cn";
const GLOBAL_IMAGE_URL = "images.furryeventchina.com";

const isEnableCN = () => {
  if (typeof window != "undefined") {
    return ["cn.furryeventchina.com", "www.furrycons.cn"].includes(
      window.location.hostname
    );
  } else {
    return ENABLE_CN_DOMAIN;
  }
};

export const getEventCoverUrl = (event: Partial<EventRecord>) => {
  return imageUrl(
    event.coverUrl ||
      event.posterUrl?.[0] ||
      `https://cdn.furryeventchina.com/fec-event-default-cover.png`
  );
};

export const imageUrl = (src: string, needAutoCDN: boolean = false) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .trim();

  const isEnableCNCalc = isEnableCN();

  if (!needAutoCDN)
    return `https://cdn.furryeventchina.com/${withoutDefaultHostSrc}`;

  if (isEnableCNCalc) {
    return `https://${CN_IMAGE_URL}/${withoutDefaultHostSrc}}`;
  } else {
    return `https://cdn.furryeventchina.com/${withoutDefaultHostSrc}`;
  }
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .trim();

  const isEnableCNCalc = isEnableCN();

  if (isEnableCNCalc) {
    return `https://${CN_IMAGE_URL}/${withoutDefaultHostSrc}?w=${width}&q=${
      quality || 75
    }`;
  } else {
    return `https://cdn.furryeventchina.com/${withoutDefaultHostSrc}?w=${width}&q=${
      quality || 75
    }`;
  }
};

export default imageLoader;
