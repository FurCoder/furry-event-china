import imageLoader from "@/utils/imageLoader";

/* eslint-disable @next/next/no-img-element */
function Image({
  id,
  src,
  alt,
  sizes,
  className,
  containerClassName,
  onLoadingComplete,
  quality,
  width,
  height,
  priority,
  autoFormat,
  fallbackWidth,
  fallbackHeight,
}: {
  id?: string;
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  onLoadingComplete?: (img: HTMLImageElement) => void;
  quality?: number;
  width?: number;
  height?: number;
  fallbackWidth?: number;
  fallbackHeight?: number;
  priority?: boolean;
  autoFormat?: boolean;
}) {
  const srcString = imageLoader({
    src,
    quality,
    width: width || fallbackWidth,
    height: height || fallbackHeight,
  });

  return (
    <picture className={containerClassName}>
      {autoFormat && (
        <ImgSources
          avifsrcSet={getSrcset({
            src,
            quality,
            sizes,
            avif: true,
            width,
            height,
          })}
          webpsrcSet={getSrcset({
            src,
            quality,
            sizes,
            webp: true,
            width,
            height,
          })}
          sizes={sizes}
        />
      )}
      <img
        id={id}
        className={className}
        src={srcString}
        alt={alt}
        onLoad={(e) =>
          onLoadingComplete && onLoadingComplete(e.target as HTMLImageElement)
        }
        sizes={sizes}
        srcSet={getSrcset({ src, quality, sizes, width, height })}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

function ImgSources({
  avifsrcSet,
  webpsrcSet,
  sizes,
}: {
  avifsrcSet?: string;
  webpsrcSet?: string;
  sizes?: string;
}) {
  return (
    <>
      {avifsrcSet && (
        <source type="image/avif" srcSet={avifsrcSet} sizes={sizes} />
      )}
      {webpsrcSet && (
        <source type="image/webp" srcSet={webpsrcSet} sizes={sizes} />
      )}
    </>
  );
}

function getSrcset({
  src,
  quality,
  sizes,
  avif,
  webp,
  width,
  height,
}: {
  src: string;
  quality?: number;
  sizes?: string;
  width?: number;
  height?: number;
  avif?: boolean;
  webp?: boolean;
}) {
  const regex = /\b(\d+)px\b(?![^(]*\))/g;

  const sizesResult = Array.from(new Set(sizes?.match(regex)));

  if (sizesResult.length) {
    return sizesResult
      .map(
        (w) =>
          `${imageLoader({
            src,
            quality,
            width: parseInt(w),
            height,
            avif,
            webp,
          })} ${parseInt(w)}w`
      )
      .join(", ");
  } else {
    return imageLoader({
      src,
      quality,
      avif,
      webp,
      width,
      height,
    });
  }
}

export default Image;
