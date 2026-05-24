"use client";

import { Trash2 } from "lucide-react";

interface Props {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ productName, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl"><Trash2 color="red" /></span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Product</h3>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">`{productName}`</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
