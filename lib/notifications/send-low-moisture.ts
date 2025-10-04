// Sends a push notification for low moisture simulation
export function sendLowMoistureNotification() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("FieldSenseAI: Low Moisture Warning", {
        body: "Soil moisture has dropped below the safe threshold!",
        icon: "/globe.svg",
        tag: "low-moisture"
      });
    }
  }
}