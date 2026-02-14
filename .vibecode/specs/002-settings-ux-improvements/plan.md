# Technical Implementation Plan: Settings UX Improvements (Feature 002)

## Context

**Why this change:** The settings form currently has usability limitations:
- Users can only select one cuisine type (single-select), preventing expression of diverse preferences (e.g., "I like Italian AND Japanese")
- Dietary restrictions don't distinguish between hard restrictions (allergies) and soft preferences (dislikes)
- Number inputs for weight/height have broken decimal behavior (can only enter 1 digit before decimal)
- Snacks appear out of chronological order in meal plan output
- No formal design system, leading to ad-hoc styling decisions

**What prompted it:** User feedback document `/Users/adrienmuller/Documents/GitHub/meal-planner_V0/docs/notes/20260212-scope-for-002.md` identified these UX issues after testing feature 001.

**Intended outcome:**
- Users can select multiple cuisines with visual feedback (pills + flags)
- Clear separation between food preferences (soft) and allergies (hard)
- Fixed number inputs and proper meal ordering
- Documented design system for future consistency

---

## Overview

**Approach**: Prototype (per constitution - Neutral Work classification)
**Timeline**: 5-7 days
**Complexity**: Medium

---

## Tech Stack

**Framework**: Next.js 15 + React 19 (existing - no change)
**Styling**: Tailwind CSS v4.0 + DaisyUI v5.0.50 (existing - no change)
**State Management**: React hooks (useState) - reuse existing pattern
**Data Storage**: localStorage (existing - no change for MVP)
**Icons**:
- Country flags: Use Unicode emoji flags (no external library needed)
- Fallback: Generic emoji (🌍 globe) for multi-country cuisines
**Rationale**: Reuses 100% of existing tech stack. Emoji flags avoid new dependencies and work cross-platform.

---

## Architecture

### Data Model Changes

**Modified Types (lib/types.ts):**

```typescript
// BEFORE (Feature 001):
export interface CulturalContext {
  cuisine: string;              // Single cuisine
  location: string;
}

export interface UserSettings {
  // ... other fields
  cultural_context: CulturalContext;
  dietary_restrictions: string[];  // Mixed restrictions
}

export type Sex = 'male' | 'female' | 'other';  // Includes "other"

// AFTER (Feature 002):
export interface CulturalContext {
  cuisines: string[];           // ← Changed: array of cuisines
  location: string;
}

export interface FoodPreferences {  // ← New entity
  dislikes: string[];           // Soft preferences (e.g., "mushrooms")
}

export interface UserSettings {
  // ... other fields
  cultural_context: CulturalContext;
  food_preferences: FoodPreferences;  // ← New field
  dietary_restrictions: string[];     // Now only hard restrictions
}

export type Sex = 'male' | 'female';  // ← "other" removed
```

**Migration Strategy:**
- Existing settings with `cuisine: "Italian"` → convert to `cuisines: ["Italian"]` on read
- Existing settings with `sex: "other"` → prompt user to update on next settings load
- Existing `dietary_restrictions` → stays in restrictions, user can optionally move to preferences

---

### Component Architecture

#### New Components

**1. Design System Components (new files):**

```
app/components/design-system/
  ├── Pill.tsx              // Reusable pill/tag component
  ├── MultiSelectDropdown.tsx  // Reusable multi-select with checkboxes
  └── FlagIcon.tsx          // Flag emoji renderer
```

**2. Updated Settings Components:**

```
app/components/
  ├── CultureSelector.tsx   // Modified: multi-select + pills
  ├── RestrictionsInput.tsx // Split into PreferencesInput + RestrictionsInput
  ├── PreferencesInput.tsx  // New: free-text preferences with pills
  └── BiometricsInput.tsx   // Modified: remove "other" sex option
```

**Component Hierarchy:**

```
SettingsForm
  ├── GoalSelector (unchanged)
  ├── BiometricsInput (modified: remove "other" option)
  ├── CultureSelector (modified: multi-select + pills + flags)
  │   ├── MultiSelectDropdown (new reusable)
  │   └── Pill[] (new reusable) with FlagIcon
  ├── PreferencesInput (new: free-text + pills)
  │   └── Pill[] (new reusable)
  └── RestrictionsInput (modified: multi-select + pills)
      ├── MultiSelectDropdown (new reusable)
      └── Pill[] (new reusable)
```

---

### Design System Tokens

**Location**: `.vibecode/memory/design-system/tokens.md`

```markdown
# Design System Tokens

## Colors (DaisyUI theme-based)

- `primary-50`: Light background for pills (DaisyUI `bg-primary` with opacity-10)
- `primary-100`: Hover state (DaisyUI `bg-primary` with opacity-20)
- `primary-900`: Text color (DaisyUI `text-primary-content`)
- `base-content`: Default text
- `error`: Error state (DaisyUI `text-error`)

## Spacing

- 4px: Tight spacing (Tailwind: `space-x-1`, `space-y-1`)
- 8px: Standard gap between pills (Tailwind: `gap-2`)
- 12px: Internal padding (Tailwind: `p-3`)
- 16px: Section spacing (Tailwind: `space-y-4`)
- 24px: Card padding (Tailwind: `p-6`)

## Pills Pattern

- Background: `bg-primary bg-opacity-10`
- Text: `text-primary`
- Border: `border border-primary border-opacity-20`
- Padding: `px-3 py-1.5` (12px horizontal, 6px vertical)
- Border radius: `rounded-full`
- (x) button: `ml-2 text-sm hover:text-error cursor-pointer`
- Hover: `hover:bg-opacity-20`
- Spacing between pills: `gap-2` (8px)
- Wrapping: `flex-wrap`

## Multi-Select Dropdown

- Button: DaisyUI `select select-bordered`
- Options: Grid of checkboxes in dropdown
- Max height: `max-h-[300px] overflow-y-auto`
- Checkbox size: DaisyUI `checkbox checkbox-sm`
```

---

## Implementation Details

### Phase 1: Design System Foundation (P1) - 1 day

**Tasks:**
1. Create `Pill.tsx` component
   - Props: `text`, `icon?`, `onRemove`, `className?`
   - Styling: Uses tokens defined above
   - Accessibility: Keyboard navigation for (x) button

2. Create `MultiSelectDropdown.tsx` component
   - Props: `options`, `selected`, `onChange`, `placeholder`, `error?`
   - Behavior: Click to open, checkboxes for selection, click outside to close
   - Display: Shows "N selected" when closed

3. Create `FlagIcon.tsx` component
   - Props: `cuisine: string`
   - Logic: Maps cuisine to flag emoji(s)
   - Fallback: 🌍 for multi-country or unmapped

4. Document design system tokens
   - File: `.vibecode/memory/design-system/tokens.md`
   - Content: Colors, spacing, component patterns

**Files Modified:**
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/design-system/Pill.tsx` (new)
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/design-system/MultiSelectDropdown.tsx` (new)
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/design-system/FlagIcon.tsx` (new)
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/.vibecode/memory/design-system/tokens.md` (new)

**Dependencies:**
- None (uses existing DaisyUI + Tailwind)

---

### Phase 2: Multi-Select Cultural Cuisines (P2) - 2 days

**Tasks:**
1. Update `CulturalContext` type in `lib/types.ts`
   - Change `cuisine: string` to `cuisines: string[]`

2. Modify `CultureSelector.tsx`
   - Replace single-select dropdown with `MultiSelectDropdown`
   - Render selected cuisines as `Pill` components with `FlagIcon`
   - Handle pill removal (deselect in dropdown)
   - Add migration: if old settings have `cuisine`, convert to `cuisines: [cuisine]`

3. Create cuisine-to-flag mapping in `FlagIcon.tsx`
   - 15-20 cuisines with appropriate flag(s)
   - Example: Italian → 🇮🇹, Mediterranean → 🇬🇷🇮🇹🇹🇷, etc.

4. Update `SettingsForm.tsx` validation
   - Validate `cuisines` array (min 1 selection)
   - Update error messages

5. Update AI prompts in `lib/ai/prompts.ts`
   - Change from single cuisine to cuisines array
   - Example: "Italian, Mexican, Japanese" → AI considers all three

**Files Modified:**
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/types.ts`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/CultureSelector.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/design-system/FlagIcon.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/SettingsForm.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/ai/prompts.ts`

**Dependencies:**
- Phase 1 complete (Pill, MultiSelectDropdown, FlagIcon)

---

### Phase 3: Dietary Restrictions Reorganization (P3) - 2 days

**Tasks:**
1. Add `FoodPreferences` type to `lib/types.ts`
   ```typescript
   export interface FoodPreferences {
     dislikes: string[];
   }
   ```

2. Update `UserSettings` type
   - Add `food_preferences: FoodPreferences`
   - Keep `dietary_restrictions: string[]` (now only hard restrictions)

3. Create `PreferencesInput.tsx` component
   - Free-text input with "Add" button
   - Enter key triggers add
   - Display preferences as pills with remove button
   - 50 character limit with truncation + tooltip
   - Help text: "What foods or ingredients do you prefer to avoid?"

4. Modify `RestrictionsInput.tsx`
   - Remove "Kosher" and "Halal" from preset list (per requirements)
   - Convert checkboxes to `MultiSelectDropdown`
   - Display selected restrictions as pills
   - Help text: "Allergies and strict dietary requirements (AI will NEVER violate these)"

5. Update `SettingsForm.tsx`
   - Add `PreferencesInput` section above `RestrictionsInput`
   - Update form state and validation
   - Save both preferences and restrictions

6. Update AI prompts in `lib/ai/prompts.ts`
   - Distinguish between preferences (avoid when possible) and restrictions (NEVER violate)
   - Example prompt text:
     - "CRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED): Gluten-free, Dairy-free"
     - "Food Preferences (avoid when possible): mushrooms, cilantro"

**Files Modified:**
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/types.ts`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/PreferencesInput.tsx` (new)
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/RestrictionsInput.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/SettingsForm.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/ai/prompts.ts`

**Dependencies:**
- Phase 1 complete (Pill, MultiSelectDropdown)

---

### Phase 4: Input Fixes & UI Polish (P4) - 1 day

**Tasks:**

**4.1: Number Input Fixes (BiometricsInput.tsx)**
1. Change weight/height inputs from `type="number"` to `type="text"` with custom validation
2. Add `inputMode="numeric"` for mobile keyboards
3. Add onChange handler that strips non-numeric characters
4. Parse as integer on submit
5. Example:
   ```tsx
   const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value.replace(/[^\d]/g, ''); // Only digits
     setBiometrics({ ...biometrics, weight: parseInt(value) || 0 });
   };
   ```

**4.2: Remove "Other" Sex Option**
1. Modify `BiometricsInput.tsx` sex dropdown
2. Remove "other" from options (only "male" and "female")
3. Update `Sex` type in `lib/types.ts`: `type Sex = 'male' | 'female';`
4. Add migration: if existing settings have `sex: "other"`, show alert on load prompting update

**4.3: Snack Ordering Fix (MealPlanDisplay.tsx)**
1. Locate meal plan display component (likely `app/meal-plan/page.tsx` or `app/components/MealPlanDisplay.tsx`)
2. Add meal type ordering logic:
   ```typescript
   const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack'];
   const sortedMeals = meals.sort((a, b) =>
     mealOrder.indexOf(a.type) - mealOrder.indexOf(b.type)
   );
   ```
3. Render meals in sorted order

**4.4: Edit View Padding Fix**
1. Locate meal edit component (likely inline in meal card)
2. Add spacing between instruction label and input field
3. Add Tailwind class: `space-y-3` or `mb-3` on label

**Files Modified:**
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/BiometricsInput.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/types.ts`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/meal-plan/page.tsx` (or wherever meal display is)
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/components/MealCard.tsx` (or similar)

**Dependencies:**
- None (independent fixes)

---

### Phase 5: Infrastructure Improvements (P5) - 0.5 day

**Tasks:**

**5.1: Next.js Smooth Scroll Fix**
1. Open `app/layout.tsx`
2. Add `data-scroll-behavior="smooth"` attribute to `<html>` element
3. Example:
   ```tsx
   <html lang="en" data-scroll-behavior="smooth">
   ```

**5.2: Preload Resource Warning Fix**
1. Check `app/layout.tsx` for preload links
2. Either remove unused preloads or ensure they're used within load event
3. If using custom fonts, ensure `<link rel="preload">` has correct `as="font"` attribute

**5.3: AI Frequency Penalty**
1. Open `lib/ai/openrouter.ts`
2. Add `frequency_penalty: 0.4` to model options
3. Modify `callModel` function (around line 71):
   ```typescript
   const completion = await openrouter.chat.completions.create({
     model,
     messages,
     temperature: options?.temperature ?? 0.7,
     max_tokens: options?.max_tokens ?? 4000,
     top_p: options?.top_p ?? 1,
     frequency_penalty: 0.4,  // ← ADD THIS LINE
   });
   ```

**Files Modified:**
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/app/layout.tsx`
- `/Users/adrienmuller/Documents/GitHub/meal-planner_v0/lib/ai/openrouter.ts`

**Dependencies:**
- None (independent fixes)

---

## Technical Decisions

### Decision 1: Flag Implementation (Emoji vs Icon Library)

**Context**: Need to display country flags for cuisines

**Options Considered:**

**A) Unicode Emoji Flags**
- Pros: No dependencies, works cross-platform, 0 KB bundle size
- Cons: Limited styling control, may render differently across OS

**B) Icon Library (e.g., `flag-icons` npm package)**
- Pros: Consistent rendering, more styling control
- Cons: +50 KB bundle size, new dependency

**C) SVG Assets**
- Pros: Full control, crisp rendering
- Cons: Need to source/maintain 30+ flag SVGs

**Decision**: **Option A (Unicode Emoji)**

**Rationale**:
- Aligns with "Neutral Work" quality bar (good enough, don't over-engineer)
- Zero dependencies = faster implementation (0.5 days vs 1 day)
- Modern browsers render emoji flags well
- If styling becomes an issue, can upgrade to icon library later

---

### Decision 2: Multi-Select Implementation (Dropdown vs Modal)

**Context**: Need multi-select UI for cuisines and restrictions

**Options Considered:**

**A) Dropdown with Checkboxes**
- Pros: Standard pattern, inline with form, mobile-friendly
- Cons: Limited space for many options (need scroll)

**B) Modal with Search**
- Pros: More space, can add search filter
- Cons: Disrupts form flow, more complex, 2x implementation time

**Decision**: **Option A (Dropdown with Checkboxes)**

**Rationale**:
- Reuses existing form patterns (RestrictionsInput already uses checkboxes)
- Cuisines list is 15-20 items (manageable in dropdown)
- Restrictions list is 9 items after removing Kosher/Halal (fits easily)
- Can add search later if needed (progressive enhancement)

---

### Decision 3: Data Migration Strategy

**Context**: Changing `cuisine` (string) to `cuisines` (array) breaks existing localStorage data

**Options Considered:**

**A) Versioned Schema with Migration**
- Pros: Clean, handles all cases
- Cons: Over-engineered for MVP with 0 real users

**B) Backwards-Compatible Read**
- Pros: Simple, works for current dev testing
- Cons: Tech debt if we ship to real users

**C) Clear localStorage on Deploy**
- Pros: Simplest, no migration code
- Cons: Users lose settings (but we have 0 real users currently)

**Decision**: **Option B (Backwards-Compatible Read)**

**Rationale**:
- MVP has 0 real users, only dev testing
- Add simple check: `if (typeof cultural.cuisine === 'string')` → convert to array
- If we get real users before feature 003, add proper migration
- Avoids premature optimization

---

## Verification

### How to Test End-to-End

1. **Start dev server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/settings`
3. **Test multi-select cuisines**:
   - Open Cultural Preferences dropdown
   - Select Italian, Mexican, Japanese
   - Verify pills appear with flags: 🇮🇹 Italian, 🇲🇽 Mexican, 🇯🇵 Japanese
   - Click (x) on Mexican pill
   - Verify Mexican unchecked in dropdown and pill removed
4. **Test preferences**:
   - Type "mushrooms" in Preferences input, press Enter
   - Type "cilantro", press Enter
   - Verify both appear as pills
   - Click (x) on mushrooms pill
   - Verify pill removed
5. **Test restrictions**:
   - Open Dietary Restrictions dropdown
   - Select Gluten-free, Dairy-free
   - Verify pills appear (no flags for restrictions)
   - Verify Kosher and Halal are NOT in dropdown
6. **Test number inputs**:
   - Enter weight: 75 (should accept)
   - Try to enter 75.5 (should only accept 75)
   - Verify no decimal issues
7. **Test sex dropdown**:
   - Verify only "Male" and "Female" options (no "Other")
8. **Submit form** → Generate meal plan
9. **Verify meal plan**:
   - Check snacks appear in chronological order (breakfast → morning snack → lunch → afternoon snack → dinner)
   - Check AI used all 3 cuisines (Italian, Japanese)
   - Check AI avoided preferences (no mushrooms, no cilantro)
   - Check AI never violated restrictions (no gluten, no dairy)
10. **Check browser console**:
    - Verify 0 Next.js warnings
    - Verify 0 preload warnings

---

## Timeline Estimate

| Phase | Days | Can Parallelize? |
|-------|------|------------------|
| P1: Design System | 1.0 | No (foundation for others) |
| P2: Multi-Select Cuisines | 2.0 | No (depends on P1) |
| P3: Dietary Restrictions | 2.0 | Yes (parallel with P2 after P1) |
| P4: Input Fixes | 1.0 | Yes (independent) |
| P5: Infrastructure | 0.5 | Yes (independent) |
| **Total Sequential** | 6.5 days | |
| **Total with Parallelization** | 5.0 days | P3+P4+P5 can run parallel after P1+P2 |

**Recommended Approach**: Sequential (P1 → P2 → P3 → P4 → P5) for solo developer. Ensures each phase is tested before moving to next.
