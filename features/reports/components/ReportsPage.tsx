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
import {
  generatedReports,
  reportMetrics,
  reportTemplates,
  scheduledReports,
  type GeneratedReport,
  type ReportStatus,
  type ReportTemplate,
} from "@/data/report-center-data";
import EmptyState from "@/components/common/EmptyState";
import GeneratedReportsTable from "./GeneratedReportsTable";
import ReportMetricCard from "./ReportMetricCard";
import ReportTemplateCard from "./ReportTemplateCard";
import ScheduledReportsPanel from "./ScheduledReportsPanel";

const metricIcons = [FileBarChart, CalendarDays, CheckCircle2, XCircle];
const allCategories = ["All", ...reportTemplates.map((report) => report.category)];
const allStatuses: Array<"all" | ReportStatus> = [
  "all",
  "ready",
  "processing",
  "failed",
];

function fileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function downloadFile(name: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const reports = generatedReports;

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === "All") {
      return reportTemplates;
    }

    return reportTemplates.filter((report) => report.category === categoryFilter);
  }, [categoryFilter]);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") {
      return reports;
    }

    return reports.filter((report) => report.status === statusFilter);
  }, [reports, statusFilter]);

  function downloadTemplate(report: ReportTemplate) {
    const content = [
      `${report.title}`,
      `Category: ${report.category}`,
      `Last generated: ${report.lastGenerated}`,
      "",
      report.description,
      "",
      `Available formats: ${report.formats.join(", ")}`,
    ].join("\n");

    downloadFile(`${fileName(report.title)}-template.txt`, content);
  }

  function runReport(report: ReportTemplate) {
    void report;
  }

  function downloadGeneratedReport(report: GeneratedReport) {
    if (report.status !== "ready") {
      return;
    }

    const content = [
      "Report ID,Title,Period,Created,Size,Status",
      [
        report.id,
        report.title,
        report.period,
        report.createdAt,
        report.size,
        report.status,
      ].join(","),
    ].join("\n");

    downloadFile(`${fileName(report.title)}-${report.id}.csv`, content, "text/csv");
  }

  function exportReportPack() {
    const content = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        categoryFilter,
        statusFilter,
        templates: filteredTemplates,
        reports: filteredReports,
        scheduledReports,
      },
      null,
      2,
    );

    downloadFile("report-center-export-pack.json", content, "application/json");
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
            Generate, schedule, and review operational business reports.
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
          <button
            type="button"
            onClick={exportReportPack}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            <DownloadCloud className="h-4 w-4" />
            Export Pack
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
        {reportMetrics.map((metric, index) => (
          <ReportMetricCard
            key={metric.label}
            icon={metricIcons[index]}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
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
              Run the most used reports or export in your preferred format.
            </p>
          </div>
        </div>
        {filteredTemplates.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              reportTemplates.length === 0
                ? "No report templates available"
                : "No report templates match these filters"
            }
            description={
              reportTemplates.length === 0
                ? "Templates returned from the backend will appear here for sales, inventory, customer, and collection reports."
                : "Try another filter or reset the category to All."
            }
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
