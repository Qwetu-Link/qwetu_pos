export type WhatsappStatus = "checking" | "ready" | "offline";

export default function StatusBadge({ status }: { status: WhatsappStatus }) {
  const styles = {
    checking: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    offline: "bg-red-100 text-red-700",
  };
  const labels = {
    checking: "Scan QR to connect",
    ready: "WhatsApp connected",
    offline: "Bridge offline",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${styles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {labels[status]}
    </div>
  );
}
