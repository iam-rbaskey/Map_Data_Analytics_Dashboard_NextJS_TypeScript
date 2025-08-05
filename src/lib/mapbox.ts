
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { PolygonState } from '@/store/usePolygonStore';
import type { RefObject } from 'react';
import { centroid } from '@turf/turf';

type DrawEvent = { features: (mapboxgl.MapboxGeoJSONFeature & { id: string })[] };
type ClickEvent = mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] };

interface MapInitializationOptions {
  onDrawCreate: (e: DrawEvent) => void;
  onDrawDelete: (e: DrawEvent) => void;
  onClick: (e: ClickEvent, map: mapboxgl.Map) => void;
}

export function initializeMap(
  mapContainer: RefObject<HTMLDivElement>,
  token: string,
  options: MapInitializationOptions
): Promise<{ mapInstance: mapboxgl.Map; drawInstance: MapboxDraw }> {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('Mapbox token is not configured.'));
    }
    mapboxgl.accessToken = token;

    if (!mapContainer.current) {
        return reject(new Error('Map container is not available.'));
    }

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [88.3639, 22.5726], // Kolkata
      zoom: 15,
      dragPan: true,
      scrollZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
    });

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      userProperties: true,
    });
    mapInstance.addControl(drawInstance, 'top-left');

    mapInstance.on('load', () => {
        mapInstance.on('draw.create', options.onDrawCreate);
        mapInstance.on('draw.delete', options.onDrawDelete);
        mapInstance.on('click', (e) => options.onClick(e, mapInstance));
        
        mapInstance.on('style.load', () => {
          // No need to resolve here, already handled by 'load' event.
        });
        
        resolve({ mapInstance, drawInstance });
    });
    
    mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e.error);
        reject(e.error);
    });
  });
}

export function updateMapPolygons(
  mapInstance: mapboxgl.Map,
  polygons: Record<string, PolygonState>,
  activePolygonId: string | null
) {
  if (!mapInstance.isStyleLoaded()) {
    return;
  }
    
  const renderedPolygonIds = Object.keys(polygons);

  Object.values(polygons).forEach((p: PolygonState) => {
    const fillSourceId = `${p.id}-fill-source`;
    const fillLayerId = `${p.id}-fill-layer`;
    const labelSourceId = `${p.id}-label-source`;
    const labelLayerId = `${p.id}-label-layer`;
    
    const center = centroid(p.geojson);

    // Update or add fill layer
    const fillSource = mapInstance.getSource(fillSourceId) as mapboxgl.GeoJSONSource;
    if (fillSource) {
      fillSource.setData(p.geojson);
      mapInstance.setPaintProperty(fillLayerId, 'fill-color', p.color);
      mapInstance.setPaintProperty(fillLayerId, 'fill-outline-color', activePolygonId === p.id ? '#FF9800' : '#FFFFFF');
    } else {
      mapInstance.addSource(fillSourceId, { type: 'geojson', data: p.geojson });
      mapInstance.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: fillSourceId,
        paint: {
          'fill-color': p.color,
          'fill-opacity': 0.6,
          'fill-outline-color': activePolygonId === p.id ? '#FF9800' : '#FFFFFF',
        },
      });
    }

    // Update or add label layer
    const labelSource = mapInstance.getSource(labelSourceId) as mapboxgl.GeoJSONSource;
    if (labelSource) {
      labelSource.setData(center);
    } else {
      mapInstance.addSource(labelSourceId, { type: 'geojson', data: center });
      mapInstance.addLayer({
        id: labelLayerId,
        type: 'symbol',
        source: labelSourceId,
        layout: {
          'text-field': p.id.substring(0, 6),
          'text-size': 12,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        }
      });
    }
  });

  // Garbage collect old layers and sources
  const currentLayers = mapInstance.getStyle().layers;
  const layersToRemove = currentLayers.filter(layer => 
    (layer.id.endsWith('-fill-layer') || layer.id.endsWith('-label-layer')) && 
    !renderedPolygonIds.includes(layer.id.replace(/-fill-layer|-label-layer/g, ''))
  );

  layersToRemove.forEach(layer => {
    if (mapInstance.getLayer(layer.id)) {
      mapInstance.removeLayer(layer.id);
    }
    const sourceId = layer.id.replace(/-layer/g, '-source').replace('-fill','').replace('-label','');
     if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
    }
  });
}
