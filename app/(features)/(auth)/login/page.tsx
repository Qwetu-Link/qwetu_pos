import type { Metadata } from "next";
import LoginForm from "@/features/auth/login/login_form";

export const metadata: Metadata = {
  title: "Login | QwetuLinks Clothing POS",
  description: "Sign in to manage the QwetuLinks clothing store workspace.",
};

export default function LoginPage() {
  return <LoginForm />;
}
