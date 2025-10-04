"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Droplets, Plus, Filter, ChevronLeft, ChevronRight, Play, Pause, Square, Menu } from "lucide-react";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scheduledTasks = [
    {
      id: 1,
      name: "North Field",
      time: "06:00 AM",
      liters: 5000,
      status: "upcoming",
      date: "Today",
    },
    {
      id: 2,
      name: "South Field",
      time: "08:30 AM",
      liters: 3500,
      status: "in-progress",
      date: "Today",
    },
    {
      id: 3,
      name: "East Field",
      time: "02:00 PM",
      liters: 7500,
      status: "completed",
      date: "Today",
    },
    {
      id: 4,
      name: "West Field",
      time: "10:00 AM",
      liters: 4200,
      status: "upcoming",
      date: "Tomorrow",
    },
    {
      id: 5,
      name: "Central Field",
      time: "03:00 PM",
      liters: 6000,
      status: "upcoming",
      date: "Tomorrow",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "upcoming":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        size="icon"
        className="fixed top-4 left-4 z-[60] lg:hidden shadow-lg"
        variant="default"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:ml-64">
        <TopHeader />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Schedule</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Manage your irrigation and maintenance schedule.</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button variant="outline" className="gap-2 text-sm md:text-base">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 gap-2 text-sm md:text-base">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Task</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base md:text-lg">Week View</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button variant="outline" className="text-xs md:text-sm px-3 h-8 md:h-10">
                    Today
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div
                    key={day}
                    className={`p-2 md:p-4 text-center rounded-lg border-2 transition-colors cursor-pointer ${
                      i === 2
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">{day}</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{15 + i}</p>
                    {i === 2 && (
                      <div className="mt-1 md:mt-2 flex justify-center gap-1">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today&apos;s Schedule
                </CardTitle>
                <CardDescription>
                  {scheduledTasks.filter((t) => t.date === "Today").length} tasks scheduled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledTasks
                  .filter((task) => task.date === "Today")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{task.name}</h4>
                            <Badge
                              className={`${getStatusColor(task.status)} text-white`}
                            >
                              {getStatusText(task.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {task.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplets className="h-4 w-4" />
                              {task.liters.toLocaleString()} L
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={task.status === "in-progress" ? "default" : "outline"}
                          className="flex-1"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={task.status !== "in-progress"}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={task.status === "completed"}
                        >
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Tomorrow's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Tomorrow&apos;s Schedule
                </CardTitle>
                <CardDescription>
                  {scheduledTasks.filter((t) => t.date === "Tomorrow").length} tasks scheduled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledTasks
                  .filter((task) => task.date === "Tomorrow")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{task.name}</h4>
                            <Badge
                              className={`${getStatusColor(task.status)} text-white`}
                            >
                              {getStatusText(task.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {task.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplets className="h-4 w-4" />
                              {task.liters.toLocaleString()} L
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

