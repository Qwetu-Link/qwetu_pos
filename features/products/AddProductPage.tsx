"use client";

import ProductModal from "@/features/forms/ProductModal";
import { uploadProductImagesFromFiles } from "@/features/products/uploadProductImages";
import { useCreateProduct, useSaveUploadedProductImages } from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import { isOfflineQueuedResult } from "@/hooks/useOfflineMutation";
import type { ProductSaveValues } from "@/types/catalog";
import { buildVariantCreateInputs } from "@/utils/catalog-utils";
import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const productToastStyle = {
  background: "#dcfce7",
  border: "1px solid #86efac",
  color: "#166534",
} as const;

function getImageErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not upload the product images.";
}

function getProductCreateErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "The product details could not be saved.";
  return `Product was not created. ${message}`;
}

export default function AddProductPage() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories, isError, error } = useGetCategories();
  const createProduct = useCreateProduct();
  const saveUploadedProductImages = useSaveUploadedProductImages();
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleSaveProduct(values: ProductSaveValues) {
    setUploadError("");

    try {
      const variants = buildVariantCreateInputs(values.name, values.variants).map((variant, index) => ({
        ...variant,
        clientId: values.variants[index]?.id,
      }));

      const product = await createProduct.mutateAsync({
        name: values.name,
        categoryId: values.categoryId,
        brand: values.brand,
        description: values.description,
        imagesData: [],
        imageAttachments: [],
        variants,
      });

      const imageFiles = values.imageFiles ?? [];
      if (isOfflineQueuedResult(product)) {
        toast.info("Product saved offline. Images can be uploaded after it syncs online.");
        router.push("/admin/products");
        return;
      }

      if (imageFiles.length > 0) {
        const variantIdsByClientId = new Map(
          product.variants.map((variant, index) => [values.variants[index]?.id, variant.id]),
        );

        setIsUploadingImages(true);
        const uploadedImages = await uploadProductImagesFromFiles({
          productId: product.id,
          images: imageFiles.map((image) => ({
            file: image.file,
            variantId: image.variantId ? variantIdsByClientId.get(image.variantId) ?? null : null,
          })),
        }).catch((error) => {
          const message = getImageErrorMessage(error);
          setUploadError(message);
          toast.warning(`Product created, but image upload failed. ${message}`);
          router.push(`/admin/products/${product.id}/edit`);
          return null;
        });

        if (!uploadedImages) {
          return;
        }

        const savedImages = await saveUploadedProductImages.mutateAsync({
          productId: product.id,
          mode: "append",
          images: uploadedImages,
        }).catch((error) => {
          const message = getImageErrorMessage(error);
          setUploadError(message);
          toast.warning(`Product created and image files uploaded, but image records were not saved. ${message}`);
          router.push(`/admin/products/${product.id}/edit`);
          return null;
        });

        if (!savedImages) {
          return;
        }
      }

      toast.success("Product created successfully.", {
        style: productToastStyle,
      });
      router.push("/admin/products");
    } catch (error) {
      const message = getProductCreateErrorMessage(error);
      setUploadError(message);
      toast.error(message);
    } finally {
      setIsUploadingImages(false);
    }
  }

  if (isLoadingCategories) {
    return null;
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            <PackagePlus size={28} className="text-emerald-600" />
            Add Product
          </h1>
          <p className="text-gray-500 mt-1">
            Create the product record, upload images, and add its first variants.
          </p>
        </div>
      </div>

      {(isError || createProduct.error || saveUploadedProductImages.error || uploadError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {uploadError || saveUploadedProductImages.error?.message || createProduct.error?.message || error?.message || "Could not load product setup data."}
        </div>
      )}

      <ProductModal
        mode="page"
        product={null}
        categories={categories}
        isSaving={createProduct.isPending || saveUploadedProductImages.isPending || isUploadingImages}
        onSave={(values) => {
          void handleSaveProduct(values);
        }}
        onClose={() => router.push("/admin/products")}
      />
    </div>
  );
}
