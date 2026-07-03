"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '../../../_components/page-layout';
import { 
  Download, 
  Calendar, 
  Plus, 
  Filter, 
  Eye, 
  Printer, 
  BarChart2, 
  Landmark, 
  ArrowLeftRight, 
  PieChart as PieChartIcon, 
  FileText, 
  ShieldCheck,
} from 'lucide-react';

// ── CONSOLIDATED RAW DATA STRUCTURES ──
const reportList = [
  { id: "RPT-2026-Q2", name: "Q2 2026 Financial Statements", type: "Financial", generated: "2026-06-14", size: "4.2 MB", status: "paid" as const },
  { id: "RPT-2026-Q1", name: "Q1 2026 Financial Statements", type: "Financial", generated: "2026-03-31", size: "3.9 MB", status: "paid" as const },
  { id: "RPT-TAX-Q2", name: "Q2 Tax Filing Package", type: "Tax", generated: "2026-06-10", size: "8.1 MB", status: "scheduled" as const },
  { id: "RPT-AUDIT-2025", name: "FY 2025 Audit Report", type: "Compliance", generated: "2026-02-28", size: "12.4 MB", status: "paid" as const },
  { id: "RPT-CONSOL", name: "Consolidated Balance Sheet", type: "Financial", generated: "2026-06-13", size: "1.8 MB", status: "paid" as const },
  { id: "RPT-CF-MAY", name: "Cash Flow Statement — May", type: "Financial", generated: "2026-06-01", size: "2.1 MB", status: "paid" as const },
  { id: "RPT-VARIANCE", name: "Budget Variance Analysis Q2", type: "Management", generated: "2026-06-12", size: "3.3 MB", status: "failed" as const },
];

const templateCards = [
  { icon: <BarChart2 size={18} />, title: "P&L Statement", desc: "Income, COGS, gross profit, operating expenses, net income", type: "Financial" },
  { icon: <Landmark size={18} />, title: "Balance Sheet", desc: "Assets, liabilities, and shareholders equity snapshot", type: "Financial" },
  { icon: <ArrowLeftRight size={18} />, title: "Cash Flow Statement", desc: "Operating, investing, and financing activities", type: "Financial" },
  { icon: <PieChartIcon size={18} />, title: "Budget Variance Report", desc: "Actual vs budget by department and cost center", type: "Management" },
  { icon: <FileText size={18} />, title: "Tax Package", desc: "Consolidated tax filings — regional statutory allocations", type: "Tax" },
  { icon: <ShieldCheck size={18} />, title: "Audit Report", desc: "External auditor findings and management responses", type: "Compliance" },
];

// ── STATUS BADGE MATCHING THE RESTRUCTURED SCHEMATIC ──
const StatusBadge = ({ status }: { status: "paid" | "scheduled" | "failed" }) => {
  const styles = {
    paid: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
    scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
  };

  const labelMapping = {
    paid: 'cleared',
    scheduled: 'pending',
    failed: 'draft'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-semibold ${styles[status]}`}>
      {labelMapping[status]}
    </span>
  );
};

export default function ReportsPage() {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");

  const filteredLibrary = reportList.filter(r => {
    if (selectedTypeFilter === "all") return true;
    return r.type.toLowerCase() === selectedTypeFilter.toLowerCase();
  });

  return (
    <PageLayout
      title="Financial Reports Center"
      subtitle="Statements · Statutory Tax Compliance · Audit Packages · Ad-hoc Inquiries"
      actions={
        <>
          <Button variant="outline" className="gap-2 text-xs font-sans">
            <Calendar className="h-3.5 w-3.5" /> Schedule Automation
          </Button>
          <Button className="gap-2 text-xs font-sans">
            <Plus className="h-3.5 w-3.5" /> Generate Report
          </Button>
        </>
      }
    >
      {/* Root configuration tied to --font-sans layout variables */}
      <div className="space-y-6 font-sans">
        
        {/* ── HIGH LEVEL EXECUTIVE KPI METRICS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Reports Generated</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">142</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-medium">+18.3% Year to Date</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Pending Queue</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">3</p>
            <p className="text-[10px] text-muted-foreground mt-1">Awaiting generation run</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Last Ledger Close</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">Jun 1</p>
            <p className="text-[10px] text-muted-foreground mt-1">Q2 Cycle · 2 days early</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Next Scheduled Run</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">Jul 1</p>
            <p className="text-[10px] text-muted-foreground mt-1">Consolidated Financial Package</p>
          </div>
        </div>

        {/* ── REPORT ARCHETYPE TEMPLATES GRID ── */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Available Core Templates</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templateCards.map((t) => (
              <div 
                key={t.title} 
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors mb-2.5">
                    {t.icon}
                  </div>
                  <h3 className="text-xs font-semibold text-foreground mb-1">{t.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                </div>
                <div>
                  <span className="text-[9px] font-semibold font-sans px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground uppercase tracking-wider">
                    {t.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONSOLIDATED RE-ENGINEERED LIBRARY ARCHIVE TABLE ── */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          
          {/* Filtering Header Interface */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Report Library Data Archive</p>
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-muted-foreground mr-1" />
              {["all", "financial", "management", "tax", "compliance"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`text-[10px] px-2.5 py-1 rounded-md border font-medium transition-colors capitalize font-sans ${
                    selectedTypeFilter === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Library Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Report ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classification Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated On</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">File Allocation</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action Links</th>
                </tr>
              </thead>
              <tbody>
                {filteredLibrary.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-muted-foreground tracking-tight">{r.id}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-foreground">{r.name}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground font-medium">{r.type}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.generated}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground font-medium">{r.size}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button title="View Preview" className="text-muted-foreground hover:text-primary transition-colors">
                          <Eye size={13} />
                        </button>
                        <button title="Download Package" className="text-muted-foreground hover:text-primary transition-colors">
                          <Download size={13} />
                        </button>
                        <button title="Print Physical Copy" className="text-muted-foreground hover:text-primary transition-colors">
                          <Printer size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLibrary.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground">
                      No report logs found matching the selected type filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Data Footer context */}
          <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Synchronized with central Qwetulink ERP Ledger</span>
            <span>Showing {filteredLibrary.length} of {reportList.length} total entries</span>
          </div>
          
        </div>

      </div>
    </PageLayout>
  );
}