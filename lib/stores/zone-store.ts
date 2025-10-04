import { create } from "zustand";

export interface Zone {
  id: string;
  name: string;
  crop: string;
  cropCategory?: string;
  area: number;
  color: string;
  coordinates: number[][];
  sensorData?: {
    moisture: number;
    temperature: number;
    salinity: number;
    lastUpdated: Date;
  };
  irrigation?: {
    isActive: boolean;
    totalMinutes: number;
    remainingMinutes: number;
    flowRate: number;
    lastIrrigation?: Date;
    lastFertigation?: Date;
  };
}

interface ZoneState {
  zones: Zone[];
  selectedZone: Zone | null;
  isDrawingMode: boolean;
  setZones: (zones: Zone[]) => void;
  addZone: (zone: Zone) => void;
  updateZone: (id: string, zone: Partial<Zone>) => void;
  deleteZone: (id: string) => void;
  setSelectedZone: (zone: Zone | null) => void;
  setDrawingMode: (mode: boolean) => void;
  clearSelectedZone: () => void;
}

export const useZoneStore = create<ZoneState>((set) => ({
  zones: [],
  selectedZone: null,
  isDrawingMode: false,
  
  setZones: (zones) => set({ zones }),
  
  addZone: (zone) =>
    set((state) => ({
      zones: [...state.zones, zone],
    })),
  
  updateZone: (id, updatedZone) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.id === id ? { ...zone, ...updatedZone } : zone
      ),
      selectedZone:
        state.selectedZone?.id === id
          ? { ...state.selectedZone, ...updatedZone }
          : state.selectedZone,
    })),
  
  deleteZone: async (id) => {
    // Delete from database
    try {
      await fetch(`/api/fields/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting field:", error);
    }

    // Delete from store
    set((state) => ({
      zones: state.zones.filter((zone) => zone.id !== id),
      selectedZone: state.selectedZone?.id === id ? null : state.selectedZone,
    }));
  },
  
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  
  setDrawingMode: (mode) => set({ isDrawingMode: mode }),
  
  clearSelectedZone: () => set({ selectedZone: null }),
}));

