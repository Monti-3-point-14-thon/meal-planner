# Design System Tokens

**Feature**: 002-settings-ux-improvements
**Created**: 2026-02-12
**Status**: Minimal design system for pills/tags and multi-select patterns

---

## Colors (DaisyUI Theme-Based)

### Primary Variants
- **primary-50**: Light background for pills
  - Usage: `bg-primary bg-opacity-10`
  - Hex equivalent: Primary color at 10% opacity

- **primary-100**: Hover state for pills
  - Usage: `bg-primary bg-opacity-20`
  - Hex equivalent: Primary color at 20% opacity

- **primary-900**: Text color for pills
  - Usage: `text-primary`
  - Uses DaisyUI theme primary color

### Base Colors
- **base-content**: Default text color
  - Usage: `text-base-content`

- **error**: Error state text
  - Usage: `text-error`

---

## Spacing Scale

| Size | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| 4px  | 0.25rem | `space-x-1`, `space-y-1`, `p-1` | Tight spacing |
| 8px  | 0.5rem | `gap-2`, `space-x-2`, `space-y-2`, `p-2` | Standard gap between pills |
| 12px | 0.75rem | `p-3`, `space-y-3` | Internal padding |
| 16px | 1rem | `space-y-4`, `p-4` | Section spacing |
| 24px | 1.5rem | `p-6` | Card padding |

---

## Pills/Tags Pattern

### Structure
```html
<div class="pill-container">
  <!-- Pill with icon -->
  <span class="pill">
    <span class="pill-icon">🇮🇹</span>
    <span class="pill-text">Italian</span>
    <button class="pill-remove">×</button>
  </span>
</div>
```

### Styling Specifications

**Container**:
- Display: `flex flex-wrap`
- Gap: `gap-2` (8px between pills)
- Padding: `p-0` (no padding, inherits from parent)

**Pill Base**:
- Display: `inline-flex items-center`
- Background: `bg-primary bg-opacity-10`
- Text: `text-primary`
- Border: `border border-primary border-opacity-20`
- Padding: `px-3 py-1.5` (12px horizontal, 6px vertical)
- Border radius: `rounded-full`
- Font size: `text-sm`
- Transition: `transition-colors`

**Pill Hover State**:
- Background: `hover:bg-opacity-20`

**Pill Icon** (optional):
- Margin right: `mr-2`
- Display: `inline-flex items-center`
- Font size: `text-base` (16px for emoji flags)

**Pill Text**:
- Display: `inline-block`
- Truncate: `truncate` (if max-width set)
- Max width: `max-w-[200px]` (for long text)

**Pill Remove Button (x)**:
- Margin left: `ml-2`
- Padding: `p-0.5`
- Font size: `text-sm`
- Color: `text-primary hover:text-error`
- Cursor: `cursor-pointer`
- Transition: `transition-colors`
- Accessibility: `aria-label="Remove [text]"`, `role="button"`, `tabindex="0"`

### Component Interface (TypeScript)
```typescript
interface PillProps {
  text: string;
  icon?: React.ReactNode;
  onRemove: () => void;
  className?: string;
}
```

### Usage Example
```tsx
<Pill
  text="Italian"
  icon={<span>🇮🇹</span>}
  onRemove={() => handleRemove('Italian')}
/>
```

---

## Multi-Select Dropdown Pattern

### Structure
```html
<div class="multiselect-container">
  <button class="multiselect-button">
    3 selected
  </button>
  <div class="multiselect-dropdown">
    <label class="multiselect-option">
      <input type="checkbox" />
      <span>Option 1</span>
    </label>
    <!-- More options -->
  </div>
</div>
```

### Styling Specifications

**Container**:
- Position: `relative`
- Width: `w-full`

**Button** (trigger):
- Base: DaisyUI `select select-bordered w-full`
- States: `focus:outline-none focus:ring-2 focus:ring-primary`
- Display: `flex justify-between items-center`
- Cursor: `cursor-pointer`

**Dropdown Menu**:
- Position: `absolute z-10`
- Top: `top-full mt-1`
- Width: `w-full`
- Background: `bg-base-100`
- Border: `border border-base-300 rounded-lg`
- Shadow: `shadow-lg`
- Max height: `max-h-[300px]`
- Overflow: `overflow-y-auto`
- Padding: `p-2`

**Option Row**:
- Display: `flex items-center gap-2`
- Padding: `px-3 py-2`
- Border radius: `rounded-md`
- Hover: `hover:bg-base-200`
- Cursor: `cursor-pointer`

**Checkbox**:
- Base: DaisyUI `checkbox checkbox-sm`
- Checked: `checkbox-primary`

**Option Label**:
- Font size: `text-sm`
- Color: `text-base-content`
- User select: `select-none`

### Component Interface (TypeScript)
```typescript
interface MultiSelectDropdownProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}
```

### Behavior Specifications

**Open/Close**:
- Click button toggles dropdown
- Click outside closes dropdown
- Escape key closes dropdown

**Selection**:
- Click checkbox toggles selection
- Click option row toggles checkbox
- Selected values persist when dropdown closes

**Display**:
- When closed: Show "N selected" or placeholder
- When open: Highlight selected options with checked checkboxes

**Keyboard Navigation**:
- Tab: Focus button
- Space/Enter: Open dropdown
- Arrow Down/Up: Navigate options (when open)
- Space: Toggle current option
- Escape: Close dropdown

**Accessibility**:
- Button: `role="button"`, `aria-haspopup="listbox"`, `aria-expanded="true/false"`
- Dropdown: `role="listbox"`, `aria-multiselectable="true"`
- Options: `role="option"`, `aria-selected="true/false"`

---

## Range Slider Pattern

### Structure
```html
<div class="form-control">
  <label class="label mb-3">
    <span class="label-text font-semibold">Label Text</span>
  </label>
  <input type="range" class="range range-primary" />
  <div class="flex justify-between text-xs mt-2">
    <span>Min label</span>
    <span class="font-bold text-primary">Current value</span>
    <span>Max label</span>
  </div>
</div>
```

### Styling Specifications

**Label**:
- Margin bottom: `mb-3` (12px spacing before slider)
- Font weight: `font-semibold`
- Text size: `label-text` (DaisyUI default)

**Range Input**:
- Base: DaisyUI `range range-primary`
- Width: `w-full` (inherits from parent)

**Scale Labels Container**:
- Display: `flex justify-between`
- Font size: `text-xs`
- Top margin: `mt-2` (8px spacing after slider)
- **No horizontal padding** (aligns naturally with slider track)

**Scale Labels**:
- Min/Max: Default text color and weight
- Current value: `font-bold text-primary` (highlighted)

### Behavior
- Current value updates in real-time as slider moves
- Scale labels are static (show range limits)
- Center label shows dynamic current value

---

## Typography

**Default**: Inherits from DaisyUI theme

### Specific Overrides (if needed)
- Form labels: `text-sm font-medium text-base-content`
- Help text: `text-xs text-base-content opacity-70`
- Error text: `text-xs text-error`

---

## Form Elements

### Label Spacing Pattern
- **Standard spacing**: Labels should have `mb-3` (12px) before their associated input
- Example: `<label className="label mb-3">`
- Applies to: text inputs, textareas, selects, range sliders
- Rationale: Consistent visual separation improves form readability

### Error States
- Input/Select with error: Add `input-error` or `select-error` class
- Error message: Display below input with `label-text-alt text-error` classes

### Validation Feedback
- Success: `input-success` class
- Warning: `input-warning` class

---

## Responsive Considerations

### Pills Wrapping
- Pills container uses `flex-wrap` to wrap pills to multiple rows on small screens
- Gap remains consistent (`gap-2`) across all screen sizes

### Dropdown on Mobile
- Max height adjusts for mobile: `max-h-[250px] sm:max-h-[300px]`
- Touch-friendly: Minimum tap target 44x44px for options

---

## Animation & Transitions

### Pills
- Color transitions: `transition-colors duration-200`
- Remove button hover: `transition-colors duration-150`

### Dropdown
- Open/close: `transition-opacity duration-150`
- Option hover: `transition-colors duration-100`

---

## Accessibility Guidelines

### Keyboard Support
- All interactive elements must be keyboard accessible (Tab, Enter, Space, Escape, Arrow keys)
- Focus states must be visible (`focus:ring-2 focus:ring-primary`)

### Screen Readers
- ARIA labels for icon-only buttons
- ARIA states for dropdown (expanded, selected)
- Semantic HTML (button, label, input)

### Color Contrast
- Text on backgrounds must meet WCAG AA standards (4.5:1 for normal text)
- Reliance on color alone is avoided (use icons + text)

---

## Future Expansion (Not in Scope for Feature 002)

- Button styles (primary, secondary, ghost, etc.)
- Form input patterns (text, number, date)
- Typography system (headings, body, captions)
- Layout grid system
- Card component variants
- Modal/dialog patterns

---

## Notes

- This is a **minimal design system** focused on pills and multi-select patterns only
- All styles leverage DaisyUI + Tailwind CSS (no custom CSS files)
- Tokens are intentionally simple to enable fast implementation
- Design system can be expanded in future features as needs arise
