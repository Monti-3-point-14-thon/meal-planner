# Technical Implementation Plan: Navigation Sidebar

**Feature**: 004-navigation-sidebar
**Created**: 2026-02-18
**Approach**: Balanced (Neutral Work - clean and functional, don't over-engineer)
**Timeline**: 2-3 days
**Complexity**: Medium

---

## Context

**Why This Change**: With authentication and multiple app sections now live (Dashboard, Meal Plans, Profile, Settings), users need a discoverable, persistent way to navigate. Current UX lacks this structure.

**What Prompted It**: Feature 003 complete (auth + persistence), user explicitly requested collapsible sidebar with modern UX.

**Intended Outcome**:
- Users can navigate between all app sections without confusion
- Primary action ("Create a Plan") is visually prominent
- Sidebar collapses for space efficiency, state persists
- Mobile users get hamburger menu + slide-in overlay
- Sidebar pattern documented in design system for future reference

**Classification**: NEUTRAL Work
- Quality bar: Clean, functional, accessible
- Not a differentiator (every app needs navigation)
- Approach: Reuse existing design tokens, build solid UX, don't over-engineer

---

## Overview

**Approach**: Balanced (Prototype-leaning)

**Why Balanced**:
- **Prototype aspects**:
  - Use emoji for icons (zero setup vs icon library)
  - Simple localStorage for state (vs complex state management)
  - CSS transitions (vs animation library)
  - Desktop-first implementation, then mobile adapt
- **Robust aspects**:
  - Proper semantic HTML + ARIA for accessibility (constitution requirement)
  - Design system documentation (user requested, enables future reuse)
  - Component modularity (easy to extend later)
  - Responsive behavior from day 1 (mobile-first per constitution)

**Timeline**: 2-3 days
- Day 1: Core sidebar component structure, navigation links, route rename
- Day 2: Collapse/expand functionality, state persistence, mobile responsive
- Day 3: Polish (animations, accessibility, testing, design system docs)

**Complexity**: Medium
- UI is straightforward (DaisyUI components)
- State management is simple (localStorage + useState)
- Layout integration requires careful testing
- Accessibility + responsive behavior add polish time

---

## Tech Stack

### Core Technologies (Existing - Ship-Fast Boilerplate)

**Framework**: Next.js 15 with App Router ✅
- **Rationale**: Already in use (Ship-Fast), App Router provides server components where beneficial
- **Reference**: `.vibecode/boilerplate/boilerplate-config.json` (enabled: ship-fast)

**Styling**: Tailwind CSS v4.0 + DaisyUI v5.0.50 ✅
- **Rationale**: Existing design system from Feature 002, reuse tokens
- **Reference**: `.vibecode/memory/design-system/tokens.md`
- **Components available**: Pill, MultiSelectDropdown (can reuse patterns)

**Authentication**: NextAuth 5.0 (beta.25) ✅
- **Rationale**: Already integrated in Feature 003, used for logout button
- **Usage**: `signOut()` function from `next-auth/react`

### New Dependencies: None

**Icons**: Unicode emoji (zero dependencies)
- **Rationale**: Prototype-fast approach, works cross-platform, 0 KB bundle size
- **Alternative**: React Icons or Heroicons (defer to Phase 2 if emoji proves limiting)
- **Decision logged**: See Step 7 (Technical Decisions Log)

**State Management**: React useState + localStorage
- **Rationale**: Simple, sufficient for sidebar collapse state
- **No Context API needed**: Sidebar state doesn't need to be shared across many components
- **Alternative**: URL param (defer - unnecessary complexity for MVP)

---

## Architecture

### Layout Integration

**Modified Files**:
- `app/layout.tsx` - Add sidebar container structure

**Current Layout Structure**:
```tsx
<html>
  <body>
    <AuthProvider>
      <main className="min-h-screen bg-base-200">
        {children}
      </main>
    </AuthProvider>
  </body>
</html>
```

**New Layout Structure**:
```tsx
<html>
  <body>
    <AuthProvider>
      <LayoutWrapper>
        {/* LayoutWrapper handles sidebar visibility logic */}
        <Sidebar />
        <main className="flex-1 min-h-screen bg-base-200">
          {children}
        </main>
      </LayoutWrapper>
    </AuthProvider>
  </body>
</html>
```

**Why LayoutWrapper**:
- Handles sidebar visibility logic (hide on /auth routes)
- Uses `usePathname()` to detect authenticated vs unauthenticated routes
- Client component (uses hooks), layout.tsx remains server component where possible

---

### Component Structure

**New Directory**: `app/components/navigation/`

```
app/components/navigation/
├── Sidebar.tsx                # Main sidebar container (orchestrates all parts)
├── SidebarLogo.tsx            # Logo + app name + collapse toggle
├── SidebarNav.tsx             # Navigation links (Dashboard, Meal Plans)
├── SidebarCTA.tsx             # "Create a Plan" button (primary action)
├── SidebarSettings.tsx        # Settings section (Profile, Settings, Logout)
├── MobileMenuButton.tsx       # Hamburger menu button (mobile only)
└── LayoutWrapper.tsx          # Layout wrapper (sidebar visibility logic)
```

**Component Hierarchy**:
```
LayoutWrapper (client component)
  ├── Sidebar (client component)
  │   ├── SidebarLogo
  │   ├── SidebarCTA
  │   ├── SidebarNav
  │   └── SidebarSettings
  └── MobileMenuButton (mobile only)
```

**Why This Structure**:
- **Modularity**: Each section is a separate component (easy to modify)
- **Reusability**: SidebarCTA, SidebarNav patterns can be reused if sidebar expands
- **Testability**: Small components are easier to test independently
- **Maintainability**: Clear separation of concerns

---

### Data Model

**No Database Changes**: This is a UI-only feature.

**UI State (Client-Side)**:

```typescript
// Sidebar collapse state (persisted in localStorage)
interface SidebarState {
  isCollapsed: boolean;
}
// Stored as: localStorage.getItem('sidebar-collapsed') = 'true' | 'false'

// Mobile menu state (ephemeral, not persisted)
interface MobileMenuState {
  isOpen: boolean;
}

// Active route (derived from URL, not stored)
type ActiveRoute = string; // pathname from usePathname()
```

**Why localStorage**:
- Simple, works cross-sessions
- No server-side persistence needed (user preference, not critical data)
- Fallback to expanded state if localStorage unavailable

**Why Not Context API**:
- Sidebar state doesn't need to be shared globally
- Props drilling is minimal (only Sidebar → child components)
- Avoids unnecessary context provider complexity

---

### API Design

**No New API Endpoints**: This is a UI-only feature.

**Existing API Used**:
- NextAuth `signOut()` - for logout button
- No changes needed to existing API routes

---

### Component Specifications

#### Sidebar.tsx (Main Container)

**Props**: None (self-contained)

**State**:
```typescript
const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false; // Default: expanded
});

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

const pathname = usePathname(); // Active route detection
```

**Behavior**:
- Reads collapse state from localStorage on mount
- Saves collapse state to localStorage on change
- Provides collapse toggle to SidebarLogo
- Closes mobile menu when pathname changes (route navigation)
- Passes `isCollapsed` and `pathname` to child components

**Styling**:
- **Desktop (≥768px)**: `fixed left-0 top-0 h-screen` (always visible)
- **Mobile (<768px)**: `fixed left-0 top-0 h-screen z-50` (overlay when open)
- **Width (expanded)**: `w-64` (256px)
- **Width (collapsed)**: `w-16` (64px)
- **Transition**: `transition-all duration-300 ease-in-out`
- **Background**: `bg-base-200 border-r border-base-300`

**Accessibility**:
- `<nav role="navigation" aria-label="Main navigation">`
- Focus trap when mobile menu is open (Tab doesn't leave sidebar)
- Escape key closes mobile menu

---

#### SidebarLogo.tsx

**Props**:
```typescript
interface SidebarLogoProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
```

**Layout**:
- Logo (32x32px placeholder or uploaded image)
- App name: "Meal Planner" (hidden when collapsed)
- Collapse toggle button (icon: ◀️ expanded, ▶️ collapsed)

**Styling**:
- Container: `flex items-center justify-between pb-4 mb-4 border-b border-base-300`
- Logo: `w-8 h-8` (placeholder: square div with gradient or emoji 🍽️)
- App name: `text-lg font-semibold text-base-content` (hidden with `hidden` class when collapsed)
- Toggle button: `btn btn-ghost btn-sm btn-circle`

**Accessibility**:
- Toggle button: `aria-label="Collapse sidebar"` / `aria-label="Expand sidebar"`
- Logo: `alt="Meal Planner logo"`

---

#### SidebarCTA.tsx

**Props**:
```typescript
interface SidebarCTAProps {
  isCollapsed: boolean;
}
```

**Layout**:
- Button with icon (➕ or ✨) + text "Create a Plan"
- Navigates to `/generate` page

**Styling**:
- **Expanded**: `btn btn-primary w-full mb-6` (full width, text visible)
- **Collapsed**: `btn btn-primary btn-circle mb-6` (icon only, circular)
- Icon: `text-lg` (18-20px)

**Accessibility**:
- `aria-label="Create a new meal plan"` (especially important when collapsed)

---

#### SidebarNav.tsx

**Props**:
```typescript
interface SidebarNavProps {
  isCollapsed: boolean;
  pathname: string; // Active route
}
```

**Navigation Items**:
```typescript
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/meal-plans', label: 'Meal Plans', icon: '📋' },
];
```

**Active State Detection**:
```typescript
const isActive = (href: string) => pathname === href || pathname.startsWith(href);
```

**Styling**:
- Container: `space-y-1` (4px between links)
- Link base: `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`
- Link hover: `hover:bg-base-300`
- Link active: `bg-primary text-primary-content font-medium`
- Icon: `text-xl` (20px)
- Text: `text-sm text-base-content` (hidden when collapsed)

**Accessibility**:
- Use Next.js `<Link>` for proper routing
- Active link: `aria-current="page"`
- Collapsed state: `aria-label` includes full label (e.g., "Dashboard")

---

#### SidebarSettings.tsx

**Props**:
```typescript
interface SidebarSettingsProps {
  isCollapsed: boolean;
  pathname: string; // Active route
}
```

**Settings Items**:
```typescript
const settingsItems = [
  { href: '/settings/profile', label: 'Profile', icon: '👤' },
  { href: '/settings', label: 'Settings', icon: '⚙️', badge: 'Coming soon' }, // Placeholder
];
```

**Logout Button**:
- Special handling (not a link, executes `signOut()`)
- Icon: 🚪
- Label: "Log out"
- Behavior: Calls `signOut({ callbackUrl: '/auth/signin' })`

**Styling**:
- Container: `mt-auto border-t border-base-300 pt-4` (pushes to bottom)
- Same link styling as SidebarNav
- Logout button: `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 text-error cursor-pointer`

**Accessibility**:
- Logout button: `role="button"`, `tabindex="0"`, `aria-label="Log out of your account"`
- Keyboard: Enter/Space triggers logout

---

#### MobileMenuButton.tsx

**Props**: None

**Context**: Uses `useSidebar()` context (if implemented) or receives toggle function via props

**Styling**:
- Position: `fixed top-4 left-4 z-50 md:hidden` (only visible <768px)
- Button: `btn btn-ghost btn-circle`
- Icon: `☰` (hamburger)

**Accessibility**:
- `aria-label="Open navigation menu"`
- `aria-expanded="false"` / `aria-expanded="true"`

---

#### LayoutWrapper.tsx

**Purpose**: Handles sidebar visibility and layout structure

**Props**:
```typescript
interface LayoutWrapperProps {
  children: React.ReactNode;
}
```

**Logic**:
```typescript
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './navigation/Sidebar';
import MobileMenuButton from './navigation/MobileMenuButton';

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Hide sidebar on auth pages
  const showSidebar = !pathname.startsWith('/auth');

  return (
    <div className="flex">
      {showSidebar && (
        <>
          <Sidebar />
          <MobileMenuButton />
        </>
      )}
      <div className={showSidebar ? 'md:ml-64 ml-0 flex-1' : 'flex-1'}>
        {children}
      </div>
    </div>
  );
}
```

**Why Client Component**:
- Uses `usePathname()` hook (client-side only)
- Layout.tsx can remain server component

**Styling Logic**:
- When sidebar visible (desktop): Main content pushed right by `md:ml-64` (matches expanded sidebar width)
- When sidebar collapsed (desktop): Main content still pushed right by `md:ml-16` (matches collapsed width)
- Mobile: Main content full width (`ml-0`), sidebar is overlay

---

## Implementation Details

### Phase 1: Core Navigation Structure (P1) - Day 1

**Goal**: All navigation links work, active highlighting, logout functional.

**Tasks**:
1. Create component directory structure (`app/components/navigation/`)
2. Implement `Sidebar.tsx` (basic structure, no collapse yet)
3. Implement `SidebarLogo.tsx` (logo + app name, toggle button placeholder)
4. Implement `SidebarCTA.tsx` (Create Plan button)
5. Implement `SidebarNav.tsx` (Dashboard, Meal Plans links)
6. Implement `SidebarSettings.tsx` (Profile, Settings, Logout)
7. Implement `LayoutWrapper.tsx` (sidebar visibility logic)
8. Update `app/layout.tsx` to use `LayoutWrapper`
9. Rename `/history` → `/meal-plans`:
   - Rename directory: `app/history/` → `app/meal-plans/`
   - Add redirect in `next.config.js`:
     ```javascript
     async redirects() {
       return [
         {
           source: '/history',
           destination: '/meal-plans',
           permanent: true, // 301
         },
       ];
     }
     ```
   - Search codebase for `/history` references, update to `/meal-plans`
10. Test: All links navigate, logout works, active state highlights

**Files Created**:
- `app/components/navigation/Sidebar.tsx`
- `app/components/navigation/SidebarLogo.tsx`
- `app/components/navigation/SidebarCTA.tsx`
- `app/components/navigation/SidebarNav.tsx`
- `app/components/navigation/SidebarSettings.tsx`
- `app/components/navigation/LayoutWrapper.tsx`

**Files Modified**:
- `app/layout.tsx` (add LayoutWrapper)
- `next.config.js` (add redirect)
- `app/history/` → `app/meal-plans/` (directory rename)

**Dependencies**: Next.js `usePathname()`, `Link`, `next-auth/react` `signOut()`

---

### Phase 2: Collapsible Sidebar (P2) - Day 2

**Goal**: Sidebar expands/collapses, state persists, smooth animation.

**Tasks**:
1. Add collapse state management to `Sidebar.tsx`:
   - useState with localStorage initialization
   - useEffect to save state on change
2. Wire up toggle button in `SidebarLogo.tsx`
3. Pass `isCollapsed` to all child components
4. Update component styling to handle collapsed state:
   - Hide text labels (`{!isCollapsed && <span>Label</span>}`)
   - Adjust button sizes (full width → circle)
   - Adjust sidebar width (`w-64` → `w-16`)
5. Add CSS transitions (`transition-all duration-300`)
6. Update main content margin to match sidebar width
7. Test: Collapse/expand works, state persists across refresh

**Files Modified**:
- `app/components/navigation/Sidebar.tsx` (state management)
- `app/components/navigation/SidebarLogo.tsx` (toggle wiring)
- `app/components/navigation/SidebarCTA.tsx` (collapsed styling)
- `app/components/navigation/SidebarNav.tsx` (collapsed styling)
- `app/components/navigation/SidebarSettings.tsx` (collapsed styling)

**Dependencies**: localStorage API (browser native)

---

### Phase 3: Mobile Responsive Behavior (P3) - Day 2 (afternoon)

**Goal**: Mobile users get hamburger menu, sidebar slides in as overlay.

**Tasks**:
1. Implement `MobileMenuButton.tsx` (hamburger icon, toggle function)
2. Add mobile state to `Sidebar.tsx`:
   - `isMobileMenuOpen` state
   - Close menu on route change (useEffect watching pathname)
3. Update `Sidebar.tsx` styling for mobile:
   - Desktop: `hidden md:flex` (always visible ≥768px)
   - Mobile: Conditional render based on `isMobileMenuOpen`
   - Overlay background: `bg-black bg-opacity-50 backdrop-blur-sm` (click to close)
4. Add slide-in animation (Tailwind: `translate-x-0` / `translate-x-full`)
5. Test: Hamburger opens menu, clicking outside closes, links close menu

**Files Created**:
- `app/components/navigation/MobileMenuButton.tsx`

**Files Modified**:
- `app/components/navigation/Sidebar.tsx` (mobile state + overlay)
- `app/components/navigation/LayoutWrapper.tsx` (MobileMenuButton integration)

**Dependencies**: Tailwind responsive classes, Next.js `usePathname()` for auto-close

---

### Phase 4: Polish & Accessibility (P4) - Day 3

**Goal**: Keyboard navigation, ARIA labels, animations polish, design system docs.

**Tasks**:
1. **Accessibility audit**:
   - Add ARIA labels to all buttons (especially collapsed state)
   - Add `role="navigation"`, `aria-label="Main navigation"` to sidebar
   - Add `aria-current="page"` to active links
   - Test keyboard navigation (Tab through all links, Enter/Space to activate)
   - Test screen reader (VoiceOver on Mac, NVDA on Windows)
2. **Animation polish**:
   - Smooth transitions for all hover states
   - Easing functions for collapse animation
   - Mobile slide-in animation timing
3. **Edge case handling**:
   - `/settings` placeholder page (stub component if doesn't exist)
   - Long usernames (truncate in Profile link if adding user info later)
   - Very narrow mobile screens (<375px) - test sidebar width
4. **Design system documentation**:
   - Create `.vibecode/memory/design-system/navigation-sidebar-pattern.md`
   - Document component structure, props, styling tokens, usage examples
   - Update `.vibecode/components-registry/ui-components.md` (new file)
5. **Cross-browser testing**:
   - Chrome, Safari, Firefox, Edge (desktop)
   - Safari iOS, Chrome Android (mobile)
6. **Performance check**:
   - No layout shift (CLS < 0.1)
   - Fast page transitions (<200ms)
   - No console errors

**Files Created**:
- `.vibecode/memory/design-system/navigation-sidebar-pattern.md`
- `.vibecode/components-registry/ui-components.md`
- `app/settings/page.tsx` (placeholder stub if doesn't exist)

**Files Modified**:
- All navigation components (ARIA labels, accessibility attributes)

**Dependencies**: None (browser native accessibility APIs)

---

## Technical Decisions Log

### Decision 1: Icon Strategy (Emoji vs Icon Library)

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Context**: Need icons for navigation links, CTA button, settings.

**Options Considered**:

**Option A: Unicode Emoji (Recommended)**
- **Pros**:
  - Zero dependencies (0 KB bundle size)
  - Works cross-platform (browser native)
  - Fast implementation (no library setup)
  - Good for MVP/prototype
- **Cons**:
  - Limited styling control (can't change color)
  - May render differently across OS (😊 looks different on Mac vs Windows)
  - Not as professional as icon library
- **Cost**: 0 days setup, $0/mo

**Option B: React Icons / Heroicons Library**
- **Pros**:
  - Consistent rendering across platforms
  - More professional appearance
  - Full styling control (color, size, stroke)
  - Large icon set (1000+ icons)
- **Cons**:
  - New dependency (+50 KB bundle size)
  - 0.5 days setup time (install, import, configure)
  - Slightly more complex code (`<IconName className="..." />`)
- **Cost**: 0.5 days setup, $0/mo (open source)

**Option C: Custom SVG Icons**
- **Pros**:
  - Full control over design
  - Can match brand perfectly
  - No external dependency
- **Cons**:
  - Need to source or design icons (1-2 days)
  - Maintenance overhead (manage SVG files)
  - Over-engineered for NEUTRAL work
- **Cost**: 1-2 days design, $0/mo

**Decision**: **Option A (Unicode Emoji)**

**Rationale**:
- Aligns with **Balanced approach** (prototype-leaning for NEUTRAL work)
- Constitution: "Good enough is fine — ship it and move on"
- Zero setup time = ship faster (2-3 days vs 3-4 days with icon library)
- Can upgrade to icon library in Phase 2 if emoji proves limiting (easy migration path)

**Migration Trigger**:
- User feedback: "Icons look unprofessional" OR "Icons inconsistent across devices"
- Adding brand-specific icons (need custom design)
- Scaling to 10+ navigation items (emoji selection becomes limited)

**Migration Effort**: 1-2 hours (find-replace emoji with icon components)

**Review Date**: After 10 users provide feedback

---

### Decision 2: State Management (localStorage vs Context API vs URL Param)

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Context**: Need to persist sidebar collapse state across page refreshes.

**Options Considered**:

**Option A: localStorage + useState (Recommended)**
- **Pros**:
  - Simple implementation (10 lines of code)
  - Works offline (client-side only)
  - No server-side complexity
  - Persists across sessions
- **Cons**:
  - Not available during SSR (hydration mismatch if not careful)
  - Not shared across devices (user preference per browser)
- **Complexity**: Simple
- **Code**:
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

**Option B: React Context API**
- **Pros**:
  - Shared state across components (if needed)
  - Cleaner props drilling (if deeply nested)
- **Cons**:
  - Adds complexity (context provider, hook)
  - Not needed (sidebar state only used in Sidebar component tree)
  - Still needs localStorage for persistence
  - Over-engineered for simple boolean flag
- **Complexity**: Medium
- **Code**: 40+ lines (context, provider, hook)

**Option C: URL Parameter (?sidebar=collapsed)**
- **Pros**:
  - State visible in URL (shareable)
  - No hydration issues (SSR-safe)
  - Works without localStorage
- **Cons**:
  - Clutters URL (user experience issue)
  - Adds complexity (URL parsing, updating)
  - Not standard pattern for UI preferences
  - Persists in history (back button changes sidebar state - bad UX)
- **Complexity**: Medium

**Decision**: **Option A (localStorage + useState)**

**Rationale**:
- Simple, sufficient, and standard pattern for UI preferences
- No unnecessary abstraction (Context API not needed for single component tree)
- Avoids URL clutter (Option C)
- Aligns with **Balanced approach** (simple solution for simple problem)

**Consequences**:
- **Enables**: Fast implementation, clear code, easy debugging
- **Prevents**: Sharing collapse state across devices (acceptable - user preference is device-specific)

**Migration Path**: If collapse state needs to sync across devices (unlikely), upgrade to user profile field in database.

**Trigger**: User explicitly requests "sync sidebar state across devices"

**Effort**: 1 day (add field to UserProfile model, API endpoint, replace localStorage with API call)

---

### Decision 3: Mobile Overlay Strategy (Slide-in vs Full-screen vs Bottom Sheet)

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Context**: Mobile screens <768px need different navigation UX.

**Options Considered**:

**Option A: Slide-in Overlay from Left (Recommended)**
- **Pros**:
  - Standard mobile navigation pattern (Gmail, Slack, etc.)
  - Familiar to users (follows mobile UX conventions)
  - Partial backdrop blur (content visible behind)
  - Smooth animation (slide + fade)
- **Cons**:
  - Slightly more complex than full-screen
  - Need to handle click-outside-to-close
- **Implementation**: Tailwind `translate-x-0` / `-translate-x-full` + backdrop

**Option B: Full-screen Overlay**
- **Pros**:
  - Simplest implementation (no backdrop needed)
  - Maximum focus on navigation
- **Cons**:
  - Takes over entire screen (feels heavy)
  - Not standard mobile pattern (less familiar)
  - Harder to show user where they are (no background context)

**Option C: Bottom Sheet (Material Design Style)**
- **Pros**:
  - Modern mobile pattern (Google apps)
  - Thumb-friendly (easier to reach on large phones)
- **Cons**:
  - Non-standard for navigation (usually used for actions)
  - More complex animation (slide up from bottom)
  - Doesn't match desktop pattern (left sidebar)

**Decision**: **Option A (Slide-in Overlay from Left)**

**Rationale**:
- Standard pattern for mobile navigation (high familiarity)
- Matches desktop sidebar position (consistent mental model)
- Provides visual continuity (backdrop shows underlying page)
- Aligns with constitution: "Clarity over cleverness"

**Migration Trigger**: None expected (standard pattern)

---

### Decision 4: Layout Integration (Fixed Sidebar vs Responsive Width)

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Context**: How should main content area adjust when sidebar is present?

**Options Considered**:

**Option A: Fixed Sidebar with Content Margin (Recommended)**
- **Pros**:
  - Sidebar always visible (no scrolling away)
  - Main content pushed right (no overlap)
  - Clean separation (sidebar = 256px, content = rest)
- **Cons**:
  - Reduces content area width (acceptable for dashboard/lists)
- **Implementation**: Sidebar `position: fixed`, content `margin-left: 256px`

**Option B: Relative Sidebar (Scrolls with Page)**
- **Pros**:
  - More content area visible when scrolled down
- **Cons**:
  - Sidebar disappears on scroll (poor UX for navigation)
  - Not standard for app navigation (websites yes, apps no)

**Decision**: **Option A (Fixed Sidebar with Content Margin)**

**Rationale**:
- Standard app pattern (Notion, Linear, Figma all use fixed sidebar)
- Navigation always accessible (no scrolling to find links)
- Constitution: "Clarity over cleverness" (obvious navigation location)

---

## Dependencies

### External Dependencies

**None added** - All dependencies already in place from Ship-Fast boilerplate:
- ✅ `next` (15.5.12) - Link, usePathname, useRouter
- ✅ `react` (19.0.0) - useState, useEffect
- ✅ `next-auth` (5.0.0-beta.25) - signOut function
- ✅ `tailwindcss` (4.0.0) - Styling
- ✅ `daisyui` (5.0.50) - Button components

### Internal Dependencies

**Design System** (Feature 002):
- ✅ `.vibecode/memory/design-system/tokens.md` - Color tokens, spacing scale
- ✅ `app/components/design-system/Pill.tsx` - Pattern reference (not used directly, but same styling approach)

**Authentication** (Feature 003):
- ✅ NextAuth session management - Logout functionality
- ✅ `libs/auth.js` - Auth configuration

**Existing Pages** (Navigation Targets):
- ✅ `/dashboard` - Dashboard page
- ⚠️ `/history` → Rename to `/meal-plans` (Task: Phase 1)
- ✅ `/settings/profile` - Profile page
- ⚠️ `/settings` - Needs placeholder stub if doesn't exist (Task: Phase 4)
- ✅ `/generate` - Meal plan generation page

---

## Component Registry Updates

**New File**: `.vibecode/components-registry/ui-components.md`

**Components to Register**:
1. **Sidebar** (Main Container)
   - Purpose: Main navigation container with collapse functionality
   - Reusability: Medium (specific to app layout, but pattern can be reused)
   - Dependencies: All child components
   - Usage: One per app (in layout.tsx)

2. **SidebarLogo**
   - Purpose: Logo + app name + collapse toggle
   - Reusability: Medium (specific to sidebar, but pattern useful)
   - Props: `isCollapsed`, `onToggleCollapse`

3. **SidebarNav**
   - Purpose: Navigation links with active highlighting
   - Reusability: High (can be used in other navigation contexts)
   - Props: `isCollapsed`, `pathname`
   - Pattern: Useful for any link list with active state

4. **SidebarCTA**
   - Purpose: Primary action button (prominent styling)
   - Reusability: Medium (CTA pattern useful, but specific to navigation)
   - Props: `isCollapsed`

5. **SidebarSettings**
   - Purpose: Settings section + logout button
   - Reusability: Medium (pattern useful for account actions)
   - Props: `isCollapsed`, `pathname`

6. **MobileMenuButton**
   - Purpose: Hamburger menu toggle for mobile
   - Reusability: High (standard mobile menu button)
   - Props: `onClick` (or uses context)

7. **LayoutWrapper**
   - Purpose: Layout logic for sidebar visibility
   - Reusability: Low (specific to this app's layout structure)
   - Props: `children`

---

## Design System Documentation

**New File**: `.vibecode/memory/design-system/navigation-sidebar-pattern.md`

**Content to Document**:
1. **Component Structure** (hierarchy diagram)
2. **Styling Tokens**:
   - Sidebar width (expanded: 256px, collapsed: 64px)
   - Spacing (padding, gaps)
   - Colors (background, borders, active states)
   - Transitions (duration, easing)
3. **States**:
   - Default (expanded)
   - Collapsed
   - Mobile (overlay)
   - Active link highlighting
4. **Responsive Behavior**:
   - Desktop (≥768px): Fixed sidebar, always visible
   - Mobile (<768px): Hidden by default, hamburger menu, slide-in overlay
5. **Accessibility**:
   - Semantic HTML (`<nav>`, `<a>`, `<button>`)
   - ARIA labels (especially for collapsed state)
   - Keyboard navigation patterns
   - Focus states
6. **Usage Examples**:
   - How to add a new nav item
   - How to change active highlighting logic
   - How to adjust sidebar width
7. **Icon Mapping**:
   - Dashboard: 📊
   - Meal Plans: 📋
   - Profile: 👤
   - Settings: ⚙️
   - Logout: 🚪
   - Create Plan: ➕
   - Collapse: ◀️ / ▶️
   - Hamburger: ☰

**Why Document**:
- User explicitly requested: "This is a major design component and should be documented in our design system"
- Enables future developers (or future you) to understand and extend
- Establishes pattern for other navigation contexts (e.g., sub-navigation)

---

## Risks & Mitigation

### Risk 1: Sidebar Pushes Content, Breaking Existing Layouts

**Likelihood**: Medium
**Impact**: High (existing pages may look broken)

**Mitigation**:
1. Test all existing pages after layout integration:
   - `/dashboard`
   - `/meal-plans` (renamed from /history)
   - `/meal-plan/[id]`
   - `/generate`
   - `/settings`
   - `/settings/profile`
2. Use CSS Grid or Flexbox in LayoutWrapper to handle sidebar + content columns
3. Ensure content area is responsive (`flex-1` to fill remaining space)
4. Test at various screen widths (320px, 768px, 1024px, 1440px)

**Fallback**: If major layout issues, add feature flag to toggle sidebar on/off while fixing

---

### Risk 2: localStorage Hydration Mismatch (SSR)

**Likelihood**: Low (with proper implementation)
**Impact**: Medium (console errors, flash of wrong state)

**Mitigation**:
1. Initialize sidebar state on client side only:
   ```typescript
   const [isCollapsed, setIsCollapsed] = useState(false); // SSR default

   useEffect(() => {
     // Client-side only
     const stored = localStorage.getItem('sidebar-collapsed');
     if (stored) setIsCollapsed(stored === 'true');
   }, []);
   ```
2. Alternative: Use `'use client'` directive to make component client-only
3. Test: Server-side render vs client-side render, ensure no mismatch

**Fallback**: If hydration issues persist, remove localStorage, default to expanded state

---

### Risk 3: Mobile Overlay Z-index Conflicts

**Likelihood**: Low
**Impact**: Low (overlay may appear behind modals or other UI)

**Mitigation**:
1. Document z-index scale in design system:
   - Sidebar overlay: `z-50`
   - Modals: `z-60` (if they exist)
   - Toasts: `z-70`
2. Test with existing modal components (MealEditModal, SnackGenerationModal)
3. Ensure mobile overlay is above page content but below modals

**Fallback**: Adjust z-index values if conflicts found

---

### Risk 4: /history → /meal-plans Redirect Breaks Bookmarks

**Likelihood**: Low (very few users currently)
**Impact**: Low (temporary confusion, but redirect fixes it)

**Mitigation**:
1. Use 301 permanent redirect (bookmarks auto-update)
2. Redirect is transparent (users don't see it)
3. Search codebase for all `/history` references:
   ```bash
   grep -r "/history" app/ --exclude-dir=node_modules
   ```
4. Update all internal links to use `/meal-plans`

**Fallback**: None needed (redirect handles all cases)

---

### Risk 5: Icon-only Collapsed Sidebar is Confusing

**Likelihood**: Low (standard pattern)
**Impact**: Low (minor UX friction)

**Mitigation**:
1. Add ARIA labels to all collapsed buttons (screen readers announce full label)
2. Optional: Add tooltips on hover (show full label on icon hover)
3. Expand toggle is always visible (user can expand if confused)

**Fallback**: If user feedback indicates confusion, add persistent labels (smaller font) in collapsed state

---

## Testing Strategy

### Unit Tests: Skip

**Rationale**:
- Constitution: "Don't test basic UI rendering"
- Sidebar is UI-only (no complex business logic)
- Manual testing sufficient for NEUTRAL work

### Integration Tests: Skip

**Rationale**:
- No API integration (UI-only feature)
- NextAuth signOut() already tested in Feature 003

### Manual Testing: Comprehensive

**Desktop (≥768px)**:
- [ ] All navigation links load correct pages
- [ ] Active route is highlighted (Dashboard, Meal Plans, Profile)
- [ ] "Create a Plan" CTA navigates to /generate
- [ ] Sidebar collapse/expand works smoothly (200-300ms animation)
- [ ] Collapse state persists after page refresh
- [ ] Collapse state persists after closing/reopening browser
- [ ] Logout button signs out and redirects to /auth/signin
- [ ] Keyboard navigation: Tab through all links
- [ ] Keyboard navigation: Enter/Space activates links
- [ ] Focus states are visible (focus ring on all interactive elements)
- [ ] /history URL redirects to /meal-plans (301)
- [ ] Sidebar does not appear on /auth/signin page
- [ ] Content area adjusts margin when sidebar collapses

**Mobile (<768px)**:
- [ ] Sidebar hidden by default
- [ ] Hamburger menu button visible in top-left
- [ ] Clicking hamburger opens sidebar (slides in from left)
- [ ] Backdrop overlay visible (semi-transparent black)
- [ ] Clicking backdrop closes sidebar
- [ ] Clicking navigation link closes sidebar
- [ ] Sidebar closes when route changes (auto-close)
- [ ] Escape key closes sidebar
- [ ] Mobile sidebar is full-height (no scroll issues)
- [ ] Test on iPhone Safari (iOS)
- [ ] Test on Chrome Android

**Accessibility**:
- [ ] Screen reader announces all navigation links correctly
- [ ] Screen reader announces sidebar state (collapsed/expanded)
- [ ] ARIA labels present for icon-only buttons (collapsed state)
- [ ] `aria-current="page"` on active link
- [ ] Color contrast meets WCAG AA (4.5:1) - test with contrast checker
- [ ] Semantic HTML: `<nav>`, `<a>`, `<button>` used correctly
- [ ] No tab traps (Tab key moves through all elements, can exit sidebar)

**Cross-browser**:
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)
- [ ] Safari iOS (mobile)
- [ ] Chrome Android (mobile)

**Performance**:
- [ ] No layout shift when sidebar loads (CLS < 0.1)
- [ ] Page transitions remain fast (<200ms)
- [ ] No console errors or warnings
- [ ] No hydration mismatches (check dev console)

**Edge Cases**:
- [ ] `/settings` page exists or shows placeholder
- [ ] Very narrow mobile (<375px) - sidebar still usable
- [ ] Logo placeholder displays correctly
- [ ] Long app name doesn't break layout (test "Meal Planner v2 Pro")
- [ ] Clicking same link twice doesn't break navigation

---

## Estimated Timeline

| Phase | Tasks | Days | Can Parallelize? |
|-------|-------|------|------------------|
| P1: Core Navigation | Component structure, links, route rename | 1.0 | No (foundation) |
| P2: Collapsible | State management, styling, transitions | 0.5 | No (depends on P1) |
| P3: Mobile Responsive | Hamburger menu, overlay, slide-in | 0.5 | Yes (parallel with P2 if careful) |
| P4: Polish & Accessibility | ARIA labels, keyboard nav, docs | 1.0 | No (final polish) |
| **Total Sequential** | | **3.0 days** | |
| **Total with Parallelization** | | **2.5 days** | P2+P3 can overlap |

**Recommended Approach**: Sequential (P1 → P2 → P3 → P4) for solo developer. Ensures each phase tested before moving on.

**Actual Estimate**: 2-3 days (allowing buffer for unexpected issues, testing, and polish)

---

## Related Features

- **Feature 002**: Settings UX Improvements (design system tokens reused)
- **Feature 003**: Database & Auth Infrastructure (NextAuth signOut used)
- **Future**: User profile info in sidebar (can add avatar, name when UI built)
- **Future**: Notifications/badges (can add to navigation links when system exists)
- **Future**: Sub-navigation (e.g., Meal Plans > Archived, Favorites)

---

## Migration Notes

### /history → /meal-plans

**Files to Update**:
1. **Directory rename**: `app/history/` → `app/meal-plans/`
2. **Redirect** (add to `next.config.js`):
   ```javascript
   module.exports = {
     async redirects() {
       return [
         {
           source: '/history',
           destination: '/meal-plans',
           permanent: true, // 301 redirect
         },
       ];
     },
   };
   ```
3. **Internal links** (search and replace):
   ```bash
   # Find all references to /history
   grep -r "/history" app/ components/ --exclude-dir=node_modules

   # Update to /meal-plans
   # Likely files:
   # - app/components/MealPlanCard.tsx (if has links)
   # - Any navigation menus (replaced by new sidebar)
   ```

**Why Rename**:
- "Meal Plans" is more descriptive than "History"
- Matches user mental model (saved plans, not just history)
- Aligns with navigation label consistency

**Testing**:
- [ ] Direct navigation to `/meal-plans` works
- [ ] Old bookmark `/history` redirects to `/meal-plans` (301)
- [ ] All internal links use `/meal-plans`
- [ ] No broken links in app

---

## Changelog

### Version 1.0 (2026-02-18) - Initial Plan
- Defined component architecture (7 components)
- Documented 4 technical decisions (icons, state, mobile, layout)
- Estimated 2-3 days implementation
- Prioritized phases (P1-P4)
- Specified design system documentation requirements (user requested)

---

## Approval Checklist

- [ ] Plan reviewed by Adrien Muller
- [ ] Component structure validated
- [ ] Technical decisions aligned with constitution (Balanced approach for NEUTRAL work)
- [ ] Design system documentation plan confirmed (user explicitly requested)
- [ ] Ready for task breakdown (/vibecode:tasks)
