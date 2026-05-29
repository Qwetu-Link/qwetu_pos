export type ReportStatus = "ready" | "processing" | "failed";
export type ReportFrequency = "Daily" | "Weekly" | "Monthly";

export interface ReportMetric {
  label: string;
  value: string;
  detail: string;
  tone: string;
}

export interface ReportTemplate {
  title: string;
  description: string;
  category: string;
  lastGenerated: string;
  formats: string[];
}

export interface ScheduledReport {
  title: string;
  owner: string;
  frequency: ReportFrequency;
  nextRun: string;
  recipients: number;
}

export interface GeneratedReport {
  id: string;
  title: string;
  period: string;
  createdAt: string;
  size: string;
  status: ReportStatus;
}

export const reportMetrics: ReportMetric[] = [
  {
    label: "Reports Generated",
    value: "128",
    detail: "+18 this week",
    tone: "text-emerald-600",
  },
  {
    label: "Scheduled Reports",
    value: "12",
    detail: "5 due today",
    tone: "text-blue-600",
  },
  {
    label: "Exports Completed",
    value: "94%",
    detail: "Last 30 days",
    tone: "text-violet-600",
  },
  {
    label: "Failed Jobs",
    value: "3",
    detail: "Needs review",
    tone: "text-red-600",
  },
];

export const reportTemplates: ReportTemplate[] = [
  {
    title: "Sales Performance",
    description: "Revenue, orders, refunds, and payment method trends.",
    category: "Sales",
    lastGenerated: "Today, 8:30 AM",
    formats: ["PDF", "CSV"],
  },
  {
    title: "Inventory Movement",
    description: "Stock levels, low inventory, transfers, and product velocity.",
    category: "Inventory",
    lastGenerated: "Yesterday, 5:20 PM",
    formats: ["PDF", "XLS"],
  },
  {
    title: "Customer Ledger",
    description: "Customer balances, purchases, installments, and collections.",
    category: "Customers",
    lastGenerated: "May 27, 2026",
    formats: ["PDF", "CSV"],
  },
  {
    title: "Lipa Mdogo Collections",
    description: "Expected collections, completed payments, arrears, and risk.",
    category: "Collections",
    lastGenerated: "May 26, 2026",
    formats: ["PDF", "XLS"],
  },
];

export const scheduledReports: ScheduledReport[] = [
  {
    title: "Daily Sales Summary",
    owner: "Finance team",
    frequency: "Daily",
    nextRun: "Today, 9:00 PM",
    recipients: 4,
  },
  {
    title: "Weekly Inventory Audit",
    owner: "Operations",
    frequency: "Weekly",
    nextRun: "Monday, 7:30 AM",
    recipients: 6,
  },
  {
    title: "Monthly Collections Review",
    owner: "Credit team",
    frequency: "Monthly",
    nextRun: "June 1, 2026",
    recipients: 8,
  },
];

export const generatedReports: GeneratedReport[] = [
  {
    id: "RPT-2401",
    title: "Sales Performance",
    period: "May 2026",
    createdAt: "May 29, 2026 08:30",
    size: "2.4 MB",
    status: "ready",
  },
  {
    id: "RPT-2400",
    title: "Lipa Mdogo Collections",
    period: "May 20 - May 29, 2026",
    createdAt: "May 29, 2026 07:15",
    size: "1.8 MB",
    status: "processing",
  },
  {
    id: "RPT-2399",
    title: "Inventory Movement",
    period: "May 2026",
    createdAt: "May 28, 2026 17:20",
    size: "3.1 MB",
    status: "ready",
  },
  {
    id: "RPT-2398",
    title: "Customer Ledger",
    period: "Q2 2026",
    createdAt: "May 27, 2026 14:05",
    size: "856 KB",
    status: "failed",
  },
];
