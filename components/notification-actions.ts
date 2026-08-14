'use server'

import webpush from 'web-push'

const vapidEmail = process.env.VAPID_EMAIL
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (vapidEmail && vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
}

// let subscription: PushSubscription | null = null
interface WebPushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

const subscriptions: Set<WebPushSubscription> = new Set()

// export async function subscribeUser(sub: PushSubscription) {
//   subscription = sub
//   // In a production environment, you would want to store the subscription in a database
//   // For example: await db.subscriptions.create({ data: sub })
//   return { success: true }
// }
export async function subscribeToPush(sub: Record<string, unknown>) {
  try {
    const subscription: WebPushSubscription = {
      endpoint: sub.endpoint as string,
      keys: {
        p256dh: (sub.keys as Record<string, string>).p256dh,
        auth: (sub.keys as Record<string, string>).auth,
      },
    }
    subscriptions.add(subscription)
    console.log('User subscribed to push notifications')
    return { success: true, message: 'Subscribed to notifications' }
  } catch (error) {
    console.error('Error subscribing to push:', error)
    return { success: false, message: 'Failed to subscribe' }
  }
}

/**
 * Error handling guide:
 * - If error message includes "permission denied" or "NotAllowedError",
 *   the user denied notification permission in the browser.
 * - If error mentions "no active Service Worker", ensure the SW is fully
 *   registered and activated before calling subscribeToPush.
 * - If error references VAPID or push service, check that VAPID keys are set
 *   correctly in environment variables and are valid Base64 strings.
 */

// export async function unsubscribeUser() {
//   subscription = null
//   // In a production environment, you would want to remove the subscription from the database
//   // For example: await db.subscriptions.delete({ where: { ... } })
//   return { success: true }
// }

export async function unsubscribeFromPush(sub: Record<string, unknown>) {
  try {
    const endpoint = sub.endpoint as string
    subscriptions.forEach((subscription) => {
      if (subscription.endpoint === endpoint) {
        subscriptions.delete(subscription)
      }
    })
    console.log('User unsubscribed from push notifications')
    return { success: true, message: 'Unsubscribed from notifications' }
  } catch (error) {
    console.error('Error unsubscribing from push:', error)
    return { success: false, message: 'Failed to unsubscribe' }
  }
}

// export async function sendNotification(message: string) {
//   if (!subscription) {
//     throw new Error('No subscription available')
//   }

//   try {
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title: 'Test Notification',
//         body: message,
//         icon: '/icon.png',
//       })
//     )
//     return { success: true }
//   } catch (error) {
//     console.error('Error sending push notification:', error)
//     return { success: false, error: 'Failed to send notification' }
//   }
// }

export async function sendNotificationToAll(
  notificationData: {
    title: string
    body: string
    url?: string
    persistent?: boolean
  }
) {
  try {
    if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
      return { success: false, message: 'Push notifications are not configured' }
    }

    if (subscriptions.size === 0) {
      return { success: false, message: 'No active subscriptions' }
    }

    const notification = {
      title: notificationData.title,
      body: notificationData.body,
      icon: '/icon-192x192.png',
      url: notificationData.url || '/',
      persistent: notificationData.persistent || false,
    }

    const promises = Array.from(subscriptions).map((subscription) =>
      webpush
        .sendNotification(subscription, JSON.stringify(notification))
        .catch((error) => {
          console.error('Error sending notification:', error)
          subscriptions.delete(subscription)
        })
    )

    await Promise.all(promises)
    console.log(`Notification sent to ${subscriptions.size} users`)
    return { success: true, message: 'Notification sent' }
  } catch (error) {
    console.error('Error sending notification:', error)
    return { success: false, message: 'Failed to send notification' }
  }
}