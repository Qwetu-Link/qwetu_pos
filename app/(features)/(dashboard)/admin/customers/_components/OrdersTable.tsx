import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { Eye, ShoppingBag } from "lucide-react";
import type { Order } from "@/types/customer";
import { ORDER_STATUS_CONFIG } from "@/data/customer-config";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders for this customer"
        description="When this customer makes a purchase, their order history and payment status will appear here."
        className="rounded-2xl"
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Order ID", "Date", "Items", "Total (KES)", "Payment", "Status", "Action"].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const statusCfg = ORDER_STATUS_CONFIG[order.status];
              return (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800 font-mono text-xs">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{order.items}</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700">
                    {order.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    {order.paymentType === "installment" ? (
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Installment {order.installmentPlan ?? ""}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">Full payment</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye size={13} /> Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
