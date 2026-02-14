# Decision: Multi-Select UI Pattern (Dropdown vs Modal)

**Date**: 2026-02-12
**Feature**: 002-settings-ux-improvements
**Context**: Need multi-select interface for cultural cuisines (15-20 options) and dietary restrictions (9 options)

## Options Considered

### Option A: Dropdown with Checkboxes
- **Pros**:
  - Standard pattern, familiar to users
  - Inline with form flow (no disruption)
  - Mobile-friendly (native scrolling)
  - Reuses existing patterns (RestrictionsInput already uses checkboxes)
- **Cons**:
  - Limited vertical space (requires scrolling for 20+ options)
  - No search/filter capability initially
- **Cost**: 1 day implementation

### Option B: Modal with Search
- **Pros**:
  - More space for options and search bar
  - Can add filtering and categorization
  - Better for very long lists (50+ items)
- **Cons**:
  - Disrupts form flow (user leaves context)
  - More complex state management (modal open/close, search state)
  - Harder to review selections alongside form
- **Cost**: 2 days implementation

## Decision

**Chosen**: **Option A (Dropdown with Checkboxes)**

**Rationale**:
1. **Pattern consistency**: RestrictionsInput in feature 001 already uses checkboxes - maintaining consistency
2. **List size appropriate**: 15-20 cuisines and 9 restrictions fit comfortably in scrollable dropdown (300px max height = ~12 visible items)
3. **Simpler implementation**: 1 day vs 2 days, aligns with "Neutral Work" quality bar
4. **Progressive enhancement path**: Can add search filter to dropdown later if needed (0.5 day upgrade)
5. **Mobile context**: Dropdown behavior is native to mobile browsers, modals require custom mobile optimization

## Consequences

**Enables**:
- Faster implementation (5-7 days total for feature 002)
- Consistent UX patterns across settings form
- Inline selection review (no context switching)
- Simple component reusability (use same MultiSelectDropdown for cuisines and restrictions)

**Prevents**:
- Search/filter capability in initial release
- Large visual space for options display
- Advanced categorization (e.g., grouping cuisines by region)

## Migration Path

**Trigger**: If users select >10 cuisines regularly OR user feedback requests search capability

**Effort**: 0.5 days to add search filter to existing dropdown
- Add input field above checkbox list
- Filter options array based on search term
- Maintain existing dropdown structure (no modal needed)

**Alternative Trigger**: If cuisine list grows to >30 options
- Upgrade to modal pattern with categories and search (1 day effort)

## Implementation Notes

**Dropdown Behavior**:
- Click button to open
- Click outside or press Escape to close
- Checkboxes persist selected state when dropdown closes
- Button shows "N selected" or "None selected" when closed

**Accessibility**:
- Keyboard navigation: Tab to dropdown, Space/Enter to open, Arrow keys to navigate options, Space to toggle checkbox, Escape to close
- Screen reader: Announce "N options selected" when dropdown closes

## Review Date

After first 10 users complete settings form - analyze:
- Average number of cuisines selected (if >5, consider adding search)
- Time spent scrolling through options (if >30 seconds, consider modal)
- User feedback on dropdown usability
