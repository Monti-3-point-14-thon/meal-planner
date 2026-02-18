---
skill: strategic-pm
category: leader
weight_default: low
source: Anneka Gupta
vibecoding_phases: [specify]
---

# Strategic PM Thinking

**One-line description:** Think strategically (why) over tactically (what) - outcomes over output.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** strategic, tactical, outcome, output, vision, why, ladders up
- **Workflow phases:** specify
- **Context signals:** Framing features strategically, connecting to business goals

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Framework: Strategic vs Tactical Thinking
**Source:** Anneka Gupta
**When to use:** Framing any feature or product decision

**Strategic Thinking:**
- **Why** are we building this?
- What **problem** does it solve?
- How does it **ladder to** company goals?
- What's the **2-year vision**?

**Tactical Thinking:**
- What features to build?
- How to build it?
- When to ship it?

**Time Horizons:**
```
NOW (0-3 months): What we're shipping
NEXT (3-12 months): What we're building toward
LATER (12+ months): Where we want to be
```

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Frame features strategically:**

Always include:
- **Problem:** User problem + business problem
- **Outcome:** Success metric (X → Y)
- **Strategic Goal:** How this ladders up
- **Vision:** Where this leads (3-12 months)

Example:
```markdown
## Strategic Framing

**Problem:** Solo founders manually review code (2+ hours/day)
**Outcome:** Reduce review time to <30 min/day
**Strategic Goal:** Enable solo founders to ship 10x faster
**Vision:** Become THE code quality tool for solo founders
```
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Feature specification, product strategy, avoiding feature factory
**Optional for:** Tactical implementation work
