"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '../../../_components/page-layout';
import { 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

// ── TYPINGS FOR RECHARTS INTERNAL CUSTOM COMPONENT PAYLOADS ──
interface ChartPayloadItem {
  name: string;
  value: number;
  stroke?: string;
  fill?: string;
}

interface CustomChartTipProps {
  active?: boolean;
  payload?: ChartPayloadItem[];
  label?: string;
}

// ── RAW DATA LOGIC ──
const revenueMonthly = [
  { month: "Jan", revenue: 4820000, expenses: 3140000, net: 1680000, budget: 4330000 },
  { month: "Feb", revenue: 5210000, expenses: 3380000, net: 1830000, budget: 4370000 },
  { month: "Mar", revenue: 4990000, expenses: 3520000, net: 1470000, budget: 4410000 },
  { month: "Apr", revenue: 6340000, expenses: 3710000, net: 2630000, budget: 4450000 },
  { month: "May", revenue: 7120000, expenses: 4020000, net: 310000,  budget: 4490000 },
  { month: "Jun", revenue: 6880000, expenses: 3890000, net: 2990000, budget: 4530000 },
];

const forecastExtendedData = [
  ...revenueMonthly,
  { month: "Jul", revenue: 920000, expenses: 5100000, net: 4100000, budget: 4570000 },
  { month: "Aug", revenue: 9500000, expenses: 5200000, net: 4300000, budget: 4610000 },
  { month: "Sep", revenue: 9800000, expenses: 5300000, net: 4500000, budget: 4650000 },
  { month: "Oct", revenue: 10200000, expenses: 5500000, net: 4700000, budget: 4690000 },
  { month: "Nov", revenue: 10800000, expenses: 5700000, net: 5100000, budget: 4730000 },
  { month: "Dec", revenue: 11400000, expenses: 5900000, net: 5500000, budget: 4770000 },
];

const departmentalUtilization = [
  { dept: "Engineering", budget: 14200000, spent: 13840000, forecast: 14900000, variance: -700000, pct: -4.9 },
  { dept: "Sales & Marketing", budget: 12400000, spent: 11980000, forecast: 12800000, variance: -400000, pct: -3.1 },
  { dept: "R&D", budget: 8100000, spent: 8870000, forecast: 9400000, variance: 770000, pct: 9.5 },
  { dept: "Operations", budget: 7200000, spent: 6840000, forecast: 7100000, variance: -200000, pct: -2.8 },
  { dept: "G&A", budget: 5600000, spent: 4980000, forecast: 5400000, variance: -200000, pct: -3.6 },
  { dept: "IT Infrastructure", budget: 4500000, spent: 4920000, forecast: 5200000, variance: 420000, pct: 9.3 },
];

// ── LOCAL HELPERS ──
const formatCurrency = (val: number, precise = false) => {
  if (Math.abs(val) >= 1000000) {
    return `${val < 0 ? '-' : ''}$${(Math.abs(val) / 1000000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: precise ? 0 : 2
  }).format(val);
};

// ── CHART TOOLTIP ALIGNED TO THE GEIST ROOT HOOKS VARIABLE ──
const CustomChartTip = ({ active, payload, label }: CustomChartTipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 shadow-md rounded-md font-sans text-xs">
        <p className="font-semibold text-foreground mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
                {p.name}:
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(p.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function BudgetingPage() {
  return (
    <PageLayout
      title="Budgeting & Forecasting"
      subtitle="FY 2026 · Distributed Resource Allocations & Predictive Financial Models"
      actions={
        <>
          <Button variant="outline" className="gap-2 text-xs font-sans">
            <Filter className="h-3.5 w-3.5" /> Fiscal Period
          </Button>
          <Button variant="outline" className="gap-2 text-xs font-sans">
            <Download className="h-3.5 w-3.5" /> Export Schema
          </Button>
          <Button className="gap-2 text-xs font-sans">
            <Plus className="h-3.5 w-3.5" /> Establish New Budget
          </Button>
        </>
      }
    >
      {/* Container tracking font-sans tied directly to --font-sans variable definitions */}
      <div className="space-y-6 font-sans">

        {/* ── HIGH LEVEL FISCAL PERFORMANCE RUNWAY KPIs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Budget FY26</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">52.0M</p>
            <p className="text-[10px] text-muted-foreground mt-1">Approved Board Allocation Plan</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">YTD Consolidated Spend</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">47.6M</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-medium text-red-500 flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +8.2%
              </span>
              <span className="text-[10px] text-muted-foreground">91.5% of Runway Expended</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Remaining Liquid Reserves</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">4.4M</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-medium text-green-500 flex items-center gap-0.5">
                <ArrowDownRight size={10} /> -64.8%
              </span>
              <span className="text-[10px] text-muted-foreground">6 Months Remaining cycle</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Forecast Variance Delta</p>
            <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">+$2.1M</p>
            <div className="flex items-center gap-1 mt-1 text-amber-500">
              <AlertTriangle size={11} />
              <span className="text-[10px] font-medium">Over Approved Target Baseline</span>
            </div>
          </div>
        </div>

        {/* ── DETAILED DEPARTMENTAL LIQUID UTILIZATION ── */}
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-4">
            Budget Utilization & Over-Run Trajectories by Division
          </p>
          <div className="space-y-5">
            {departmentalUtilization.map((d) => {
              const pctSpent = Math.round((d.spent / d.budget) * 100);
              const isOverBudget = d.spent > d.budget;

              return (
                <div key={d.dept} className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                    <span className="text-xs font-semibold text-foreground">{d.dept}</span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground">
                      <span>Budget: <strong className="text-foreground/80">{formatCurrency(d.budget, true)}</strong></span>
                      <span className={`${isOverBudget ? "text-red-500 font-semibold" : "text-foreground/80"}`}>
                        Spent: {formatCurrency(d.spent, true)}
                      </span>
                      <span>Forecasted Run: <strong className="text-foreground/80">{formatCurrency(d.forecast, true)}</strong></span>
                    </div>
                  </div>
                  
                  {/* Progress Matrix Rail */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOverBudget ? "bg-red-500" : "bg-amber-500"
                      }`} 
                      style={{ width: `${Math.min(pctSpent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[9px] font-mono tracking-tight">
                    <span className={isOverBudget ? "text-red-500 font-medium" : "text-muted-foreground"}>
                      {pctSpent}% capacity consumed
                    </span>
                    {isOverBudget && (
                      <span className="text-red-400 font-medium animate-pulse flex items-center gap-0.5">
                        Budget Threshold Violated
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TWO-COLUMN CHARTS ANALYSIS BLOCK ── */}
        <div className="grid lg:grid-cols-2 gap-4">
          
          {/* Monthly Operational Burn Graph */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-4">
              Monthly Operational Burn Profile vs Baseline Target
            </p>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueMonthly} margin={{ left: -20, right: 10, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip content={<CustomChartTip />} />
                  <Line type="monotone" dataKey="expenses" name="Actual Ledger Expenditure" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="budget" name="Approved Plan Target" stroke="currentColor" className="text-muted" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Departmental Variance Logs */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-4">
              Fiscal Variance Account Summaries
            </p>
            <div className="divide-y divide-border">
              {departmentalUtilization.map((v) => {
                const isOverBudgetDelta = v.variance > 0;
                return (
                  <div key={v.dept} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-xs text-foreground font-medium">{v.dept}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-semibold ${isOverBudgetDelta ? "text-red-500" : "text-green-500"}`}>
                        {v.variance > 0 ? '+' : ''}{formatCurrency(v.variance, true)}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                        isOverBudgetDelta ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"
                      }`}>
                        {v.pct > 0 ? '+' : ''}{v.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ADVANCED FORECASTING HORIZON ── */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
              12-Month Rolling Forecast Horizon & Scalability Model
            </p>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium font-sans">
              <TrendingUp size={13} />
              <span>Predictive AI Trend</span>
            </div>
          </div>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastExtendedData} margin={{ left: -20, right: 10, top: 5 }}>
                <defs>
                  <linearGradient id="qForecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-sans)" }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomChartTip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Gross Target Revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={2} 
                  fill="url(#qForecastFill)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}