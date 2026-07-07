"use client";

import { useState, useRef, useEffect } from "react";
import AddVariantModal from "./AddVariantModal";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Product,
  ProductVariant,
} from "@/types/catalog";
import { buildVariant, getProductImageSrc } from "@/utils/catalog-utils";
import { AlertTriangle, ArrowRight, Edit, Plus, Puzzle, Save, Trash2 } from "lucide-react";
import { ProductDetailsFormValues, productSchema } from "@/validators/product";
import { CATEGORIES } from "@/utils/select";
import { VariantFormValues } from "@/validators/variant";


interface Props {
  product: Product | null; // null = new product
  onSave: (data: Omit<Product, "id">, existingId?: string) => void;
  onClose: () => void;
}

export default function ProductModal({ product, onSave, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
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
      category: product?.category ?? "Men's Clothing",
      brand: product?.brand ?? "",
      description: product?.description ?? "",
    },
  });
  const name = useWatch({ control, name: "name" });
  const category = useWatch({ control, name: "category" });
  const [imagePreview, setImagePreview] = useState<string | null>(
    product ? getProductImageSrc(product) : null,
  );
  const [imageData, setImageData] = useState<string | null>(
    product?.imageData ?? null,
  );
  const [imageUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product ? JSON.parse(JSON.stringify(product.variants)) : [],
  );
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAlertMessage("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAlertMessage("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAlertMessage("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageData(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  function goToStep2() {
    setStep(2);
  }

  function handleAddVariant(values: VariantFormValues) {
    const variant = buildVariant(name, values);
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
        imageData: imageData ?? undefined,
        imageUrl: !imageData ? (imageUrl ?? undefined) : undefined,
        variants,
      },
      product?.id,
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8 px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 rounded-t-2xl flex justify-between items-center z-10">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {product ? <Edit /> : <Plus />}{" "}
              {product ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            {alertMessage ? (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{alertMessage}</span>
              </div>
            ) : null}

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === 1
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-700"
                  }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span
                className={`text-sm font-medium ${step === 1 ? "text-gray-800" : "text-gray-400"}`}
              >
                Product Info
              </span>
              <div className="w-8 h-px bg-gray-300" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === 2
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${step === 2 ? "text-gray-800" : "text-gray-400"}`}
              >
                Variants
              </span>
            </div>

            {/* ---- STEP 1 ---- */}
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
                      {...register("category")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none text-black placeholder:text-gray-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
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

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Product Image{" "}
                      <span className="text-emerald-600">(Upload)</span>
                    </label>
                    {imagePreview ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Image selected
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setImageData(null);
                              setImagePreview(null);
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                            className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center justify-center gap-1"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl p-6 transition-colors">
                        <span className="text-3xl mb-2">☁️</span>
                        <p className="text-sm text-gray-600">
                          Click or drag to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG, WEBP up to 2MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Product details, features, care instructions..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text text-black placeholder:text-gray-500"
                  />
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

            {/* ---- STEP 2 ---- */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-gray-800">
                    Product Variants
                  </h4>
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
                    variants.map((v, idx) => (
                      <div
                        key={v.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3"
                      >
                        <div className="space-y-1">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {v.sku}
                          </span>
                          <div className="font-medium text-gray-800 text-sm">
                            {v.color} / {v.size}
                          </div>
                          <div className="text-xs text-gray-500">
                            Buy: KES {v.buyPrice} · Sell: KES {v.sellPrice} ·
                            Stock: {v.inventory.totalStock}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteVariant(idx)}
                          className="text-red-500 w-30 flex items-center justify-center gap-1 hover:text-red-700 text-sm px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition"
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
                    className="px-6 py-2.5 border border-gray-300 text-black rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleSave)}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                  >
                    <Save /> Save Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddVariant && (
        <AddVariantModal
          productName={name}
          category={category}
          onAdd={handleAddVariant}
          onClose={() => setShowAddVariant(false)}
        />
      )}
    </>
  );
}

