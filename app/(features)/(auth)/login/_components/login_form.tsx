"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightToLine,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

const VALID_EMAIL = "admin@lipamdogo.com";
const VALID_PASSWORD = "admin123";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showError(message: string) {
    setError(message);
  }

  function validateLogin() {
    if (!email.trim() || !password) {
      showError("Please enter both email and password");
      return false;
    }

    if (email.trim() !== VALID_EMAIL) {
      showError("Invalid email address");
      return false;
    }

    if (password !== VALID_PASSWORD) {
      showError("Invalid password");
      return false;
    }

    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateLogin()) {
      return;
    }

    setIsSubmitting(true);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("qwetu_user_email", email.trim());

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="flex h-screen w-full items-center justify-center lg:flex-row">
        <section className="relative z-10 hidden flex-1 items-center justify-end overflow-visible pr-0 lg:flex lg:-mr-5">
          <div className="flex w-full flex-col items-center justify-center p-6">
            <div className="flex h-64 w-64 items-center justify-center rounded-[2rem] border border-emerald-100 bg-white shadow-2xl shadow-emerald-100">
              <div className="flex h-44 w-44 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-6xl font-black tracking-tight text-slate-950 shadow-inner">
                Q<span className="text-emerald-600">L</span>
              </div>
            </div>
            <p className="mt-5 text-center text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Qwetu Links POS
            </p>
          </div>
        </section>

        <section className="relative z-20 flex h-full flex-1 items-center justify-center p-4 lg:justify-start lg:pl-0">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-[1.2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 transition lg:-ml-5 lg:-translate-x-10">
            <Link
              href="/"
              className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
              aria-label="Back to overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="mb-5 text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-slate-950 lg:hidden">
                Q<span className="text-emerald-600">L</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to access your dashboard
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`space-y-4 ${error ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
            >
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  Email Address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onFocus={() => setError("")}
                  placeholder="admin@lipamdogo.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-emerald-400" />
                  Password
                </span>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onFocus={() => setError("")}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
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
                </span>
              </label>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 bg-white accent-emerald-500"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
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
              </button>
            </form>

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
          </div>
        </section>
      </div>
    </main>
  );
}
