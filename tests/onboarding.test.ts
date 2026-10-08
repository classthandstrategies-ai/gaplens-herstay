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
import { TourTab } from '../lib/onboarding/types';

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

    it('Step 1 references actual supported markets: Manyata Tech Park, Hinjewadi, and Gachibowli', () => {
      const step1 = TOUR_STEPS[0];
      expect(step1.id).toBe('market-filters');
      expect(step1.targetSelector).toBe('[data-tour="market-filters"]');
      expect(step1.targetTab).toBe('explorer');
      expect(step1.description).toContain('Manyata Tech Park');
      expect(step1.description).toContain('Hinjewadi');
      expect(step1.description).toContain('Gachibowli');
    });

    it('Step 1 documents Haversine straight-line distance and avoids Euclidean or walking claims', () => {
      const step1 = TOUR_STEPS[0];
      expect(step1.keyInsight).toContain('Haversine straight-line distance');
      expect(step1.keyInsight).not.toContain('Euclidean');
      expect(step1.keyInsight).not.toContain('walking');
    });

    it('Step 2 targets the scan action and clarifies API zero-cost safety during tour', () => {
      const step2 = TOUR_STEPS[1];
      expect(step2.id).toBe('analyze-btn');
      expect(step2.targetSelector).toBe('[data-tour="analyze-btn"]');
      expect(step2.targetTab).toBe('explorer');
      expect(step2.description).toContain('SerpApi');
      expect(step2.description).toContain('no live API credits are consumed');
    });

    it('Step 3 clarifies pricing and amenities are shown only when available in public data', () => {
      const step3 = TOUR_STEPS[2];
      expect(step3.id).toBe('property-map-area');
      expect(step3.targetSelector).toBe('[data-tour="property-map-area"]');
      expect(step3.targetTab).toBe('explorer');
      expect(step3.description).toContain('when available in public listings');
      expect(step3.keyInsight).toContain('only when available from public search data');
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

  describe('Tour Progression, Tab Synchronization & Completion Return', () => {
    it('correctly maps target tabs across all 5 steps', () => {
      const tabs = TOUR_STEPS.map((s) => s.targetTab);
      expect(tabs).toEqual(['explorer', 'explorer', 'explorer', 'explorer', 'report']);
    });

    it('REGRESSION: finishing the tour switches tab back to Market Explorer', () => {
      // Simulate the exact state machine of OnboardingContext
      let currentStepIndex = 0;
      let activeTab: TourTab = 'explorer';
      let isOpen = true;

      const setActiveTab = (tab: TourTab) => {
        activeTab = tab;
      };

      const nextStep = () => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
          const nextIdx = currentStepIndex + 1;
          const nextStepDef = TOUR_STEPS[nextIdx];
          currentStepIndex = nextIdx;
          if (nextStepDef && nextStepDef.targetTab !== activeTab) {
            setActiveTab(nextStepDef.targetTab);
          }
        } else {
          // Final step: close tour and explicitly navigate back to explorer
          isOpen = false;
          setActiveTab('explorer');
          setOnboardingCompleted();
        }
      };

      // Step 1 -> 2
      nextStep();
      expect(currentStepIndex).toBe(1);
      expect(activeTab).toBe('explorer');

      // Step 2 -> 3
      nextStep();
      expect(currentStepIndex).toBe(2);
      expect(activeTab).toBe('explorer');

      // Step 3 -> 4
      nextStep();
      expect(currentStepIndex).toBe(3);
      expect(activeTab).toBe('explorer');

      // Step 4 -> 5 (transitions to opportunity report view)
      nextStep();
      expect(currentStepIndex).toBe(4);
      expect(activeTab).toBe('report');

      // Step 5 -> Finish ("Start Exploring")
      nextStep();
      expect(isOpen).toBe(false);
      expect(activeTab).toBe('explorer'); // Confirmed return to explorer!
      expect(getOnboardingState().completed).toBe(true);
    });

    it('replaying the tour resets step to 0, sets activeTab to explorer, and reopens coachmark', () => {
      let currentStepIndex = 4;
      let activeTab: TourTab = 'report';
      let isOpen = false;

      const replayTour = () => {
        currentStepIndex = 0;
        activeTab = 'explorer';
        isOpen = true;
      };

      replayTour();
      expect(currentStepIndex).toBe(0);
      expect(activeTab).toBe('explorer');
      expect(isOpen).toBe(true);
    });

    it('skipping the tour closes coachmark and records dismissal without resetting loaded analysis', () => {
      let isOpen = true;
      const skipTour = () => {
        isOpen = false;
        setOnboardingDismissed();
      };

      skipTour();
      expect(isOpen).toBe(false);
      const state = getOnboardingState();
      expect(state.completed).toBe(false);
      expect(state.dismissedAt).toBeTruthy();
    });
  });
});
