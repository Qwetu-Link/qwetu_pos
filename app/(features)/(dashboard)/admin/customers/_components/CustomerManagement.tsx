"use client";

import { useState, useCallback } from "react";
import { Search, UserPlus, Users2 } from "lucide-react";
import { useCustomersContext } from "./CustomersContext";
import { computeStats } from "@/lib/customerUtils";
import type { Customer, CustomerFormData } from "@/types/customer";
import { CustomerStatsRow } from "./CustomerStatsRow";
import { CustomerCard } from "./CustomerCard";
import { CustomerFormModal } from "./CustomerFormModal";
import { Pagination } from "./Pagination";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export function CustomerManagement() {
  const {
    customers, filtered, paginated,
    search, setSearch,
    currentPage, setCurrentPage,
    perPage, setPerPage, totalPages,
    addCustomer, updateCustomer, deleteCustomer,
  } = useCustomersContext();

  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const stats = computeStats(customers);

  const handleOpenAdd = useCallback(() => { setEditCustomer(null); setFormOpen(true); }, []);
  const handleOpenEdit = useCallback((c: Customer) => { setEditCustomer(c); setFormOpen(true); }, []);

  const handleSave = useCallback((data: CustomerFormData, editId: string | null) => {
    if (editId) updateCustomer(editId, data);
    else addCustomer(data);
    setFormOpen(false);
    setEditCustomer(null);
  }, [addCustomer, updateCustomer]);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteId) deleteCustomer(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteCustomer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Customer Management</h1>
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

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 flex flex-col items-center gap-3 text-slate-400 shadow-sm">
            <Users2 size={48} strokeWidth={1.2} />
            <p className="text-lg font-medium">No customers found. Add new Customer</p>
          </div>
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
        onClose={() => { setFormOpen(false); setEditCustomer(null); }}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        isOpen={!!pendingDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
