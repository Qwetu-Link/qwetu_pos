import {
  formatCurrency,
  getPaidAmount,
  getPlanStatus,
  paymentPlans,
} from "@/data/lipa-mdogo-data";
import { Mail } from "./icons";
import CollectionChart from "./CollectionChart";
import PlanMetric from "./PlanMetric";

export default function CollectionsPanel() {
  const expected = paymentPlans.reduce(
    (sum, plan) => sum + plan.installmentAmount,
    0,
  );
  const collected = paymentPlans.reduce(
    (sum, plan) => sum + getPaidAmount(plan.id),
    0,
  );
  const overdue = paymentPlans.filter(
    (plan) => getPlanStatus(plan) === "overdue",
  ).length;

  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Collections Dashboard
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PlanMetric
            label="Expected monthly"
            value={formatCurrency(expected)}
          />
          <PlanMetric
            label="Collected so far"
            value={formatCurrency(collected)}
            valueClassName="text-emerald-700"
          />
          <PlanMetric
            label="Overdue plans"
            value={String(overdue)}
            valueClassName="text-red-600"
          />
        </div>
        <CollectionChart />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700">
          <Mail className="h-5 w-5" />
          <h3 className="font-semibold">Collection insight</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Installment plans are contributing {formatCurrency(collected)} in
          collections so far. Send reminders before due dates and record
          payments as they arrive to keep balances accurate.
        </p>
      </div>
    </section>
  );
}
