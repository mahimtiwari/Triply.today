'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://tiles.stadiamaps.com/styles/alidade_smooth.json';

export default function Map() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLE,
            center: [77.5946, 12.9716],
            zoom: 10,
        });

        mapRef.current = map;

        map.on('load', () => {
            // Add a custom color layer for water
            map.addLayer({
                id: 'custom-water',
                type: 'fill',
                source: 'openmaptiles',
                'source-layer': 'water',
                paint: {
                    'fill-color': '#85d7ff', // Light blue for water
                    'fill-opacity': 0.6,
                },
            });

            // Add a custom color layer for land
            map.addLayer({
                id: 'custom-land',
                type: 'fill',
                source: 'openmaptiles',
                'source-layer': 'land',
                paint: {
                    'fill-color': '#a7f3d0', // Light green for land
                    'fill-opacity': 0.4,
                },
            });
        });

        const handleResize = () => {
            if (map) {
                map.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            map.remove();
        };
    }, []);

    return (
            <div
                ref={mapContainerRef}
                className="w-full h-full max-h-[100vh]"
            />

    );
}
