---
skill: continuous-discovery
category: builder
weight_default: low
source: Teresa Torres (Continuous Discovery Habits)
vibecoding_phases: [specify, plan]
---

# Continuous Discovery Habits

**One-line description:** Weekly customer contact, opportunity solution trees, and assumption testing to validate ideas before building.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** discovery, customer, interview, research, validate, assumption, test, user, feedback, opportunity
- **Workflow phases:** specify, plan
- **Context signals:** Need to validate assumptions, understanding user needs, deciding what to build

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Weekly Customer Contact
**Source:** Teresa Torres
**When to use:** Establishing discovery habit, deciding what to build
**How to apply:**

**Core Principle:**
> "At a minimum, weekly touchpoints with customers by the team building the product, where they conduct small research activities in pursuit of a desired outcome."

**For Solo Founders:**
- **Weekly:** 3-5 customer conversations (don't need full product trio)
- **Small:** 15-30 minute conversations, not formal interviews
- **Focused:** Pursuing specific outcome or assumption test

**Example (Vibecoding Context):**
```markdown
Solo Founder Weekly Routine:

Monday-Wednesday:
- 3 quick user conversations (15-20 min each)
- Ask about current workflow, not just your product
- Listen for pain points and workarounds

Thursday:
- Synthesize learnings (30 min)
- Update opportunity solution tree
- Identify assumptions to test

Friday:
- Decide: build, test more, or pivot?
- Plan next week's discovery activities
```

**Questions to ask customers:**
- "Walk me through how you currently do [task]"
- "What's frustrating about that?"
- "What workarounds have you tried?"
- "If you could wave a magic wand, what would change?"

---

### Framework 2: Opportunity Solution Trees
**Source:** Teresa Torres
**When to use:** Visualizing path from outcome to solution
**How to apply:**

**The Structure:**
```
Outcome (what you're trying to achieve)
    ↓
Opportunities (customer needs/pain points)
    ↓
Solutions (possible ways to address)
    ↓
Assumptions (what needs to be true)
    ↓
Experiments (how to test)
```

**Example (Vibecoding Context):**
```markdown
Outcome: Increase user retention to 60%
    ↓
Opportunity: Users forget to use the product daily
    ↓
Solutions considered:
  1. Daily email reminder
  2. Slack/Discord integration
  3. Browser extension
    ↓
Assumptions for Solution 1 (Email):
  - Users check email daily ✓ (validated in 5 interviews)
  - Users want reminders ❌ (3/5 said "too spammy")
    ↓
Decision: Test Solution 2 (Slack) based on evidence
```

**Questions to ask:**
- What outcome am I pursuing?
- What customer pain points did I hear?
- What solutions could address this?
- What needs to be true for this solution to work?
- What's the cheapest way to test this assumption?

---

### Framework 3: Assumption Testing
**Source:** Teresa Torres
**When to use:** Before building features
**How to apply:**

**The Question:**
> "What needs to be true for this solution to work?"

**Testing Progression (cheapest to most expensive):**
```
1. One-question survey (5 min)
2. Customer interviews (1 hour)
3. Clickable prototype (1 day)
4. Fake door test (1 day - track clicks on "coming soon")
5. Concierge test (1 week - do it manually)
6. Build MVP (1-2 weeks)
```

**Rule:** Test highest-risk assumptions first with lowest-cost method

**Example (Vibecoding Context):**
```markdown
Feature: AI-powered code review suggestions

Assumptions:
1. Users want AI suggestions (HIGH RISK)
   → Test: Add "coming soon" button, track clicks
   → Result: 40% clicked → VALIDATED

2. Users trust AI for code quality (HIGH RISK)
   → Test: Interview 5 users about AI trust
   → Result: 2/5 worried about accuracy → CONCERN
   → Next: Concierge test with manual review first

3. Users will configure AI preferences (MEDIUM RISK)
   → Test: Skip for now, build default-on first
   → Validate after launch

Decision: Build with manual review first (concierge),
then automate if users trust it.
```

**Questions to ask:**
- What's the riskiest assumption?
- What's the cheapest test?
- What would prove this wrong?
- Can I test without building?

---

## Decision Trees

**Primary decision:** Should I build this feature?

```
START: Feature idea proposed
  ↓
Q: Do I have a clear outcome?
  - No → Define outcome first
  - Yes → Continue
      ↓
Q: Have I talked to 3+ customers about this?
  - No → Do discovery first
  - Yes → Continue
      ↓
Q: What opportunities (pain points) did I hear?
  - None → Don't build (no problem to solve)
  - Some → Continue
      ↓
Q: What assumptions need to be true?
  - List them
  - Rank by risk
      ↓
Q: Have I tested the high-risk assumptions?
  - No → Test assumptions first
  - Yes → Build it!
```

---

## Skill Interactions

**Works with:**
1. Use `jtbd-building` to understand deeper customer motivations
2. Apply `continuous-discovery` to validate the job with real customers
3. Use `exp-driven-dev` to test assumptions with data

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Validate before specifying:**

Before writing spec, answer:
- [ ] Talked to 3+ customers about this problem?
- [ ] Identified clear opportunity (pain point)?
- [ ] Listed key assumptions?
- [ ] Tested high-risk assumptions?

Include in spec:
- **Customer Evidence:** "5 users said..." with quotes
- **Opportunity:** Clear pain point or unmet need
- **Assumptions:** What needs to be true
- **Validation:** How assumptions were tested

Template:
```markdown
## Customer Discovery

**Customers interviewed:** [3-5]
**Key pain point:** [Opportunity from interviews]

**Evidence:**
- User 1: "[Quote about pain point]"
- User 2: "[Quote about pain point]"
- User 3: "[Quote about pain point]"

**Assumptions to test:**
1. [Assumption 1] - [How to test]
2. [Assumption 2] - [How to test]
```
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Plan testing before building:**

Before implementation, plan:
- [ ] What's the MVP test (smallest version to validate)?
- [ ] Can we test with fake door / concierge / prototype?
- [ ] What metrics will prove/disprove assumptions?

Document to: `.vibecode/memory/decisions/active/[date]-discovery-[feature].md`

Template:
```markdown
## Discovery Plan

**High-risk assumptions:**
1. [Assumption]
   - Test method: [How to validate]
   - Success criteria: [What proves this true]
   - Fallback: [What if wrong]

**Testing approach:**
- Week 1: [Cheapest test]
- Week 2: [Build if validated, pivot if not]
```
<!-- COMMAND_SECTION_END: plan -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Early-stage features, high uncertainty, new markets
**Optional for:** Internal tools, well-understood problems, iteration on proven features

