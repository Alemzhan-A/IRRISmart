"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const weekData = [
  { day: "M", value: 45, label: "Mon" },
  { day: "T", value: 78, label: "Tue" },
  { day: "W", value: 85, label: "Wed" },
  { day: "T", value: 52, label: "Thu" },
  { day: "F", value: 38, label: "Fri" },
  { day: "S", value: 28, label: "Sat" },
  { day: "S", value: 42, label: "Sun" },
];

export function MoistureAnalytics() {
  const maxValue = Math.max(...weekData.map(d => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Irrigation Analytics
        </CardTitle>
        <CardDescription>Weekly water usage pattern</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-64">
          {weekData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            const isHighUsage = item.value > 70;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div className="relative group w-full max-w-[60px]">
                    {isHighUsage && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-500">
                        {item.value}%
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isHighUsage
                          ? 'bg-gradient-to-t from-primary to-green-400'
                          : 'bg-gray-200'
                      }`}
                      style={{ 
                        height: `${height}%`,
                        backgroundImage: isHighUsage 
                          ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)'
                          : 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)'
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{item.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

