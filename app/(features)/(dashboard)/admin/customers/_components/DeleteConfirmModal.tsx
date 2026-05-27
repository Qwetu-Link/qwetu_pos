import { TriangleAlert } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TriangleAlert size={30} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-slate-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-slate-300 text-black rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
