"use client";

import ProductModal from "@/features/forms/ProductModal";
import { useCreateProduct } from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import type { ProductSaveValues } from "@/types/catalog";
import { buildVariantCreateInputs } from "@/utils/catalog-utils";
import { ArrowLeft, Loader2, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const productToastStyle = {
  background: "#dcfce7",
  border: "1px solid #86efac",
  color: "#166534",
} as const;

export default function AddProductPage() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories, isError, error } = useGetCategories();
  const createProduct = useCreateProduct();

  async function handleSaveProduct(values: ProductSaveValues) {
    try {
      await createProduct.mutateAsync({
        name: values.name,
        categoryId: values.categoryId,
        brand: values.brand,
        description: values.description,
        imagesData: values.imagesData,
        variants: buildVariantCreateInputs(values.name, values.variants),
      });

      toast.success("Product created successfully.", {
        style: productToastStyle,
      });
      router.push("/admin/products");
    } catch {
      // Mutation state exposes the error message below.
    }
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

      {(isError || createProduct.error) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {createProduct.error?.message || error?.message || "Could not load product setup data."}
        </div>
      )}

      {isLoadingCategories ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
          <Loader2 className="mr-2 animate-spin text-emerald-600" size={18} />
          Loading product categories...
        </div>
      ) : (
        <ProductModal
          mode="page"
          product={null}
          categories={categories}
          isSaving={createProduct.isPending}
          onSave={(values) => {
            void handleSaveProduct(values);
          }}
          onClose={() => router.push("/admin/products")}
        />
      )}
    </div>
  );
}
