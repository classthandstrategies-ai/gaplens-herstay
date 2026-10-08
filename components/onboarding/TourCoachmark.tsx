'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOnboarding } from '@/lib/onboarding/OnboardingContext';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Info,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function TourCoachmark() {
  const {
    isOpen,
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    skipTour,
    setActiveTab,
  } = useOnboarding();

  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const coachmarkRef = useRef<HTMLDivElement>(null);

  // Responsive mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update target rect with retry mechanism for tab switches & rendering
  const updateRect = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const findAndMeasure = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const domRect = el.getBoundingClientRect();
        // If element is visible and has dimensions
        if (domRect.width > 0 && domRect.height > 0) {
          setTargetRect({
            top: domRect.top + window.scrollY,
            left: domRect.left + window.scrollX,
            width: domRect.width,
            height: domRect.height,
            bottom: domRect.bottom + window.scrollY,
            right: domRect.right + window.scrollX,
          });
          return true;
        }
      }
      return false;
    };

    if (!findAndMeasure()) {
      // Retry in next frames if element is still rendering (e.g. after tab switch)
      const timeout1 = setTimeout(findAndMeasure, 100);
      const timeout2 = setTimeout(findAndMeasure, 300);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [isOpen, currentStep]);

  // Recalculate on step change, scroll, or resize
  useEffect(() => {
    if (!isOpen) return;

    // Smooth scroll target element into viewport
    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const cleanup = updateRect();

    const handleScrollOrResize = () => {
      const target = document.querySelector(currentStep.targetSelector);
      if (target) {
        const r = target.getBoundingClientRect();
        setTargetRect({
          top: r.top + window.scrollY,
          left: r.left + window.scrollX,
          width: r.width,
          height: r.height,
          bottom: r.bottom + window.scrollY,
          right: r.right + window.scrollX,
        });
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, currentStepIndex, currentStep, updateRect]);

  if (!isOpen) return null;

  // Calculate desktop popover position
  let desktopStyle: React.CSSProperties = {};
  if (!isMobile && targetRect) {
    const cardWidth = 380;
    const padding = 16;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Viewport-relative coordinates
    const elViewportTop = targetRect.top - (typeof window !== 'undefined' ? window.scrollY : 0);
    const elViewportLeft = targetRect.left - (typeof window !== 'undefined' ? window.scrollX : 0);
    const elViewportBottom = elViewportTop + targetRect.height;
    const elViewportRight = elViewportLeft + targetRect.width;

    let computedTop = elViewportTop;
    let computedLeft = elViewportRight + padding;

    if (currentStep.position === 'right') {
      computedLeft = elViewportRight + padding;
      computedTop = Math.max(80, elViewportTop);
      if (computedLeft + cardWidth > viewportWidth - padding) {
        // Fallback to bottom or left
        computedLeft = Math.max(padding, elViewportLeft);
        computedTop = elViewportBottom + padding;
      }
    } else if (currentStep.position === 'bottom') {
      computedLeft = Math.max(padding, Math.min(viewportWidth - cardWidth - padding, elViewportLeft));
      computedTop = elViewportBottom + padding;
      if (computedTop + 340 > viewportHeight - padding) {
        computedTop = Math.max(80, elViewportTop - 340 - padding);
      }
    } else if (currentStep.position === 'left') {
      computedLeft = elViewportLeft - cardWidth - padding;
      computedTop = Math.max(80, elViewportTop);
      if (computedLeft < padding) {
        computedLeft = Math.max(padding, Math.min(viewportWidth - cardWidth - padding, elViewportLeft));
        computedTop = elViewportBottom + padding;
      }
    } else if (currentStep.position === 'top') {
      computedLeft = Math.max(padding, Math.min(viewportWidth - cardWidth - padding, elViewportLeft));
      computedTop = Math.max(80, elViewportTop - 340 - padding);
    }

    // Keep within viewport bounds
    computedLeft = Math.max(padding, Math.min(viewportWidth - cardWidth - padding, computedLeft));
    computedTop = Math.max(76, Math.min(viewportHeight - 380, computedTop));

    desktopStyle = {
      position: 'fixed',
      top: `${computedTop}px`,
      left: `${computedLeft}px`,
      width: `${cardWidth}px`,
      zIndex: 9999,
    };
  }

  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* Target Element Spotlight Cutout / Highlight Ring */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)',
            pointerEvents: 'none',
            zIndex: 9990,
          }}
          className="rounded-2xl ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-900 transition-all duration-300"
        />
      )}

      {/* Backdrop for fallback when no target rect is measured yet */}
      {!targetRect && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-[9990]" />
      )}

      {/* Floating Coachmark Card */}
      <div
        ref={coachmarkRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        style={isMobile ? undefined : desktopStyle}
        className={
          isMobile
            ? 'fixed bottom-4 inset-x-3 z-[9999] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl animate-slideUp'
            : !targetRect
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[400px] rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl'
            : 'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl transition-all duration-200'
        }
      >
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200 uppercase tracking-wide">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              GapLens Walkthrough
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={skipTour}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={skipTour}
              aria-label="Close tour"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="mt-3.5 space-y-2">
          <h3
            id="tour-step-title"
            className="text-base font-extrabold tracking-tight text-slate-900"
          >
            {currentStep.title}
          </h3>
          <p className="text-xs font-semibold text-teal-700">
            {currentStep.subtitle}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Key Insight Box */}
          {currentStep.keyInsight && (
            <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/60 p-2.5 text-[11px] text-teal-900 flex items-start gap-2">
              <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold">Key Principle:</span> {currentStep.keyInsight}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          {currentStepIndex < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  skipTour();
                  setActiveTab('methodology');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <BookOpen className="h-3 w-3 text-slate-500" />
                <span>Methodology</span>
              </button>
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Start Exploring</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
