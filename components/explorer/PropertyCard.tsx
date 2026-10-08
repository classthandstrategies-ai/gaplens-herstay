'use client';

import React from 'react';
import { PlaceListing } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { Star, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  listing: PlaceListing;
  isSelected: boolean;
  onSelect: () => void;
}

export function PropertyCard({
  listing,
  isSelected,
  onSelect,
}: PropertyCardProps) {
  const ratingBadge =
    listing.rating !== null ? (
      <div
        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold font-mono ${
          listing.rating >= 3.8
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/60'
            : listing.rating >= 3.4
            ? 'bg-amber-50 text-amber-800 border border-amber-300/60'
            : 'bg-rose-50 text-rose-800 border border-rose-300/60'
        }`}
      >
        <Star className="h-3 w-3 fill-current" />
        <span>{listing.rating.toFixed(1)}</span>
      </div>
    ) : (
      <div className="flex items-center rounded-md border border-[#D5D1C5] bg-[#F6F5F0] px-2 py-0.5 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
        <span>Unrated</span>
      </div>
    );

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-150 ${
        isSelected
          ? 'border-[#121518] bg-white ring-2 ring-[#0C4A44]/20 shadow-sm'
          : 'border-[#E8E6DF] bg-white hover:border-[#B5B0A3] hover:shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <span className="font-semibold text-[#374151]">
              {listing.category || "Women's Stay"}
            </span>
            <span>•</span>
            <span className="font-mono font-bold text-[#0C4A44]">
              {formatStraightLineDistance(listing.distanceKm)}
            </span>
          </div>
          <h4 className="mt-1 font-bold text-[#121518] group-hover:text-[#0C4A44] text-sm leading-snug line-clamp-1 transition-colors">
            {listing.title}
          </h4>
        </div>

        {/* Rating badge */}
        {ratingBadge}
      </div>

      {/* Address */}
      <div className="mt-2 flex items-start gap-1.5 text-xs text-[#6B7280]">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF] mt-0.5" />
        <span className="line-clamp-1 text-[11px] leading-relaxed">{listing.address}</span>
      </div>

      {/* Pricing if available */}
      {listing.price && (
        <div className="mt-1.5 text-[11px] font-semibold text-[#1F2937]">
          Public Rent: <span className="font-mono text-[#0C4A44]">{listing.price}</span>
        </div>
      )}

      {/* Dominant Complaints Tags */}
      {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1 pt-2 border-t border-[#F0EEE6]">
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Friction:</span>
          {listing.dominantComplaints.map((c) => (
            <span
              key={c}
              className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800 capitalize border border-rose-200/60"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Action footer */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-[#F0EEE6] text-[#6B7280]">
        <span className="font-mono">
          {listing.reviewCount > 0
            ? `${listing.reviewCount} public review(s)`
            : 'No public reviews'}
        </span>

        <div className="flex items-center gap-2">
          {listing.link && (
            <a
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[#6B7280] hover:text-[#121518] p-0.5 transition-colors"
              title="Open Google Maps listing"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <span className="font-semibold text-[#0C4A44] group-hover:underline flex items-center gap-0.5">
            Inspect <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
