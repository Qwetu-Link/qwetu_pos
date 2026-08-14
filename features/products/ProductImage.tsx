"use client";

import { useState, type ImgHTMLAttributes } from "react";

export const PRODUCT_IMAGE_PLACEHOLDER = "/placeholder.png";

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | { src?: string } | null;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
};

function resolveImageSrc(src?: ProductImageProps["src"]) {
  if (!src) return PRODUCT_IMAGE_PLACEHOLDER;
  if (typeof src === "string") return src;
  return src.src ?? PRODUCT_IMAGE_PLACEHOLDER;
}

export default function ProductImage({
  src,
  alt,
  onError,
  fill,
  priority,
  width,
  height,
  style,
  className,
  sizes: _sizes,
  unoptimized: _unoptimized,
  ...props
}: ProductImageProps) {
  const imageSrc = resolveImageSrc(src);
  const [failedSrc, setFailedSrc] = useState<ProductImageProps["src"]>(null);
  const resolvedSrc =
    resolveImageSrc(failedSrc) === imageSrc ? PRODUCT_IMAGE_PLACEHOLDER : imageSrc;

  return (
    // Product photos are already processed and stored externally, so a native
    // image avoids Next image optimizer allowlist/runtime failures.
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      loading={priority ? "eager" : props.loading}
      decoding="async"
      className={className}
      style={{
        ...style,
        ...(fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }
          : null),
      }}
      onError={(event) => {
        if (resolvedSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
          setFailedSrc(imageSrc);
        }
        onError?.(event);
      }}
    />
  );
}
