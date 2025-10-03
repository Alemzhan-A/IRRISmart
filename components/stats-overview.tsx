"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingDown, Zap, Sprout } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

const stats: Stat[] = [
  {
    title: "Water Usage Today",
    value: "342 L",
    change: "-18% vs yesterday",
    trend: "down",
    icon: <Droplet className="h-5 w-5" />,
    color: "bg-blue-500",
  },
  {
    title: "Energy Saved",
    value: "12.4 kWh",
    change: "+24% this week",
    trend: "down",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-yellow-500",
  },
  {
    title: "Active Zones",
    value: "4/4",
    change: "All systems optimal",
    trend: "up",
    icon: <Sprout className="h-5 w-5" />,
    color: "bg-green-500",
  },
  {
    title: "Cost Savings",
    value: "$43",
    change: "+32% vs last week",
    trend: "down",
    icon: <TrendingDown className="h-5 w-5" />,
    color: "bg-purple-500",
  },
];

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-lg text-white`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

