"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const PRODUCT_IMAGE_PLACEHOLDER = "/placeholder.png";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"] | null;
};

export default function ProductImage({
  src,
  alt,
  onError,
  ...props
}: ProductImageProps) {
  const imageSrc = src || PRODUCT_IMAGE_PLACEHOLDER;
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const resolvedSrc = failedSrc === imageSrc ? PRODUCT_IMAGE_PLACEHOLDER : imageSrc;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        if (resolvedSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
          setFailedSrc(imageSrc);
        }
        onError?.(event);
      }}
    />
  );
}
