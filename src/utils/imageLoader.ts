import { ImageLoaderProps } from "next/image";
import { EventRecord } from "@/xata/xata";

const GLOBAL_AUTO_CDN_IMAGE_URL = "images.furrycons.cn";

export const getEventCoverUrl = (event: Partial<EventRecord>) => {
  return imageUrl(
    event.coverUrl ||
      event.posterUrl?.[0] ||
      `https://images.furryeventchina.com/fec-event-default-cover.png`
  );
};

export const imageUrl = (src: string) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .replace("https://images.furryeventchina.com/", "")
    .replace("https://images.furrycons.cn/", "")
    .trim();

  return `https://${GLOBAL_AUTO_CDN_IMAGE_URL}/${withoutDefaultHostSrc}`;
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .replace("https://images.furryeventchina.com/", "")
    .replace("https://images.furrycons.cn/", "")
    .trim();

  return `https://${GLOBAL_AUTO_CDN_IMAGE_URL}/${withoutDefaultHostSrc}?w=${width}&q=${
    quality || 75
  }`;
};

export default imageLoader;
