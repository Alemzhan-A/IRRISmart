"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZoneStore } from "@/lib/stores/zone-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Droplets, Thermometer, Zap, Clock, Play, Pause, MapPin } from "lucide-react";

interface FieldDetailsProps {
  fieldId: string;
}

export function FieldDetails({ fieldId }: FieldDetailsProps) {
  const router = useRouter();
  const { zones } = useZoneStore();
  const field = zones.find((z) => z.id === fieldId);
  
  // Mock data - replace with real sensor data later
  const [sensorData, setSensorData] = useState({
    moisture: 68,
    temperature: 24.5,
    salinity: 1.8,
  });

  const [irrigationProgress, setIrrigationProgress] = useState({
    isActive: true,
    totalMinutes: 60,
    remainingMinutes: 42,
  });

  useEffect(() => {
    // Simulate irrigation countdown
    if (!irrigationProgress.isActive) return;

    const timer = setInterval(() => {
      setIrrigationProgress((prev) => {
        if (prev.remainingMinutes <= 0) {
          return { ...prev, isActive: false, remainingMinutes: 0 };
        }
        return { ...prev, remainingMinutes: prev.remainingMinutes - 1 };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [irrigationProgress.isActive]);

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

  const progressPercentage = ((irrigationProgress.totalMinutes - irrigationProgress.remainingMinutes) / irrigationProgress.totalMinutes) * 100;

  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{field.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge className="bg-primary">{field.crop}</Badge>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{field.area.toFixed(2)} hectares</span>
              </div>
            </div>
          </div>
          <div
            className="w-6 h-6 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: field.color }}
          />
        </div>
      </div>

      {/* Sensor Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Moisture */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Soil Moisture
            </CardTitle>
            <Droplets className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{sensorData.moisture}%</div>
            <Progress 
              value={sensorData.moisture} 
              indicatorClassName={
                sensorData.moisture > 60 
                  ? "bg-green-600" 
                  : sensorData.moisture > 40 
                  ? "bg-yellow-600" 
                  : "bg-red-600"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sensorData.moisture > 60 ? "Optimal" : sensorData.moisture > 40 ? "Low" : "Critical"}
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
            <div className="text-3xl font-bold mb-2">{sensorData.temperature}°C</div>
            <Progress value={(sensorData.temperature / 40) * 100} />
            <p className="text-xs text-muted-foreground mt-2">
              Ideal range: 18-28°C
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
            <div className="text-3xl font-bold mb-2">{sensorData.salinity} dS/m</div>
            <Progress 
              value={(sensorData.salinity / 3) * 100}
              indicatorClassName={
                sensorData.salinity < 2 
                  ? "bg-green-600" 
                  : sensorData.salinity < 2.5 
                  ? "bg-yellow-600" 
                  : "bg-red-600"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sensorData.salinity < 2 ? "Good" : sensorData.salinity < 2.5 ? "Elevated" : "High"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Irrigation Progress */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Irrigation Progress
              </CardTitle>
              <CardDescription className="mt-1">
                {irrigationProgress.isActive ? "Irrigation in progress" : "No active irrigation"}
              </CardDescription>
            </div>
            <Badge 
              variant={irrigationProgress.isActive ? "default" : "outline"}
              className={irrigationProgress.isActive ? "bg-green-600" : ""}
            >
              {irrigationProgress.isActive ? (
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
          {irrigationProgress.isActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time remaining</span>
                <span className="font-bold text-2xl text-primary">
                  {Math.floor(irrigationProgress.remainingMinutes / 60)}h {irrigationProgress.remainingMinutes % 60}m
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Elapsed: {irrigationProgress.totalMinutes - irrigationProgress.remainingMinutes} min
                </span>
                <span>
                  Total: {irrigationProgress.totalMinutes} min
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Water Used</p>
                  <p className="text-lg font-semibold">
                    {((irrigationProgress.totalMinutes - irrigationProgress.remainingMinutes) * 2.5).toFixed(1)} L
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flow Rate</p>
                  <p className="text-lg font-semibold">2.5 L/min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Target</p>
                  <p className="text-lg font-semibold">
                    {(irrigationProgress.totalMinutes * 2.5).toFixed(0)} L
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

