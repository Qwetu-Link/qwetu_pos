import { collectionData } from "@/lib/pos-details-data";

export default function CollectionTrendChart() {
  const maxExpected = Math.max(...collectionData.map((item) => item.expected));

  return (
    <div className="grid gap-4">
      {collectionData.map((item) => {
        const rate = item.expected ? (item.collected / item.expected) * 100 : 0;
        const expectedWidth = (item.expected / maxExpected) * 100;
        const collectedWidth = (item.collected / maxExpected) * 100;

        return (
          <div
            key={item.month}
            className="grid gap-2 sm:grid-cols-[82px_1fr_150px] sm:items-center"
          >
            <span className="text-sm font-medium text-slate-600">
              {item.month}
            </span>
            <div className="space-y-1.5">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-300"
                  style={{ width: `${expectedWidth}%` }}
                />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-emerald-50">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${collectedWidth}%` }}
                />
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-900">
                {rate.toFixed(1)}%
              </span>
              <span className="ml-1 text-slate-500">collected</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
