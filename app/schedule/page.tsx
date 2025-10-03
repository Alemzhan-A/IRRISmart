import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Droplets, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function SchedulePage() {
  const scheduledTasks = [
    {
      id: 1,
      field: "North Field",
      task: "Irrigation",
      time: "06:00 AM",
      duration: "2 hours",
      status: "upcoming",
      date: "Today",
    },
    {
      id: 2,
      field: "South Field",
      task: "Fertigation",
      time: "08:30 AM",
      duration: "1.5 hours",
      status: "upcoming",
      date: "Today",
    },
    {
      id: 3,
      field: "East Field",
      task: "Irrigation",
      time: "02:00 PM",
      duration: "3 hours",
      status: "completed",
      date: "Today",
    },
    {
      id: 4,
      field: "West Field",
      task: "Soil Testing",
      time: "10:00 AM",
      duration: "1 hour",
      status: "upcoming",
      date: "Tomorrow",
    },
    {
      id: 5,
      field: "North Field",
      task: "Fertigation",
      time: "03:00 PM",
      duration: "2 hours",
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
      <Sidebar />
      
      <div className="ml-64">
        <TopHeader />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
                <p className="text-gray-500 mt-1">Manage your irrigation and maintenance schedule.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Week View</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    Today
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div
                    key={day}
                    className={`p-4 text-center rounded-lg border-2 transition-colors cursor-pointer ${
                      i === 2
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-xs text-gray-500 mb-1">{day}</p>
                    <p className="text-2xl font-bold text-gray-900">{15 + i}</p>
                    {i === 2 && (
                      <div className="mt-2 flex justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Schedule
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
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{task.field}</h4>
                            <Badge
                              className={`${getStatusColor(task.status)} text-white`}
                            >
                              {getStatusText(task.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{task.task}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          {task.duration}
                        </div>
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
                  Tomorrow's Schedule
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
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{task.field}</h4>
                            <Badge
                              className={`${getStatusColor(task.status)} text-white`}
                            >
                              {getStatusText(task.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{task.task}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          {task.duration}
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

