'use client';
import { createContext, useState, useCallback, type ReactNode } from 'react';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

interface MapboxDrawContextType {
  draw: MapboxDraw | null;
  setDraw: (draw: MapboxDraw | null) => void;
  removeDrawFeature: (id: string) => void;
}

export const MapboxDrawContext = createContext<MapboxDrawContextType | undefined>(undefined);

export function MapboxDrawProvider({ children }: { children: ReactNode }) {
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  
  const removeDrawFeature = useCallback((id: string) => {
    if (draw) {
      draw.delete(id);
    }
  }, [draw]);

  return (
    <MapboxDrawContext.Provider value={{ draw, setDraw, removeDrawFeature }}>
      {children}
    </MapboxDrawContext.Provider>
  );
}
