import type { Metadata } from "next";
import RegisterForm from "./_components/register_form";

export const metadata: Metadata = {
  title: "Register | QwetuLinks Clothing POS",
  description: "Create a QwetuLinks workspace for apparel retail operations.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
