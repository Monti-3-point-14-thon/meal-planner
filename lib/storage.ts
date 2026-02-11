// localStorage utilities for meal planner
// Handles persistent storage of user settings and meal plans

import { UserSettings, MealPlan } from './types';

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'meal_planner_settings',
  CURRENT_PLAN: 'meal_planner_current',
  HISTORY: 'meal_planner_history',
} as const;

// Maximum number of plans to keep in history
const MAX_HISTORY_SIZE = 5;

// ============================================================================
// Error Handling
// ============================================================================

class StorageError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

function handleStorageError(operation: string, error: unknown): never {
  console.error(`Storage error during ${operation}:`, error);
  throw new StorageError(`Failed to ${operation}`, error);
}

// ============================================================================
// User Settings
// ============================================================================

export function saveSettings(settings: UserSettings): void {
  try {
    const serialized = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, serialized);
  } catch (error) {
    handleStorageError('save settings', error);
  }
}

export function getSettings(): UserSettings | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!serialized) return null;

    const settings = JSON.parse(serialized) as UserSettings;
    return settings;
  } catch (error) {
    handleStorageError('get settings', error);
  }
}

export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    handleStorageError('clear settings', error);
  }
}

export function hasSettings(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS) !== null;
  } catch (error) {
    console.error('Error checking for settings:', error);
    return false;
  }
}

// ============================================================================
// Current Meal Plan
// ============================================================================

export function saveMealPlan(mealPlan: MealPlan): void {
  try {
    const serialized = JSON.stringify(mealPlan);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, serialized);

    // Also add to history
    addToHistory(mealPlan);
  } catch (error) {
    handleStorageError('save meal plan', error);
  }
}

export function getMealPlan(): MealPlan | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    if (!serialized) return null;

    const mealPlan = JSON.parse(serialized) as MealPlan;
    return mealPlan;
  } catch (error) {
    handleStorageError('get meal plan', error);
  }
}

export function clearMealPlan(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
  } catch (error) {
    handleStorageError('clear meal plan', error);
  }
}

export function hasMealPlan(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN) !== null;
  } catch (error) {
    console.error('Error checking for meal plan:', error);
    return false;
  }
}

// ============================================================================
// Meal Plan History
// ============================================================================

export function getHistory(): MealPlan[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!serialized) return [];

    const history = JSON.parse(serialized) as MealPlan[];
    return history;
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

export function addToHistory(mealPlan: MealPlan): void {
  try {
    const history = getHistory();

    // Add new plan to beginning
    history.unshift(mealPlan);

    // Keep only last N plans
    const trimmedHistory = history.slice(0, MAX_HISTORY_SIZE);

    const serialized = JSON.stringify(trimmedHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, serialized);
  } catch (error) {
    console.error('Error adding to history:', error);
    // Don't throw - history is nice-to-have, not critical
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    handleStorageError('clear history', error);
  }
}

// ============================================================================
// Batch Operations
// ============================================================================

export function clearAllData(): void {
  try {
    clearSettings();
    clearMealPlan();
    clearHistory();
  } catch (error) {
    handleStorageError('clear all data', error);
  }
}

export function exportData(): string {
  try {
    const data = {
      settings: getSettings(),
      currentPlan: getMealPlan(),
      history: getHistory(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    handleStorageError('export data', error);
  }
}

export function importData(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString);

    if (data.settings) saveSettings(data.settings);
    if (data.currentPlan) saveMealPlan(data.currentPlan);
    if (data.history) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    }
  } catch (error) {
    handleStorageError('import data', error);
  }
}

// ============================================================================
// Storage Quota Utilities
// ============================================================================

export function getStorageUsage(): { used: number; total: number; percentage: number } | null {
  try {
    if (!('storage' in navigator)) {
      return null;
    }

    // This is an approximation since we don't have direct access to quota
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS) || '';
    const current = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN) || '';
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY) || '';

    const used = new Blob([settings, current, history]).size;
    const total = 5 * 1024 * 1024; // ~5MB typical localStorage limit
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  } catch (error) {
    console.error('Error checking storage usage:', error);
    return null;
  }
}

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('localStorage is not available:', error);
    return false;
  }
}
