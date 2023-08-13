import imageLoader from "@/utils/imageLoader";

/* eslint-disable @next/next/no-img-element */
function Image({
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
    console.log(sizesResult);

    return sizesResult
      .map(
        (w) =>
          `${imageLoader({ src, quality, width: parseInt(w) })} ${parseInt(w)}w`
      )
      .join(", ");
  };

  const srcString = width ? imageLoader({ src, width }) : src;

  return (
    <img
      className={className}
      src={srcString}
      alt={alt}
      onLoad={(e) =>
        onLoadingComplete && onLoadingComplete(e.target as HTMLImageElement)
      }
      sizes={sizes}
      srcSet={getSrcset()}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export default Image;
