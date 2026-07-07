"use client";

export default function RegisterForm() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your workspace</h1>
        <p className="mt-2 text-sm text-slate-600">
          Registration is being set up. Please check back soon.
        </p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Business name</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Qwetu Links" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="owner@example.com" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useRef, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   ArrowRight,
//   Building2,
//   FileText,
//   Hash,
//   ImagePlus,
//   Loader2,
//   LockKeyhole,
//   Mail,
//   MapPin,
//   Phone,
//   X,
// } from "lucide-react";
// import AuthField from "../../app/(features)/(auth)/_components/AuthField";
// import AuthHeader from "../../app/(features)/(auth)/_components/AuthHeader";
// import AuthLayout from "../../app/(features)/(auth)/_components/AuthLayout";
// import AuthSubmitButton from "../../app/(features)/(auth)/_components/AuthSubmitButton";
// import { uploadLogo } from "../../lib/uploadLogo";
// import { BusinessFormValues, businessSchema } from "@/validators/business";

// export default function RegisterForm() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [logoPreview, setLogoPreview] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const {
//     formState: { errors },
//     handleSubmit,
//     register,
//     setValue,
//     clearErrors,
//   } = useForm<BusinessFormValues>({
//     resolver: zodResolver(businessSchema),
//     defaultValues: {
//       businessName: "",
//       registrationNumber: "",
//       taxPin: "",
//       email: "",
//       phone: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setValue("logoPath", file, { shouldValidate: true });
//     clearErrors("logoPath");

//     const reader = new FileReader();
//     reader.onload = () => setLogoPreview(reader.result as string);
//     reader.readAsDataURL(file);
//   }

//   function removeLogo() {
//     setValue("logoPath", undefined, { shouldValidate: true });
//     setLogoPreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   }

//   async function submitRegistration(data: BusinessFormValues) {
//     setSubmitError(null);
//     setIsSubmitting(true);

//     try {
//       let logoPath: string | undefined;

//       if (data.logoPath) {
//         const slug = data.businessName.trim().toLowerCase().replace(/\s+/g, "-");
//         logoPath = await uploadLogo(data.logoPath, slug);
//       }

//       const { logoPath: _, confirmPassword, ...rest } = data;
//       const payload = { ...rest, logoPath };

//       const res = await fetch("/api/business/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const body = await res.json().catch(() => null);
//         throw new Error(body?.message ?? "Registration failed. Please try again.");
//       }

//       router.push("/dashboard");
//     } catch (err) {
//       setSubmitError(err instanceof Error ? err.message : "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <AuthLayout cardClassName="max-w-[560px]">
//       <AuthHeader
//         title="Create Account"
//         subtitle="Register your business workspace"
//       />

//       <form onSubmit={handleSubmit(submitRegistration)} className="space-y-3.5">
//         <div className="grid gap-3 sm:grid-cols-2">
//           <div>
//             <AuthField
//               icon={Building2}
//               label="Business Name"
//               type="text"
//               placeholder="Qwetu Links"
//               {...register("businessName")}
//             />
//             {errors.businessName ? (
//               <p className="mt-1 text-xs text-red-600">
//                 {errors.businessName.message}
//               </p>
//             ) : null}
//           </div>
//           <div>
//             <AuthField
//               icon={Hash}
//               label="Registration Number"
//               type="text"
//               placeholder="BN-2024-00123"
//               {...register("registrationNumber")}
//             />
//             {errors.registrationNumber ? (
//               <p className="mt-1 text-xs text-red-600">
//                 {errors.registrationNumber.message}
//               </p>
//             ) : null}
//           </div>
//         </div>

//         <div className="grid gap-3 sm:grid-cols-2">
//           <div>
//             <AuthField
//               icon={FileText}
//               label="Tax PIN"
//               type="text"
//               placeholder="P051234567X"
//               {...register("taxPin")}
//             />
//             {errors.taxPin ? (
//               <p className="mt-1 text-xs text-red-600">{errors.taxPin.message}</p>
//             ) : null}
//           </div>
//           <div>
//             <AuthField
//               icon={Phone}
//               label="Phone"
//               type="tel"
//               placeholder="+254712345678"
//               {...register("phone")}
//             />
//             {errors.phone ? (
//               <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
//             ) : null}
//           </div>
//         </div>

//         <div className="grid gap-3 sm:grid-cols-2">
//           <div>
//             <AuthField
//               icon={Mail}
//               label="Email"
//               type="email"
//               placeholder="owner@qwetulinks.co.ke"
//               {...register("email")}
//             />
//             {errors.email ? (
//               <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
//             ) : null}
//           </div>
//           <div>
//             <AuthField
//               icon={MapPin}
//               label="Address"
//               type="text"
//               placeholder="123 Moi Avenue, Nairobi"
//               {...register("address")}
//             />
//             {errors.address ? (
//               <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
//             ) : null}
//           </div>
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700">
//             Business Logo (optional)
//           </label>

//           {logoPreview ? (
//             <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2.5">
//               <Image
//                 src={logoPreview}
//                 alt="Logo preview"
//                 width={48}
//                 height={48}
//                 className="h-12 w-12 rounded-md object-cover"
//               />
//               <span className="flex-1 truncate text-sm text-slate-600">
//                 Logo selected
//               </span>
//               <button
//                 type="button"
//                 onClick={removeLogo}
//                 className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-700"
//             >
//               <ImagePlus className="h-4 w-4" />
//               Click to upload a logo (PNG, JPEG, WEBP, SVG — max 2MB)
//             </button>
//           )}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/png,image/jpeg,image/webp,image/svg+xml"
//             onChange={handleLogoChange}
//             className="hidden"
//           />

//           {errors.logoPath ? (
//             <p className="mt-1 text-xs text-red-600">{errors.logoPath.message}</p>
//           ) : null}
//         </div>

//         <div className="grid gap-3 sm:grid-cols-2">
//           <div>
//             <AuthField
//               icon={LockKeyhole}
//               label="Password"
//               type="password"
//               placeholder="Create password"
//               {...register("password")}
//             />
//             {errors.password ? (
//               <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
//             ) : null}
//           </div>
//           <div>
//             <AuthField
//               icon={LockKeyhole}
//               label="Confirm Password"
//               type="password"
//               placeholder="Repeat password"
//               {...register("confirmPassword")}
//             />
//             {errors.confirmPassword ? (
//               <p className="mt-1 text-xs text-red-600">
//                 {errors.confirmPassword.message}
//               </p>
//             ) : null}
//           </div>
//         </div>

//         {submitError ? (
//           <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
//             {submitError}
//           </p>
//         ) : null}

//         <AuthSubmitButton disabled={isSubmitting}>
//           {isSubmitting ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Creating account...
//             </>
//           ) : (
//             <>
//               Create Account
//               <ArrowRight className="h-4 w-4" />
//             </>
//           )}
//         </AuthSubmitButton>
//       </form>

//       <p className="mt-4 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
//         Already have an account?{" "}
//         <Link href="/login" className="font-semibold text-emerald-700">
//           Sign in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// }