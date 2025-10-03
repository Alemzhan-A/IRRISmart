"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PlayCircle, PauseCircle } from "lucide-react";

interface ScheduleItem {
  id: string;
  zone: string;
  time: string;
  duration: number;
  amount: number;
  status: "scheduled" | "active" | "completed";
  type: "irrigation" | "fertigation";
}

const schedule: ScheduleItem[] = [
  {
    id: "1",
    zone: "Zone A",
    time: "06:00",
    duration: 25,
    amount: 120,
    status: "completed",
    type: "irrigation",
  },
  {
    id: "2",
    zone: "Zone B",
    time: "14:30",
    duration: 35,
    amount: 180,
    status: "active",
    type: "fertigation",
  },
  {
    id: "3",
    zone: "Zone C",
    time: "18:00",
    duration: 20,
    amount: 95,
    status: "scheduled",
    type: "irrigation",
  },
  {
    id: "4",
    zone: "Zone D",
    time: "19:30",
    duration: 15,
    amount: 75,
    status: "scheduled",
    type: "irrigation",
  },
];

export function IrrigationSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Today&apos;s Schedule
        </CardTitle>
        <CardDescription>AI-optimized irrigation and fertigation plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              item.status === "active" ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                <span className="text-sm font-bold">{item.time}</span>
              </div>
              <div>
                <p className="font-medium">{item.zone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {item.duration} min • {item.amount}L
                  </span>
                  <Badge variant={item.type === "fertigation" ? "default" : "outline"} className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.status === "active" && (
                <Button size="sm" variant="outline">
                  <PauseCircle className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              {item.status === "scheduled" && (
                <Button size="sm" variant="outline">
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Start
                </Button>
              )}
              {item.status === "completed" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

