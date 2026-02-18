---
skill: ship-decisions
category: builder
weight_default: critical
source: Shreyas Doshi, Marty Cagan, Jeff Bezos (Two-Way Doors), Tobi Lutke
vibecoding_phases: [specify, plan, tasks, implement]
---

# Ship Decisions: When to Ship vs Iterate

**One-line description:** Guides "ship or iterate?" decisions using reversible decision frameworks, shipping readiness scoring, and technical debt tradeoffs.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** ship, launch, deploy, ready, done, polish, iterate, refactor, technical debt
- **Workflow phases:** plan, tasks, implement
- **Context signals:** User asks "is this ready?", deciding between shipping vs iterating, balancing quality vs speed

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Reversible vs Irreversible Decisions (Two-Way Doors)
**Source:** Jeff Bezos, applied by Shreyas Doshi
**When to use:** Deciding if feature is ready to ship
**How to apply:**

**Concept:**
> "Some decisions are one-way doors - hard to reverse. Most are two-way doors - easy to reverse. Don't treat all decisions the same."

**🚪 Two-Way Doors (Reversible)**
- Can be undone or changed easily
- Low cost to reverse
- Learning > being right
- **Decision speed:** FAST (hours/days)
- **Action:** Ship and iterate

**🚪 One-Way Doors (Irreversible)**
- Hard or impossible to reverse
- High cost to undo
- Need to get it right
- **Decision speed:** SLOW (weeks/months)
- **Action:** Research, debate, decide carefully

**Decision Tree:**
```
Before shipping, ask:
1. "Can we reverse this decision?"
   - YES → Two-way door → Ship fast, iterate
   - NO → One-way door → Go slow, get it right

2. "What's the cost of being wrong?"
   - LOW → Ship and learn
   - HIGH → Research more

3. "Can we learn more by shipping?"
   - YES → Ship to learn
   - NO → Prototype/test first
```

**Example (Vibecoding Context):**
```
TWO-WAY DOORS (Ship Fast):
✅ Button color, UI layout
✅ Copy/messaging
✅ Feature flag experiments
✅ Algorithm tweaks (with monitoring)
✅ MVP feature set (can add more later)

ONE-WAY DOORS (Go Slow):
⚠️ Database schema (migrations expensive)
⚠️ API contracts (breaking changes hurt users)
⚠️ Architecture (refactoring expensive)
⚠️ Subscription billing model
⚠️ Auth system choice
```

**Questions to ask:**
- Is this decision reversible?
- What's the cost of being wrong?
- Can we learn more by shipping than by building more?

---

### Framework 2: The Shipping Scorecard (5-Check System)
**Source:** Shreyas Doshi
**When to use:** Deciding if feature is ready to ship
**How to apply:**

**Concept:**
> "Don't ship broken products. But also don't wait for perfect. Ship when it's good enough for real users to get value."

**The 5 Checks:**

**✅ 1. Core Functionality Works**
- Happy path functions end-to-end
- User can complete main job
- No critical bugs

**✅ 2. Edge Cases Acceptable**
- Not perfect, but handled gracefully
- Errors don't break experience
- User can recover

**✅ 3. Reversible Decision**
- Can we undo or iterate?
- Is this a two-way door?
- What's the rollback plan?

**✅ 4. Learning Value > Polish Value**
- Will shipping teach us more than building more?
- Do we need real user feedback to improve?
- Is hypothetical polish valuable without data?

**✅ 5. Risk Mitigated**
- Critical failure modes addressed
- Monitoring in place
- Gradual rollout plan (if applicable)

**Scoring:**
```
5/5 checks → SHIP NOW
4/5 checks → SHIP TO SMALL GROUP
3/5 checks → ITERATE ONE MORE CYCLE
<3/5 checks → NOT READY
```

**Example (Vibecoding Context):**
```markdown
Feature: User authentication system

✅ Core Functionality Works
   - Users can sign up, log in, log out
   - Sessions persist correctly

✅ Edge Cases Acceptable
   - Password reset works
   - Invalid credentials show clear error
   - Rate limiting prevents abuse

✅ Reversible Decision
   - Auth0 integration can be swapped if needed
   - User data exportable

✅ Learning Value > Polish
   - Need real users to validate flow
   - Don't know if OAuth providers are needed yet

✅ Risk Mitigated
   - HTTPS enforced
   - Passwords hashed with bcrypt
   - Session tokens secure

Score: 5/5 → SHIP NOW
```

**Questions to ask:**
- Does the happy path work end-to-end?
- Are edge cases handled gracefully (not perfectly)?
- Can we ship to learn, or do we need to build more?
- What's our rollback plan?

---

### Framework 3: Technical Debt vs Shipping Speed
**Source:** Marty Cagan, Tobi Lutke
**When to use:** Deciding whether to refactor before shipping
**How to apply:**

**Concept:**
> "Technical debt isn't inherently bad. It's bad when it slows you down. Ship fast, pay down debt strategically."

**When to Ship with Tech Debt:**
- **Learning debt:** Need user feedback to validate approach
- **Temporary:** Planning to refactor soon anyway
- **Isolated:** Debt doesn't affect other systems
- **Value >> Debt cost:** User value gained > refactor cost

**When to Pay Down Debt First:**
- **Compounding debt:** Will make future changes harder
- **Security/Privacy:** User trust at risk
- **Platform/API:** Breaking changes expensive
- **Team velocity:** Slowing everyone down

**Decision Framework:**
```
Assess Tech Debt:
1. What's the carrying cost?
   - Slows future features?
   - Creates bugs?
   - Blocks iteration?

2. What's the payoff of fixing?
   - Unblocks work?
   - Reduces bugs?
   - Improves velocity?

3. What's the user value of shipping now?
   - Solves immediate problem?
   - Validates hypothesis?
   - Competitive advantage?

Decision:
IF (user value > debt cost) → SHIP NOW
IF (debt blocks future) → REFACTOR FIRST
IF (uncertain) → SHIP TO SMALL GROUP
```

**Example (Vibecoding Context):**
```markdown
Scenario: MVP dashboard with hardcoded queries

Tech Debt:
- Database queries hardcoded (not parameterized)
- No caching layer
- Duplicate code in 3 files

Carrying Cost:
- Medium: Slows adding new charts
- Low: Doesn't affect other features

User Value of Shipping:
- High: Validates if users want dashboard
- High: Need real usage data to know what to optimize

Decision: SHIP NOW
- Debt is isolated
- Learning value >> refactor cost
- Can refactor based on real usage patterns
```

**Questions to ask:**
- Does this debt compound or stay isolated?
- What's the cost of refactoring now vs later?
- What user value do we get by shipping now?
- Can we learn something that would change how we refactor?

---

## Decision Trees

**Primary decision:** Ship now vs iterate more?

```
START: Feature development complete
  ↓
Q: Is this a one-way or two-way door?
  ├─ One-way → Go slow, research more
  └─ Two-way → Continue
      ↓
Q: What's the shipping scorecard?
  ├─ 5/5 → SHIP NOW
  ├─ 4/5 → SHIP TO SMALL GROUP
  ├─ 3/5 → ITERATE ONE MORE CYCLE
  └─ <3/5 → NOT READY
      ↓
Q: Is there tech debt?
  ├─ No → SHIP
  └─ Yes → Assess
      ├─ User value > debt cost → SHIP
      ├─ Debt blocks future → REFACTOR FIRST
      └─ Uncertain → SHIP TO SMALL GROUP
```

---

## Skill Interactions

**Works with:**
1. Apply `quality-speed` first to decide prototype-fast vs build-robust position
2. Then apply `ship-decisions` to decide if current quality level is ship-worthy
3. Use `strategic-build` LNO to prioritize refactoring work (Leverage > Neutral > Overhead)

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
- Define "done" criteria (what makes this feature shippable?)
- Identify one-way vs two-way door decisions
- Set quality bar using LNO classification
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
- Plan gradual rollout strategy (if applicable)
- Identify rollback mechanisms
- Document tech debt tradeoffs explicitly
- Apply 5-check shipping scorecard
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Tag tasks as "must-have for ship" vs "nice-to-have"
- Create rollback tasks if needed
- Separate "ship" tasks from "polish" tasks
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**When deciding to ship:**

Ask the 5 shipping checks:
1. ✅ Core functionality works?
2. ✅ Edge cases acceptable?
3. ✅ Reversible decision?
4. ✅ Learning value > polish value?
5. ✅ Risk mitigated?

**Score interpretation:**
- 5/5 → Ship to production
- 4/5 → Ship to small group first
- 3/5 → One more iteration cycle
- <3/5 → Not ready yet

**If tech debt exists:**
- Document in `.vibecode/memory/trade-offs/[feature]-tech-debt.md`
- Assess: user value vs debt cost
- Decide: ship now or refactor first
- Log decision rationale
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical`
**Recommended for:** All users (fundamental to shipping decisions)
**Optional for:** None (shipping decisions are universal)
