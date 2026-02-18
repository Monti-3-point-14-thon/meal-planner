---
skill: design-first-dev
category: builder
weight_default: high
source: Brian Chesky (Airbnb) - Design-First Product Development
vibecoding_phases: plan|tasks|implement
---

# Design-First Development

**One-line description:** Craft standards and visual consistency as product quality drivers

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** UI, design, component, visual, user interface, frontend, styling
- **Workflow phases:** /vibecode:plan (architecture decisions), /vibecode:implement (building UI)
- **Context signals:** When building user-facing features that affect visual experience

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Design System Adherence
**Source:** Brian Chesky (Airbnb), Design Systems Movement
**When to use:** Before planning any user-facing feature
**How to apply:** Check design system first, reuse before creating new

**Steps:**
1. Check `.vibecode/memory/design-system/` for existing patterns
2. Review components registry for reusable components
3. Decide: Follow existing OR create new pattern (with justification)

**Example:**

*Feature: Add user profile cards*

Design System Check:
- ✅ Card component exists
- ✅ Avatar component exists
- ✅ Typography scale defined
- ❌ Profile card layout NOT defined

**Decision:** Reuse card + avatar components, create new profile card pattern, add to design system

**Questions to ask:**
- What existing design patterns apply here?
- Are we following or creating patterns?
- If creating new, why can't we reuse existing?

---

### Framework 2: Quality Bar Definition
**Source:** Brian Chesky (Airbnb), Steve Jobs (Apple)
**When to use:** During planning phase to set quality expectations
**How to apply:** Ask quality-bar questions before implementing

**Questions to ask:**
- "What details would users notice and appreciate?"
- "What's the Airbnb-level of polish for this?"
- "Where does simplicity make this better?"
- "What would the '1-star version' vs '5-star version' look like?"

**Example:**

*Feature: File upload component*

Quality Bar Questions:
- Users notice: Drag-and-drop smoothness, loading states, error feedback
- Airbnb-level polish: Animated upload progress, preview thumbnails, clear error states
- Simplicity improvements: Single-zone drop area instead of multiple zones
- 1-star: Basic file input, no feedback
- 5-star: Drag-drop, progress, previews, validation, accessibility

**Decision:** Ship "4-star version" - drag-drop, progress, errors, skip previews for v1

---

### Framework 3: Component Reuse Strategy
**Source:** Modern component-driven development
**When to use:** During planning and implementation
**How to apply:** Check registry, reuse aggressively, document new components

**Steps:**
1. Check `.vibecode/components-registry/existing-components.md`
2. Identify reusable components for this feature
3. Identify NEW components needed
4. Decide which new components should be added to registry (reusable? generic enough?)

**Example:**

*Feature: User settings page*

Component Reuse Analysis:
- **Reusing:** Button, Input, Toggle, Card, Layout
- **Creating (one-off):** Settings page layout
- **Creating (registry-worthy):** SettingsSection component (reusable for future settings)

**Questions to ask:**
- What existing components can we reuse?
- What new components do we need?
- Should new components be added to registry?
- Will other features need this component?

---

## Decision Trees

**Primary decision:** Should we follow existing design patterns or create new ones?

```
IF (design system has relevant pattern):
  → Follow existing pattern
  → Reuse components from registry
  → Document any variations

ELSE IF (no relevant pattern exists):
  → Design new pattern
  → Document in .vibecode/memory/design-system/
  → Add reusable components to registry
  → Justify why existing patterns don't apply

ELSE IF (existing pattern exists but doesn't fit):
  → Ask: "Can we adapt existing pattern?"
  → If yes: Evolve pattern (document change)
  → If no: Create new pattern (document rationale)
```

---

## Action Templates

### Template 1: Design System Check
**Use case:** Before planning any user-facing feature
**Format:**
```markdown
# Design System Check: [Feature Name]

## Existing Patterns
- ✅ [Pattern name] - [Can reuse]
- ✅ [Pattern name] - [Can reuse]
- ❌ [Pattern name] - [Doesn't exist]

## Reusable Components
- [Component name] - [From registry]
- [Component name] - [From registry]

## New Components Needed
- [Component name] - [One-off or registry-worthy?]
- [Component name] - [One-off or registry-worthy?]

## Quality Bar
- Users will notice: [Detail 1], [Detail 2]
- Simplicity improvements: [What to remove/simplify]
- Polish level: [1-star to 5-star, what are we shipping?]

## Decision
[Follow existing patterns OR create new patterns + rationale]
```

**Example:**
```markdown
# Design System Check: User Profile Page

## Existing Patterns
- ✅ Card layout - Can reuse for profile sections
- ✅ Avatar component - Can reuse for profile picture
- ✅ Typography scale - Defined
- ❌ Profile header layout - Doesn't exist yet

## Reusable Components
- Card (from registry)
- Avatar (from registry)
- Button (from registry)
- Tabs (from registry)

## New Components Needed
- ProfileHeader - Registry-worthy (will reuse for org profiles)
- ProfileSection - One-off (too specific)

## Quality Bar
- Users will notice: Avatar quality, bio readability, tab smoothness
- Simplicity improvements: Remove "advanced settings" tab for v1
- Polish level: Shipping "4-star" - smooth, polished, but skip animations

## Decision
Follow existing card/avatar patterns. Create new ProfileHeader component and add to registry. Document profile header layout in design system.
```

---

## Quick Reference

**Key Questions:**
- [ ] What design patterns already exist?
- [ ] What components can we reuse?
- [ ] What new components do we need to create?
- [ ] Should new components be added to registry?
- [ ] What quality bar are we targeting?
- [ ] What would users notice and appreciate?

**Checklists:**
- [ ] Checked `.vibecode/memory/design-system/` for patterns
- [ ] Reviewed `.vibecode/components-registry/` for reusable components
- [ ] Identified reusable vs one-off components
- [ ] Defined quality bar for this feature
- [ ] Documented new patterns (if creating any)

**Memorable Quotes:**
> "The details are not the details. They make the design."
> — Charles Eames

> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci

---

## Common Pitfalls

**Anti-pattern 1:** Creating components without checking registry first
**Why it fails:** Duplicate components, inconsistent UI, wasted effort
**Instead:** Always check registry first, reuse aggressively

**Anti-pattern 2:** No defined quality bar, just "make it look good"
**Why it fails:** Unclear expectations, over-polishing or under-polishing
**Instead:** Define 1-star to 5-star versions, decide what to ship

**Anti-pattern 3:** Every new component goes to registry
**Why it fails:** Registry becomes cluttered with one-off components
**Instead:** Only add generic, reusable components to registry

---

## Related Skills

**Works well with:**
- `quality-speed` - Quality bar decisions inform spectrum positioning
- `zero-to-launch` - Figma simplicity test applies to design scope too
- `ship-decisions` - Polish level affects ship timing

**Sequence suggestions:**
1. Apply `design-first-dev` during planning to check design system
2. Use `quality-speed` to decide polish level (Prototype Fast vs Build Robust)
3. Apply `ship-decisions` to decide when design quality is "ship-worthy"

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
- Ask: "What's the visual experience users expect?"
- Reference existing design patterns early
- Include design quality as success criteria
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan

**1. Reference Design System:**
```bash
Check: .vibecode/memory/design-system/
```
- Colors, typography, spacing, components already defined?
- Should this feature follow existing patterns?
- Or create new patterns? (document if so)

**2. Quality Bar Questions:**
- "What details would users notice and appreciate?"
- "What's the Airbnb-level of polish for this?"
- "Where does simplicity make this better?"

**3. Component Reuse:**
```bash
Check: .vibecode/components-registry/existing-components.md
```
- What existing components can we reuse?
- What new components do we need to create?
- Should new components be added to registry?

**Document using Design System Check template.**
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Tag tasks with component dependencies
- Separate "reuse existing component" vs "create new component" tasks
- Quality bar expectations per task
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
- Reference design system while coding
- Add new reusable components to registry
- Document any design pattern variations
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `high`
**Recommended for:** All user-facing features (web apps, mobile apps, dashboards)
**Optional for:** Backend APIs, CLI tools, infrastructure work

**Enable:**
```json
{
  "skills": {
    "builder": {
      "design-first-dev": {
        "enabled": true,
        "weight": "high"
      }
    }
  }
}
```

---

## Version History

- **v0.1.0** (2026-02-17): Initial skill file created for vibecoding framework
