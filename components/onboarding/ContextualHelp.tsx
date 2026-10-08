'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Info } from 'lucide-react';

interface ContextualHelpProps {
  title: string;
  content: string;
  badgeText?: string;
  className?: string;
}

export function ContextualHelp({
  title,
  content,
  badgeText = 'Help & Context',
  className = '',
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Contextual help: ${title}`}
        className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 z-40 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl animate-fadeIn text-left text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 uppercase tracking-wide">
              {badgeText}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close tooltip"
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <h4 className="mt-2 font-bold text-slate-900">{title}</h4>
          <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{content}</p>

          <div className="mt-2 flex items-center gap-1 text-[10px] text-teal-700 font-medium">
            <Info className="h-3 w-3 shrink-0" />
            <span>GapLens Methodology Standard</span>
          </div>

          {/* Little arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
        </div>
      )}
    </div>
  );
}
