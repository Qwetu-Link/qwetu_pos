import { Building2, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { getInitials } from "@/lib/pos-details-data";
import type { businessProfile } from "@/lib/pos-details-data";
import ProfileTile from "./ProfileTile";
import SectionCard from "./SectionCard";

type Profile = typeof businessProfile;

export default function BusinessProfileSection({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  return (
    <SectionCard>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            <Building2 className="absolute h-7 w-7 opacity-25" />
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              Business Profile
            </p>
            <h2 className="break-words text-2xl font-bold text-slate-800">
              {profile.name}
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              {profile.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <ProfileTile icon={Mail} label="Email" value={profile.email} />
        <ProfileTile icon={Phone} label="Phone" value={profile.phone} />
        <ProfileTile icon={MapPin} label="Location" value={profile.location} />
      </div>
    </SectionCard>
  );
}
