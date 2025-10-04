"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Droplets, Thermometer, Zap, Clock, Play, Pause, MapPin, AlertCircle } from "lucide-react";
import { CROP_CATEGORIES, getFieldStatus, getFieldColor } from "@/lib/constants/crop-categories";
import type { Zone } from "@/lib/stores/zone-store";

interface FieldDetailsProps {
  fieldId: string;
}

export function FieldDetails({ fieldId }: FieldDetailsProps) {
  const router = useRouter();
  const [field, setField] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchField() {
      try {
        const response = await fetch(`/api/fields/${fieldId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch field");
        }
        const { field: fieldData } = await response.json();

        setField({
          id: fieldData._id,
          name: fieldData.name,
          crop: fieldData.crop,
          cropCategory: fieldData.cropCategory,
          area: fieldData.area,
          color: fieldData.color,
          coordinates: fieldData.coordinates,
          sensorData: fieldData.sensorData,
          irrigation: fieldData.irrigation,
        });
      } catch (error) {
        console.error("Error fetching field:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchField();
  }, [fieldId]);

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading field data...</p>
        </div>
      </main>
    );
  }

  if (!field) {
    return (
      <main className="p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Field not found</h2>
          <p className="text-gray-500 mt-2">The field you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // Get crop category thresholds
  const category = field.cropCategory
    ? CROP_CATEGORIES.find((c) => c.id === field.cropCategory)
    : null;

  // Get field status and color
  const fieldStatus = field.cropCategory && field.sensorData && field.irrigation
    ? getFieldStatus(
        field.cropCategory,
        {
          moisture: field.sensorData.moisture,
          temperature: field.sensorData.temperature,
          salinity: field.sensorData.salinity,
        },
        field.irrigation.isActive
      )
    : "normal";

  const fieldColor = getFieldColor(fieldStatus);

  const progressPercentage = field.irrigation
    ? ((field.irrigation.totalMinutes - field.irrigation.remainingMinutes) / field.irrigation.totalMinutes) * 100
    : 0;

  const statusLabels = {
    needs_irrigation: "Needs Irrigation",
    normal: "Normal",
    irrigating: "Irrigating",
  };

  return (
    <main className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-sm md:text-base">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{field.name}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
              <Badge className="bg-primary text-xs md:text-sm">{field.crop}</Badge>
              {category && (
                <Badge variant="outline" className="gap-1 text-xs md:text-sm">
                  {category.emoji} {category.name}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span>{field.area.toFixed(2)} hectares</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className="text-white text-xs md:text-sm"
              style={{ backgroundColor: fieldColor }}
            >
              {statusLabels[fieldStatus]}
            </Badge>
            <div
              className="w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: fieldColor }}
            />
          </div>
        </div>
      </div>

      {/* Thresholds Card */}
      {category && (
        <Card className="mb-6 border-l-4" style={{ borderLeftColor: fieldColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Crop Thresholds - {category.name}
            </CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Temperature Range</p>
                <p className="text-lg font-bold">
                  {category.thresholds.temperature.min}°C - {category.thresholds.temperature.max}°C
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Moisture Range</p>
                <p className="text-lg font-bold">
                  {category.thresholds.moisture.min}% - {category.thresholds.moisture.max}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Max Salinity</p>
                <p className="text-lg font-bold">
                  ≤ {category.thresholds.salinity.max} {category.thresholds.salinity.unit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sensor Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Moisture */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Soil Moisture
            </CardTitle>
            <Droplets className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {field.sensorData?.moisture ?? 0}%
            </div>
            <Progress
              value={field.sensorData?.moisture ?? 0}
              indicatorClassName={
                category && field.sensorData
                  ? field.sensorData.moisture >= category.thresholds.moisture.min &&
                    field.sensorData.moisture <= category.thresholds.moisture.max
                    ? "bg-green-600"
                    : field.sensorData.moisture < category.thresholds.moisture.min
                    ? "bg-red-600"
                    : "bg-yellow-600"
                  : "bg-gray-400"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {category
                ? `Optimal: ${category.thresholds.moisture.min}-${category.thresholds.moisture.max}%`
                : "No thresholds set"}
            </p>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Soil Temperature
            </CardTitle>
            <Thermometer className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {field.sensorData?.temperature ?? 0}°C
            </div>
            <Progress
              value={
                category && field.sensorData
                  ? ((field.sensorData.temperature - category.thresholds.temperature.min) /
                      (category.thresholds.temperature.max - category.thresholds.temperature.min)) *
                    100
                  : 0
              }
              indicatorClassName={
                category && field.sensorData
                  ? field.sensorData.temperature >= category.thresholds.temperature.min &&
                    field.sensorData.temperature <= category.thresholds.temperature.max
                    ? "bg-green-600"
                    : "bg-yellow-600"
                  : "bg-gray-400"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {category
                ? `Optimal: ${category.thresholds.temperature.min}-${category.thresholds.temperature.max}°C`
                : "No thresholds set"}
            </p>
          </CardContent>
        </Card>

        {/* Salinity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Salinity (EC)
            </CardTitle>
            <Zap className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {field.sensorData?.salinity.toFixed(1) ?? 0} dS/m
            </div>
            <Progress
              value={
                category && field.sensorData
                  ? (field.sensorData.salinity / category.thresholds.salinity.max) * 100
                  : 0
              }
              indicatorClassName={
                category && field.sensorData
                  ? field.sensorData.salinity <= category.thresholds.salinity.max
                    ? "bg-green-600"
                    : "bg-red-600"
                  : "bg-gray-400"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {category ? `Max: ${category.thresholds.salinity.max} dS/m` : "No thresholds set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Irrigation Progress */}
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Irrigation Progress
              </CardTitle>
              <CardDescription className="mt-1">
                {field.irrigation?.isActive ? "Irrigation in progress" : "No active irrigation"}
              </CardDescription>
            </div>
            <Badge
              variant={field.irrigation?.isActive ? "default" : "outline"}
              className={field.irrigation?.isActive ? "bg-green-600" : ""}
            >
              {field.irrigation?.isActive ? (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Idle
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {field.irrigation?.isActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time remaining</span>
                <span className="font-bold text-2xl text-primary">
                  {Math.floor((field.irrigation?.remainingMinutes ?? 0) / 60)}h{" "}
                  {(field.irrigation?.remainingMinutes ?? 0) % 60}m
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Elapsed:{" "}
                  {(field.irrigation?.totalMinutes ?? 0) -
                    (field.irrigation?.remainingMinutes ?? 0)}{" "}
                  min
                </span>
                <span>Total: {field.irrigation?.totalMinutes ?? 0} min</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Water Used</p>
                  <p className="text-lg font-semibold">
                    {(
                      ((field.irrigation?.totalMinutes ?? 0) -
                        (field.irrigation?.remainingMinutes ?? 0)) *
                      (field.irrigation?.flowRate ?? 2.5)
                    ).toFixed(1)}{" "}
                    L
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flow Rate</p>
                  <p className="text-lg font-semibold">
                    {field.irrigation?.flowRate ?? 2.5} L/min
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Target</p>
                  <p className="text-lg font-semibold">
                    {(
                      (field.irrigation?.totalMinutes ?? 0) *
                      (field.irrigation?.flowRate ?? 2.5)
                    ).toFixed(0)}{" "}
                    L
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No irrigation scheduled</p>
              <Button className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Start Irrigation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Irrigation</span>
                <span className="font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Fertigation</span>
                <span className="font-medium">1 day ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Sensor Reading</span>
                <span className="font-medium">5 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Area</span>
                <span className="font-medium">{field.area.toFixed(2)} ha</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Crop Type</span>
                <span className="font-medium">{field.crop}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {new Date(parseInt(field.id)).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

