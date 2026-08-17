import type { DashboardActivity, DashboardTone } from "@/types/dashboard";
import { icon } from "@/utils/icons";

const activityToneClass: Record<DashboardTone, string> = {
  emerald: "emerald",
  blue: "blue",
  violet: "violet",
  amber: "orange",
  red: "orange",
  slate: "blue",
};

function getActivityIcon(activity: DashboardActivity) {
  if (activity.title.includes('Payment') || activity.title.includes('Sale')) return 'ArrowDownLeft';
  if (activity.title.includes('Refund') || activity.tone === 'red') return 'ArrowUpRight';
  if (activity.title.includes('Installment') || activity.title.includes('Deposit')) return 'Wallet';
  if (activity.tone === 'amber') return 'Clock';
  return 'Receipt';
}

function getActivityColor(activity: DashboardActivity) {
  const title = activity.title.toLowerCase();

  if (title.includes("refund") || activity.tone === "red") return "red";
  if (title.includes("expense") || title.includes("purchase")) return "orange";
  if (title.includes("installment") || title.includes("deposit")) return "blue";
  if (title.includes("payment") || title.includes("sale")) return "emerald";
  if (title.includes("adjustment") || title.includes("discount")) return "violet";

  return activityToneClass[activity.tone];
}

function getActivityMeta(activity: DashboardActivity) {
  return activity.detail.match(/KES [\d,]+/)?.[0] ?? activity.title.split(" ").at(-1) ?? "Activity";
}

export default function DashboardActivityPanel({
  activities,
}: {
  activities: DashboardActivity[];
}) {
  return (
    <div className="panel activity-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">Live feed</span>
          <h3>Recent activity</h3>
        </div>
        <button type="button" className="text-btn">
          View all {icon('ArrowUpRight', { size: 14 })}
        </button>
      </div>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div className="activity-row" key={`${activity.title}-${activity.time}-${index}`}>
            <div className={`activity-dot ${getActivityColor(activity)}`}>
              {icon(getActivityIcon(activity), { size: 14 })}
            </div>
            <div className="activity-copy">
              <strong>{activity.title}</strong>
              <span>{activity.detail}</span>
            </div>
            <div className="activity-meta">
              <strong>{getActivityMeta(activity)}</strong>
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
