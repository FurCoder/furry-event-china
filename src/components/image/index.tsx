import imageLoader from "@/utils/imageLoader";

/* eslint-disable @next/next/no-img-element */
function Image({
  id,
  src,
  alt,
  sizes,
  className,
  onLoadingComplete,
  quality,
  width,
  height,
  priority,
}: {
  id?: string;
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  onLoadingComplete?: (img: HTMLImageElement) => void;
  quality?: number;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const regex = /\b(\d+)px\b(?![^(]*\))/g;
  const getSrcset = () => {
    const sizesResult = Array.from(new Set(sizes?.match(regex)));

    return sizesResult
      .map(
        (w) =>
          `${imageLoader({ src, quality, width: parseInt(w) })} ${parseInt(w)}w`
      )
      .join(", ");
  };

  const srcString = width ? imageLoader({ src, quality, width }) : src;

  return (
    <img
      id={id}
      className={className}
      src={srcString}
      alt={alt}
      onLoad={(e) =>
        onLoadingComplete && onLoadingComplete(e.target as HTMLImageElement)
      }
      sizes={sizes}
      srcSet={getSrcset()}
      loading={priority ? "eager" : "lazy"}
      //@ts-ignore
      fetchpriority={priority ? "high" : "auto"}
    />
  );
}

export default Image;
