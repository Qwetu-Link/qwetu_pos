export type RevenueMonth = {
  month: string;
  fullPayments: number;
  installments: number;
};

export type CategoryMetric = {
  name: string;
  value: number;
  color: string;
};

export type SegmentMetric = {
  segment: string;
  customers: number;
  revenue: number;
};

export type PaymentMethodMetric = {
  method: string;
  transactions: number;
  amount: number;
};

export type CollectionMetric = {
  month: string;
  expected: number;
  collected: number;
};

export type BusinessProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
};

export type RolePermission = {
  key: string;
  label: string;
};

export type BusinessRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

