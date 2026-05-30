"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const VALID_EMAIL = "admin@lipamdogo.com";
const VALID_PASSWORD = "admin123";

const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
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

  function showError(message: string) {
    setError(message);
  }

  function submitLogin(values: LoginFormValues) {
    setError("");

    if (values.email !== VALID_EMAIL) {
      showError("Invalid email address");
      return;
    }

    if (values.password !== VALID_PASSWORD) {
      showError("Invalid password");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to access your dashboard"
      />

      <form
        onSubmit={handleSubmit(submitLogin)}
        className={`space-y-4 ${error ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
      >
        <AuthField
          icon={Mail}
          label="Email Address"
          type="email"
          {...register("email", { onChange: () => setError("") })}
          onFocus={() => setError("")}
          placeholder="admin@lipamdogo.com"
        />
        {errors.email ? (
          <p className="-mt-2 text-xs text-red-600">{errors.email.message}</p>
        ) : null}

        <AuthField
          icon={LockKeyhole}
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password", { onChange: () => setError("") })}
          onFocus={() => setError("")}
          placeholder="Password"
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
          <p className="-mt-2 text-xs text-red-600">{errors.password.message}</p>
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
              Sign In
            </>
          )}
        </AuthSubmitButton>
      </form>

      <div className="mt-5 border-t border-slate-100 pt-5 text-center">
        <p className="mb-2 text-xs text-slate-500">Demo Credentials</p>
        <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
          <p>
            <span className="text-emerald-700">Email:</span>{" "}
            admin@lipamdogo.com
          </p>
          <p>
            <span className="text-emerald-700">Password:</span> admin123
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-3 animate-[shake_0.4s_ease-in-out] rounded-lg border border-red-200 bg-red-50 p-2.5 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        </div>
      ) : null}

      <p className="mt-5 text-center text-sm text-slate-600">
        New to QwetuLinks?{" "}
        <Link href="/register" className="font-semibold text-emerald-700">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
