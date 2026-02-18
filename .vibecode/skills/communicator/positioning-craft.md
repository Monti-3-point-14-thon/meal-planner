---
skill: positioning-craft
category: communicator
weight_default: low
source: April Dunford (Obviously Awesome)
vibecoding_phases: [constitution, specify]
---

# Product Positioning Craft

**One-line description:** Define clear product positioning using April Dunford's framework - who it's for, what category, alternatives, unique value, and proof.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** positioning, value prop, differentiation, competitive, alternative, target customer, category
- **Workflow phases:** constitution, specify
- **Context signals:** Defining product positioning, writing value propositions

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework: April Dunford's 5-Component Positioning
**Source:** Obviously Awesome
**When to use:** Defining or refining product positioning
**How to apply:**

**The 5 Components:**

**1. WHO is this best for?**
- Specific segment, not "everyone"
- Example: "Next.js solo founders building AI SaaS"

**2. WHAT category does this fit in?**
- Existing or new category
- Example: "AI code review tool" not "developer tool"

**3. WHAT alternatives exist?**
- What do customers use now?
- Example: "Manual review, GitHub Copilot, code linters"

**4. UNIQUE value you provide**
- What's different and why it matters
- Example: "30-second reviews (10x faster) with startup context"

**5. PROOF it's real**
- Evidence, metrics, testimonials
- Example: "1000+ solo founders, 4.9/5 rating"

**One-Sentence Positioning:**
```
"For [target customer] who [need/problem],
[product] is a [category] that [unique value].
Unlike [alternatives], we [key differentiator]."
```

**Example:**
```
"For Next.js solo founders building AI SaaS who need fast code review,
CodeGuard is an AI code review tool that provides 30-second reviews with startup context.
Unlike GitHub Copilot or manual review, we understand startup code patterns and ship 10x faster."
```

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: constitution -->
### In /vibecode:constitution
**Document positioning:**

```markdown
## Product Positioning

**Best For:** [Target customer - specific]
**Category:** [What is this?]
**Alternatives:** [What customers use now]
**Unique Value:** [Why we're different]
**Proof:** [Evidence it works]

**One-Sentence:**
"For [target] who [need], [product] is a [category] that [value]. Unlike [alternatives], we [differentiator]."
```
<!-- COMMAND_SECTION_END: constitution -->

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Check positioning fit:**

For each feature:
- [ ] Does this serve our target customer?
- [ ] Does this strengthen our differentiation?
- [ ] Is this aligned with our category?
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Product launches, rebranding, entering new markets
**Optional for:** Established products with clear positioning
