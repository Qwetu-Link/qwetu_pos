"use client";

import { useState, useCallback } from "react";
import { Search, UserPlus, Users2 } from "lucide-react";
import { CustomerCardsSkeleton } from "@/components/skeletons";
import { useCustomersContext } from "./CustomersContext";
import { computeStats } from "@/utils/customerUtils";
import type { Customer, CustomerFormData } from "@/types/admin/customer";
import { CustomerStatsRow } from "./CustomerStatsRow";
import { CustomerCard } from "./CustomerCard";
import { CustomerFormModal } from "./CustomerFormModal";
import EmptyState from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";

export function CustomerManagement() {
  const {
    customers, filtered, paginated,
    search, setSearch,
    currentPage, setCurrentPage,
    perPage, setPerPage, totalPages,
    addCustomer, updateCustomer, deleteCustomer,
    isLoading, isError, error,
    createError, updateError, deleteError,
    isCreating, isUpdating, isDeleting,
  } = useCustomersContext();

  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const stats = computeStats(customers);
  const pendingDeleteCustomer =
    customers.find((customer) => customer.id === pendingDeleteId) ?? null;

  const handleOpenAdd = useCallback(() => { setEditCustomer(null); setFormOpen(true); }, []);
  const handleOpenEdit = useCallback((c: Customer) => { setEditCustomer(c); setFormOpen(true); }, []);

  const handleSave = useCallback(async (data: CustomerFormData, editId: string | null) => {
    if (editId) await updateCustomer(editId, data);
    else await addCustomer(data);
    setFormOpen(false);
    setEditCustomer(null);
  }, [addCustomer, updateCustomer]);

  const handleConfirmDelete = useCallback(async () => {
    if (pendingDeleteId) await deleteCustomer(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteCustomer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
              <Users2 className="h-8 w-8 text-emerald-600" />
              Customer Management
            </h1>
            <p className="text-slate-500 mt-1">Manage customers &amp; track payment scores</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium"
          >
            <UserPlus size={16} /> Add Customer
          </button>
        </div>

        <CustomerStatsRow stats={stats} />

        {(isError || createError || updateError || deleteError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {createError?.message ||
              updateError?.message ||
              deleteError?.message ||
              error?.message ||
              "Could not load customers from the database."}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-slate-400 transition"
            />
          </div>
        </div>

        {isLoading ? (
          <CustomerCardsSkeleton count={6} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Users2}
            title={
              customers.length === 0
                ? "No customers yet"
                : "No customers match your search"
            }
            description={
              customers.length === 0
                ? "Add a customer profile to start tracking orders, balances, and installment history."
                : "Check the name, email, or phone number and try again."
            }
            action={
              customers.length === 0 ? (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <UserPlus size={16} /> Add Customer
                </button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {paginated.map((c) => (
              <CustomerCard
                key={c.id} customer={c}
                onEdit={handleOpenEdit}
                onDelete={setPendingDeleteId}
              />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage} totalPages={totalPages}
            total={filtered.length} perPage={perPage}
            onPage={setCurrentPage}
            onPerPage={(v) => { setPerPage(v); setCurrentPage(1); }}
          />
        )}
      </div>

      <CustomerFormModal
        isOpen={formOpen} editCustomer={editCustomer}
        isSaving={isCreating || isUpdating}
        onClose={() => { setFormOpen(false); setEditCustomer(null); }}
        onSave={handleSave}
      />
      {pendingDeleteId && (
        <DeleteModal
          name={pendingDeleteCustomer?.name ?? "this customer"}
          title={isDeleting ? "Deleting Customer" : "Delete Customer"}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
