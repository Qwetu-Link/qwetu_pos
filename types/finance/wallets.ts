export type CustomerWalletStatus = "Active" | "Watch" | "Dormant";

export interface CustomerWallet {
  id: string;
  customer: string;
  savings: number;
  storeCredit: number;
  refundCredit: number;
  total: number;
  status: CustomerWalletStatus;
  lastTransaction: string;
}

export interface CustomerWalletActivity {
  id: string;
  customer: string;
  type: string;
  amount: number;
  date: string;
}

export interface CustomerWalletTotals {
  savings: number;
  storeCredit: number;
  refundCredit: number;
  total: number;
}
