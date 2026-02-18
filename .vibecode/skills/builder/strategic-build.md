---
skill: strategic-build
category: builder
weight_default: critical
source: Lenny's Podcast - Shreyas Doshi (Stripe, Twitter, Google)
vibecoding_phases: [specify, plan, tasks, implement, constitution]
---

# Strategic Build

**One-line description:** LNO framework to classify work as Leverage, Neutral, or Overhead - build the right things with the right quality bar.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** Any feature (universal skill)
- **Workflow phases:** All phases (specify, plan, tasks, implement, constitution)
- **Context signals:** Quality decisions, prioritization, architecture choices, task breakdown

### Manual Activation
Always enabled by default at critical weight (fundamental to all product decisions)

---

## Core Frameworks

### Framework 1: LNO Classification
**Source:** Shreyas Doshi (ex-Stripe PM) - The most important PM framework

**The Three Types of Work:**

**🚀 Leverage Work** - Work that compounds over time
- Core product features that drive growth
- Platform/infrastructure that enables future work
- Competitive moats and differentiators
- Technical foundations that pay dividends
- **Quality bar:** HIGH - Build with care, it compounds
- **Time investment:** Worth spending extra time
- **Examples:** Auth system, core API, payment processing, search algorithm

**⚖️ Neutral Work** - Necessary but doesn't compound
- Standard features users expect
- Table stakes functionality
- Admin tools for internal use
- Maintenance and bug fixes
- **Quality bar:** BALANCED - Don't over-engineer, don't under-invest
- **Time investment:** Efficient, professional quality
- **Examples:** User profiles, basic CRUD, email notifications, settings page

**📋 Overhead Work** - Must-do but no user value
- Compliance and legal requirements
- Internal tooling nobody sees
- Migration scripts, data cleanup
- Ceremony and process
- **Quality bar:** MINIMAL - Just get it done
- **Time investment:** Minimize ruthlessly
- **Examples:** GDPR consent forms, internal admin panel, log rotation, meeting notes

**How to classify:**
Ask: **"Will this work make future work easier or create compounding value?"**
- YES → Leverage
- SOME → Neutral
- NO → Overhead

---

### Framework 2: Quality Bar by Classification
**Source:** Shreyas Doshi's quality matching framework

**Once classified, match quality to type:**

**Leverage → High Quality**
- Write comprehensive tests
- Handle all edge cases
- Document thoroughly
- Consider future extensibility
- Code reviews, architecture discussions
- "Build it right because we'll build on top of it"

**Neutral → Balanced Quality**
- Basic tests for happy path
- Handle common edge cases
- Minimal documentation
- Standard patterns, no fancy architecture
- "Professional but not perfect"

**Overhead → Minimal Quality**
- Just make it work
- Skip tests unless critical
- No documentation
- Quickest path to done
- "The best code for overhead work is no code"

---

### Framework 3: Common Misclassifications
**Source:** Shreyas Doshi - Where teams get LNO wrong

**Don't assume:**
- ❌ "It's user-facing so it's Leverage" → Many user-facing features are Neutral
- ❌ "It's internal so it's Overhead" → Some internal tools are Leverage (enable team)
- ❌ "It's new so it's important" → New doesn't mean Leverage

**Ask instead:**
- "Will this compound over time?"
- "Does this enable future work?"
- "Is this a differentiator or table stakes?"

**Reclassification examples:**
```
"User profile page"
- Feels like: Leverage (user-facing!)
- Actually: Neutral (expected feature, doesn't compound)
- Quality: Balanced, ship quickly

"OAuth authentication"
- Feels like: Neutral (standard feature)
- Actually: Leverage (core infrastructure, enables all features)
- Quality: High, build robustly

"Admin panel to view logs"
- Feels like: Neutral (useful tool)
- Actually: Overhead (internal only, no user value)
- Quality: Minimal, bare bones
```

---

## Decision Trees

**Classification decision:**

```
ASK: "Will this work make future work easier or create compounding value?"

IF YES (compounds):
  → LEVERAGE work
  → Quality bar: HIGH
  → Time: Worth investing extra
  → Test: Comprehensive
  → Document: Thoroughly

ELSE IF SOMEWHAT (necessary but doesn't compound):
  → NEUTRAL work
  → Quality bar: BALANCED
  → Time: Efficient, professional
  → Test: Happy path + common edges
  → Document: Minimal

ELSE (must-do but no user value):
  → OVERHEAD work
  → Quality bar: MINIMAL
  → Time: Minimize ruthlessly
  → Test: Only if critical
  → Document: Skip
```

---

## Action Templates

### Template 1: Feature Classification
**Use case:** When spec'ing or planning any feature
```markdown
# Feature: [Name]

## LNO Classification: [LEVERAGE | NEUTRAL | OVERHEAD]

**Rationale:**
[Why this classification - will it compound? Enable future work? Differentiator or table stakes?]

**Quality Bar:** [High | Balanced | Minimal]

**Implications:**
- Testing: [Comprehensive | Standard | Minimal]
- Edge cases: [All | Common | Critical only]
- Documentation: [Thorough | Basic | None]
- Time budget: [Take time to build right | Efficient | Minimize]
```

---

## Quick Reference

**Classification test:**
- [ ] "Will this compound over time?" → YES = Leverage
- [ ] "Does this enable many future features?" → YES = Leverage
- [ ] "Is this a differentiator or table stakes?" → Differentiator = Leverage, Table stakes = Neutral
- [ ] "Would users care if we removed it?" → NO = Overhead

**Quality matching:**
- **LEVERAGE** → High quality (tests, docs, edge cases, extensibility)
- **NEUTRAL** → Balanced (professional but not perfect)
- **OVERHEAD** → Minimal (just make it work)

**Memorable Quotes:**
> "Not all work is created equal. Leverage work compounds, Neutral work is necessary, Overhead work is unavoidable. Match your quality bar accordingly."
> — Shreyas Doshi

---

## Common Pitfalls

**Anti-pattern 1:** Treating all user-facing work as Leverage
**Why it fails:** Wastes time perfecting features that don't compound
**Instead:** User profiles, settings pages are often Neutral - build efficiently, don't over-engineer

**Anti-pattern 2:** Treating internal tools as Overhead by default
**Why it fails:** Some internal tools are Leverage (CI/CD pipeline enables all future work)
**Instead:** Ask "Does this enable future work?" - some internal tools are Leverage

**Anti-pattern 3:** Building Overhead work with high quality
**Why it fails:** Time spent on GDPR consent forms is time not spent on core product
**Instead:** Bare minimum for Overhead - get it done and move on

---

## Related Skills

**Works well with:**
- `zero-to-launch` - MVP features often classified as Neutral (validate first)
- `quality-speed` - LNO informs where on prototype/robust spectrum to be
- `prioritization-craft` - Leverage work gets prioritized over Neutral/Overhead

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Primary use:** Classify feature during specification
- Ask: "Is this Leverage, Neutral, or Overhead work?"
- Document classification in spec
- Sets quality expectations for plan/tasks/implement
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Use:** Architecture decisions based on classification
- Leverage → Invest in extensible architecture
- Neutral → Standard patterns, proven approaches
- Overhead → Quickest viable solution
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
**Primary use:** Tag tasks with LNO classification
```markdown
- [ ] T001: Setup OAuth [LEVERAGE] ← HIGH PRIORITY
      Quality: High, comprehensive tests, handle all edge cases

- [ ] T002: User profile page [NEUTRAL]
      Quality: Balanced, professional but efficient

- [ ] T003: Admin log viewer [OVERHEAD]
      Quality: Minimal, just make it work
```
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**Primary use:** Respect quality bar during implementation
- `[LEVERAGE]` tasks: High quality (tests, error handling, docs, edge cases)
- `[NEUTRAL]` tasks: Balanced quality (happy path + common edges, basic tests)
- `[OVERHEAD]` tasks: Minimal quality (just ship it)
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical` (fundamental to all decisions)
**Recommended for:** Everyone (universal framework)

```json
{
  "skills": {
    "builder": {
      "strategic-build": {
        "enabled": true,
        "weight": "critical"
      }
    }
  }
}
```

---

## Version History

- **v0.1.0** (2026-02-16): Initial skill file, adapted from Shreyas Doshi's LNO framework
