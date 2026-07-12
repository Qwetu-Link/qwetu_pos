"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import {
  AlertTriangle,
  ArrowRightToLine,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import AuthField from "../../_components/AuthField";
import AuthHeader from "../../_components/AuthHeader";
import AuthLayout from "../../_components/AuthLayout";
import AuthSubmitButton from "../../_components/AuthSubmitButton";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").trim(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submitLogin(values: LoginFormValues) {
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email address or password configuration.");
        setIsSubmitting(false);
        return;
      }

      router.refresh();

      const roleName = session?.user?.roleName;
      if (roleName === "Super Admin") {
        router.push("/superadmin");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected authentication error occurred.");
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome back"
        subtitle="Use your workspace credentials to access POS, finance, inventory, and customer tools."
      />      <form
        onSubmit={handleSubmit(submitLogin)}
        className={`space-y-4 ${error ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
      >
        <AuthField
          icon={Mail}
          label="Email Address"
          type="email"
          {...register("email", { onChange: () => setError("") })}
          onFocus={() => setError("")}
          placeholder="admin@qwetulinks.co.ke"
        />
        {errors.email ? (
          <p className="-mt-2 text-xs font-medium text-red-600">{errors.email.message}</p>
        ) : null}

        <AuthField
          icon={LockKeyhole}
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password", { onChange: () => setError("") })}
          onFocus={() => setError("")}
          placeholder="Enter your password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />
        {errors.password ? (
          <p className="-mt-2 text-xs font-medium text-red-600">{errors.password.message}</p>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="flex items-start justify-center gap-2 text-sm font-medium text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          </div>
        ) : null}

        <AuthSubmitButton disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Signing in...
            </>
          ) : (
            <>
              <ArrowRightToLine className="h-4 w-4" />
              Sign in
            </>
          )}
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
