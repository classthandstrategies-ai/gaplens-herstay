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
  MessageSquare,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface PropertyDetailModalProps {
  listing: PlaceListing | null;
  hub: EmploymentHub;
  onClose: () => void;
}

export function PropertyDetailModal({
  listing,
  hub,
  onClose,
}: PropertyDetailModalProps) {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800">
                {listing.category || "Women's PG"}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {formatStraightLineDistance(listing.distanceKm)} to {hub.name}
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
              {listing.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="px-6 py-5 space-y-6">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs text-slate-500 font-medium">Public Rating</div>
              {listing.rating !== null ? (
                <div className="mt-1 flex items-center gap-1 text-lg font-bold text-slate-900">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <span>{listing.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                </div>
              ) : (
                <div className="mt-1 text-sm font-semibold text-slate-500">
                  Unrated on Maps
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs text-slate-500 font-medium">Review Base</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {listing.reviewCount}
                <span className="text-xs text-slate-500 font-normal"> reviews</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs text-slate-500 font-medium">Hub Proximity</div>
              <div className="mt-1 text-sm font-bold text-teal-800">
                {formatStraightLineDistance(listing.distanceKm)}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs text-slate-500 font-medium">Price Indication</div>
              <div className="mt-1 text-xs font-semibold text-slate-800 truncate">
                {listing.price || 'Market Standard'}
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Address & Access</h4>
                  <p className="mt-0.5 text-xs text-slate-600">{listing.address}</p>
                  {listing.phone && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{listing.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {listing.link && (
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Friction analysis tags */}
          {listing.dominantComplaints && listing.dominantComplaints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Identified Review Friction Areas
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.dominantComplaints.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="capitalize">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sampled Review Evidence */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <span>Sampled Resident Feedback & Verbatim Quotes</span>
              </h4>
              <span className="text-xs text-slate-500">
                {listing.reviewsSample?.length || 0} quotes analyzed
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {(!listing.reviewsSample || listing.reviewsSample.length === 0) ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  No public textual reviews sampled for this listing in the current batch.
                </div>
              ) : (
                listing.reviewsSample.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-slate-800">
                        {rev.author}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="flex items-center gap-0.5 font-medium text-amber-700">
                          {rev.rating !== null ? `★ ${rev.rating}` : 'Unrated'}
                        </span>
                        <span>•</span>
                        <span>{rev.date || 'Recent'}</span>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed italic border-l-2 border-teal-500 pl-3">
                      “{rev.text}”
                    </blockquote>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subjectivity & Disclaimer notice */}
          <div className="rounded-xl bg-slate-100 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Data provenance disclaimer:</strong> Review snippets are public user-submitted feedback extracted via SerpApi Google Maps endpoints. Online feedback is subjective and does not constitute a verified legal, regulatory, or definitive safety assessment.
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
