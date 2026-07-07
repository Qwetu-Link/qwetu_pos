import type { Metadata } from "next";
import RegisterForm from "../../../../features/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register | QwetuLinks Clothing POS",
  description: "Create a QwetuLinks workspace for apparel retail operations.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
