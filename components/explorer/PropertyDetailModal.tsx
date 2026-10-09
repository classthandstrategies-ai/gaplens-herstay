'use client';

import React from 'react';
import { PlaceListing, EmploymentHub } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import {
  X,
  Star,
  MapPin,
  ExternalLink,
  Phone,
  AlertTriangle,
  Info,
  Quote,
} from 'lucide-react';

interface PropertyDetailModalProps {
  listing: PlaceListing | null;
  hub: EmploymentHub;
  onClose: () => void;
  dataSource?: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample';
}

export function PropertyDetailModal({
  listing,
  hub,
  onClose,
  dataSource,
}: PropertyDetailModalProps) {
  if (!listing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-stone-900/10 border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-stone-200 bg-white/95 px-6 py-4.5 backdrop-blur-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-700 border border-stone-200">
                {listing.category || "Women's Accommodation"}
              </span>
              <span className="font-mono text-xs text-teal-800 font-medium">
                {formatStraightLineDistance(listing.distanceKm)} to {hub.name}
              </span>
            </div>
            <h2
              id="property-modal-title"
              className="mt-1 font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900"
            >
              {listing.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close inspector modal"
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="px-5 sm:px-6 py-5 space-y-6 pb-8">
          {/* Key metrics grid (Amplitude style tabular stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 sm:p-3.5">
              <span className="font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                {dataSource === 'illustrative_sample' ? 'Sample Rating' : 'Public Rating'}
              </span>
              {listing.rating !== null ? (
                <div className="mt-1 flex items-baseline gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500 self-center" />
                  <span className="font-serif text-xl font-bold text-stone-900">
                    {listing.rating.toFixed(1)}
                  </span>
                  <span className="font-mono text-xs text-stone-400">/ 5.0</span>
                </div>
              ) : (
                <div className="mt-1 font-mono text-xs font-semibold text-stone-500">
                  {dataSource === 'illustrative_sample' ? 'Unrated in Sample' : 'Unrated on Maps'}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 sm:p-3.5">
              <span className="font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                {dataSource === 'illustrative_sample' ? 'Sample Reviews' : 'Review Volume'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-serif text-xl font-bold text-stone-900">
                  {listing.reviewCount}
                </span>
                <span className="text-xs text-stone-500">{dataSource === 'illustrative_sample' ? 'sample' : 'public'}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 sm:p-3.5">
              <span className="font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                Proximity
              </span>
              <div className="mt-1 font-mono text-sm font-bold text-teal-800">
                {listing.distanceKm < 1 ? `${Math.round(listing.distanceKm * 1000)} m` : `${listing.distanceKm.toFixed(1)} km`}
              </div>
              <span className="text-[10px] text-stone-400">straight-line to hub</span>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 sm:p-3.5">
              <span className="font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                {dataSource === 'illustrative_sample' ? 'Demo Price Tier' : 'Public Price Tier'}
              </span>
              <div className="mt-1 text-[11px] sm:text-xs font-semibold text-stone-800 break-words leading-tight">
                {listing.price || 'Not publicly listed'}
              </div>
              <span className="text-[10px] text-stone-400">{dataSource === 'illustrative_sample' ? 'illustrative sample' : 'when available'}</span>
            </div>
          </div>

          {/* Location details */}
          <div className="rounded-2xl border border-stone-200 p-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-teal-50 p-2 text-teal-800 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Address & Access</h4>
                  <p className="mt-0.5 text-xs text-stone-600 leading-relaxed">{listing.address}</p>
                  {listing.phone && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-700">
                      <Phone className="h-3.5 w-3.5 text-stone-400" />
                      <span>{listing.phone}</span>
                      <span className="text-[10px] text-stone-400 font-sans">(Google Maps public listing)</span>
                    </div>
                  )}
                </div>
              </div>

              {listing.link && (
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 text-stone-500" />
                </a>
              )}
            </div>
          </div>

          {/* Identified friction areas */}
          {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">
                {dataSource === 'illustrative_sample'
                  ? 'Demonstration Review Dissatisfaction Themes'
                  : 'Detected Review Dissatisfaction Themes'}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.dominantComplaints.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                    <span className="capitalize">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sampled Review Evidence */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <Quote className="h-4 w-4 text-teal-700" />
                <span>
                  {dataSource === 'illustrative_sample'
                    ? 'Demonstration Review Excerpts'
                    : 'Sampled Review Excerpts'}
                </span>
              </h4>
              <span className="font-mono text-xs text-stone-500">
                {listing.reviewsSample?.length || 0} excerpts
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {(!listing.reviewsSample || listing.reviewsSample.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-500">
                  No public review excerpts sampled for this listing in the active {dataSource === 'illustrative_sample' ? 'demonstration sample' : 'SerpApi batch'}.
                </div>
              ) : (
                listing.reviewsSample.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-stone-800">
                        {rev.author}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
                        <span className="font-medium text-amber-700">
                          {rev.rating !== null ? `★ ${rev.rating}` : 'Unrated'}
                        </span>
                        <span>•</span>
                        <span>{rev.date || 'Recent'}</span>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-xs sm:text-sm text-stone-700 leading-relaxed italic border-l-2 border-teal-700 pl-3">
                      “{rev.text}”
                    </blockquote>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Data Provenance & Methodology Disclaimer */}
          <div className="rounded-2xl bg-stone-100 p-4 text-xs text-stone-600 flex items-start gap-3 border border-stone-200/80">
            <Info className="h-4 w-4 text-stone-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Data Provenance Notice:</strong>{' '}
              {dataSource === 'illustrative_sample'
                ? 'These listing attributes and review excerpts represent calibrated demonstration sample data for interface evaluation. Online feedback is subjective and does not constitute confirmed resident testimony, verified legal status, or definitive safety assessments.'
                : 'Listings and review snippets are public user-submitted feedback extracted via SerpApi Google Maps endpoints. Online feedback is subjective public reviewer feedback and does not constitute confirmed resident testimony, verified legal status, or definitive safety assessments.'}
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
