import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Droplets, Download, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Water Used",
      value: "2,450 L",
      change: "+12.5%",
      trend: "up",
      description: "vs last month",
    },
    {
      title: "Average Moisture",
      value: "68%",
      change: "+5.2%",
      trend: "up",
      description: "Optimal range",
    },
    {
      title: "Active Fields",
      value: "8",
      change: "+2",
      trend: "up",
      description: "This season",
    },
    {
      title: "Water Efficiency",
      value: "92%",
      change: "-3.1%",
      trend: "down",
      description: "vs target",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        <TopHeader />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Deep insights into your irrigation performance.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Last 30 Days
                </Button>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Water Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Water Usage Trends
                </CardTitle>
                <CardDescription>Daily water consumption over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = Math.random() * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`Day ${i + 1}: ${Math.round(height * 10)}L`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>

            {/* Moisture Levels Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-green-500" />
                  Moisture Levels
                </CardTitle>
                <CardDescription>Average soil moisture across all fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = 50 + Math.random() * 50;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`Day ${i + 1}: ${Math.round(height)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Field Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Field Performance Comparison</CardTitle>
              <CardDescription>Water efficiency and crop health by field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["North Field", "South Field", "East Field", "West Field"].map((field, i) => {
                  const efficiency = 75 + Math.random() * 25;
                  const health = 70 + Math.random() * 30;
                  
                  return (
                    <div key={field}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{field}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(efficiency)}% efficient
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${efficiency}%` }}
                          />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${health}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          Water Efficiency
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Crop Health
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

