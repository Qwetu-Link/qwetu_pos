"use client";

export type ProductImageFileUpload = {
  file: File;
  variantId?: string | null;
};

export async function uploadProductImagesFromFiles({
  productId,
  images,
}: {
  productId: string;
  images: ProductImageFileUpload[];
}) {
  if (images.length === 0) {
    return [];
  }

  const formData = new FormData();
  formData.append("productId", productId);

  for (const image of images) {
    formData.append("images", image.file, image.file.name);
    formData.append("variantIds", image.variantId ?? "");
  }

  const response = await fetch("/api/products/upload-image", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Could not upload the product images.");
  }

  return payload?.images ?? [];
}
