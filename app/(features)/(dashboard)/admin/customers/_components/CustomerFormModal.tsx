"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { X, UserPlus, Pencil, Save } from "lucide-react";
import type { Customer, CustomerFormData, Segment } from "@/types/customer";

interface CustomerFormModalProps {
  isOpen: boolean;
  editCustomer: Customer | null; // null = add mode
  onClose: () => void;
  onSave: (data: CustomerFormData, editId: string | null) => void;
}

const INPUT =
  "w-full px-4 py-2.5 border border-slate-300 text-black placeholder:text-slate-400 transition rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export function CustomerFormModal({
  isOpen,
  editCustomer,
  onClose,
  onSave,
}: CustomerFormModalProps) {
  if (!isOpen) return null;

  return (
    <CustomerFormModalContent
      key={editCustomer?.id ?? "new-customer"}
      editCustomer={editCustomer}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function getInitialFormData(editCustomer: Customer | null): CustomerFormData {
  if (!editCustomer) {
    return {
      name: "",
      email: "",
      phone: "",
      segment: "New",
      riskLevel: "low",
      address: "",
    };
  }

  return {
    name: editCustomer.name,
    email: editCustomer.email,
    phone: editCustomer.phone,
    segment: editCustomer.segment,
    riskLevel: editCustomer.riskLevel,
    address: editCustomer.address,
  };
}

function CustomerFormModalContent({
  editCustomer,
  onClose,
  onSave,
}: Omit<CustomerFormModalProps, "isOpen">) {
  const [formData, setFormData] = useState<CustomerFormData>(() => getInitialFormData(editCustomer));
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const isEdit = !!editCustomer;

  function updateField<K extends keyof CustomerFormData>(field: K, value: CustomerFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof CustomerFormData, string>> = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave(
      {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
      editCustomer?.id ?? null
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            {isEdit ? (
              <Pencil size={18} className="text-blue-600" />
            ) : (
              <UserPlus size={18} className="text-emerald-600" />
            )}
            {isEdit ? "Edit Customer" : "Add New Customer"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className={LABEL}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={INPUT}
                  placeholder="e.g. Sarah Mwangi"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={LABEL}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={INPUT}
                  placeholder="name@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className={LABEL}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={INPUT}
                  placeholder="+254 7XX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Segment */}
              <div>
                <label className={LABEL}>Segment</label>
                <select
                  value={formData.segment}
                  onChange={(event) => updateField("segment", event.target.value as Segment)}
                  className={INPUT}
                >
                  {(["New", "Regular", "VIP"] as Segment[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <label className={LABEL}>Risk Level</label>
                <select
                  value={formData.riskLevel}
                  onChange={(event) => updateField("riskLevel", event.target.value as CustomerFormData["riskLevel"])}
                  className={INPUT}
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className={LABEL}>Shipping Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  className={INPUT}
                  placeholder="Street, City"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border text-black border-slate-300 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <Save size={15} /> Save Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
