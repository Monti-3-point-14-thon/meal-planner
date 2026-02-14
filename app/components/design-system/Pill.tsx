'use client';

import React from 'react';

interface PillProps {
  text: string;
  icon?: React.ReactNode;
  onRemove: () => void;
  className?: string;
}

export default function Pill({ text, icon, onRemove, className = '' }: PillProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRemove();
    }
  };

  return (
    <span
      className={`inline-flex items-center bg-primary bg-opacity-10 text-primary-content border border-primary border-opacity-20 px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-opacity-20 ${className}`}
    >
      {icon && (
        <span className="inline-flex items-center mr-2 text-base">
          {icon}
        </span>
      )}
      <span className="inline-block max-w-[200px] truncate">
        {text}
      </span>
      <button
        type="button"
        onClick={onRemove}
        onKeyDown={handleKeyDown}
        className="ml-2 p-0.5 text-base font-semibold text-primary-content opacity-90 hover:text-error hover:opacity-100 cursor-pointer transition-all"
        aria-label={`Remove ${text}`}
        tabIndex={0}
      >
        ×
      </button>
    </span>
  );
}
