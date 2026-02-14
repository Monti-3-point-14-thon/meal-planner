# Implementation Tasks: Settings UX Improvements (Feature 002)

**Feature**: 002-settings-ux-improvements
**Total Estimated Time**: 5-7 days
**Total Tasks**: 28 tasks across 5 phases

---

## Phase 1: Design System Foundation (P1) - 1 day

**User Story**: Define and document minimal design system for pills/tags pattern and multi-select interactions

### Setup Tasks

- [ ] **T001**: Create design-system directory
  - Files: `app/components/design-system/` (new directory)
  - Dependencies: None
  - Estimated: 5 minutes

- [ ] **T002**: Create design system tokens documentation
  - Files: `.vibecode/memory/design-system/tokens.md` (new)
  - Content: Colors (primary-50, primary-100, primary-900), spacing (4px, 8px, 12px, 16px, 24px), pills pattern specs, multi-select specs
  - Dependencies: T001
  - Estimated: 30 minutes

### Core Implementation

- [ ] **T003**: Create Pill component
  - Files: `app/components/design-system/Pill.tsx` (new)
  - Props: `{ text: string, icon?: ReactNode, onRemove: () => void, className?: string }`
  - Styling: Uses DaisyUI + Tailwind (`bg-primary bg-opacity-10`, `text-primary`, `rounded-full`, `px-3 py-1.5`)
  - Accessibility: Keyboard navigation (Tab to (x), Enter/Space to remove), ARIA label "Remove [text]"
  - Dependencies: T002
  - Estimated: 2 hours

- [ ] **T004**: Create FlagIcon component
  - Files: `app/components/design-system/FlagIcon.tsx` (new)
  - Props: `{ cuisine: string }`
  - Logic: Map cuisine name to emoji flag(s) - Italian→🇮🇹, Mediterranean→🇬🇷🇮🇹🇹🇷, etc.
  - Fallback: 🌍 for unmapped cuisines
  - Dependencies: T002
  - Estimated: 1 hour
  - [P] Can run in parallel with T003

- [ ] **T005**: Create MultiSelectDropdown component
  - Files: `app/components/design-system/MultiSelectDropdown.tsx` (new)
  - Props: `{ options: {value, label}[], selected: string[], onChange: (selected) => void, placeholder?: string, error?: string }`
  - Behavior: Click to toggle, checkboxes, click-outside to close, Escape key to close
  - Display: Shows "N selected" when closed, scrollable list (max-height 300px)
  - Accessibility: Keyboard navigation (Tab, Space/Enter, Arrow keys), ARIA multiselectable
  - Dependencies: T002
  - Estimated: 3 hours

### Testing

- [ ] **T006**: Test Phase 1 components
  - Test Pill: renders with/without icon, (x) button works, keyboard navigation works, hover states
  - Test FlagIcon: maps all 15-20 cuisines correctly, shows fallback for unmapped
  - Test MultiSelectDropdown: opens/closes, checkboxes select/deselect, shows "N selected", keyboard navigation
  - Dependencies: T003, T004, T005 complete
  - **Checkpoint**: All 3 design system components work independently
  - Estimated: 1 hour

---

## Phase 2: Multi-Select Cultural Cuisines (P2) - 2 days

**User Story**: Users can select multiple cuisines and see them as pills with country flags

### Data Model Updates

- [ ] **T007**: Update CulturalContext type in types.ts
  - Files: `lib/types.ts`
  - Change: `cuisine: string` → `cuisines: string[]`
  - Dependencies: Phase 1 complete
  - Estimated: 10 minutes

### Component Updates

- [ ] **T008**: Add cuisine-to-flag mapping in FlagIcon
  - Files: `app/components/design-system/FlagIcon.tsx`
  - Add mapping for 15-20 cuisines: Italian🇮🇹, Mexican🇲🇽, Japanese🇯🇵, Chinese🇨🇳, Indian🇮🇳, Mediterranean🇬🇷🇮🇹🇹🇷, American🇺🇸, French🇫🇷, Thai🇹🇭, Vietnamese🇻🇳, Korean🇰🇷, Middle Eastern🇱🇧🇸🇦🇦🇪, Caribbean🇯🇲🇨🇺🇵🇷, African🌍, Latin American🇲🇽🇧🇷🇦🇷, Other🌍
  - Dependencies: T007
  - Estimated: 30 minutes

- [ ] **T009**: Refactor CultureSelector to use MultiSelectDropdown
  - Files: `app/components/CultureSelector.tsx`
  - Changes:
    1. Replace `<select>` with `<MultiSelectDropdown>`
    2. Update state: `cuisine: string` → `cuisines: string[]`
    3. Render selected cuisines as Pill[] with FlagIcon
    4. Handle pill removal (deselect in dropdown)
    5. Update props interface to accept/emit `cuisines` array
  - Dependencies: T008
  - Estimated: 3 hours

- [ ] **T010**: Add backwards-compatible data migration in CultureSelector
  - Files: `app/components/CultureSelector.tsx`
  - Logic: `if (typeof value.cuisine === 'string') { value.cuisines = [value.cuisine] }`
  - Display warning if old format detected
  - Dependencies: T009
  - Estimated: 30 minutes

### Form Integration

- [ ] **T011**: Update SettingsForm validation for cuisines
  - Files: `app/components/SettingsForm.tsx`
  - Validation: `cuisines.length >= 1` (at least one cuisine required)
  - Error message: "Please select at least one cuisine preference"
  - Update form state management to handle array
  - Dependencies: T010
  - Estimated: 1 hour

- [ ] **T012**: Update localStorage migration in storage.ts
  - Files: `lib/storage.ts`
  - Add migration in `getSettings()`: convert old `cuisine` string to `cuisines` array
  - Logic: Check if `cuisine` exists, convert to `[cuisine]`, delete old field
  - Add `food_preferences: { dislikes: [] }` if missing
  - Dependencies: T011
  - Estimated: 30 minutes

### AI Integration

- [ ] **T013**: Update AI prompts to use cuisines array
  - Files: `lib/ai/prompts.ts`
  - Update `buildMealPlanPrompt()`: change from single cuisine to cuisines list
  - Prompt text: "Cultural Preference: Italian, Mexican, Japanese cuisine" (join array)
  - Update `buildMealEditPrompt()` similarly
  - Dependencies: T007
  - Estimated: 30 minutes
  - [P] Can run in parallel with T009-T012

### Testing

- [ ] **T014**: Test Phase 2 multi-select cuisines
  - Test dropdown: opens, shows all 15-20 options, checkboxes work
  - Test pills: appear with correct flags, wrap to multiple rows if >5 selected
  - Test removal: clicking (x) removes pill and unchecks dropdown
  - Test validation: error if no cuisines selected
  - Test migration: old single cuisine converts to array
  - Test AI: verify all selected cuisines in prompt
  - Dependencies: T007-T013 complete
  - **Checkpoint**: Can select multiple cuisines, persist, and AI uses them
  - Estimated: 1.5 hours

---

## Phase 3: Dietary Restrictions Reorganization (P3) - 2 days

**User Story**: Separate food preferences (soft) from allergies/restrictions (hard), both use pills

### Data Model Updates

- [ ] **T015**: Add FoodPreferences type and update UserSettings
  - Files: `lib/types.ts`
  - Add: `interface FoodPreferences { dislikes: string[] }`
  - Update UserSettings: add `food_preferences: FoodPreferences`
  - `dietary_restrictions` now only hard restrictions (no change to type, just semantic)
  - Dependencies: Phase 1 complete
  - Estimated: 15 minutes

### New Component

- [ ] **T016**: Create PreferencesInput component
  - Files: `app/components/PreferencesInput.tsx` (new)
  - UI: Text input + "Add" button + Enter key handler
  - Display: Preferences as Pill[] (no icons)
  - Features: 50 char limit with truncation ("...") + tooltip for full text, prevent duplicates
  - Help text: "What foods or ingredients do you prefer to avoid? (AI will avoid when possible)"
  - Props: `{ value: string[], onChange: (value: string[]) => void, errors?: string }`
  - Dependencies: T015, Phase 1 (Pill component)
  - Estimated: 2.5 hours

### Component Updates

- [ ] **T017**: Refactor RestrictionsInput to use MultiSelectDropdown + Pills
  - Files: `app/components/RestrictionsInput.tsx`
  - Changes:
    1. Remove "Kosher" and "Halal" from preset list (now 9 options)
    2. Replace checkbox grid with `MultiSelectDropdown`
    3. Display selected restrictions as Pill[] (no icons)
    4. Remove custom text input (no longer needed)
  - Help text: "Allergies and strict dietary requirements (AI will NEVER violate these)"
  - Dependencies: T015, Phase 1 (Pill, MultiSelectDropdown)
  - Estimated: 2 hours
  - [P] Can run in parallel with T016

### Form Integration

- [ ] **T018**: Add PreferencesInput to SettingsForm
  - Files: `app/components/SettingsForm.tsx`
  - Add state: `const [preferences, setPreferences] = useState<string[]>([])`
  - Insert PreferencesInput component above RestrictionsInput in form
  - Update form submission to save `food_preferences: { dislikes: preferences }`
  - Validation: Optional (not required)
  - Dependencies: T016, T017
  - Estimated: 1 hour

### AI Integration

- [ ] **T019**: Update AI prompts to distinguish preferences vs restrictions
  - Files: `lib/ai/prompts.ts`
  - Update `buildMealPlanPrompt()`:
    - Add section: "Food Preferences (avoid when possible): mushrooms, cilantro"
    - Update existing: "CRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED): Gluten-free, Dairy-free"
  - Ensure clear distinction in prompt language (soft vs hard)
  - Dependencies: T015
  - Estimated: 45 minutes
  - [P] Can run in parallel with T016-T018

### Testing

- [ ] **T020**: Test Phase 3 preferences and restrictions
  - Test PreferencesInput: add preferences, displays as pills, removes on (x), enforces 50 char limit, shows tooltip
  - Test RestrictionsInput: dropdown has only 9 options (no Kosher/Halal), pills display correctly
  - Test form: both sections save correctly, validation works
  - Test AI: verify preferences in "avoid when possible" section, restrictions in "MUST BE FOLLOWED" section
  - Dependencies: T015-T019 complete
  - **Checkpoint**: Can set preferences and restrictions separately, AI treats them differently
  - Estimated: 1.5 hours

---

## Phase 4: Input Fixes & UI Polish (P4) - 1 day

**User Story**: Fix broken number inputs, snack ordering, biometrics "other" option, and edit view padding

### Number Input Fixes

- [ ] **T021**: Fix weight/height inputs in BiometricsInput
  - Files: `app/components/BiometricsInput.tsx`
  - Changes:
    1. Change inputs from `type="number"` to `type="text"` with `inputMode="numeric"`
    2. Add onChange handler: `value.replace(/[^\d]/g, '')` (strip non-digits)
    3. Parse as integer on form submit
    4. Keep unit toggle (kg/lbs, cm/in) functionality unchanged
  - Dependencies: None (independent)
  - Estimated: 1 hour

### Sex Dropdown Fix

- [ ] **T022**: Remove "other" sex option from BiometricsInput
  - Files: `app/components/BiometricsInput.tsx`, `lib/types.ts`
  - Changes:
    1. Remove "other" from sex dropdown (only "male" and "female")
    2. Update `Sex` type: `type Sex = 'male' | 'female'` (remove `| 'other'`)
    3. Add migration alert: if existing settings have `sex: "other"`, show alert on component mount prompting user to select male or female
  - Dependencies: None (independent)
  - Estimated: 45 minutes
  - [P] Can run in parallel with T021

### Meal Plan Display Fixes

- [ ] **T023**: Fix snack ordering in meal plan display
  - Files: `app/meal-plan/page.tsx` or meal display component
  - Logic:
    ```typescript
    const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack'];
    const sortedMeals = meals.sort((a, b) => mealOrder.indexOf(a.type) - mealOrder.indexOf(b.type));
    ```
  - Render `sortedMeals` instead of `meals`
  - Dependencies: None (independent)
  - Estimated: 30 minutes
  - [P] Can run in parallel with T021-T022

- [ ] **T024**: Add padding in edit view between label and input
  - Files: Find meal edit component (likely in meal card or meal display)
  - Change: Add Tailwind class `space-y-3` or `mb-3` to label element
  - Verify: 12px+ spacing between "Edit instructions" label and text input field
  - Dependencies: None (independent)
  - Estimated: 15 minutes
  - [P] Can run in parallel with T021-T023

### Testing

- [ ] **T025**: Test Phase 4 fixes
  - Test number inputs: can enter integers only (75), cannot enter decimals (75.5 becomes 75), up/down arrows work
  - Test sex dropdown: only shows "male" and "female", no "other"
  - Test migration: if old settings have `sex: "other"`, alert appears prompting update
  - Test snack ordering: breakfast → morning snack → lunch → afternoon snack → dinner (chronological)
  - Test edit padding: visual spacing between label and input is sufficient
  - Dependencies: T021-T024 complete
  - **Checkpoint**: All input bugs fixed, UX polish complete
  - Estimated: 45 minutes

---

## Phase 5: Infrastructure Improvements (P5) - 0.5 day

**User Story**: Fix Next.js warnings and add AI frequency_penalty for ingredient variety

### Next.js Warnings

- [ ] **T026**: Fix Next.js smooth scroll warning
  - Files: `app/layout.tsx`
  - Change: Add `data-scroll-behavior="smooth"` attribute to `<html>` element
  - Verify: Browser console shows no smooth scroll warning
  - Dependencies: None (independent)
  - Estimated: 10 minutes

- [ ] **T027**: Fix preload resource warning
  - Files: `app/layout.tsx`
  - Check for unused preload links
  - Either remove unused preloads OR ensure correct `as` attribute (e.g., `as="font"`)
  - Verify: Browser console shows no preload warnings
  - Dependencies: None (independent)
  - Estimated: 20 minutes
  - [P] Can run in parallel with T026

### AI Configuration

- [ ] **T028**: Add frequency_penalty to AI model
  - Files: `lib/ai/openrouter.ts`
  - Change: In `callModel()` function, add `frequency_penalty: 0.4` to `openrouter.chat.completions.create()` options
  - Location: Around line 71, add line after `top_p: options?.top_p ?? 1,`
  - Purpose: Reduce repetition of same ingredients across meals (more variety)
  - Trade-off: May slightly reduce coherence, but improves diversity
  - Dependencies: None (independent)
  - Estimated: 10 minutes
  - [P] Can run in parallel with T026-T027

---

## Final Testing & Verification

- [ ] **T029**: End-to-end feature test (Manual)
  - Complete full user flow:
    1. Navigate to `/settings`
    2. Select multiple cuisines (Italian, Mexican, Japanese) → verify pills with flags
    3. Add food preferences (mushrooms, cilantro) → verify pills
    4. Select restrictions (Gluten-free, Dairy-free) → verify pills
    5. Enter weight 75 (not 75.5) → verify accepts integer only
    6. Select sex (only male/female options) → verify no "other"
    7. Submit form → generate meal plan
    8. Verify AI used all 3 cuisines
    9. Verify AI avoided preferences (no mushrooms/cilantro)
    10. Verify AI never violated restrictions (no gluten/dairy)
    11. Verify snacks in chronological order
    12. Verify edit view has proper padding
    13. Verify browser console has 0 warnings
  - Dependencies: All T001-T028 complete
  - **Final Checkpoint**: Feature 002 works end-to-end
  - Estimated: 30 minutes

---

## Task Summary

| Phase | Tasks | Estimated Time | Can Parallelize? |
|-------|-------|----------------|------------------|
| P1: Design System | T001-T006 | 1 day | T003, T004 can run parallel |
| P2: Multi-Select Cuisines | T007-T014 | 2 days | T013 can run parallel with T009-T012 |
| P3: Dietary Restrictions | T015-T020 | 2 days | T016, T017 parallel; T019 parallel |
| P4: Input Fixes | T021-T025 | 1 day | T021-T024 all parallel |
| P5: Infrastructure | T026-T028 | 0.5 day | T026-T028 all parallel |
| Final Testing | T029 | 0.5 hour | - |
| **Total** | **29 tasks** | **6.5 days** | **5 days with parallelization** |

## Dependency Graph

```
P1: T001 → T002 → T003, T004, T005 → T006
                    ↓
P2: T007 → T008 → T009 → T010 → T011 → T012 → T014
              ↓
            T013 ────────────────────────────────┘

P3: T015 → T016, T017, T019 → T018 → T020

P4: T021, T022, T023, T024 (all parallel) → T025

P5: T026, T027, T028 (all parallel)

Final: T029 (depends on all phases complete)
```

## Notes

- **[P]** marks tasks that can run in parallel with others
- Each phase has a **Checkpoint** testing task to verify independent functionality
- **T029** is the final end-to-end test before feature completion
- Solo developer recommended approach: Sequential (P1 → P2 → P3 → P4 → P5)
- Parallelization can reduce timeline from 6.5 days to 5 days
