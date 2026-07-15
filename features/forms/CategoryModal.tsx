"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Category } from "@/types/categories";
import {
  Activity,
  Baby,
  BedDouble,
  Edit,
  Footprints,
  Gem,
  Plus,
  Save,
  Shirt,
  Sparkles,
  Tag,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { CategoryFormValues, categorySchema } from "@/validators/category";

interface Props {
  /** null = add mode, Category = edit mode */
  category: Category | null;
  isSaving?: boolean;
  onSave: (values: CategoryFormValues, existingId?: string) => void;
  onClose: () => void;
}

const DEFAULT_ICON = "fas fa-tag";


const iconMap: Record<string, LucideIcon> = {
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

const quickPickIcons = [
  { value: "fas fa-tshirt", label: "Shirt", Icon: Shirt },
  { value: "fas fa-female", label: "Female", Icon: UserRound },
  { value: "fas fa-shoe-prints", label: "Footprints", Icon: Footprints },
  { value: "fas fa-gem", label: "Gem", Icon: Gem },
  { value: "fas fa-vest", label: "Vest", Icon: Shirt },
  { value: "fas fa-child", label: "Child", Icon: Baby },
  { value: "fas fa-running", label: "Running", Icon: Activity },
  { value: "fas fa-tag", label: "Tag", Icon: Tag },
  { value: "fas fa-bed", label: "Bed", Icon: BedDouble },
  { value: "fas fa-hat-cowboy", label: "Cowboy", Icon: Sparkles },
] as const;

export default function CategoryModal({
  category,
  isSaving = false,
  onSave,
  onClose,
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setFocus,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? DEFAULT_ICON,
    },
  });
  const icon = useWatch({ control, name: "icon" });
  const PreviewIcon = iconMap[icon] ?? Tag;

  // Lock background scroll & autofocus
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setFocus("name");
    return () => {
      document.body.style.overflow = "";
    };
  }, [setFocus]);

  function submitCategory(values: CategoryFormValues) {
    onSave(values, category?.id);
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 rounded-t-2xl flex justify-between items-center z-10">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {category ? <Edit /> : <Plus />}{" "}
            {category ? "Edit Category" : "Add New Category"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitCategory)} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Men's Clothing"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            ) : null}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="e.g. Men's clothing including shirts, jackets, trousers"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-black placeholder:text-gray-500"
            />
          </div>

          {/* Icon with live preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Icon{" "}
              <span className="text-gray-400 font-normal">
                (Font Awesome class)
              </span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                {...register("icon")}
                placeholder="fas fa-tshirt"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
              {/* Live icon preview bubble */}
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <PreviewIcon size={22} className="text-emerald-600" />
              </div>
            </div>

            {/* Quick-pick icon suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPickIcons.map(({ value, Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("icon", value, { shouldValidate: true })}
                  title={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition border ${
                    icon === value
                      ? "bg-emerald-100 border-emerald-400 text-emerald-600"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition font-medium flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} /> {isSaving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
