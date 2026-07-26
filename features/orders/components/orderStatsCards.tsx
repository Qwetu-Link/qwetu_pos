function StatCard({
  label,
  value,
  className = "text-slate-900",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-bold ${className}`}>{value}</p>
    </div>
  );
}

export default function OrderStatsCards({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Total Orders" value={stats.total} />
      <StatCard label="Pending" value={stats.pending} className="text-amber-600" />
      <StatCard label="Processing" value={stats.processing} className="text-blue-600" />
      <StatCard label="Shipped" value={stats.shipped} className="text-purple-600" />
      <StatCard label="Delivered" value={stats.delivered} className="text-green-600" />
      <StatCard label="Cancelled" value={stats.cancelled} className="text-red-600" />
    </div>
  );
}
