"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { FullScreenMap } from "@/components/full-screen-map";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
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
      <div className="flex-1">
        <FullScreenMap />
      </div>
    </div>
  );
}
