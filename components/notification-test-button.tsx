"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle } from "lucide-react";
import { requestNotificationPermission, sendLowMoistureAlert } from "@/lib/notifications/push-notifications";

export function NotificationTestButton() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window 
      ? Notification.permission 
      : "default"
  );

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission("granted");
      alert("Notifications enabled! You'll now receive alerts.");
    } else {
      alert("Notification permission denied. Please enable it in your browser settings.");
    }
  };

  const handleTestNotification = () => {
    if (permission === "granted") {
      sendLowMoistureAlert("North Field", 35);
    } else {
      alert("Please enable notifications first!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {permission !== "granted" && (
        <Button
          onClick={handleEnableNotifications}
          variant="outline"
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Enable Notifications
        </Button>
      )}
      
      <Button
        onClick={handleTestNotification}
        disabled={permission !== "granted"}
        variant="destructive"
        className="gap-2"
      >
        <AlertTriangle className="h-4 w-4" />
        Low Moisture Alert
      </Button>
    </div>
  );
}

