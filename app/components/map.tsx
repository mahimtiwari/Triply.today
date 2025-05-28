'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap, MapOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Geocode place name to coordinates via Nominatim
async function geocodePlace(name: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

// Props type
interface MapProps {
  placesNames: string[];
  onClick: (name: string) => void;
}

const Map: React.FC<MapProps> = ({ placesNames, onClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapOptions: MapOptions = {
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [-122.4194, 37.7749], // fallback
      zoom: 5,
      // renderWorldCopies: false,
      pitchWithRotate: false,
      dragRotate: false,
    };

    const mapInstance = new maplibregl.Map(mapOptions);
    mapRef.current = mapInstance;

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
          'circle-color': '#1976d2',
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mapInstance.remove();
    };
  }, [placesNames, onClick]);

  return (
    <div ref={mapContainerRef} className="w-full h-full max-h-[100vh]" />
  );
};

export default Map;
