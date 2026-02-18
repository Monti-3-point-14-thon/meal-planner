---
skill: exec-comms
category: communicator
weight_default: low
source: Amazon 6-pager, Stripe memos, SCQA framework
vibecoding_phases: [specify, plan]
---

# Executive Communication

**One-line description:** Write clear, concise decision docs and updates using Amazon 6-pager structure and SCQA framework.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** memo, document, update, decision, stakeholder, executive, board, investor
- **Workflow phases:** specify, plan
- **Context signals:** Writing decision documents, updates, strategic docs

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: BLUF (Bottom Line Up Front)
**Source:** Amazon, military communications
**When to use:** Writing any decision document
**How to apply:**

**Structure:**
```markdown
## Executive Summary (BLUF)
[Key decision/recommendation in 2-3 sentences - bottom line first]

## Context
[Background needed to understand]

## Analysis
[Options, tradeoffs, data]

## Recommendation
[What you propose and why]

## Next Steps
[Specific actions, owners, timeline]
```

**Example (Vibecoding Context):**
```markdown
# Decision: Choose AI Model for Code Review

## Executive Summary
Recommend using Claude Sonnet for code review feature.
Provides best balance of accuracy (92%) and cost ($12/1K reviews).
Request approval to proceed with implementation.

## Context
- Need AI model for code review feature
- Requirements: 90%+ accuracy, <$20/1K reviews, <5s latency
- Evaluated GPT-4, Claude Sonnet, Claude Haiku

## Analysis
| Model | Accuracy | Cost | Latency | Decision |
|-------|----------|------|---------|----------|
| GPT-4 | 94% | $30/1K | 3s | Too expensive |
| Sonnet | 92% | $12/1K | 2s | ✅ Recommended |
| Haiku | 85% | $4/1K | 1s | Below accuracy threshold |

## Recommendation
Use Claude Sonnet. Meets all requirements, best ROI.

## Next Steps
1. Implement Sonnet integration - @me - Week 1
2. Run beta with 50 users - @me - Week 2
3. Launch to 100% if beta successful - Week 3
```

---

### Framework 2: SCQA (Situation-Complication-Question-Answer)
**Source:** McKinsey, Stripe
**When to use:** Framing problems and solutions
**How to apply:**

**S - Situation:** Current state
**C - Complication:** Problem/challenge
**Q - Question:** What should we do?
**A - Answer:** Your recommendation

**Example:**
```markdown
S: We have 1000 beta users testing code review feature
C: 30% report false positives, hurting trust
Q: How do we improve accuracy without slowing down?
A: Add confidence thresholds + manual review queue
```

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Use BLUF for spec summary:**

```markdown
## Executive Summary
[Bottom line: what are we building and why - 2-3 sentences]

## Context
[Background, user need, opportunity]

## Proposal
[What we're building]

## Alternatives Considered
[What we're NOT building and why]

## Success Metrics
[How we'll measure success]
```
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Use SCQA for technical decisions:**

```markdown
## Decision: [Technology choice]

**Situation:** [Current state]
**Complication:** [Problem/constraint]
**Question:** [What should we choose?]
**Answer:** [Recommendation with rationale]

**Alternatives Considered:**
- Option A: [Pros/Cons] - Not chosen
- Option B: [Pros/Cons] - ✅ Recommended

**Next Steps:**
1. [Action] - [Timeline]
```
<!-- COMMAND_SECTION_END: plan -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Major decisions, investor updates, technical RFCs
**Optional for:** Daily development work, small features
