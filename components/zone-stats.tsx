"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoneStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  color: string;
  status?: string;
}

const zoneStats: ZoneStat[] = [
  {
    id: "1",
    title: "Total Zones",
    value: "4",
    change: "Increased from last month",
    trend: "up",
    color: "bg-gradient-to-br from-green-600 to-green-700",
    status: "All Active"
  },
  {
    id: "2",
    title: "Optimal Zones",
    value: "2",
    change: "Increased from last month",
    trend: "up",
    color: "bg-white",
  },
  {
    id: "3",
    title: "Needs Attention",
    value: "2",
    change: "Increased from last month",
    trend: "up",
    color: "bg-white",
  },
  {
    id: "4",
    title: "Critical Zones",
    value: "0",
    change: "On Discuss",
    trend: "down",
    color: "bg-white",
  },
];

export function ZoneStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {zoneStats.map((stat, index) => (
        <Card 
          key={stat.id}
          className={`${stat.color} ${index === 0 ? 'text-white border-0 shadow-lg' : ''} relative overflow-hidden`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${index === 0 ? 'text-white' : 'text-gray-600'}`}>
              {stat.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-8 w-8 rounded-full ${
                index === 0 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
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

