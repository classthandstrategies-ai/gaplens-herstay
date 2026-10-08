import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TOUR_STEPS } from '../lib/onboarding/steps';
import {
  ONBOARDING_STORAGE_KEY,
  getOnboardingState,
  setOnboardingCompleted,
  setOnboardingDismissed,
  resetOnboardingState,
  getOnboardingStateSnapshot,
} from '../lib/onboarding/storage';

describe('GapLens Interactive Onboarding System', () => {
  beforeEach(() => {
    // Reset virtual localStorage
    const store: Record<string, string> = {};
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, val: string) => {
          store[key] = val;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe('Curated 5-Step Guided Tour Specifications', () => {
    it('defines exactly 5 structured steps covering the end-to-end intelligence workflow', () => {
      expect(TOUR_STEPS).toHaveLength(5);
      TOUR_STEPS.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.totalSteps).toBe(5);
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.targetSelector).toMatch(/^\[data-tour=".*"\]$/);
      });
    });

    it('Step 1 targets market & radius filter sidebar', () => {
      const step1 = TOUR_STEPS[0];
      expect(step1.id).toBe('market-filters');
      expect(step1.targetSelector).toBe('[data-tour="market-filters"]');
      expect(step1.targetTab).toBe('explorer');
      expect(step1.description).toContain('radius');
    });

    it('Step 2 targets the scan action and clarifies API zero-cost safety during tour', () => {
      const step2 = TOUR_STEPS[1];
      expect(step2.id).toBe('analyze-btn');
      expect(step2.targetSelector).toBe('[data-tour="analyze-btn"]');
      expect(step2.targetTab).toBe('explorer');
      expect(step2.description).toContain('SerpApi');
    });

    it('Step 3 targets discovered supply map & properties without false verified claims', () => {
      const step3 = TOUR_STEPS[2];
      expect(step3.id).toBe('property-map-area');
      expect(step3.targetSelector).toBe('[data-tour="property-map-area"]');
      expect(step3.targetTab).toBe('explorer');
      expect(step3.keyInsight).toContain('discovered search results');
    });

    it('Step 4 highlights reviewer feedback and evidence confidence calibration', () => {
      const step4 = TOUR_STEPS[3];
      expect(step4.id).toBe('friction-breakdown');
      expect(step4.targetSelector).toBe('[data-tour="friction-breakdown"]');
      expect(step4.targetTab).toBe('explorer');
      expect(step4.description).toContain('recurring friction');
    });

    it('Step 5 transitions to opportunity report tab and reinforces field validation thesis', () => {
      const step5 = TOUR_STEPS[4];
      expect(step5.id).toBe('report-hypothesis');
      expect(step5.targetSelector).toBe('[data-tour="report-hypothesis"]');
      expect(step5.targetTab).toBe('report');
      expect(step5.keyInsight).toContain('starting hypothesis');
    });
  });

  describe('Storage & Persistence Engine', () => {
    it('returns clean uncompleted state for first-time visitor', () => {
      const state = getOnboardingState();
      expect(state.completed).toBe(false);
      expect(state.dismissedAt).toBeUndefined();
      expect(getOnboardingStateSnapshot()).toBe('none');
    });

    it('records completion in localStorage with ISO timestamp', () => {
      setOnboardingCompleted();
      const state = getOnboardingState();
      expect(state.completed).toBe(true);
      expect(state.completedAt).toBeTruthy();
      expect(getOnboardingStateSnapshot()).toContain('"completed":true');
    });

    it('records explicit dismissal in localStorage', () => {
      setOnboardingDismissed();
      const state = getOnboardingState();
      expect(state.completed).toBe(false);
      expect(state.dismissedAt).toBeTruthy();
      expect(getOnboardingStateSnapshot()).toContain('"completed":false');
    });

    it('resets onboarding state cleanly when replaying or clearing', () => {
      setOnboardingCompleted();
      expect(getOnboardingState().completed).toBe(true);
      resetOnboardingState();
      expect(getOnboardingState().completed).toBe(false);
      expect(getOnboardingStateSnapshot()).toBe('none');
    });

    it('handles corrupted localStorage payload gracefully without crashing', () => {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'invalid json {{{');
      const state = getOnboardingState();
      expect(state.completed).toBe(false);
      expect(state.version).toBe('v1');
    });
  });

  describe('Tour Progression & Tab Synchronization Logic', () => {
    it('correctly maps target tabs across all 5 steps', () => {
      const tabs = TOUR_STEPS.map((s) => s.targetTab);
      expect(tabs).toEqual(['explorer', 'explorer', 'explorer', 'explorer', 'report']);
    });
  });
});
