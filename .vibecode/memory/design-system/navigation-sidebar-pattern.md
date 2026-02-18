# Navigation Sidebar Pattern

**Created**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Status**: Implemented
**Components**: 7 (Sidebar, SidebarLogo, SidebarNav, SidebarCTA, SidebarSettings, MobileMenuButton, LayoutWrapper)

---

## Overview

The navigation sidebar provides consistent, accessible navigation across the meal planner app. It includes collapsible functionality (desktop) and mobile-responsive overlay behavior.

---

## Component Hierarchy

```
LayoutWrapper (client component)
├── Sidebar (client component)
│   ├── SidebarLogo (logo + app name + collapse toggle)
│   ├── SidebarCTA ("Create a Plan" button)
│   ├── SidebarNav (Dashboard, Meal Plans links)
│   └── SidebarSettings (Profile, Settings, Logout)
└── MobileMenuButton (hamburger menu, mobile only)
```

---

## Styling Tokens

### Sidebar Container

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Width (expanded)** | 256px | `w-64` |
| **Width (collapsed)** | 64px | `w-16` |
| **Background** | Base 200 | `bg-base-200` |
| **Border** | Base 300 (right) | `border-r border-base-300` |
| **Padding (expanded)** | 16px all sides | `p-4` |
| **Padding (collapsed)** | 8px horizontal, 16px vertical | `px-2 py-4` |
| **Position** | Fixed (left) | `fixed left-0 top-0` |
| **Height** | Full viewport | `h-screen` |
| **Transition** | 300ms ease-in-out | `transition-all duration-300` |

### Navigation Links

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Base** | Flex with conditional sizing | `flex items-center rounded-lg transition-colors` |
| **Padding (expanded)** | 12px horizontal, 8px vertical | `px-3 py-2` |
| **Padding (collapsed)** | Centered, 44px touch target | `justify-center w-11 h-11 min-w-[44px]` |
| **Gap (expanded)** | 12px between icon and text | `gap-3` |
| **Border Radius** | Large (8px) | `rounded-lg` |
| **Spacing** | 4px between links | `space-y-1` |
| **Hover** | Base 300 background | `hover:bg-base-300` |
| **Active** | Base 300 background + content color | `bg-base-300 text-base-content font-medium` |
| **Icon Size** | 20px | `text-xl` |
| **Text Size** | 14px | `text-sm` |

### CTA Button

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Base** | Primary button | `btn btn-primary` |
| **Width (expanded)** | Full width | `w-full` |
| **Width (collapsed)** | Circle | `btn-circle` |
| **Margin** | 24px below | `mb-6` |
| **Icon Size** | 18px | `text-lg` |

### Logo Section

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Container** | Flex space-between | `flex items-center justify-between` |
| **Padding Bottom** | 16px | `pb-4` |
| **Margin Bottom** | 16px | `mb-4` |
| **Border** | Base 300 (bottom) | `border-b border-base-300` |
| **Logo Size** | 32x32px (hidden when collapsed) | `w-8 h-8` |
| **App Name** | Large semibold (hidden when collapsed) | `text-lg font-semibold` |
| **Toggle Button** | Clean minimal rounded square | `w-8 h-8 rounded-lg hover:bg-base-300` |
| **Toggle Icon** | SVG chevron, 20px | `w-5 h-5` |

### Settings Section

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Margin Top** | Auto (pushes to bottom) | `mt-auto` |
| **Border** | Base 300 (top) | `border-t border-base-300` |
| **Padding Top** | 16px | `pt-4` |
| **Spacing** | 4px between links | `space-y-1` |
| **Logout Color** | Error (red) | `text-error` |

### Mobile Overlay

| Property | Value | CSS Class |
|----------|-------|-----------|
| **Hamburger Position** | Fixed top-left | `fixed top-4 left-4 z-50` |
| **Hamburger Z-index** | 50 | `z-50` |
| **Sidebar Transform** | Slide from left | `-translate-x-full md:translate-x-0` |
| **Backdrop** | Black 50% opacity + blur | `bg-black bg-opacity-50 backdrop-blur-sm` |
| **Backdrop Z-index** | 40 (below sidebar) | `z-40` |
| **Mobile Breakpoint** | < 768px | `md:hidden` |

---

## States

### Expanded State (Default)
- Width: 256px (`w-64`)
- Logo: Visible
- App name: "Meal Planner" visible
- Navigation labels: Full text visible
- CTA button: Full width with text
- Settings labels: Full text visible
- Toggle icon: ◀️ (collapse)

### Collapsed State
- Width: 64px (`w-16`)
- Padding: 8px horizontal (`px-2 py-4`)
- Logo: Hidden
- App name: Hidden
- Navigation labels: Hidden (icon only with 44px touch target)
- CTA button: Circle (icon only, white SVG plus)
- Settings labels: Hidden (icon only)
- Toggle icon: SVG chevron pointing right (expand)
- Toggle centered in header when logo hidden
- **ARIA labels**: All buttons have `aria-label` for screen readers

### Active Link State
- Background: Base 300 (light gray) (`bg-base-300`)
- Text: Base content color (`text-base-content`)
- Font: Medium weight (`font-medium`)
- **Accessibility**: `aria-current="page"` attribute
- **Note**: Blue color (`bg-primary`) reserved exclusively for CTA button (see decision log)

### Mobile State (< 768px)
- Sidebar: Hidden by default (`-translate-x-full`)
- Hamburger button: Visible (`md:hidden`)
- When open: Sidebar slides in (`translate-x-0`)
- Backdrop: Visible with blur
- On link click: Auto-closes
- On Escape key: Auto-closes
- On backdrop click: Auto-closes

---

## Responsive Behavior

### Desktop (≥ 768px)
- Sidebar always visible (fixed position)
- Collapsible via toggle button
- Main content margin adjusts dynamically: `md:ml-64` (expanded) → `md:ml-16` (collapsed)
- Content margin transition synchronized with sidebar collapse (300ms)
- Smooth collapse animation maintains consistent spacing between sidebar and content
- State persists via localStorage (managed in LayoutWrapper parent component)

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger menu button in top-left corner
- Sidebar appears as overlay (z-50)
- Backdrop overlay behind sidebar (z-40)
- Click outside or on link closes sidebar
- Escape key closes sidebar
- Main content full-width (`ml-0`)

---

## Accessibility

### Semantic HTML
```html
<nav role="navigation" aria-label="Main navigation">
  <a href="/dashboard" aria-current="page"><!-- Active link --></a>
  <button aria-label="Collapse sidebar"><!-- Toggle --></button>
  <button role="button" tabIndex={0} aria-label="Log out"><!-- Logout --></button>
</nav>
```

### ARIA Labels
- Sidebar: `role="navigation"` + `aria-label="Main navigation"`
- Active links: `aria-current="page"`
- Collapsed buttons: `aria-label` with full text (e.g., "Dashboard")
- Toggle button: `aria-label="Expand sidebar"` / `"Collapse sidebar"`
- Logout button: `aria-label="Log out of your account"`
- Mobile menu: `aria-expanded="true|false"` + `aria-label="Open|Close navigation menu"`

### Keyboard Navigation
- **Tab**: Focus moves through all links and buttons
- **Enter/Space**: Activates focused link or button
- **Escape**: Closes mobile menu
- **No tab traps**: User can exit sidebar with Tab key
- **Focus ring**: Visible on all interactive elements (DaisyUI default)

### Screen Readers
- All links and buttons have descriptive text
- Icon-only mode provides context via `aria-label`
- Active link announced as "current page"
- Sidebar state changes announced

### Color Contrast (WCAG AA)
- Primary text on base-200: 4.5:1+ (DaisyUI default)
- Active link (primary content on primary): High contrast
- Error text (logout): 4.5:1+ (DaisyUI default)
- All interactive elements meet WCAG AA standards

---

## Icon Mapping

| Element | Icon Type | Implementation | Description |
|---------|-----------|----------------|-------------|
| **Logo** | Emoji | 🍽️ (U+1F37D) | Fork and knife with plate (hidden when collapsed) |
| **Home** | SVG | Inline SVG (20px) | House icon with roof and door (path: M3 12l2-2m0 0l7-7 7 7...) |
| **Meal Plans** | SVG | Inline SVG (20px) | Clipboard icon (path: M9 5H7a2 2 0 00-2 2v12...) |
| **Profile** | SVG | Inline SVG (20px) | User silhouette (path: M16 7a4 4 0 11-8 0...) |
| **Logout** | SVG | Inline SVG (20px) | Arrow exiting door (path: M17 16l4-4m0 0l-4-4...) |
| **Create Plan** | SVG | Inline SVG (20/24px) | White plus icon (path: M12 4v16m8-8H4) |
| **Collapse** | SVG | Inline SVG (20px) | Left-pointing chevron (path: M15 19l-7-7 7-7) |
| **Expand** | SVG | Inline SVG (20px) | Right-pointing chevron (path: M9 5l7 7-7 7) |
| **Hamburger** | Emoji | ☰ (U+2630) | Trigram for heaven (mobile only) |

**Design Decision**: All navigation icons use inline SVG (Heroicons style) for professional appearance and easy styling. Only logo emoji retained for brand identity. See `.vibecode/memory/decisions/active/2026-02-19-navigation-color-hierarchy.md` for refinement details.

---

## Usage Examples

### Adding a New Navigation Link

**Step 1**: Update `navItems` array in `SidebarNav.tsx`:
```typescript
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/meal-plans', label: 'Meal Plans', icon: '📋' },
  { href: '/recipes', label: 'Recipes', icon: '📖' }, // New link
];
```

**Step 2**: Active highlighting and ARIA labels are handled automatically.

### Changing Sidebar Width

**Expanded width** (default 256px):
```typescript
// In Sidebar.tsx, update className:
className={`... ${isCollapsed ? 'w-16' : 'w-64'}`} // Change 'w-64' to 'w-80' (320px)

// In LayoutWrapper.tsx, update content margin:
className={showSidebar ? 'md:ml-80 ml-0 flex-1' : 'flex-1'} // Match new width
```

**Collapsed width** (default 64px):
```typescript
// In Sidebar.tsx, update className:
className={`... ${isCollapsed ? 'w-20' : 'w-64'}`} // Change 'w-16' to 'w-20' (80px)
```

### Customizing Active Link Styling

Update classes in `SidebarNav.tsx` or `SidebarSettings.tsx`:
```typescript
className={`... ${
  active
    ? 'bg-primary text-primary-content font-medium' // Change to 'bg-accent text-accent-content'
    : 'hover:bg-base-300 text-base-content'
}`}
```

---

## State Persistence

### localStorage Key
- **Key**: `sidebar-collapsed`
- **Values**: `'true'` or `'false'` (string, not boolean)
- **Scope**: Per-browser (not synced across devices)

### Implementation
```typescript
// Initialize from localStorage (SSR-safe)
const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false; // Default: expanded
});

// Persist to localStorage on change
useEffect(() => {
  localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
}, [isCollapsed]);
```

### Migration Path
To sync state across devices (future enhancement):
1. Add `sidebarCollapsed: boolean` field to UserProfile model
2. Create API endpoint: `PATCH /api/user/preferences`
3. Replace localStorage with API call (optimistic updates + fallback)
4. Effort: ~1 day

---

## Animation Timing

| Element | Duration | Easing | CSS Class |
|---------|----------|--------|-----------|
| **Sidebar collapse** | 300ms | Ease-in-out | `transition-all duration-300` |
| **Mobile slide-in** | 300ms | Ease-in-out | `transition-all duration-300` |
| **Hover states** | Default | Default | `transition-colors` |
| **Backdrop fade** | Default | Default | (Browser default) |

---

## Related Components

### Design System (Feature 002)
- `Pill.tsx` - Pattern reference for pills/tags
- `MultiSelectDropdown.tsx` - Pattern reference for dropdowns
- Design tokens: Colors, spacing, DaisyUI components

### Authentication (Feature 003)
- Uses NextAuth `signOut()` in SidebarSettings
- Logout redirects to `/auth/signin`

---

## Testing Checklist

### Desktop (≥768px)
- [ ] All navigation links load correct pages
- [ ] Active route is highlighted
- [ ] "Create a Plan" CTA navigates to /generate
- [ ] Sidebar collapse/expand works smoothly
- [ ] Collapse state persists after refresh
- [ ] Logout button signs out and redirects
- [ ] Keyboard navigation works (Tab through all links)
- [ ] Focus states are visible

### Mobile (<768px)
- [ ] Sidebar hidden by default
- [ ] Hamburger menu button visible and functional
- [ ] Sidebar slides in from left when opened
- [ ] Sidebar closes when link clicked
- [ ] Sidebar closes when clicking outside
- [ ] Sidebar closes when pressing Escape key
- [ ] Mobile overlay backdrop visible and functional

### Accessibility
- [ ] All links and buttons have accessible names (screen reader)
- [ ] Focus ring visible on all interactive elements
- [ ] ARIA labels present for icon-only buttons (collapsed state)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Semantic HTML used (`<nav>`, `<a>`, `<button>`)

---

## Future Enhancements (Out of Scope)

- User profile info in sidebar (avatar, name, email)
- Notification badges on navigation links
- Sub-navigation (expandable sections)
- Tooltips on collapsed icons
- Search bar in sidebar
- Keyboard shortcuts (Cmd+K)
- Sidebar themes (dark/light toggle)

---

## References

- **Decision Log**: Icon strategy (emoji vs icon library) → `.vibecode/memory/decisions/active/2026-02-18-navigation-icon-strategy.md`
- **Decision Log**: State management (localStorage) → `.vibecode/memory/decisions/active/2026-02-18-sidebar-state-management.md`
- **Component Registry**: All 7 components documented → `.vibecode/components-registry/ui-components.md`
- **Design Tokens**: Colors, spacing → `.vibecode/memory/design-system/tokens.md`
