
'use client';

import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useTimelineStore } from '@/store/useTimelineStore';
import { formatLabel, getStep, getTotalSteps, formatRangeLabel } from '@/utils/dateUtils';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Calendar, Play, Pause, Rewind, FastForward } from 'lucide-react';
import { Badge } from './ui/badge';
import { differenceInWeeks, differenceInDays } from 'date-fns';

export default function TimelineSlider() {
  const { 
    timelineRange, 
    setTimelineRange, 
    timelineMode, 
    setTimelineMode,
    timeUnit,
    setTimeUnit,
    isPlaying,
    toggleIsPlaying,
    setIsPlaying,
  } = useTimelineStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const TOTAL_STEPS = getTotalSteps(timeUnit);
  const STEP = getStep(timeUnit);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineRange([
          (timelineRange[0] + 1) % TOTAL_STEPS,
          (timelineRange[1] + 1) % TOTAL_STEPS,
        ]);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timelineRange, setTimelineRange, TOTAL_STEPS]);

  const handleSliderChange = (newRange: number[]) => {
    setIsPlaying(false);
    if (timelineMode === 'point') {
        setTimelineRange([newRange[0], newRange[0]]);
    } else {
        setTimelineRange(newRange as [number, number]);
    }
  }

  const handleTimeUnitChange = (unit: 'hour' | 'day' | 'week') => {
    setTimeUnit(unit);
    const newTotalSteps = getTotalSteps(unit);
    // Reset range to avoid out-of-bounds errors
    setTimelineRange([0, Math.min(timelineRange[1], newTotalSteps - 1)]);
  }

  const handlePlayback = (direction: 'forward' | 'backward') => {
    const change = direction === 'forward' ? 1 : -1;
    const newStart = (timelineRange[0] + change + TOTAL_STEPS) % TOTAL_STEPS;
    const newEnd = (timelineRange[1] + change + TOTAL_STEPS) % TOTAL_STEPS;
    setTimelineRange([newStart, newEnd]);
  }

  const getRangeDuration = () => {
    const start = timelineRange[0] * STEP;
    const end = timelineRange[1] * STEP;
    const { startDate } = formatLabel(start, 'hour');
    const { startDate: endDate } = formatLabel(end, 'hour');

    switch (timeUnit) {
      case 'week':
        const weeks = differenceInWeeks(endDate, startDate, { roundingMethod: 'floor' });
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      case 'day':
        const days = differenceInDays(endDate, startDate);
        return `${days} day${days !== 1 ? 's' : ''}`;
      default:
        return `${end - start} hour${end - start !== 1 ? 's' : ''}`;
    }
  };


  const sliderValue = timelineMode === 'point' ? [timelineRange[0]] : timelineRange;

  if (!isMounted) {
    return (
        <div className="p-4 bg-background">
            <Card className="shadow-md bg-card">
                <CardContent className="pt-6">
                    <div className="h-24"></div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 bg-background">
      <Card className="shadow-md bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-5 w-5 text-primary"/>
              <span className="font-medium">Time Period</span>
              <span className="text-muted-foreground">{formatRangeLabel(timelineRange, timeUnit)}</span>
              {timelineMode === 'range' && <Badge variant="secondary">{getRangeDuration()}</Badge>}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => handlePlayback('backward')}><Rewind className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={toggleIsPlaying}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handlePlayback('forward')}><FastForward className="h-4 w-4" /></Button>
              <span className="text-sm text-muted-foreground">{isPlaying ? 'Playing' : 'Paused'}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="w-full sm:w-40">
              <Select value={timeUnit} onValueChange={handleTimeUnitChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Label htmlFor="timeline-mode" className="text-sm">Single Point</Label>
              <Switch
                id="timeline-mode"
                checked={timelineMode === 'range'}
                onCheckedChange={(checked) => setTimelineMode(checked ? 'range' : 'point')}
              />
              <Label htmlFor="timeline-mode" className="text-sm">Range</Label>
            </div>
          </div>
          
          <div className="relative mt-6" ref={sliderRef}>
            <div className="pt-4">
                <Slider
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={TOTAL_STEPS - 1}
                    step={1}
                    className="flex-grow"
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
              <span>{formatLabel(0, timeUnit).label}</span>
              <span>{formatLabel(Math.floor(TOTAL_STEPS / 2), timeUnit).label}</span>
              <span>{formatLabel(TOTAL_STEPS - 1, timeUnit).label}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
