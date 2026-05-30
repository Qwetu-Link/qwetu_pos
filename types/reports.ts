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

