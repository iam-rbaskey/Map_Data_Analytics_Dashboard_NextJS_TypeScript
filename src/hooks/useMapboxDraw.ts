import { useContext } from 'react';
import { MapboxDrawContext } from '@/providers/MapboxDrawProvider';

export const useMapboxDraw = () => {
  const context = useContext(MapboxDrawContext);
  if (context === undefined) {
    throw new Error('useMapboxDraw must be used within a MapboxDrawProvider');
  }
  return context;
};
