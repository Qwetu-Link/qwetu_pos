"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";
import ProductModal from "@/features/forms/ProductModal";
import { uploadProductImagesFromFiles } from "@/features/products/uploadProductImages";
import type { Category } from "@/types/admin/categories";
import type { Product, ProductSaveValues } from "@/types/admin/catalog";
import {
  useRemoveProductImages,
  useSaveUploadedProductImages,
  useUpdateProduct,
} from "@/hooks/useProduct";
import { isOfflineQueuedResult } from "@/hooks/useOfflineMutation";
import { useState } from "react";

const productToastStyles = {
  updated: {
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    color: "#1e40af",
  },
} as const;

function getImageErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not update the product images.";
}

function getProductUpdateErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "The product details could not be updated.";
  return `Product was not updated. ${message}`;
}

export default function EditProductPage({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const updateProduct = useUpdateProduct();
  const removeProductImages = useRemoveProductImages();
  const saveUploadedProductImages = useSaveUploadedProductImages();
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const isSaving =
    updateProduct.isPending ||
    saveUploadedProductImages.isPending ||
    removeProductImages.isPending ||
    isUploadingImages;
  const mutationError =
    uploadError ||
    saveUploadedProductImages.error?.message ||
    updateProduct.error?.message ||
    removeProductImages.error?.message;

  async function handleSaveProduct(values: ProductSaveValues, existingId?: string) {
    if (!existingId) return;
    setUploadError("");

    try {
      const updatedProduct = await updateProduct.mutateAsync({
        id: existingId,
        name: values.name,
        categoryId: values.categoryId,
        brand: values.brand,
        description: values.description,
        imageAssignments: values.imageAssignments,
      });

      if (isOfflineQueuedResult(updatedProduct)) {
        toast.info("Product update saved offline. Image changes can be applied after it syncs online.");
        router.push(`/admin/products/${existingId}`);
        return;
      }

      const imageFiles = values.imageFiles ?? [];
      if (imageFiles.length > 0) {
        setIsUploadingImages(true);
        const uploadedImages = await uploadProductImagesFromFiles({
          productId: existingId,
          images: imageFiles.map((image) => ({
            file: image.file,
            variantId: image.variantId,
          })),
        }).catch((error) => {
          const message = getImageErrorMessage(error);
          setUploadError(message);
          toast.warning(`Product details updated, but image upload failed. ${message}`);
          router.push(`/admin/products/${existingId}`);
          return null;
        });

        if (!uploadedImages) {
          return;
        }

        const savedImages = await saveUploadedProductImages.mutateAsync({
          productId: existingId,
          mode: values.replaceImages ? "replace" : "append",
          images: uploadedImages,
        }).catch((error) => {
          const message = getImageErrorMessage(error);
          setUploadError(message);
          toast.warning(`Product details updated and image files uploaded, but image records were not saved. ${message}`);
          router.push(`/admin/products/${existingId}`);
          return null;
        });

        if (!savedImages) {
          return;
        }
      }

      if (!values.replaceImages && values.removedImageUrls?.length) {
        const removedImages = await removeProductImages.mutateAsync({
          productId: existingId,
          imageUrls: values.removedImageUrls,
        }).catch((error) => {
          const message = getImageErrorMessage(error);
          setUploadError(message);
          toast.warning(`Product details updated, but selected image removal failed. ${message}`);
          router.push(`/admin/products/${existingId}`);
          return null;
        });

        if (!removedImages) {
          return;
        }
      }

      toast.success("Product updated successfully.", {
        style: productToastStyles.updated,
      });
      router.push(`/admin/products/${existingId}`);
    } catch (error) {
      const message = getProductUpdateErrorMessage(error);
      setUploadError(message);
      toast.error(message);
    } finally {
      setIsUploadingImages(false);
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
