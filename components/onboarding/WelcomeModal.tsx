'use client';

import React from 'react';
import { useOnboarding } from '@/lib/onboarding/OnboardingContext';
import { useFocusTrap } from '@/lib/onboarding/useFocusTrap';
import { Compass, Sparkles, MapPin, MessageSquareWarning, Target, X } from 'lucide-react';

export function WelcomeModal() {
  const { isWelcomeOpen, startTour, dismissWelcome } = useOnboarding();

  const containerRef = useFocusTrap<HTMLDivElement>({
    isOpen: isWelcomeOpen,
    onEscape: dismissWelcome,
    initialFocusSelector: '#welcome-start-btn',
    fallbackRestoreSelector: '[data-tour-trigger="true"]',
  });

  if (!isWelcomeOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl transition-all"
      >
        {/* Close Button */}
        <button
          onClick={dismissWelcome}
          aria-label="Dismiss welcome dialog"
          className="absolute right-5 top-5 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge & Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-teal-300 shadow-2xs">
            <Compass className="h-5 w-5" />
          </div>
          <span className="rounded-md bg-stone-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-stone-700 uppercase tracking-widest border border-stone-200">
            Interactive Briefing Guide
          </span>
        </div>

        {/* Title & Subtitle */}
        <h2
          id="welcome-modal-title"
          className="mt-4 font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900"
        >
          Welcome to GapLens HerStay
        </h2>
        <p className="mt-1.5 text-sm sm:text-base font-medium text-teal-800 font-sans">
          Discover where better women&apos;s accommodations are needed near major employment hubs.
        </p>

        {/* Body Text */}
        <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
          Analyze public accommodation supply density, evaluate recurring reviewer complaints, and identify underserved accommodation gaps and operator hypotheses around India&apos;s leading employment corridors.
        </p>

        {/* Feature Highlights Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 mb-2.5">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-xs font-bold text-stone-900">Spatial Supply</h3>
            <p className="mt-1 font-sans text-[11px] text-stone-500 leading-relaxed">
              Map public PGs and hostels within 1–5 km straight-line radius of Manyata, Hinjewadi, and Gachibowli.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200 mb-2.5">
              <MessageSquareWarning className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-xs font-bold text-stone-900">Review Friction</h3>
            <p className="mt-1 font-sans text-[11px] text-stone-500 leading-relaxed">
              Pinpoint recurring dissatisfaction in hygiene, management, food, and security perceptions.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-stone-100 text-stone-800 border border-stone-200 mb-2.5">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-xs font-bold text-stone-900">Opportunity Dossier</h3>
            <p className="mt-1 font-sans text-[11px] text-stone-500 leading-relaxed">
              Synthesize empirical evidence into strategic directional hypotheses for housing operators.
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-5 border-t border-stone-200">
          <button
            onClick={dismissWelcome}
            className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Explore on My Own
          </button>

          <button
            id="welcome-start-btn"
            onClick={startTour}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-stone-800 transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-700 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-teal-300" />
            <span>Show Me Around (60s Tour)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
