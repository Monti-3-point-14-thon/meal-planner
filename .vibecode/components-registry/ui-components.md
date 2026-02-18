# UI Components Registry

**Last Updated**: 2026-02-18
**Purpose**: Document reusable UI components (non-feature-specific)

---

## Navigation Components (Feature 004)

### Sidebar
**File**: `app/components/navigation/Sidebar.tsx`
**Purpose**: Main navigation container with collapsible functionality
**Status**: ✅ Implemented (Feature 004)

**Features**:
- Collapsible sidebar (expanded 256px, collapsed 64px)
- State persistence via localStorage
- Mobile overlay on <768px screens
- Active route highlighting
- Keyboard accessible

**State Management**:
```typescript
interface SidebarState {
  isCollapsed: boolean;        // Persisted in localStorage
  isMobileMenuOpen: boolean;   // Ephemeral (mobile only)
}
```

**Styling**:
- Desktop: Fixed position, always visible
- Mobile: Fixed overlay, controlled by hamburger menu
- Transition: `transition-all duration-300 ease-in-out`
- Background: `bg-base-200 border-r border-base-300`

**Reusability**: Low
- One per app (integrated in layout.tsx)
- Pattern can be adapted for other navigation contexts

**Accessibility**:
- Semantic HTML: `<nav role="navigation" aria-label="Main navigation">`
- Focus trap when mobile menu open
- Escape key closes mobile menu

**Dependencies**:
- SidebarLogo
- SidebarCTA
- SidebarNav
- SidebarSettings

**Related Design System Docs**: `.vibecode/memory/design-system/navigation-sidebar-pattern.md`

---

### SidebarLogo
**File**: `app/components/navigation/SidebarLogo.tsx`
**Purpose**: Logo + app name + collapse toggle button
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface SidebarLogoProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
```

**Layout**:
- Logo: 32x32px (placeholder or uploaded image)
- App name: "Meal Planner" (hidden when collapsed)
- Toggle button: ◀️ (expanded) / ▶️ (collapsed)

**Styling**:
- Container: `flex items-center justify-between pb-4 mb-4 border-b border-base-300`
- Logo: `w-8 h-8`
- App name: `text-lg font-semibold text-base-content` (hidden when collapsed)
- Toggle: `btn btn-ghost btn-sm btn-circle`

**Reusability**: Medium
- Logo + toggle pattern useful for other collapsible panels
- Can be adapted for other app sections with branding

**Accessibility**:
- Toggle: `aria-label="Collapse sidebar"` / `aria-label="Expand sidebar"`
- Logo: `alt="Meal Planner logo"`

---

### SidebarNav
**File**: `app/components/navigation/SidebarNav.tsx`
**Purpose**: Navigation links with active route highlighting
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface SidebarNavProps {
  isCollapsed: boolean;
  pathname: string; // From usePathname()
}
```

**Navigation Items**:
```typescript
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/meal-plans', label: 'Meal Plans', icon: '📋' },
];
```

**Behavior**:
- Active route detection: `pathname === href || pathname.startsWith(href)`
- Click navigates using Next.js Link (client-side routing)
- Active state: Highlighted with primary color

**Styling**:
- Base: `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`
- Hover: `hover:bg-base-300`
- Active: `bg-primary text-primary-content font-medium`
- Spacing: `space-y-1` (4px between links)

**Reusability**: High ⭐
- Can be used in any navigation context (sidebar, mobile menu, footer)
- Pattern applies to any link list with active highlighting
- Icons can be customized

**Accessibility**:
- Next.js Link for proper routing
- Active link: `aria-current="page"`
- Collapsed: Full label in `aria-label`

**Usage Example**:
```tsx
<SidebarNav
  isCollapsed={false}
  pathname="/dashboard"
/>
// Renders Dashboard as active, Meal Plans as inactive
```

---

### SidebarCTA
**File**: `app/components/navigation/SidebarCTA.tsx`
**Purpose**: Primary action button (Create a Plan) with prominent styling
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface SidebarCTAProps {
  isCollapsed: boolean;
}
```

**Behavior**:
- Navigates to `/generate` page (meal plan generator)
- Visually distinct from navigation links (primary button)

**Styling**:
- Expanded: `btn btn-primary w-full mb-6` (full width, text + icon)
- Collapsed: `btn btn-primary btn-circle mb-6` (icon only, circular)
- Icon: ➕ (plus) or ✨ (sparkles)

**Reusability**: Medium
- CTA button pattern useful for highlighting primary actions
- Can be adapted for other prominent actions in sidebar or navigation

**Accessibility**:
- `aria-label="Create a new meal plan"` (especially important when collapsed)

**Usage Example**:
```tsx
<SidebarCTA isCollapsed={false} />
// Renders: [➕ Create a Plan] (full width button)

<SidebarCTA isCollapsed={true} />
// Renders: [➕] (circular button, icon only)
```

---

### SidebarSettings
**File**: `app/components/navigation/SidebarSettings.tsx`
**Purpose**: Settings section + logout button (bottom of sidebar)
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface SidebarSettingsProps {
  isCollapsed: boolean;
  pathname: string; // From usePathname()
}
```

**Settings Items**:
```typescript
const settingsItems = [
  { href: '/settings/profile', label: 'Profile', icon: '👤' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];
```

**Logout Button**:
- Not a link (executes function)
- Icon: 🚪
- Label: "Log out"
- Action: Calls `signOut({ callbackUrl: '/auth/signin' })` from NextAuth

**Styling**:
- Container: `mt-auto border-t border-base-300 pt-4` (pushes to bottom)
- Links: Same styling as SidebarNav
- Logout: `text-error` (red color to indicate destructive action)

**Reusability**: Medium
- Settings section pattern useful for account/profile actions
- Logout button pattern can be reused in user menus

**Accessibility**:
- Logout: `role="button"`, `tabindex="0"`, `aria-label="Log out of your account"`
- Keyboard: Enter/Space triggers logout

**Usage Example**:
```tsx
<SidebarSettings
  isCollapsed={false}
  pathname="/settings/profile"
/>
// Renders Profile as active, Settings as inactive, Logout button at bottom
```

---

### MobileMenuButton
**File**: `app/components/navigation/MobileMenuButton.tsx`
**Purpose**: Hamburger menu button (mobile only, <768px)
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface MobileMenuButtonProps {
  onClick: () => void;     // Opens mobile sidebar
  isOpen: boolean;         // For aria-expanded state
}
```

**Styling**:
- Position: `fixed top-4 left-4 z-50 md:hidden` (only visible <768px)
- Button: `btn btn-ghost btn-circle`
- Icon: ☰ (trigram, hamburger icon)

**Reusability**: High ⭐
- Standard mobile menu button
- Can be used anywhere a mobile menu toggle is needed

**Accessibility**:
- `aria-label="Open navigation menu"` / `aria-label="Close navigation menu"`
- `aria-expanded="false"` / `aria-expanded="true"`

**Usage Example**:
```tsx
<MobileMenuButton
  onClick={() => setIsMobileMenuOpen(true)}
  isOpen={false}
/>
// Renders: Fixed hamburger button in top-left
```

---

### LayoutWrapper
**File**: `app/components/navigation/LayoutWrapper.tsx`
**Purpose**: Layout logic for sidebar visibility (hides on /auth pages)
**Status**: ✅ Implemented (Feature 004)

**Props**:
```typescript
interface LayoutWrapperProps {
  children: React.ReactNode;
}
```

**Logic**:
- Detects current route using `usePathname()`
- Shows sidebar on all pages except `/auth/*` routes
- Adjusts main content margin to account for sidebar width

**Reusability**: Low
- Specific to this app's layout structure
- Pattern can be adapted for other apps with conditional navigation

**Why Client Component**:
- Uses `usePathname()` hook (client-side only)
- Allows layout.tsx to remain server component

**Usage**:
```tsx
// In app/layout.tsx
<LayoutWrapper>
  {children}
</LayoutWrapper>
// Conditionally renders Sidebar based on route
```

---

## Testing Checklist

**Sidebar**:
- [ ] Renders with all child components
- [ ] Collapse/expand works smoothly
- [ ] State persists across page refreshes
- [ ] Mobile overlay opens/closes correctly
- [ ] No hydration mismatches (SSR)

**SidebarNav**:
- [ ] Active route is highlighted
- [ ] All links navigate correctly
- [ ] Keyboard navigation works

**SidebarCTA**:
- [ ] Navigates to /generate
- [ ] Styling correct in expanded/collapsed states

**SidebarSettings**:
- [ ] Logout button signs out user
- [ ] Logout redirects to /auth/signin
- [ ] Profile/Settings links work

**MobileMenuButton**:
- [ ] Only visible on mobile (<768px)
- [ ] Opens sidebar on click
- [ ] ARIA states update correctly

**Accessibility**:
- [ ] All components keyboard accessible
- [ ] Screen reader announces all elements correctly
- [ ] Focus states visible (WCAG AA)

---

## Design System Documentation

See: `.vibecode/memory/design-system/navigation-sidebar-pattern.md` for:
- Complete styling specifications
- Responsive behavior details
- Animation timing functions
- Icon mapping reference
- Usage examples

---

## Related Components

**Design System** (Feature 002):
- `Pill.tsx` - Pattern reference for pills/tags
- `MultiSelectDropdown.tsx` - Pattern reference for dropdowns

**Auth** (Feature 003):
- Uses NextAuth `signOut()` in SidebarSettings

---

## Future Enhancements (Out of Scope)

- User profile info in sidebar (avatar, name, email)
- Notification badges on navigation links
- Sub-navigation (expandable sections)
- Tooltips on collapsed icons
- Search bar in sidebar
- Keyboard shortcuts (Cmd+K)
