import { Store } from "lucide-react";

export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white shadow-lg shadow-slate-200 lg:hidden">
        Q<span className="text-emerald-600">L</span>
      </div>
      <h1 className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight text-slate-950">
        <Store className="h-6 w-6 text-emerald-600" />
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );
}
