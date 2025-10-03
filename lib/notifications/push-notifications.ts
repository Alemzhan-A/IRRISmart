"use client";

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Send a notification
export function sendNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [200, 100, 200],
      ...options,
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  }
}

// Send low moisture alert
export function sendLowMoistureAlert(fieldName: string, moistureLevel: number) {
  return sendNotification("⚠️ Low Moisture Alert", {
    body: `${fieldName} moisture level is at ${moistureLevel}%. Irrigation recommended.`,
    tag: "low-moisture",
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "View Field",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  });
}

// Send irrigation complete notification
export function sendIrrigationCompleteNotification(fieldName: string) {
  return sendNotification("✅ Irrigation Complete", {
    body: `${fieldName} irrigation cycle has finished.`,
    tag: "irrigation-complete",
  });
}

// Send general alert
export function sendAlert(title: string, message: string) {
  return sendNotification(title, {
    body: message,
    tag: "general-alert",
  });
}

