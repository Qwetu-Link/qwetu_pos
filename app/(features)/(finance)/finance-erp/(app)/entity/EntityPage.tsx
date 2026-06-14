"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '../../../_components/page-layout';
import { 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  Building2, 
  TrendingUp, 
  Users, 
  Globe 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// ── EXTRACTED ENTITIES ALIGNED WITH QWETULINKS CAMPUS PROPERTY VARIATIONS ──
const entities = [
  { id: "ENT-001", name: "Qwetu Aberdare Heights (USIU)", type: "Premium Hub", country: "Kenya", currency: "KES", employees: 142, revenue: 62300000, status: "paid" as const },
  { id: "ENT-002", name: "Qwetu Hurlingham Hub", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 86, revenue: 18400000, status: "paid" as const },
  { id: "ENT-003", name: "Qwetu Jogoo Road Residence", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 94, revenue: 9200000, status: "paid" as const },
  { id: "ENT-004", name: "Qwetu Parklands Properties", type: "Premium Hub", country: "Kenya", currency: "KES", employees: 72, revenue: 5800000, status: "scheduled" as const },
  { id: "ENT-005", name: "Qwetu Ruaraka Residences", type: "JV Portfolio", country: "Kenya", currency: "KES", employees: 24, revenue: 2100000, status: "scheduled" as const },
  { id: "ENT-006", name: "Qwetu Catholic University Link", type: "Standard Hub", country: "Kenya", currency: "KES", employees: 38, revenue: 3400000, status: "failed" as const },
];

const StatusBadge = ({ status }: { status: "paid" | "scheduled" | "failed" }) => {
  const styles = {
    paid: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
    scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
  };

  const labelMapping = {
    paid: 'active',
    scheduled: 'pending run',
    failed: 'under review'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-semibold ${styles[status]}`}>
      {labelMapping[status]}
    </span>
  );
};

// ── CUSTOM REGIONAL EAST AFRICAN MONEY FORMATTER ──
const fmtMoney = (val: number) => {
  return `KES ${val.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
};

export default function EntitiesPage() {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEntities = entities.filter(e => {
    if (filterType === "all") return true;
    return e.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <PageLayout
      title="Property Entities & Branches"
      subtitle="Corporate portfolio configuration · Inter-branch allocations · Consolidated rental revenue"
      actions={
        <>
          <Button variant="outline" className="gap-2 text-xs font-sans">
            <Download className="h-3.5 w-3.5" /> Export Group Data
          </Button>
          <Button className="gap-2 text-xs font-sans">
            <Plus className="h-3.5 w-3.5" /> Add New Branch
          </Button>
        </>
      }
    >
      {/* Container tracking font-sans tied directly to your defined --font-sans configuration */}
      <div className="space-y-6 font-sans">
        
        {/* ── HIGHLIGHT METRICS (NORMALIZED TO LOCAL KES RUN RATES) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Branches</p>
              <Building2 className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">6</p>
            <p className="text-[10px] text-muted-foreground mt-1">2 Premium · 3 Standard · 1 JV</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Staffing</p>
              <Users className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">456</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-medium">+12.1% Operations Scale</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Consolidated Rev</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">KES 101.2M</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-medium">+14.2% FY2026 Run-rate</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Base Currency</p>
              <Globe className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">KES</p>
            <p className="text-[10px] text-muted-foreground mt-1">Unified Regional Ledger</p>
          </div>
        </div>

        {/* ── SEGMENT FILTERS ── */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex gap-2">
            {[
              { id: "all", label: "all portfolios" },
              { id: "premium", label: "premium hubs" },
              { id: "standard", label: "standard residences" },
              { id: "jv", label: "joint ventures" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium capitalize font-sans ${
                  filterType === t.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground tracking-wide">Showing {filteredEntities.length} of 6 records</span>
        </div>

        {/* ── PROPERTY ENTITY CARDS LISTING ── */}
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredEntities.map((e) => (
            <div 
              key={e.id} 
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">{e.name}</h3>
                    <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 font-sans">
                      <span className="bg-muted px-1.5 py-0.5 rounded border border-border/60 font-semibold">{e.id}</span>
                      <span>•</span>
                      <span>{e.type}</span>
                      <span>•</span>
                      <span>{e.country}</span>
                    </div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 bg-muted/30 border border-border/50 rounded-md p-3">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Reporting Currency</div>
                    <div className="text-xs font-bold text-foreground mt-0.5 tracking-tight">{e.currency}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Operations Staff</div>
                    <div className="text-xs font-bold text-foreground mt-0.5 tracking-tight">{e.employees.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Annualized Revenue</div>
                    <div className="text-xs font-bold text-foreground mt-0.5 tracking-tight">{fmtMoney(e.revenue)}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/80">
                <button className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-sans">
                  <Eye size={12} /> View Ledger Balance
                </button>
                <button className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-sans">
                  <Edit3 size={12} /> Property Configurations
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART TRACKING REVENUE PER CAMPUS LINK BRANCH ── */}
        <div className="rounded-lg bg-card border border-border p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-4">
            Annualized Branch Portfolio Contribution (KES Millions)
          </p>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={entities.map(e => ({ 
                  shortName: e.name.replace("Qwetu ", "").split(" ")[0], 
                  revenueKES: e.revenue / 1000000 
                }))} 
                margin={{ left: -15, right: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={v => `KSh ${v}M`} 
                />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{ 
                    background: "hsl(var(--card))", 
                    borderRadius: "6px", 
                    border: "1px solid hsl(var(--border))", 
                    fontSize: "11px",
                    fontFamily: "var(--font-sans)"
                  }}
                />
                <Bar 
                  dataKey="revenueKES" 
                  name="Revenue Base (KES)" 
                  fill="hsl(var(--primary))" 
                  radius={[3, 3, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}