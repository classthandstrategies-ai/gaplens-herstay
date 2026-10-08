import { OnboardingStorageState } from './types';

export const ONBOARDING_STORAGE_KEY = 'gaplens_onboarding_v1';

let listeners: Array<() => void> = [];

export function subscribeToStorage(callback: () => void) {
  listeners.push(callback);
  const handleStorage = () => callback();
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function getOnboardingState(): OnboardingStorageState {
  if (typeof window === 'undefined') {
    return { version: 'v1', completed: false };
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      return { version: 'v1', completed: false };
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.version === 'v1') {
      return parsed as OnboardingStorageState;
    }
    return { version: 'v1', completed: false };
  } catch {
    return { version: 'v1', completed: false };
  }
}

export function getOnboardingStateSnapshot(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) || 'none';
  } catch {
    return 'none';
  }
}

export function getServerSnapshot(): string {
  return 'server';
}

export function setOnboardingCompleted(): void {
  if (typeof window === 'undefined') return;
  try {
    const state: OnboardingStorageState = {
      version: 'v1',
      completed: true,
      completedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
    notify();
  } catch (e) {
    console.warn('Failed to save onboarding completion state to localStorage', e);
  }
}

export function setOnboardingDismissed(): void {
  if (typeof window === 'undefined') return;
  try {
    const state: OnboardingStorageState = {
      version: 'v1',
      completed: false,
      dismissedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
    notify();
  } catch (e) {
    console.warn('Failed to save onboarding dismissed state to localStorage', e);
  }
}

export function resetOnboardingState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    notify();
  } catch (e) {
    console.warn('Failed to reset onboarding state in localStorage', e);
  }
}
