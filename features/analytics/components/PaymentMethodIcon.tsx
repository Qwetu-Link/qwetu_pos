import { Banknote, CreditCard, Landmark, Smartphone } from "lucide-react";

export default function PaymentMethodIcon({ method }: { method: string }) {
  if (method.includes("M-Pesa") || method.includes("Airtel")) {
    return <Smartphone className="h-4 w-4" />;
  }

  if (method.includes("Bank")) {
    return <Landmark className="h-4 w-4" />;
  }

  if (method.includes("Cash")) {
    return <Banknote className="h-4 w-4" />;
  }

  return <CreditCard className="h-4 w-4" />;
}
