import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Category } from '../services/places';

interface MapProps {
  lat: number;
  lon: number;
  displayName: string;
  places: Place[];
  highlightedCategory: Category | null;
  radius: number;
  onLocationSelect?: (lat: number, lon: number) => void;
}

const CATEGORY_COLORS: Record<Category, string> = {
  'Saúde': 'var(--chart-1)',
  'Educação': 'var(--chart-2)',
  'Lazer': 'var(--chart-3)',
  'Transporte': 'var(--chart-5)'
};

export default function Map({ lat, lon, displayName, places, highlightedCategory, radius, onLocationSelect }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const centerLayerRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Map (Run once)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    // Dark Matter Tile Layer (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    L.control.attribution({ position: 'bottomright' }).addTo(map);

    // Create layer groups
    centerLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;

    // Handle map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      centerLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // 2. Update View and Center Elements (Run when lat/lon/displayName changes)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const centerLayer = centerLayerRef.current;
    if (!map || !centerLayer) return;

    // Update View
    map.setView([lat, lon], 14);

    // Clear previous center elements
    centerLayer.clearLayers();

    // Custom Icon for center
    const customIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="background-color: var(--accent-color); width: 16px; height: 16px; border-radius: 50%; border: 3px solid #0a0c0f; box-shadow: 0 0 10px rgba(184, 240, 89, 0.4);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add Center Marker
    L.marker([lat, lon], { icon: customIcon, zIndexOffset: 1000 })
      .addTo(centerLayer)
      .bindPopup(`<div class="font-sans text-sm font-semibold text-gray-900">${displayName}</div>`);

    // Add Radius Circle
    L.circle([lat, lon], {
      color: '#b8f059',    // Accent color
      weight: 1,
      opacity: 0.3,
      fillColor: '#b8f059',
      fillOpacity: 0.05,
      radius: radius,
      interactive: false
    }).addTo(centerLayer);

    // Fit bounds to include the circle
    const circleBounds = L.latLng(lat, lon).toBounds(radius * 2.2); 
    map.fitBounds(circleBounds, { padding: [20, 20] });

  }, [lat, lon, displayName, radius]);

  // 3. Update Place Markers (Run when places or highlight changes)
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    places.forEach(place => {
      // If a category is highlighted, only show that category.
      // If no category is highlighted (null), show all.
      if (highlightedCategory && place.category !== highlightedCategory) return;

      const color = CATEGORY_COLORS[place.category];
      
      const placeIcon = L.divIcon({
        className: 'place-pin',
        html: `<div style="background-color: ${color}; width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 0 4px ${color};"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
      });

      L.marker([place.lat, place.lon], { icon: placeIcon })
        .addTo(markersLayer)
        .bindPopup(`
          <div class="font-sans text-xs">
            <strong class="block text-gray-900 mb-1">${place.name}</strong>
            <span class="text-gray-600 capitalize">${place.category} • ${place.type.replace('_', ' ')}</span>
          </div>
        `);
    });
  }, [places, highlightedCategory]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-xl z-0" />;
}
