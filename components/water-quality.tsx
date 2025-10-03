"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, AlertTriangle } from "lucide-react";

interface WaterParameter {
  name: string;
  value: number;
  unit: string;
  optimal: string;
  status: "good" | "warning" | "critical";
}

const waterQuality: WaterParameter[] = [
  { name: "EC (Salinity)", value: 1.8, unit: "dS/m", optimal: "1.5-2.0", status: "good" },
  { name: "pH Level", value: 6.2, unit: "", optimal: "5.8-6.5", status: "good" },
  { name: "TDS", value: 920, unit: "ppm", optimal: "< 1000", status: "good" },
  { name: "Chloride", value: 185, unit: "ppm", optimal: "< 200", status: "warning" },
];

export function WaterQuality() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5 text-purple-500" />
          Water Quality Analysis
        </CardTitle>
        <CardDescription>Desalinated water source parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {waterQuality.map((param) => (
            <div
              key={param.name}
              className={`rounded-lg border p-4 ${getStatusColor(param.status)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{param.name}</p>
                  <p className="text-sm opacity-80">Optimal: {param.optimal}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {param.value}
                    {param.unit && <span className="text-sm ml-1">{param.unit}</span>}
                  </p>
                  {param.status === "warning" && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="text-xs">Monitor</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

