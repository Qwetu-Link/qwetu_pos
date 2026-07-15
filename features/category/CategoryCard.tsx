"use client";

import type { Category } from "@/types/categories";
import {
  Baby,
  BedDouble,
  Gem,
  Pencil,
  Shirt,
  Sparkles,
  Trash2,
  UserRound,
  Footprints,
  Activity,
  Tag,
  type LucideIcon,
} from "lucide-react";

interface Props {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string, name: string) => void;
}

const categoryIconMap: Record<string, LucideIcon> = {
  "fas fa-tshirt": Shirt,
  "fas fa-female": UserRound,
  "fas fa-shoe-prints": Footprints,
  "fas fa-gem": Gem,
  "fas fa-vest": Shirt,
  "fas fa-child": Baby,
  "fas fa-running": Activity,
  "fas fa-bed": BedDouble,
  "fas fa-tag": Tag,
  "fas fa-shirt": Shirt,
  "fas fa-hat-cowboy": Sparkles,
};

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  const CategoryIcon = categoryIconMap[category.icon ?? "fas fa-tag"] ?? Tag;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Icon bubble */}
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CategoryIcon size={22} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 leading-tight">
              {category.name}
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
            title="Edit category"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(category.id, category.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
            title="Delete category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
        {category.description || "No description"}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <CategoryIcon size={12} />
          Category
        </span>
      </div>
    </div>
  );
}
