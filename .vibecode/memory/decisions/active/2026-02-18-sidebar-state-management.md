# Decision: Sidebar Collapse State Management

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Context**: Need to persist sidebar collapse preference (expanded vs collapsed) across page refreshes and browser sessions. App has 2 users in MVP phase.

---

## Options Considered

### Option A: localStorage + useState ✅ **CHOSEN**
**Pros**:
- Simple implementation (~10 lines of code)
- Works offline (client-side only, no server dependency)
- Persists across sessions (survives browser close/reopen)
- No server-side complexity or API calls
- Standard pattern for UI preferences
- SSR-safe with proper initialization

**Cons**:
- Not available during SSR (requires client-side check to avoid hydration mismatch)
- Not shared across devices (user preference is per-browser)
- 10 MB storage limit (not a concern for single boolean flag)

**Complexity**: Simple

**Code**:
```typescript
const [isCollapsed, setIsCollapsed] = useState(() => {
  // Initialize on client side only (avoid SSR hydration mismatch)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false; // Default: expanded
});

useEffect(() => {
  // Save to localStorage on change
  localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
}, [isCollapsed]);
```

**Bundle Size**: +0 KB (localStorage is native browser API)

### Option B: React Context API
**Pros**:
- Shared state across components (if needed)
- Cleaner than props drilling (if deeply nested components)
- Standard React pattern for global state

**Cons**:
- Adds unnecessary complexity (context provider, custom hook, 40+ lines of code)
- Not needed: Sidebar state only used within Sidebar component tree (shallow hierarchy)
- Still requires localStorage for persistence (doesn't solve problem)
- Over-engineered for single boolean flag

**Complexity**: Medium

**Code**: 40+ lines (context definition, provider component, custom hook)

**Bundle Size**: +0 KB (React Context is built-in, but more code in codebase)

### Option C: URL Parameter (?sidebar=collapsed)
**Pros**:
- State visible in URL (shareable)
- No hydration issues (SSR-safe by default)
- Works without JavaScript enabled
- No localStorage dependency

**Cons**:
- Clutters URL (user experience issue, sidebar state is not shareable content)
- Adds complexity (URL parsing with useSearchParams, updating URL on toggle)
- Not standard pattern for UI preferences
- Persists in history: Back button changes sidebar state (bad UX)
- Can't distinguish between user action and URL manipulation

**Complexity**: Medium

**Code**: 20+ lines (URL parsing, history management)

**Example**:
```typescript
const searchParams = useSearchParams();
const [isCollapsed, setIsCollapsed] = useState(
  searchParams.get('sidebar') === 'collapsed'
);

const handleToggle = () => {
  const newState = !isCollapsed;
  setIsCollapsed(newState);
  const params = new URLSearchParams(searchParams);
  if (newState) {
    params.set('sidebar', 'collapsed');
  } else {
    params.delete('sidebar');
  }
  router.replace(`${pathname}?${params.toString()}`);
};
```

**Bundle Size**: +0 KB (Next.js APIs are built-in)

### Option D: User Profile Database Field
**Pros**:
- Syncs across devices (user logs in on phone, sees same sidebar state)
- Server-side persistent (survives localStorage clear)
- Centralized user preferences (can add more UI preferences later)

**Cons**:
- Over-engineered for MVP (only 2 users, cross-device sync not requested)
- Requires API endpoint (backend changes)
- Requires database migration (add field to UserProfile model)
- Network latency on initial load (must fetch from API)
- Adds complexity (loading states, error handling, caching)
- Not needed: Sidebar preference is typically device-specific (mobile users may prefer different state than desktop)

**Complexity**: High

**Code**: 100+ lines (API route, database query, client-side fetch, loading states, error handling)

**Effort**: 1 day (backend + frontend + testing)

**Bundle Size**: +0 KB (uses existing API infrastructure)

---

## Decision

**Chosen**: **Option A (localStorage + useState)**

**Rationale**:
1. **Simple and sufficient**: Single boolean flag doesn't need complex state management
2. **Standard pattern**: localStorage is the de facto solution for UI preferences (dark mode, sidebar state, font size, etc.)
3. **No props drilling needed**: Sidebar component tree is shallow (Sidebar → child components), passing `isCollapsed` as props is cleaner than Context API
4. **Avoids URL clutter**: Sidebar collapse state is not shareable content, doesn't belong in URL
5. **Aligns with Balanced approach**: Simplest solution that works, no premature optimization

**Alignment with Constitution**:
- **NEUTRAL work**: "Clean, functional, actionable" - localStorage is clean and functional
- **Technical simplicity**: "Choose boring technology" - localStorage is boring (in a good way)
- **Avoid over-engineering**: Context API or database field would be over-engineered for simple boolean flag

---

## Consequences

**Enables**:
- **Fast implementation**: 10 lines of code vs 40+ for Context or 100+ for database
- **Clear code**: Easy for future developers to understand (no abstractions)
- **Easy debugging**: Can inspect localStorage in browser DevTools
- **Offline-first**: Works without server connection

**Prevents**:
- **Cross-device sync**: User preference is per-browser (acceptable - most users have sidebar preference per device type)
- **Server-side default**: Can't set default based on user role or account settings (not needed for MVP)

**Trade-offs Accepted**:
- If user clears browser data, sidebar preference is lost (acceptable - non-critical preference)
- If user switches devices, sidebar state doesn't follow (acceptable - device-specific preference is common)

---

## Migration Path

**Trigger**: Upgrade to database-backed state if:
1. User explicitly requests: "Sync sidebar state across devices"
2. Adding user preferences panel (centralized settings for all UI preferences)
3. Implementing user profiles with role-based defaults (e.g., admin users default to expanded sidebar)

**Effort**: 1 day
1. Add field to UserProfile model: `sidebarCollapsed: boolean`
2. Create API endpoint: `PATCH /api/user/preferences`
3. Replace localStorage with API call:
   ```typescript
   const fetchSidebarState = async () => {
     const res = await fetch('/api/user/preferences');
     const { sidebarCollapsed } = await res.json();
     setIsCollapsed(sidebarCollapsed);
   };

   const saveSidebarState = async (collapsed: boolean) => {
     await fetch('/api/user/preferences', {
       method: 'PATCH',
       body: JSON.stringify({ sidebarCollapsed: collapsed }),
     });
   };
   ```
4. Add loading state, error handling, optimistic updates
5. Test cross-device sync

**Risk**: Low (additive change, can keep localStorage as fallback)

---

## Implementation Notes

### Avoiding SSR Hydration Mismatch

**Problem**: localStorage is not available during server-side rendering (SSR). If we read localStorage during component initialization, server renders with default state but client renders with localStorage state → hydration mismatch error.

**Solution**: Initialize state on client side only

```typescript
// ✅ CORRECT: Initialize with default, then update on client
const [isCollapsed, setIsCollapsed] = useState(false); // SSR default

useEffect(() => {
  // Client-side only
  const stored = localStorage.getItem('sidebar-collapsed');
  if (stored) setIsCollapsed(stored === 'true');
}, []); // Run once on mount

// Alternative: Initialize with function (also works)
const [isCollapsed, setIsCollapsed] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }
  return false; // SSR default
});
```

**Testing**: Verify no hydration errors in dev console when page loads

---

## Storage Key Convention

**Key**: `sidebar-collapsed`
**Value**: `'true'` or `'false'` (string, not boolean)

**Why String**: localStorage only stores strings, explicit string comparison avoids type coercion issues

**Example**:
```typescript
// Save
localStorage.setItem('sidebar-collapsed', isCollapsed.toString());

// Read
const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
```

---

## Review Date

**When**: After 10 users provide feedback

**Questions to Ask**:
- Do users switch devices frequently enough to want cross-device sync?
- Are users clearing browser data and losing sidebar preference?
- Are we adding other UI preferences that should be centralized?

---

## Related Decisions

- **Decision 1**: Icon Strategy (emoji) - also chose simplest approach
- **Constitution**: NEUTRAL work philosophy - don't over-engineer infrastructure
- **Feature 002**: Used localStorage for temporary UI state (multi-select dropdown open/closed) - validated approach
