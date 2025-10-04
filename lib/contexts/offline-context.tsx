/**
 * Offline Context and Hooks
 * Provides offline functionality throughout the application
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { offlineService, FieldData, SyncStatus } from '@/lib/offline/offline-service';

interface OfflineContextType {
  // Connection status
  isOnline: boolean;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  
  // Sync status
  syncStatus: SyncStatus;
  performSync: () => Promise<void>;
  
  // Data operations
  fields: FieldData[];
  loading: boolean;
  error: string | null;
  refreshFields: () => Promise<void>;
  createField: (fieldData: Omit<FieldData, 'id'>) => Promise<FieldData>;
  updateField: (id: string, updates: Partial<FieldData>) => Promise<FieldData | null>;
  deleteField: (id: string) => Promise<boolean>;
  
  // Sensor data
  saveSensorReading: (fieldId: string, reading: {
    moisture: number;
    temperature: number;
    salinity: number;
  }) => Promise<void>;
  
  // Settings
  settings: {
    syncInterval: number;
    maxCacheDays: number;
    autoSync: boolean;
  };
  updateSettings: (settings: Partial<{
    syncInterval: number;
    maxCacheDays: number;
    autoSync: boolean;
  }>) => Promise<void>;
  
  // Storage info
  storageInfo: {
    size: number;
    fields: number;
    readings: number;
    pending: number;
  };
  clearCache: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    syncError: null,
  });
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    syncInterval: 300000, // 5 minutes
    maxCacheDays: 30,
    autoSync: true,
  });
  const [storageInfo, setStorageInfo] = useState({
    size: 0,
    fields: 0,
    readings: 0,
    pending: 0,
  });

  useEffect(() => {
    // Initialize offline service
    const initService = async () => {
      try {
        await offlineService.init();
        const serviceSettings = await offlineService.getSettings();
        setSettings(serviceSettings);
        
        const info = await offlineService.getStorageInfo();
        setStorageInfo(info);
        
        await refreshFields();
      } catch (err) {
        console.error('Failed to initialize offline service:', err);
        setError('Failed to initialize offline functionality');
      } finally {
        setLoading(false);
      }
    };

    initService();

    // Listen for sync status changes
    const handleSyncStatusChange = (status: SyncStatus) => {
      setSyncStatus(status);
      setIsOnline(status.isOnline);
    };

    offlineService.addSyncListener(handleSyncStatusChange);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      offlineService.removeSyncListener(handleSyncStatusChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };

  const performSync = async () => {
    try {
      await offlineService.performSync();
      await refreshFields();
      const info = await offlineService.getStorageInfo();
      setStorageInfo(info);
    } catch (err) {
      console.error('Sync failed:', err);
      setError('Sync failed. Please try again.');
    }
  };

  const refreshFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const fieldsData = await offlineService.getFields();
      setFields(fieldsData);
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      setError('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  const createField = async (fieldData: Omit<FieldData, 'id'>): Promise<FieldData> => {
    try {
      setError(null);
      const newField = await offlineService.createField(fieldData);
      await refreshFields();
      const info = await offlineService.getStorageInfo();
      setStorageInfo(info);
      return newField;
    } catch (err) {
      console.error('Failed to create field:', err);
      setError('Failed to create field');
      throw err;
    }
  };

  const updateField = async (id: string, updates: Partial<FieldData>): Promise<FieldData | null> => {
    try {
      setError(null);
      const updatedField = await offlineService.updateField(id, updates);
      if (updatedField) {
        await refreshFields();
        const info = await offlineService.getStorageInfo();
        setStorageInfo(info);
      }
      return updatedField;
    } catch (err) {
      console.error('Failed to update field:', err);
      setError('Failed to update field');
      throw err;
    }
  };

  const deleteField = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await offlineService.deleteField(id);
      if (success) {
        await refreshFields();
        const info = await offlineService.getStorageInfo();
        setStorageInfo(info);
      }
      return success;
    } catch (err) {
      console.error('Failed to delete field:', err);
      setError('Failed to delete field');
      throw err;
    }
  };

  const saveSensorReading = async (fieldId: string, reading: {
    moisture: number;
    temperature: number;
    salinity: number;
  }) => {
    try {
      await offlineService.saveSensorReading(fieldId, reading);
      // Optionally refresh fields to update sensor data
      await refreshFields();
    } catch (err) {
      console.error('Failed to save sensor reading:', err);
      setError('Failed to save sensor reading');
      throw err;
    }
  };

  const updateSettings = async (newSettings: Partial<{
    syncInterval: number;
    maxCacheDays: number;
    autoSync: boolean;
  }>) => {
    try {
      await offlineService.updateSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings');
      throw err;
    }
  };

  const clearCache = async () => {
    try {
      await offlineService.clearCache();
      const info = await offlineService.getStorageInfo();
      setStorageInfo(info);
    } catch (err) {
      console.error('Failed to clear cache:', err);
      setError('Failed to clear cache');
      throw err;
    }
  };

  const value: OfflineContextType = {
    isOnline,
    isOfflineMode,
    toggleOfflineMode,
    syncStatus,
    performSync,
    fields,
    loading,
    error,
    refreshFields,
    createField,
    updateField,
    deleteField,
    saveSensorReading,
    settings,
    updateSettings,
    storageInfo,
    clearCache,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}

// Convenience hooks for specific functionality
export function useFields() {
  const { fields, loading, error, refreshFields, createField, updateField, deleteField } = useOffline();
  return { fields, loading, error, refreshFields, createField, updateField, deleteField };
}

export function useSyncStatus() {
  const { syncStatus, performSync, isOnline } = useOffline();
  return { syncStatus, performSync, isOnline };
}

export function useOfflineMode() {
  const { isOfflineMode, toggleOfflineMode, isOnline } = useOffline();
  return { isOfflineMode, toggleOfflineMode, isOnline };
}

export function useSensorData() {
  const { saveSensorReading } = useOffline();
  return { saveSensorReading };
}
