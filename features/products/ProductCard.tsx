"use client";

import Link from "next/link";
import { Product } from "@/types/admin/catalog";
import ProductImage from "./ProductImage";
import {
  getProductImageSrc,
  getProductTotalStock,
  getProductUniqueSizes,
} from "@/utils/catalog-utils";
import { AlertTriangle, Box, Edit, Eye, Trash2 } from "lucide-react";

interface Props {
  product: Product;
  onDelete: (id: string, name: string) => void;
}

export default function ProductCard({ product, onDelete }: Props) {
  const totalStock = getProductTotalStock(product);
  const uniqueSizes = getProductUniqueSizes(product);
  const isLowStock = totalStock <= 10;
  const imageSrc = getProductImageSrc(product);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-gray-100 sm:h-48">
        <ProductImage
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {isLowStock ? (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[11px] font-semibold text-white sm:text-xs">
            <AlertTriangle size={12} /> Low Stock
          </div>
        ) : null}
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="mr-2 line-clamp-2 flex-1 text-sm font-bold leading-tight text-gray-800 sm:text-base">
            {product.name}
          </h3>
          <div className="flex max-w-[42%] flex-wrap justify-end gap-1">
            {uniqueSizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 sm:text-xs"
              >
                {size}
              </span>
            ))}
            {uniqueSizes.length > 3 ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-400 sm:text-xs">
                +{uniqueSizes.length - 3}
              </span>
            ) : null}
          </div>
        </div>

        <p className="mb-3 truncate text-xs text-gray-500 sm:text-sm">
          {product.category}
          {product.brand ? ` - ${product.brand}` : ""}
        </p>

        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="flex items-center gap-1.5">
            <Box size={14} className="text-gray-400" />
            <span
              className={`text-xs font-medium sm:text-sm ${
                isLowStock ? "text-amber-600" : "text-gray-700"
              }`}
            >
              {totalStock} units
            </span>
          </div>
          <span className="text-[11px] text-gray-400 sm:text-xs">
            {product.variants.length} variant
            {product.variants.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="flex items-center justify-center gap-1 rounded-lg border border-emerald-200 px-2 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 sm:px-3 sm:text-sm"
          >
            <Eye size={14} /> View
          </Link>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex items-center justify-center gap-1 rounded-lg border border-blue-200 px-2 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 sm:px-3 sm:text-sm"
          >
            <Edit size={14} /> Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product.id, product.name)}
            className="flex items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 sm:px-3 sm:text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
