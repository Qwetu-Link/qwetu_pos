"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";
import AuthField from "../../_components/AuthField";
import AuthHeader from "../../_components/AuthHeader";
import AuthLayout from "../../_components/AuthLayout";
import AuthSubmitButton from "../../_components/AuthSubmitButton";

const registerSchema = z.object({
  business: z.string().trim().min(1, "Business name is required"),
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Enter a valid email address").trim(),
  phone: z.string().trim().min(7, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      business: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function submitRegistration() {
    router.push("/dashboard");
  }

  return (
    <AuthLayout cardClassName="max-w-[560px]">
      <AuthHeader
        title="Create Account"
        subtitle="Register your business workspace"
      />

      <form onSubmit={handleSubmit(submitRegistration)} className="space-y-3.5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <AuthField
              icon={Building2}
              label="Business"
              type="text"
              required
              placeholder="Qwetu Links"
              {...register("business")}
            />
            {errors.business ? (
              <p className="mt-1 text-xs text-red-600">{errors.business.message}</p>
            ) : null}
          </div>
          <div>
            <AuthField
              icon={User}
              label="Full Name"
              type="text"
              required
              placeholder="Mary Wanjiku"
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <AuthField
              icon={Mail}
              label="Email"
              type="email"
              required
              placeholder="owner@qwetulinks.co.ke"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <AuthField
              icon={Phone}
              label="Phone"
              type="tel"
              required
              placeholder="+254 712 345 678"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            ) : null}
          </div>
        </div>

        <AuthField
          icon={LockKeyhole}
          label="Password"
          type="password"
          required
          placeholder="Create password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}

        <AuthSubmitButton>
          Create Account
          <ArrowRight className="h-4 w-4" />
        </AuthSubmitButton>
      </form>

      <p className="mt-4 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
