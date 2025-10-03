"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplet, TrendingUp, TrendingDown } from "lucide-react";

interface SensorData {
  id: string;
  zone: string;
  moisture: number;
  optimal: number;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

const mockSensorData: SensorData[] = [
  { id: "z1", zone: "Zone A - Tomatoes", moisture: 68, optimal: 70, status: "good", trend: "up" },
  { id: "z2", zone: "Zone B - Cucumbers", moisture: 45, optimal: 65, status: "warning", trend: "down" },
  { id: "z3", zone: "Zone C - Lettuce", moisture: 32, optimal: 60, status: "critical", trend: "down" },
  { id: "z4", zone: "Zone D - Peppers", moisture: 72, optimal: 70, status: "good", trend: "stable" },
];

export function MoistureMonitor() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-600">Optimal</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600">Low</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Soil Moisture Monitoring
        </CardTitle>
        <CardDescription>Real-time substrate moisture levels across zones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSensorData.map((sensor) => (
          <div key={sensor.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{sensor.zone}</span>
                {sensor.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                {sensor.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${getStatusColor(sensor.status)}`}>
                  {sensor.moisture}%
                </span>
                {getStatusBadge(sensor.status)}
              </div>
            </div>
            <Progress
              value={sensor.moisture}
              max={100}
              indicatorClassName={
                sensor.status === "critical"
                  ? "bg-red-600"
                  : sensor.status === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }
            />
            <p className="text-xs text-muted-foreground">
              Optimal: {sensor.optimal}% • Current: {sensor.moisture}%
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

