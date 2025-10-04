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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROP_CATEGORIES } from "@/lib/constants/crop-categories";
import * as turf from "@turf/turf";

export const CREATE_ZONE_MODAL_KEY = "create-zone";

export const CreateZoneModal = () => {
  const [crop, setCrop] = useState("");
  const [name, setName] = useState("");
  const [cropCategory, setCropCategory] = useState("");
  const { isOpen, data, close } = useModal(CREATE_ZONE_MODAL_KEY);
  const { addZone, setDrawingMode } = useZoneStore();

  useEffect(() => {
    setName((name) => (crop ? `${crop} Field 1` : name));
  }, [crop]);

  useEffect(() => {
    if (!isOpen) {
      setCrop("");
      setName("");
      setCropCategory("");
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!data || !crop || !name || !cropCategory) {
      console.log("Missing data:", { data, crop, name, cropCategory });
      return;
    }

    const coordinates = data as number[][];

    // Calculate area in hectares using Turf.js
    const polygon = turf.polygon([coordinates]);
    const areaInHectares = turf.area(polygon) / 10000;

    try {
      // Save to database
      const response = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          crop,
          cropCategory,
          area: Math.round(areaInHectares * 100) / 100,
          color: "#22c55e", // Will be updated based on status
          coordinates,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create field:", error);
        alert("Failed to create field. Please try again.");
        return;
      }

      const { field } = await response.json();

      // Add to store with database ID
      addZone({
        id: field._id,
        name: field.name,
        crop: field.crop,
        cropCategory: field.cropCategory,
        area: field.area,
        color: field.color,
        coordinates: field.coordinates,
        sensorData: field.sensorData,
        irrigation: field.irrigation,
      });

      setDrawingMode(false);
      close();
    } catch (error) {
      console.error("Error creating field:", error);
      alert("Failed to create field. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Field</DialogTitle>
          <DialogDescription>
            Add a new irrigation field to your farm. Select crop category and enter details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Crop Category
            </label>
            <Select value={cropCategory} onValueChange={setCropCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop category" />
              </SelectTrigger>
              <SelectContent>
                {CROP_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="crop" className="text-sm font-medium">
              Specific Crop
            </label>
            <Input
              id="crop"
              placeholder="e.g., Tomatoes, Wheat, Apples"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Field Name
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
            disabled={!crop || !name || !cropCategory}
            className="bg-primary hover:bg-primary/90"
          >
            Create Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

