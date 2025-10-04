"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { FullScreenMap } from "@/components/full-screen-map";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
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
      <div className="flex-1 flex flex-col">
        {/* Offline Mode Button */}
        <div className="w-full flex justify-end p-4">
          <Button variant="outline" onClick={() => router.push("/offline")}>Offline Mode</Button>
        </div>
        <div className="flex-1">
          <FullScreenMap />
        </div>
      </div>
    </div>
  );
}
