export type TourTab = 'explorer' | 'report' | 'methodology';

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  description: string;
  targetSelector: string;
  targetTab: TourTab;
  position?: 'top' | 'bottom' | 'left' | 'right';
  keyInsight?: string;
  actionHint?: string;
}

export interface OnboardingStorageState {
  version: 'v1';
  completed: boolean;
  dismissedAt?: string;
  completedAt?: string;
}

export interface OnboardingContextValue {
  isOpen: boolean;
  isWelcomeOpen: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  activeTab: TourTab;
  setActiveTab: (tab: TourTab) => void;
  startTour: () => void;
  dismissWelcome: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  replayTour: () => void;
}
