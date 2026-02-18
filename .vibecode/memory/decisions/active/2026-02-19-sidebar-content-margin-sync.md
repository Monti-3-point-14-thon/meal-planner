# Decision: Sidebar Content Margin Synchronization

**Date**: 2026-02-19
**Feature**: 004-navigation-sidebar (refinement)
**Context**: User feedback that main content didn't adjust when sidebar collapsed, leaving large whitespace gap

## Problem

When sidebar collapsed from 256px to 64px width, main content maintained fixed `md:ml-64` (256px) left margin. This created:
- 192px of empty whitespace between collapsed sidebar and content
- Poor space utilization on desktop screens
- Inconsistent spacing between sidebar and content in different states

User request: "make it so that the entire page content will extend/collapse with the menu bar, living always the same margin between the menu bar and the page content"

## Options Considered

### Option A: Keep Content Margin Fixed (Original Implementation)
- Main content: `md:ml-64` always (256px left margin)
- Sidebar: `w-64` → `w-16` on collapse
- Pros: Simpler implementation, no parent state needed
- Cons: Large whitespace gap when collapsed, poor UX, inefficient space usage

### Option B: Dynamic Content Margin with State Lifting (CHOSEN)
- Lift `isCollapsed` state from Sidebar to LayoutWrapper
- Main content: `md:ml-64` (expanded) → `md:ml-16` (collapsed)
- Sidebar and content both react to same state
- Pros: Consistent spacing, smooth synchronized animation, better space utilization
- Cons: Requires state lifting, slightly more complex state management

### Option C: CSS-Only Solution with Container Queries
- Use CSS container queries to detect sidebar width
- Adjust content margin based on container
- Pros: No additional React state
- Cons: Browser support incomplete (2026), less control over timing, harder to maintain

## Decision: Option B (State Lifting with Dynamic Margin)

**Rationale**:
- **User experience**: Maintains consistent spacing (always same margin between sidebar and content)
- **Space efficiency**: Content expands to fill available space when sidebar collapses
- **React patterns**: State lifting is standard React pattern for shared state
- **Animation control**: Synchronized transitions (both elements animate with same 300ms timing)
- **Accessibility**: Smooth animation respects `prefers-reduced-motion` if configured
- **Maintainability**: Clear single source of truth for collapse state

## Implementation

**State Management Changes**:
```typescript
// Before: State in Sidebar.tsx
const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

// After: State lifted to LayoutWrapper.tsx
const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false;
});

// Sidebar receives state as props
<Sidebar
  isCollapsed={isCollapsed}
  setIsCollapsed={setIsCollapsed}
/>
```

**Dynamic Content Margin**:
```typescript
// LayoutWrapper.tsx
<div className={showSidebar
  ? `${isCollapsed ? 'md:ml-16' : 'md:ml-64'} ml-0 flex-1 transition-all duration-300`
  : 'flex-1'
}>
  {children}
</div>
```

**Files Modified**:
- `app/components/navigation/LayoutWrapper.tsx` - Lifted state, added dynamic margin
- `app/components/navigation/Sidebar.tsx` - Accept state as props, removed internal state

## Consequences

**Enables**:
- Smooth synchronized animations between sidebar and content
- Consistent spacing in all states (expanded/collapsed/mobile)
- Single source of truth for sidebar collapse state
- Future extensibility (e.g., content can adjust layout based on available width)

**Trade-offs**:
- Slightly more complex than keeping state local to Sidebar
- LayoutWrapper now owns sidebar-related state (acceptable for layout coordination)

## Technical Details

**Animation Timing**:
- Sidebar width: `transition-all duration-300` (300ms)
- Content margin: `transition-all duration-300` (300ms)
- Both use same easing function (ease-in-out) for synchronized motion

**Mobile Behavior**:
- Content always uses `ml-0` on mobile (no left margin)
- Dynamic margin only applies on desktop (`md:` breakpoint)

**SSR Compatibility**:
- localStorage read wrapped in `typeof window !== 'undefined'` check
- Default to `false` (expanded) on server-side render

## Related Decisions

- Navigation color hierarchy (gray vs blue) - same refinement batch
- Sidebar padding optimization for collapsed state - same refinement batch
- SVG icon replacement throughout navigation - same refinement batch

## Review Date

No review needed unless:
- Performance issues with layout reflow (monitor with Chrome DevTools)
- User requests alternative collapse behavior (e.g., overlay mode)
- Mobile behavior needs adjustment
