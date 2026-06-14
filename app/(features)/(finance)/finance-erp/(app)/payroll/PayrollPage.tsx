"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '../../../_components/page-layout';
import { 
  Download, 
  UploadCloud, 
  Send, 
  Eye, 
  EyeOff, 
  ShieldCheck 
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

// ── CUSTOM STATUS BADGE FOR THE CHOSEN RESTRUCTURING ──
const StatusBadge = ({ status }: { status: "paid" | "scheduled" | "failed" }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] capitalize font-medium ${styles[s] || 'bg-muted text-muted-foreground border-border'}`}>
      {status}
    </span>
  );
};

export default function PayrollPage() {
  const [tab, setTab] = useState<"payroll" | "history" | "schedule">("payroll");
  const [showBalance, setShowBalance] = useState(true);

  // ── ORIGINAL TABLE DATA 1: EMPLOYEES (STATUS ALIGNED TO DESIGN CONSTRAINTS) ──
  const employees: Array<{
    id: string;
    name: string;
    dept: string;
    position: string;
    salary: number;
    status: "paid" | "scheduled" | "failed";
    advances: number;
    loans: number;
    bank: string;
    payDate: string;
  }> = [
    { id: 'EMP001', name: 'John Mwangi', dept: 'Sales', position: 'Sales Manager', salary: 45000, status: 'paid', advances: 0, loans: 10000, bank: 'Equity Bank ****4321', payDate: '2026-07-01' },
    { id: 'EMP002', name: 'Sarah Kipchoge', dept: 'G&A / Finance', position: 'Accountant', salary: 38000, status: 'paid', advances: 5000, loans: 0, bank: 'KCB Bank ****8849', payDate: '2026-07-01' },
    { id: 'EMP003', name: 'James Kiplagat', dept: 'Operations', position: 'Store Manager', salary: 32000, status: 'scheduled', advances: 0, loans: 8000, bank: 'Co-op Bank ****1102', payDate: '2026-07-01' },
    { id: 'EMP004', name: 'Mary Kariuki', dept: 'Sales', position: 'Cashier', salary: 18000, status: 'paid', advances: 2000, loans: 0, bank: 'NCBA Bank ****9931', payDate: '2026-07-01' },
    { id: 'EMP005', name: 'David Okoyo', dept: 'Operations', position: 'Delivery Driver', salary: 22000, status: 'failed', advances: 0, loans: 5000, bank: 'Absa Bank ****5541', payDate: '2026-07-01' },
  ];

  // ── ORIGINAL SUMMARY & BREAKDOWNS ──
  const payrollSummary = {
    totalPayroll: 155000,
    upcomingPayroll: 180000,
    advances: 7000,
    loans: 23000,
  };

  const payrollHistory = [
    { month: 'Jan', total: 142000 },
    { month: 'Feb', total: 145000 },
    { month: 'Mar', total: 148000 },
    { month: 'Apr', total: 151000 },
    { month: 'May', total: 153000 },
    { month: 'Jun', total: 155000 },
  ];

  const fmt = (val: number) => `KES ${val.toLocaleString()}`;

  return (
    <PageLayout
      title="Salary & Payroll Management"
      subtitle="Employee compensation · Salary advances · Deductions · Pay runs"
      actions={
        <>
          <Button variant="outline" className="gap-2 text-xs">
            <UploadCloud className="h-3.5 w-3.5" /> Import
          </Button>
          <Button variant="outline" className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Payslips
          </Button>
          <Button className="gap-2 text-xs">
            <Send className="h-3.5 w-3.5" /> Process Payroll
          </Button>
        </>
      }
    >
      <div className="space-y-6 font-sans">
        
        {/* ── HIGHLIGHT METRICS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Payroll Cost</p>
            <p className="text-2xl font-bold text-foreground mt-1">{fmt(payrollSummary.totalPayroll)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">June 2026 cycle · 352 employees total</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Upcoming Pay Run</p>
            <p className="text-2xl font-bold text-foreground mt-1">{fmt(payrollSummary.upcomingPayroll)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Scheduled for July 1, 2026</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Salary Advances</p>
            <p className="text-2xl font-bold text-foreground mt-1">{fmt(payrollSummary.advances)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Active payroll deductions</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Outstanding Loans</p>
            <p className="text-2xl font-bold text-foreground mt-1">{fmt(payrollSummary.loans)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Company financed employee assets</p>
          </div>
        </div>

        {/* ── VISUAL INSIGHTS & BREAKDOWNS ── */}
        <div className="grid lg:grid-cols-3 gap-4">
          
          {/* Card 1: Next Pay Run Structure */}
          <div className="rounded-lg bg-card border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Next Pay Run Breakdown</p>
                <span className="text-[10px] text-primary font-semibold">Jul 1, 2026</span>
              </div>
              <div className="text-2xl font-bold mt-2 mb-1 text-foreground">
                {showBalance ? fmt(180000) : "••••••••••"}
              </div>
              <div className="text-[10px] text-muted-foreground">Direct Bank Deposit Cycle</div>
              
              <div className="mt-4 space-y-2 border-t border-border pt-3">
                {[
                  { label: "Base Salaries", value: 155000 },
                  { label: "Bonuses & Commissions", value: 32000 },
                  { label: "Salary Advance Offsets", value: -7000 },
                  { label: "Loan Deductions", value: -3200 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{showBalance ? fmt(item.value) : "••••"}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 border border-primary/30 text-primary text-xs hover:bg-primary/5 transition-colors rounded-md font-medium">
              Preview & Approve →
            </button>
          </div>

          {/* Card 2: Headcount Breakdown */}
          <div className="rounded-lg bg-card border border-border p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Headcount Breakdown</p>
            {[
              { dept: "Engineering", count: 142, pct: 40 },
              { dept: "Sales", count: 84, pct: 24 },
              { dept: "R&D", count: 48, pct: 14 },
              { dept: "Operations", count: 38, pct: 11 },
              { dept: "G&A / Finance", count: 22, pct: 6 },
              { dept: "Legal & HR", count: 18, pct: 5 },
            ].map(d => (
              <div key={d.dept} className="mb-2.5">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{d.dept}</span>
                  <span className="text-xs text-foreground font-semibold">{d.count}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Card 3: Expenditure Chart */}
          <div className="rounded-lg bg-card border border-border p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Payroll Expenditure Trend</p>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollHistory} margin={{ left: -20, right: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `K${(v / 1000)}k`} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.01)" }} />
                    <Bar dataKey="total" name="Payroll Cost" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>YoY Headcount growth: +13%</span>
              <span className="text-green-600 font-medium">352 active workers</span>
            </div>
          </div>
        </div>

        {/* ── TAB DETAILS VIEW ── */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          
          {/* Header Controls */}
          <div className="flex items-center border-b border-border px-5 bg-muted/20">
            <div className="flex gap-1">
              {[
                { id: "payroll", label: "Employee Directory" },
                { id: "history", label: "Payment History" },
                { id: "schedule", label: "Pay Schedule & Compliance" },
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`text-xs py-3.5 px-4 border-b-2 transition-colors font-medium -mb-[1px] ${
                    tab === t.id 
                      ? "border-primary text-foreground font-semibold" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            
            <div className="ml-auto">
              <button 
                onClick={() => setShowBalance(!showBalance)} 
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors py-3"
              >
                {showBalance ? <Eye size={13} /> : <EyeOff size={13} />}
                {showBalance ? "Hide" : "Show"} Figures
              </button>
            </div>
          </div>

          {/* Tab 1: Full Employee Directory Table Data */}
          {tab === "payroll" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employee ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department / Role</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Salary</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Advances</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loans</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pay Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-medium text-muted-foreground">{emp.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 bg-muted border border-border flex items-center justify-center text-[9px] font-bold text-foreground rounded-md shrink-0">
                            {emp.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-foreground">{emp.name}</div>
                            <div className="text-[10px] text-muted-foreground/80">{emp.bank}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-xs text-foreground font-medium">{emp.position}</div>
                        <div className="text-[10px] text-muted-foreground">{emp.dept}</div>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-foreground">
                        {showBalance ? fmt(emp.salary) : "••••••"}
                      </td>
                      <td className="px-5 py-3 text-right text-foreground">
                        {emp.advances > 0 ? (showBalance ? fmt(emp.advances) : "••••") : "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-foreground">
                        {emp.loans > 0 ? (showBalance ? fmt(emp.loans) : "••••") : "—"}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{emp.payDate}</td>
                      <td className="px-5 py-3"><StatusBadge status={emp.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Full Historic Run Processing Logs Table Data */}
          {tab === "history" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pay Run ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Period</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Processed Employees</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross Payout</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Released</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Settlement Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "PR-2026-06", period: "June 2026", emp: 352, gross: 185000, net: 174800, status: "paid" as const, date: "2026-06-01" },
                    { id: "PR-2026-05", period: "May 2026", emp: 341, gross: 179000, net: 169200, status: "paid" as const, date: "2026-05-01" },
                    { id: "PR-2026-04", period: "April 2026", emp: 328, gross: 171000, net: 161000, status: "failed" as const, date: "2026-04-01" },
                    { id: "PR-2026-03", period: "March 2026", emp: 321, gross: 166000, net: 156300, status: "paid" as const, date: "2026-03-01" },
                  ].map(pr => (
                    <tr key={pr.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-medium text-muted-foreground">{pr.id}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-foreground">{pr.period}</td>
                      <td className="px-5 py-3 text-xs text-foreground">{pr.emp}</td>
                      <td className="px-5 py-3 text-right text-red-600 font-medium">{showBalance ? fmt(pr.gross) : "••••"}</td>
                      <td className="px-5 py-3 text-right text-emerald-600 font-semibold">{showBalance ? fmt(pr.net) : "••••"}</td>
                      <td className="px-5 py-3"><StatusBadge status={pr.status} /></td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{pr.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Remittance & Deadlines */}
          {tab === "schedule" && (
            <div className="p-5">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Upcoming Remittance Disbursals</p>
                  {[
                    { run: "July 2026 Cycle Base Payroll", date: "2026-07-01", amount: 180000, status: "scheduled" as const },
                    { run: "August 2026 Cycle Base Payroll", date: "2026-08-01", amount: 182500, status: "scheduled" as const },
                    { run: "Q3 Commission & Bonus Disbursal", date: "2026-09-15", amount: 45000, status: "scheduled" as const },
                  ].map(s => (
                    <div key={s.run} className="flex items-center gap-3 border border-border p-3 mb-2 rounded-lg bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-foreground">{s.run}</div>
                        <div className="text-[10px] text-muted-foreground">{s.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-foreground">{showBalance ? fmt(s.amount) : "••••"}</div>
                        <div className="mt-1"><StatusBadge status={s.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Statutory & Regulatory Deadlines</p>
                  {[
                    { label: "PAYE Tax Settlement Deposit", due: "2026-06-30", type: "KRA" },
                    { label: "SHIF Health Insurance Contribution", due: "2026-07-09", type: "SHA" },
                    { label: "NSSF Tier I & II Savings Remittance", due: "2026-07-09", type: "Statutory" },
                    { label: "Housing Levy Remittance Filing", due: "2026-07-20", type: "KRA" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-3 border border-border p-3 mb-2 rounded-lg bg-muted/10 hover:bg-muted/30 transition-colors">
                      <ShieldCheck size={14} className="text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-foreground">{c.label}</div>
                        <div className="text-[10px] text-muted-foreground">Due By: {c.due}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Design 2 Layout Footer Controls */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/10">
            <span className="text-[10px] text-muted-foreground">Viewing data for the June 2026 financial settlement engine</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "…", "18"].map(p => (
                <button 
                  key={p} 
                  className={`w-6 h-6 text-[10px] flex items-center justify-center border rounded-md transition-colors ${
                    p === "1" 
                      ? "border-primary text-primary bg-primary/10 font-bold" 
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}