import { CustomerManagement } from "./_components/CustomerManagement";

export const metadata = {
  title: "QwetuLinks | Customer Management",
  description: "Manage customers, track payment scores and loyalty",
};

export default function CustomerPage() {
  return <CustomerManagement />;
}
