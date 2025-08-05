
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TimelineMode = 'point' | 'range';
type TimeUnit = 'hour' | 'day' | 'week';

interface TimelineState {
  timelineRange: [number, number];
  setTimelineRange: (range: [number, number]) => void;
  timelineMode: TimelineMode;
  setTimelineMode: (mode: TimelineMode) => void;
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  isPlaying: boolean;
  toggleIsPlaying: () => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      timelineRange: [0, 24],
      setTimelineRange: (range) => set({ timelineRange: range }),
      timelineMode: 'range',
      setTimelineMode: (mode) => set({ timelineMode: mode, isPlaying: false }),
      timeUnit: 'hour',
      setTimeUnit: (unit) => set({ timeUnit: unit, isPlaying: false }),
      isPlaying: false,
      toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
    }),
    {
      name: 'meteo-mapper-timeline-storage-v3', // Changed name to avoid conflicts
      storage: createJSONStorage(() => localStorage),
    }
  )
);
