import { auth } from "@/auth";
import { getProductByIdQuery } from "@/db/queries/product";
import type { ProductImageUpload } from "@/services/processImg";
import { uploadProductImages } from "@/services/imageOperations";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400, code = "PRODUCT_IMAGE_UPLOAD_FAILED") {
  return NextResponse.json({ code, message }, { status });
}

function getUploadErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Could not upload the product images.";

  if (message.includes("Supabase storage is not configured")) {
    return {
      status: 503,
      code: "IMAGE_STORAGE_NOT_CONFIGURED",
      message: "Image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  if (
    message.includes("Only JPG, PNG, and WEBP") ||
    message.includes("Only JPEG, PNG, and WEBP") ||
    message.includes("HEIC/HEIF images are not supported")
  ) {
    return {
      status: 415,
      code: "UNSUPPORTED_IMAGE_TYPE",
      message,
    };
  }

  if (message.includes("5MB or smaller")) {
    return {
      status: 413,
      code: "IMAGE_FILE_TOO_LARGE",
      message,
    };
  }

  if (
    message.includes("Could not read image dimensions") ||
    message.includes("between 200x200 and 6000x6000")
  ) {
    return {
      status: 422,
      code: "INVALID_IMAGE_DIMENSIONS",
      message,
    };
  }

  if (
    message.includes("Image storage upload failed") ||
    message.includes("Bucket not found") ||
    message.includes("The resource already exists") ||
    message.includes("new row violates row-level security")
  ) {
    return {
      status: 502,
      code: "IMAGE_STORAGE_UPLOAD_FAILED",
      message,
    };
  }

  return {
    status: 400,
    code: "PRODUCT_IMAGE_UPLOAD_FAILED",
    message,
  };
}

export async function POST(request: Request) {
  const session = await auth();
  const businessId = session?.user?.businessId;

  if (!businessId) {
    return jsonError("You must be signed in to upload product images.", 401, "UNAUTHORIZED_IMAGE_UPLOAD");
  }

  try {
    const formData = await request.formData();
    const productId = formData.get("productId");
    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File);
    const variantIds = formData.getAll("variantIds").map((value) => value.toString());

    if (typeof productId !== "string" || productId.trim().length === 0) {
      return jsonError("Product id is required.", 400, "PRODUCT_ID_REQUIRED");
    }

    if (files.length === 0) {
      return jsonError("Select at least one product image.", 400, "NO_IMAGE_SELECTED");
    }

    const product = await getProductByIdQuery({
      id: productId,
      businessId,
    });

    if (!product) {
      return jsonError("Product not found for this business.", 404, "PRODUCT_NOT_FOUND_FOR_IMAGE_UPLOAD");
    }

    const uploads: (ProductImageUpload & { variantId?: string | null })[] = await Promise.all(
      files.map(async (file, index) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
          buffer,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size,
          variantId: variantIds[index] || null,
        };
      }),
    );

    const uploaded = await uploadProductImages(uploads, productId, businessId);
    const images = uploaded.map((image, index) => ({
      ...image,
      variantId: variantIds[index] || null,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    const response = getUploadErrorResponse(error);
    return jsonError(response.message, response.status, response.code);
  }
}
