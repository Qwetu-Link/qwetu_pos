import React from "react";
import { X } from "lucide-react";

export default function ModalFrame({
  title,
  icon,
  children,
  footer,
  maxWidth,
  onClose,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${maxWidth}`}
      >
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-5">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            {icon}
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
