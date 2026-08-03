"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product, ProductImage, ProductVariant } from "@/types/catalog";
import ProductImageWithFallback from "./ProductImage";
import {
  formatCurrency,
  getProductImageSrc,
  getProductTotalStock,
  getProductUniqueSizes,
} from "@/utils/catalog-utils";

function priceRange(variants: ProductVariant[]) {
  if (variants.length === 0) return "No pricing";
  const prices = variants.map((variant) => variant.sellPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

function marginRange(variants: ProductVariant[]) {
  if (variants.length === 0) return "No margin";
  const margins = variants.map((variant) => variant.sellPrice - variant.buyPrice);
  const min = Math.min(...margins);
  const max = Math.max(...margins);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export default function ProductDetailsPage({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const totalStock = getProductTotalStock(product);
  const sizes = getProductUniqueSizes(product);
  const selectedVariant = useMemo(
    () =>
      selectedVariantId
        ? product.variants.find((variant) => variant.id === selectedVariantId) ?? null
        : null,
    [product.variants, selectedVariantId],
  );
  const imageDetails = useMemo<ProductImage[]>(
    () =>
      product.imageDetails?.length
        ? product.imageDetails
        : (product.images?.length ? product.images : [getProductImageSrc(product)]).map(
          (url, index) => ({
            id: `${url}-${index}`,
            url,
            variantId: null,
            alt: product.name,
          }),
        ),
    [product],
  );
  const productLevelImages = imageDetails
    .filter((image) => !image.variantId)
    .map((image) => image.url);
  const selectedVariantImages = selectedVariant
    ? imageDetails
      .filter((image) => image.variantId === selectedVariant.id)
      .map((image) => image.url)
    : [];
  const images = selectedVariantImages.length
    ? selectedVariantImages
    : productLevelImages.length
      ? productLevelImages
      : [getProductImageSrc(product)];
  const selectedVariantIndex = Math.max(
    0,
    product.variants.findIndex((variant) => variant.id === selectedVariant?.id),
  );
  const showCompactVariants = product.variants.length <= 3;
  const showExpandedVariants = product.variants.length > 3;
  const lowStockVariants = product.variants.filter(
    (variant) => variant.inventory.status !== "healthy",
  ).length;
  const selectedImage = images[selectedImageIndex] ?? images[0];
  const selectedImageDetail = imageDetails.find((image) => image.url === selectedImage);

  function getImageVariant(image: { variantId?: string | null }) {
    return product.variants.find((variant) => variant.id === image.variantId) ?? null;
  }

  useEffect(() => {
    if (product.variants.length <= 3) return;

    const interval = window.setInterval(() => {
      setSelectedVariantId((currentId) => {
        const currentIndex = product.variants.findIndex((variant) => variant.id === currentId);
        const nextIndex = (Math.max(0, currentIndex) + 1) % product.variants.length;
        setSelectedImageIndex(0);
        return product.variants[nextIndex]?.id ?? currentId;
      });
    }, 3500);

    return () => window.clearInterval(interval);
  }, [images.length, product.variants]);

  function selectVariant(variant: ProductVariant) {
    setSelectedVariantId(variant.id);
    setSelectedImageIndex(0);
  }

  function selectGalleryImage(image: { url: string; variantId?: string | null }) {
    const imageVariant = getImageVariant(image);

    if (imageVariant) {
      const variantImages = imageDetails
        .filter((item) => item.variantId === imageVariant.id)
        .map((item) => item.url);

      setSelectedVariantId(imageVariant.id);
      setSelectedImageIndex(Math.max(0, variantImages.findIndex((url) => url === image.url)));
      return;
    }

    setSelectedVariantId("");
    setSelectedImageIndex(Math.max(0, productLevelImages.findIndex((url) => url === image.url)));
  }

  function getVariantImage(variant: ProductVariant, index: number) {
    return (
      imageDetails.find((image) => image.variantId === variant.id)?.url ??
      productLevelImages[index % productLevelImages.length] ??
      images[0]
    );
  }

  function selectSize(size: string) {
    const sameColorVariant = product.variants.find(
      (variant) => variant.size === size && variant.color === selectedVariant?.color,
    );
    const nextVariant = sameColorVariant ?? product.variants.find((variant) => variant.size === size);
    if (nextVariant) {
      selectVariant(nextVariant);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <section className="grid gap-8 bg-white lg:grid-cols-[minmax(0,52%)_minmax(360px,1fr)]">
        <div className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
            {imageDetails.map((image, index) => {
              const imageVariant = getImageVariant(image);
              const isSelectedImage =
                image.url === selectedImage &&
                (imageVariant?.id ?? "") === (selectedVariant?.id ?? "");

              return (
              <button
                type="button"
                onClick={() => selectGalleryImage(image)}
                key={image.id}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border bg-slate-100 shadow-sm ${isSelectedImage ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"
                  }`}
                aria-label={
                  imageVariant
                    ? `View ${imageVariant.color} ${imageVariant.size} image ${index + 1}`
                    : `View general product image ${index + 1}`
                }
              >
                <ProductImageWithFallback
                  src={image.url}
                  alt={image.alt ?? product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!imageVariant ? (
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    Gen
                  </span>
                ) : null}
              </button>
              );
            })}
            {imageDetails.length === 0 ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400">
                <ImageIcon className="h-5 w-5" />
              </div>
            ) : null}
          </div>

          <div className="order-1 flex items-center justify-center overflow-visible bg-slate-50 p-4 sm:order-2">
            <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center">
              <ProductImageWithFallback
                src={selectedImage}
                alt={selectedImageDetail?.alt ?? product.name}
                width={520}
                height={720}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="h-auto w-full object-contain"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>

        <aside className="min-w-0 lg:pr-4">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <Tag className="h-3.5 w-3.5" />
                {product.category}
              </span>
              {lowStockVariants > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {lowStockVariants} stock alert{lowStockVariants === 1 ? "" : "s"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Stock healthy
                </span>
              )}
            </div>
            <h1 className="mt-4 text-4xl font-normal leading-tight tracking-tight text-slate-700">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="font-semibold text-slate-700">{product.brand || "No supplier"}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{product.variants.length} variant{product.variants.length === 1 ? "" : "s"}</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-slate-950">
                {selectedVariant ? `${selectedVariant.inventory.totalStock} selected units` : `${totalStock} units in stock`}
              </span>
            </div>
          </div>

          <div className="space-y-5 py-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">Unit price</p>
              <p className="mt-1 text-4xl font-normal tracking-tight text-slate-950">
                {selectedVariant ? formatCurrency(selectedVariant.sellPrice) : priceRange(product.variants)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {selectedVariant ? (
                  <>
                    Buy price: <span className="font-semibold text-slate-800">{formatCurrency(selectedVariant.buyPrice)}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    Margin: <span className="font-semibold text-slate-800">{formatCurrency(selectedVariant.sellPrice - selectedVariant.buyPrice)}</span>
                  </>
                ) : (
                  <>
                    Margin range: <span className="font-semibold text-slate-800">{marginRange(product.variants)}</span>
                  </>
                )}
              </p>
            </div>

            <div className="rounded-none border-y border-slate-200 py-4">
              <p className="text-sm text-slate-500">
                {product.description || "No product description has been added."}
              </p>
            </div>

            <div>
              <p className="text-base text-slate-500">
                Color: <span className="font-bold text-slate-950">{selectedVariant?.color ?? "Not set"}</span>
              </p>
              {showCompactVariants ? (
                <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-3">
                  {product.variants.map((variant, index) => (
                    <VariantOptionCard
                      key={variant.id}
                      variant={variant}
                      index={index}
                      image={getVariantImage(variant, index)}
                      isSelected={variant.id === selectedVariant?.id}
                      onSelect={selectVariant}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-base text-slate-500">
                Size: <span className="font-bold text-slate-950">{selectedVariant?.size ?? "Not set"}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.length === 0 ? (
                  <span className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-500">
                    No sizes
                  </span>
                ) : (
                  sizes.map((size) => (
                    <button
                      type="button"
                      onClick={() => selectSize(size)}
                      key={size}
                      className={`rounded-xl border px-4 py-2 text-base text-slate-950 ${size === selectedVariant?.size ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-300"
                        }`}
                    >
                      {size}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoBlock label="SKU" value={selectedVariant?.sku ?? "No SKU"} />
              <InfoBlock label="Stock" value={selectedVariant ? `${selectedVariant.inventory.totalStock} units` : `${totalStock} units`} />
              <InfoBlock label="Status" value={selectedVariant?.inventory.status ?? "No status"} />
            </div>
            {selectedVariant ? (
              <p className="text-xs font-medium text-slate-500">
                Selected variant {selectedVariantIndex + 1} of {product.variants.length}
              </p>
            ) : null}
          </div>
        </aside>

      </section>

      {showExpandedVariants ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Product variants</h2>
              <p className="mt-1 text-sm text-slate-500">
                Color: <span className="font-bold text-slate-950">{selectedVariant?.color ?? "Not set"}</span>
              </p>
            </div>
            {selectedVariant ? (
              <p className="text-sm font-semibold text-slate-500">
                {selectedVariant.inventory.totalStock} units available
              </p>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {product.variants.map((variant, index) => (
              <VariantOptionCard
                key={variant.id}
                variant={variant}
                index={index}
                image={getVariantImage(variant, index)}
                isSelected={variant.id === selectedVariant?.id}
                onSelect={selectVariant}
                wide
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function VariantOptionCard({
  variant,
  index,
  image,
  isSelected,
  onSelect,
  wide = false,
}: {
  variant: ProductVariant;
  index: number;
  image: string;
  isSelected: boolean;
  onSelect: (variant: ProductVariant, index: number) => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(variant, index)}
      className={`rounded-xl border bg-white p-2 text-left transition ${wide ? "min-h-[154px]" : "min-h-[132px]"} ${isSelected
        ? "border-blue-600 ring-2 ring-blue-100"
        : "border-slate-300 hover:border-slate-500"
        }`}
      aria-label={`Select ${variant.color} ${variant.size}`}
    >
      <div className={`relative mx-auto overflow-hidden rounded-lg bg-slate-100 ${wide ? "h-20 w-20" : "h-16 w-16"}`}>
        <ProductImageWithFallback
          src={image}
          alt={variant.sku}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-slate-950">
        {formatCurrency(variant.sellPrice)}
      </p>
      <p className="mt-1 text-xs text-slate-500">{variant.color}</p>
      <p className="mt-1 text-xs font-semibold text-slate-700">{variant.size}</p>
      {wide ? (
        <p className="mt-2 text-xs font-semibold capitalize text-slate-500">
          {variant.inventory.totalStock} units | {variant.inventory.status}
        </p>
      ) : null}
    </button>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">{value}</p>
    </div>
  );
}
