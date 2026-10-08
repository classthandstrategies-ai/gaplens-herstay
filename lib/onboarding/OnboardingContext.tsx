'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { TourTab, TourStep, OnboardingContextValue } from './types';
import { TOUR_STEPS } from './steps';
import {
  subscribeToStorage,
  getOnboardingStateSnapshot,
  getServerSnapshot,
  setOnboardingCompleted,
  setOnboardingDismissed,
} from './storage';

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
  activeTab: TourTab;
  setActiveTab: (tab: TourTab) => void;
}

export function OnboardingProvider({
  children,
  activeTab,
  setActiveTab,
}: OnboardingProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasDismissedInSession, setHasDismissedInSession] = useState<boolean>(false);
  const [hasStartedInSession, setHasStartedInSession] = useState<boolean>(false);

  // Synchronize with external localStorage store safely across SSR & client
  const storageSnapshot = useSyncExternalStore(
    subscribeToStorage,
    getOnboardingStateSnapshot,
    getServerSnapshot
  );

  // Welcome modal is visible only for first-time visitors (storage snapshot === 'none')
  // and when neither dismissed nor tour already running.
  const isWelcomeOpen =
    storageSnapshot === 'none' && !hasDismissedInSession && !hasStartedInSession && !isOpen;

  const currentStep: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const totalSteps = TOUR_STEPS.length;

  const startTour = useCallback(() => {
    setHasStartedInSession(true);
    setCurrentStepIndex(0);
    setActiveTab('explorer');
    setIsOpen(true);
  }, [setActiveTab]);

  const dismissWelcome = useCallback(() => {
    setHasDismissedInSession(true);
    setOnboardingDismissed();
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIdx = currentStepIndex + 1;
      const nextStepDef = TOUR_STEPS[nextIdx];
      setCurrentStepIndex(nextIdx);
      if (nextStepDef && nextStepDef.targetTab !== activeTab) {
        setActiveTab(nextStepDef.targetTab);
      }
    } else {
      // Completed all steps
      setIsOpen(false);
      setOnboardingCompleted();
    }
  }, [currentStepIndex, totalSteps, activeTab, setActiveTab]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const prevStepDef = TOUR_STEPS[prevIdx];
      setCurrentStepIndex(prevIdx);
      if (prevStepDef && prevStepDef.targetTab !== activeTab) {
        setActiveTab(prevStepDef.targetTab);
      }
    }
  }, [currentStepIndex, activeTab, setActiveTab]);

  const skipTour = useCallback(() => {
    setIsOpen(false);
    setOnboardingDismissed();
  }, []);

  const replayTour = useCallback(() => {
    setHasStartedInSession(true);
    setCurrentStepIndex(0);
    setActiveTab('explorer');
    setIsOpen(true);
  }, [setActiveTab]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          skipTour();
        } else if (isWelcomeOpen) {
          dismissWelcome();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isWelcomeOpen, skipTour, dismissWelcome]);

  const value: OnboardingContextValue = {
    isOpen,
    isWelcomeOpen,
    currentStepIndex,
    currentStep,
    totalSteps,
    activeTab,
    setActiveTab,
    startTour,
    dismissWelcome,
    nextStep,
    prevStep,
    skipTour,
    replayTour,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
