import Link from "next/link";
import type { PaymentPlan } from "@/data/lipa-mdogo-data";
import {
  formatCurrency,
  formatDate,
  getNextDueDate,
  getPaidAmount,
  getPlanStatus,
  getRemainingAmount,
} from "@/data/lipa-mdogo-data";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CheckCheck,
  Eye,
  MoneyBill,
  Send,
} from "./icons";
import PlanMetric from "./PlanMetric";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
  completed: {
    label: "Completed",
    className: "bg-blue-100 text-blue-700",
    icon: CheckCheck,
  },
};

export default function PaymentPlanCard({
  plan,
  onRecord,
  onRemind,
}: {
  plan: PaymentPlan;
  onRecord: (plan: PaymentPlan) => void;
  onRemind: (plan: PaymentPlan) => void;
}) {
  const status = getPlanStatus(plan);
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const paid = getPaidAmount(plan.id);
  const remaining = getRemainingAmount(plan);
  const progress = Math.min(100, (paid / plan.totalAmount) * 100);
  const nextDue = getNextDueDate(plan);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {plan.customer}
              </h3>
              <p className="text-sm text-slate-500">
                {plan.id} - Order: {plan.orderId}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${config.className}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {config.label}
            </span>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm text-black">
              <span>Payment Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <PlanMetric label="Total" value={formatCurrency(plan.totalAmount)} />
            <PlanMetric
              label="Paid"
              value={formatCurrency(paid)}
              valueClassName="text-green-600"
            />
            <PlanMetric
              label="Remaining"
              value={formatCurrency(remaining)}
              valueClassName="text-red-600"
            />
            <PlanMetric
              label="Installment"
              value={formatCurrency(plan.installmentAmount)}
            />
          </div>
        </div>

        <div className="space-y-3 lg:w-64">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Next Payment</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {nextDue ? formatDate(nextDue) : "Complete"}
            </p>
            <p className="text-xs text-slate-500">
              {plan.frequency} - {plan.installments} installments
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRemind(plan)}
              className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              <Send className="mr-1 inline h-4 w-4" />
              Remind
            </button>
            <button
              type="button"
              onClick={() => onRecord(plan)}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <MoneyBill className="mr-1 inline h-4 w-4" />
              Record
            </button>
          </div>
          <Link
            href={`/admin/mdogo/${plan.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
