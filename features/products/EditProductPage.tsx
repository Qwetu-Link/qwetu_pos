"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";
import ProductModal from "@/features/forms/ProductModal";
import type { Category } from "@/types/categories";
import type { Product, ProductSaveValues } from "@/types/catalog";
import {
  useRemoveProductImages,
  useReplaceProductImages,
  useUpdateProduct,
  useUploadProductImage,
} from "@/hooks/useProduct";

const productToastStyles = {
  updated: {
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    color: "#1e40af",
  },
} as const;

export default function EditProductPage({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const updateProduct = useUpdateProduct();
  const uploadProductImage = useUploadProductImage();
  const replaceProductImages = useReplaceProductImages();
  const removeProductImages = useRemoveProductImages();
  const isSaving =
    updateProduct.isPending ||
    uploadProductImage.isPending ||
    replaceProductImages.isPending ||
    removeProductImages.isPending;
  const mutationError =
    updateProduct.error?.message ||
    uploadProductImage.error?.message ||
    replaceProductImages.error?.message ||
    removeProductImages.error?.message;

  async function handleSaveProduct(values: ProductSaveValues, existingId?: string) {
    if (!existingId) return;

    try {
      await updateProduct.mutateAsync({
        id: existingId,
        name: values.name,
        categoryId: values.categoryId,
        brand: values.brand,
        description: values.description,
        imageAssignments: values.imageAssignments,
      });

      if (values.imagesData.length > 0) {
        if (values.replaceImages) {
          await replaceProductImages.mutateAsync({
            productId: existingId,
            imagesData: values.imagesData,
            imageAttachments: values.imageAttachments,
          });
        } else {
          const imagesToUpload: { imageData: string; variantId?: string | null }[] =
            values.imageAttachments?.length
              ? values.imageAttachments
              : values.imagesData.map((imageData) => ({ imageData }));

          await Promise.all(
            imagesToUpload.map((image) =>
              uploadProductImage.mutateAsync({
                productId: existingId,
                imageData: image.imageData,
                variantId: image.variantId,
              }),
            ),
          );
        }
      }

      if (!values.replaceImages && values.removedImageUrls?.length) {
        await removeProductImages.mutateAsync({
          productId: existingId,
          imageUrls: values.removedImageUrls,
        });
      }

      toast.success("Product updated successfully.", {
        style: productToastStyles.updated,
      });
      router.push(`/admin/products/${existingId}`);
    } catch {
      // Mutation state exposes the error message in the page alert.
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <Link
          href={`/admin/products/${product.id}`}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to product details
        </Link>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-950">
          <Tag className="h-8 w-8 text-emerald-600" />
          Edit {product.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update product details, variants, and choose exactly which saved images to remove.
        </p>
      </div>

      {mutationError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {mutationError}
        </div>
      ) : null}

      <ProductModal
        product={product}
        categories={categories}
        isSaving={isSaving}
        mode="page"
        onSave={(values, existingId) => {
          void handleSaveProduct(values, existingId);
        }}
        onClose={() => {
          if (!isSaving) router.push(`/admin/products/${product.id}`);
        }}
      />
    </div>
  );
}
