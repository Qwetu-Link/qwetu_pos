"use client";

import { useEffect, useRef, useState } from "react";
import AddVariantModal from "./AddVariantModal";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Category } from "@/types/categories";
import type { Product, ProductSaveValues, ProductVariant } from "@/types/catalog";
import {
  buildVariant,
  getProductImageSrc,
  hasVariantOption,
} from "@/utils/catalog-utils";
import {
  AlertTriangle,
  ArrowRight,
  Edit,
  ImagePlus,
  Plus,
  Puzzle,
  Save,
  Trash2,
} from "lucide-react";
import { ProductDetailsFormValues, productSchema } from "@/validators/product";
import { VariantFormValues } from "@/validators/variant";

interface Props {
  product: Product | null;
  categories: Category[];
  isSaving?: boolean;
  mode?: "modal" | "page";
  onSave: (data: ProductSaveValues, existingId?: string) => void;
  onClose: () => void;
}

type ImageDraft = {
  id: string;
  dataUrl: string;
  name: string;
};

function isRenderableImage(src: string) {
  return src.startsWith("http") || src.startsWith("data:image") || src.startsWith("/");
}

export default function ProductModal({
  product,
  categories,
  isSaving = false,
  mode = "modal",
  onSave,
  onClose,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const fallbackCategoryId = product?.categoryId ?? categories[0]?.id ?? "";
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<ProductDetailsFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      categoryId: fallbackCategoryId,
      brand: product?.brand ?? "",
      description: product?.description ?? "",
    },
  });
  const name = useWatch({ control, name: "name" });
  const categoryId = useWatch({ control, name: "categoryId" });
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? product?.category ?? "";
  const [imageDrafts, setImageDrafts] = useState<ImageDraft[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product ? JSON.parse(JSON.stringify(product.variants)) : [],
  );
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const existingImages = (
    product?.images?.length
      ? product.images
      : product
        ? [getProductImageSrc(product)]
        : []
  ).filter(isRenderableImage);

  useEffect(() => {
    if (mode !== "modal") return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mode]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAlertMessage("");
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      setAlertMessage("Please select image files only.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > 2 * 1024 * 1024);
    if (oversizedFile) {
      setAlertMessage("Each image must be under 2MB.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result !== "string") return;

        setImageDrafts((prev) => [
          ...prev,
          {
            id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
            dataUrl: result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function goToStep2() {
    setStep(2);
  }

  function handleAddVariant(values: VariantFormValues) {
    if (hasVariantOption(variants, values)) {
      setAlertMessage("This product already has a variant with that color and size.");
      setShowAddVariant(false);
      return;
    }

    const variant = buildVariant(name, values, variants);
    setVariants((prev) => [...prev, variant]);
    setAlertMessage("");
    setShowAddVariant(false);
  }

  function handleDeleteVariant(idx: number) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (variants.length === 0) {
      setAlertMessage("Please add at least one variant before saving this product.");
      return;
    }

    const values = getValues();

    onSave(
      {
        ...values,
        imagesData: imageDrafts.map((image) => image.dataUrl),
        variants,
      },
      product?.id,
    );
  }

  const formContent = (
    <>
      <div className={mode === "modal" ? "bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-auto" : "bg-white rounded-2xl border border-gray-100 shadow-sm"}>
          <div className={`${mode === "modal" ? "sticky top-0 rounded-t-2xl" : "rounded-t-2xl"} bg-white border-b border-gray-100 px-6 py-5 flex justify-between items-center z-10`}>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {product ? <Edit /> : <Plus />}
              {product ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              x
            </button>
          </div>

          <div className="p-6">
            {alertMessage ? (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{alertMessage}</span>
              </div>
            ) : null}

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step === 1
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className={`text-sm font-medium ${step === 1 ? "text-gray-800" : "text-gray-400"}`}>
                Product Info
              </span>
              <div className="w-8 h-px bg-gray-300" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step === 2
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${step === 2 ? "text-gray-800" : "text-gray-400"}`}>
                Variants
              </span>
            </div>

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Classic Oxford Shirt"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
                    />
                    {errors.name ? (
                      <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("categoryId")}
                      disabled={categories.length === 0}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none text-black disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {categories.length === 0 ? (
                        <option value="">Create a category first</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.categoryId ? (
                      <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Supplier / Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("brand")}
                      placeholder="e.g. Fashion Hub Ltd"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
                    />
                    {errors.brand ? (
                      <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Product details, features, care instructions..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-black placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Product Images</h4>
                      <p className="text-xs text-gray-500">
                        Add one image or select multiple images for the product gallery.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                      <ImagePlus size={16} />
                      Add Images
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  {existingImages.length === 0 && imageDrafts.length === 0 ? (
                    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-center">
                      <ImagePlus className="mb-2 text-gray-400" size={30} />
                      <p className="text-sm font-medium text-gray-600">No images selected</p>
                      <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP up to 2MB each</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {existingImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white"
                        >
                          <Image
                            src={image}
                            alt={`${product?.name ?? "Product"} image ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                            Saved
                          </span>
                        </div>
                      ))}
                      {imageDrafts.map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-square overflow-hidden rounded-xl border border-emerald-200 bg-white"
                        >
                          <Image
                            src={image.dataUrl}
                            alt={image.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImageDrafts((prev) => prev.filter((item) => item.id !== image.id))
                            }
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"
                            aria-label={`Remove ${image.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                            New
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit(goToStep2)}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Next: Add Variants <ArrowRight size={16} />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-gray-800">Product Variants</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddVariant(true)}
                    className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition flex items-center gap-1"
                  >
                    <Plus /> Add Variant
                  </button>
                </div>

                <div className="border rounded-xl bg-gray-50 p-3 max-h-96 overflow-y-auto space-y-3">
                  {variants.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Puzzle size={32} className="mx-auto mb-2" />
                      <p>No variants yet.</p>
                      <p className="mt-1 text-sm">
                        Add at least one size, color, and SKU before saving this product.
                      </p>
                    </div>
                  ) : (
                    variants.map((variant, idx) => (
                      <div
                        key={variant.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3"
                      >
                        <div className="space-y-1">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {variant.sku}
                          </span>
                          <div className="font-medium text-gray-800 text-sm">
                            {variant.color} / {variant.size}
                          </div>
                          <div className="text-xs text-gray-500">
                            Buy: KES {variant.buyPrice} · Sell: KES {variant.sellPrice} ·
                            Stock: {variant.inventory.totalStock}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(idx)}
                          className="text-red-500 flex items-center justify-center gap-1 hover:text-red-700 text-sm px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSaving}
                    className="px-6 py-2.5 border border-gray-300 text-black rounded-xl font-medium hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleSave)}
                    disabled={isSaving || categories.length === 0}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save /> {isSaving ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      {showAddVariant && (
        <AddVariantModal
          productName={name}
          category={selectedCategoryName}
          onAdd={handleAddVariant}
          onClose={() => setShowAddVariant(false)}
        />
      )}
    </>
  );

  if (mode === "page") {
    return formContent;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      {formContent}
    </div>
  );
}
