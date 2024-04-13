import { ImageLoaderProps } from "next/image";
import { EventRecord } from "@/xata/xata";

const GLOBAL_AUTO_CDN_IMAGE_URL = "images.furrycons.cn";
const GLOBAL_MANUAL_CDN_IMAGE_URL = "images.furryeventchina.com";

export const getEventCoverUrl = (event: Partial<EventRecord>) => {
  return imageUrl(
    event.coverUrl ||
      event.posterUrl?.[0] ||
      `https://images.furrycons.cn/fec-event-default-cover.png`
  );
};

export const imageUrl = (src: string) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .replace("https://images.furryeventchina.com/", "")
    .replace("https://images.furrycons.cn/", "")
    .trim();

  if (process.env.NODE_ENV === "development") {
    return `https://${GLOBAL_MANUAL_CDN_IMAGE_URL}/${withoutDefaultHostSrc}`;
  }

  return `https://${GLOBAL_AUTO_CDN_IMAGE_URL}/${withoutDefaultHostSrc}`;
};

const imageLoader = ({
  src,
  width,
  quality,
  avif,
  webp,
}: Pick<ImageLoaderProps, "src" | "quality"> & {
  avif?: boolean;
  webp?: boolean;
  width?: number;
}) => {
  const withoutDefaultHostSrc = src
    .replace("https://cdn.furryeventchina.com/", "")
    .replace("https://images.furryeventchina.com/", "")
    .replace("https://images.furrycons.cn/", "")
    .trim();

  const imageURLHost =
    process.env.NODE_ENV === "development"
      ? `https://${GLOBAL_MANUAL_CDN_IMAGE_URL}`
      : `https://${GLOBAL_AUTO_CDN_IMAGE_URL}`;
  const imageURL = new URL(`${imageURLHost}/${withoutDefaultHostSrc}`);

  width !== undefined && imageURL.searchParams.set("w", width.toString());
  imageURL.searchParams.set(
    "q",
    quality === undefined ? "75" : quality.toString()
  );
  avif && imageURL.searchParams.set("f", "avif");
  webp && imageURL.searchParams.set("f", "webp");

  return imageURL.toString();
};

export default imageLoader;
