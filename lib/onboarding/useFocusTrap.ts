import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isOpen: boolean;
  onEscape?: () => void;
  initialFocusSelector?: string;
  fallbackRestoreSelector?: string;
}

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onEscape,
  initialFocusSelector,
  fallbackRestoreSelector,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Capture currently focused element before opening
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }

    const container = containerRef.current;
    if (!container) return;

    // Set initial focus
    const focusable = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (initialFocusSelector) {
      const initialEl = container.querySelector<HTMLElement>(initialFocusSelector);
      if (initialEl) {
        initialEl.focus();
      } else if (focusable.length > 0) {
        focusable[0].focus();
      }
    } else if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onEscape) {
          e.preventDefault();
          e.stopPropagation();
          onEscape();
        }
        return;
      }

      if (e.key === 'Tab') {
        const elements = Array.from(
          container.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (elements.length === 0) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus on close / unmount
      const restoreEl = previousFocusRef.current;
      if (restoreEl && document.contains(restoreEl) && typeof restoreEl.focus === 'function') {
        restoreEl.focus();
      } else if (fallbackRestoreSelector) {
        const fallback = document.querySelector<HTMLElement>(fallbackRestoreSelector);
        if (fallback && typeof fallback.focus === 'function') {
          fallback.focus();
        }
      }
    };
  }, [isOpen, onEscape, initialFocusSelector, fallbackRestoreSelector]);

  return containerRef;
}
