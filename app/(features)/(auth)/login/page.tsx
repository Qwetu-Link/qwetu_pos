import type { Metadata } from "next";
import LoginForm from "./_components/login_form";

export const metadata: Metadata = {
  title: "Login | QwetuLinks Clothing POS",
  description: "Sign in to manage the QwetuLinks clothing store workspace.",
};

export default function LoginPage() {
  return <LoginForm />;
}
