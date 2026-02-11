# Implementation Tasks: AI Meal Plan Generator

**Feature ID**: 001-meal-plan-generator
**Created**: 2026-02-11
**Status**: Ready for Implementation
**Estimated Total Time**: 5-7 days

---

## Task Overview

**Total Tasks**: 35 core tasks + 5 optional (P3)
**Phases**: 4 (Setup, P1, P2, P3-optional)
**Parallelizable Tasks**: 12 tasks marked with [P]

---

## Phase 0: Environment Setup & Foundation (Day 0-1, ~4 hours)

### Setup Tasks

- [X] **T001**: Install dependencies
  - Command: `npm install openai uuid react-hook-form zod`
  - Files: `package.json`
  - Dependencies: None
  - Estimated: 15 min
  - [P] - Can run in parallel with T002

- [X] **T002**: Configure environment variables
  - Create: `.env.local`
  - Add: `OPENROUTER_API_KEY`, `TAVILY_API_KEY`
  - Get API keys from OpenRouter and Tavily
  - Dependencies: None
  - Estimated: 15 min
  - [P] - Can run in parallel with T001

- [X] **T003**: Create TypeScript type definitions
  - Create: `lib/types.ts`
  - Define: UserSettings, MealPlan, Meal, Ingredient, Macros interfaces
  - Reference: Spec data model section
  - Dependencies: None
  - Estimated: 30 min

- [X] **T004**: Create localStorage utilities
  - Create: `lib/storage.ts`
  - Functions: saveSettings, getSettings, saveMealPlan, getMealPlan, saveToHistory
  - Include error handling
  - Dependencies: T003 (needs types)
  - Estimated: 45 min

- [X] **T005**: Set up project structure
  - Create directories: `app/settings`, `app/generate`, `app/meal-plan`, `app/components`, `lib/ai`
  - Create placeholder files: `page.tsx` in each route
  - Dependencies: None
  - Estimated: 15 min
  - [P] - Can run in parallel with T003, T004

**Checkpoint**: Environment ready, types defined, localStorage utilities working

---

## Phase 1: User Story P1 - Health Profile Setup (Days 1-2)

### Part 1A: Settings Form UI Components

- [X] **T006**: Create GoalSelector component
  - Create: `app/components/GoalSelector.tsx`
  - Dropdown with 5 goals: muscle_building, weight_loss, gut_health, mental_performance, general_health
  - Use DaisyUI select component
  - Dependencies: T003, T005
  - Estimated: 45 min
  - [P] - Can run in parallel with T007-T009

- [X] **T007**: Create BiometricsInput component
  - Create: `app/components/BiometricsInput.tsx`
  - Inputs: weight, height, age, sex
  - Unit toggles: kg/lbs, cm/inches
  - Validation: age 13-120, reasonable weight/height ranges
  - Dependencies: T003, T005
  - Estimated: 1.5 hours
  - [P] - Can run in parallel with T006, T008, T009

- [X] **T008**: Create CultureSelector component
  - Create: `app/components/CultureSelector.tsx`
  - Dropdown: 20 common cuisines (Mediterranean, Italian, Mexican, Chinese, Japanese, Indian, Thai, Vietnamese, Middle Eastern, Greek, French, Spanish, Korean, Brazilian, Caribbean, American, British, German, Scandinavian, African)
  - "Other" option with text field
  - Location text input (country/region)
  - Dependencies: T003, T005
  - Estimated: 1 hour
  - [P] - Can run in parallel with T006, T007, T009

- [X] **T009**: Create RestrictionsInput component
  - Create: `app/components/RestrictionsInput.tsx`
  - Multi-select checkboxes: Vegetarian, Vegan, Gluten-free, Dairy-free, Nut allergy, Shellfish allergy, Pescatarian, Keto, Paleo, Halal, Kosher
  - Custom text input for "Other" restrictions
  - Dependencies: T003, T005
  - Estimated: 1 hour
  - [P] - Can run in parallel with T006-T008

### Part 1B: Settings Form Integration

- [X] **T010**: Create SettingsForm component
  - Create: `app/components/SettingsForm.tsx`
  - Integrate: GoalSelector, BiometricsInput, CultureSelector, RestrictionsInput
  - Use React Hook Form for validation
  - Handle form submission
  - Dependencies: T006, T007, T008, T009
  - Estimated: 1.5 hours

- [X] **T011**: Create settings page
  - Create: `app/settings/page.tsx`
  - Render SettingsForm
  - On submit: save to localStorage, navigate to /generate
  - Add DaisyUI card layout
  - Dependencies: T010, T004 (localStorage)
  - Estimated: 45 min

- [X] **T012**: Create landing page with CTA
  - Update: `app/page.tsx`
  - Simple hero: "Get Your Personalized Meal Plan"
  - CTA button: Navigate to /settings
  - Use DaisyUI hero component
  - Dependencies: T005
  - Estimated: 30 min
  - [P] - Can run in parallel with T010, T011

**Checkpoint**: Settings form complete, data saves to localStorage, user can navigate through flow

---

## Phase 2: User Story P1 - AI Meal Plan Generation (Days 3-4)

### Part 2A: AI Integration Setup

- [X] **T013**: Set up OpenRouter SDK wrapper
  - Create: `lib/ai/openrouter.ts`
  - Initialize OpenRouter client
  - Function: `callModel(model, messages, options)`
  - Error handling for rate limits, failures
  - Dependencies: T001 (openai npm package), T002 (API key)
  - Estimated: 1 hour

- [X] **T014**: Set up Tavily SDK wrapper
  - Create: `lib/ai/tavily.ts`
  - Function: `searchScientificEvidence(query, maxResults)`
  - Selective validation logic (detect uncertain phrases)
  - Dependencies: T002 (API key)
  - Estimated: 45 min
  - [P] - Can run in parallel with T013

- [X] **T015**: Build meal plan generation prompt
  - Create: `lib/ai/prompts.ts`
  - Function: `buildMealPlanPrompt(userSettings: UserSettings): string`
  - Include: user context, instructions, output format (JSON)
  - Emphasize dietary restrictions as HARD CONSTRAINTS
  - Reference: Plan's "Prompt Engineering" section
  - Dependencies: T003 (types)
  - Estimated: 1 hour

- [X] **T016**: Build meal regeneration prompt
  - Update: `lib/ai/prompts.ts`
  - Function: `buildMealEditPrompt(meal: Meal, userInstruction: string, userSettings: UserSettings): string`
  - Maintain goal and restrictions, apply user edit
  - Dependencies: T015 (same file)
  - Estimated: 45 min

### Part 2B: Meal Generation API

- [X] **T017**: Create meal plan generation API route
  - Create: `app/api/generate-meal-plan/route.ts`
  - Accept: userSettings, options (includeSnacks, validateWithTavily)
  - Call OpenRouter with Gemini Flash
  - Parse JSON response
  - Calculate daily totals
  - Validate restrictions honored (post-processing)
  - Selective Tavily validation for uncertain claims
  - Return: MealPlan object
  - Error handling: rate limits (429), generation failures (500)
  - Dependencies: T013, T014, T015, T003
  - Estimated: 2.5 hours

- [X] **T018**: Test API route with sample data
  - Manual test: POST to /api/generate-meal-plan with sample userSettings
  - Verify: 3 meals generated, macros calculated, restrictions honored
  - Test error cases: rate limit, malformed input
  - Dependencies: T017
  - Estimated: 30 min

### Part 2C: Meal Display Components

- [X] **T019**: Create MacroDisplay component
  - Create: `app/components/MacroDisplay.tsx`
  - Display: Calories, Protein (g), Carbs (g), Fats (g)
  - Size variants: small, medium, large
  - Reusable component → Add to registry
  - Dependencies: T003, T005
  - Estimated: 45 min
  - [P] - Can run in parallel with T020, T021

- [X] **T020**: Create MealCard component
  - Create: `app/components/MealCard.tsx`
  - Display: meal name, ingredients, preparation, macros (use MacroDisplay), reasoning
  - Collapsible ingredients list
  - Edit button/icon (not functional yet)
  - Use DaisyUI card
  - Dependencies: T003, T019, T005
  - Estimated: 1.5 hours
  - [P] - Can run in parallel with T021

- [X] **T021**: Create DailyTotals component
  - Create: `app/components/DailyTotals.tsx`
  - Display: total calories, total P/C/F
  - Use MacroDisplay component
  - Dependencies: T003, T019, T005
  - Estimated: 30 min
  - [P] - Can run in parallel with T020

- [X] **T022**: Create MealPlanView component
  - Create: `app/components/MealPlanView.tsx`
  - Container for 3-6 MealCard components
  - Display DailyTotals at bottom
  - Handle onEditMeal callback (pass to parent)
  - Dependencies: T020, T021
  - Estimated: 1 hour

### Part 2D: Generation Flow Pages

- [X] **T023**: Create GenerationLoader component
  - Create: `app/components/GenerationLoader.tsx`
  - Progress indicator with stages: "Analyzing profile...", "Generating meals...", "Validating..."
  - Spinner or progress bar
  - Dependencies: T005
  - Estimated: 45 min
  - [P] - Can run in parallel with T024

- [X] **T024**: Create ErrorDisplay component
  - Create: `app/components/ErrorDisplay.tsx`
  - Handle error types: rate_limit, generation_failed, network_error
  - Show user-friendly messages + retry button
  - Dependencies: T005
  - Estimated: 30 min
  - [P] - Can run in parallel with T023

- [X] **T025**: Create generation page
  - Create: `app/generate/page.tsx`
  - On mount: read userSettings from localStorage
  - Call /api/generate-meal-plan
  - Show GenerationLoader while loading
  - On success: save mealPlan to localStorage, navigate to /meal-plan
  - On error: show ErrorDisplay with retry
  - Dependencies: T017, T023, T024, T004
  - Estimated: 1.5 hours

- [X] **T026**: Create meal plan display page
  - Create: `app/meal-plan/page.tsx`
  - On mount: read mealPlan from localStorage
  - Render MealPlanView
  - Handle edit button clicks (prepare for Phase 3)
  - Dependencies: T022, T004
  - Estimated: 1 hour

**Checkpoint**: User can generate meal plan, see 3 meals with macros + reasoning, daily totals displayed

---

## Phase 3: User Story P2 - Per-Meal Editing (Days 5-6)

### Part 3A: Meal Regeneration API

- [X] **T027**: Create meal regeneration API route
  - Create: `app/api/regenerate-meal/route.ts`
  - Accept: mealPlan, mealId, userInstruction, userSettings
  - Build edit prompt with T016
  - Call OpenRouter to regenerate ONLY that meal
  - Recalculate daily totals
  - Return: updatedMeal, updatedDailyTotals
  - Dependencies: T013, T016, T003
  - Estimated: 1.5 hours

- [X] **T028**: Test regeneration API
  - Manual test: POST to /api/regenerate-meal with sample meal + instruction
  - Verify: Only specified meal regenerated, totals updated
  - Dependencies: T027
  - Estimated: 30 min

### Part 3B: Edit UI Components

- [X] **T029**: Create MealEditModal component
  - Create: `app/components/MealEditModal.tsx`
  - Expandable text input for user instruction
  - Placeholder text: "e.g., 'Make it vegetarian', 'No dairy', 'Make it spicy'"
  - Submit button (use RegenerateButton)
  - Cancel option
  - Loading state during regeneration
  - Dependencies: T003, T005
  - Estimated: 1.5 hours

- [X] **T030**: Create RegenerateButton component
  - Create: `app/components/RegenerateButton.tsx`
  - States: default ("Regenerate Meal"), loading ("Generating..." with spinner), disabled
  - Use DaisyUI button with loading class
  - Dependencies: T005
  - Estimated: 30 min
  - [P] - Can run in parallel with T029

### Part 3C: Integrate Editing into Meal Plan

- [X] **T031**: Update MealCard with edit functionality
  - Update: `app/components/MealCard.tsx`
  - Add isEditing, isRegenerating props
  - Render MealEditModal when isEditing=true
  - Show loading state when isRegenerating=true
  - Dependencies: T020, T029, T030
  - Estimated: 1 hour

- [X] **T032**: Update MealPlanView to handle editing
  - Update: `app/components/MealPlanView.tsx`
  - Track editingMealId state
  - Pass edit handlers to MealCard components
  - Dependencies: T022, T031
  - Estimated: 45 min

- [X] **T033**: Update meal plan page with regeneration logic
  - Update: `app/meal-plan/page.tsx`
  - Handle edit submit: call /api/regenerate-meal
  - Update specific meal in mealPlan state
  - Update daily totals
  - Save updated mealPlan to localStorage
  - Handle errors
  - Dependencies: T026, T027, T032
  - Estimated: 1.5 hours

- [X] **T034**: Add edit history tracking
  - Update: `lib/types.ts` - add edit_history to Meal type
  - Update: `/api/regenerate-meal` - append to edit_history
  - Update: `MealCard` - show edit count badge (optional UI)
  - Dependencies: T003, T027, T031
  - Estimated: 45 min

**Checkpoint**: User can edit individual meals, only edited meal regenerates, daily totals update

---

## Phase 4: User Story P3 - Optional Snacks (Day 7, OPTIONAL)

### Part 4A: Snack Generation Logic

- [X] **T035**: Add snack generation to meal plan API
  - Update: `app/api/generate-meal-plan/route.ts`
  - Support includeSnacks option
  - Prompt: generate snacks based on macro gaps
  - Dependencies: T017, T015
  - Estimated: 1 hour

- [X] **T036**: Create SnackSelector component
  - Create: `app/components/SnackSelector.tsx`
  - Buttons: "Add Morning Snack", "Add Afternoon Snack", "Add Evening Snack"
  - Trigger snack generation
  - Dependencies: T005
  - Estimated: 45 min

- [X] **T037**: Update MealPlanView to support snacks
  - Update: `app/components/MealPlanView.tsx`
  - Display snack cards (use MealCard)
  - Show SnackSelector
  - Dependencies: T022, T036
  - Estimated: 1 hour

- [X] **T038**: Add "Add Snack" functionality
  - Update: `app/meal-plan/page.tsx`
  - Handle snack addition: call API with includeSnacks
  - Insert snack into mealPlan
  - Save to localStorage
  - Dependencies: T026, T035, T037
  - Estimated: 1 hour

- [X] **T039**: Support snack editing
  - Verify: snacks can be edited same as meals (should work with existing edit flow)
  - Test: edit snack, verify regeneration works
  - Dependencies: T033, T038
  - Estimated: 30 min

**Checkpoint**: User can add snacks, snacks fill macro gaps, snacks editable

---

## Phase 5: Polish & Testing (Day 8, as needed)

### Critical Path Testing

- [ ] **T040**: Test dietary restrictions enforcement
  - Test: Generate 10 plans with different restrictions (vegetarian, gluten-free, etc.)
  - Verify: ZERO violations (critical)
  - Manual review of ingredients
  - Dependencies: All Phase 2 tasks complete
  - Estimated: 1 hour

- [ ] **T041**: Test cultural cuisine reflection
  - Test: Generate 5 plans with different cuisines (Japanese, Mediterranean, Mexican, etc.)
  - Verify: Meals use appropriate ingredients
  - Dependencies: All Phase 2 tasks complete
  - Estimated: 30 min

- [ ] **T042**: Test macro calculation accuracy
  - Test: Verify daily totals = sum of individual meals
  - Test: Multiple meal edits update totals correctly
  - Dependencies: T033
  - Estimated: 30 min

- [ ] **T043**: Test error handling
  - Test: Simulate rate limit (hit Gemini 15 RPM limit)
  - Test: Invalid user input
  - Test: Network failures
  - Verify: Error messages clear, retry works
  - Dependencies: T025, T033
  - Estimated: 45 min

### Mobile Responsiveness

- [ ] **T044**: Test mobile layout
  - Test: Settings form, meal plan view on mobile screen sizes
  - Verify: Readable, usable, no horizontal scroll
  - Fix: Any layout issues
  - Dependencies: T011, T026
  - Estimated: 1 hour

### Performance Optimization (if needed)

- [ ] **T045**: Optimize generation speed
  - If generation >30 seconds: investigate bottlenecks
  - Consider: Make Tavily async (generate plan, add sources after)
  - Dependencies: T025
  - Estimated: 1-2 hours (only if needed)

---

## Task Dependencies Visualization

```
Setup Phase (T001-T005)
    ↓
Phase 1A (T006-T009) [parallel components]
    ↓
Phase 1B (T010-T012) [form integration]
    ↓
Phase 2A (T013-T016) [AI setup]
    ↓
Phase 2B (T017-T018) [API]
    ↓ (parallel)
Phase 2C (T019-T022) [display components, can start before API done]
    ↓
Phase 2D (T023-T026) [generation flow]
    ↓
Phase 3A (T027-T028) [regeneration API]
    ↓ (parallel)
Phase 3B (T029-T030) [edit UI components]
    ↓
Phase 3C (T031-T034) [integrate editing]
    ↓
Phase 4 (T035-T039) [snacks - OPTIONAL]
    ↓
Phase 5 (T040-T045) [testing & polish]
```

---

## Parallelization Opportunities

**Can work on simultaneously**:
- T001, T002, T003, T005 (setup tasks)
- T006, T007, T008, T009 (form components)
- T012 can start while T010-T011 in progress
- T013, T014 (AI SDK wrappers)
- T019, T020, T021 (display components while API is being built)
- T023, T024 (loading/error components)
- T029, T030 (edit UI components)

**Estimated time savings with parallel work**: 1-2 days

---

## Risk Mitigation Tasks

### High Priority Risks

**Risk: AI violates dietary restrictions**
- Mitigation: T040 (dietary restriction testing)
- Fallback: Add post-processing validation layer (T017 includes basic check)

**Risk: Gemini rate limits during development**
- Mitigation: T018 includes rate limit testing
- Fallback: Implement request queue (add to T013 if needed)

**Risk: Generation too slow (>30s)**
- Mitigation: T045 (optimization)
- Fallback: Make Tavily async, show "sources loading..." after meal plan displays

---

## Component Registry Updates

**New components created**:
- GoalSelector (T006)
- BiometricsInput (T007)
- CultureSelector (T008)
- RestrictionsInput (T009)
- SettingsForm (T010)
- MacroDisplay (T019) - HIGH REUSABILITY
- MealCard (T020) - HIGH REUSABILITY
- DailyTotals (T021)
- MealPlanView (T022)
- GenerationLoader (T023) - HIGH REUSABILITY
- ErrorDisplay (T024) - HIGH REUSABILITY
- MealEditModal (T029)
- RegenerateButton (T030)
- SnackSelector (T036 - optional)

**To add to registry after implementation**: T019, T020, T023, T024

---

## Next Steps

1. **Review task list** - Ensure all tasks are clear and actionable
2. **Set up environment** - Complete Phase 0 (T001-T005)
3. **Start Phase 1** - Begin with T006 (GoalSelector) or work on multiple form components in parallel
4. **Run `/vibecode:implement`** - Execute tasks with AI assistance

---

## Estimated Timeline

**Minimum (P1+P2 only)**: 5-6 days
- Setup: 4 hours
- Phase 1: 1.5 days
- Phase 2: 2 days
- Phase 3: 2 days
- Testing: 0.5 day

**Full (P1+P2+P3)**: 7-8 days
- Add Phase 4: 1 day
- Add Polish: 1 day

**Realistic with buffer**: 8-10 days

---

**End of Task Breakdown**
