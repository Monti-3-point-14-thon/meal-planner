---
skill: jtbd-building
category: builder
weight_default: low
source: Bob Moesta (JTBD Co-Creator), Clayton Christensen
vibecoding_phases: [specify, plan]
---

# Jobs-to-be-Done Product Design

**One-line description:** Designs features based on customer jobs, push/pull forces, and functional/emotional/social needs beyond stated feature requests.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** job, need, customer, user, problem, pain, struggle, hire, fire, switch
- **Workflow phases:** specify, plan
- **Context signals:** Understanding customer needs, designing features, moving beyond feature requests

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Jobs Theory
**Source:** Bob Moesta, Clayton Christensen
**When to use:** Designing new features, understanding what users really need
**How to apply:**

**Core Principle:**
> "People don't buy products, they hire them to make progress in their lives."

**The Job Statement:**
```
When [situation],
I want to [motivation],
So I can [expected outcome].
```

**Three Dimensions:**
1. **Functional:** What needs to get done?
2. **Emotional:** How do they want to feel?
3. **Social:** How do they want to be perceived?

**Example (Vibecoding Context):**
```markdown
Job: Solo founder needs to ship MVP quickly

Functional Job:
When I'm building my first feature,
I want to know exactly what to build,
So I can ship in 1 week instead of 1 month.

Emotional Job:
- Feel confident I'm building the right thing
- Feel momentum, not stuck in analysis paralysis
- Feel like I'm making real progress

Social Job:
- Be seen as someone who ships fast
- Show investors tangible progress
- Demonstrate execution ability
```

**Questions to ask:**
- What job is the user trying to get done?
- What progress are they trying to make?
- What emotional needs does this satisfy?
- How does this affect how others see them?

---

### Framework 2: Forces Diagram
**Source:** Bob Moesta
**When to use:** Understanding why users adopt or don't adopt solutions
**How to apply:**

**Four Forces:**
```
        PULL (toward new solution)
              ↓
OLD ←→ HABIT    ANXIETY ←→ NEW
              ↑
        PUSH (away from current)
```

**PUSH (Problems with Current Solution):**
- Pains and frustrations
- What's not working
- Drives search for alternatives

**PULL (Attraction to New Solution):**
- Expected benefits
- Desired improvements
- Vision of better state

**ANXIETY (Hesitation):**
- Fear of new solution
- "What if it doesn't work?"
- Uncertainty about change

**HABIT (Inertia):**
- "Current way works okay"
- Switching costs
- Comfort with familiar

**Example (Vibecoding Context):**
```markdown
Feature: Automated test generation

PUSH (away from current):
- Manual testing takes hours
- Bugs slip through to production
- No time for comprehensive testing

PULL (toward automated tests):
- Catch bugs automatically
- Ship with confidence
- Save 5+ hours per week

ANXIETY (hesitation):
- "What if tests are flaky?"
- "Will this slow down development?"
- "Do I need to learn new tools?"

HABIT (inertia):
- "Manual testing works most of the time"
- "I know how to test manually"
- "Setting up automation seems complex"

Design to:
- Amplify PUSH: Show time wasted on bugs
- Amplify PULL: Demo quick setup, show time saved
- Reduce ANXIETY: Provide examples, fallback to manual
- Overcome HABIT: Make setup < 5 minutes
```

**Questions to ask:**
- What pushes users away from current solution?
- What pulls them toward new solution?
- What anxieties prevent adoption?
- What habits keep them with current solution?

---

## Decision Trees

**Primary decision:** What job is this feature being hired to do?

```
START: Feature idea proposed
  ↓
Q: What job is the user trying to accomplish?
  - Define: [Situation, Motivation, Outcome]
  ↓
Q: What are the three dimensions?
  - Functional: [What gets done]
  - Emotional: [How they feel]
  - Social: [How they're perceived]
  ↓
Q: What forces are at play?
  - PUSH: [Pains with current]
  - PULL: [Benefits of new]
  - ANXIETY: [Fears about new]
  - HABIT: [Comfort with current]
  ↓
Design feature to:
  - Accomplish the job
  - Satisfy emotional/social needs
  - Amplify push/pull
  - Reduce anxiety/habit
```

---

## Skill Interactions

**Works with:**
1. Apply `zero-to-launch` to identify MVP job (one core job)
2. Use `jtbd-building` to understand deeper why behind that job
3. Apply `prioritization-craft` to prioritize jobs by RICE

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**For each feature, define the job:**

Job Statement Template:
```
When [situation],
I want to [motivation],
So I can [outcome].
```

Forces Analysis:
- PUSH: [Current pains]
- PULL: [Desired benefits]
- ANXIETY: [User hesitations]
- HABIT: [Current inertia]

Include in spec:
- Functional job (what gets done)
- Emotional job (how they feel)
- Social job (how they're perceived)
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Design solution for the job:**

Address forces in implementation:
- Amplify PUSH: Surface current pains
- Amplify PULL: Deliver expected benefits quickly
- Reduce ANXIETY: Provide examples, clear docs, easy rollback
- Overcome HABIT: Make adoption <5 min, low switching cost

Document to: `.vibecode/memory/decisions/active/[date]-jtbd-[feature].md`
<!-- COMMAND_SECTION_END: plan -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** User-facing products, consumer apps
**Optional for:** Internal tools, backend systems, MVP phase (use simplified job statements)
