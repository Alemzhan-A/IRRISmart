"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/lib/stores/modal-store";
import { useZoneStore } from "@/lib/stores/zone-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as turf from "@turf/turf";

export const CREATE_ZONE_MODAL_KEY = "create-zone";

export const CreateZoneModal = () => {
  const [crop, setCrop] = useState("");
  const [name, setName] = useState("");
  const { isOpen, data, close } = useModal(CREATE_ZONE_MODAL_KEY);
  const { addZone, setDrawingMode } = useZoneStore();

  useEffect(() => {
    setName((name) => (crop ? `${crop} Field 1` : name));
  }, [crop]);

  useEffect(() => {
    if (!isOpen) {
      setCrop("");
      setName("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!data || !crop || !name) {
      console.log("Missing data:", { data, crop, name });
      return;
    }

    const coordinates = data as number[][];
    
    // Calculate area in hectares using Turf.js
    const polygon = turf.polygon([coordinates]);
    const areaInHectares = turf.area(polygon) / 10000;

    const getRandomColor = () => {
      const colors = ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#8b5cf6", "#ec4899"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const newZone = {
      id: Date.now().toString(),
      name,
      crop,
      area: Math.round(areaInHectares * 100) / 100,
      color: getRandomColor(),
      coordinates,
    };

    console.log("Creating zone:", newZone);
    addZone(newZone);
    setDrawingMode(false);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Zone</DialogTitle>
          <DialogDescription>
            Add a new irrigation zone to your farm. Enter the crop type and zone name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="crop" className="text-sm font-medium">
              Crop Type
            </label>
            <Input
              id="crop"
              placeholder="e.g., Tomatoes, Cucumbers"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Zone Name
            </label>
            <Input
              id="name"
              placeholder={`Field ${Math.ceil(Math.random() * 100)}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!crop || !name}
            className="bg-primary hover:bg-primary/90"
          >
            Create Zone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

