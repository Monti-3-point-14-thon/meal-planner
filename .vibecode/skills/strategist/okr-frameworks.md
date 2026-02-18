---
skill: okr-frameworks
category: strategist
weight_default: low
source: Christina Wodtke (Radical Focus), Google OKR methodology
vibecoding_phases: [constitution, specify]
---

# OKR & Goal Setting Frameworks

**One-line description:** Write effective OKRs (Objectives and Key Results) for quarterly goal setting, alignment, and measurement.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** okr, goal, objective, key result, quarterly, target, metric, measurement, kpi
- **Workflow phases:** constitution, specify
- **Context signals:** Setting quarterly goals, defining success metrics, aligning on outcomes

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: OKR Structure (Objective + Key Results)
**Source:** Christina Wodtke, Google
**When to use:** Setting quarterly or annual goals
**How to apply:**

**Core Principle:**
> "OKRs are not a project management tool. They're an alignment and focus tool."

**The Structure:**
```
Objective (inspiring, qualitative)
├─ Key Result 1 (measurable, outcome-based)
├─ Key Result 2 (measurable, outcome-based)
└─ Key Result 3 (measurable, outcome-based)
```

**Good Objective:**
- Inspiring (makes you excited)
- Qualitative (describes aspiration, not number)
- Time-bound (typically quarterly)
- Ambitious (stretch goal)

**Good Key Results:**
- Measurable (specific number)
- Outcome-based (not activities)
- Achievable but ambitious (60-70% confidence)
- Clear finish line (know when done)

**Example (Vibecoding Context):**
```markdown
❌ BAD OKR:
Objective: Improve the product
Key Results:
- Ship 10 features
- Write more documentation
- Get more users

Problems:
- Objective not inspiring
- KRs are activities, not outcomes
- Not measurable or ambitious

✅ GOOD OKR:
Objective: Become the fastest onboarding in our category

Key Results:
- Time to first value < 5 minutes (currently 15 min)
- Activation rate > 70% (currently 45%)
- Onboarding NPS > 50 (currently 20)

Why good:
- Objective is inspiring and clear
- KRs are measurable outcomes
- Shows current baseline
- Ambitious but achievable
```

**Questions to ask:**
- Is the objective inspiring? (Do I care about this?)
- Are key results outcomes, not activities?
- Can I measure progress weekly?
- Am I 60-70% confident we can hit this?

---

### Framework 2: OKR Quality Checks
**Source:** Google OKR best practices
**When to use:** Reviewing draft OKRs before committing
**How to apply:**

**The Checklist:**

**For Objectives:**
- [ ] **Inspiring:** Does this make me excited?
- [ ] **Qualitative:** No numbers in the objective itself
- [ ] **Time-bound:** Clear timeframe (typically quarterly)
- [ ] **Ambitious:** Stretch goal, not business-as-usual
- [ ] **Directional:** Clear what success looks like

**For Key Results:**
- [ ] **Measurable:** Has a specific number/metric
- [ ] **Outcome-based:** Not activities ("launch X") but outcomes ("increase Y by Z")
- [ ] **Ambitious:** 60-70% confidence (not 95%)
- [ ] **Baseline shown:** Current state documented
- [ ] **Finish line clear:** Know exactly when achieved

**Red Flags:**

**❌ Activity-based KRs:**
- "Ship 5 features" → What outcome do features drive?
- "Run 10 user interviews" → What did we learn? What changed?

**❌ 100% confidence KRs:**
- Too easy, not ambitious enough
- Should feel like a stretch

**❌ Vague KRs:**
- "Improve user satisfaction" → By how much? Measured how?
- "Increase revenue" → By when? From what baseline?

**Example (Vibecoding Context):**
```markdown
Draft OKR Review:

Objective: Launch new AI feature
❌ Problem: Not inspiring, sounds like activity

Revised: Become the go-to AI code review tool for solo founders
✅ Better: Inspiring, directional, clear aspiration

Key Result 1: Ship AI review feature by Q2
❌ Problem: Activity, not outcome

Revised: 1000+ AI reviews completed (currently 0)
✅ Better: Measurable outcome, shows baseline

Key Result 2: Get positive feedback
❌ Problem: Vague, not measurable

Revised: NPS > 40 for AI feature (measured monthly)
✅ Better: Specific metric, measurement cadence

Key Result 3: Users adopt AI reviews > 80%
❓ Issue: Might be too ambitious (need 60-70% confidence)

Check: Can we hit 80% in first quarter?
- If 95% confident → too easy, raise it
- If 40% confident → too hard, lower it
- If 60-70% confident → just right ✅
```

**Questions to ask:**
- Would I know if we achieved this? (Clear finish line)
- Is this outcome or activity?
- Am I 60-70% confident? (Not too easy, not impossible)
- Does this KR connect to the objective?

---

### Framework 3: OKR Cadence (Solo Founder Edition)
**Source:** Adapted for solo founders (less overhead)
**When to use:** Establishing OKR rhythm
**How to apply:**

**For Solo Founders:**

**Quarterly OKRs (Recommended):**
- Set 1-2 objectives per quarter (not 5+)
- 3 key results per objective
- Keep it simple, not bureaucratic

**Monthly Check-ins:**
- Review progress on KRs
- Adjust tactics if off-track
- Don't change OKRs mid-quarter (commit)

**End-of-Quarter Review:**
- Score KRs (% achieved)
- Reflect on what worked/didn't
- Set next quarter's OKRs

**Example Cadence:**
```markdown
Week 1 of Quarter:
- Set OKRs for the quarter
- Share publicly (blog, Twitter) for accountability
- Break into monthly milestones

Weeks 2-12 (Rest of Quarter):
- Weekly: Check KR progress (5 min)
- Monthly: Deeper review, adjust tactics (30 min)
- Don't change OKRs (stay committed)

Week 13 (Quarter End):
- Score OKRs (0.0 to 1.0)
  - 0.0-0.3: We failed, learn why
  - 0.4-0.6: Good! Hit stretch goal
  - 0.7-1.0: Too easy, next time be more ambitious
- Write retrospective
- Set next quarter's OKRs
```

**Questions to ask:**
- How many OKRs can I actually track? (Keep it simple)
- Where will I document progress? (Don't overcomplicate)
- Who will hold me accountable? (Public sharing helps)
- Am I changing OKRs mid-quarter? (Red flag - stay committed)

---

## Decision Trees

**Primary decision:** Are these good OKRs?

```
START: Draft OKRs
  ↓
Q: Is objective inspiring?
  - No → Rewrite until excited
  - Yes → Continue
      ↓
Q: Are KRs measurable outcomes (not activities)?
  - No → Rewrite as outcomes
  - Yes → Continue
      ↓
Q: Do I have baseline data?
  - No → Measure current state first
  - Yes → Continue
      ↓
Q: Am I 60-70% confident I can hit this?
  - <50% → Too ambitious, lower bar
  - >80% → Not ambitious enough, raise bar
  - 60-70% → Good! Commit
      ↓
Q: Can I track this weekly?
  - No → Simplify or add measurement
  - Yes → Set OKRs and go!
```

---

## Skill Interactions

**Works with:**
1. Use `strategy-frameworks` to define long-term strategy
2. Apply `okr-frameworks` to set quarterly measurable goals
3. Use `metrics-frameworks` to choose right metrics for KRs
4. Apply `prioritization-craft` to prioritize initiatives toward OKRs

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: constitution -->
### In /vibecode:constitution
**Document OKR approach:**

When creating constitution, include goals section:

```markdown
## Goal Setting

### OKR Cadence
- **Quarterly OKRs:** 1-2 objectives, 3 KRs each
- **Monthly check-ins:** Progress review, tactics adjustment
- **Public sharing:** [Twitter/blog] for accountability

### Current Quarter OKRs

**Q[X] [Year]**

Objective 1: [Inspiring goal]
- KR1: [Metric] from [baseline] to [target]
- KR2: [Metric] from [baseline] to [target]
- KR3: [Metric] from [baseline] to [target]

Objective 2: [Inspiring goal]
- KR1: [Metric] from [baseline] to [target]
- KR2: [Metric] from [baseline] to [target]
- KR3: [Metric] from [baseline] to [target]
```

Document to: `.vibecode/memory/core/constitution.md` (Goals section)
<!-- COMMAND_SECTION_END: constitution -->

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Connect features to OKRs:**

For each feature, ask:
- [ ] Which OKR does this support?
- [ ] Which KR will this move?
- [ ] By how much? (Estimate impact)
- [ ] If doesn't support OKR → why build it?

Include in spec:
```markdown
## OKR Alignment

**Objective:** [Which objective does this support?]
**Key Result:** [Which KR will this move?]
**Expected Impact:** [Estimate: move KR by X%]

**If doesn't align with current OKRs:**
- Reason: [Why build anyway?]
- OR Defer: [Wait until next quarter when OKRs change]
```

Example:
```markdown
Feature: Onboarding tutorial

OKR Alignment:
- Objective: Become fastest onboarding in category
- Key Result: Time to first value < 5 min (currently 15 min)
- Expected Impact: Reduce by 5 min (from 15 to 10 min)

Rationale: Directly moves primary KR, high priority
```
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Quarterly planning, goal setting, multi-month initiatives
**Optional for:** Tactical features, bug fixes, experiments (not everything needs OKRs)

**Note for Solo Founders:**
Don't overuse OKRs. They're for quarterly focus, not every feature. Most features should just ship fast and iterate. Use OKRs for 2-3 big bets per quarter.

