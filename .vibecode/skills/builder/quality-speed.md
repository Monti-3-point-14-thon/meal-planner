---
skill: quality-speed
category: builder
weight_default: critical
source: Dylan Field (Figma CEO) - Product Quality Philosophy
vibecoding_phases: plan|tasks|implement
---

# Quality-Speed Spectrum

**One-line description:** Context-driven framework for choosing where to invest quality effort vs speed

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** architecture, technical decision, trade-off, implementation approach
- **Workflow phases:** /vibecode:plan (technical decisions), /vibecode:tasks (prioritization)
- **Context signals:** When facing "should we build this quickly or robustly?" decisions

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Quality-Speed Spectrum
**Source:** Dylan Field (Figma), Shreyas Doshi (Stripe)
**When to use:** Every major technical decision with quality vs speed trade-offs
**How to apply:** Position decision on spectrum using 4 context questions

**Spectrum:**
```
← Prototype Fast -------- Balance -------- Build Robust →
```

**Context Questions:**

1. **"Is this feature validated?"**
   - Unvalidated → Prototype Fast (iterate based on feedback)
   - Partially validated → Balance
   - Fully validated → Build Robust (users depend on it)

2. **"Expected user count?"**
   - <100 users → Prototype Fast (can afford to iterate)
   - 100-1000 users → Balance
   - >1000 users → Build Robust (stability matters)

3. **"Core product value?"**
   - Core differentiator → Build Robust (quality is brand)
   - Standard feature → Balance
   - Experiment/test → Prototype Fast

4. **"LNO classification?"** (from strategic-build if loaded)
   - Leverage work → Build Robust (compounds over time)
   - Neutral work → Balance
   - Overhead work → Prototype Fast (minimize time)

**Example:**

*Feature: Avatar upload for MVP*

- Validated: No (MVP feature)
- Users: <10 beta testers
- Core value: No (nice-to-have)
- LNO: Neutral

**Position: Prototype Fast**
→ Use Supabase Storage (free, quick) instead of S3+CloudFront (robust, slow to setup)

---

### Framework 2: Simplicity Forcing
**Source:** Dylan Field (Figma CEO)
**When to use:** When plans feel too complex or time-consuming
**How to apply:** Ask forcing questions to reveal true essence

**Questions to ask:**
- "What can we REMOVE to ship faster without losing essence?"
- "If we had to cut 50% of this plan, what stays?"
- "What's the ONE thing users must have for this to be valuable?"

**Example:**

*Feature: User dashboard with analytics, exports, filters, saved views*

After simplicity forcing:
- Keep: Basic analytics display (core value)
- Remove for v1: Exports, advanced filters, saved views
- Ship time: 2 days instead of 2 weeks

---

## Decision Trees

**Primary decision:** Where to position technical approach on quality-speed spectrum?

```
IF (unvalidated AND <100 users AND not core value):
  → Prototype Fast
  → Ask: "What's fastest path that works?"
  → Document to: .vibecode/memory/trade-offs/[feature]-quality-speed.md

ELSE IF (validated AND >1000 users AND core value):
  → Build Robust
  → Ask: "What quality bar do users expect?"
  → Document to: .vibecode/memory/trade-offs/[feature]-quality-speed.md

ELSE:
  → Balance
  → Ask all 4 context questions
  → Document to: .vibecode/memory/trade-offs/[feature]-quality-speed.md
```

---

## Action Templates

### Template 1: Quality-Speed Decision Log
**Use case:** Document every major quality vs speed decision
**Format:**
```markdown
# Decision: [Feature] - [Topic]

**Classification:** [Leverage|Neutral|Overhead] work
**Validation:** [Unvalidated|Partially validated|Fully validated]
**Users:** [Expected user count]
**Core value:** [Yes/No] - [Brief rationale]

**Spectrum Choice:** [Prototype Fast|Balance|Build Robust]

**Decision:** [What we're doing]
**Rationale:**
- [Why this makes sense]
- [Business constraint]
- [Technical constraint]

**Trade-offs Accepted:**
- [What we're giving up]
- [Why it's acceptable]

**Migration Path:**
- Revisit when: [Condition]
- Migration approach: [How to upgrade later]
- Estimated effort: [Time]
```

**Example:**
```markdown
# Decision: Avatar Storage Approach

**Classification:** Neutral work
**Validation:** Unvalidated (MVP feature)
**Users:** <10 beta testers
**Core value:** No (nice-to-have profile feature)

**Spectrum Choice:** Prototype Fast

**Decision:** Supabase Storage (free tier)
**Rationale:**
- Free, integrated with existing Supabase auth/DB
- Sufficient for MVP (<1GB storage needed)
- Easy to migrate to S3 later if needed
- Can implement in <2 hours vs 1 day for S3 setup

**Trade-offs Accepted:**
- Vendor lock-in (acceptable at MVP stage)
- 1GB limit (not a concern for <100 users)
- Slower than CDN (acceptable for profile images)

**Migration Path:**
- Revisit when: >500 users OR >500MB storage used
- Migration: Supabase → S3 + CloudFront
- Estimated effort: 1 day
```

---

## Quick Reference

**Key Questions:**
- [ ] Is this feature validated with users?
- [ ] How many users will this impact?
- [ ] Is this core to product value?
- [ ] What's the LNO classification?
- [ ] What can we remove without losing essence?

**Checklists:**
- [ ] Positioned decision on quality-speed spectrum
- [ ] Asked all 4 context questions
- [ ] Applied simplicity forcing
- [ ] Documented decision with migration path
- [ ] Identified when to revisit

**Memorable Quotes:**
> "What can we remove to ship faster without losing essence?"
> — Dylan Field, Figma CEO

> "Not all work is created equal. Leverage work compounds, overhead work drains."
> — Shreyas Doshi, ex-Stripe PM

---

## Common Pitfalls

**Anti-pattern 1:** Always choosing "Build Robust" because it feels safer
**Why it fails:** Slows down learning, wastes effort on unvalidated features
**Instead:** Use context questions - unvalidated features deserve Prototype Fast

**Anti-pattern 2:** No documented migration path
**Why it fails:** Technical debt becomes permanent, future changes feel impossible
**Instead:** Always document "revisit when" and estimated migration effort

**Anti-pattern 3:** Ignoring the simplicity forcing questions
**Why it fails:** Shipping bloated v1s that could have been 50% simpler
**Instead:** Ask "what can we remove?" before finalizing plans

---

## Related Skills

**Works well with:**
- `strategic-build` - LNO classification informs quality-speed positioning
- `decision-frameworks` - Use this framework inside structured decision template
- `zero-to-launch` - Figma simplicity test complements simplicity forcing

**Sequence suggestions:**
1. Apply `strategic-build` (LNO) first to classify work type
2. Then apply `quality-speed` to position on spectrum
3. Then use `decision-frameworks` to log the decision formally

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
Not typically applied at specification phase (too early for technical decisions).
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan

**For EACH major technical decision, ask:**

"Where should we be on this spectrum?"

```
← Prototype Fast -------- Balance -------- Build Robust →
```

**Context Questions:**

1. **"Is this feature validated?"**
   - Unvalidated → Prototype Fast (iterate based on feedback)
   - Partially validated → Balance
   - Fully validated → Build Robust (users depend on it)

2. **"Expected user count?"**
   - <100 users → Prototype Fast (can afford to iterate)
   - 100-1000 users → Balance
   - >1000 users → Build Robust (stability matters)

3. **"Core product value?"**
   - Core differentiator → Build Robust (quality is brand)
   - Standard feature → Balance
   - Experiment/test → Prototype Fast

4. **"LNO classification?"** (from strategic-build if loaded)
   - Leverage work → Build Robust (compounds over time)
   - Neutral work → Balance
   - Overhead work → Prototype Fast (minimize time)

**Dylan Field (Figma) Simplicity Forcing:**
- "What can we REMOVE to ship faster without losing essence?"
- "If we had to cut 50% of this plan, what stays?"

**Document decision with rationale:**
```
Create: .vibecode/memory/trade-offs/[feature]-quality-speed.md
```

Use the Quality-Speed Decision Log template from this skill file.
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Tag tasks with spectrum position: [prototype-fast], [balance], [build-robust]
- Affects prioritization: Prototype Fast tasks ship first, Build Robust tasks get more time
- Quality bar expectations documented per task
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
- Reference quality-speed decision when making implementation choices
- Log any deviations from planned spectrum position
- Update migration path if new information emerges
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical`
**Recommended for:** All users (fundamental to balancing speed vs quality)
**Optional for:** None (this is a core decision-making skill)

**Enable:**
```json
{
  "skills": {
    "builder": {
      "quality-speed": {
        "enabled": true,
        "weight": "critical"
      }
    }
  }
}
```

---

## Version History

- **v0.1.0** (2026-02-17): Initial skill file created for vibecoding framework
