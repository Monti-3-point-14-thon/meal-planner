# Implementation Tasks: Navigation Sidebar

**Feature**: 004-navigation-sidebar
**Timeline**: 2-3 days
**Phases**: 4 (P1-P4)
**Total Tasks**: 42

---

## Phase 1: Core Navigation Structure (P1) - Day 1
**User Story**: P1 - Core Navigation Structure
**Goal**: All navigation links work, active highlighting, logout functional.
**Checkpoint**: Can navigate to all pages, logout works, active route highlights.

### Setup Tasks

- [ ] **T001**: Create component directory structure
  - Create: `app/components/navigation/` directory
  - Files: New directory only
  - Dependencies: None
  - Estimated: 5 min
  - **Why**: Organize all navigation components in one place

- [ ] **T002**: Create `Sidebar.tsx` skeleton (no collapse yet)
  - Create: `app/components/navigation/Sidebar.tsx`
  - Implementation:
    ```typescript
    'use client';

    import { usePathname } from 'next/navigation';
    import { useState } from 'react';
    import SidebarLogo from './SidebarLogo';
    import SidebarCTA from './SidebarCTA';
    import SidebarNav from './SidebarNav';
    import SidebarSettings from './SidebarSettings';

    export default function Sidebar() {
      const pathname = usePathname();
      const [isCollapsed, setIsCollapsed] = useState(false); // No localStorage yet
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      return (
        <nav
          role="navigation"
          aria-label="Main navigation"
          className={`fixed left-0 top-0 h-screen bg-base-200 border-r border-base-300 p-4 transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="flex flex-col h-full">
            <SidebarLogo isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
            <SidebarCTA isCollapsed={isCollapsed} />
            <SidebarNav isCollapsed={isCollapsed} pathname={pathname} />
            <SidebarSettings isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </nav>
      );
    }
    ```
  - Dependencies: T001
  - Estimated: 30 min
  - **Why**: Main container that orchestrates all sidebar components

- [ ] **T003**: Implement `SidebarLogo.tsx`
  - Create: `app/components/navigation/SidebarLogo.tsx`
  - Implementation:
    ```typescript
    interface SidebarLogoProps {
      isCollapsed: boolean;
      onToggleCollapse: () => void;
    }

    export default function SidebarLogo({ isCollapsed, onToggleCollapse }: SidebarLogoProps) {
      return (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-base-300">
          {/* Logo placeholder (32x32px) */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xl">
            🍽️
          </div>

          {/* App name (hidden when collapsed) */}
          {!isCollapsed && (
            <span className="text-lg font-semibold text-base-content ml-3">
              Meal Planner
            </span>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="btn btn-ghost btn-sm btn-circle ml-auto"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '▶️' : '◀️'}
          </button>
        </div>
      );
    }
    ```
  - Dependencies: T001
  - Estimated: 20 min
  - **Why**: Logo, app name, and collapse toggle in one component

- [ ] **T004**: Implement `SidebarCTA.tsx`
  - Create: `app/components/navigation/SidebarCTA.tsx`
  - Implementation:
    ```typescript
    import Link from 'next/navigation';

    interface SidebarCTAProps {
      isCollapsed: boolean;
    }

    export default function SidebarCTA({ isCollapsed }: SidebarCTAProps) {
      return (
        <Link
          href="/generate"
          className={`btn btn-primary mb-6 ${isCollapsed ? 'btn-circle' : 'w-full'}`}
          aria-label="Create a new meal plan"
        >
          {isCollapsed ? (
            <span className="text-lg">➕</span>
          ) : (
            <>
              <span className="text-lg">➕</span>
              <span>Create a Plan</span>
            </>
          )}
        </Link>
      );
    }
    ```
  - Dependencies: T001
  - Estimated: 15 min
  - **Why**: Primary action button with distinct color

- [ ] **T005**: Implement `SidebarNav.tsx`
  - Create: `app/components/navigation/SidebarNav.tsx`
  - Implementation:
    ```typescript
    import Link from 'next/link';

    interface SidebarNavProps {
      isCollapsed: boolean;
      pathname: string;
    }

    const navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/meal-plans', label: 'Meal Plans', icon: '📋' },
    ];

    export default function SidebarNav({ isCollapsed, pathname }: SidebarNavProps) {
      const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

      return (
        <div className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-content font-medium'
                    : 'hover:bg-base-300 text-base-content'
                }`}
                aria-current={active ? 'page' : undefined}
                aria-label={isCollapsed ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      );
    }
    ```
  - Dependencies: T001
  - Estimated: 25 min
  - **Why**: Navigation links with active highlighting

- [ ] **T006**: Implement `SidebarSettings.tsx`
  - Create: `app/components/navigation/SidebarSettings.tsx`
  - Implementation:
    ```typescript
    'use client';

    import Link from 'next/link';
    import { signOut } from 'next-auth/react';

    interface SidebarSettingsProps {
      isCollapsed: boolean;
      pathname: string;
    }

    const settingsItems = [
      { href: '/settings/profile', label: 'Profile', icon: '👤' },
      { href: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    export default function SidebarSettings({ isCollapsed, pathname }: SidebarSettingsProps) {
      const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

      const handleLogout = () => {
        signOut({ callbackUrl: '/auth/signin' });
      };

      return (
        <div className="mt-auto border-t border-base-300 pt-4 space-y-1">
          {settingsItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-content font-medium'
                    : 'hover:bg-base-300 text-base-content'
                }`}
                aria-current={active ? 'page' : undefined}
                aria-label={isCollapsed ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 text-error cursor-pointer w-full"
            role="button"
            tabIndex={0}
            aria-label="Log out of your account"
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && <span className="text-sm">Log out</span>}
          </button>
        </div>
      );
    }
    ```
  - Dependencies: T001, NextAuth
  - Estimated: 25 min
  - **Why**: Settings links + logout button at bottom

- [ ] **T007**: Implement `LayoutWrapper.tsx`
  - Create: `app/components/navigation/LayoutWrapper.tsx`
  - Implementation:
    ```typescript
    'use client';

    import { usePathname } from 'next/navigation';
    import Sidebar from './Sidebar';

    interface LayoutWrapperProps {
      children: React.ReactNode;
    }

    export default function LayoutWrapper({ children }: LayoutWrapperProps) {
      const pathname = usePathname();

      // Hide sidebar on auth pages
      const showSidebar = !pathname.startsWith('/auth');

      return (
        <div className="flex">
          {showSidebar && <Sidebar />}
          <div className={showSidebar ? 'md:ml-64 ml-0 flex-1' : 'flex-1'}>
            {children}
          </div>
        </div>
      );
    }
    ```
  - Dependencies: T002-T006
  - Estimated: 20 min
  - **Why**: Handles sidebar visibility logic (hide on /auth routes)

### Layout Integration

- [ ] **T008**: Update `app/layout.tsx` to use LayoutWrapper
  - Modify: `app/layout.tsx`
  - Changes:
    ```typescript
    // Import LayoutWrapper
    import LayoutWrapper from './components/navigation/LayoutWrapper';

    // Wrap children with LayoutWrapper
    <AuthProvider>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </AuthProvider>
    ```
  - Dependencies: T007
  - Estimated: 10 min
  - **Why**: Integrate sidebar into app layout

### Route Rename

- [ ] **T009**: Rename `/history` directory to `/meal-plans`
  - Move: `app/history/` → `app/meal-plans/`
  - Files: All files in history directory
  - Dependencies: None
  - Estimated: 5 min
  - **Why**: "Meal Plans" is more descriptive than "History"

- [ ] **T010**: Add redirect from `/history` to `/meal-plans`
  - Modify: `next.config.js`
  - Add:
    ```javascript
    async redirects() {
      return [
        {
          source: '/history',
          destination: '/meal-plans',
          permanent: true, // 301 redirect
        },
      ];
    }
    ```
  - Dependencies: T009
  - Estimated: 10 min
  - **Why**: Preserve existing bookmarks/links

- [ ] **T011**: Search and update all `/history` references in codebase
  - Search: `grep -r "/history" app/ components/ --exclude-dir=node_modules`
  - Update: All references to use `/meal-plans`
  - Files: TBD (found via grep)
  - Dependencies: T009
  - Estimated: 15 min
  - **Why**: Ensure no broken links

### Testing Phase 1

- [ ] **T012**: Test P1 functionality (all navigation links work)
  - Manual test:
    - [ ] Click Dashboard link → navigates to /dashboard
    - [ ] Click Meal Plans link → navigates to /meal-plans
    - [ ] Click Profile link → navigates to /settings/profile
    - [ ] Click Settings link → navigates to /settings
    - [ ] Click Create Plan CTA → navigates to /generate
    - [ ] Click Logout → signs out and redirects to /auth/signin
    - [ ] Active route is highlighted (current page has bg-primary)
    - [ ] /history URL redirects to /meal-plans (301)
    - [ ] Sidebar does NOT appear on /auth/signin page
  - Dependencies: T002-T011 complete
  - Estimated: 30 min
  - **Checkpoint**: P1 works independently before moving to P2

---

## Phase 2: Collapsible Sidebar (P2) - Day 2 (AM)
**User Story**: P2 - Collapsible Sidebar
**Goal**: Sidebar expands/collapses, state persists, smooth animation.
**Checkpoint**: Collapse/expand works, state persists across refresh.

### State Persistence

- [ ] **T013**: Add localStorage state persistence to `Sidebar.tsx`
  - Modify: `app/components/navigation/Sidebar.tsx`
  - Changes:
    ```typescript
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('sidebar-collapsed') === 'true';
      }
      return false; // Default: expanded
    });

    useEffect(() => {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }, [isCollapsed]);
    ```
  - Dependencies: Phase 1 complete
  - Estimated: 15 min
  - **Why**: Persist collapse state across sessions

### Animation Polish

- [ ] **T014**: Verify smooth collapse transition (already in T002)
  - Verify: `transition-all duration-300 ease-in-out` in Sidebar
  - Test: Collapse/expand should animate smoothly (200-300ms)
  - Dependencies: T013
  - Estimated: 10 min
  - **Why**: Ensure visual polish

### Layout Adjustment

- [ ] **T015**: Update `LayoutWrapper.tsx` to adjust content margin for collapsed state
  - Modify: `app/components/navigation/LayoutWrapper.tsx`
  - Changes:
    ```typescript
    // Pass isCollapsed to LayoutWrapper or read from Sidebar context
    // For now, use CSS classes:
    <div className={showSidebar ? 'md:ml-64 ml-0 flex-1' : 'flex-1'}>
    // Sidebar CSS handles width change (w-64 → w-16)
    // Content margin auto-adjusts via flexbox
    ```
  - Note: If needed, add React Context for isCollapsed state (defer if not needed)
  - Dependencies: T013
  - Estimated: 15 min
  - **Why**: Ensure content area adjusts when sidebar collapses

### Testing Phase 2

- [ ] **T016**: Test P2 functionality (collapse/expand + persistence)
  - Manual test:
    - [ ] Click collapse toggle → sidebar collapses to icon-only (w-16)
    - [ ] Text labels hidden when collapsed
    - [ ] Icons remain visible when collapsed
    - [ ] Click expand toggle → sidebar expands to full width (w-64)
    - [ ] Refresh page → collapsed state persists
    - [ ] Close browser, reopen → collapsed state persists
    - [ ] Animation is smooth (200-300ms, no jank)
    - [ ] Content area adjusts margin correctly
  - Dependencies: T013-T015 complete
  - Estimated: 20 min
  - **Checkpoint**: P2 works independently

---

## Phase 3: Mobile Responsive Behavior (P3) - Day 2 (PM)
**User Story**: P3 - Mobile Responsive Behavior
**Goal**: Mobile users get hamburger menu, sidebar slides in as overlay.
**Checkpoint**: Mobile sidebar opens/closes, hamburger menu works.

### Mobile Menu Button

- [ ] **T017**: Implement `MobileMenuButton.tsx`
  - Create: `app/components/navigation/MobileMenuButton.tsx`
  - Implementation:
    ```typescript
    interface MobileMenuButtonProps {
      onClick: () => void;
      isOpen: boolean;
    }

    export default function MobileMenuButton({ onClick, isOpen }: MobileMenuButtonProps) {
      return (
        <button
          onClick={onClick}
          className="fixed top-4 left-4 z-50 md:hidden btn btn-ghost btn-circle"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          <span className="text-2xl">☰</span>
        </button>
      );
    }
    ```
  - Dependencies: Phase 2 complete
  - Estimated: 15 min
  - **Why**: Hamburger menu toggle for mobile

### Mobile State Management

- [ ] **T018**: Add mobile menu state to `Sidebar.tsx`
  - Modify: `app/components/navigation/Sidebar.tsx`
  - Changes:
    ```typescript
    // Already has isMobileMenuOpen state from T002
    // Add auto-close on route change:
    useEffect(() => {
      setIsMobileMenuOpen(false);
    }, [pathname]);
    ```
  - Dependencies: T017
  - Estimated: 10 min
  - **Why**: Close menu when user navigates

### Mobile Styling

- [ ] **T019**: Update `Sidebar.tsx` for mobile overlay behavior
  - Modify: `app/components/navigation/Sidebar.tsx`
  - Changes:
    ```typescript
    // Desktop: always visible
    // Mobile: hidden by default, overlay when open
    <nav
      className={`
        fixed left-0 top-0 h-screen bg-base-200 border-r border-base-300 p-4 z-50
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Sidebar content */}
    </nav>

    {/* Mobile backdrop */}
    {isMobileMenuOpen && (
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
        aria-hidden="true"
      />
    )}
    ```
  - Dependencies: T018
  - Estimated: 25 min
  - **Why**: Slide-in overlay for mobile

### LayoutWrapper Mobile Integration

- [ ] **T020**: Update `LayoutWrapper.tsx` to include MobileMenuButton
  - Modify: `app/components/navigation/LayoutWrapper.tsx`
  - Changes:
    ```typescript
    import MobileMenuButton from './MobileMenuButton';

    // Add state (or lift from Sidebar via Context if needed)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    {showSidebar && (
      <>
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isOpen={isMobileMenuOpen}
        />
      </>
    )}
    ```
  - Dependencies: T017-T019
  - Estimated: 20 min
  - **Why**: Wire up hamburger menu to sidebar state

### Keyboard Support

- [ ] **T021**: Add Escape key support to close mobile menu
  - Modify: `app/components/navigation/Sidebar.tsx`
  - Changes:
    ```typescript
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);
    ```
  - Dependencies: T019
  - Estimated: 15 min
  - **Why**: Accessibility (keyboard users can close menu)

### Testing Phase 3

- [ ] **T022**: Test P3 functionality (mobile responsive)
  - Manual test (resize browser to <768px or use device):
    - [ ] Sidebar hidden by default on mobile
    - [ ] Hamburger menu button visible in top-left
    - [ ] Click hamburger → sidebar slides in from left
    - [ ] Backdrop overlay visible (semi-transparent black)
    - [ ] Click backdrop → sidebar closes
    - [ ] Click navigation link → sidebar closes
    - [ ] Press Escape key → sidebar closes
    - [ ] Sidebar is full-height on mobile
    - [ ] Test on iPhone Safari (iOS)
    - [ ] Test on Chrome Android
  - Dependencies: T017-T021 complete
  - Estimated: 30 min
  - **Checkpoint**: P3 works independently

---

## Phase 4: Polish & Accessibility (P4) - Day 3
**User Story**: P4 - Polish & Accessibility
**Goal**: Keyboard navigation, ARIA labels, design system docs.
**Checkpoint**: Accessible, documented, tested across browsers.

### Accessibility Audit

- [ ] **T023**: Add ARIA labels to all buttons in collapsed state
  - Modify: All navigation components (SidebarCTA, SidebarNav, SidebarSettings)
  - Verify: All buttons have `aria-label` when collapsed (icon-only)
  - Example: `aria-label="Create a new meal plan"` on CTA
  - Dependencies: Phase 3 complete
  - Estimated: 20 min
  - **Why**: Screen readers need descriptive labels

- [ ] **T024**: Add `role="navigation"` and semantic HTML audit
  - Verify: `<nav role="navigation" aria-label="Main navigation">` in Sidebar
  - Verify: All links use `<a>` or Next.js `<Link>`
  - Verify: All buttons use `<button>` (not divs with onClick)
  - Dependencies: T023
  - Estimated: 15 min
  - **Why**: Semantic HTML for accessibility

- [ ] **T025**: Add `aria-current="page"` to active links
  - Verify: Already implemented in T005 (SidebarNav) and T006 (SidebarSettings)
  - Test: Screen reader announces "current page" on active link
  - Dependencies: T024
  - Estimated: 10 min
  - **Why**: Screen readers announce current location

- [ ] **T026**: Keyboard navigation test
  - Manual test:
    - [ ] Press Tab → focus moves through all navigation links
    - [ ] Press Enter/Space on focused link → navigates
    - [ ] Press Escape on mobile → closes sidebar
    - [ ] No tab traps (can exit sidebar with Tab)
    - [ ] Focus ring visible on all interactive elements
  - Dependencies: T025
  - Estimated: 20 min
  - **Why**: Ensure keyboard accessibility

- [ ] **T027**: Screen reader test (VoiceOver on Mac, NVDA on Windows)
  - Manual test:
    - [ ] All links announced correctly
    - [ ] Sidebar state announced (collapsed/expanded)
    - [ ] Active link announced as "current page"
    - [ ] All buttons have descriptive labels
  - Dependencies: T026
  - Estimated: 25 min
  - **Why**: Ensure screen reader accessibility

### Animation & Visual Polish

- [ ] **T028**: Review all transition animations
  - Verify:
    - [ ] Sidebar collapse/expand: 300ms ease-in-out
    - [ ] Mobile slide-in: 300ms ease-in-out
    - [ ] Hover states: smooth (transition-colors)
    - [ ] No janky animations (test on low-end device)
  - Dependencies: T027
  - Estimated: 15 min
  - **Why**: Visual polish

- [ ] **T029**: Add hover states to all interactive elements
  - Verify: All links and buttons have `hover:bg-base-300` or similar
  - Verify: Logout button has `hover:bg-base-300 text-error`
  - Dependencies: T028
  - Estimated: 10 min
  - **Why**: Visual feedback on hover

### Edge Case Handling

- [ ] **T030**: Verify `/settings` page exists or create placeholder
  - Check: Does `app/settings/page.tsx` exist?
  - If not, create:
    ```typescript
    export default function SettingsPage() {
      return (
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <p className="text-base-content/70">Coming soon...</p>
        </div>
      );
    }
    ```
  - Dependencies: None (can run in parallel)
  - Estimated: 10 min
  - **Why**: Prevent 404 when clicking Settings link

- [ ] **T031**: Test very narrow mobile screens (<375px)
  - Test on iPhone SE (375px) or narrower
  - Verify: Collapsed sidebar still fits (w-16 = 64px)
  - Verify: Mobile overlay is full-width
  - Dependencies: T030
  - Estimated: 10 min
  - **Why**: Edge case testing

- [ ] **T032**: Test logo placeholder displays correctly
  - Verify: Logo emoji 🍽️ or gradient box displays
  - Verify: Logo doesn't overflow or break layout
  - Dependencies: T031
  - Estimated: 5 min
  - **Why**: Visual consistency

### Design System Documentation

- [ ] **T033**: Create `.vibecode/memory/design-system/navigation-sidebar-pattern.md`
  - Create: `.vibecode/memory/design-system/navigation-sidebar-pattern.md`
  - Content:
    1. Component hierarchy diagram
    2. Styling tokens (width, spacing, colors, transitions)
    3. States (expanded, collapsed, mobile overlay, active link)
    4. Responsive behavior (desktop vs mobile)
    5. Accessibility (semantic HTML, ARIA labels, keyboard nav)
    6. Usage examples (how to add new nav item)
    7. Icon mapping (Dashboard: 📊, etc.)
  - Dependencies: T030-T032 complete
  - Estimated: 45 min
  - **Why**: User requested design system documentation

- [ ] **T034**: Update `.vibecode/components-registry/ui-components.md`
  - Modify: `.vibecode/components-registry/ui-components.md` (already exists)
  - Add: Navigation components section (already added during planning)
  - Verify: All 7 components documented (Sidebar, SidebarLogo, SidebarNav, SidebarCTA, SidebarSettings, MobileMenuButton, LayoutWrapper)
  - Dependencies: T033
  - Estimated: 15 min
  - **Why**: Component registry for future reference

### Cross-Browser Testing

- [ ] **T035**: Desktop browser testing
  - Test:
    - [ ] Chrome (desktop) - all features work
    - [ ] Safari (desktop) - all features work
    - [ ] Firefox (desktop) - all features work
    - [ ] Edge (desktop) - all features work
  - Dependencies: T034
  - Estimated: 30 min
  - **Why**: Cross-browser compatibility

- [ ] **T036**: Mobile browser testing
  - Test:
    - [ ] Safari iOS (iPhone) - hamburger menu, slide-in
    - [ ] Chrome Android - hamburger menu, slide-in
  - Dependencies: T035
  - Estimated: 20 min
  - **Why**: Mobile compatibility

### Performance Testing

- [ ] **T037**: Check for layout shift (CLS)
  - Use: Chrome DevTools Lighthouse or Core Web Vitals
  - Verify: CLS < 0.1 (no layout shift when sidebar loads)
  - Dependencies: T036
  - Estimated: 15 min
  - **Why**: Performance standards

- [ ] **T038**: Check page transition speed
  - Test: Click navigation links, measure load time
  - Verify: Page transitions < 200ms (Next.js client-side routing)
  - Dependencies: T037
  - Estimated: 10 min
  - **Why**: Performance standards

- [ ] **T039**: Check console for errors/warnings
  - Test: Open browser console, navigate through app
  - Verify: Zero console errors or warnings related to navigation
  - Verify: No hydration mismatches
  - Dependencies: T038
  - Estimated: 10 min
  - **Why**: Code quality

### Final Testing

- [ ] **T040**: Verify all P1-P4 acceptance scenarios
  - Go through spec.md acceptance scenarios for all user stories:
    - [ ] P1: All navigation links work, active highlighting, logout
    - [ ] P2: Collapse/expand works, state persists
    - [ ] P3: Mobile responsive (hamburger, overlay, close)
    - [ ] P4: Keyboard accessible, ARIA labels, focus states
  - Dependencies: T023-T039 complete
  - Estimated: 30 min
  - **Checkpoint**: All user stories work independently and together

- [ ] **T041**: Test edge cases from spec.md
  - Test:
    - [ ] /settings page works (placeholder or real)
    - [ ] /auth/signin does NOT show sidebar
    - [ ] /generate page shows "Create a Plan" as active
    - [ ] /history redirects to /meal-plans (301)
    - [ ] Very narrow mobile (<375px) works
    - [ ] Long app name doesn't break layout
  - Dependencies: T040
  - Estimated: 20 min
  - **Why**: Edge case coverage

### Final Cleanup

- [ ] **T042**: Final code review and cleanup
  - Review: All navigation components
  - Remove: Commented-out code, console.logs, TODOs
  - Format: Run Prettier/ESLint
  - Commit: Git commit with all changes
  - Dependencies: T041 complete
  - Estimated: 20 min
  - **Why**: Code quality before shipping

---

## Task Summary

| Phase | Tasks | Estimated Time | Dependencies |
|-------|-------|----------------|--------------|
| **P1: Core Navigation** | T001-T012 (12 tasks) | ~3.5 hours | None (foundation) |
| **P2: Collapsible** | T013-T016 (4 tasks) | ~1 hour | P1 complete |
| **P3: Mobile Responsive** | T017-T022 (6 tasks) | ~2 hours | P2 complete |
| **P4: Polish & Accessibility** | T023-T042 (20 tasks) | ~5.5 hours | P3 complete |
| **Total** | 42 tasks | **~12 hours** (~1.5-2 days) | - |

**Note**: Estimate is 1.5-2 days of focused work. Original plan estimated 2-3 days, which includes buffer for unexpected issues, testing, and polish.

---

## Parallel Tasks (Opportunities)

Tasks that CAN be done in parallel (no dependencies on each other):

**During P1**:
- T003, T004, T005, T006 can be done in parallel (all depend on T001 only) [P]

**During P4**:
- T030 (Settings placeholder) can be done anytime during P4 [P]
- T033, T034 (Documentation) can be done in parallel [P]

**Note**: For solo developer, sequential is safer (P1 → P2 → P3 → P4).

---

## Testing Checkpoints

### Checkpoint 1 (After T012): Core Navigation Works
- [ ] All navigation links load correct pages
- [ ] Active route highlighting works
- [ ] Logout signs out and redirects
- [ ] /history redirects to /meal-plans
- [ ] Sidebar hidden on /auth pages

### Checkpoint 2 (After T016): Collapsible Works
- [ ] Collapse/expand toggles smoothly
- [ ] State persists across refresh
- [ ] Content area adjusts margin

### Checkpoint 3 (After T022): Mobile Works
- [ ] Hamburger menu opens/closes sidebar
- [ ] Mobile overlay backdrop works
- [ ] Sidebar closes on navigation
- [ ] Escape key closes sidebar

### Checkpoint 4 (After T042): All User Stories Complete
- [ ] P1-P4 acceptance scenarios pass
- [ ] Keyboard accessible (WCAG AA)
- [ ] Cross-browser tested
- [ ] Performance validated (CLS < 0.1, transitions < 200ms)
- [ ] Design system documented

---

## Dependencies Graph

```
T001 (Setup)
├─> T002 (Sidebar skeleton)
├─> T003 (SidebarLogo)
├─> T004 (SidebarCTA)
├─> T005 (SidebarNav)
├─> T006 (SidebarSettings)
└─> T007 (LayoutWrapper) ──> T008 (Layout integration)

T009 (Rename directory)
└─> T010 (Add redirect)
    └─> T011 (Update references)

T012 (Test P1) [Checkpoint]

T013 (localStorage state)
├─> T014 (Animation verify)
├─> T015 (Layout adjustment)
└─> T016 (Test P2) [Checkpoint]

T017 (MobileMenuButton)
├─> T018 (Mobile state)
├─> T019 (Mobile styling)
├─> T020 (LayoutWrapper mobile)
├─> T021 (Escape key support)
└─> T022 (Test P3) [Checkpoint]

T023 (ARIA labels)
└─> T024 (Semantic HTML)
    └─> T025 (aria-current)
        └─> T026 (Keyboard test)
            └─> T027 (Screen reader test)
                └─> T028 (Animation review)
                    └─> T029 (Hover states)
                        └─> T030 (Settings placeholder) [P]
                            └─> T031 (Narrow mobile test)
                                └─> T032 (Logo test)
                                    └─> T033 (Design system doc) [P]
                                        └─> T034 (Component registry) [P]
                                            └─> T035 (Desktop browser test)
                                                └─> T036 (Mobile browser test)
                                                    └─> T037 (CLS check)
                                                        └─> T038 (Page speed check)
                                                            └─> T039 (Console check)
                                                                └─> T040 (Verify acceptance)
                                                                    └─> T041 (Edge cases)
                                                                        └─> T042 (Final cleanup) [Done]
```

---

## Files Created/Modified

### Files Created (10 new files)

1. `app/components/navigation/Sidebar.tsx`
2. `app/components/navigation/SidebarLogo.tsx`
3. `app/components/navigation/SidebarCTA.tsx`
4. `app/components/navigation/SidebarNav.tsx`
5. `app/components/navigation/SidebarSettings.tsx`
6. `app/components/navigation/MobileMenuButton.tsx`
7. `app/components/navigation/LayoutWrapper.tsx`
8. `.vibecode/memory/design-system/navigation-sidebar-pattern.md`
9. `app/settings/page.tsx` (if doesn't exist)
10. `app/meal-plans/` (renamed from history)

### Files Modified (3 files)

1. `app/layout.tsx` (add LayoutWrapper)
2. `next.config.js` (add redirect)
3. `.vibecode/components-registry/ui-components.md` (update registry)

### Files Moved (1 directory)

1. `app/history/` → `app/meal-plans/` (directory rename)

---

## Implementation Order

**Recommended**: Sequential execution (P1 → P2 → P3 → P4)

1. **Day 1 (AM)**: P1 - Core Navigation (T001-T012)
   - Focus: Get all navigation links working
   - Checkpoint: Can navigate entire app

2. **Day 1 (PM) or Day 2 (AM)**: P2 - Collapsible (T013-T016)
   - Focus: Add collapse/expand functionality
   - Checkpoint: State persists across refresh

3. **Day 2 (PM)**: P3 - Mobile Responsive (T017-T022)
   - Focus: Mobile hamburger menu + overlay
   - Checkpoint: Mobile UX works smoothly

4. **Day 3 (All Day)**: P4 - Polish & Accessibility (T023-T042)
   - Focus: Accessibility, documentation, testing
   - Checkpoint: Production-ready

---

## Success Criteria

All criteria from spec.md must pass:

- **SC-001**: All navigation links load in <200ms ✓
- **SC-002**: Collapse state persists 100% of refreshes ✓
- **SC-003**: Keyboard navigable with 0 tab traps ✓
- **SC-004**: Mobile sidebar opens/closes smoothly ✓
- **SC-005**: WCAG AA contrast (4.5:1+) ✓
- **SC-006**: Zero console errors ✓
- **SC-007**: Logout works 100% of time ✓

---

## Ready to Implement!

Once this task breakdown is approved, run:
```
/vibecode:implement
```

This will execute tasks sequentially, logging decisions and updating component registry as we build.
