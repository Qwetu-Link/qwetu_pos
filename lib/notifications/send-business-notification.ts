import { sendNotificationToAll } from "@/components/notification-actions";
import { buildBusinessNotification, type BusinessNotificationPayload, type BusinessNotificationType } from "./business-notifications";

export async function sendBusinessNotification(
  type: BusinessNotificationType,
  payload: BusinessNotificationPayload,
) {
  try {
    const notification = buildBusinessNotification(type, payload);
    await sendNotificationToAll(notification);
  } catch (error) {
    console.error("Failed to send business notification:", error);
  }
}
