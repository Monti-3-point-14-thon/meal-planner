# Decision Log Index

**Last Updated**: 2026-02-19
**Purpose**: Track all technical decisions, their current status, and relationships

---

## Active Decisions

### Feature 001: Meal Plan Generator
- **2026-02-11-ai-model-selection.md** - Gemini 1.5 Flash (free tier) for MVP
- **2026-02-11-tavily-validation.md** - Scientific validation integration
- **2026-02-11-ux-decisions.md** - UX/UI design choices

### Feature 002: Design System
- **2026-02-12-data-migration-strategy.md** - CulturalContext schema migration
- **2026-02-12-flag-implementation.md** - Flag emoji for cuisine display
- **2026-02-12-multi-select-ui-pattern.md** - Dropdown vs modal pattern

### Feature 003: Database & Auth
- **2026-02-14-mongodb-free-tier.md** - MongoDB Atlas M0 for MVP
- **2026-02-14-no-localstorage-migration.md** - Keep localStorage separate from DB
- **2026-02-14-snack-separate-table.md** - Snacks as separate collection
- **2026-02-14-user-profile-separate-model.md** - UserProfile separate from User model

### Feature 004: Navigation Sidebar
- **2026-02-18-sidebar-state-management.md** ✅ ACTIVE (implementation updated Feb 19)
  - localStorage + useState for collapse state
  - State moved to LayoutWrapper for content margin sync
- **2026-02-19-navigation-color-hierarchy.md** ✅ ACTIVE
  - Blue reserved for CTA only, gray for active navigation
- **2026-02-19-navigation-svg-icons-cleanup.md** ✅ ACTIVE
  - All navigation icons now inline SVG (Heroicons style)
  - Supersedes emoji icon strategy
- **2026-02-19-sidebar-content-margin-sync.md** ✅ ACTIVE
  - Dynamic content margin adjusts with sidebar collapse

---

## Archived Decisions

### Superseded Decisions
- **2026-02-11-data-storage-mvp.md** - Early data storage strategy
- **2026-02-18-navigation-icon-strategy.md** ⚠️ SUPERSEDED
  - Original decision: Unicode emoji for speed
  - Superseded by: 2026-02-19-navigation-svg-icons-cleanup.md
  - Reason: User feedback requested professional appearance
  - Date: 2026-02-19

---

## Decision Relationships

### Decision Chains (Evolution)
```
Icon Strategy Evolution:
  2026-02-18-navigation-icon-strategy.md (emoji)
    → SUPERSEDED BY →
  2026-02-19-navigation-svg-icons-cleanup.md (SVG)

State Management Evolution:
  2026-02-18-sidebar-state-management.md (in Sidebar)
    → REFINED BY →
  2026-02-19-sidebar-content-margin-sync.md (lifted to LayoutWrapper)
```

### Cross-Feature Dependencies
- **Profile Creation Flow** depends on:
  - 2026-02-14-user-profile-separate-model.md (data model)
  - 2026-02-12-multi-select-ui-pattern.md (UI patterns)
  - 2026-02-12-flag-implementation.md (cuisine display)

- **Navigation Sidebar** depends on:
  - 2026-02-18-sidebar-state-management.md (state approach)
  - 2026-02-19-navigation-color-hierarchy.md (visual hierarchy)
  - 2026-02-19-navigation-svg-icons-cleanup.md (icon system)

---

## Review Schedule

### Upcoming Reviews
- **After 10 users**: Sidebar state management (cross-device sync need?)
- **After user feedback**: AI model selection (quality sufficient?)
- **After 100 users**: MongoDB free tier (scale limits?)

### No Review Needed (Unless Issues Arise)
- Navigation color hierarchy (industry standard pattern)
- SVG icon implementation (stable pattern)
- UserProfile separate model (architectural decision)
- Snacks separate table (data modeling decision)

---

## Quick Reference

### Currently Implemented
All decisions in `/active/` represent choices currently in production code.

### Historical Context
All decisions in `/archived/` represent past choices that have been superseded or are no longer relevant.

### Adding New Decisions
1. Create file: `YYYY-MM-DD-decision-name.md`
2. Use template structure (see existing decisions)
3. Include: context, options, rationale, consequences, migration path
4. Add to this index under appropriate feature

### Archiving Decisions
Only archive when:
- Decision has been superseded by newer decision
- Implementation has been completely replaced
- Technology choice has been migrated away from

**Do NOT archive** decisions from older features that are still implemented and active.
