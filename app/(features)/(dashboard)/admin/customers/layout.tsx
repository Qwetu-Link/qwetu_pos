import type { ReactNode } from "react";
import { CustomersProvider } from "@/features/customers/components/CustomersContext";

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return <CustomersProvider>{children}</CustomersProvider>;
}
