import { auth } from "@/auth";
import { getProductByIdQuery } from "@/db/queries/product";
import type { ProductImageUpload } from "@/services/processImg";
import { uploadProductImages } from "@/services/imageOperations";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not upload the product images.";
}

export async function POST(request: Request) {
  const session = await auth();
  const businessId = session?.user?.businessId;

  if (!businessId) {
    return jsonError("You must be signed in to upload product images.", 401);
  }

  try {
    const formData = await request.formData();
    const productId = formData.get("productId");
    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File);
    const variantIds = formData.getAll("variantIds").map((value) => value.toString());

    if (typeof productId !== "string" || productId.trim().length === 0) {
      return jsonError("Product id is required.");
    }

    if (files.length === 0) {
      return jsonError("Select at least one product image.");
    }

    const product = await getProductByIdQuery({
      id: productId,
      businessId,
    });

    if (!product) {
      return jsonError("Product not found for this business.", 404);
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
    return jsonError(getErrorMessage(error), 400);
  }
}
