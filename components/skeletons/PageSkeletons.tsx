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
} from "./SkeletonPrimitives";

export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton actions={1} />
        <StatCardsSkeleton />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ChartPanelSkeleton tall />
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <SkeletonIcon className="h-9 w-9" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export function CatalogPageSkeleton() {
  return (
    <main className="space-y-6 rounded-xl bg-gray-50 p-6">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <FilterBarSkeleton controls={2} />
      <CardGridSkeleton count={6} />
    </main>
  );
}

export function CategoryPageSkeleton() {
  return (
    <main className="space-y-6 rounded-xl bg-gray-50 p-6">
      <PageHeaderSkeleton actions={1} />
      <StatCardsSkeleton count={3} />
      <FilterBarSkeleton controls={1} />
      <TableSkeleton rows={6} columns={5} />
    </main>
  );
}

export function CustomersPageSkeleton() {
  return (
    <main className="space-y-6 bg-slate-50 p-4 md:p-6">
      <PageHeaderSkeleton actions={1} />
      <StatCardsSkeleton />
      <FilterBarSkeleton controls={2} />
      <CardGridSkeleton count={6} />
    </main>
  );
}

export function OrdersPageSkeleton() {
  return (
    <main className="space-y-6 bg-slate-50 p-4 md:p-6">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton count={5} />
      <FilterBarSkeleton controls={3} />
      <TableSkeleton rows={8} columns={7} />
    </main>
  );
}

export function InventoryPageSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton actions={0} />
        <StatCardsSkeleton />
        <FilterBarSkeleton controls={1} />
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_0.8fr]">
                <div className="flex items-center gap-4">
                  <SkeletonIcon className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-44" />
                    <SkeletonBlock className="h-3 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <SkeletonBlock className="h-14 rounded-xl" />
                  <SkeletonBlock className="h-14 rounded-xl" />
                  <SkeletonBlock className="h-14 rounded-xl" />
                </div>
                <div className="flex gap-2 lg:justify-end">
                  <SkeletonBlock className="h-10 w-24 rounded-xl" />
                  <SkeletonBlock className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartPanelSkeleton tall />
        <ChartPanelSkeleton tall />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
      </div>
    </main>
  );
}

export function ReportsPageSkeleton() {
  return (
    <main className="space-y-6 bg-slate-50 p-4 md:p-6">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <FilterBarSkeleton controls={2} />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <CardGridSkeleton count={4} columns="lg:grid-cols-1" />
        <TableSkeleton rows={6} columns={5} />
      </div>
    </main>
  );
}

export function TransactionsPageSkeleton() {
  return (
    <main className="space-y-6 bg-slate-50 p-4 md:p-6">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton count={3} />
      <FilterBarSkeleton controls={2} />
      <TableSkeleton rows={8} columns={6} />
    </main>
  );
}

export function SettingsPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={1} />
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <DetailPanelSkeleton />
        <div className="space-y-5">
          <TableSkeleton rows={4} columns={4} />
          <CardGridSkeleton count={3} columns="lg:grid-cols-1" />
        </div>
      </div>
    </main>
  );
}

export function PaymentsPageSkeleton() {
  return (
    <main className="space-y-6 bg-slate-50 p-4 md:p-6">
      <PageHeaderSkeleton actions={2} />
      <StatCardsSkeleton />
      <FilterBarSkeleton controls={2} />
      <TableSkeleton rows={7} columns={6} />
    </main>
  );
}

export function DetailPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={2} />
      <DetailPanelSkeleton />
      <TableSkeleton rows={5} columns={5} />
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <SkeletonIcon className="h-14 w-14" />
          <SkeletonBlock className="h-7 w-44" />
          <SkeletonBlock className="h-4 w-60" />
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}

