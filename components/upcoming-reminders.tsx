"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon } from "lucide-react";

export function UpcomingReminders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Reminders
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">System Maintenance</h3>
          <p className="text-sm text-gray-600">Time : 02:00 pm - 04:00 pm</p>
          <Button className="w-full bg-primary hover:bg-primary/90">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

