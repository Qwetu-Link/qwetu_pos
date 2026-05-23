import { Construction } from "lucide-react";

interface PageUnderDevelopmentProps {
  title?: string;
}

export default function PageUnderDevelopment({
  title = "Page",
}: PageUnderDevelopmentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 p-4 bg-amber-100 rounded-2xl">
          <Construction
            className="w-12 h-12 text-amber-600"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          {title} Under Development
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-sm">
          Our team is hard at work creating something amazing for you. Check
          back soon for updates.
        </p>
        <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}
