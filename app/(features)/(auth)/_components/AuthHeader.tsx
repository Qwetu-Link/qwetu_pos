import { Store } from "lucide-react";

export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 text-center">
      <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-slate-950 lg:hidden">
        Q<span className="text-emerald-600">L</span>
      </div>
      <h1 className="flex items-center justify-center gap-2 text-2xl font-extrabold text-black">
        <Store className="h-5 w-5 text-emerald-600" />
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
