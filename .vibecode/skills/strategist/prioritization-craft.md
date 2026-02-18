---
skill: prioritization-craft
category: strategist
weight_default: high
source: Intercom (RICE), Shreyas Doshi, Value vs Effort framework
vibecoding_phases: [specify, plan, tasks]
---

# Prioritization Craft: Feature Prioritization Frameworks

**One-line description:** Applies RICE scoring, Value vs Effort matrices, and stack ranking to prioritize features, manage backlog, and say no gracefully.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** prioritize, backlog, roadmap, priority, ranking, order, sequence, tradeoff
- **Workflow phases:** specify, plan, tasks
- **Context signals:** Multiple features to prioritize, deciding what to build first, managing feature requests

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: RICE Scoring System
**Source:** Intercom
**When to use:** Prioritizing multiple features objectively
**How to apply:**

**Formula:**
```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: How many users affected (per quarter)
Impact: How much impact (0.25, 0.5, 1, 2, 3)
  0.25 = Minimal
  0.5  = Low
  1    = Medium
  2    = High
  3    = Massive
Confidence: How confident (%, use 80% if unsure)
  100% = High confidence
  80%  = Medium confidence
  50%  = Low confidence
Effort: How much work (person-weeks or person-months)
```

**Step-by-step:**
1. **Estimate Reach**: How many users will this impact per quarter?
2. **Score Impact**: On a scale of 0.25-3, how much will this move the needle?
3. **Set Confidence**: How sure are you about reach/impact? (50-100%)
4. **Estimate Effort**: How many person-weeks/months to build?
5. **Calculate RICE**: (Reach × Impact × Confidence) / Effort
6. **Rank by Score**: Highest RICE = highest priority

**Example (Vibecoding Context):**
```markdown
Feature A: Email notifications
- Reach: 500 users/quarter (assuming 2000 total users, 25% adoption)
- Impact: 1 (medium - nice-to-have convenience)
- Confidence: 80% (medium - haven't validated with users)
- Effort: 2 person-weeks
- RICE = (500 × 1 × 0.8) / 2 = 200

Feature B: Dark mode
- Reach: 2000 users/quarter (all users)
- Impact: 0.5 (low - aesthetic preference)
- Confidence: 100% (high - frequently requested)
- Effort: 1 person-week
- RICE = (2000 × 0.5 × 1.0) / 1 = 1000

Feature C: API rate limiting
- Reach: 100 users/quarter (power users)
- Impact: 3 (massive - prevents service abuse)
- Confidence: 100% (high - critical for stability)
- Effort: 1 person-week
- RICE = (100 × 3 × 1.0) / 1 = 300

Priority Order:
1. Dark mode (RICE: 1000) ← Do first
2. API rate limiting (RICE: 300) ← Do next
3. Email notifications (RICE: 200) ← Do later
```

**Questions to ask:**
- How many users will this affect per quarter?
- On a scale of 0.25-3, how much impact does this have?
- How confident am I in these estimates?
- How many person-weeks/months will this take?

---

### Framework 2: Value vs Effort Matrix
**Source:** Standard PM framework
**When to use:** Quick visual prioritization
**How to apply:**

**The 2x2 Matrix:**
```
        HIGH VALUE
             ↑
   ┌─────────┼─────────┐
   │         │         │
L  │  DO     │  DO     │  H
O  │  LATER  │  FIRST  │  I
W  │  (3)    │  (1)    │  G
   │         │         │  H
E  ├─────────┼─────────┤
F  │         │         │  E
F  │  DON'T  │  DO     │  F
O  │  DO     │  NEXT   │  F
R  │  (4)    │  (2)    │  O
T  │         │         │  R
   └─────────┼─────────┘  T
             ↓
        LOW VALUE

Quadrants:
1. High Value, Low Effort  → DO FIRST (Quick Wins)
2. High Value, High Effort → DO NEXT (Big Bets)
3. Low Value, Low Effort   → DO LATER (Fill-ins)
4. Low Value, High Effort  → DON'T DO (Money Pits)
```

**Step-by-step:**
1. **List all features** to be prioritized
2. **Plot each feature** on the matrix (value vs effort)
3. **Prioritize:**
   - Quadrant 1 (High Value, Low Effort) → Build immediately
   - Quadrant 2 (High Value, High Effort) → Plan carefully, build next
   - Quadrant 3 (Low Value, Low Effort) → Fill-in work when time permits
   - Quadrant 4 (Low Value, High Effort) → Say no

**Example (Vibecoding Context):**
```markdown
Features to prioritize:

Quadrant 1 (DO FIRST - Quick Wins):
✅ Add loading states (High Value, 1 day)
✅ Fix broken "export" button (High Value, 2 hours)
✅ Add keyboard shortcuts (High Value, 2 days)

Quadrant 2 (DO NEXT - Big Bets):
🎯 Real-time collaboration (High Value, 3 weeks)
🎯 Advanced search filters (High Value, 2 weeks)

Quadrant 3 (DO LATER - Fill-ins):
⏳ Custom themes (Low Value, 1 day)
⏳ Easter egg animations (Low Value, 3 hours)

Quadrant 4 (DON'T DO - Money Pits):
❌ Custom report builder (Low Value, 4 weeks)
❌ AI-powered recommendations (Low Value, 6 weeks)
```

**Questions to ask:**
- What's the value to users?
- How much effort will this take?
- Which quadrant does this fall into?
- Can we say no to Quadrant 4 items?

---

### Framework 3: Prioritization Template (RICE-based)
**Source:** Adapted from Intercom
**When to use:** Documenting feature prioritization decisions
**How to apply:**

**Template:**
```markdown
# Feature Prioritization: [Date]

## Features Under Consideration

### Feature 1: [Name]
**Description:** [Brief description]
- **Reach:** [X users/quarter]
- **Impact:** [0.25/0.5/1/2/3] - [Description]
- **Confidence:** [X]%
- **Effort:** [X person-weeks]
- **RICE Score:** [Calculate]

### Feature 2: [Name]
**Description:** [Brief description]
- **Reach:** [X users/quarter]
- **Impact:** [0.25/0.5/1/2/3] - [Description]
- **Confidence:** [X]%
- **Effort:** [X person-weeks]
- **RICE Score:** [Calculate]

[... more features ...]

## Priority Order

1. **[Feature with highest RICE]** (RICE: XXX)
   - Why: [Rationale]
   - Build: [This sprint/month]

2. **[Feature with second highest RICE]** (RICE: XXX)
   - Why: [Rationale]
   - Build: [Next sprint/month]

3. **[Feature with third highest RICE]** (RICE: XXX)
   - Why: [Rationale]
   - Build: [Future/Backlog]

## Features Not Prioritized

- **[Feature name]** (RICE: XX) - Reason: [Why saying no]
- **[Feature name]** (RICE: XX) - Reason: [Why saying no]
```

**Example (Vibecoding Context):**
```markdown
# Feature Prioritization: 2026-02-17

## Features Under Consideration

### Feature 1: User Onboarding Flow
**Description:** Interactive tutorial for new users
- **Reach:** 1000 users/quarter (all new signups)
- **Impact:** 2 (high - reduces churn)
- **Confidence:** 80% (medium - based on customer interviews)
- **Effort:** 3 person-weeks
- **RICE Score:** (1000 × 2 × 0.8) / 3 = 533

### Feature 2: CSV Export
**Description:** Export data as CSV files
- **Reach:** 200 users/quarter (power users)
- **Impact:** 1 (medium - convenience feature)
- **Confidence:** 100% (high - frequently requested)
- **Effort:** 1 person-week
- **RICE Score:** (200 × 1 × 1.0) / 1 = 200

## Priority Order

1. **User Onboarding Flow** (RICE: 533)
   - Why: Highest impact on user retention
   - Build: This sprint

2. **CSV Export** (RICE: 200)
   - Why: Quick win, highly requested
   - Build: Next sprint
```

**Questions to ask:**
- Have I scored all features consistently?
- Does the priority order feel right?
- Can I say no to low-scoring features?

---

## Decision Trees

**Primary decision:** What to build first?

```
START: Multiple features to prioritize
  ↓
Q: Urgent vs Important?
  ├─ Urgent + Important → Build immediately
  ├─ Important, not urgent → Add to RICE scoring
  └─ Urgent, not important → Delegate or defer
      ↓
Q: Can we use RICE scoring?
  ├─ Yes → Calculate RICE for each
      ├─ Highest RICE → Build first
      ├─ Second RICE → Build next
      └─ Low RICE → Say no or defer
  └─ No → Use Value vs Effort matrix
      ├─ High Value, Low Effort → Build first
      ├─ High Value, High Effort → Build next
      ├─ Low Value, Low Effort → Build later
      └─ Low Value, High Effort → Don't build
```

---

## Skill Interactions

**Works with:**
1. Apply `strategic-build` (LNO) first to classify work type
2. Then apply `prioritization-craft` to order features within each category
3. Use `decision-frameworks` to document prioritization rationale

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**If multiple features being specified:**
- List all features under consideration
- Apply RICE scoring or Value vs Effort matrix
- Document priority order in spec
- Include "not building" section with rationale
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**When planning implementation:**
- Reference prioritization from spec
- Plan highest-priority features first
- Document why lower-priority features deferred
- Create `.vibecode/memory/decisions/active/[date]-prioritization.md`

**RICE scoring template:**
```markdown
# Feature Prioritization

## Scored Features
1. [Feature A] - RICE: XXX - Build first
2. [Feature B] - RICE: XXX - Build next
3. [Feature C] - RICE: XXX - Deferred

## Rationale
[Why this order makes sense]
```
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Order tasks by priority (highest RICE first)
- Tag tasks with priority level: [P0], [P1], [P2]
- Separate "must-have" from "nice-to-have"
- Document which tasks can be cut if time-constrained
<!-- COMMAND_SECTION_END: tasks -->

---

## Configuration

**Default weight:** `high`
**Recommended for:** Solo founders managing multiple features, teams with backlog
**Optional for:** Single-feature projects, very clear priorities
