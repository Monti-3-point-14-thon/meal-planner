# Decision: Icon Strategy for Navigation Sidebar [SUPERSEDED]

**Date**: 2026-02-18
**Feature**: 004-navigation-sidebar
**Status**: ⚠️ SUPERSEDED by 2026-02-19-navigation-svg-icons-cleanup.md
**Context**: Need icons for navigation links, CTA button, and settings section. App is in MVP phase with 2 users, focusing on speed to validate.

---

## Supersession Notice

**Superseded by**: 2026-02-19-navigation-svg-icons-cleanup.md
**Date superseded**: 2026-02-19
**Reason**: User feedback requested professional appearance and consistent rendering. Migration path (defined below) was executed during Feature 004 refinement phase.

**Current implementation**: All navigation icons now use inline SVG (Heroicons style) instead of Unicode emoji.

---

---

## Options Considered

### Option A: Unicode Emoji ✅ **CHOSEN**
**Pros**:
- Zero dependencies (0 KB bundle size increase)
- Works cross-platform (browser native rendering)
- Fast implementation (no library setup, 0 days)
- Good for MVP/prototype validation
- Simple to implement (just paste emoji in JSX)

**Cons**:
- Limited styling control (can't change color easily)
- May render differently across OS (😊 looks different on Mac vs Windows vs Linux)
- Not as professional appearance as icon library
- Limited selection compared to icon libraries

**Cost**:
- Time: 0 days setup
- Money: $0/mo
- Bundle: +0 KB

### Option B: React Icons / Heroicons Library
**Pros**:
- Consistent rendering across all platforms
- More professional appearance
- Full styling control (color, size, stroke width via props)
- Large icon set (Heroicons: 200+, React Icons: 1000+)
- SVG-based (scalable, crisp at any size)

**Cons**:
- New dependency (+50 KB bundle size for Heroicons, +300 KB for full React Icons)
- 0.5 days setup time (install, import, configure, choose icons)
- Slightly more complex code (`<IconName className="..." />` vs `📊`)
- Over-engineered for NEUTRAL work at MVP stage

**Cost**:
- Time: 0.5 days setup + testing
- Money: $0/mo (open source)
- Bundle: +50-300 KB depending on tree-shaking

### Option C: Custom SVG Icons
**Pros**:
- Full control over design
- Can match brand identity perfectly
- No external dependency
- Optimized file size (only icons we need)

**Cons**:
- Need to source or design icons (1-2 days if custom designed)
- Maintenance overhead (manage SVG files, ensure consistency)
- Over-engineered for NEUTRAL work
- Upfront time investment before shipping

**Cost**:
- Time: 1-2 days (sourcing/design + implementation)
- Money: $0-200 (if hiring designer)
- Bundle: +5-10 KB (minimal)

---

## Decision

**Chosen**: **Option A (Unicode Emoji)**

**Rationale**:
1. **Aligns with Balanced approach** (prototype-leaning for NEUTRAL work per constitution)
   - Constitution: "Clean, functional, actionable. 'Good enough' is fine — ship it and move on."
   - Sidebar is NEUTRAL work (necessary but not differentiated)

2. **Speed to market**:
   - Zero setup time = ship in 2-3 days vs 3-4 days with icon library
   - MVP has only 2 users - speed > perfection at this stage
   - Can validate navigation UX without professional icons

3. **Sufficient for purpose**:
   - Unicode emoji clearly convey meaning (📊 = Dashboard, 📋 = Meal Plans, 🚪 = Logout)
   - Modern browsers render emoji well
   - No performance impact (native browser rendering)

4. **Easy migration path**:
   - If emoji proves limiting, upgrading to icon library is straightforward (1-2 hours find-replace)
   - Decision can be revisited after user feedback

**Alignment with Constitution**:
- **NEUTRAL work quality bar**: "Clean, functional, actionable"
- **Prototype vs Robust**: Acceptable to prototype for unvalidated UI patterns
- **Technical simplicity**: "Choose boring technology" - emoji is simpler than icon libraries

---

## Consequences

**Enables**:
- **Fast implementation**: Ship feature in 2-3 days without icon library setup
- **Zero dependencies**: No new packages to maintain or update
- **Simple codebase**: Easy for junior developers to understand (no icon library abstractions)
- **Flexible migration**: Can upgrade to icon library later without architecture changes

**Prevents**:
- **Professional polish**: Can't achieve pixel-perfect icon design in MVP
- **Brand consistency**: Can't customize icon style to match brand guidelines
- **Color control**: Can't easily change emoji colors to match theme

---

## Migration Path

**Trigger**: Upgrade to icon library when any of these occur:
1. **User feedback**: "Icons look unprofessional" or "Icons inconsistent across devices"
2. **Brand needs**: Require custom icon design to match brand identity
3. **Scale**: Navigation grows to 10+ items (emoji selection becomes limited)
4. **Platform issues**: Emoji rendering inconsistent enough to impact UX

**Effort**: 1-2 hours
1. Install icon library: `npm install react-icons` or `npm install @heroicons/react`
2. Import icons: `import { ChartBarIcon } from '@heroicons/react/24/outline'`
3. Find-replace emoji with icon components:
   ```tsx
   // Before:
   <span>📊</span>

   // After:
   <ChartBarIcon className="w-5 h-5" />
   ```
4. Test: Verify icons render correctly across components

**Risk**: Low (straightforward code change, no architecture impact)

---

## Review Date

**When**: After 10 users provide feedback on navigation UX

**Questions to Ask**:
- Are emoji icons clear and discoverable?
- Do users report rendering issues across devices?
- Does navigation feel professional enough for the app's positioning?

---

## Related Decisions

- **Decision 2**: State Management (localStorage) - also chose simplest approach
- **Constitution**: NEUTRAL work quality bar - "good enough" philosophy
- **Feature 002**: Used emoji flag icons (🇮🇹) successfully - validated approach

---

## Icon Mapping (Documented for Implementation)

**Navigation**:
- Dashboard: 📊 (bar chart)
- Meal Plans: 📋 (clipboard)
- Profile: 👤 (bust in silhouette)
- Settings: ⚙️ (gear)
- Logout: 🚪 (door)

**Actions**:
- Create Plan: ➕ (plus sign) or ✨ (sparkles)
- Collapse: ◀️ (left arrow)
- Expand: ▶️ (right arrow)
- Hamburger: ☰ (trigram for heaven)

**Fallback**: If emoji not rendering correctly, use text labels (e.g., "Dashboard" instead of 📊)
