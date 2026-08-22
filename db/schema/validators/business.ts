import { z } from "zod/v4";

export const businessSchema = z.object({
    businessName: z
        .string({ message: "Business name field is required" })
        .min(1, "Business name is required")
        .max(255, "Business name must be at most 255 characters"),

    registrationNumber: z
        .string({ message: "Registration number field is required" })
        .min(1, "Registration number is required")
        .max(100, "Registration number must be at most 100 characters"),

    taxPin: z
        .string({ message: "Tax PIN field is required" })
        .min(1, "Tax PIN is required")
        .max(50, "Tax PIN must be at most 50 characters"),

    email: z
        .email({ pattern: z.regexes.email, message: "Enter a valid email address" }),

    phone: z.e164("Enter a valid phone number (e.g. +254712345678)")
        .min(13, "Enter a valid phone number"),
    address: z.string().min(5, "Address is required").max(255),
    logoPath: z.url("Enter a valid URL for the logo").optional().nullable(),
    password: z
        .string({ message: "Password is required" })
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(24, "Password must not exceed 24 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^a-zA-Z0-9]/,
            "Password must contain at least one special character",
        ),

    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type BusinessFormValues = z.infer<typeof businessSchema>;