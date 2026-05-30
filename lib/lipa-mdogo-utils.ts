import { receipts } from "@/data/lipa-mdogo-data";
import type { PaymentPlan, PlanStatus } from "@/types/lipa-mdogo";

export {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "@/lib/formatters";

export function getPlanReceipts(planId: string) {
  return receipts
    .filter((receipt) => receipt.planId === planId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPaidAmount(planId: string) {
  return getPlanReceipts(planId).reduce((sum, receipt) => sum + receipt.amount, 0);
}

export function getRemainingAmount(plan: PaymentPlan) {
  return Math.max(0, plan.totalAmount - getPaidAmount(plan.id));
}

export function getNextDueDate(plan: PaymentPlan) {
  const paidInstallments = getPlanReceipts(plan.id).length;

  if (paidInstallments >= plan.installments) {
    return null;
  }

  const dueDate = new Date(plan.startDate);
  dueDate.setMonth(dueDate.getMonth() + paidInstallments + 1);
  return dueDate.toISOString().slice(0, 10);
}

export function getPlanStatus(plan: PaymentPlan): PlanStatus {
  if (getPaidAmount(plan.id) >= plan.totalAmount) {
    return "completed";
  }

  const nextDueDate = getNextDueDate(plan);

  if (nextDueDate && new Date(nextDueDate) < new Date()) {
    return "overdue";
  }

  return "active";
}

export function getInstallmentSchedule(plan: PaymentPlan) {
  const paidCount = getPlanReceipts(plan.id).length;

  return Array.from({ length: plan.installments }, (_, index) => {
    const dueDate = new Date(plan.startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    const paid = index < paidCount;
    const overdue = !paid && dueDate < new Date();

    return {
      installmentNo: index + 1,
      dueDate: dueDate.toISOString().slice(0, 10),
      amount: plan.installmentAmount,
      paidAmount: paid ? plan.installmentAmount : 0,
      balance: paid ? 0 : plan.installmentAmount,
      status: paid ? "paid" : overdue ? "overdue" : "pending",
      receipt: getPlanReceipts(plan.id)[index],
    };
  });
}
