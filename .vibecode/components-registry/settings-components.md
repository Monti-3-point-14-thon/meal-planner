# Settings Form Components Registry

**Last Updated**: 2026-02-12
**Feature**: 002-settings-ux-improvements

---

## Design System Components (New - Feature 002)

### Pill
**File**: `app/components/design-system/Pill.tsx`
**Purpose**: Reusable pill/tag component for displaying selected items with optional icon and remove button
**Status**: Pending implementation (Phase 1)

**Props**:
```typescript
interface PillProps {
  text: string;                  // Display text (e.g., "Italian", "mushrooms")
  icon?: React.ReactNode;        // Optional icon (e.g., flag emoji, custom icon)
  onRemove: () => void;          // Remove handler (called when (x) is clicked)
  className?: string;            // Additional Tailwind classes
}
```

**Styling** (Design System Tokens):
- Background: `bg-primary bg-opacity-10`
- Text: `text-primary`
- Border: `border border-primary border-opacity-20`
- Padding: `px-3 py-1.5` (12px horizontal, 6px vertical)
- Border radius: `rounded-full`
- (x) button: `ml-2 text-sm hover:text-error cursor-pointer`
- Hover: `hover:bg-opacity-20`

**Reusability**: ✅ High
- Used in: CultureSelector (with flags), PreferencesInput (without icons), RestrictionsInput (without icons)
- Can be used anywhere pills/tags pattern is needed

**Accessibility**:
- Keyboard navigation: Tab to (x) button, Enter/Space to remove
- ARIA label: "Remove [text]"

---

### MultiSelectDropdown
**File**: `app/components/design-system/MultiSelectDropdown.tsx`
**Purpose**: Reusable multi-select dropdown with checkboxes for selecting multiple options from a list
**Status**: Pending implementation (Phase 1)

**Props**:
```typescript
interface MultiSelectDropdownProps {
  options: Array<{ value: string; label: string }>;  // Dropdown options
  selected: string[];                                  // Currently selected values
  onChange: (selected: string[]) => void;             // Selection change handler
  placeholder?: string;                                // Placeholder text when nothing selected
  error?: string;                                      // Error message to display
}
```

**Behavior**:
- Click dropdown button to open/close
- Checkboxes for each option
- Click outside or press Escape to close
- Button shows "N selected" or placeholder when closed
- Max height: 300px with scroll

**Styling**:
- Button: DaisyUI `select select-bordered`
- Dropdown container: Absolute positioned, `max-h-[300px] overflow-y-auto`
- Checkbox: DaisyUI `checkbox checkbox-sm`

**Reusability**: ✅ High
- Used in: CultureSelector (cuisines), RestrictionsInput (allergies)
- Can be used anywhere multi-select is needed

**Accessibility**:
- Keyboard: Tab to button, Space/Enter to open, Arrow keys to navigate, Space to toggle, Escape to close
- ARIA: `role="listbox"`, `aria-multiselectable="true"`, `aria-expanded` state

---

### FlagIcon
**File**: `app/components/design-system/FlagIcon.tsx`
**Purpose**: Renders country flag emoji(s) for a given cuisine type
**Status**: Pending implementation (Phase 1)

**Props**:
```typescript
interface FlagIconProps {
  cuisine: string;  // Cuisine name (e.g., "Italian", "Mediterranean")
}
```

**Mapping** (Cuisine → Flag Emoji):
- Italian → 🇮🇹
- Mexican → 🇲🇽
- Japanese → 🇯🇵
- Chinese → 🇨🇳
- Indian → 🇮🇳
- Mediterranean → 🇬🇷🇮🇹🇹🇷 (Greece, Italy, Turkey)
- American → 🇺🇸
- French → 🇫🇷
- Thai → 🇹🇭
- Vietnamese → 🇻🇳
- Korean → 🇰🇷
- Middle Eastern → 🇱🇧🇸🇦🇦🇪 (Lebanon, Saudi Arabia, UAE)
- Caribbean → 🇯🇲🇨🇺🇵🇷 (Jamaica, Cuba, Puerto Rico)
- African → 🌍 (generic globe)
- Latin American → 🇲🇽🇧🇷🇦🇷 (Mexico, Brazil, Argentina)
- Other → 🌍 (generic globe)

**Fallback**: 🌍 for unmapped or multi-regional cuisines

**Reusability**: ✅ Medium
- Used in: CultureSelector pills
- Could be used in meal plan display if cuisines shown

**Implementation Note**: Uses Unicode emoji (no external library), browser-native rendering

---

## Settings Form Components (Modified - Feature 002)

### CultureSelector
**File**: `app/components/CultureSelector.tsx`
**Purpose**: Multi-select cuisine preferences with pills and flag icons
**Status**: Modified in Feature 002 (was single-select in Feature 001)

**Changes from Feature 001**:
- Before: Single-select dropdown (`<select>`) with "Other" text field
- After: `MultiSelectDropdown` with `Pill[]` display + `FlagIcon` per pill

**Props**:
```typescript
interface CultureSelectorProps {
  value: CulturalContext;           // { cuisines: string[], location: string }
  onChange: (value: CulturalContext) => void;
  errors?: { cuisines?: string; location?: string };
}
```

**Data Flow**:
1. User selects cuisines from `MultiSelectDropdown`
2. `onChange` updates `cuisines` array in parent state
3. Selected cuisines render as `Pill` components with `FlagIcon`
4. Click (x) on pill → removes from `cuisines` array and unchecks in dropdown

**Validation**:
- At least 1 cuisine must be selected
- Location is required (unchanged from Feature 001)

**Related Components**:
- Uses: `MultiSelectDropdown`, `Pill`, `FlagIcon`

---

### PreferencesInput (New Component)
**File**: `app/components/PreferencesInput.tsx`
**Purpose**: Free-text input for food preferences (soft restrictions) with pills display
**Status**: New in Feature 002

**Props**:
```typescript
interface PreferencesInputProps {
  value: string[];                  // Array of food preferences (e.g., ["mushrooms", "cilantro"])
  onChange: (value: string[]) => void;
  errors?: string;
}
```

**Behavior**:
- Text input with "Add" button
- Enter key also triggers add
- Input clears after add
- Display preferences as `Pill` components
- 50 character limit per preference (truncate with "..." + tooltip for full text)
- Remove duplicates automatically

**Help Text**: "What foods or ingredients do you prefer to avoid? (AI will avoid when possible)"

**Related Components**:
- Uses: `Pill`

---

### RestrictionsInput
**File**: `app/components/RestrictionsInput.tsx`
**Purpose**: Multi-select dietary restrictions (hard restrictions) with pills display
**Status**: Modified in Feature 002 (was checkboxes grid in Feature 001)

**Changes from Feature 001**:
- Before: Grid of checkboxes + custom text input with badges
- After: `MultiSelectDropdown` + `Pill[]` display (no custom input needed)

**Preset Restrictions** (9 options - removed Kosher & Halal):
- Vegetarian
- Vegan
- Gluten-free
- Dairy-free
- Nut allergy
- Shellfish allergy
- Pescatarian
- Keto
- Paleo

**Props**:
```typescript
interface RestrictionsInputProps {
  value: string[];                  // Array of restrictions
  onChange: (value: string[]) => void;
  errors?: string;
}
```

**Help Text**: "Allergies and strict dietary requirements (AI will NEVER violate these)"

**Related Components**:
- Uses: `MultiSelectDropdown`, `Pill`

---

### BiometricsInput
**File**: `app/components/BiometricsInput.tsx`
**Purpose**: Weight, height, age, sex input with unit toggles
**Status**: Modified in Feature 002

**Changes from Feature 002**:
1. **Number inputs**: Changed from `type="number"` to `type="text"` with `inputMode="numeric"` and custom validation (strips non-digits)
2. **Sex dropdown**: Removed "other" option (only "male" and "female")

**Migration Handling**: If existing settings have `sex: "other"`, show alert on component mount prompting user to select "male" or "female"

**Props**: (Unchanged)
```typescript
interface BiometricsInputProps {
  value: Biometrics;  // { weight, height, age, sex }
  onChange: (value: Biometrics) => void;
  errors?: { weight?: string; height?: string; age?: string; sex?: string };
}
```

---

## Component Dependencies

```
SettingsForm (parent)
  └── GoalSelector (unchanged)
  └── BiometricsInput (modified)
  └── CultureSelector (modified)
      ├── MultiSelectDropdown (new)
      └── Pill (new) + FlagIcon (new)
  └── PreferencesInput (new)
      └── Pill (new)
  └── RestrictionsInput (modified)
      ├── MultiSelectDropdown (new)
      └── Pill (new)
```

---

## Testing Checklist

**Design System Components**:
- [ ] Pill renders with text only
- [ ] Pill renders with text + icon
- [ ] Pill (x) button triggers onRemove
- [ ] Pill hover state works
- [ ] Pill keyboard navigation works (Tab, Enter/Space)
- [ ] MultiSelectDropdown opens/closes
- [ ] MultiSelectDropdown checkboxes select/deselect
- [ ] MultiSelectDropdown shows "N selected"
- [ ] MultiSelectDropdown keyboard navigation works
- [ ] FlagIcon maps all cuisines correctly
- [ ] FlagIcon shows fallback for unmapped

**Modified Components**:
- [ ] CultureSelector allows multiple selection
- [ ] CultureSelector pills appear with flags
- [ ] CultureSelector pill removal works
- [ ] PreferencesInput accepts text and adds pills
- [ ] PreferencesInput truncates long text with tooltip
- [ ] PreferencesInput prevents duplicates
- [ ] RestrictionsInput shows only 9 options (no Kosher/Halal)
- [ ] RestrictionsInput pills appear without flags
- [ ] BiometricsInput accepts only integers
- [ ] BiometricsInput shows only male/female options

---

## Design System Documentation

See: `.vibecode/memory/design-system/tokens.md` for:
- Color tokens
- Spacing tokens
- Pills pattern specifications
- Multi-select dropdown specifications
