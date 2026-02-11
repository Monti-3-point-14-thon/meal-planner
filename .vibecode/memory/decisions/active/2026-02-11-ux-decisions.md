# Decision: UX/UI Design Choices

**Date**: 2026-02-11
**Feature**: 001-meal-plan-generator
**Context**: Balancing simplicity with personalization requirements

---

## Decision 1: Cultural Cuisine Input Method

### Options Considered

**A) Free Text Input**
- User types cuisine preference
- Pros: Flexible, handles any cuisine
- Cons: Typos, inconsistent data, harder AI parsing

**B) Dropdown (20 cuisines) + "Other" field**
- Preset list + fallback
- Pros: Consistent data, faster input, covers 90% of cases
- Cons: Limited to preset options

**C) Multi-select Tags**
- Multiple cuisine selection
- Pros: Handles fusion preferences
- Cons: Complex UI, longer implementation

### Chosen: **Option B (Dropdown + Other)**

**Rationale**:
- Covers 90% of common cuisines
- Consistent data = better AI prompts
- Faster user input (<30 seconds)
- "Other" field handles edge cases
- Simpler implementation (1 day vs 2 days for multi-select)

**Cuisine List** (20 options):
Mediterranean, Italian, Mexican, Chinese, Japanese, Indian, Thai, Vietnamese, Middle Eastern, Greek, French, Spanish, Korean, Brazilian, Caribbean, American, British, German, Scandinavian, African, Other (text field)

---

## Decision 2: Macros Display Detail

### Options Considered

**A) Detailed Macros (P/C/F breakdown)**
- Shows: Protein 45g, Carbs 60g, Fats 20g, Calories 580
- Pros: Full transparency, essential for fitness goals
- Cons: Visual clutter, intimidating for casual users

**B) Simplified (Calories only, expandable)**
- Shows: Calories 580 with "View details" link
- Pros: Cleaner UI, less overwhelming
- Cons: Hides valuable data, requires extra click

### Chosen: **Option A (Detailed macros by default)**

**Rationale**:
1. **Target user**: Works with nutritionist wife - macros are essential
2. **Constitution**: "Personalization is the product" - detailed data = valuable
3. **Goal alignment**: Muscle building & weight loss NEED macro tracking
4. **Clarity**: "Health information must be immediately understandable" - show it directly

**Display Format**:
```
Calories: 580
Protein: 45g | Carbs: 60g | Fats: 20g
```

**Future enhancement**: Add "Simple View" toggle if users request it

---

## Decision 3: Settings Form Layout

### Chosen: **Single-page form with sections**

**Rationale**:
- Complete in <3 minutes (per success criteria)
- Progressive disclosure: sections can be collapsed
- Mobile-friendly (scrollable)
- All data visible for review before submit

**Sections**:
1. Health Goal (dropdown)
2. Biometrics (weight, height, age, sex)
3. Cultural Context (cuisine dropdown + location)
4. Dietary Restrictions (multi-select checkboxes + custom)

**Alternative considered**: Multi-step wizard
- Rejected: Adds complexity, harder to review inputs, slower completion

---

## Decision 4: Edit Interface

### Chosen: **Expandable text input on meal card**

**Rationale**:
- Simple: Click edit → input expands → user types → submit
- No modal (less disruptive)
- Context preserved (see meal while editing)
- Mobile-friendly

**Flow**:
1. User clicks "Edit" button/icon on meal card
2. Card expands, shows text input field
3. Placeholder text: "e.g., 'Make it vegetarian', 'No dairy', 'Make it spicy'"
4. User types instruction, clicks "Regenerate"
5. Loading state replaces meal content
6. Updated meal appears

**Alternative considered**: Modal dialog
- Rejected: Disrupts view of other meals, harder to compare changes

---

## Consequences

**Enables**:
- Fast user input (<3 minutes for settings)
- Clear macro visibility for goal tracking
- Simple editing flow for iterative refinement

**Prevents**:
- Support for niche cuisines not in dropdown (mitigated by "Other" field)
- Simplified view for macro-averse users (can add toggle later)

---

## Design System Implications

**Components to create**:
- `CultureDropdown` - 20 cuisines + Other
- `MacroDisplay` - Detailed P/C/F layout
- `MealEditInput` - Expandable text field with submit
- `BiometricsForm` - Weight/height/age inputs with unit toggles

**Reusable from ship-fast**:
- DaisyUI buttons, cards, form inputs
- Tailwind spacing and typography

---

## Review Date

**Next review**: After first 5 users test the UI (collect feedback on:
- Is settings form too long?
- Are detailed macros helpful or overwhelming?
- Is edit interface intuitive?

---

## Related Decisions

- AI model selection (affects generation speed, impacts UX loading states)
- Data storage (affects whether we show "save" buttons)
