'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  error,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(0);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string, index: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleOption(value);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(Math.min(index + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(Math.max(index - 1, 0));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    }
  };

  const displayText = selected.length > 0
    ? `${selected.length} selected`
    : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleButtonKeyDown}
        className={`select select-bordered w-full flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'select-error' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selected.length === 0 ? 'opacity-50' : ''}>
          {displayText}
        </span>
        <span className="ml-2">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}

      {isOpen && (
        <div
          className="absolute z-10 top-full mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-[300px] overflow-y-auto p-2"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option.value);
            const isFocused = index === focusedIndex;

            return (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200 cursor-pointer select-none ${
                  isFocused ? 'bg-base-200' : ''
                }`}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value, index)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option.value)}
                  className="checkbox checkbox-sm checkbox-primary"
                  tabIndex={-1}
                />
                <span className="text-sm text-base-content">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
