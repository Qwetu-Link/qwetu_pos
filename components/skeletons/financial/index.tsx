import {
  CardGridSkeleton,
  ChartPanelSkeleton,
  DetailPanelSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
  SkeletonBlock,
  SkeletonIcon,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/skeletons";

function SideListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-2">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="h-3 w-48" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
            <SkeletonIcon className="h-10 w-10 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <SkeletonBlock className="h-4 w-4 rounded-full" />
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProgressListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <SkeletonBlock className="mb-5 h-4 w-44" />
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-3 w-28" />
              </div>
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <SkeletonBlock className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceShellSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 text-slate-900">
      {children}
    </div>
  );
}

export function FinancialOverviewSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton count={6} />
      <div className="grid gap-4 lg:grid-cols-3">
        <DetailPanelSkeleton />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <ChartPanelSkeleton tall />
        </div>
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <TableSkeleton rows={5} columns={5} />
        <SideListSkeleton rows={4} />
      </div>
    </FinanceShellSkeleton>
  );
}

export function FinancialSalesSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <CardGridSkeleton count={4} columns="lg:grid-cols-4" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TableSkeleton rows={6} columns={7} />
        <SideListSkeleton rows={3} />
      </div>
    </FinanceShellSkeleton>
  );
}

export function FinancialPaymentsSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <CardGridSkeleton count={4} columns="lg:grid-cols-4" />
      <TableSkeleton rows={7} columns={7} />
    </FinanceShellSkeleton>
  );
}

export function FinancialExpensesSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TableSkeleton rows={7} columns={6} />
        <SideListSkeleton rows={4} />
      </div>
    </FinanceShellSkeleton>
  );
}

export function FinancialRefundsSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TableSkeleton rows={5} columns={7} />
        <SideListSkeleton rows={2} />
      </div>
    </FinanceShellSkeleton>
  );
}

export function FinancialWalletsSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TableSkeleton rows={5} columns={7} />
        <div className="space-y-6">
          <SideListSkeleton rows={3} />
          <SideListSkeleton rows={3} />
        </div>
      </div>
    </FinanceShellSkeleton>
  );
}

export function FinancialPayrollSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3">
        <DetailPanelSkeleton />
        <ProgressListSkeleton rows={6} />
      </div>
      <TableSkeleton rows={6} columns={8} />
    </FinanceShellSkeleton>
  );
}

export function FinancialBudgetingSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={3} />
      <StatCardsSkeleton />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ProgressListSkeleton rows={4} />
        <SideListSkeleton rows={3} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
      </div>
      <CardGridSkeleton count={3} columns="lg:grid-cols-3" />
    </FinanceShellSkeleton>
  );
}

export function FinancialAddBudgetSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-10 rounded-lg" />
          <SkeletonBlock className="h-10 rounded-lg" />
        </div>
      </div>
      <TableSkeleton rows={4} columns={6} />
    </FinanceShellSkeleton>
  );
}

export function FinancialReportsSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <CardGridSkeleton count={6} columns="lg:grid-cols-3" />
      <FilterBarSkeleton controls={4} />
      <TableSkeleton rows={7} columns={7} />
    </FinanceShellSkeleton>
  );
}

export function FinancialBranchesSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <FilterBarSkeleton controls={3} />
      <CardGridSkeleton count={6} columns="lg:grid-cols-2" />
      <ChartPanelSkeleton />
    </FinanceShellSkeleton>
  );
}

export function FinancialSettingsSkeleton() {
  return (
    <FinanceShellSkeleton>
      <PageHeaderSkeleton actions={0} />
      <CardGridSkeleton count={6} columns="lg:grid-cols-2" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-16 rounded-xl" />
        ))}
      </div>
    </FinanceShellSkeleton>
  );
}
