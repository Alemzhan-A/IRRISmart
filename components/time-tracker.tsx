"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Square } from "lucide-react";
import { useState, useEffect } from "react";

export function TimeTracker() {
  const [seconds, setSeconds] = useState(5048); // Starting at 01:24:08
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-0 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600/20 rounded-full blur-2xl"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">System Uptime</h3>
        </div>
        
        <div className="text-center mb-8">
          <div className="text-5xl font-bold tracking-wider mb-2">
            {formatTime(seconds)}
          </div>
          <p className="text-sm text-green-100">Continuous monitoring active</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant="outline"
            size="icon"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
          </Button>
          <Button
            onClick={() => setSeconds(0)}
            variant="outline"
            size="icon"
            className="bg-red-500/20 hover:bg-red-500/30 border-red-300/20 text-white backdrop-blur"
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>

        {/* Decorative wave pattern */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

