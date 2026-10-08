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
        className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold ${
          listing.rating >= 3.8
            ? 'bg-teal-50 text-teal-800 border-teal-200'
            : listing.rating >= 3.4
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}
      >
        <Star className="h-3 w-3 fill-current" />
        <span>{listing.rating.toFixed(1)}</span>
      </div>
    ) : (
      <div className="flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
        <span>Unrated</span>
      </div>
    );

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
        isSelected
          ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-700">
              {listing.category || "Women's Stay"}
            </span>
            <span>•</span>
            <span className="text-teal-700 font-medium">
              {formatStraightLineDistance(listing.distanceKm)}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-teal-700 text-sm sm:text-base leading-snug">
            {listing.title}
          </h3>
        </div>

        {/* Rating badge with null safety */}
        {ratingBadge}
      </div>

      {/* Address */}
      <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span className="line-clamp-2 leading-relaxed">{listing.address}</span>
      </div>

      {/* Pricing / Meta if available */}
      {listing.price && (
        <div className="mt-2 text-xs font-semibold text-slate-800">
          Est. Rent: <span className="font-normal text-slate-600">{listing.price}</span>
        </div>
      )}

      {/* Dominant Complaints Tags */}
      {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400">Review friction:</span>
          {listing.dominantComplaints.map((c) => (
            <span
              key={c}
              className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 capitalize border border-rose-100"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Action footer */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <span className="text-slate-500">
          {listing.reviewCount > 0
            ? `${listing.reviewCount} total review(s)`
            : 'No public reviews'}
        </span>

        <div className="flex items-center gap-2">
          {listing.link && (
            <a
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 p-1"
              title="Open Google Maps link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <span className="font-medium text-teal-700 group-hover:underline flex items-center gap-0.5">
            Inspect Evidence <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
