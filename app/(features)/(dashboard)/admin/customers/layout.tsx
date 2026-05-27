import type { ReactNode } from "react";
import { CustomersProvider } from "./_components/CustomersContext";

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return <CustomersProvider>{children}</CustomersProvider>;
}
