import { EventType } from "@/types/event";
import { ImageLoaderProps } from "next/image";

const GLOBAL_AUTO_CDN_IMAGE_URL = "images.furrycons.cn";
const GLOBAL_MANUAL_CDN_IMAGE_URL = "images.furryeventchina.com";
const NO_CDN_IMAGE_URL = "cos-proxy.furrycons.cn";

export const getEventCoverImgPath = (event: Partial<EventType>) => {
  return (
    event.thumbnail || event.poster?.all?.[0] || `fec-event-default-cover.png`
  );
};

export const imageUrl = (src: string) => {
  if (process.env.NODE_ENV === "development") {
    return `https://${GLOBAL_MANUAL_CDN_IMAGE_URL}/${src}`;
  }

  return `https://${GLOBAL_AUTO_CDN_IMAGE_URL}/${src}`;
};

const imageLoader = ({
  src,
  width,
  height,
  quality,
  avif,
  webp,
}: Pick<ImageLoaderProps, "src" | "quality"> & {
  avif?: boolean;
  webp?: boolean;
  width?: number;
  height?: number;
}) => {
  const imageURLHost =
    process.env.NODE_ENV === "development"
      ? `https://${GLOBAL_MANUAL_CDN_IMAGE_URL}`
      : `https://${GLOBAL_AUTO_CDN_IMAGE_URL}`;
  const imageURL = new URL(`${imageURLHost}/${src}`);

  width !== undefined && imageURL.searchParams.set("w", width.toString());
  height !== undefined && imageURL.searchParams.set("h", height.toString());
  imageURL.searchParams.set(
    "q",
    quality === undefined ? "75" : quality.toString()
  );
  avif && imageURL.searchParams.set("f", "avif");
  webp && imageURL.searchParams.set("f", "webp");

  return imageURL.toString();
};

export default imageLoader;
