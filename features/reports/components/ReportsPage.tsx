"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  DownloadCloud,
  FileBarChart,
  FileText,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import type { AdminReportCenterData } from "@/db/queries/admin-reports";
import type {
  GeneratedReport,
  ReportStatus,
  ReportTemplate,
  ScheduledReport,
} from "@/types/reports";
import EmptyState from "@/components/common/EmptyState";
import GeneratedReportsTable from "./GeneratedReportsTable";
import ReportMetricCard from "./ReportMetricCard";
import ReportTemplateCard from "./ReportTemplateCard";
import ScheduledReportsPanel from "./ScheduledReportsPanel";

const metricIcons = [FileBarChart, CalendarDays, CheckCircle2, XCircle];
const allStatuses: Array<"all" | ReportStatus> = [
  "all",
  "ready",
  "processing",
  "failed",
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatus(hasReview: boolean): ReportStatus {
  return hasReview ? "processing" : "ready";
}

function exportUrl(format: string) {
  return `/admin/reports/export/${format.toLowerCase()}`;
}

function buildTemplates(data: AdminReportCenterData): ReportTemplate[] {
  return data.reportCards.map((report) => ({
    title: report.title,
    description: report.description,
    category:
      report.id === "sales"
        ? "Sales"
        : report.id === "collections"
          ? "Collections"
          : report.id === "inventory"
            ? "Inventory"
            : "Customers",
    lastGenerated: `Generated ${formatDate(data.generatedAt)}`,
    formats: ["CSV", "XLS", "PDF"],
  }));
}

function buildGeneratedReports(data: AdminReportCenterData): GeneratedReport[] {
  const estimatedRows =
    data.topProducts.length +
    data.inventory.length +
    data.customerSegments.length +
    data.transactions.length +
    data.revenueTrend.length;
  const size = formatBytes(Math.max(estimatedRows, 1) * 420);

  return [
    {
      id: "ADMIN-CSV",
      title: `${data.business.name} operational export`,
      period: data.periodLabel,
      createdAt: formatDate(data.generatedAt),
      size,
      status: "ready",
    },
    {
      id: "ADMIN-XLS",
      title: `${data.business.name} workbook export`,
      period: data.periodLabel,
      createdAt: formatDate(data.generatedAt),
      size,
      status: "ready",
    },
    {
      id: "ADMIN-PDF",
      title: `${data.business.name} PDF summary`,
      period: data.periodLabel,
      createdAt: formatDate(data.generatedAt),
      size,
      status: getStatus(data.inventory.length > 0),
    },
  ];
}

function buildScheduledReports(data: AdminReportCenterData): ScheduledReport[] {
  return [
    {
      title: "Daily sales and collections",
      owner: data.business.name,
      frequency: "Daily",
      nextRun: "Next run tomorrow",
      recipients: 1,
    },
    {
      title: "Weekly inventory review",
      owner: data.business.name,
      frequency: "Weekly",
      nextRun: "Next run Monday",
      recipients: 1,
    },
  ];
}

function downloadGeneratedReport(report: GeneratedReport) {
  if (report.status !== "ready") return;

  const format = report.id.endsWith("XLS")
    ? "xls"
    : report.id.endsWith("PDF")
      ? "pdf"
      : "csv";

  window.location.href = exportUrl(format);
}

export default function ReportsPage({ data }: { data: AdminReportCenterData }) {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");

  const reportTemplates = useMemo(() => buildTemplates(data), [data]);
  const generatedReports = useMemo(() => buildGeneratedReports(data), [data]);
  const scheduledReports = useMemo(() => buildScheduledReports(data), [data]);
  const allCategories = useMemo(
    () => ["All", ...new Set(reportTemplates.map((report) => report.category))],
    [reportTemplates],
  );

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === "All") {
      return reportTemplates;
    }

    return reportTemplates.filter((report) => report.category === categoryFilter);
  }, [categoryFilter, reportTemplates]);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") {
      return generatedReports;
    }

    return generatedReports.filter((report) => report.status === statusFilter);
  }, [generatedReports, statusFilter]);

  function downloadTemplate(report: ReportTemplate) {
    const format = report.formats[0]?.toLowerCase() ?? "csv";
    window.location.href = exportUrl(format);
  }

  function runReport(report: ReportTemplate) {
    const format = report.formats.includes("PDF") ? "pdf" : "csv";
    window.location.href = exportUrl(format);
  }

  function exportReportPack() {
    window.location.href = exportUrl("csv");
  }

  function resetFilters() {
    setCategoryFilter("All");
    setStatusFilter("all");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <h1 className="flex min-w-0 items-center gap-3 text-2xl font-extrabold text-black sm:text-3xl">
            <FileText className="h-7 w-7 shrink-0 text-emerald-600 sm:h-8 sm:w-8" />
            Reports Center
          </h1>
          <p className="mt-1 text-slate-500">
            Generate, schedule, and review live operational reports for {data.business.name}.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <a
            href={exportUrl("xls")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <DownloadCloud className="h-4 w-4" />
            XLS
          </a>
          <a
            href={exportUrl("pdf")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <DownloadCloud className="h-4 w-4" />
            PDF
          </a>
          <button
            type="button"
            onClick={exportReportPack}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            <DownloadCloud className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>

      {showFilters ? (
        <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="text-sm font-medium text-slate-700">
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {allCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Report status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | ReportStatus)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All" : status}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </section>
      ) : null}

      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        {data.metrics.map((metric, index) => (
          <ReportMetricCard
            key={metric.label}
            icon={metricIcons[index]}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={
              metric.tone === "emerald"
                ? "text-emerald-700"
                : metric.tone === "blue"
                  ? "text-blue-700"
                  : metric.tone === "red"
                    ? "text-red-700"
                    : metric.tone === "amber"
                      ? "text-amber-700"
                      : "text-slate-700"
            }
          />
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Report Templates
            </h2>
            <p className="text-sm text-slate-500">
              Run live sales, inventory, customer, and collection reports.
            </p>
          </div>
        </div>
        {filteredTemplates.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No report templates match these filters"
            description="Try another filter or reset the category to All."
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-stretch gap-4">
            {filteredTemplates.map((report) => (
              <ReportTemplateCard
                key={report.title}
                report={report}
                onDownload={downloadTemplate}
                onRun={runReport}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <GeneratedReportsTable
          reports={filteredReports}
          onDownload={downloadGeneratedReport}
        />
        <ScheduledReportsPanel reports={scheduledReports} />
      </div>
    </div>
  );
}
