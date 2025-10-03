"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Sprout, Droplet, Leaf, Apple } from "lucide-react";

interface Zone {
  id: string;
  icon: React.ReactNode;
  name: string;
  crop: string;
  status: "completed" | "in-progress" | "pending";
  dueDate: string;
}

const zones: Zone[] = [
  {
    id: "1",
    icon: <Sprout className="h-5 w-5 text-blue-600" />,
    name: "Zone A",
    crop: "Tomatoes - Flowering Stage",
    status: "completed",
    dueDate: "Nov 26, 2024",
  },
  {
    id: "2",
    icon: <Droplet className="h-5 w-5 text-cyan-600" />,
    name: "Zone B",
    crop: "Cucumbers - Fruiting Stage",
    status: "in-progress",
    dueDate: "Nov 28, 2024",
  },
  {
    id: "3",
    icon: <Leaf className="h-5 w-5 text-green-600" />,
    name: "Zone C",
    crop: "Lettuce - Vegetative",
    status: "completed",
    dueDate: "Nov 30, 2024",
  },
  {
    id: "4",
    icon: <Apple className="h-5 w-5 text-yellow-600" />,
    name: "Zone D",
    crop: "Peppers - Flowering Stage",
    status: "in-progress",
    dueDate: "Dec 5, 2024",
  },
  {
    id: "5",
    icon: <Sprout className="h-5 w-5 text-purple-600" />,
    name: "Zone E - New",
    crop: "Setup Required",
    status: "pending",
    dueDate: "Dec 6, 2024",
  },
];

export function ActiveZonesList() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Zones</CardTitle>
            <CardDescription>Manage your irrigation zones</CardDescription>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              {zone.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{zone.name}</p>
              <p className="text-xs text-gray-500 truncate">{zone.crop}</p>
              <p className="text-xs text-gray-400 mt-0.5">Due date: {zone.dueDate}</p>
            </div>
            {getStatusBadge(zone.status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

