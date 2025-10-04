"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { ZoneStats } from "@/components/zone-stats";
import { MoistureAnalytics } from "@/components/moisture-analytics";
import { ZoneProgress } from "@/components/zone-progress";
import { UpcomingReminders } from "@/components/upcoming-reminders";
import { ActiveZonesList } from "@/components/active-zones-list";
import { MoistureMonitor } from "@/components/moisture-monitor";
import { IrrigationSchedule } from "@/components/irrigation-schedule";
import { Button } from "@/components/ui/button";
import { Upload, Menu } from "lucide-react";

export default function OverviewPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Overview</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Monitor your irrigation zones and system performance.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 text-sm md:text-base">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Import Data</span>
                  <span className="sm:hidden">Import</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Zone Stats Cards */}
          <div className="mb-6">
            <ZoneStats />
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Left Column - Analytics */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <MoistureAnalytics />
              <MoistureMonitor />
              <IrrigationSchedule />
            </div>

            {/* Right Column - Reminders and Progress */}
            <div className="space-y-4 md:space-y-6">
              <UpcomingReminders />
              <ActiveZonesList />
              <ZoneProgress />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

