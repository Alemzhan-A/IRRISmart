/* eslint-disable @typescript-eslint/no-unused-vars */
// Minimal mock offline-service for development/build

export interface FieldData {
  id: string;
  name: string;
  crop: string;
  cropCategory: string;
  area: number;
  color: string;
  coordinates: number[][]; // Array of [lng, lat] pairs
  sensorData: {
    moisture: number;
    temperature: number;
    salinity: number;
  };
  irrigation: Record<string, unknown>; // Use a generic object for now
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number | null;
  pendingChanges: number;
  syncError: string | null;
}

export const offlineService = {
  async init() {},
  async getSettings() {
    return { syncInterval: 300000, maxCacheDays: 30, autoSync: true };
  },
  async getStorageInfo() {
    return { size: 0, fields: 0, readings: 0, pending: 0 };
  },
  async getFields() {
    return [];
  },
  async createField(fieldData: Omit<FieldData, 'id'>) {
    return { ...fieldData, id: Date.now().toString() };
  },
  async updateField(_id: string, _updates: Partial<FieldData>) {
    return null;
  },
  async deleteField(_id: string) {
    return true;
  },
  async saveSensorReading(_fieldId: string, _reading: { moisture: number; temperature: number; salinity: number }) {
    return;
  },
  async updateSettings(_settings: Partial<{ syncInterval: number; maxCacheDays: number; autoSync: boolean }>) {
    return;
  },
  async clearCache() {
    return;
  },
  async performSync() {
    return;
  },
  addSyncListener(_cb: (status: SyncStatus) => void) {
    return;
  },
  removeSyncListener(_cb: (status: SyncStatus) => void) {
    return;
  },
};
