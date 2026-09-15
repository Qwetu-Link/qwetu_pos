"use server";

import { auth } from "@/auth";
import { upsertNotificationPreferenceQuery } from "@/db/queries/notifications";
import { notificationTypeValues } from "@/db/schema/notifications";
import { z } from "zod";

const notificationPreferenceSchema = z.object({
  type: z.enum(notificationTypeValues),
  inApp: z.boolean(),
  email: z.boolean(),
  sms: z.boolean(),
});

export async function updateNotificationPreference(input: unknown) {
  const session = await auth();

  if (!session?.user?.businessId) {
    return {
      success: false,
      message: "You must be signed in to update notifications.",
    };
  }

  const parsed = notificationPreferenceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid notification preference.",
    };
  }

  const preferences = await upsertNotificationPreferenceQuery({
    businessId: session.user.businessId,
    ...parsed.data,
  });

  return {
    success: true,
    preferences,
  };
}
