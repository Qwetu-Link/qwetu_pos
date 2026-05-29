import type { FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { businessProfile } from "@/lib/pos-details-data";
import FormField from "./FormField";

type Profile = typeof businessProfile;

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  profile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  profile: Profile;
}) {
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
        <form onSubmit={onSave} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FormField label="Business Name" name="name" defaultValue={profile.name} />
          <FormField
            label="Business Email"
            name="email"
            type="email"
            defaultValue={profile.email}
          />
          <FormField
            label="Business Phone"
            name="phone"
            type="tel"
            defaultValue={profile.phone}
          />
          <FormField label="Location" name="location" defaultValue={profile.location} />
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Business Description
            </span>
            <textarea
              name="description"
              rows={3}
              defaultValue={profile.description}
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
