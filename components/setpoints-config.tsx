"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Save } from "lucide-react";

interface Setpoint {
  id: string;
  parameter: string;
  current: number;
  unit: string;
  range: string;
  description: string;
}

const setpoints: Setpoint[] = [
  {
    id: "1",
    parameter: "Moisture Threshold",
    current: 60,
    unit: "%",
    range: "40-80",
    description: "Trigger irrigation when below",
  },
  {
    id: "2",
    parameter: "EC Target",
    current: 1.8,
    unit: "dS/m",
    range: "1.5-2.5",
    description: "Optimal salinity level",
  },
  {
    id: "3",
    parameter: "pH Target",
    current: 6.0,
    unit: "",
    range: "5.5-6.8",
    description: "Optimal pH level",
  },
  {
    id: "4",
    parameter: "Max Daily Water",
    current: 450,
    unit: "L",
    range: "300-600",
    description: "Per zone daily limit",
  },
];

export function SetpointsConfig() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-orange-500" />
              System Set-Points
            </CardTitle>
            <CardDescription>Configure irrigation and fertigation parameters</CardDescription>
          </div>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {setpoints.map((setpoint) => (
          <div
            key={setpoint.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-white"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{setpoint.parameter}</h4>
                <Badge variant="outline" className="text-xs">
                  Range: {setpoint.range}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{setpoint.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg border px-4 py-2">
                <input
                  type="number"
                  defaultValue={setpoint.current}
                  className="w-16 text-right text-lg font-bold border-none outline-none bg-transparent"
                  step={setpoint.unit === "dS/m" ? "0.1" : "1"}
                />
                {setpoint.unit && (
                  <span className="text-sm text-muted-foreground">{setpoint.unit}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

