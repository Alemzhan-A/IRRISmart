"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fan, Waves, ThermometerSun, Power } from "lucide-react";
import { useState } from "react";

interface GreenhouseSystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "active" | "inactive" | "scheduled";
  nextRun?: string;
  duration?: number;
}

export function GreenhouseControls() {
  const [systems, setSystems] = useState<GreenhouseSystem[]>([
    {
      id: "fog",
      name: "Fog System",
      icon: <Waves className="h-5 w-5" />,
      status: "scheduled",
      nextRun: "15:30",
      duration: 10,
    },
    {
      id: "pad",
      name: "Cooling Pad",
      icon: <ThermometerSun className="h-5 w-5" />,
      status: "active",
      duration: 25,
    },
    {
      id: "ventilation",
      name: "Ventilation",
      icon: <Fan className="h-5 w-5" />,
      status: "active",
      duration: 45,
    },
  ]);

  const toggleSystem = (id: string) => {
    setSystems(
      systems.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              status: sys.status === "active" ? "inactive" : "active",
            }
          : sys
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fan className="h-5 w-5 text-cyan-500" />
          Greenhouse Climate Control
        </CardTitle>
        <CardDescription>Automated pad and fog cooling systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {systems.map((system) => (
          <div
            key={system.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  system.status === "active"
                    ? "bg-green-100 text-green-700"
                    : system.status === "scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {system.icon}
              </div>
              <div>
                <p className="font-medium">{system.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {system.status === "active" && (
                    <span className="text-sm text-muted-foreground">
                      Running • {system.duration} min remaining
                    </span>
                  )}
                  {system.status === "scheduled" && (
                    <span className="text-sm text-muted-foreground">
                      Next run: {system.nextRun} • {system.duration} min
                    </span>
                  )}
                  {system.status === "inactive" && (
                    <span className="text-sm text-muted-foreground">Inactive</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  system.status === "active"
                    ? "default"
                    : system.status === "scheduled"
                    ? "outline"
                    : "outline"
                }
                className={
                  system.status === "active"
                    ? "bg-green-600"
                    : system.status === "scheduled"
                    ? "bg-blue-600 text-white"
                    : ""
                }
              >
                {system.status}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleSystem(system.id)}
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

