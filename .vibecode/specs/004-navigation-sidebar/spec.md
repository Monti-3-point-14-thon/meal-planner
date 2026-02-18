# Feature Specification: Navigation Sidebar

**Feature Branch**: `004-navigation-sidebar`
**Created**: 2026-02-18
**Status**: Draft
**Classification**: NEUTRAL Work (Infrastructure - reliable, functional, not differentiated)

---

## Overview

**Core Job**: Provide consistent, accessible navigation between app sections with modern collapsible sidebar UX.

**User Need**: Users need a persistent, discoverable way to navigate between main app sections (Dashboard, Meal Plans, Profile, Settings) and quickly access the primary action (Create Plan).

**Why Now**: With Feature 003 complete (authentication + persistence), users now have multiple app sections to navigate between. Current UX lacks consistent navigation structure.

---

## User Scenarios & Testing (PRIORITIZED)

### User Story 1 - Core Navigation Structure (Priority: P1)

**As a** logged-in user
**I want** to navigate between main app sections
**So that** I can access Dashboard, Meal Plans, Profile, and Settings without getting lost

**Why this priority**: Core functionality - users can't use the app without basic navigation.

**Independent Test**: Can test by clicking each navigation link and verifying correct page loads.

**Acceptance Scenarios**:
1. **Given** user is on Dashboard, **When** user clicks "Meal Plans" in sidebar, **Then** navigates to /meal-plans page
2. **Given** user is on any page, **When** user clicks "Dashboard" in sidebar, **Then** navigates to /dashboard page
3. **Given** user is on any page, **When** user clicks "Profile" in sidebar, **Then** navigates to /settings/profile page
4. **Given** user is on any page, **When** user clicks "Create a Plan" CTA button, **Then** navigates to /generate page
5. **Given** user is on any page, **When** user clicks "Log out" button, **Then** logs out and redirects to sign-in page
6. **Given** user is on a navigation target page, **When** viewing sidebar, **Then** current page link is visually highlighted (active state)

**Routes to be renamed**:
- `/history` → `/meal-plans` (update all references)

---

### User Story 2 - Collapsible Sidebar (Priority: P2)

**As a** user on any screen size
**I want** to collapse the sidebar to save screen space
**So that** I have more room to view my meal plans and content

**Why this priority**: Enhances UX but P1 navigation must work first.

**Independent Test**: Can test by clicking collapse toggle and verifying sidebar animates to icon-only mode.

**Acceptance Scenarios**:
1. **Given** sidebar is expanded, **When** user clicks collapse button/icon, **Then** sidebar collapses to icon-only mode (logo, icons only)
2. **Given** sidebar is collapsed, **When** user clicks expand button/icon, **Then** sidebar expands to full width with text labels
3. **Given** sidebar state is expanded, **When** user refreshes page, **Then** sidebar remains expanded (state persists)
4. **Given** sidebar state is collapsed, **When** user refreshes page, **Then** sidebar remains collapsed (state persists)
5. **Given** sidebar is collapsed, **When** user hovers over nav icon, **Then** tooltip shows label text (optional enhancement)

**Collapse behavior**:
- **Expanded**: Logo + app name, full button text, full menu labels
- **Collapsed**: Logo only (no app name), icon-only buttons, icon-only menu items
- **Transition**: Smooth width animation (200-300ms)

---

### User Story 3 - Mobile Responsive Behavior (Priority: P3)

**As a** mobile user
**I want** the navigation to adapt to small screens
**So that** I can navigate the app on my phone

**Why this priority**: Mobile-first per constitution, but desktop experience is baseline.

**Independent Test**: Can test by resizing browser to mobile width and verifying navigation is accessible.

**Acceptance Scenarios**:
1. **Given** screen width < 768px, **When** page loads, **Then** sidebar is hidden by default
2. **Given** sidebar is hidden on mobile, **When** user taps hamburger menu icon, **Then** sidebar slides in from left (overlay)
3. **Given** sidebar is open on mobile, **When** user taps outside sidebar or clicks a link, **Then** sidebar closes
4. **Given** sidebar is open on mobile, **When** user swipes left, **Then** sidebar closes (optional enhancement)

**Mobile behavior**:
- **< 768px**: Sidebar hidden, hamburger menu icon in top-left
- **≥ 768px**: Sidebar always visible (collapsible via toggle)

---

### User Story 4 - Polish & Accessibility (Priority: P4)

**As a** keyboard or screen reader user
**I want** to navigate the sidebar using keyboard and assistive tech
**So that** the app is accessible to all users

**Why this priority**: Accessibility is important per constitution, but after core functionality works.

**Independent Test**: Can test by tabbing through navigation and verifying all controls are accessible.

**Acceptance Scenarios**:
1. **Given** sidebar is visible, **When** user presses Tab key, **Then** focus moves through navigation links in logical order
2. **Given** navigation link is focused, **When** user presses Enter/Space, **Then** navigates to that page
3. **Given** sidebar is collapsed on mobile, **When** user presses Escape key, **Then** sidebar closes
4. **Given** user is using screen reader, **When** navigating sidebar, **Then** all links and buttons have descriptive labels
5. **Given** user focuses on navigation link, **When** viewing focus state, **Then** visible focus ring appears (WCAG AA)

**Accessibility requirements**:
- Semantic HTML (`<nav>`, `<button>`, `<a>`)
- ARIA labels for icon-only buttons when collapsed
- Focus visible states (focus ring)
- Keyboard navigation (Tab, Enter, Escape)
- Skip link to main content (optional)

---

## Edge Cases

- **What happens when user navigates to /settings?** Settings page placeholder should work (stub page for now, functionality added later)
- **What happens on /auth/signin page?** Sidebar should NOT appear on authentication pages (unauthenticated views)
- **What happens when user is on /generate page?** "Create a Plan" CTA should be highlighted as active route
- **What happens if user manually types /history in URL?** Redirect to /meal-plans (301 permanent redirect or Next.js rewrite)
- **What happens on very narrow mobile screens (<375px)?** Collapsed sidebar still fits, mobile overlay is full-width
- **What happens when user has long username/email?** Truncate with ellipsis in Profile section (if displaying user info)

---

## Requirements

### Functional Requirements

- **FR-001**: Sidebar MUST display on all authenticated pages except /auth routes
- **FR-002**: Sidebar MUST contain logo + app name section at top (collapsed: logo only)
- **FR-003**: Sidebar MUST contain "Create a Plan" CTA button with distinct color (DaisyUI primary)
- **FR-004**: Sidebar MUST contain navigation links: Dashboard, Meal Plans
- **FR-005**: Sidebar MUST contain Settings section at bottom with: Profile, Settings (placeholder), Log out button
- **FR-006**: Sidebar MUST highlight active route with visual indicator (background color, border, icon)
- **FR-007**: Sidebar MUST support collapse/expand functionality with state persistence (localStorage)
- **FR-008**: Sidebar MUST be responsive: hidden by default on mobile (<768px), always visible on desktop
- **FR-009**: Sidebar MUST animate collapse/expand transition smoothly (200-300ms)
- **FR-010**: Route /history MUST redirect to /meal-plans (301 redirect)
- **FR-011**: Logout button MUST sign out user and redirect to /auth/signin

### Non-Functional Requirements

- **NFR-001**: Sidebar collapse state MUST persist across page refreshes (localStorage)
- **NFR-002**: All navigation interactions MUST be keyboard accessible
- **NFR-003**: Sidebar MUST meet WCAG AA contrast requirements (constitution standard)
- **NFR-004**: Sidebar MUST load without layout shift (CLS score < 0.1)
- **NFR-005**: Mobile sidebar overlay MUST not block scroll on main content when closed

### Key Entities

No new database entities. This is a UI-only feature.

**UI State**:
- **SidebarState**: `{ isCollapsed: boolean }` (stored in localStorage as `sidebar-collapsed`)
- **ActiveRoute**: Derived from current URL path (no persistence needed)

---

## Design Specifications

### Layout Structure

```
┌─────────────────────────────────────┐
│ Sidebar (expanded)                  │
├─────────────────────────────────────┤
│ [Logo] App Name              [<]    │ ← Collapse toggle
├─────────────────────────────────────┤
│                                     │
│ [+] Create a Plan   (CTA button)    │ ← Primary action
│                                     │
│ [📊] Dashboard                      │ ← Active: highlighted
│ [📋] Meal Plans                     │
│                                     │
│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  │
│                                     │
│ Settings                            │
│ [👤] Profile                        │
│ [⚙️] Settings                        │
│                                     │
│ [🚪] Log out                        │
│                                     │
└─────────────────────────────────────┘

┌──────┐
│ Side │   ← Collapsed mode
├──────┤
│ [🍽️] │   ← Logo only
│ [>]  │   ← Expand toggle
├──────┤
│      │
│ [+]  │   ← CTA icon
│      │
│ [📊] │   ← Icons only
│ [📋] │
│      │
│ ┈┈┈┈ │
│      │
│ [👤] │
│ [⚙️] │
│      │
│ [🚪] │
│      │
└──────┘
```

### Visual Design (Using Design System Tokens)

**Sidebar Container**:
- Width (expanded): 256px (w-64)
- Width (collapsed): 64px (w-16)
- Background: `bg-base-200` (DaisyUI)
- Border right: `border-r border-base-300`
- Height: `h-screen` (full viewport height)
- Position: `fixed` on desktop, `fixed z-50` overlay on mobile
- Padding: `p-4` (expanded), `p-2` (collapsed)
- Transition: `transition-all duration-300 ease-in-out`

**Logo Section**:
- Padding bottom: `pb-4 mb-4`
- Border bottom: `border-b border-base-300`
- Display: `flex items-center gap-3`
- Logo size: 32px × 32px (placeholder square or uploaded logo)
- App name: `text-lg font-semibold text-base-content`
- Collapse toggle: Icon button, right-aligned

**CTA Button ("Create a Plan")**:
- Base: `btn btn-primary w-full` (DaisyUI)
- Margin: `mb-6` (24px spacing below)
- Icon: `+` or `✨` (positioned left)
- Collapsed: Icon only, `btn-circle btn-primary`

**Navigation Links**:
- Base: `flex items-center gap-3 px-3 py-2 rounded-lg`
- Spacing: `space-y-1` (4px between links)
- Hover: `hover:bg-base-300 transition-colors`
- Active: `bg-primary text-primary-content font-medium`
- Icon size: 20px
- Text: `text-sm text-base-content`
- Collapsed: Icons only, centered, padding adjusted

**Settings Section**:
- Margin top: `mt-auto` (pushes to bottom)
- Border top: `border-t border-base-300 pt-4 mt-4`
- Same link styling as navigation

**Mobile Hamburger Menu**:
- Position: `fixed top-4 left-4 z-50`
- Button: `btn btn-ghost btn-circle`
- Icon: `☰` (hamburger) or Icon component
- Only visible on `<768px`

**Mobile Overlay Background**:
- Background: `bg-black bg-opacity-50`
- Backdrop blur: `backdrop-blur-sm`
- Click closes sidebar

### Icons (Use Emoji or Icon Library)

**Option 1**: Unicode emoji (zero dependencies)
- Dashboard: 📊
- Meal Plans: 📋 or 🍽️
- Profile: 👤
- Settings: ⚙️
- Log out: 🚪
- Create Plan: ➕ or ✨
- Collapse: ◀️ / ▶️

**Option 2**: React Icons or Heroicons (if already in dependencies)
- Dashboard: ChartBarIcon
- Meal Plans: ClipboardDocumentListIcon
- Profile: UserIcon
- Settings: Cog6ToothIcon
- Log out: ArrowRightOnRectangleIcon

**Recommendation**: Use emoji for MVP (zero setup), upgrade to icon library if needed in Phase 2.

---

## Technical Constraints

- **Framework**: Next.js 15 with App Router (existing)
- **Styling**: Tailwind CSS + DaisyUI (existing design system)
- **State Management**: localStorage for collapse state, React useState for UI state
- **Routing**: Next.js `next/navigation` Link component
- **Authentication**: NextAuth signOut() for logout button

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: All navigation links load target pages in <200ms (Next.js client-side routing)
- **SC-002**: Sidebar collapse state persists across 100% of page refreshes
- **SC-003**: Sidebar is keyboard navigable with 0 tab traps or broken focus states
- **SC-004**: Mobile sidebar opens/closes smoothly on 100% of devices tested (iOS Safari, Android Chrome)
- **SC-005**: Sidebar passes WCAG AA contrast checker (all text 4.5:1+ contrast ratio)
- **SC-006**: Zero console errors or warnings related to navigation component
- **SC-007**: Logout successfully signs out user and redirects to /auth/signin 100% of time

### User Validation

- **UV-001**: Users can navigate to any app section without confusion (0 support requests about "how to get to X")
- **UV-002**: Users discover "Create a Plan" CTA quickly (visually distinct from other links)
- **UV-003**: Mobile users can access navigation without frustration (hamburger menu is discoverable)

---

## Out of Scope (Future Enhancements)

These are explicitly NOT part of this feature but may be added later:

- **User profile info in sidebar** (avatar, name, email) - can add in Phase 2
- **Badge/notification dots** on navigation links (e.g., "3 new meal plans") - can add when notification system exists
- **Search bar in sidebar** - YAGNI (You Aren't Gonna Need It) until proven useful
- **Keyboard shortcuts** (e.g., Cmd+K for Create Plan) - nice-to-have, not essential
- **Sidebar themes** (dark/light toggle) - defer to global theme system
- **Sub-navigation** (e.g., Meal Plans > Archived, Favorites) - defer until navigation complexity increases
- **Breadcrumbs** - defer until multi-level navigation exists

---

## Dependencies

### Internal

- **Feature 003**: Database & Auth Infrastructure (authentication, user sessions) ✅ Complete
- **Feature 002**: Design system tokens (colors, spacing) ✅ Available

### External

- `next/navigation` (Link, usePathname, useRouter) - ✅ Built-in
- `next-auth/react` (signOut) - ✅ Installed
- `react` (useState, useEffect) - ✅ Installed

---

## Migration Notes

### Route Rename: /history → /meal-plans

**Files to Update**:
1. Rename directory: `app/history/` → `app/meal-plans/`
2. Update internal links in components (search for `/history` across codebase)
3. Add redirect in `next.config.js` or middleware:

```javascript
// Option 1: next.config.js redirects
redirects: async () => [
  {
    source: '/history',
    destination: '/meal-plans',
    permanent: true, // 301 redirect
  },
],
```

**Why rename?**
- "Meal Plans" is more descriptive than "History"
- Matches user mental model (viewing saved plans, not just history)
- Aligns with navigation label consistency

---

## Implementation Notes

### Component Structure (Suggested)

```
app/
├── components/
│   └── navigation/
│       ├── Sidebar.tsx           // Main sidebar container
│       ├── SidebarLogo.tsx       // Logo + app name + collapse toggle
│       ├── SidebarNav.tsx        // Navigation links (Dashboard, Meal Plans)
│       ├── SidebarSettings.tsx   // Settings section (Profile, Settings, Logout)
│       ├── SidebarCTA.tsx        // "Create a Plan" button
│       └── MobileMenuButton.tsx  // Hamburger menu for mobile
├── layout.tsx                    // Add <Sidebar /> here (for authenticated routes)
└── meal-plans/                   // Renamed from /history
    └── page.tsx
```

### State Management

**Sidebar Collapse State** (localStorage):
```typescript
const [isCollapsed, setIsCollapsed] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false;
});

useEffect(() => {
  localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
}, [isCollapsed]);
```

**Active Route Detection**:
```typescript
import { usePathname } from 'next/navigation';

const pathname = usePathname();
const isActive = (path: string) => pathname === path || pathname.startsWith(path);
```

### Mobile Behavior

**Breakpoint**: 768px (Tailwind `md:` breakpoint)

```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Close mobile menu when route changes
useEffect(() => {
  setIsMobileMenuOpen(false);
}, [pathname]);
```

---

## Testing Strategy

### Manual Testing Checklist

**Desktop (≥768px)**:
- [ ] All navigation links load correct pages
- [ ] Active route is highlighted
- [ ] "Create a Plan" CTA navigates to /generate
- [ ] Sidebar collapse/expand works smoothly
- [ ] Collapse state persists after refresh
- [ ] Logout button signs out and redirects
- [ ] Keyboard navigation works (Tab through all links)
- [ ] Focus states are visible
- [ ] /history redirects to /meal-plans

**Mobile (<768px)**:
- [ ] Sidebar hidden by default
- [ ] Hamburger menu button visible and functional
- [ ] Sidebar slides in from left when opened
- [ ] Sidebar closes when link clicked
- [ ] Sidebar closes when clicking outside
- [ ] Sidebar closes when pressing Escape key
- [ ] Mobile overlay backdrop visible and functional

**Accessibility**:
- [ ] All links and buttons have accessible names (screen reader)
- [ ] Focus ring visible on all interactive elements
- [ ] ARIA labels present for icon-only buttons (collapsed state)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Semantic HTML used (<nav>, <a>, <button>)

### Browser Testing

- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

### Performance

- [ ] No layout shift when sidebar loads (CLS < 0.1)
- [ ] Page transitions remain fast (<200ms)
- [ ] No console errors or warnings

---

## Risks & Mitigation

- **Risk**: Sidebar pushes content horizontally, breaking existing layouts
  - **Mitigation**: Use CSS Grid or Flexbox in layout.tsx to create sidebar + content columns, ensure content area is responsive

- **Risk**: localStorage not available in SSR, causes hydration mismatch
  - **Mitigation**: Initialize sidebar state only on client side (check `typeof window !== 'undefined'`), or use useEffect to read localStorage after mount

- **Risk**: Mobile overlay z-index conflicts with other modals
  - **Mitigation**: Use z-50 for sidebar, document z-index scale in design system, test with existing modal components

- **Risk**: /history → /meal-plans redirect breaks existing bookmarks
  - **Mitigation**: Use 301 permanent redirect, redirect is transparent to users, bookmarks auto-update over time

- **Risk**: Icon-only collapsed sidebar is confusing (low discoverability)
  - **Mitigation**: Add tooltips on hover for collapsed state (optional), or keep labels visible with smaller font

---

## Estimated Complexity

**Complexity**: Medium

**Estimated Timeline**: 2-3 days

**Breakdown**:
- **Day 1**: Sidebar component structure, navigation links, routing, /history rename
- **Day 2**: Collapse/expand functionality, state persistence, mobile responsive behavior
- **Day 3**: Polish (animations, accessibility, testing, edge cases)

**Why 2-3 days?**
- Sidebar UI is straightforward (using existing DaisyUI components)
- State management is simple (localStorage + useState)
- Responsive behavior requires testing across breakpoints
- Accessibility requires keyboard and screen reader testing
- Route rename requires careful find/replace and redirect setup

---

## Related Features

- **Feature 002**: Settings UX Improvements (design system tokens reused here)
- **Feature 003**: Database & Auth Infrastructure (NextAuth signOut used here)
- **Future**: User profile info in sidebar (can add avatar, name when Profile entity has UI)
- **Future**: Notifications/badges (can add to navigation links when notification system exists)

---

## Changelog

### Version 1.0 (2026-02-18) - Initial Draft
- Specified core navigation structure, collapsible sidebar, mobile responsive, accessibility
- Defined 4 prioritized user stories (P1-P4)
- Route rename planned: /history → /meal-plans
- Estimated 2-3 days implementation

---

## Approval

- [ ] Spec reviewed by Adrien Muller
- [ ] Technical approach validated
- [ ] Ready for planning phase (/vibecode:plan)
