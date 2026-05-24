"use client";

import Image from "next/image";
import { Product } from "@/types/catalog";
import {
  getProductImageSrc,
  getProductTotalStock,
  getProductUniqueSizes,
} from "@/lib/catalog-utils";
import { AlertTriangle, Box, Edit, Trash2 } from "lucide-react";

interface Props {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const totalStock = getProductTotalStock(product);
  const uniqueSizes = getProductUniqueSizes(product);
  const isLowStock = totalStock <= 10;
  const imageSrc = getProductImageSrc(product);

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={12} /> Low Stock
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2 flex-1 mr-2">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-1 justify-end">
            {uniqueSizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 whitespace-nowrap"
              >
                {size}
              </span>
            ))}
            {uniqueSizes.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-400">
                +{uniqueSizes.length - 3}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          {product.category}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Box size={14} className="text-gray-400" />
            <span
              className={`text-sm font-medium ${
                isLowStock ? "text-amber-600" : "text-gray-700"
              }`}
            >
              {totalStock} units
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {product.variants.length} variant
            {product.variants.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product.id)}
            className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-1"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(product.id, product.name)}
            className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-1"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
