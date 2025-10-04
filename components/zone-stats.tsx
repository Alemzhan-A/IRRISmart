"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { getFieldStatus } from "@/lib/constants/crop-categories";

interface FieldData {
  _id: string;
  cropCategory: string;
  sensorData: {
    moisture: number;
    temperature: number;
    salinity: number;
  };
  irrigation: {
    isActive: boolean;
  };
}

export function ZoneStats() {
  const [stats, setStats] = useState({
    total: 0,
    needsIrrigation: 0,
    normal: 0,
    irrigating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFields() {
      try {
        const response = await fetch("/api/fields");
        if (!response.ok) return;

        const { fields } = await response.json();

        let needsIrrigation = 0;
        let normal = 0;
        let irrigating = 0;

        fields.forEach((field: FieldData) => {
          const status = getFieldStatus(
            field.cropCategory,
            {
              moisture: field.sensorData.moisture,
              temperature: field.sensorData.temperature,
              salinity: field.sensorData.salinity,
            },
            field.irrigation.isActive
          );

          if (status === "needs_irrigation") needsIrrigation++;
          else if (status === "normal") normal++;
          else if (status === "irrigating") irrigating++;
        });

        setStats({
          total: fields.length,
          needsIrrigation,
          normal,
          irrigating,
        });
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFields();
  }, []);

  const statCards = [
    {
      id: "1",
      title: "Total Fields",
      value: stats.total,
      change: "All Active",
      trend: "up",
      color: "bg-gradient-to-br from-green-600 to-green-700",
      status: "All Active",
    },
    {
      id: "2",
      title: "Need Irrigation",
      value: stats.needsIrrigation,
      change: "Needs attention",
      trend: "up",
      color: "bg-white",
    },
    {
      id: "3",
      title: "Normal",
      value: stats.normal,
      change: "Optimal condition",
      trend: "up",
      color: "bg-white",
    },
    {
      id: "4",
      title: "Irrigating",
      value: stats.irrigating,
      change: "Currently active",
      trend: "down",
      color: "bg-white",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card
          key={stat.id}
          className={`${stat.color} ${index === 0 ? "text-white border-0 shadow-lg" : ""} relative overflow-hidden`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${index === 0 ? "text-white" : "text-gray-600"}`}
            >
              {stat.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${
                index === 0
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            {index === 0 && stat.status && (
              <Badge className="bg-white/20 text-white border-0 mb-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.status}
              </Badge>
            )}
            {index !== 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{stat.change}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

