import { receipts } from "@/data/lipa-mdogo-data";
import type { PaymentPlan, PlanStatus, Receipt } from "@/types/lipa-mdogo";
import type { Order } from "@/types/customer";
import { getOrderDisplayNumber } from "@/utils/orderUtils";

export {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "@/utils/formatters";

export function getPlanReceipts(planOrId: PaymentPlan | string) {
  if (typeof planOrId !== "string" && planOrId.receipts) {
    return [...planOrId.receipts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  const planId = typeof planOrId === "string" ? planOrId : planOrId.id;

  return receipts
    .filter((receipt) => receipt.planId === planId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPaidAmount(planId: string) {
  return getPlanReceipts(planId).reduce((sum, receipt) => sum + receipt.amount, 0);
}

export function getPlanPaidAmount(plan: PaymentPlan) {
  return plan.paidAmount ?? getPaidAmount(plan.id);
}

export function getPaidInstallmentCount(plan: PaymentPlan) {
  const receiptCount = getPlanReceipts(plan).length;

  if (receiptCount > 0) {
    return receiptCount;
  }

  if (plan.installmentAmount <= 0) {
    return 0;
  }

  return Math.min(
    plan.installments,
    Math.floor(getPlanPaidAmount(plan) / plan.installmentAmount),
  );
}

export function getRemainingAmount(plan: PaymentPlan) {
  return Math.max(0, plan.totalAmount - getPlanPaidAmount(plan));
}

export function getNextDueDate(plan: PaymentPlan) {
  const paidInstallments = getPaidInstallmentCount(plan);

  if (paidInstallments >= plan.installments) {
    return null;
  }

  const dueDate = new Date(plan.startDate);
  dueDate.setMonth(dueDate.getMonth() + paidInstallments + 1);
  return dueDate.toISOString().slice(0, 10);
}

export function getPlanStatus(plan: PaymentPlan): PlanStatus {
  if (getPlanPaidAmount(plan) >= plan.totalAmount) {
    return "completed";
  }

  const nextDueDate = getNextDueDate(plan);

  if (nextDueDate && new Date(nextDueDate) < new Date()) {
    return "overdue";
  }

  return "active";
}

export function getInstallmentSchedule(plan: PaymentPlan) {
  const paidCount = getPaidInstallmentCount(plan);
  const paidAmount = getPlanPaidAmount(plan);

  return Array.from({ length: plan.installments }, (_, index) => {
    const dueDate = new Date(plan.startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    const paid = index < paidCount;
    const overdue = !paid && dueDate < new Date();
    const installmentPaidAmount = Math.min(
      plan.installmentAmount,
      Math.max(0, paidAmount - index * plan.installmentAmount),
    );

    return {
      installmentNo: index + 1,
      dueDate: dueDate.toISOString().slice(0, 10),
      amount: plan.installmentAmount,
      paidAmount: installmentPaidAmount,
      balance: Math.max(0, plan.installmentAmount - installmentPaidAmount),
      status: paid ? "paid" : overdue ? "overdue" : "pending",
      receipt: getPlanReceipts(plan)[index],
    };
  });
}

function mapOrderReceiptToPlanReceipt(
  receipt: NonNullable<NonNullable<Order["invoice"]>["receipts"]>[number],
  planId: string,
): Receipt {
  return {
    id: receipt.id,
    planId,
    amount: receipt.amount,
    date: receipt.date,
    method: receipt.method,
    ref: receipt.ref,
    note: receipt.note,
  };
}

export function mapOrderToPaymentPlan(order: Order): PaymentPlan | null {
  if (order.paymentType !== "installment" || !order.invoice) {
    return null;
  }

  const savedReceipts = order.invoice.receipts?.map((receipt) =>
    mapOrderReceiptToPlanReceipt(receipt, order.invoice!.id)
  ) ?? [];
  const savedReceiptTotal = savedReceipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0,
  );
  const depositAmount = Math.max(0, order.amountPaid - savedReceiptTotal);
  const receipts =
    depositAmount > 0
      ? [
          {
            id: `${order.invoice.invoiceNumber}-DEP`,
            planId: order.invoice.id,
            amount: depositAmount,
            date: order.installmentStartDate || order.createdAt,
            method: "Deposit",
            ref: "Initial deposit",
            note: "Deposit paid when the order was created",
          },
          ...savedReceipts,
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : savedReceipts;

  return {
    id: order.invoice.id,
    invoiceNo: order.invoice.invoiceNumber,
    customer: order.customer,
    orderId: getOrderDisplayNumber(order),
    phone: order.phone,
    email: order.email,
    paymentMethod: "Installment",
    products: order.lineItems.map((item) => ({
      name: item.name,
      quantity: item.qty,
      unitPrice: item.price,
      originalPrice: item.originalPrice,
      total: item.qty * item.price,
    })),
    totalAmount: order.invoice.total,
    paidAmount: order.amountPaid,
    receipts,
    installments: order.invoice.installments,
    installmentAmount: order.invoice.installmentAmount,
    startDate: order.invoice.startDate || order.installmentStartDate || order.createdAt,
    frequency: order.invoice.frequency || "monthly",
  };
}
