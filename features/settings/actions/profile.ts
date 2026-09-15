"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { usersTable } from "@/db/schema/users";
import { getBusinessProfileById } from "@/db/queries/business";
import { eq } from "drizzle-orm";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const profileUpdateSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(255),
  legalName: z.preprocess(emptyToUndefined, z.string().max(255).optional()),
  registrationNumber: z.string().trim().min(1, "Registration number is required").max(100),
  taxPin: z.string().trim().min(1, "Tax PIN is required").max(50),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(5, "Phone number is required").max(20),
  alternativePhone: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
  address: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  city: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  county: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  country: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().max(10).optional()),
  timezone: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  logoPath: z.preprocess(emptyToUndefined, z.string().url("Enter a valid logo URL").max(1000).optional()),
  description: z.preprocess(emptyToUndefined, z.string().max(1000).optional()),
  industry: z.preprocess(emptyToUndefined, z.string().max(255).optional()),
  receiptFooter: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  invoiceTerms: z.preprocess(emptyToUndefined, z.string().max(1000).optional()),
  ownerName: z.preprocess(emptyToUndefined, z.string().max(255).optional()),
  ownerEmail: z.preprocess(
    emptyToUndefined,
    z.string().email("Enter a valid owner email address").optional(),
  ),
  ownerPhone: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
});

export type ProfileUpdateState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function updateCurrentBusinessProfile(
  formData: FormData,
): Promise<ProfileUpdateState> {
  const session = await auth();

  if (!session?.user?.businessId) {
    return {
      success: false,
      message: "You must be signed in to update this profile.",
    };
  }

  const parsed = profileUpdateSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const currentProfile = await getBusinessProfileById(session.user.businessId);

  if (!currentProfile) {
    return {
      success: false,
      message: "Business profile was not found.",
    };
  }

  const {
    ownerName,
    ownerEmail,
    ownerPhone,
    ...businessData
  } = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(businessTable)
      .set(businessData)
      .where(eq(businessTable.id, currentProfile.business.id));

    if (currentProfile.business.ownerId && (ownerName || ownerEmail || ownerPhone)) {
      const [firstName, ...lastNameParts] = (ownerName || currentProfile.business.ownerName || "")
        .trim()
        .split(/\s+/);

      await tx
        .update(usersTable)
        .set({
          name: ownerName ?? currentProfile.business.ownerName,
          firstName: firstName || undefined,
          lastName: lastNameParts.join(" ") || undefined,
          email: ownerEmail ?? currentProfile.business.ownerEmail,
          phone: ownerPhone ?? currentProfile.business.ownerPhone,
        })
        .where(eq(usersTable.id, currentProfile.business.ownerId));
    }
  });

  revalidatePath("/admin/settings/profile");
  revalidatePath("/admin/settings");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}
