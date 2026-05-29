"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { businessProfile } from "@/lib/pos-details-data";
import FormField from "./FormField";

type Profile = typeof businessProfile;

const profileSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  email: z.email("Enter a valid email address").trim(),
  phone: z.string().trim().min(1, "Business phone is required"),
  location: z.string().trim().min(1, "Location is required"),
  description: z.string().trim(),
});

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  profile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  profile: Profile;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Edit Business Profile
            </h3>
            <p className="text-sm text-slate-500">
              Changes are saved to your business account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FormField label="Business Name" error={errors.name?.message} {...register("name")} />
          <FormField
            label="Business Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            label="Business Phone"
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormField label="Location" error={errors.location?.message} {...register("location")} />
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Business Description
            </span>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            />
          </label>
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border text-black border-slate-300 px-5 py-2.5 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
