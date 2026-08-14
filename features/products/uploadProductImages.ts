"use client";

export type ProductImageFileUpload = {
  file: File;
  variantId?: string | null;
};

export class ProductImageUploadError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ProductImageUploadError";
    this.status = status;
    this.code = code;
  }
}

function getUploadFailureMessage(status: number, payload: unknown) {
  const message =
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
      ? payload.message
      : "";

  if (message) {
    return message;
  }

  if (status === 401) return "You must be signed in before uploading product images.";
  if (status === 404) return "The product was saved, but it could not be found for image upload.";
  if (status === 413) return "One or more product images are too large.";
  if (status === 415) return "One or more product images use an unsupported file type.";
  if (status >= 500) return "The image storage service failed while uploading images.";

  return "The image upload request failed.";
}

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
    const code =
      typeof payload === "object" &&
      payload !== null &&
      "code" in payload &&
      typeof payload.code === "string"
        ? payload.code
        : undefined;

    throw new ProductImageUploadError(
      getUploadFailureMessage(response.status, payload),
      response.status,
      code,
    );
  }

  if (!payload || !Array.isArray(payload.images)) {
    throw new ProductImageUploadError(
      "The image upload completed, but the server did not return image metadata.",
      502,
      "INVALID_UPLOAD_RESPONSE",
    );
  }

  return payload.images;
}
