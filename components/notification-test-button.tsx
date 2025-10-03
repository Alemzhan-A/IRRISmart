"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Smartphone } from "lucide-react";
import {
  subscribeToPushNotifications,
  sendPushNotification,
} from "@/lib/notifications/web-push";
import {
  isIOS,
  isIOSPWA,
  sendUniversalNotification,
} from "@/lib/notifications/ios-notifications";

export function NotificationTestButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    setIsPWA(isIOSPWA());

    // Check if already subscribed
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    }
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        setIsSubscribed(true);
        sendUniversalNotification(
          "✅ Notifications Enabled",
          "You can now receive alerts from any device!"
        );
      } else {
        alert("Failed to enable notifications. Please try again.");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      alert("Error enabling notifications. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToAllDevices = async () => {
    setIsLoading(true);
    try {
      const success = await sendPushNotification(
        "⚠️ Low Moisture Alert",
        "North Field moisture level is at 35%. Irrigation recommended.",
        {
          icon: "/icon-192x192.png",
          tag: "low-moisture",
        }
      );

      if (success) {
        alert("✅ Notification sent to all your devices!");
      } else {
        alert("❌ Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error sending notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* iOS PWA Installation Notice */}
      {isIOSDevice && !isPWA && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            iPhone/iPad Users
          </p>
          <p className="text-blue-700 mb-2">
            To receive cross-device notifications, install as PWA:
          </p>
          <ol className="text-blue-700 ml-4 space-y-1 list-decimal text-xs">
            <li>Tap Share (📤) in Safari</li>
            <li>Tap &quot;Add to Home Screen&quot;</li>
            <li>Open from Home Screen and enable notifications</li>
          </ol>
        </div>
      )}

      {/* Main Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">🔔 Cross-Device Notifications</h4>
        <ol className="text-sm text-green-800 space-y-1.5 ml-4 list-decimal">
          <li>Enable notifications on this device (iPhone/iPad/Laptop)</li>
          <li>Enable on your other devices too</li>
          <li>Send from any device - receive on ALL devices!</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {!isSubscribed && (
          <Button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <Bell className="h-4 w-4" />
            {isLoading ? "Enabling..." : "Enable on This Device"}
          </Button>
        )}

        <Button
          onClick={handleSendToAllDevices}
          disabled={isLoading || !isSubscribed}
          variant="destructive"
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          {isLoading ? "Sending..." : "Send to All Devices"}
        </Button>
      </div>

      {/* Status indicator */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-600">Status:</p>
        <p className="text-xs text-gray-500">
          {isSubscribed && "✅ This device is subscribed - will receive notifications"}
          {!isSubscribed && "⚠️ Enable notifications on this device first"}
        </p>
        {isIOSDevice && (
          <p className="text-xs text-gray-500">
            {isPWA ? "✅ Running as PWA" : "ℹ️ Install as PWA for best experience"}
          </p>
        )}
      </div>
    </div>
  );
}
