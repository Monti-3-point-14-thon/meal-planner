---
skill: decision-frameworks
category: strategist
weight_default: critical
source: Structured Decision-Making Best Practices
vibecoding_phases: plan|tasks|implement
---

# Decision Frameworks

**One-line description:** Structured templates for documenting and communicating technical decisions

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** architecture, technical decision, trade-off, major decision, infrastructure
- **Workflow phases:** /vibecode:plan (all major decisions), /vibecode:implement (implementation choices)
- **Context signals:** Whenever facing decisions with significant impact or trade-offs

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Structured Decision Template
**Source:** Architecture Decision Records (ADR) methodology, adapted for vibecoding
**When to use:** Every major technical decision with trade-offs
**How to apply:** Use the 5-section template to document decisions comprehensively

**Template Structure:**
1. **Context** - Why are we making this decision now?
2. **Options Considered** - What alternatives did we evaluate?
3. **Decision** - What did we choose?
4. **Rationale** - Why did we choose this given our constraints?
5. **Migration Path** - When would we revisit? How would we change?

**Example:**

*Decision: Avatar Storage Approach*

**Context:**
- Building MVP user profiles with avatar upload
- Budget: $0/month
- Timeline: Ship in 2 days
- Users: <10 beta testers

**Options Considered:**
- Supabase Storage (free, 1GB limit)
- AWS S3 + CloudFront (robust, setup time)
- Cloudinary (easy, costs $)

**Decision:** Supabase Storage

**Rationale:**
- Free tier sufficient for MVP
- Integrated with existing auth
- 2-hour implementation vs 1-day for S3
- Easy migration path when needed

**Migration Path:**
- Revisit when: >500 users OR >500MB used
- Migration: Copy to S3, update URLs
- Estimated effort: 1 day

**Questions to ask:**
- What's the business context driving this decision?
- What constraints are we optimizing for?
- What are we explicitly trading off?
- When should we revisit this?

---

### Framework 2: Decision Type Classification
**Source:** Technology decision taxonomy
**When to use:** To determine appropriate detail level and review process
**How to apply:** Classify decision, then apply appropriate documentation depth

**Decision Types:**

1. **Architecture** - System structure, data flow, core patterns
   - Impact: High (affects entire system)
   - Reversibility: Hard (requires significant refactoring)
   - Documentation: Full template required

2. **Technology** - Tools, frameworks, libraries, services
   - Impact: Medium-High (affects development speed, costs)
   - Reversibility: Medium (can swap, but effort required)
   - Documentation: Full template required

3. **Design** - UI patterns, component structure, visual approach
   - Impact: Medium (affects user experience)
   - Reversibility: Medium (can redesign, but disrupts users)
   - Documentation: Simplified template okay

4. **Process** - Workflow, deployment, testing approach
   - Impact: Low-Medium (affects team efficiency)
   - Reversibility: Easy (can change processes quickly)
   - Documentation: Brief notes sufficient

**Example:**

*Decision: Use Next.js App Router*
- Type: **Architecture** (affects routing, data fetching, entire app structure)
- Documentation: Full template required
- Review: Critical (hard to reverse)

*Decision: Use Tailwind CSS*
- Type: **Technology** (affects styling approach)
- Documentation: Full template required
- Review: Important (medium effort to swap)

---

### Framework 3: Trade-off Analysis
**Source:** Cost-benefit analysis adapted for technical decisions
**When to use:** When options have clear pros/cons trade-offs
**How to apply:** Explicit pro/con/cost for each option

**Trade-off Template:**

```markdown
### Option A: [Name]
**Pros:**
- [Benefit 1 with impact]
- [Benefit 2 with impact]

**Cons:**
- [Drawback 1 with impact]
- [Drawback 2 with impact]

**Cost/Effort:**
- Setup time: [hours/days]
- Complexity: [low/medium/high]
- Risk: [low/medium/high]
```

**Example:**

*Database Choice for MVP*

**Option A: Supabase (Postgres + BaaS)**
**Pros:**
- Free tier sufficient for MVP
- Auth + DB + Storage integrated
- Fast setup (<1 hour)

**Cons:**
- Vendor lock-in
- Limited customization
- Performance ceiling at scale

**Cost/Effort:**
- Setup time: 1 hour
- Complexity: Low
- Risk: Low (proven for MVPs)

**Option B: Self-hosted Postgres + custom auth**
**Pros:**
- Full control
- No vendor lock-in
- Scales infinitely

**Cons:**
- 2-3 days setup time
- Infrastructure management
- Security burden

**Cost/Effort:**
- Setup time: 2-3 days
- Complexity: High
- Risk: Medium (security concerns)

---

## Decision Trees

**Primary decision:** What level of documentation does this decision need?

```
IF (decision_type = Architecture OR Technology):
  → Use full Structured Decision Template
  → Document to: .vibecode/memory/decisions/active/[date]-[name].md
  → Include all 5 sections

ELSE IF (decision has significant trade-offs):
  → Use Trade-off Analysis template
  → Document to: .vibecode/memory/decisions/active/[date]-[name].md
  → Include pros/cons/costs for each option

ELSE IF (decision_type = Design OR Process):
  → Use brief decision notes
  → Document to: plan.md or tasks.md
  → Include context, decision, rationale only

ELSE:
  → No formal documentation needed
  → Document in code comments or commit messages
```

---

## Action Templates

### Template 1: Full Structured Decision Log
**Use case:** Architecture and Technology decisions with significant impact
**Format:**
```markdown
# Decision: [Decision Title]

**Date:** [YYYY-MM-DD]
**Decision Type:** [Architecture | Technology | Design | Process]
**Feature:** [current-feature]

## Context
[Why making this decision now]
- Business constraint: [timeline, budget, users]
- Technical constraint: [existing tech, team skills]
- Trigger: [what prompted this]

## Options Considered

### Option A: [Name]
**Pros:**
- [Benefit 1]
- [Benefit 2]
**Cons:**
- [Drawback 1]
- [Drawback 2]
**Cost/Effort:** [time, complexity, risk]

### Option B: [Name]
**Pros:**
- [Benefit 1]
- [Benefit 2]
**Cons:**
- [Drawback 1]
- [Drawback 2]
**Cost/Effort:** [time, complexity, risk]

### Option C: [Name] (if applicable)
**Pros:**
- [Benefit 1]
- [Benefit 2]
**Cons:**
- [Drawback 1]
- [Drawback 2]
**Cost/Effort:** [time, complexity, risk]

## Decision: Option [X]

## Rationale
[Why this option given our context]
- Optimizing for: [speed | quality | cost | simplicity]
- Trade-offs accepted: [what we gave up]
- Why now: [timing rationale]

## Migration Path
- Revisit when: [condition]
- Migration approach: [if we need to change]
- Estimated effort: [time]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
```

**Example:**
```markdown
# Decision: State Management for Dashboard

**Date:** 2026-02-17
**Decision Type:** Architecture
**Feature:** Analytics Dashboard

## Context
Building real-time analytics dashboard with complex state
- Business constraint: Ship MVP in 1 week
- Technical constraint: Team knows React, no Redux experience
- Trigger: Multiple components need shared state, prop drilling becoming unwieldy

## Options Considered

### Option A: React Context + useReducer
**Pros:**
- Built into React, no dependencies
- Team already familiar
- Sufficient for MVP scope
**Cons:**
- Can cause re-render issues at scale
- No dev tools
- Limited performance optimization
**Cost/Effort:** 1 day setup, low complexity, low risk

### Option B: Zustand
**Pros:**
- Simple API, easy to learn
- Good performance
- Small bundle size
**Cons:**
- Additional dependency
- Team needs to learn new library
**Cost/Effort:** 2 days setup + learning, medium complexity, low risk

### Option C: Redux Toolkit
**Pros:**
- Industry standard
- Excellent dev tools
- Scales to large apps
**Cons:**
- Steeper learning curve
- More boilerplate
- Overkill for MVP
**Cost/Effort:** 3-4 days setup + learning, high complexity, medium risk

## Decision: Option A (React Context + useReducer)

## Rationale
- Optimizing for: Speed (1-week deadline)
- Team already knows Context API
- MVP scope is small (<10 components sharing state)
- Trade-offs accepted: May need to refactor if performance issues arise
- Why now: Prop drilling is already slowing development

## Migration Path
- Revisit when: Dashboard has >20 components OR re-render performance issues
- Migration approach: Context → Zustand (similar API, easy transition)
- Estimated effort: 1 day

## Success Criteria
- [ ] All components can access shared dashboard state
- [ ] No prop drilling deeper than 2 levels
- [ ] Dashboard state updates in <100ms
```

---

## Quick Reference

**Key Questions:**
- [ ] Why are we making this decision now?
- [ ] What constraints are we optimizing for?
- [ ] What alternatives did we consider?
- [ ] What are we explicitly trading off?
- [ ] When should we revisit this decision?
- [ ] How hard would it be to change later?

**Checklists:**
- [ ] Identified decision type (Architecture, Technology, Design, Process)
- [ ] Listed all viable options with pros/cons/costs
- [ ] Documented context and constraints
- [ ] Stated what we're optimizing for
- [ ] Defined migration path with "revisit when" condition
- [ ] Created decision log in `.vibecode/memory/decisions/active/`

**Memorable Quotes:**
> "Make reversible decisions quickly, irreversible decisions carefully."
> — Jeff Bezos, Amazon

> "The cost of being wrong is less than the cost of doing nothing."
> — Seth Godin

---

## Common Pitfalls

**Anti-pattern 1:** Documenting decisions after the fact
**Why it fails:** Lose context, forget alternatives considered, can't learn from rationale
**Instead:** Document during planning phase, before implementation

**Anti-pattern 2:** No "revisit when" condition
**Why it fails:** Decisions become permanent, technical debt accumulates
**Instead:** Always include migration path with clear revisit trigger

**Anti-pattern 3:** Only documenting the chosen option
**Why it fails:** Can't remember why other options were rejected, context is lost
**Instead:** Document all serious options considered with pros/cons

**Anti-pattern 4:** Over-documenting trivial decisions
**Why it fails:** Documentation burden slows development
**Instead:** Use decision tree to determine appropriate documentation level

---

## Related Skills

**Works well with:**
- `quality-speed` - Quality-speed decisions use this template
- `ai-product-patterns` - AI decisions (model selection, evals) use this template
- `strategic-build` - LNO classification informs decision priority

**Sequence suggestions:**
1. Apply domain-specific skill (`quality-speed`, `ai-product-patterns`, etc.) to analyze decision
2. Use `decision-frameworks` template to document the decision
3. Reference `strategic-build` LNO to prioritize decision documentation

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
- Document user-facing decisions (experience choices)
- Use simplified template (context, decision, rationale)
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan

**For EACH major technical decision, use structured template:**

Template from this skill file (Full Structured Decision Log):

```markdown
# Decision: [Decision Title]

**Date:** [YYYY-MM-DD]
**Decision Type:** [Architecture | Technology | Design | Process]
**Feature:** [current-feature]

## Context
[Why making this decision now]
- Business constraint: [timeline, budget, users]
- Technical constraint: [existing tech, team skills]
- Trigger: [what prompted this]

## Options Considered

### Option A: [Name]
**Pros:**
- [Benefit 1]
- [Benefit 2]
**Cons:**
- [Drawback 1]
- [Drawback 2]
**Cost/Effort:** [time, complexity, risk]

### Option B: [Name]
[Same structure]

### Option C: [Name] (if applicable)
[Same structure]

## Decision: Option [X]

## Rationale
[Why this option given our context]
- Optimizing for: [speed | quality | cost | simplicity]
- Trade-offs accepted: [what we gave up]
- Why now: [timing rationale]

## Migration Path
- Revisit when: [condition]
- Migration approach: [if we need to change]
- Estimated effort: [time]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
```

**Save to:** `.vibecode/memory/decisions/active/[YYYY-MM-DD]-[decision-name].md`

**Plan to log all major decisions during Step 7 using this template.**
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Reference decision logs when breaking down tasks
- Tag tasks with decision IDs for traceability
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
- Reference decision logs when implementing
- Log any deviations from planned approach
- Update migration path if new information emerges
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical`
**Recommended for:** All users (fundamental to structured decision-making)
**Optional for:** None (this is a core documentation skill)

**Enable:**
```json
{
  "skills": {
    "strategist": {
      "decision-frameworks": {
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
