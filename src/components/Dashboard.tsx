
'use client';

import { useEffect, useState } from 'react';
import { usePolygonStore } from '@/store/usePolygonStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { fetchWeatherData } from '@/utils/apiUtils';
import { getColorFromRules } from '@/utils/colorUtils';
import { updateDataAverages } from '@/ai/flows/intelligent-data-refresh'; //implemented gemini ai to intelligently manage data updates
import { subDays, addDays, startOfDay, addHours, addWeeks } from 'date-fns';
import { centroid } from '@turf/turf';

import InteractiveMap from './InteractiveMap';
import TimelineSlider from './TimelineSlider';
import Sidebar from './Sidebar';
import { getStep } from '@/utils/dateUtils';

export default function Dashboard() {
  const { polygons, updatePolygonData, updatePolygonColor } = usePolygonStore();
  const { timelineRange, timelineMode, timeUnit } = useTimelineStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchAndUpdateData = async (polygonState: ReturnType<typeof usePolygonStore.getState>['polygons'][string]) => {
      const center = centroid(polygonState.geojson);
      const [longitude, latitude] = center.geometry.coordinates;

      const stepHours = getStep(timeUnit);
      const startOffset = timelineRange[0] * stepHours;
      const endOffset = (timelineMode === 'point' ? timelineRange[0] : timelineRange[1]) * stepHours;

      const apiBaseDate = subDays(startOfDay(new Date()), 15);
      
      const apiStartDate = addHours(apiBaseDate, startOffset);
      let apiEndDate = addHours(apiBaseDate, endOffset + (stepHours > 1 ? stepHours -1 : 0));

      if (apiEndDate > new Date()) {
        apiEndDate = new Date();
      }
       if (apiStartDate > new Date()) {
         
        updatePolygonData(polygonState.id, {
          rawHourlyData: [],
          currentAverage: null,
          color: '#808080'
        });
        return;
      }


      const newData = await fetchWeatherData(latitude, longitude, apiStartDate, apiEndDate, polygonState.dataSource);
      
      const filteredNewData = newData.filter((value): value is number => value !== null && !isNaN(value));

      if (filteredNewData.length === 0) {
        updatePolygonData(polygonState.id, {
          rawHourlyData: [],
          currentAverage: null,
          color: '#808080'
        });
        return;
      }
      
      const handleDataUpdate = (data: number[]) => {
        if (data.length === 0) {
           updatePolygonData(polygonState.id, { rawHourlyData: [], currentAverage: null, color: '#808080' });
           return;
        }
        const average = data.reduce((a, b) => a + b, 0) / data.length;
        const newColor = getColorFromRules(average, polygonState.rules);
        
        updatePolygonData(polygonState.id, {
          rawHourlyData: data,
          currentAverage: average,
          color: newColor,
        });
      };
      
      try {
        const aiResponse = await updateDataAverages({
          polygonId: polygonState.id,
          currentData: polygonState.rawHourlyData || [],
          newData: filteredNewData,
          threshold: 1.0, // Significance threshold of 1 degree change
        });
  
        if (aiResponse.significantChanges) {
          handleDataUpdate(aiResponse.updatedData);
        } else {
           const currentAverage = polygonState.currentAverage;
           if(currentAverage === null) {
              handleDataUpdate(filteredNewData);
              return;
           }
           const newColor = getColorFromRules(currentAverage, polygonState.rules);
           if(polygonState.color !== newColor) {
              updatePolygonColor(polygonState.id, newColor);
           }
        }
      } catch (error) {
        console.error("AI service failed, using fallback:", error);
        handleDataUpdate(filteredNewData);
      }
    };

    Object.values(polygons).forEach(fetchAndUpdateData);
  }, [isMounted, polygons, timelineRange, timelineMode, timeUnit, updatePolygonData, updatePolygonColor]);
  
  return (
    <div className="relative h-screen w-screen flex flex-col bg-background">
      <header className="flex-shrink-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20V4H8V20H4ZM10 20V12H14V20H10ZM16 20V8H20V20H16Z" fill="hsl(var(--primary))"/>
          </svg>
          <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        </div>
      </header>
      <div className="flex-shrink-0">
        <TimelineSlider />
      </div>
      <main className="flex-grow relative">
        <InteractiveMap />
        <Sidebar />
      </main>
    </div>
  );
}
