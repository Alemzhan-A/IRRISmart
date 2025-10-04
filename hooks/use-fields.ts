"use client";

import { useEffect } from "react";
import { useZoneStore } from "@/lib/stores/zone-store";

export function useFields() {
  const { setZones } = useZoneStore();

  useEffect(() => {
    async function loadFields() {
      try {
        const response = await fetch("/api/fields");

        if (!response.ok) {
          console.error("Failed to load fields");
          return;
        }

        const { fields } = await response.json();

        // Transform fields to zones format
        const zones = fields.map((field: any) => ({
          id: field._id,
          name: field.name,
          crop: field.crop,
          cropCategory: field.cropCategory,
          area: field.area,
          color: field.color,
          coordinates: field.coordinates,
          sensorData: field.sensorData,
          irrigation: field.irrigation,
        }));

        setZones(zones);
      } catch (error) {
        console.error("Error loading fields:", error);
      }
    }

    loadFields();
  }, [setZones]);
}
