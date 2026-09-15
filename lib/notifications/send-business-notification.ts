import { sendNotificationToAll } from "@/components/notification-actions";
import { isInAppNotificationEnabledQuery } from "@/db/queries/notifications";
import { buildBusinessNotification, type BusinessNotificationPayload, type BusinessNotificationType } from "./business-notifications";

export async function sendBusinessNotification(
  businessId: string,
  type: BusinessNotificationType,
  payload: BusinessNotificationPayload,
) {
  try {
    const isEnabled = await isInAppNotificationEnabledQuery({ businessId, type });

    if (!isEnabled) {
      return;
    }

    const notification = buildBusinessNotification(type, payload);
    await sendNotificationToAll(notification);
  } catch (error) {
    console.error("Failed to send business notification:", error);
  }
}
