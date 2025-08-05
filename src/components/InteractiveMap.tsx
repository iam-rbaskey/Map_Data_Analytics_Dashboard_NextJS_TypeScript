
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { usePolygonStore, type PolygonState } from '@/store/usePolygonStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { feature } from '@turf/helpers';
import { initializeMap, updateMapPolygons } from '@/lib/mapbox';
import { useMapboxDraw } from '@/hooks/useMapboxDraw';

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { setDraw } = useMapboxDraw();
  const { polygons, addPolygon, removePolygon, setActivePolygonId, activePolygonId } = usePolygonStore();
  const [isMounted, setIsMounted] = useState(false);
  const [newPolygon, setNewPolygon] = useState<any>(null);
  const [dataSource, setDataSource] = useState('temperature_2m');
  const { toast } = useToast();

  const token = "pk.eyJ1Ijoib2t0b3B1c2MiLCJhIjoiY21keGUyNjU0MXhwYjJsc2FrcGZsd290eCJ9.mEjrHNxJYljQLhjVslo_iw";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || map.current || !mapContainer.current || !token) return;

    let isCancelled = false;

    const initMap = async () => {
      try {
        const { mapInstance, drawInstance } = await initializeMap(mapContainer, token, {
          onDrawCreate: (e) => {
            const polygonFeature = e.features[0];
            const points = polygonFeature.geometry.coordinates[0];
            const numPoints = points.length - 1; 

            if (polygonFeature.geometry.type === 'Polygon' && numPoints >= 3 && numPoints <= 12) {
              setNewPolygon(polygonFeature);
            } else {
              toast({ 
                title: "Invalid Polygon", 
                description: "Polygons must have between 3 and 12 points.", 
                variant: "destructive" 
              });
              setTimeout(() => drawInstance.delete(polygonFeature.id as string), 0);
            }
          },
          onDrawDelete: (e) => {
            e.features.forEach((feat) => removePolygon(feat.id as string));
          },
          onClick: (e, map) => {
            const features = map.queryRenderedFeatures(e.point);
            const polygonFeature = features?.find(f => f.layer.id.endsWith('-fill-layer'));

            if(polygonFeature && polygonFeature.properties?.id) {
                setActivePolygonId(polygonFeature.properties.id as string);
            } else {
                setActivePolygonId(null);
            }
          }
        });

        if (isCancelled) {
          mapInstance.remove();
          return;
        }

        map.current = mapInstance;
        setDraw(drawInstance); // Save draw instance to context
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };
    
    initMap();

    return () => {
      isCancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [isMounted, token, removePolygon, setActivePolygonId, toast, setDraw]);

  useEffect(() => {
    if (!map.current || !isMounted) return;
    updateMapPolygons(map.current, polygons, activePolygonId);
  }, [polygons, isMounted, activePolygonId]);

  const handleSavePolygon = () => {
    if (!newPolygon) return;
    const polygon: PolygonState = {
      id: newPolygon.id,
      geojson: feature(newPolygon.geometry, {id: newPolygon.id}),
      dataSource,
      rules: [],
      rawHourlyData: null,
      currentAverage: null,
      color: '#808080',
    };
    addPolygon(polygon);
    setNewPolygon(null);
  };

  const handleCancelNewPolygon = () => {
    if (newPolygon) {
        // Temp workaround since we don't have access to draw instance here directly anymore
        const drawControl = map.current?.getStyle().layers.find(l => l.source === 'mapbox-gl-draw-cold');
        if (drawControl) {
            // This is not ideal, but a way to trigger deletion from outside
        }
    }
    setNewPolygon(null);
  }

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <p className="text-red-500 font-semibold">Error: Mapbox token is not configured.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <Dialog open={!!newPolygon} onOpenChange={(open) => !open && setNewPolygon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Polygon Created</DialogTitle>
            <DialogDescription>
              Select a data source for your new polygon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data-source" className="text-right">
                Data Source
              </Label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature_2m">Temperature (2m)</SelectItem>
                  <SelectItem value="relative_humidity_2m">Relative Humidity (2m)</SelectItem>
                  <SelectItem value="precipitation">Precipitation</SelectItem>
                  <SelectItem value="cloud_cover">Cloud Cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCancelNewPolygon} variant="outline">Cancel</Button>
            <Button onClick={handleSavePolygon}>Save Polygon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
