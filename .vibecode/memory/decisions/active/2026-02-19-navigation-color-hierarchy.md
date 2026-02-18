# Decision: Navigation Color Hierarchy

**Date**: 2026-02-19
**Feature**: 004-navigation-sidebar (refinement)
**Context**: Post-implementation feedback - active navigation links used same blue color as CTA button

## Problem

No visual hierarchy between:
- Primary action (Create a Plan CTA)
- Current location (active navigation link)

Both used `bg-primary` (blue), making it unclear whether blue meant "take action" or "where you are currently". User feedback requested research into best-in-class designs (Notion, Figma, Linear) to improve visual hierarchy.

## Options Considered

### Option A: Keep Blue for Active Links, Change CTA Color
- Active links: `bg-primary` (blue)
- CTA button: Different accent color (green, purple, orange)
- Pros: Active state remains highly visible
- Cons: CTA loses prominence, inconsistent with industry standards, introduces new color to design system

### Option B: Gray for Active Links, Blue for CTA Only (CHOSEN)
- Active links: `bg-base-300` (light gray)
- CTA button: `bg-primary` (blue, exclusive use)
- Pros: Clear hierarchy, matches industry standards (Discord, Slack, Notion, Linear)
- Cons: Slightly less visible active state (but still discoverable)

### Option C: Left Border Accent Instead of Background
- Active links: 3px left border in primary color, no background
- CTA button: `bg-primary` (blue)
- Pros: Minimal, elegant, preserves whitespace
- Cons: Less discoverable, harder to see at a glance, not as common in industry

## Decision: Option B (Gray for Active Links, Blue for CTA Only)

**Rationale**:
- **User mental model**: Blue buttons signal "do something" (action), gray background signals "you are here" (orientation)
- **Industry standard**: This pattern is consistent across Notion, Discord, Slack, Linear, and Figma
- **Visual hierarchy**: Creates clear distinction between "actions to take" and "current state"
- **Design system alignment**: Matches DaisyUI's semantic color usage patterns
- **Accessibility**: Gray background still provides sufficient contrast (4.5:1+ on base-200) for WCAG AA compliance

## Implementation

Simple CSS class changes in navigation components:
- **SidebarNav.tsx** line 26: `bg-primary text-primary-content` → `bg-base-300 text-base-content`
- **SidebarSettings.tsx** line 33: `bg-primary text-primary-content` → `bg-base-300 text-base-content`
- No data migration needed
- No breaking changes to existing functionality

## Consequences

**Enables**:
- Clear visual language: Blue = primary actions throughout the entire app (future consistency)
- Consistent with modern design systems (Material Design, Ant Design, DaisyUI semantic patterns)
- Reduces visual noise by reserving high-saturation blue for actionable elements only

**Trade-offs**:
- Active state is less "loud" than before (intentional - navigation is for orientation, not driving action)
- Users who were accustomed to blue active state may need brief adjustment period (minimal impact)

## Related Decisions

- Collapse toggle redesign (emoji → SVG chevron) - same refinement batch
- Icon sizing optimization for collapsed state - same refinement batch
- Settings route consolidation (removed from navigation) - same refinement batch

## Review Date

No review needed unless user feedback indicates confusion about current page location. If users report difficulty identifying active page, consider Option C (left border accent) as alternative approach.
