
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import type { Feature, Polygon } from '@turf/turf';

export type ColorRule = {
  id: string;
  condition: 'gt' | 'lt' | 'eq';
  value: number;
  color: string;
};

export type PolygonState = {
  id: string;
  geojson: Feature<Polygon>;
  dataSource: string;
  rules: ColorRule[];
  rawHourlyData: number[] | null;
  currentAverage: number | null;
  color: string;
};

interface PolygonStateStore {
  polygons: Record<string, PolygonState>;
  activePolygonId: string | null;
  addPolygon: (polygon: PolygonState) => void;
  removePolygon: (id: string) => void;
  updatePolygonData: (id: string, data: Partial<Pick<PolygonState, 'rawHourlyData' | 'currentAverage' | 'color'>>) => void;
  setActivePolygonId: (id: string | null) => void;
  updatePolygonRules: (id: string, rules: ColorRule[]) => void;
  updatePolygonColor: (id: string, color: string) => void;
  updatePolygonDataSource: (id: string, dataSource: string) => void;
}

export const usePolygonStore = create<PolygonStateStore>()(
  persist(
    (set) => ({
      polygons: {},
      activePolygonId: null,
      addPolygon: (polygon) =>
        set(
          produce((state: PolygonStateStore) => {
            state.polygons[polygon.id] = polygon;
          })
        ),
      removePolygon: (id) =>
        set(
          produce((state: PolygonStateStore) => {
            delete state.polygons[id];
            if (state.activePolygonId === id) {
              state.activePolygonId = null;
            }
          })
        ),
      updatePolygonData: (id, data) =>
        set(
          produce((state: PolygonStateStore) => {
            if (state.polygons[id]) {
              Object.assign(state.polygons[id], data);
            }
          })
        ),
      setActivePolygonId: (id) => set({ activePolygonId: id }),
      updatePolygonRules: (id, rules) =>
        set(
          produce((state: PolygonStateStore) => {
            if (state.polygons[id]) {
              state.polygons[id].rules = rules;
            }
          })
        ),
      updatePolygonColor: (id, color) =>
        set(
          produce((state: PolygonStateStore) => {
            if (state.polygons[id]) {
              state.polygons[id].color = color;
            }
          })
        ),
      updatePolygonDataSource: (id, dataSource) =>
        set(
          produce((state: PolygonStateStore) => {
            if (state.polygons[id]) {
              state.polygons[id].dataSource = dataSource;
            }
          })
        ),
    }),
    {
      name: 'meteo-mapper-polygon-storage-v2', // Changed name to avoid conflicts with old structure
      storage: createJSONStorage(() => localStorage),
       onRehydrateStorage: (state) => {
        console.log("Hydration starts");
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
          }
        };
      },
    }
  )
);
