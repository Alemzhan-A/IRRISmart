"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Leaf } from "lucide-react";

interface Crop {
  id: string;
  name: string;
  zone: string;
  stage: string;
  progress: number;
  waterNeed: "low" | "medium" | "high";
  nutrientNeed: "low" | "medium" | "high";
  daysToHarvest: number;
}

const crops: Crop[] = [
  {
    id: "1",
    name: "Tomatoes",
    zone: "Zone A",
    stage: "Flowering",
    progress: 65,
    waterNeed: "high",
    nutrientNeed: "high",
    daysToHarvest: 35,
  },
  {
    id: "2",
    name: "Cucumbers",
    zone: "Zone B",
    stage: "Fruiting",
    progress: 80,
    waterNeed: "high",
    nutrientNeed: "medium",
    daysToHarvest: 12,
  },
  {
    id: "3",
    name: "Lettuce",
    zone: "Zone C",
    stage: "Vegetative",
    progress: 45,
    waterNeed: "medium",
    nutrientNeed: "low",
    daysToHarvest: 21,
  },
  {
    id: "4",
    name: "Peppers",
    zone: "Zone D",
    stage: "Flowering",
    progress: 55,
    waterNeed: "medium",
    nutrientNeed: "high",
    daysToHarvest: 42,
  },
];

export function CropStage() {
  const getNeedBadge = (need: string) => {
    switch (need) {
      case "high":
        return <Badge className="bg-red-600 text-xs">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600 text-xs">Med</Badge>;
      case "low":
        return <Badge className="bg-green-600 text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">-</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-600" />
          Crop Growth Stages
        </CardTitle>
        <CardDescription>Growth tracking and resource requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {crops.map((crop) => (
          <div key={crop.id} className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold">{crop.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {crop.zone}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{crop.stage} Stage</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{crop.progress}%</p>
                <p className="text-xs text-muted-foreground">{crop.daysToHarvest} days</p>
              </div>
            </div>
            <Progress value={crop.progress} className="h-2" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Water:</span>
                {getNeedBadge(crop.waterNeed)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Nutrients:</span>
                {getNeedBadge(crop.nutrientNeed)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

