"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherDay {
  day: string;
  temp: number;
  humidity: number;
  precipitation: number;
  wind: number;
  condition: "sunny" | "cloudy" | "rainy";
}

const forecast: WeatherDay[] = [
  { day: "Today", temp: 32, humidity: 45, precipitation: 0, wind: 12, condition: "sunny" },
  { day: "Tomorrow", temp: 31, humidity: 52, precipitation: 5, wind: 15, condition: "cloudy" },
  { day: "Sat", temp: 29, humidity: 68, precipitation: 40, wind: 18, condition: "rainy" },
  { day: "Sun", temp: 30, humidity: 55, precipitation: 10, wind: 14, condition: "cloudy" },
];

export function WeatherForecast() {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-400" />
          Weather Forecast
        </CardTitle>
        <CardDescription>4-day forecast for irrigation planning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecast.map((day) => (
            <div
              key={day.day}
              className="rounded-lg border bg-gradient-to-br from-blue-50 to-white p-4 space-y-2"
            >
              <p className="font-semibold text-center">{day.day}</p>
              <div className="flex justify-center">{getWeatherIcon(day.condition)}</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-red-500" />
                    <span className="text-xs">Temp</span>
                  </div>
                  <span className="font-medium">{day.temp}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-xs">Humid</span>
                  </div>
                  <span className="font-medium">{day.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Rain</span>
                  </div>
                  <span className="font-medium">{day.precipitation}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3 text-gray-500" />
                    <span className="text-xs">Wind</span>
                  </div>
                  <span className="font-medium">{day.wind} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

