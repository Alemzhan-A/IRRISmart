"use client";

import React, { useState, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts/auth-context";
import { NotificationTestButton } from "@/components/notification-test-button";
// For push notification logic
import { sendLowMoistureNotification } from "../../lib/notifications/send-low-moisture";
// Simulate a low moisture notification with timer
const MOISTURE_START = 40;
const MOISTURE_MIN = 10;
const MOISTURE_THRESHOLD = 20;
const MOISTURE_STEP = 5;
const MOISTURE_INTERVAL = 2000; // ms
import { User, Bell, Lock, Globe, Save, Menu } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    farmName: user?.farmName || "",
  });

  // Moisture simulation state
  const [moisture, setMoisture] = useState(MOISTURE_START);
  const [simActive, setSimActive] = useState(false);
  const [notified, setNotified] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate moisture drop and send notification
  const startMoistureSim = () => {
    if (simActive) return;
    setSimActive(true);
    setNotified(false);
    setMoisture(MOISTURE_START);
    timerRef.current = setInterval(() => {
      setMoisture((prev) => {
        const next = prev - MOISTURE_STEP;
        if (next <= MOISTURE_THRESHOLD && !notified) {
          // Send push notification (simulate)
          sendLowMoistureNotification();
          setNotified(true);
        }
        if (next <= MOISTURE_MIN) {
          clearInterval(timerRef.current!);
          setSimActive(false);
        }
        return next > MOISTURE_MIN ? next : MOISTURE_MIN;
      });
    }, MOISTURE_INTERVAL);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSave = () => {
    // TODO: Implement save functionality
    alert("Settings saved! (This will be connected to the API)");
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Manage your account and application preferences.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2 text-sm md:text-base" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Sidebar Navigation */}
            <div className="space-y-2 lg:block hidden">
              <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/5 text-primary text-sm">
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Lock className="h-4 w-4" />
                Security
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Globe className="h-4 w-4" />
                Preferences
              </Button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and farm details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Farm Name</label>
                    <Input
                      value={formData.farmName}
                      onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                      placeholder="Green Valley Farm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Test Notification Button */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                    <p className="font-medium text-gray-900 mb-3">Push Notifications</p>
                    <NotificationTestButton />
                  </div>
                  {/* Moisture Simulation */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-900">Low Moisture Simulation</span>
                      <Badge className={moisture <= MOISTURE_THRESHOLD ? "bg-red-500" : "bg-green-500"}>
                        {moisture <= MOISTURE_THRESHOLD ? "Low" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Current Moisture:</span>
                      <span className="font-mono text-lg">{moisture}%</span>
                    </div>
                    <Button
                      onClick={startMoistureSim}
                      disabled={simActive}
                      className="w-fit"
                      variant="secondary"
                    >
                      {simActive ? "Simulating..." : "Simulate Low Moisture"}
                    </Button>
                    {notified && (
                      <span className="text-xs text-red-600">Low moisture notification sent!</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Irrigation Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when irrigation cycles start/end</p>
                    </div>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Low Moisture Warnings</p>
                      <p className="text-sm text-gray-500">Alerts when soil moisture drops below threshold</p>
                    </div>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Weather Updates</p>
                      <p className="text-sm text-gray-500">Daily weather forecasts and warnings</p>
                    </div>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">System Maintenance</p>
                      <p className="text-sm text-gray-500">Updates about system status and maintenance</p>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>

                  <Button variant="outline" className="w-full">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Details about your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account Status</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium">October 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Fields</span>
                    <span className="font-medium">8 fields</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium">Professional</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

