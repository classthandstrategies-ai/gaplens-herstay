'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PlaceListing, EmploymentHub } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';

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
        background: #121518;
        color: #5eead4;
        border: 2.5px solid #ffffff;
        border-radius: 9999px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(18,21,24,0.4);
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

function createPropertyIcon(rating: number | null, isSelected: boolean) {
  let bgColor = '#78716c'; // Stone for unrated
  let text = '•';

  if (rating !== null) {
    text = rating.toFixed(1);
    if (rating >= 3.8) bgColor = '#0f766e'; // Deep Teal
    else if (rating >= 3.4) bgColor = '#b45309'; // Warm Amber
    else bgColor = '#be123c'; // Rose
  }

  const size = isSelected ? 34 : 28;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: #ffffff;
        border: ${borderWidth}px solid ${isSelected ? '#121518' : '#ffffff'};
        border-radius: 9999px;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: ${rating !== null ? '11px' : '14px'};
        font-weight: 700;
        box-shadow: 0 3px 10px rgba(0,0,0,0.28);
        transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        transition: transform 0.2s ease;
      ">
        ${text}
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

  const [isLegendExpanded, setIsLegendExpanded] = useState(false);

  const selectedCoord: [number, number] | undefined = useMemo(() => {
    if (!selectedProperty) return undefined;
    return [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng];
  }, [selectedProperty]);

  const hubIcon = useMemo(() => createHubIcon(), []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-2xs">
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
            color: '#0f766e',
            fillColor: '#0f766e',
            fillOpacity: 0.07,
            weight: 1.5,
            dashArray: '4, 6',
          }}
        />

        {/* Central Employment Hub Marker */}
        <Marker position={center} icon={hubIcon}>
          <Popup>
            <div className="p-1 max-w-xs font-sans">
              <span className="inline-block rounded bg-stone-900 px-2 py-0.5 font-mono text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                Primary Anchor
              </span>
              <h4 className="mt-1 font-serif font-bold text-stone-900 text-sm">{hub.name}</h4>
              <p className="text-xs text-stone-600 mt-0.5">{hub.landmark}</p>
              <div className="mt-2 font-mono text-[11px] text-stone-500">
                Perimeter: <strong>{radiusKm} km straight-line</strong>
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
                <div className="p-1 max-w-xs font-sans">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                      {listing.category || "Women's Stay"}
                    </span>
                    {listing.rating !== null ? (
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        ★ {listing.rating.toFixed(1)} ({listing.reviewCount})
                      </span>
                    ) : (
                      <span className="rounded bg-stone-100 px-1.5 py-0.2 font-mono text-[10px] font-medium text-stone-600">
                        Unrated
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 font-serif font-bold text-stone-900 text-sm leading-tight">
                    {listing.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-stone-600 line-clamp-2">
                    {listing.address}
                  </p>
                  <p className="mt-1.5 font-mono text-xs font-semibold text-teal-800">
                    {formatStraightLineDistance(listing.distanceKm)} straight-line
                  </p>

                  {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listing.dominantComplaints.map((c) => (
                        <span
                          key={c}
                          className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-rose-800 border border-rose-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onSelectProperty(listing)}
                    className="mt-3 block w-full rounded-xl bg-stone-900 py-1.5 text-center text-xs font-semibold text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Inspect Reviews & Evidence
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend overlay (Architectural floating card with mobile collapse) */}
      <div className="absolute bottom-6 left-2 sm:bottom-3 sm:left-3 z-[1000] max-w-[270px] rounded-xl bg-white/95 shadow-md backdrop-blur-xs border border-stone-200 text-xs transition-all">
        {/* Header toggle on mobile */}
        <button
          type="button"
          onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left sm:cursor-default"
          aria-expanded={isLegendExpanded}
          aria-label="Toggle map rating legend"
        >
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-stone-500" />
            <span className="font-mono text-[10px] font-bold text-stone-600 uppercase tracking-wider">
              Google Maps Rating Bands
            </span>
          </div>
          <span className="sm:hidden text-stone-400">
            {isLegendExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </span>
        </button>

        {/* Legend content: shown always on desktop (sm:block), toggleable on mobile */}
        <div className={`px-3 pb-3 pt-0.5 space-y-2 border-t border-stone-100 sm:border-0 ${isLegendExpanded ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-col gap-1.5 text-[11px] text-stone-700">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-900 ring-2 ring-teal-400 shrink-0" />
              <span className="font-medium truncate">{hub.name} (Anchor Hub)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-700 shrink-0" />
              <span>★ 3.8+ Public Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-600 shrink-0" />
              <span>★ 3.4 – 3.7 Public Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-700 shrink-0" />
              <span>★ &lt; 3.4 Public Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-500 shrink-0" />
              <span>Unrated on Google Maps</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-stone-100 text-[10px] text-stone-500 leading-tight">
            *Review complaints (hygiene, maintenance, security) are analyzed separately from star ratings and displayed in property cards and telemetry below.
          </div>
        </div>
      </div>
    </div>
  );
}
