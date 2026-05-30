import { OrderStatus } from "@/data/order-options";
import { statusStyles } from "../../../../../../lib/orderUtils";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
