'use client';

import React from 'react';
import { useOnboarding } from '@/lib/onboarding/OnboardingContext';
import { Compass, Sparkles, MapPin, MessageSquareWarning, Target, X } from 'lucide-react';

export function WelcomeModal() {
  const { isWelcomeOpen, startTour, dismissWelcome } = useOnboarding();

  if (!isWelcomeOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={dismissWelcome}
          aria-label="Dismiss welcome dialog"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge & Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-teal-400 shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 border border-teal-600/20 uppercase tracking-wider">
            HerStay Intelligence Guide
          </span>
        </div>

        {/* Title & Subtitle */}
        <h2
          id="welcome-modal-title"
          className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
        >
          Welcome to GapLens
        </h2>
        <p className="mt-1 text-base font-semibold text-teal-700">
          Find where better women&apos;s housing may be needed.
        </p>

        {/* Body Text */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Explore accommodation supply, understand public reviewer feedback, and discover potential
          market gaps near major Indian tech corridors.
        </p>

        {/* Feature Highlights Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100/80 text-teal-700 mb-2">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Supply Density</h3>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Map public PGs and hostels within 1–5 km of major tech parks.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700 mb-2">
              <MessageSquareWarning className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Reviewer Friction</h3>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Identify recurring complaints in hygiene, safety, food, and rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100/80 text-indigo-700 mb-2">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Opportunity Hypotheses</h3>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Actionable starting points for entrepreneurs and operators.
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100">
          <button
            onClick={dismissWelcome}
            className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Explore on My Own
          </button>

          <button
            onClick={startTour}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>Show Me Around (60s Tour)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
