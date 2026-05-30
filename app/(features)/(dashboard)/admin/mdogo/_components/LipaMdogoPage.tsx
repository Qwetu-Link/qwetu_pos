"use client";

import { useMemo, useState } from "react";
import type { PaymentPlan } from "@/data/lipa-mdogo-data";
import {
  formatCompactCurrency,
  getPlanStatus,
  getRemainingAmount,
  paymentPlans,
} from "@/data/lipa-mdogo-data";
import CollectionsPanel from "./CollectionsPanel";
import {
  AlertTriangle,
  CheckCircle2,
  CheckCheck,
  CreditCard,
  HandCoins,
  MoneyBill,
} from "./icons";
import Pagination from "@/components/Pagination";
import PaymentPlanCard from "./PaymentPlanCard";
import RecordPaymentModal from "./RecordPaymentModal";
import ReminderModal from "./ReminderModal";
import StatCard from "./StatCard";

export default function LipaMdogoPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "collections">("plans");
  const [reminderPlan, setReminderPlan] = useState<PaymentPlan | null>(null);
  const [recordPlan, setRecordPlan] = useState<PaymentPlan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const stats = useMemo(() => {
    const activePlans = paymentPlans.filter(
      (plan) => getPlanStatus(plan) === "active",
    ).length;
    const overduePlans = paymentPlans.filter(
      (plan) => getPlanStatus(plan) === "overdue",
    ).length;
    const completedPlans = paymentPlans.filter(
      (plan) => getPlanStatus(plan) === "completed",
    ).length;
    const totalOutstanding = paymentPlans.reduce(
      (sum, plan) => sum + getRemainingAmount(plan),
      0,
    );
    const expectedMonthly = paymentPlans.reduce(
      (sum, plan) => sum + plan.installmentAmount,
      0,
    );

    return {
      activePlans,
      overduePlans,
      completedPlans,
      totalOutstanding,
      expectedMonthly,
    };
  }, []);

  const visiblePlans = paymentPlans.filter(
    (plan) => getPlanStatus(plan) !== "completed",
  );
  const totalPages = Math.max(1, Math.ceil(visiblePlans.length / perPage));
  const paginatedPlans = visiblePlans.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  function updatePerPage(value: number) {
    setPerPage(value);
    setCurrentPage(1);
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
                <HandCoins className="h-8 w-8 text-emerald-600" />
                Lipa Mdogo Core
              </h1>
              <p className="mt-1 text-slate-500">
                Payment plans management - Installment tracking - Collections
              </p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard
              icon={CheckCircle2}
              label="Active Plans"
              value={stats.activePlans}
              tone="text-green-600"
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={stats.overduePlans}
              tone="text-red-600"
            />
            <StatCard
              icon={MoneyBill}
              label="Monthly Expected"
              value={formatCompactCurrency(stats.expectedMonthly)}
              tone="text-blue-600"
            />
            <StatCard
              icon={CreditCard}
              label="Outstanding"
              value={formatCompactCurrency(stats.totalOutstanding)}
              tone="text-purple-600"
            />
            <StatCard
              icon={CheckCheck}
              label="Completed"
              value={stats.completedPlans}
              tone="text-emerald-600"
            />
          </section>

          <section className="border-b border-slate-200">
            <div className="flex gap-6">
              {[
                ["plans", "Active Payment Plans"],
                ["collections", "Collections Dashboard"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveTab(value as "plans" | "collections")}
                  className={`border-b-2 px-1 pb-3 text-sm font-medium transition ${
                    activeTab === value
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === "plans" ? (
            <section className="space-y-4">
              {paginatedPlans.map((plan) => (
                <PaymentPlanCard
                  key={plan.id}
                  plan={plan}
                  onRecord={setRecordPlan}
                  onRemind={setReminderPlan}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={visiblePlans.length}
                perPage={perPage}
                onPage={setCurrentPage}
                onPerPage={updatePerPage}
              />
            </section>
          ) : (
            <CollectionsPanel />
          )}
        </div>
      </main>
      <ReminderModal
        isOpen={Boolean(reminderPlan)}
        onClose={() => setReminderPlan(null)}
        plan={reminderPlan}
      />
      <RecordPaymentModal
        isOpen={Boolean(recordPlan)}
        onClose={() => setRecordPlan(null)}
        plan={recordPlan}
      />
    </>
  );
}
