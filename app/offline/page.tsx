/**
 * Offline Page
 * Shown when the user is offline and tries to access a page that's not cached
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  WifiOff, 
  RefreshCw, 
  ArrowLeft, 
  Home,
  HardDrive,
  Clock,
  AlertTriangle,
  MapPin
} from 'lucide-react';
// Update the import path below to the correct relative path if the file exists elsewhere.
// Example: import { useOffline, useSyncStatus, OfflineProvider } from '../../lib/contexts/offline-context';
import { useOffline, useSyncStatus, OfflineProvider } from '../../lib/contexts/offline-context';


function OfflinePageContent() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', crop: '', cropCategory: '', area: 1 });
  const [saving, setSaving] = useState(false);
  const { createField } = useOffline();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createField({
        name: form.name,
        crop: form.crop,
        cropCategory: form.cropCategory,
        area: Number(form.area),
        color: '#22c55e',
        coordinates: [],
        sensorData: { moisture: 0, temperature: 0, salinity: 0 },
        irrigation: {},
      });
      setShowModal(false);
      setForm({ name: '', crop: '', cropCategory: '', area: 1 });
    } finally {
      setSaving(false);
    }
  };
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const { syncStatus, performSync } = useSyncStatus();
  const { storageInfo } = useOffline();



  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Offline Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still access your cached data.
          </p>
        </div>

        {/* Add Field Card (Offline) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Add Field
            </CardTitle>
            <CardDescription>
              You can add a new field even while offline. It will sync when you are back online.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="default" onClick={() => setShowModal(true)}>
              Add Field
            </Button>
          </CardContent>
        </Card>

        {/* Add Field Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-lg font-bold mb-4">Add Field (Offline)</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleInput} required className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Crop</label>
                  <input name="crop" value={form.crop} onChange={handleInput} required className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Crop Category</label>
                  <input name="cropCategory" value={form.cropCategory} onChange={handleInput} required className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area (ha)</label>
                  <input name="area" type="number" min="0.01" step="0.01" value={form.area} onChange={handleInput} required className="w-full border rounded px-2 py-1" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Add Field'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Internet Connection</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            {!isOnline && (
              <p className="text-xs text-gray-500 mt-2">
                Check your internet connection and try again.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sync Status */}
        {syncStatus.pendingChanges > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {syncStatus.pendingChanges} changes waiting to sync
                </span>
                <Badge variant="secondary">
                  {syncStatus.pendingChanges}
                </Badge>
              </div>
              {isOnline && (
                <Button
                  onClick={performSync}
                  disabled={syncStatus.isSyncing}
                  className="w-full mt-3"
                  size="sm"
                >
                  {syncStatus.isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Offline Storage
            </CardTitle>
            <CardDescription>
              Data cached for offline access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Cache Size</div>
                <div className="font-medium">{formatStorageSize(storageInfo.size)}</div>
              </div>
              <div>
                <div className="text-gray-600">Fields</div>
                <div className="font-medium">{storageInfo.fields}</div>
              </div>
              <div>
                <div className="text-gray-600">Readings</div>
                <div className="font-medium">{storageInfo.readings}</div>
              </div>
              <div>
                <div className="text-gray-600">Pending</div>
                <div className="font-medium">{storageInfo.pending}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {syncStatus.syncError && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Sync Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">{syncStatus.syncError}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
            disabled={!isOnline}
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          {isOnline && (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            FieldSenseAI works offline. Your data is safely cached and will sync when you&apos;re back online.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OfflinePage() {
  return (
    <OfflineProvider>
      <OfflinePageContent />
    </OfflineProvider>
  );
}
