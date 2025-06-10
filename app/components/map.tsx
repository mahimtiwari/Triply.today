'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap, MapOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

async function geocodePlace(name: string): Promise<[number, number] | null> {
  try {
    console.log(`Geocoding place: ${name}`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      console.log(`Geocoded ${name} to coordinates:`, data[0].lat, data[0].lon);
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}


interface MapProps {
  placesNames: string[];
  onClick: (name: string) => void;
  controls?: boolean;
}

const Map: React.FC<MapProps> = ({ placesNames, onClick, controls=true }) => {
  
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const gji56jc7 = "3b9GgU5VpXSJd2RNtN0t";
  
// console.log("Map component initialized with places:", placesNames);

  useEffect(() => {
    if (!mapContainerRef.current) return;

const mapOptions: MapOptions = {
  container: mapContainerRef.current,
  style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${gji56jc7}`,
  center: [-122.4194, 37.7749],
  zoom: 2,
  pitchWithRotate: false,
  dragRotate: false,
};
    const mapInstance = new maplibregl.Map(mapOptions);
    mapRef.current = mapInstance;

    // Add GlobeControl
    if (controls) {
    mapInstance.addControl(new maplibregl.GlobeControl(), 'top-right');
    mapInstance.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: false,
      })
    );
  }

    // projection of the map on globe
    mapInstance.on('style.load', () => {
      mapInstance.setProjection({
        type: 'globe',
      });
    });

    const handleResize = () => mapInstance.resize();
    window.addEventListener('resize', handleResize);

    async function setupPlaces() {
      const places: { coords: [number, number]; label: string }[] = [];

      // Wait for the map's style to load
      await new Promise<void>((resolve) => {
        if (mapInstance.isStyleLoaded()) {
          resolve();
        } else {
          mapInstance.once('style.load', resolve);
        }
      });

      for (const name of placesNames) {
        const coords = await geocodePlace(name);
        if (coords) {
          places.push({ coords, label: name });
        } else {
          console.warn(`Could not geocode place: ${name}`);
        }
      }

      if (places.length === 0) {
        console.warn('No valid places to display');
        return;
      }

      // Center map on first valid place
      mapInstance.setCenter(places[0].coords);

      // Add GeoJSON source
      mapInstance.addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: places.map((place) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: place.coords },
            properties: { label: place.label },
          })),
        },
      });

      // Add circles layer
      mapInstance.addLayer({
        id: 'place-circles',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': 12,
          'circle-color': '#f7bc00',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-blur': 0.4,
          'circle-opacity': 0.85,
        },
      });

      // Handle click on a place
      mapInstance.on('click', 'place-circles', (e) => {
        const feature = e.features?.[0];
        if (feature) {
          const label = feature.properties?.label as string;
          onClick(label);
        }
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', 'place-circles', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      mapInstance.on('mouseleave', 'place-circles', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    }

    setupPlaces();

    return () => {
      window.removeEventListener('resize', handleResize);
      mapInstance.remove();
    };
  }, [placesNames, onClick]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full max-h-[100vh]"
      style={{
        background: 'radial-gradient(circle, rgb(255, 255, 255) 0%, rgb(179 217 255) 100%)',
      }}
    />
  );
};

export default Map;
