import { db } from "@/db";
import {
  notificationPreferenceTable,
  notificationTypeValues,
  type NotificationType,
} from "@/db/schema/notifications";
import { and, eq } from "drizzle-orm";

export type NotificationChannelPreferences = {
  type: NotificationType;
  inApp: boolean;
  email: boolean;
  sms: boolean;
};

const defaultPreferences: NotificationChannelPreferences[] = notificationTypeValues.map((type) => ({
  type,
  inApp: true,
  email: type === "order_created" || type === "order_paid" || type === "order_status_updated",
  sms: false,
}));

export function getDefaultNotificationPreferences() {
  return defaultPreferences;
}

export async function getNotificationPreferencesQuery(businessId: string) {
  const rows = await db
    .select()
    .from(notificationPreferenceTable)
    .where(eq(notificationPreferenceTable.businessId, businessId));

  const byType = new Map(rows.map((row) => [row.type, row]));

  return defaultPreferences.map((defaults) => {
    const row = byType.get(defaults.type);

    return {
      type: defaults.type,
      inApp: row?.inApp ?? defaults.inApp,
      email: row?.email ?? defaults.email,
      sms: row?.sms ?? defaults.sms,
    };
  });
}

export async function upsertNotificationPreferenceQuery(data: {
  businessId: string;
  type: NotificationType;
  inApp: boolean;
  email: boolean;
  sms: boolean;
}) {
  await db
    .insert(notificationPreferenceTable)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        inApp: data.inApp,
        email: data.email,
        sms: data.sms,
      },
    });

  return getNotificationPreferencesQuery(data.businessId);
}

export async function isInAppNotificationEnabledQuery(data: {
  businessId: string;
  type: NotificationType;
}) {
  const defaults = defaultPreferences.find((item) => item.type === data.type);
  const [row] = await db
    .select({ inApp: notificationPreferenceTable.inApp })
    .from(notificationPreferenceTable)
    .where(and(
      eq(notificationPreferenceTable.businessId, data.businessId),
      eq(notificationPreferenceTable.type, data.type),
    ))
    .limit(1);

  return row?.inApp ?? defaults?.inApp ?? true;
}
