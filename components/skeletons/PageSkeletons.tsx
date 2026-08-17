import {
  CardGridSkeleton,
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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-40" />
            <div className="flex items-center gap-3">
              <SkeletonIcon className="h-10 w-10 rounded-lg bg-emerald-100" />
              <SkeletonBlock className="h-9 w-72 max-w-full" />
            </div>
            <SkeletonBlock className="h-4 w-[420px] max-w-full" />
          </div>
        </div>

        <StatCardsSkeleton />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.8fr)]">
          <div className="min-h-[380px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-44" />
                <SkeletonBlock className="h-5 w-40" />
              </div>
              <div className="flex items-center gap-4">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-8 w-28 rounded-md" />
              </div>
            </div>
            <div className="flex h-[300px] gap-4">
              <div className="flex w-16 flex-col justify-between pb-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-3 w-14" />
                ))}
              </div>
              <div className="flex-1 space-y-8 pt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-px w-full rounded-none" />
                ))}
                <div className="flex items-end gap-3 pt-4">
                  {[42, 52, 48, 60, 56, 68, 62, 74, 70, 82, 76, 88].map((height, index) => (
                    <SkeletonBlock
                      key={index}
                      className="flex-1 rounded-t-lg bg-orange-100"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[380px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-5 w-44" />
              </div>
              <SkeletonBlock className="h-5 w-8 rounded-full" />
            </div>
            <div className="flex items-center justify-around gap-4">
              <SkeletonBlock className="h-36 w-36 rounded-full bg-slate-100" />
              <div className="w-28 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between gap-3">
                    <SkeletonIcon className="h-3 w-3 bg-slate-200" />
                    <SkeletonBlock className="h-4 w-16" />
                    <SkeletonBlock className="h-4 w-5" />
                  </div>
                ))}
              </div>
            </div>
            <SkeletonBlock className="mt-8 h-2 w-full rounded-full bg-slate-100" />
            <div className="mt-8 border-t border-slate-100 pt-5">
              <SkeletonBlock className="h-4 w-72 max-w-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-5 w-36" />
                </div>
                <SkeletonBlock className="h-5 w-16" />
              </div>
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 py-3">
                    <SkeletonIcon className="h-8 w-8" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-40" />
                      <SkeletonBlock className="h-3 w-full" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-16" />
                      <SkeletonBlock className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SkeletonBlock className="mb-5 h-5 w-32" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <SkeletonBlock className="h-4 w-36" />
                      <SkeletonBlock className="h-4 w-10" />
                    </div>
                    <SkeletonBlock className="h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="mb-5 h-5 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="mt-2 h-3 w-full" />
                </div>
              ))}
            </div>
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
      <ProductCardsSkeleton />
    </main>
  );
}

export function CategoryPageSkeleton() {
  return (
    <main className="space-y-6 rounded-xl bg-gray-50 p-6">
      <PageHeaderSkeleton actions={1} />
      <StatCardsSkeleton count={3} />
      <FilterBarSkeleton controls={1} />
      <CategoryCardsSkeleton />
    </main>
  );
}

export function ProductCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <SkeletonBlock className="h-48 rounded-none bg-gray-100" />
          <div className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-5 w-4/5" />
                <SkeletonBlock className="h-5 w-3/5" />
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                <SkeletonBlock className="h-5 w-10 rounded-full" />
                <SkeletonBlock className="h-5 w-10 rounded-full" />
                <SkeletonBlock className="h-5 w-10 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-52 max-w-full" />
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SkeletonBlock className="h-10 rounded-lg" />
              <SkeletonBlock className="h-10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SkeletonIcon className="h-12 w-12 rounded-xl bg-emerald-100" />
              <SkeletonBlock className="h-6 w-40 max-w-full" />
            </div>
            <div className="flex gap-1">
              <SkeletonIcon className="h-9 w-9 rounded-full" />
              <SkeletonIcon className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <div className="mb-4 min-h-10 space-y-2">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
          <div className="border-t border-gray-100 pt-3">
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CustomersPageSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 antialiased md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton actions={1} />
        <StatCardsSkeleton />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <SkeletonBlock className="h-11 rounded-xl bg-slate-50" />
        </div>
        <CustomerCardsSkeleton />
      </div>
    </main>
  );
}

export function CustomerCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SkeletonIcon className="h-12 w-12 rounded-full" />
              <SkeletonBlock className="h-5 w-44 max-w-full" />
            </div>
            <div className="flex gap-1">
              <SkeletonIcon className="h-9 w-9 rounded-full" />
              <SkeletonIcon className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <div className="mb-4 space-y-2 border-b border-slate-100 pb-4">
            <SkeletonBlock className="h-4 w-64 max-w-full" />
            <SkeletonBlock className="h-4 w-40" />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, itemIndex) => (
              <div key={itemIndex} className="space-y-2">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-6 w-24" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-5 w-20 rounded-full" />
          </div>
          <SkeletonBlock className="mt-4 h-10 w-full rounded-md bg-emerald-50" />
        </div>
      ))}
    </div>
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
        <InventoryCardsSkeleton />
      </div>
    </main>
  );
}

export function InventoryCardsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 xl:flex-row">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <SkeletonBlock className="h-6 w-80 max-w-full" />
                  <SkeletonBlock className="h-4 w-44" />
                </div>
                <SkeletonBlock className="h-7 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <SkeletonBlock className="mb-3 h-4 w-24" />
                    <div className="flex items-baseline justify-between gap-3">
                      <SkeletonBlock className="h-8 w-12" />
                      <SkeletonBlock className="h-3 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 xl:w-56">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                <SkeletonBlock className="mx-auto mb-2 h-4 w-28 bg-emerald-100" />
                <SkeletonBlock className="mx-auto h-9 w-16 bg-emerald-100" />
                <SkeletonBlock className="mx-auto mt-2 h-3 w-36 bg-emerald-100" />
              </div>
              <SkeletonBlock className="h-8 rounded-lg bg-slate-50" />
              <div className="grid grid-cols-2 gap-2">
                <SkeletonBlock className="h-10 rounded-xl" />
                <SkeletonBlock className="h-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={2} />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-7 w-28" />
              </div>
              <SkeletonIcon className="h-10 w-10 rounded-xl" />
            </div>
            <SkeletonBlock className="h-4 w-32" />
          </div>
        ))}
      </section>
      <AnalyticsSectionSkeleton tall />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsSectionSkeleton />
        <AnalyticsSegmentSkeleton />
      </div>
      <AnalyticsPaymentMethodsSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <SkeletonIcon className="h-6 w-6 rounded-lg" />
              <SkeletonBlock className="h-6 w-44" />
            </div>
            <div className="mb-5 space-y-2 text-center">
              <SkeletonBlock className="mx-auto h-10 w-24" />
              <SkeletonBlock className="mx-auto h-4 w-40" />
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
      <AnalyticsSectionSkeleton tall />
    </main>
  );
}

export function ReportsPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeaderSkeleton actions={2} />
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <SkeletonIcon className="h-10 w-10 rounded-xl" />
              <SkeletonBlock className="h-5 w-14 rounded-full" />
            </div>
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-2 h-7 w-20" />
            <SkeletonBlock className="mt-3 h-3 w-36" />
          </div>
        ))}
      </section>
      <section>
        <div className="mb-4 space-y-2">
          <SkeletonBlock className="h-6 w-44" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-stretch gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <SkeletonIcon className="h-11 w-11 rounded-xl" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
              </div>
              <SkeletonBlock className="h-5 w-44 max-w-full" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-3/4" />
              <div className="mt-5 flex flex-wrap gap-2">
                <SkeletonBlock className="h-6 w-12 rounded-full" />
                <SkeletonBlock className="h-6 w-12 rounded-full" />
                <SkeletonBlock className="h-6 w-12 rounded-full" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <SkeletonBlock className="h-10 rounded-lg" />
                <SkeletonBlock className="h-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <TableSkeleton rows={6} columns={6} />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 space-y-2">
            <SkeletonBlock className="h-6 w-44" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-slate-100 p-4">
                <div className="mb-3 flex justify-between gap-3">
                  <SkeletonBlock className="h-5 w-36" />
                  <SkeletonBlock className="h-6 w-16 rounded-full" />
                </div>
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="mt-2 h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function AnalyticsSectionSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-2">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="h-4 w-72 max-w-full" />
      </div>
      <div className={tall ? "flex h-72 items-end gap-3" : "flex h-64 items-end gap-3"}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="flex-1 rounded-t-lg"
            style={{ height: `${32 + ((index * 17) % 58)}%` }}
          />
        ))}
      </div>
    </section>
  );
}

function AnalyticsSegmentSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-2">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="h-4 w-48" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-36" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <SkeletonBlock className="h-2 rounded-full bg-white" />
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalyticsPaymentMethodsSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-2">
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <SkeletonIcon className="h-8 w-8 rounded-lg bg-emerald-50" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="mb-2 h-8 w-28" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>
    </section>
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
      <StatCardsSkeleton count={3} />
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <SkeletonIcon className="h-12 w-12 rounded-xl" />
                <div className="space-y-3">
                  <SkeletonBlock className="h-6 w-48" />
                  <SkeletonBlock className="h-4 w-64 max-w-[60vw]" />
                  <SkeletonBlock className="h-4 w-32" />
                </div>
              </div>
              <SkeletonBlock className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <SkeletonIcon className="h-11 w-11 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="h-3 w-56" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonBlock className="h-24 rounded-xl" />
          <SkeletonBlock className="h-24 rounded-xl" />
          <SkeletonBlock className="h-24 rounded-xl" />
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

export function ComingSoonPageSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <SkeletonIcon className="mb-6 h-20 w-20 rounded-2xl bg-amber-100" />
        <div className="mb-3 flex w-full items-center justify-center gap-3">
          <SkeletonIcon className="h-9 w-9 rounded-lg bg-amber-100" />
          <SkeletonBlock className="h-10 w-80 max-w-[70vw]" />
        </div>
        <SkeletonBlock className="mb-2 h-5 w-full max-w-sm" />
        <SkeletonBlock className="mb-8 h-5 w-72 max-w-full" />
        <div className="h-1 w-64 overflow-hidden rounded-full bg-slate-200">
          <SkeletonBlock className="h-full w-1/2 rounded-full bg-amber-200" />
        </div>
      </div>
    </main>
  );
}

export function VariantCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-6 w-full max-w-64" />
              <SkeletonBlock className="h-4 w-40" />
            </div>
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
              <SkeletonBlock className="mx-auto mb-2 h-4 w-28 bg-emerald-100" />
              <SkeletonBlock className="mx-auto h-9 w-16 bg-emerald-100" />
              <SkeletonBlock className="mx-auto mt-2 h-3 w-36 bg-emerald-100" />
            </div>
            <SkeletonBlock className="h-8 rounded-lg bg-slate-100" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <SkeletonBlock className="h-10 rounded-xl" />
              <SkeletonBlock className="h-10 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VariantsPageSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 antialiased md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton actions={0} />
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <SkeletonIcon className="h-11 w-11 rounded-xl" />
                <div className="min-w-0 space-y-2">
                  <SkeletonBlock className="h-4 w-24 max-w-full" />
                  <SkeletonBlock className="h-7 w-16" />
                </div>
              </div>
            </div>
          ))}
        </section>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <SkeletonBlock className="h-11 rounded-xl bg-slate-50" />
        </div>
        <VariantCardsSkeleton />
      </div>
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

export function ProductDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-10 w-36 rounded-xl bg-white" />

      <section className="grid gap-8 bg-white lg:grid-cols-[minmax(0,52%)_minmax(360px,1fr)]">
        <div className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className={`h-16 w-16 shrink-0 rounded-2xl ${
                  index === 0 ? "ring-2 ring-blue-100" : ""
                }`}
              />
            ))}
          </div>
          <div className="order-1 flex items-start justify-center bg-slate-50 sm:order-2">
            <SkeletonBlock className="h-[560px] w-full max-w-[520px] rounded-none" />
          </div>
        </div>

        <aside className="min-w-0 lg:pr-4">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-7 w-32 rounded-full bg-emerald-100" />
              <SkeletonBlock className="h-7 w-28 rounded-full bg-emerald-100" />
            </div>
            <SkeletonBlock className="mt-4 h-11 w-80 max-w-full" />
            <div className="mt-3 flex flex-wrap gap-3">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
          </div>

          <div className="space-y-5 py-5">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-11 w-56" />
              <SkeletonBlock className="h-4 w-72 max-w-full" />
            </div>

            <div className="border-y border-slate-200 py-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-4/5" />
            </div>

            <div>
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-2">
                    <SkeletonBlock className="mx-auto h-16 w-16 rounded-lg" />
                    <SkeletonBlock className="mt-2 h-4 w-20" />
                    <SkeletonBlock className="mt-2 h-3 w-16" />
                    <SkeletonBlock className="mt-2 h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SkeletonBlock className="h-5 w-28" />
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-11 w-24 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="mt-2 h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export function ProductEditSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <SkeletonBlock className="mb-4 h-10 w-44 rounded-xl bg-white" />
        <div className="flex items-center gap-3">
          <SkeletonIcon className="h-8 w-8 rounded-lg bg-emerald-100" />
          <SkeletonBlock className="h-9 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="mt-2 h-4 w-[420px] max-w-full" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <SkeletonIcon className="h-7 w-7 rounded-lg bg-emerald-100" />
            <SkeletonBlock className="h-8 w-48" />
          </div>
          <SkeletonIcon className="h-9 w-9 rounded-full" />
        </div>

        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex gap-2">
            <SkeletonBlock className="h-2 flex-1 rounded-full bg-emerald-100" />
            <SkeletonBlock className="h-2 flex-1 rounded-full" />
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-11 rounded-xl" />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-28 rounded-xl" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-3 w-72 max-w-full" />
              </div>
              <SkeletonBlock className="h-10 w-28 rounded-lg bg-emerald-100" />
            </div>
            <div className="mb-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
                <SkeletonBlock className="h-4 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <SkeletonBlock className="aspect-square rounded-none" />
                  <div className="border-t border-gray-100 p-2">
                    <SkeletonBlock className="h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <SkeletonBlock className="h-11 w-40 rounded-xl bg-emerald-100" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function ProfileDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <PageHeaderSkeleton actions={1} />
        </div>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <SkeletonIcon className="h-20 w-20 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-7 w-28 rounded-full" />
                    <SkeletonBlock className="h-7 w-28 rounded-full" />
                  </div>
                  <SkeletonBlock className="h-9 w-72 max-w-full" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-24 rounded-xl border border-slate-200 bg-white" />
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <SkeletonIcon className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-44" />
                  <SkeletonBlock className="h-3 w-64" />
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr]">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-4 w-full max-w-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-5">
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <SkeletonBlock className="h-5 w-36 bg-emerald-100" />
              <SkeletonBlock className="mt-3 h-4 w-full bg-emerald-100" />
              <SkeletonBlock className="mt-2 h-4 w-3/4 bg-emerald-100" />
              <SkeletonBlock className="mt-5 h-10 w-full rounded-lg bg-emerald-100" />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export function AccessManagementSkeleton({ kind = "roles" }: { kind?: "roles" | "team" }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={1} />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <SkeletonIcon className="h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-56" />
              <SkeletonBlock className="h-3 w-64" />
            </div>
          </div>
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
        </div>
        {kind === "roles" ? (
          <CardGridSkeleton count={4} columns="lg:grid-cols-2" />
        ) : (
          <TableSkeleton rows={6} columns={5} />
        )}
      </div>
    </main>
  );
}

export function FormPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={0} />
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={index === 7 ? "space-y-2 md:col-span-2" : "space-y-2"}>
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className={index === 7 ? "h-24 rounded-xl" : "h-11 rounded-xl"} />
              </div>
            ))}
          </div>
          <div className="p-5">
            <div className="ml-auto grid max-w-sm gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-6 w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
            <SkeletonBlock className="h-10 w-24 rounded-xl" />
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ExpenseDetailSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1500px] space-y-5 px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
        <PageHeaderSkeleton actions={1} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row">
            <div className="flex gap-3">
              <SkeletonIcon className="h-11 w-11 rounded-xl" />
              <div className="space-y-3">
                <SkeletonBlock className="h-8 w-56" />
                <SkeletonBlock className="h-4 w-72 max-w-[70vw]" />
                <SkeletonBlock className="h-4 w-96 max-w-full" />
              </div>
            </div>
            <SkeletonBlock className="h-10 w-24 rounded-xl" />
          </div>
        </div>
        <StatCardsSkeleton />
        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <TableSkeleton rows={5} columns={4} />
          <aside className="grid gap-5 md:grid-cols-2 xl:block xl:space-y-5">
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
          </aside>
        </section>
      </div>
    </main>
  );
}

export function Customer360Skeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={2} />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <SkeletonIcon className="h-20 w-20 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <SkeletonBlock className="h-8 w-64 max-w-full" />
              <SkeletonBlock className="h-4 w-80 max-w-full" />
              <div className="grid gap-3 sm:grid-cols-3">
                <SkeletonBlock className="h-16 rounded-xl" />
                <SkeletonBlock className="h-16 rounded-xl" />
                <SkeletonBlock className="h-16 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <StatCardsSkeleton count={4} />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="h-3 w-64" />
            </div>
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
          <TableSkeleton rows={4} columns={5} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
          <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
        </div>
      </div>
    </main>
  );
}

export function OrderDetailSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={2} />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row">
            <div className="space-y-3">
              <SkeletonBlock className="h-8 w-56" />
              <SkeletonBlock className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-24 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </div>
        <StatCardsSkeleton count={4} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <TableSkeleton rows={5} columns={5} />
            <div className="ml-auto grid max-w-sm gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-6 w-full" />
            </div>
          </div>
          <div className="space-y-5">
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function LipaMdogoDetailSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={2} />
        <StatCardsSkeleton count={4} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <TableSkeleton rows={4} columns={5} />
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SkeletonBlock className="mb-4 h-6 w-44" />
              <TableSkeleton rows={4} columns={4} />
            </div>
          </div>
          <div className="space-y-5">
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
            <CardGridSkeleton count={1} columns="lg:grid-cols-1" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function BillingSettingsSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeaderSkeleton actions={1} />
      <StatCardsSkeleton count={3} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
        <CardGridSkeleton count={2} columns="lg:grid-cols-1" />
      </div>
    </main>
  );
}

export function LipaMdogoPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={1} />
        <StatCardsSkeleton count={4} />
        <FilterBarSkeleton controls={3} />
        <PaymentPlanCardsSkeleton />
      </div>
    </main>
  );
}

export function PaymentPlanCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap justify-between gap-2">
                <div className="space-y-2">
                  <SkeletonBlock className="h-6 w-48" />
                  <SkeletonBlock className="h-4 w-72 max-w-full" />
                </div>
                <SkeletonBlock className="h-7 w-24 rounded-full" />
              </div>
              <div className="mb-4">
                <div className="mb-2 flex justify-between">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-4 w-10" />
                </div>
                <SkeletonBlock className="h-2 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <SkeletonBlock className="h-3 w-20" />
                    <SkeletonBlock className="h-5 w-24 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 lg:w-64">
              <div className="rounded-lg bg-slate-50 p-4">
                <SkeletonBlock className="mb-3 h-4 w-28" />
                <SkeletonBlock className="h-6 w-36" />
                <SkeletonBlock className="mt-2 h-3 w-44 max-w-full" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SkeletonBlock className="h-10 rounded-lg" />
                <SkeletonBlock className="h-10 rounded-lg" />
              </div>
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function ExpenseRegisterSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeaderSkeleton actions={1} />
        <StatCardsSkeleton count={4} />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="h-3 w-64" />
            </div>
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
          <TableSkeleton rows={7} columns={8} />
        </div>
      </div>
    </main>
  );
}
