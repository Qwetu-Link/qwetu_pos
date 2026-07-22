import { Loader2, TriangleAlert } from "lucide-react";

interface Props {
  sku?: string;
  isOpen: boolean;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function DeleteModal({
  isOpen,
  sku,
  isDeleting = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TriangleAlert size={30} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Delete Product Variant
        </h3>
        <p className="text-slate-500 mb-6">
          Are you sure you want to delete variant{" "}
          <span className="font-mono font-semibold text-slate-700">
            ({sku})
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 border text-black border-slate-300 py-2.5 rounded-xl font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
