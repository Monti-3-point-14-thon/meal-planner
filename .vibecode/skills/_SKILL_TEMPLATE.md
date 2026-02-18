---
skill: [skill-name]
category: [builder|strategist|communicator|navigator|leader|measurement|launch]
weight_default: [critical|high|medium|low]
source: [Lenny's Podcast - Guest Name, Episode]
vibecoding_phases: [specify|plan|tasks|implement]
---

# [Skill Name]

**One-line description:** [What this skill does]

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** [comma-separated keywords that trigger this skill]
- **Workflow phases:** [which /vibecode:* commands load this]
- **Context signals:** [what conditions activate this skill]

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: [Name]
**Source:** [Person/Company]
**When to use:** [Conditions]
**How to apply:** [Step-by-step]

**Example:**
[Real-world example from vibecoding context]

**Questions to ask:**
- Question 1
- Question 2
- Question 3

---

### Framework 2: [Name]
**Source:** [Person/Company]
**When to use:** [Conditions]
**How to apply:** [Step-by-step]

**Example:**
[Real-world example from vibecoding context]

**Questions to ask:**
- Question 1
- Question 2
- Question 3

---

## Decision Trees

**Primary decision:** [Main choice this skill helps with]

```
IF [condition]:
  → Apply Framework A
  → Ask questions X, Y, Z
  → Document to [location]

ELSE IF [condition]:
  → Apply Framework B
  → Ask questions A, B, C
  → Document to [location]

ELSE:
  → Default approach
```

---

## Action Templates

### Template 1: [Name]
**Use case:** [When to use this template]
**Format:**
```
[Template structure with placeholders]
```

**Example:**
```
[Filled-in example]
```

---

## Quick Reference

**Key Questions:**
- [ ] Question 1
- [ ] Question 2
- [ ] Question 3

**Checklists:**
- [ ] Action item 1
- [ ] Action item 2

**Memorable Quotes:**
> "Quote from expert"
> — Source

---

## Common Pitfalls

**Anti-pattern 1:** [What to avoid]
**Why it fails:** [Explanation]
**Instead:** [Better approach]

**Anti-pattern 2:** [What to avoid]
**Why it fails:** [Explanation]
**Instead:** [Better approach]

---

## Related Skills

**Works well with:**
- `[skill-name]` - [Why these combine well]
- `[skill-name]` - [Why these combine well]

**Sequence suggestions:**
1. Apply `[this-skill]` first to [outcome]
2. Then apply `[other-skill]` to [outcome]

---

## Vibecoding Integration

### In /vibecode:specify
[How this skill affects specification phase]
- Changes these questions: [list]
- Adds these sections to spec: [list]

### In /vibecode:plan
[How this skill affects planning phase]
- Influences architecture decisions: [how]
- Adds these considerations: [list]

### In /vibecode:tasks
[How this skill affects task breakdown]
- Tags tasks with: [what]
- Affects prioritization: [how]

### In /vibecode:implement
[How this skill affects implementation]
- Decision logging format: [what]
- Code comments/docs: [what to include]

---

## Configuration

**Default weight:** `[weight]`
**Recommended for:** [User types/scenarios]
**Optional for:** [User types/scenarios]

**Enable:**
```json
{
  "skills": {
    "[category]": {
      "[skill-name]": {
        "enabled": true,
        "weight": "[critical|high|medium|low]"
      }
    }
  }
}
```

---

## Version History

- **v0.1.0** (2026-02-16): Initial skill file created for vibecoding framework
