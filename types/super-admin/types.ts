// Core types for the Qwetu Super Admin Dashboard

export type Industry =
  | 'Retail'
  | 'Pharmacy'
  | 'Hotel'
  | 'School'
  | 'Hospital'
  | 'Restaurant'
  | 'Property Management'
  | 'Manufacturing'
  | 'Wholesale'
  | 'Other';

export type BusinessStatus = 'active' | 'trial' | 'suspended' | 'expired';

export type PlanName = 'Trial' | 'Starter' | 'Professional' | 'Enterprise';

export type BillingCycle = 'monthly' | 'annual';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type PaymentMethod = 'M-Pesa' | 'Stripe' | 'PayPal' | 'Bank Transfer';

export type WhatsAppStatus = 'connected' | 'disconnected' | 'pending';

export type AdminRole =
  | 'Super Admin'
  | 'Finance'
  | 'Operations'
  | 'Customer Support'
  | 'Read Only';

export type AdminStatus = 'active' | 'inactive';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type NotificationPriority = 'high' | 'medium' | 'low';

export type NotificationCategory =
  | 'business'
  | 'subscription'
  | 'payment'
  | 'whatsapp'
  | 'system'
  | 'security';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'info_requested';

export type TemplateCategory = 'Authentication' | 'Utility' | 'Marketing';
export type TemplateStatus = 'approved' | 'pending' | 'rejected';

export type SupportStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type SupportPriority = 'urgent' | 'high' | 'medium' | 'low';


export interface BusinessUser {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar: string;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  users: number;
  status: 'active' | 'inactive';
}

export interface Subscription {
  id: string;
  businessId: string;
  businessName: string;
  plan: PlanName;
  billingCycle: BillingCycle;
  price: number;
  paymentStatus: PaymentStatus;
  renewalDate: string;
  expiryDate: string;
  status: BusinessStatus;
  autoRenewal: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: PlanName;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  userLimit: number;
  branchLimit: number;
  supportLevel: string;
  popular: boolean;
}

export interface Payment {
  id: string;
  invoice: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  description: string;
}

export interface RegistrationRequest {
  id: string;
  company: string;
  owner: string;
  email: string;
  phone: string;
  industry: Industry;
  country: string;
  documents: string[];
  submittedDate: string;
  status: RegistrationStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  status: AdminStatus;
  avatar: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  administrator: string;
  action: string;
  module: string;
  resource: string;
  ipAddress: string;
  browser: string;
  device: string;
  date: string;
  severity: Severity;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  archived: boolean;
  date: string;
}

export interface WhatsAppConnection {
  id: string;
  businessId: string;
  businessName: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  status: WhatsAppStatus;
  tokenStatus: 'valid' | 'expired' | 'invalid';
  lastSync: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  variables: number;
  lastUpdated: string;
  body: string;
  header?: string;
  footer?: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'registration'
    | 'renewal'
    | 'payment'
    | 'whatsapp_connected'
    | 'suspended'
    | 'new_admin'
    | 'login'
    | 'settings_update'
    | 'subscription_change';
  title: string;
  description: string;
  actor: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  subject: string;
  businessName: string;
  contactName: string;
  priority: SupportPriority;
  status: SupportStatus;
  category: string;
  createdAt: string;
  lastReply: string;
  messages: number;
}

export interface KPIData {
  label: string;
  value: number;
  format: 'number' | 'currency' | 'percent';
  growth: number;
  previousValue: number;
  sparkline: number[];
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface RevenueData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
  yearly: ChartDataPoint[];
}
