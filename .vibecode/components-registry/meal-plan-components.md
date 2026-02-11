# Meal Plan Components Registry

**Feature**: 001-meal-plan-generator
**Created**: 2026-02-11
**Status**: Planned (not yet implemented)

---

## Form Components

### SettingsForm
**Purpose**: Main container for user health profile setup
**Props**:
```typescript
{
  onSubmit: (settings: UserSettings) => void;
  initialData?: Partial<UserSettings>;
}
```
**Reusability**: Specific to meal planner (not reusable)
**Dependencies**: GoalSelector, BiometricsInput, CultureSelector, RestrictionsInput
**Location**: `app/components/SettingsForm.tsx`

---

### GoalSelector
**Purpose**: Dropdown for selecting primary health goal
**Props**:
```typescript
{
  value: Goal;
  onChange: (goal: Goal) => void;
}

type Goal = 'muscle_building' | 'weight_loss' | 'gut_health' | 'mental_performance' | 'general_health';
```
**Reusability**: Could be reused in profile settings (future)
**UI**: DaisyUI dropdown/select
**Location**: `app/components/GoalSelector.tsx`

---

### BiometricsInput
**Purpose**: Grouped inputs for weight, height, age, sex
**Props**:
```typescript
{
  value: Biometrics;
  onChange: (biometrics: Biometrics) => void;
}

interface Biometrics {
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: 'male' | 'female' | 'other';
}
```
**Reusability**: Could be reused in profile settings
**Features**:
- Unit toggle (kg/lbs, cm/inches)
- Validation (reasonable ranges)
**Location**: `app/components/BiometricsInput.tsx`

---

### CultureSelector
**Purpose**: Dropdown with 20 common cuisines + "Other" text field
**Props**:
```typescript
{
  value: { cuisine: string; location: string };
  onChange: (context: CulturalContext) => void;
}
```
**Reusability**: Specific to meal planner
**Cuisine Options**: Mediterranean, Italian, Mexican, Chinese, Japanese, Indian, Thai, Vietnamese, Middle Eastern, Greek, French, Spanish, Korean, Brazilian, Caribbean, American, British, German, Scandinavian, African, Other
**Location**: `app/components/CultureSelector.tsx`

---

### RestrictionsInput
**Purpose**: Multi-select checkboxes for dietary restrictions + custom input
**Props**:
```typescript
{
  value: string[];
  onChange: (restrictions: string[]) => void;
}
```
**Reusability**: Could be reused in profile settings
**Preset Options**: Vegetarian, Vegan, Gluten-free, Dairy-free, Nut allergy, Shellfish allergy, Pescatarian, Keto, Paleo, Halal, Kosher, Other (custom text)
**Location**: `app/components/RestrictionsInput.tsx`

---

## Meal Display Components

### MealPlanView
**Purpose**: Container for displaying full day's meal plan
**Props**:
```typescript
{
  mealPlan: MealPlan;
  onEditMeal: (mealId: string) => void;
  onRegeneratePlan: () => void;
}
```
**Reusability**: Specific to meal planner, but could be adapted for multi-day views
**Children**: MealCard (x3-6), DailyTotals
**Location**: `app/components/MealPlanView.tsx`

---

### MealCard
**Purpose**: Display individual meal with edit capability
**Props**:
```typescript
{
  meal: Meal;
  onEdit: (mealId: string) => void;
  isEditing: boolean;
  isRegenerating: boolean;
}
```
**Reusability**: HIGH - could be used in meal history, favorites, etc.
**Features**:
- Collapsible ingredients list
- Macro display (MacroDisplay component)
- Edit button/icon
- Expandable edit interface
**Location**: `app/components/MealCard.tsx`

**Visual Structure**:
```
┌─────────────────────────────────────┐
│ 🍳 Breakfast: Scrambled Eggs & Toast│ [Edit ✏️]
├─────────────────────────────────────┤
│ Ingredients:                        │
│  - 3 eggs (150g)                    │
│  - Whole wheat toast (2 slices)     │
│  - Olive oil (1 tsp)                │
├─────────────────────────────────────┤
│ Calories: 380                       │
│ Protein: 24g | Carbs: 28g | Fats: 18g│
├─────────────────────────────────────┤
│ Why this meal?                      │
│ High protein for muscle building... │
└─────────────────────────────────────┘
```

---

### MacroDisplay
**Purpose**: Show detailed macros (Protein/Carbs/Fats + Calories)
**Props**:
```typescript
{
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  size?: 'small' | 'medium' | 'large';
}
```
**Reusability**: HIGH - can be used anywhere macros are displayed
**Visual Format**:
```
Calories: 580
Protein: 45g | Carbs: 60g | Fats: 20g
```
**Location**: `app/components/MacroDisplay.tsx`

---

### DailyTotals
**Purpose**: Summary of daily macro totals
**Props**:
```typescript
{
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  target?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
```
**Reusability**: Could be adapted for weekly/monthly summaries
**Features**:
- Shows totals
- Shows target (optional)
- Progress bars if target provided
**Location**: `app/components/DailyTotals.tsx`

---

## Edit Components

### MealEditModal
**Purpose**: Expandable edit interface within meal card
**Props**:
```typescript
{
  mealId: string;
  currentMeal: Meal;
  onSubmit: (mealId: string, instruction: string) => void;
  onCancel: () => void;
  isRegenerating: boolean;
}
```
**Reusability**: Specific to meal editing
**Features**:
- Text input for user instruction
- Example placeholders ("Make it vegetarian", "No dairy")
- Submit/Cancel buttons
- Loading state during regeneration
**Location**: `app/components/MealEditModal.tsx`

---

### RegenerateButton
**Purpose**: Submit button for meal regeneration
**Props**:
```typescript
{
  onClick: () => void;
  isLoading: boolean;
  label?: string;
}
```
**Reusability**: Could be generalized to "AIGenerateButton"
**States**:
- Default: "Regenerate Meal"
- Loading: "Generating..." with spinner
- Disabled when isLoading
**Location**: `app/components/RegenerateButton.tsx`

---

## Loading & Error Components

### GenerationLoader
**Purpose**: Progress indicator for AI generation
**Props**:
```typescript
{
  stage: 'analyzing' | 'generating' | 'validating' | 'complete';
  estimatedTime?: number; // seconds
}
```
**Reusability**: HIGH - can be used for any AI generation task
**Features**:
- Progress bar or spinner
- Stage indicator ("Analyzing your profile...", "Generating meals...")
- Estimated time remaining
**Location**: `app/components/GenerationLoader.tsx`

---

### ErrorDisplay
**Purpose**: User-friendly error messages with retry option
**Props**:
```typescript
{
  error: 'rate_limit' | 'generation_failed' | 'network_error' | 'invalid_input';
  message?: string;
  onRetry?: () => void;
}
```
**Reusability**: HIGH - can be used throughout app
**Features**:
- Icon + message
- Retry button (if applicable)
- Context-specific suggestions
**Location**: `app/components/ErrorDisplay.tsx`

---

## Component Hierarchy

```
SettingsForm
├── GoalSelector
├── BiometricsInput
├── CultureSelector
└── RestrictionsInput

MealPlanView
├── MealCard (x3-6)
│   ├── MacroDisplay
│   └── MealEditModal
│       └── RegenerateButton
└── DailyTotals
    └── MacroDisplay

GenerationLoader (standalone)
ErrorDisplay (standalone)
```

---

## Reusability Summary

**High Reusability** (can be used in multiple contexts):
- MacroDisplay
- GenerationLoader
- ErrorDisplay
- MealCard
- BiometricsInput

**Medium Reusability** (adaptable with modifications):
- GoalSelector
- RestrictionsInput
- DailyTotals

**Low Reusability** (specific to meal plan generation):
- SettingsForm
- CultureSelector
- MealPlanView
- MealEditModal

---

## Ship-Fast Components to Reuse

**From DaisyUI**:
- Button (primary, secondary, ghost)
- Card (meal cards, settings form container)
- Input (text, number)
- Select (dropdowns)
- Checkbox (restrictions)
- Badge (goal tags, macro labels)
- Loading (spinner)
- Alert (error messages)

**Strategy**: Build meal-specific components on top of DaisyUI primitives

---

## Next Steps

1. Implement components in order of dependency (bottom-up)
2. Create Storybook stories for reusable components (optional, future)
3. Document component APIs as they're built
4. Update this registry with actual implementation details

---

## Notes

- All components will use TypeScript for type safety
- Responsive design (mobile-first)
- Accessibility: WCAG AA compliance
- Testing: Unit tests for reusable components only (per constitution)
