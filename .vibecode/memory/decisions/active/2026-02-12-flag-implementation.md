# Decision: Flag Implementation for Cuisine Display

**Date**: 2026-02-12
**Feature**: 002-settings-ux-improvements
**Context**: Need visual representation of cuisines with country flags in multi-select pills UI

## Options Considered

### Option A: Unicode Emoji Flags
- **Pros**: No dependencies, works cross-platform, 0 KB bundle size, instant implementation
- **Cons**: Limited styling control, may render differently across OS
- **Cost**: 0.5 days implementation

### Option B: Icon Library (flag-icons npm package)
- **Pros**: Consistent rendering across platforms, more styling control, professional appearance
- **Cons**: +50 KB bundle size, new dependency to maintain, version updates required
- **Cost**: 1 day implementation (library integration + testing)

### Option C: SVG Assets
- **Pros**: Full control over appearance, crisp rendering, custom styling
- **Cons**: Need to source/maintain 30+ flag SVGs, licensing considerations, manual updates
- **Cost**: 1.5 days (sourcing + implementation)

## Decision

**Chosen**: **Option A (Unicode Emoji Flags)**

**Rationale**:
1. **Aligns with constitution**: "Neutral Work" classification means "good enough" quality bar - don't over-engineer
2. **Zero dependencies**: Faster implementation (0.5 days vs 1-1.5 days), no bundle size increase
3. **Modern browser support**: Chrome, Safari, Firefox all render emoji flags well in 2026
4. **Progressive enhancement path**: If visual issues arise, can upgrade to icon library in feature 003 (1 day effort)
5. **User base context**: MVP with 0 real users currently - premature to invest in perfect flag rendering

## Consequences

**Enables**:
- Faster feature delivery (5-7 days total vs 6-8 days)
- Zero bundle size impact
- No external dependencies or maintenance burden
- Quick implementation for P1 foundation

**Prevents**:
- Guaranteed consistent rendering across all devices (emoji rendering varies slightly by OS)
- Advanced styling control (size, color tinting, filters)

## Migration Path

**Trigger**: If >10 users report flag rendering issues OR design requires specific styling not possible with emoji

**Effort**: 0.5 days to swap in `flag-icons` library
- Replace `FlagIcon.tsx` emoji logic with library import
- Update Pill component to handle icon component instead of emoji
- Update design system tokens to include icon styles

## Testing Notes

During implementation:
- Test on Chrome, Safari, Firefox (macOS, Windows, iOS, Android)
- Document any rendering inconsistencies
- If issues found on >1 major browser, escalate to upgrade decision

## Review Date

After first 5 real users test the settings form - collect feedback on flag visibility and aesthetics
