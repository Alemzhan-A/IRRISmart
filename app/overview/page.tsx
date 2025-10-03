import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { ZoneStats } from "@/components/zone-stats";
import { MoistureAnalytics } from "@/components/moisture-analytics";
import { ZoneProgress } from "@/components/zone-progress";
import { UpcomingReminders } from "@/components/upcoming-reminders";
import { ActiveZonesList } from "@/components/active-zones-list";
import { MoistureMonitor } from "@/components/moisture-monitor";
import { WaterQuality } from "@/components/water-quality";
import { IrrigationSchedule } from "@/components/irrigation-schedule";
import { WeatherForecast } from "@/components/weather-forecast";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function OverviewPage() {
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
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                <p className="text-gray-500 mt-1">Monitor your irrigation zones and system performance.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Zone
                </Button>
              </div>
            </div>
          </div>

          {/* Zone Stats Cards */}
          <div className="mb-6">
            <ZoneStats />
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <MoistureAnalytics />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoistureMonitor />
                <WaterQuality />
              </div>

              <IrrigationSchedule />
            </div>

            {/* Right Column - Reminders and Progress */}
            <div className="space-y-6">
              <UpcomingReminders />
              <ActiveZonesList />
              <ZoneProgress />
            </div>
          </div>

          {/* Weather Forecast */}
          <div className="mb-6">
            <WeatherForecast />
          </div>
        </main>
      </div>
    </div>
  );
}

