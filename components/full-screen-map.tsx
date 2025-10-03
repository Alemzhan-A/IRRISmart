"use client";

import { useRef, useCallback, useEffect } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Map, { MapRef, NavigationControl, GeolocateControl, Source, Layer, Marker, Popup } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Button } from "@/components/ui/button";
import { Plus, Layers as LayersIcon, X, ExternalLink } from "lucide-react";
import { useZoneStore } from "@/lib/stores/zone-store";
import { useModalStore } from "@/lib/stores/modal-store";
import { CREATE_ZONE_MODAL_KEY, CreateZoneModal } from "@/components/zones/create-zone-modal";
import type { Feature, Polygon } from "geojson";
import * as turf from "@turf/turf";
import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example";

export function FullScreenMap() {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [isDrawReady, setIsDrawReady] = React.useState(false);
  const [hoveredZone, setHoveredZone] = React.useState<string | null>(null);
  const [popupInfo, setPopupInfo] = React.useState<{ zone: typeof zones[0]; lat: number; lng: number } | null>(null);
  
  const { zones, selectedZone, isDrawingMode, setSelectedZone, deleteZone, setDrawingMode } = useZoneStore();
  const { openModal } = useModalStore();
  
  const viewState = {
    longitude: 51.5074,
    latitude: 25.2048,
    zoom: 15,
  };

  const handleZoneCreate = useCallback((feature: Feature<Polygon>) => {
    console.log("handleZoneCreate called with feature:", feature);
    const coordinates = feature.geometry.coordinates[0];

    // Calculate area using Turf.js
    const polygon = turf.polygon([coordinates]);
    const areaInHectares = turf.area(polygon) / 10000;

    console.log("Area:", areaInHectares, "hectares");

    // Check minimum area (0.1 hectare)
    if (areaInHectares < 0.1) {
      console.log("Area too small, deleting polygon");
      if (drawRef.current) {
        drawRef.current.delete(feature.id as string);
      }
      alert("Zone is too small. Minimum area is 0.1 hectares (1000 m²)");
      return;
    }

    // Open modal with coordinates
    console.log("Opening modal with coordinates:", coordinates);
    openModal(CREATE_ZONE_MODAL_KEY, coordinates);
    setDrawingMode(false);

    // Clear the drawn polygon
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
  }, [openModal, setDrawingMode]);

  const onMapLoad = useCallback(() => {
    console.log("🗺️ Map onLoad callback fired");
    
    if (!mapRef.current) {
      console.error("❌ Map ref is null in onLoad");
      return;
    }
    
    if (drawRef.current) {
      console.log("Draw already initialized, skipping");
      return;
    }

    try {
      console.log("Starting Mapbox Draw initialization");
      const map = mapRef.current.getMap();
      
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        defaultMode: "simple_select",
        styles: [
          {
            id: "gl-draw-polygon-fill",
            type: "fill",
            filter: ["all", ["==", "$type", "Polygon"]],
            paint: {
              "fill-color": "#22c55e",
              "fill-opacity": 0.2,
            },
          },
          {
            id: "gl-draw-polygon-stroke-active",
            type: "line",
            filter: ["all", ["==", "$type", "Polygon"]],
            paint: {
              "line-color": "#22c55e",
              "line-width": 3,
            },
          },
          {
            id: "gl-draw-polygon-and-line-vertex-active",
            type: "circle",
            filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
            paint: {
              "circle-radius": 6,
              "circle-color": "#ffffff",
              "circle-stroke-color": "#22c55e",
              "circle-stroke-width": 2,
            },
          },
        ],
      });

      console.log("Adding draw control to map");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.addControl(draw as any);
      drawRef.current = draw;
      setIsDrawReady(true);
      console.log("✅ Mapbox Draw initialized and ready!");

      // Handle draw events
      map.on("draw.create", (e: { features: Feature<Polygon>[] }) => {
        console.log("Draw create event fired", e);
        const feature = e.features[0];
        handleZoneCreate(feature);
      });
    } catch (error) {
      console.error("❌ Error initializing Mapbox Draw:", error);
      alert("Failed to initialize map drawing. Please refresh the page.");
    }
  }, [handleZoneCreate]);

  const handleAddZone = () => {
    console.log("Add zone clicked, current drawing mode:", isDrawingMode);
    console.log("Draw ref exists:", !!drawRef.current);
    console.log("Draw ready:", isDrawReady);
    
    if (!isDrawReady || !drawRef.current) {
      alert("Map is still loading. Please wait a moment and try again.");
      return;
    }
    
    setDrawingMode(true);
  };
  
  // Handle drawing mode changes
  useEffect(() => {
    if (!drawRef.current || !mapRef.current) {
      console.log("Cannot change mode - draw ref:", !!drawRef.current, "map ref:", !!mapRef.current);
      return;
    }
    
    console.log("Drawing mode changed to:", isDrawingMode);
    
    try {
      if (isDrawingMode) {
        console.log("Changing to draw_polygon mode");
        drawRef.current.changeMode("draw_polygon");
        mapRef.current.getMap().getCanvas().style.cursor = "crosshair";
        console.log("Mode changed successfully");
      } else {
        console.log("Changing to simple_select mode");
        drawRef.current.changeMode("simple_select");
        drawRef.current.deleteAll();
        mapRef.current.getMap().getCanvas().style.cursor = "";
      }
    } catch (error) {
      console.error("Error changing draw mode:", error);
    }
  }, [isDrawingMode]);
  
  // Display selected zone
  useEffect(() => {
    if (!drawRef.current || !selectedZone) return;
    
    drawRef.current.deleteAll();
    drawRef.current.add({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [selectedZone.coordinates],
      },
    });
  }, [selectedZone]);

  return (
    <>
      <CreateZoneModal />
      <div className="relative h-screen w-full">
        {/* Floating Controls */}
        <div className="absolute top-4 left-4 lg:left-6 z-10 flex flex-col gap-3">
          <Button 
            onClick={handleAddZone}
            disabled={!isDrawReady}
            className={cn(
              "shadow-lg transition-all",
              !isDrawReady && "opacity-50 cursor-not-allowed",
              isDrawingMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            {!isDrawReady ? "Loading..." : isDrawingMode ? "Drawing..." : "Add Zone"}
          </Button>

          {isDrawingMode && (
            <Button 
              onClick={() => setDrawingMode(false)}
              variant="destructive"
              className="shadow-lg"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {/* Zone List */}
          <div className="absolute top-4 right-4 lg:right-6 z-10 w-80 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LayersIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Fields ({zones.length})</h3>
            </div>
          </div>
          
          <div className="space-y-2">
            {zones.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No zones created yet
              </p>
            ) : (
              zones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                    selectedZone?.id === zone.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{zone.name}</h4>
                        <p className="text-xs text-gray-500">{zone.crop}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {zone.area.toFixed(2)} ha
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/field/${zone.id}`);
                        }}
                        title="View details"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete ${zone.name}?`)) {
                            deleteZone(zone.id);
                          }
                        }}
                        title="Delete zone"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <Map
          ref={mapRef}
          onLoad={onMapLoad}
          initialViewState={viewState}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
          interactiveLayerIds={zones.map((z) => `zone-fill-${z.id}`)}
          onClick={(e) => {
            const features = e.features;
            if (features && features.length > 0 && features[0].layer) {
              const zoneId = features[0].layer.id.replace("zone-fill-", "");
              const zone = zones.find((z) => z.id === zoneId);
              if (zone) {
                setPopupInfo({
                  zone,
                  lat: e.lngLat.lat,
                  lng: e.lngLat.lng,
                });
              }
            }
          }}
          onMouseMove={(e) => {
            const features = e.features;
            if (features && features.length > 0) {
              e.target.getCanvas().style.cursor = "pointer";
            } else {
              e.target.getCanvas().style.cursor = isDrawingMode ? "crosshair" : "";
            }
          }}
        >
          {/* Render zones as polygons */}
          {zones.map((zone) => {
            const geojson: GeoJSON.Feature<GeoJSON.Polygon> = {
              type: "Feature",
              properties: { id: zone.id, name: zone.name },
              geometry: {
                type: "Polygon",
                coordinates: [zone.coordinates],
              },
            };

            const fillLayer: LayerProps = {
              id: `zone-fill-${zone.id}`,
              type: "fill",
              paint: {
                "fill-color": zone.color,
                "fill-opacity": isDrawingMode 
                  ? 0.15 
                  : selectedZone?.id === zone.id || hoveredZone === zone.id ? 0.4 : 0.2,
              },
            };

            const lineLayer: LayerProps = {
              id: `zone-line-${zone.id}`,
              type: "line",
              paint: {
                "line-color": zone.color,
                "line-width": isDrawingMode 
                  ? 1.5 
                  : selectedZone?.id === zone.id || hoveredZone === zone.id ? 3 : 2,
              },
            };

            // Calculate centroid for label
            const polygon = turf.polygon([zone.coordinates]);
            const centroid = turf.centroid(polygon);

            return (
              <React.Fragment key={zone.id}>
                <Source id={`zone-${zone.id}`} type="geojson" data={geojson}>
                  <Layer {...fillLayer} />
                  <Layer {...lineLayer} />
                </Source>
                {/* Zone label */}
                <Marker
                  longitude={centroid.geometry.coordinates[0]}
                  latitude={centroid.geometry.coordinates[1]}
                >
                  <div 
                    className={cn(
                      "group relative cursor-pointer transition-all duration-300 transform",
                      isDrawingMode && "opacity-60 scale-90",
                      !isDrawingMode && (selectedZone?.id === zone.id || hoveredZone === zone.id 
                        ? "scale-110" 
                        : "hover:scale-105")
                    )}
                    onClick={() => {
                      if (!isDrawingMode) {
                        setPopupInfo({
                          zone,
                          lat: centroid.geometry.coordinates[1],
                          lng: centroid.geometry.coordinates[0],
                        });
                      }
                    }}
                  >
                    {/* Label container with glassmorphism */}
                    <div 
                      className={cn(
                        "relative bg-white/95 backdrop-blur-md rounded-lg shadow-lg border-2 transition-all duration-300",
                        isDrawingMode && "shadow-md",
                        !isDrawingMode && (selectedZone?.id === zone.id || hoveredZone === zone.id
                          ? "shadow-xl bg-white"
                          : "hover:shadow-xl hover:bg-white")
                      )}
                      style={{ borderColor: zone.color }}
                    >
                      {/* Colored accent bar */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-md"
                        style={{ backgroundColor: zone.color }}
                      />
                      
                      {/* Content */}
                      <div className="px-3 py-2 pt-3">
                        <div className="flex items-center gap-2">
                          {/* Color indicator dot */}
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0 shadow-md"
                            style={{ backgroundColor: zone.color }}
                          />
                          
                          {/* Zone name */}
                          <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                            {zone.name}
                          </span>
                        </div>
                        
                        {/* Additional info on hover/select */}
                        <div 
                          className={cn(
                            "transition-all duration-300 overflow-hidden",
                            selectedZone?.id === zone.id || hoveredZone === zone.id
                              ? "max-h-20 opacity-100 mt-1"
                              : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="text-[10px] text-gray-600 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">🌾</span>
                              <span>{zone.crop}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">📏</span>
                              <span>{zone.area.toFixed(2)} ha</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pulse animation for selected */}
                      {selectedZone?.id === zone.id && (
                        <div 
                          className="absolute inset-0 rounded-lg animate-pulse"
                          style={{ 
                            boxShadow: `0 0 0 3px ${zone.color}20`
                          }}
                        />
                      )}
                    </div>

                    {/* Arrow pointer */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent"
                      style={{ borderTopColor: zone.color }}
                    />
                  </div>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Popup for zone details */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              className="custom-popup"
            >
              <div className="p-3 min-w-[220px]">
                {/* Header with color accent */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-md"
                    style={{ backgroundColor: popupInfo.zone.color }}
                  />
                  <h4 className="font-bold text-base text-gray-900">
                    {popupInfo.zone.name}
                  </h4>
                </div>

                {/* Details grid */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">🌾</span>
                    <div>
                      <p className="text-xs text-gray-500">Crop Type</p>
                      <p className="font-medium text-gray-900">{popupInfo.zone.crop}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">📏</span>
                    <div>
                      <p className="text-xs text-gray-500">Area</p>
                      <p className="font-medium text-gray-900">
                        {popupInfo.zone.area.toFixed(2)} hectares
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  size="sm"
                  className="w-full group"
                  style={{ backgroundColor: popupInfo.zone.color }}
                  onClick={() => router.push(`/field/${popupInfo.zone.id}`)}
                >
                  <span>View Field Details</span>
                  <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Popup>
          )}

          <NavigationControl position="bottom-left" />
          <GeolocateControl
            position="bottom-left"
            trackUserLocation
            showUserHeading
          />
        </Map>

        {/* Instructions */}
        {isDrawingMode ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600/95 backdrop-blur rounded-lg p-4 shadow-lg text-white z-10">
            <h4 className="font-semibold text-sm mb-2">🎯 Drawing Mode Active</h4>
            <ul className="text-xs space-y-1">
              <li>• Click on the map to add points</li>
              <li>• Double-click or press Enter to finish</li>
              <li>• Press Escape or click Cancel to abort</li>
            </ul>
          </div>
        ) : (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg z-10">
            <p className="text-sm text-gray-600">
              Click <strong>Add Zone</strong> to start drawing irrigation zones on the map
            </p>
          </div>
        )}
      </div>
    </>
  );
}

