export type RefundStatus = "Pending" | "Approved" | "Processed" | "Rejected";

export interface RefundRecord {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  amount: number;
  method: string;
  reason: string;
  status: RefundStatus;
  owner: string;
}
