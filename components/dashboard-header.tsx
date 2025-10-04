"use client";

import { Bell, Settings, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">FieldSenseAI</h1>
            <p className="text-xs text-muted-foreground">AI Irrigation Advisory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className="flex items-center gap-1.5"
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

