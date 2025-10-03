"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingDown, AlertCircle, Check } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  savings?: string;
  action: string;
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reduce Zone C Irrigation",
    description: "Rain forecast for Saturday (40%). Reduce irrigation by 30% to prevent over-watering.",
    priority: "high",
    savings: "25L water",
    action: "Apply",
  },
  {
    id: "2",
    title: "Adjust Fertigation Schedule",
    description: "Zone A tomatoes entering peak fruiting. Increase potassium by 15%.",
    priority: "medium",
    action: "Apply",
  },
  {
    id: "3",
    title: "Optimize Fog System Timing",
    description: "High humidity expected tomorrow. Delay fog system to conserve water.",
    priority: "low",
    savings: "18L water",
    action: "Apply",
  },
];

export function AIRecommendations() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <TrendingDown className="h-4 w-4" />;
      case "low":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Smart insights for water and nutrient optimization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                {getPriorityIcon(rec.priority)}
                <div>
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm mt-1 opacity-90">{rec.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs bg-white/50 uppercase">
                {rec.priority}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3">
              {rec.savings && (
                <div className="flex items-center gap-1 text-sm font-medium">
                  <TrendingDown className="h-3 w-3" />
                  <span>Save {rec.savings}</span>
                </div>
              )}
              <Button size="sm" variant="outline" className="ml-auto bg-white/70">
                <Check className="h-3 w-3 mr-1" />
                {rec.action}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

