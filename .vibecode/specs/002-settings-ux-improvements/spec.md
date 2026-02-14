# Feature Specification: Settings UX Improvements

**Feature Branch**: `002-settings-ux-improvements`
**Created**: 2026-02-12
**Status**: Draft

## Overview

Enhance the settings form UX by introducing multi-select interactions with visual feedback (pills/tags pattern), reorganizing dietary restrictions, fixing broken input behaviors, and formalizing a minimal design system for consistency.

**Core Job**: Users can configure their meal preferences more intuitively with multi-select dropdowns, visual pill indicators, and properly functioning input fields.

## User Scenarios & Testing (PRIORITIZED)

### User Story 1 - Design System Foundation (Priority: P1)

Define and document a minimal design system that establishes the visual language for multi-select interactions, pills/tags pattern, colors, and spacing.

**Why this priority**: This is foundational work. All subsequent UX improvements (P2-P4) depend on these patterns being defined first. Without this, we'd be designing ad-hoc.

**Independent Test**: Design system tokens (colors, spacing, typography) are documented and a pills/tags component exists with consistent styling.

**Acceptance Scenarios**:
1. **Given** design system needs formalization, **When** reviewing existing colors and UI patterns, **Then** core tokens (primary/secondary colors, spacing scale, typography) are documented in `.vibecode/memory/design-system/tokens.md`
2. **Given** multi-select + pills pattern is needed across multiple features, **When** designing the component, **Then** a reusable Pills/Tags component exists with consistent styling (background, text color, (x) button, hover states)
3. **Given** multi-select dropdowns will be used in multiple places, **When** defining the pattern, **Then** dropdown multi-select behavior and styling is documented with clear interaction states (open, closed, selected)

---

### User Story 2 - Multi-Select Cultural Cuisines (Priority: P2)

Users can select multiple cuisine types (not just one) and see their selections as removable pills with country flag icons.

**Why this priority**: This is the first visible implementation of the new patterns from P1. It directly improves user experience by allowing more nuanced preferences (e.g., "I like both Italian and Mexican food").

**Independent Test**: User can select multiple cuisines, see them as pills with flags, remove individual selections, and have all selections persist when generating meal plan.

**Acceptance Scenarios**:
1. **Given** user is on settings form, **When** they click the "Cultural Preferences" dropdown, **Then** dropdown opens with multi-select checkboxes for all cuisine options
2. **Given** user has selected 0 cuisines, **When** they select "Italian", **Then** a pill appears below the dropdown with "Italian" text, Italian flag icon, and (x) button
3. **Given** user has selected "Italian" and "Mexican", **When** they select "Japanese", **Then** a third pill appears with Japanese flag, and all three pills are displayed in a row with proper spacing
4. **Given** user has selected multiple cuisines, **When** they click the (x) on one pill, **Then** that pill is removed and the cuisine is deselected in the dropdown (checkbox unchecked)
5. **Given** user has selected "Italian, Mexican, Japanese", **When** they generate a meal plan, **Then** all three cuisines are used to inform AI recommendations

**Edge Cases**:
- What happens when user selects 10+ cuisines? (Should pills wrap to multiple rows)
- What if user removes all selections? (Dropdown should show placeholder text)
- What flags to use for "Mediterranean" or "American" cuisine? (May require multiple flags or generic icon)

---

### User Story 3 - Dietary Restrictions Reorganization (Priority: P3)

Reorganize dietary restrictions section into two parts: (1) Preferences (free text for foods user dislikes) and (2) Allergies/Restrictions (multi-select with pills).

**Why this priority**: Builds on the pills pattern from P2. Improves data capture by separating hard restrictions (allergies) from soft preferences (dislikes). Enhances P2 value but P2 can ship alone.

**Independent Test**: User can enter free-text food preferences (stored as pills), select allergies from dropdown (stored as pills), and both types are used differently by AI (preferences = avoid when possible, restrictions = never include).

**Acceptance Scenarios**:

**Section 1: Preferences (Free Text Input)**
1. **Given** user is on settings form, **When** they see "Food Preferences" section, **Then** they see label "What foods or ingredients do you prefer to avoid?" with free text input field
2. **Given** user types "mushrooms" and presses Enter, **When** input is submitted, **Then** "mushrooms" appears as a pill below the input with (x) button, and input field clears
3. **Given** user has added "mushrooms" and "cilantro" as preferences, **When** they click (x) on "mushrooms", **Then** "mushrooms" pill is removed and only "cilantro" remains
4. **Given** user has 5+ preference pills, **When** viewing the section, **Then** pills wrap to multiple lines with consistent spacing

**Section 2: Allergies/Restrictions (Multi-Select)**
1. **Given** user is on settings form, **When** they see "Dietary Restrictions & Allergies" section, **Then** they see multi-select dropdown (using same pattern as cuisines from P2)
2. **Given** dropdown options include common restrictions, **When** user opens dropdown, **Then** "Kosher" and "Halal" are NOT in the list (per requirements)
3. **Given** user selects "Gluten-Free" and "Dairy-Free", **When** selections are made, **Then** two pills appear below dropdown with (x) buttons (same styling as cuisine pills)
4. **Given** user has both preferences ("mushrooms") and restrictions ("Gluten-Free"), **When** generating meal plan, **Then** AI treats them differently: restrictions are NEVER violated, preferences are avoided when possible

**Edge Cases**:
- User enters duplicate preference (e.g., "mushrooms" twice) → System prevents duplicates
- User enters very long preference text (e.g., "I don't like any vegetables that are green except for spinach and kale") → Pill should truncate or wrap appropriately
- User removes all restrictions → Dropdown shows placeholder, no pills displayed

---

### User Story 4 - Input Fixes & UI Polish (Priority: P4)

Fix broken number inputs (weight/height), correct snack ordering in meal plan output, and add proper spacing in edit view.

**Why this priority**: These are bug fixes and polish items. They improve existing functionality but don't introduce new capabilities. Can be done independently of P1-P3.

**Independent Test**: User can enter integer weight/height values properly, snacks appear in chronological order in meal plan, and edit view has proper padding.

**Acceptance Scenarios**:

**Number Input Fixes (Weight & Height)**
1. **Given** user clicks on weight input field, **When** they type "75", **Then** field displays "75" (integer only, no decimal)
2. **Given** user has entered weight "75", **When** they use up/down arrows, **Then** value increments/decrements by 1 (75 → 76 → 77)
3. **Given** user enters height "180", **When** they submit form, **Then** value is stored as integer 180 (not 1.80)

**Snack Ordering in Meal Plan Output**
1. **Given** meal plan includes breakfast, morning snack, lunch, afternoon snack, dinner, **When** user views meal plan, **Then** meals are displayed in chronological order: breakfast → morning snack → lunch → afternoon snack → dinner
2. **Given** meal plan includes breakfast, lunch, dinner, afternoon snack (no morning snack), **When** user views meal plan, **Then** afternoon snack appears between lunch and dinner

**Edit View Padding**
1. **Given** user clicks "Edit" on a meal, **When** edit modal opens, **Then** there is visible padding (minimum 12px) between instruction text label and text input field

**Edge Cases**:
- User enters non-numeric characters in weight/height → Input validation prevents submission
- Meal plan has only 3 main meals, no snacks → No ordering issue (works as before)

---

### User Story 5 - Infrastructure Improvements (Priority: P5)

Fix Next.js smooth scroll warning, resolve preload resource warning, and add frequency_penalty to AI settings.

**Why this priority**: Technical debt and performance improvements. Don't affect user-facing functionality directly but improve developer experience and AI output quality.

**Independent Test**: Browser console shows no warnings, AI generates more diverse ingredient choices.

**Acceptance Scenarios**:

**Next.js Smooth Scroll Fix**
1. **Given** Next.js detects smooth scroll on `<html>`, **When** developer opens browser console, **Then** no warning about `scroll-behavior: smooth` appears
2. **Given** HTML element needs smooth scroll attribute, **When** inspecting DOM, **Then** `data-scroll-behavior="smooth"` attribute is present on `<html>` element

**Preload Resource Fix**
1. **Given** resources are being preloaded, **When** page loads, **Then** browser console shows no warnings about unused preloaded resources

**AI Frequency Penalty**
1. **Given** AI model is called for meal generation, **When** API request is made to OpenRouter, **Then** `frequency_penalty: 0.4` is included in request parameters
2. **Given** user generates multiple meal plans, **When** comparing ingredient lists, **Then** AI shows greater variety across meals (e.g., not repeating chicken in every dinner)

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to select multiple cultural cuisines via multi-select dropdown
- **FR-002**: System MUST display selected cuisines as removable pills with country flag icons
- **FR-003**: System MUST display selected dietary restrictions as removable pills using same visual pattern as cuisines
- **FR-004**: System MUST provide separate input for food preferences (free text) vs allergies/restrictions (multi-select)
- **FR-005**: System MUST remove "other" option from sex/gender biometrics (only male/female allowed)
- **FR-006**: System MUST remove "Kosher" and "Halal" from dietary restrictions dropdown
- **FR-007**: System MUST accept integer-only values for weight and height inputs
- **FR-008**: System MUST display meals in chronological order (breakfast → morning snack → lunch → afternoon snack → dinner → evening snack)
- **FR-009**: System MUST apply `frequency_penalty: 0.4` to all AI meal generation requests
- **FR-010**: System MUST document design system tokens (colors, spacing, typography) in memory layer
- **FR-011**: Pills/tags component MUST be reusable across cuisines and dietary restrictions sections

### Key Entities

- **Design System Tokens**: Colors (primary, secondary, accent, neutral shades), spacing scale (4px, 8px, 12px, 16px, 24px), typography (font families, sizes, weights)
- **Pill/Tag Component**: Visual element with text, optional icon, (x) button, hover/focus states
- **Multi-Select Dropdown**: Dropdown with checkboxes, allows multiple selections, emits array of selected values
- **Cuisine Selection**: Array of cuisine strings with associated flag icons (e.g., ["Italian", "Mexican", "Japanese"])
- **Food Preferences**: Array of free-text strings (user dislikes, stored as pills)
- **Dietary Restrictions**: Array of predefined restriction strings (allergies, stored as pills)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can select and save multiple cuisines (average 2-3 selections per user)
- **SC-002**: Food preference pills display correctly with no visual bugs (manual testing: 0 layout issues)
- **SC-003**: Weight/height inputs accept integer values without decimal issues (manual testing: 100% success rate)
- **SC-004**: Snack ordering bug is resolved (manual testing: snacks always appear in chronological order)
- **SC-005**: Browser console shows 0 warnings after fixes (Next.js smooth scroll, preload resources)
- **SC-006**: AI-generated meal plans show increased ingredient variety (subjective: compare 10 plans before/after frequency_penalty)
- **SC-007**: Design system tokens are documented in `.vibecode/memory/design-system/tokens.md`
- **SC-008**: Pills component is used consistently in 2+ places (cuisines + dietary restrictions)

## LNO Classification

**Classification**: **Neutral Work**

**Rationale**:
This feature improves the existing settings form UX and fixes bugs, but it doesn't create outsized impact or unlock new capabilities. It's necessary work to make the settings form function properly and feel polished, but it's not transformative.

- **Not Leverage**: Doesn't 10x a metric or unlock new user value. Users could already enter settings before; this just makes it nicer.
- **Is Neutral**: Keeps the lights on, improves UX quality, fixes bugs. Necessary but not differentiating.
- **Not Overhead**: Directly serves the core meal planning mission by improving input quality.

**Quality Bar (per Constitution - Neutral Work)**:
- Clean, functional, actionable
- "Good enough" is fine — ship it and move on
- Don't over-engineer the design system (minimal is the goal)

## Design Considerations

### Pills/Tags Pattern Specifications
- Background color: Light variant of primary color (e.g., primary-50)
- Text color: Dark variant for contrast (e.g., primary-900)
- Border: Optional subtle border (1px, primary-200)
- Padding: 6px 12px
- Border radius: 16px (fully rounded)
- (x) button: 16x16px, appears on hover, accessible via keyboard
- Hover state: Slightly darker background (primary-100)
- Spacing between pills: 8px horizontal, 8px vertical (when wrapping)

### Multi-Select Dropdown Specifications
- Dropdown button: Shows selected count when closed (e.g., "3 cuisines selected")
- Checkboxes: Standard HTML checkboxes with custom styling
- Max height: 300px with scroll if options exceed
- Search/filter: Not required for MVP (can add later if needed)

### Country Flags Icons
- Source: Use emoji flags or icon library (e.g., `flag-icons` npm package)
- Size: 20x20px, displayed to left of cuisine name in pill
- Fallback: If no flag available, use generic globe icon

## Technical Notes

### Biometrics "Other" Option Removal
- Current: Dropdown has "male", "female", "other"
- Change: Remove "other" from dropdown options
- Impact: BMR calculation requires binary male/female (per Mifflin-St Jeor equation)
- Migration: If any existing users have "other" selected, prompt them to update to "male" or "female"

### AI Frequency Penalty
- Current: `frequency_penalty` not set (defaults to 0)
- Change: Set to 0.4 in `lib/ai/openrouter.ts`
- Purpose: Reduce repetition of same ingredients across meals
- Trade-off: May slightly reduce coherence, but worth it for variety

## Design Decisions (FINALIZED)

### 1. Cuisine List
**Decision**: Standard 15-20 cuisines
**Options**: Italian, Mexican, Japanese, Chinese, Indian, Mediterranean, American, French, Thai, Vietnamese, Korean, Middle Eastern, Caribbean, African, Latin American, Other (free text)
**Rationale**: Covers most major cuisines without overwhelming users. Balances comprehensiveness with usability.

### 2. Country Flags for Regional Cuisines
**Decision**: Multiple flags for regional cuisines
**Implementation**:
- Mediterranean: 🇬🇷🇮🇹🇹🇷 (Greece, Italy, Turkey)
- American: 🇺🇸
- Middle Eastern: 🇱🇧🇸🇦🇦🇪 (Lebanon, Saudi Arabia, UAE)
- Caribbean: 🇯🇲🇨🇺🇵🇷 (Jamaica, Cuba, Puerto Rico)
- Latin American: 🇲🇽🇧🇷🇦🇷 (Mexico, Brazil, Argentina)
**Rationale**: Visually rich and representative of regional diversity. Avoids reducing diverse cuisines to single country.

### 3. Maximum Cuisine Selections
**Decision**: No limit
**Implementation**: Pills wrap to multiple rows with consistent 8px vertical spacing
**Rationale**: Gives maximum flexibility. Users with diverse tastes (e.g., multicultural households) can express full preferences. Layout handles wrapping gracefully.

### 4. Free-Text Preference Character Limit
**Decision**: 50 characters with visual truncation
**Implementation**: Show "..." if text exceeds 50 chars. Full text visible on hover tooltip.
**Rationale**: Allows descriptive preferences like "vegetables with bitter taste" while preventing layout-breaking essays. Tooltip provides full context if needed.

### 5. Design System Scope
**Decision**: Minimal - pills/dropdowns only
**What's included**:
- Color tokens for pills (primary-50, primary-100, primary-900)
- Spacing tokens (4px, 8px, 12px, 16px)
- Pills component styles
- Multi-select dropdown styles
**What's deferred**: Button styles, form input patterns, typography system, layout grid
**Rationale**: Fast, focused implementation. Aligns with "Neutral Work" classification (good enough, ship it). Can expand design system in future features.

---

**Next Steps**:
1. ✅ Design decisions finalized
2. ✅ Spec complete and ready for planning
3. Run: `/vibecode:plan` to create technical implementation plan
