"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "../../../_components/page-layout";
import {
  ArrowLeftRight,
  BarChart2,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Landmark,
  PieChart as PieChartIcon,
  Plus,
  Printer,
  ShieldCheck,
} from "lucide-react";
import type { FinanceReport, FinanceReportStatus, FinanceReportTemplate } from "@/types/finance";

const reportList: FinanceReport[] = [
  { id: "RPT-2026-Q2", name: "Q2 2026 Financial Statements", type: "Financial", generated: "2026-06-14", size: "4.2 MB", status: "paid" },
  { id: "RPT-2026-Q1", name: "Q1 2026 Financial Statements", type: "Financial", generated: "2026-03-31", size: "3.9 MB", status: "paid" },
  { id: "RPT-TAX-Q2", name: "Q2 Tax Filing Package", type: "Tax", generated: "2026-06-10", size: "8.1 MB", status: "scheduled" },
  { id: "RPT-AUDIT-2025", name: "FY 2025 Audit Report", type: "Compliance", generated: "2026-02-28", size: "12.4 MB", status: "paid" },
  { id: "RPT-CONSOL", name: "Consolidated Balance Sheet", type: "Financial", generated: "2026-06-13", size: "1.8 MB", status: "paid" },
  { id: "RPT-CF-MAY", name: "Cash Flow Statement - May", type: "Financial", generated: "2026-06-01", size: "2.1 MB", status: "paid" },
  { id: "RPT-VARIANCE", name: "Budget Variance Analysis Q2", type: "Management", generated: "2026-06-12", size: "3.3 MB", status: "failed" },
];

const templateCards: FinanceReportTemplate[] = [
  { icon: BarChart2, title: "P&L Statement", desc: "Income, COGS, gross profit, operating expenses, and net income", type: "Financial" },
  { icon: Landmark, title: "Balance Sheet", desc: "Assets, liabilities, and shareholder equity snapshot", type: "Financial" },
  { icon: ArrowLeftRight, title: "Cash Flow Statement", desc: "Operating, investing, and financing activities", type: "Financial" },
  { icon: PieChartIcon, title: "Budget Variance Report", desc: "Actual vs budget by department and cost center", type: "Management" },
  { icon: FileText, title: "Tax Package", desc: "Consolidated tax filings and regional statutory allocations", type: "Tax" },
  { icon: ShieldCheck, title: "Audit Report", desc: "External auditor findings and management responses", type: "Compliance" },
];

function StatusBadge({ status }: { status: FinanceReportStatus }) {
  const styles = {
    paid: "bg-[#42688C]/20 text-[#E2F4DF] ring-1 ring-[#42688C]/30",
    scheduled: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25",
    failed: "bg-red-400/15 text-red-200 ring-1 ring-red-300/25",
  };

  const labels = {
    paid: "cleared",
    scheduled: "pending",
    failed: "draft",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function ReportsPage() {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");

  const filteredLibrary = reportList.filter((report) => {
    if (selectedTypeFilter === "all") return true;
    return report.type.toLowerCase() === selectedTypeFilter.toLowerCase();
  });

  return (
    <PageLayout
      title="Financial Reports Center"
      subtitle="Statements, statutory tax compliance, audit packages, and ad-hoc inquiries"
      actions={
        <>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedule Automation
          </Button>
          <Button className="gap-2 bg-[#42688C] text-white hover:bg-[#52789B]">
            <Plus className="h-4 w-4" /> Generate Report
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Reports Generated", value: "142", helper: "+18.3% year to date" },
            { label: "Pending Queue", value: "3", helper: "Awaiting generation run" },
            { label: "Last Ledger Close", value: "Jun 1", helper: "Q2 cycle, 2 days early" },
            { label: "Next Scheduled Run", value: "Jul 1", helper: "Consolidated financial package" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm">
              <p className="text-sm font-medium text-[#9CB4CA]">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-[#9CB4CA]">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Available Core Templates</h2>
            <p className="text-sm text-[#9CB4CA]">Run common finance, tax, audit, and management reports.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templateCards.map(({ icon: Icon, ...template }) => (
              <article
                key={template.title}
                className="group flex min-h-44 flex-col justify-between rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] p-5 shadow-sm transition hover:border-[#42688C]/50 hover:shadow-md"
              >
                <div>
                  <Icon className="mb-3 h-5 w-5 text-[#9CB4CA] transition group-hover:text-[#E2F4DF]" />
                  <h3 className="text-base font-semibold text-white">{template.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-[#9CB4CA]">{template.desc}</p>
                </div>
                <span className="mt-4 inline-flex w-fit rounded-full bg-[#1A2846] px-2.5 py-1 text-xs font-semibold text-[#B8CBE0] ring-1 ring-[#42688C]/30">
                  {template.type}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#42688C]/30 bg-[#0C0F1D] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#42688C]/30 bg-[#13203A] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Report Library</h2>
              <p className="text-sm text-[#9CB4CA]">Generated reports, file sizes, and processing status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="mr-1 h-4 w-4 text-[#9CB4CA]" />
              {["all", "financial", "management", "tax", "compliance"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    selectedTypeFilter === type
                      ? "border-[#42688C] bg-[#42688C] text-white"
                      : "border-[#42688C]/30 bg-[#0C0F1D] text-[#9CB4CA] hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-[#42688C]/30 bg-[#13203A]">
                <tr className="text-xs uppercase tracking-wide text-[#9CB4CA]">
                  <th className="px-5 py-3">Report ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Generated</th>
                  <th className="px-5 py-3">Size</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLibrary.map((report) => (
                  <tr key={report.id} className="border-b border-[#42688C]/20 transition-colors last:border-0 hover:bg-[#13203A]">
                    <td className="px-5 py-4 text-xs font-medium text-[#9CB4CA]">{report.id}</td>
                    <td className="px-5 py-4 font-semibold text-white">{report.name}</td>
                    <td className="px-5 py-4 text-[#B8CBE0]">{report.type}</td>
                    <td className="px-5 py-4 text-[#9CB4CA]">{report.generated}</td>
                    <td className="px-5 py-4 text-[#9CB4CA]">{report.size}</td>
                    <td className="px-5 py-4"><StatusBadge status={report.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button title="View Preview" className="text-[#9CB4CA] transition-colors hover:text-[#E2F4DF]">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button title="Download Package" className="text-[#9CB4CA] transition-colors hover:text-[#E2F4DF]">
                          <Download className="h-4 w-4" />
                        </button>
                        <button title="Print Physical Copy" className="text-[#9CB4CA] transition-colors hover:text-[#E2F4DF]">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLibrary.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-[#9CB4CA]">
                      No report logs found matching the selected type filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#42688C]/30 bg-[#1A2846]/70 px-5 py-3 text-xs text-[#9CB4CA]">
            <span>Updated from Qwetu POS sales, expenses, payroll, and branch records</span>
            <span>Showing {filteredLibrary.length} of {reportList.length} total entries</span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
