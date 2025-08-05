'use client';
import dynamic from 'next/dynamic';

const DynamicTimelineSlider = dynamic(() => import('./TimelineSlider'), {
  ssr: false,
});

export default DynamicTimelineSlider;