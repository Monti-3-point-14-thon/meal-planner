// Core type definitions for meal planner application

// ============================================================================
// User Settings Types
// ============================================================================

export type Goal =
  | 'muscle_building'
  | 'weight_loss'
  | 'gut_health'
  | 'mental_performance'
  | 'general_health';

export type Sex = 'male' | 'female' | 'other';

export interface Biometrics {
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: Sex;
}

export interface CulturalContext {
  cuisine: string; // e.g., "Mediterranean", "Japanese", etc.
  location: string; // country/region
}

export interface UserSettings {
  id: string; // uuid
  primary_goal: Goal;
  biometrics: Biometrics;
  cultural_context: CulturalContext;
  dietary_restrictions: string[]; // e.g., ['vegetarian', 'gluten-free']
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// ============================================================================
// Meal Plan Types
// ============================================================================

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack_morning'
  | 'snack_afternoon'
  | 'snack_evening';

export interface Macros {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}

export interface Ingredient {
  name: string;
  quantity: string; // e.g., "150g" or "1 cup"
  notes?: string; // optional notes
}

export interface MealEdit {
  id: string; // uuid
  user_instruction: string; // e.g., "Make it vegetarian"
  timestamp: string; // ISO timestamp
}

export interface Meal {
  id: string; // uuid
  type: MealType;
  name: string; // e.g., "Grilled Salmon with Quinoa"
  ingredients: Ingredient[];
  preparation: string; // brief instructions
  macros: Macros;
  nutritional_reasoning: string; // why this meal serves user's goal
  scientific_sources?: string[]; // Tavily-validated sources (optional)
  edit_history: MealEdit[]; // track refinements
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface MealPlan {
  id: string; // uuid
  user_settings_id: string; // references UserSettings.id
  date: string; // ISO date
  meals: Meal[]; // array of 3-6 meals
  daily_totals: Macros;
  created_at: string; // ISO timestamp
}

// ============================================================================
// API Response Types
// ============================================================================

export interface GenerateMealPlanRequest {
  userSettings: UserSettings;
  options?: {
    includeSnacks?: boolean;
    validateWithTavily?: boolean;
  };
}

export interface GenerateMealPlanResponse {
  success: boolean;
  mealPlan?: MealPlan;
  generationTime?: number; // seconds
  warnings?: string[];
  error?: string;
}

export interface RegenerateMealRequest {
  mealPlan: MealPlan;
  mealId: string;
  userInstruction: string;
  userSettings: UserSettings;
}

export interface RegenerateMealResponse {
  success: boolean;
  updatedMeal?: Meal;
  updatedDailyTotals?: Macros;
  error?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export type ErrorType =
  | 'rate_limit'
  | 'generation_failed'
  | 'network_error'
  | 'invalid_input'
  | 'validation_error';

export interface AppError {
  type: ErrorType;
  message: string;
  retryable: boolean;
  retryAfter?: number; // seconds (for rate limits)
}

// ============================================================================
// Utility Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  stage?: 'analyzing' | 'generating' | 'validating' | 'complete';
  progress?: number; // 0-100
  estimatedTime?: number; // seconds remaining
}

// ============================================================================
// Form Types
// ============================================================================

export interface SettingsFormData {
  goal: Goal;
  weight: number;
  height: number;
  age: number;
  sex: Sex;
  cuisine: string;
  location: string;
  restrictions: string[];
}

// Type guards
export function isValidGoal(value: string): value is Goal {
  return ['muscle_building', 'weight_loss', 'gut_health', 'mental_performance', 'general_health'].includes(value);
}

export function isValidSex(value: string): value is Sex {
  return ['male', 'female', 'other'].includes(value);
}

export function isValidMealType(value: string): value is MealType {
  return ['breakfast', 'lunch', 'dinner', 'snack_morning', 'snack_afternoon', 'snack_evening'].includes(value);
}
