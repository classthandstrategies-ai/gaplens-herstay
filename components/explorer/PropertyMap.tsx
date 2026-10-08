'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PlaceListing, EmploymentHub } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';

interface PropertyMapProps {
  hub: EmploymentHub;
  radiusKm: number;
  listings: PlaceListing[];
  selectedProperty: PlaceListing | null;
  onSelectProperty: (property: PlaceListing) => void;
}

// Controller to pan map when hub or selected property changes
function MapRecenter({
  center,
  selectedCoord,
}: {
  center: [number, number];
  selectedCoord?: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoord) {
      map.flyTo(selectedCoord, 15, { duration: 1 });
    } else {
      map.flyTo(center, 13.5, { duration: 1 });
    }
  }, [center, selectedCoord, map]);

  return null;
}

// Custom DivIcons for crisp SVG rendering without missing image assets
function createHubIcon() {
  return L.divIcon({
    className: 'custom-hub-marker',
    html: `
      <div style="
        background: #0f172a;
        color: #2dd4bf;
        border: 2.5px solid #ffffff;
        border-radius: 9999px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        font-weight: bold;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

function createPropertyIcon(rating: number, isSelected: boolean) {
  let bgColor = '#0d9488'; // Teal
  if (rating < 3.4) bgColor = '#e11d48'; // Rose
  else if (rating < 3.8) bgColor = '#d97706'; // Amber

  const size = isSelected ? 34 : 28;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: #ffffff;
        border: ${borderWidth}px solid ${isSelected ? '#0f172a' : '#ffffff'};
        border-radius: 9999px;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        transition: transform 0.2s ease;
      ">
        ${rating.toFixed(1)}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function PropertyMap({
  hub,
  radiusKm,
  listings,
  selectedProperty,
  onSelectProperty,
}: PropertyMapProps) {
  const center: [number, number] = useMemo(
    () => [hub.coordinates.lat, hub.coordinates.lng],
    [hub.coordinates.lat, hub.coordinates.lng]
  );

  const selectedCoord: [number, number] | undefined = useMemo(() => {
    if (!selectedProperty) return undefined;
    return [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng];
  }, [selectedProperty]);

  const hubIcon = useMemo(() => createHubIcon(), []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer
        center={center}
        zoom={13.5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapRecenter center={center} selectedCoord={selectedCoord} />

        {/* Crisp vector tile provider with OpenStreetMap attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Radius perimeter circle */}
        <Circle
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#0d9488',
            fillColor: '#0d9488',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 6',
          }}
        />

        {/* Central Employment Hub Marker */}
        <Marker position={center} icon={hubIcon}>
          <Popup>
            <div className="p-1 max-w-xs">
              <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                Primary Employment Anchor
              </span>
              <h4 className="mt-1 font-bold text-slate-900 text-sm">{hub.name}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{hub.landmark}</p>
              <div className="mt-2 text-[11px] text-slate-500">
                Analysis Perimeter: <strong>{radiusKm} km radius</strong>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Accommodation Listings Markers */}
        {listings.map((listing) => {
          const isSelected = selectedProperty?.id === listing.id;
          const icon = createPropertyIcon(listing.rating, isSelected);

          return (
            <Marker
              key={listing.id}
              position={[listing.coordinates.lat, listing.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectProperty(listing),
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium text-slate-500 uppercase">
                      {listing.category || "Women's Stay"}
                    </span>
                    <span className="flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
                      ★ {listing.rating.toFixed(1)} ({listing.reviewCount})
                    </span>
                  </div>
                  <h4 className="mt-1 font-semibold text-slate-900 text-sm leading-tight">
                    {listing.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">
                    {listing.address}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-teal-700">
                    {formatStraightLineDistance(listing.distanceKm)} to {hub.name}
                  </p>

                  {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listing.dominantComplaints.map((c) => (
                        <span
                          key={c}
                          className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onSelectProperty(listing)}
                    className="mt-3 block w-full rounded bg-slate-900 py-1.5 text-center text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Inspect Reviews & Evidence
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-white/95 p-2.5 shadow-md backdrop-blur-sm border border-slate-200 text-xs">
        <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <span>Map Legend</span>
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-900 ring-2 ring-teal-400" />
            <span>{hub.name} (Anchor)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-teal-600" />
            <span>Rating 3.8+ (Positive)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Rating 3.4 - 3.7 (Moderate Friction)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-600" />
            <span>Rating &lt; 3.4 (High Complaint Density)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
