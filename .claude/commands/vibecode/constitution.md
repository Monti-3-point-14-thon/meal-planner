---
name: vibecode.constitution
description: Create or update project constitution - defines principles, standards, and decision frameworks
---

# /vibecode.constitution - Establish Project Principles

## Purpose

Create the **foundational document** that guides all project decisions.

**This is your "technical co-founder's" value system.**

## When to Use

- **First time**: When starting a new project
- **Update**: When principles evolve (after major milestones)
- **Review**: Periodically to ensure alignment

## What This Command Does

1. **Activates PM Skills**: `strategic-build`, `culture-craft`
2. **Guides constitution creation** using Shreyas Doshi's LNO framework
3. **Defines quality bars** for different types of work
4. **Establishes prototype vs robust criteria**
5. **Sets technical standards** and architecture philosophy

## Execution Steps

### Step 1: Check if Constitution Exists

```bash
Check: .vibecode/memory/core/constitution.md
```

**If exists**:
- Ask: "Constitution already exists. Do you want to review, update, or create new version?"
- Options: Review, Update, New Version

**If doesn't exist**:
- Proceed to Step 1b

### Step 1b: Check Project Mode

```bash
Read: .vibecode/session/state.json
```

**If `flags.existing-project === true`**:
- Proceed to Step 1c (Existing Project Flow)

**Else** (greenfield project):
- Proceed to Step 2 (Standard Flow)

### Step 1c: Existing Project Constitution Flow

**This flow is for projects that were integrated into vibecoding (not greenfield).**

#### Pre-load Memory

```bash
Read: .vibecode/memory/core/tech-stack-rationale.md
Read: .vibecode/memory/core/architecture-decisions.md
Read: .vibecode/memory/decisions/active/[date]-onboarding-snapshot.md
```

#### Present Context

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Existing Project Constitution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From onboarding:
• Tech Stack: [summarize from tech-stack-rationale.md]
• Architecture: [summarize from architecture-decisions.md]
• Components: [count from component registry]
• Constraints: [user-provided constraints]

This constitution will focus on:
✓ Standards for NEW features
✓ When to match vs diverge from existing patterns
✓ Evolution strategy for the codebase
```

#### Existing Project Questions

**Question 1: Evolution Scope**

```
How should we handle existing code?

1) Preserve & Extend (Recommended)
   → Keep existing patterns as-is
   → New features match current style
   → Only change when absolutely necessary

2) Gradual Modernization
   → New features can use improved patterns
   → Opportunistic refactoring when touching code
   → Document deviations and rationale

3) Active Improvement
   → Refactor existing code when beneficial
   → Establish new standards, migrate gradually
   → Higher change tolerance

Which approach fits your goals?
```

**Question 2: Pattern Consistency**

```
When building new features, how strictly should we match existing patterns?

1) Strictly Match
   → Always follow existing conventions
   → Consistency > improvement
   → Minimize cognitive load for codebase

2) Balanced (Recommended)
   → Match by default
   → Diverge when significant benefit
   → Document and explain deviations

3) Flexible
   → Treat existing patterns as reference
   → Choose best approach per feature
   → Build component bridge layer if needed

Choice:
```

**Question 3: Tech Stack Evolution**

```
Current stack: [from tech-stack-rationale.md]

Can new features use different technologies?

1) Existing Stack Only
   → No new frameworks or major libraries
   → Stay within current tech boundaries
   → Maximize consistency

2) Hybrid Allowed (Recommended)
   → New tech for genuinely better solutions
   → Require strong justification
   → Evaluate migration cost

3) Flexible Evolution
   → Open to better tools
   → Willing to maintain multiple approaches
   → Accept complexity for capabilities

Choice:
```

**Question 4: Quality Bar**

```
How should quality standards compare?

1) Match Existing
   → Same testing, docs, polish level
   → Don't raise or lower bar
   → Consistency across codebase

2) Higher for New (Recommended)
   → New code meets elevated standards
   → Gradually improves overall quality
   → Sets precedent for future work

3) Uniform Quality Push
   → Establish high bar, apply to all
   → Refactor existing to meet standards
   → Cohesive quality throughout

Choice:
```

**Question 5: Refactoring Trigger**

```
When should we refactor existing code?

1) Minimal
   → Only when blocking new features
   → Never refactor for "cleanliness"
   → Stability over improvement

2) Opportunistic (Recommended)
   → Refactor code we're touching anyway
   → Fix root causes, not symptoms
   → Balance improvement with velocity

3) Proactive
   → Address technical debt regularly
   → Refactor before it blocks work
   → Invest in long-term maintainability

Choice:
```

#### Create Existing Project Constitution

**Based on answers, create constitution with these sections**:

```markdown
# Project Constitution - Evolutionary Development

**Version**: 1.0.0
**Created**: [DATE]
**Mode**: Existing Project Evolution
**Last Updated**: [DATE]

## Core Principles

### I. Baseline Respect

This project had [X years/months] of development before vibecoding integration.
Existing code represents valid decisions made with available context at the time.

**Our approach**: [User's choice from Question 1]

**Pattern consistency**: [User's choice from Question 2]

### II. Evolution Strategy

**Tech Stack Policy**: [User's choice from Question 3]

**Quality Standards**: [User's choice from Question 4]

**Current Stack**:
- [Summarize from tech-stack-rationale.md]

**Constraints**:
- [List from onboarding snapshot]

### III. Change Protocol

When diverging from existing patterns:
1. Document the reason (user benefit, technical debt fix, etc.)
2. Consider blast radius (how much existing code affected)
3. [If Gradual Modernization]: Create bridge pattern if needed
4. Log decision to memory layer

**Refactoring Policy**: [User's choice from Question 5]

## Work Classification (LNO Framework)

### Leverage Work
[Same as greenfield - ask about their quality bar]

### Neutral Work
[Same as greenfield]

### Overhead Work
[Same as greenfield]

## Technical Standards for New Features

**Code Quality**: [Based on Question 4 choice]
**Testing**: [Match existing or higher - specify]
**Documentation**: [Match existing or higher - specify]
**Performance**: [Any specific requirements]

## Prototype vs Robust Decision Framework

[Same as greenfield - when to ship fast vs build for scale]

## Architectural Consistency

**When to Match Existing**:
- Feature fits current architecture naturally
- Pattern is proven and working well
- Consistency benefits team/maintenance

**When to Diverge**:
- Existing pattern doesn't fit use case
- Technical debt would be propagated
- Significantly better approach available
- [Additional criteria from user]

**Decision Template**: Use technical implications flow (ask-context-explain)

## Review & Evolution

**Constitution Review**: Every [3/6/12 months]
**Re-onboard Codebase**: If major changes occur
**Pattern Library Updates**: As new patterns emerge

---

**This constitution guides evolution while respecting the existing codebase.**
```

#### Save and Update State

```bash
Write: .vibecode/memory/core/constitution.md

Update: .vibecode/session/state.json
- Set flags.has-constitution = true
- Set current.last-command = "constitution"
- Set project.last-active = [current timestamp]
```

#### Confirm Completion

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Constitution Created! (Existing Project Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your project now has evolutionary principles:
✓ Evolution scope: [choice]
✓ Pattern consistency: [choice]
✓ Tech stack policy: [choice]
✓ Quality standards: [choice]
✓ Refactoring policy: [choice]

Saved: .vibecode/memory/core/constitution.md

Next Steps:
1. Run: /vibecode:specify "your next feature"
2. Claude will reference existing patterns and constitution

The framework will match your existing code by default,
diverging only when beneficial and documented.
```

**After Step 1c completes, the command ends (don't proceed to Step 2).**

### Step 2: Activate PM Skills (Greenfield Flow)

**Primary Skills**:
- `strategic-build` (LNO Framework - Leverage/Neutral/Overhead)
- `culture-craft` (Standards and quality)
- `decision-frameworks` (Decision-making approach)

**Read**: `.vibecode/pm-skills-config.json` to check skill configuration

### Step 3: Gather Project Context

Ask the user these questions:

**1. Project Vision**
```
What are you building and why?
- Product description:
- Target user:
- Core problem solving:
```

**2. Work Classification (LNO Framework)**

Explain Shreyas Doshi's framework:
- **Leverage**: Work that creates outsized impact (10x a metric, unlocks capabilities)
- **Neutral**: Keeps lights on, necessary but not transformative
- **Overhead**: Low-value, should be minimized

Ask:
```
For this project, how should we classify work?
- What counts as Leverage work? (your quality bar here)
- What's acceptable for Neutral work? (good enough)
- How do we minimize Overhead? (automation, elimination)
```

**3. Prototype vs Robust Decision Criteria**

Present the technical implications flow:

```
When should we prototype (ship fast)?
- Unvalidated features
- <100 users
- Tight budget
- Need to test hypothesis

When should we build robust?
- Validated features (users proven demand)
- Core product value
- >100 users or rapid growth expected
- Security/compliance required

Ask: What's your default approach? (prototype-first, balanced, robust-first)
```

**4. Technical Philosophy**

```
- Tech stack preferences? (or flexible based on task)
- Code quality standards? (tests required? documentation?)
- AI usage guidelines? (where to use AI, model selection)
- Design philosophy? (UX principles, accessibility level)
```

### Step 4: Draft Constitution

Using the answers, draft a constitution following the template in `.vibecode/memory/core/constitution.md`.

**Sections to fill**:

1. **Core Principles** (3-5 principles based on user's vision)
2. **Work Classification** (LNO framework customized to this project)
3. **Technical Standards** (architecture, code quality, tech stack)
4. **Prototype vs Robust Framework** (decision criteria)
5. **AI Usage Guidelines** (when to use AI, model selection)
6. **Design Philosophy** (UX principles, visual standards)
7. **Governance** (how to amend, review cadence)

### Step 5: Present Draft for Review

Show the drafted constitution and ask:

```
I've drafted your project constitution based on your inputs.

Please review each section:
1. Core Principles - Do these resonate?
2. LNO Classification - Does this match your approach?
3. Technical Standards - Any missing or wrong?
4. Prototype vs Robust - Clear criteria?

What needs adjustment?
```

### Step 6: Save Constitution

Once approved:

```bash
Write: .vibecode/memory/core/constitution.md
```

Update state:
```bash
Update: .vibecode/session/state.json
- Set project.name = [project name from user or directory name] (if null)
- Set project.initialized = [current timestamp] (if null)
- Set project.last-active = [current timestamp]
- Set flags.has-constitution = true
- Set flags.pm-skills-configured = true
- Set current.phase = "constitution"
- Set current.last-command = "constitution"
```

### Step 7: Confirm Next Steps

```
Constitution Created!

Your project principles are now established in:
.vibecode/memory/core/constitution.md

These principles will guide all future decisions. Claude will:
- Reference these when making technical decisions
- Challenge choices that violate principles
- Explain trade-offs in your context

Next Steps:
1. Start your first feature: /vibecode:specify "feature description"
2. Or review PM skills: /vibecode:skills list
3. Or set up boilerplate: /vibecode:boilerplate enable ship-fast
```

## Example Constitution Snippets

### Example 1: Solo Founder MVP Mode

```markdown
## Core Principles

### I. MVP-First Development
We prioritize shipping working prototypes over perfect solutions.
Build for 100 users, not 1 million. Validate before investing in robustness.

### II. Technical Simplicity
Choose boring technology. Optimize for understandability over cleverness.
Future you (or your team) should understand this code.

### III. User Value Over Feature Count
One feature that solves a core job > ten features that partially help.
Apply Figma's simplicity test: What's the ONE thing this must do?

## Work Classification (LNO Framework)

### Leverage Work
- Features that unlock new user value
- Optimizations that 10x a key metric
- Infrastructure that enables future capabilities
Quality bar: Test thoroughly, document well, plan for scale

### Neutral Work
- Bug fixes, maintenance, necessary improvements
Quality bar: Works reliably, good enough

### Overhead Work
- Overly complex processes, premature optimization
Approach: Automate, eliminate, or defer
```

### Example 2: AI-First Product

```markdown
## AI Usage Guidelines

### When to Use AI
- Repetitive tasks (content generation, data extraction)
- Pattern matching (recommendations, categorization)
- Natural language understanding (user queries, chat)

### Model Selection Criteria
**MVP Phase**: Use free/cheap models (OpenRouter, Claude Haiku)
**Validated Features**: Upgrade to premium models (GPT-4, Claude Opus)
**Scale**: Optimize with hybrid approach (cheap for simple, premium for complex)

### Fallback Strategy
Every AI feature MUST have a non-AI fallback:
- Default responses when AI unavailable
- Clear error messaging
- Graceful degradation
```

## Technical Implications Flow

When creating constitution, apply the **ask-context-explain** pattern:

```
You suggest: "We should use Postgres for database"

Claude identifies: Technical implication (database choice)

Claude asks:
- How many users initially? Scale expectations?
- Budget for infrastructure?
- Team experience with databases?
- Read-heavy or write-heavy workload?

You answer: "100 users, <$50/mo, no DB experience, read-heavy"

Claude explains:
Option A: SQLite (RECOMMENDED for MVP)
- Cost: $0
- Complexity: Low (file-based, no server)
- Scale: Works well for <1000 users
- Trade-off: Harder to scale beyond, no concurrent writes
- Migration: Easy to move to Postgres later (2-3 days)

Option B: Postgres
- Cost: ~$10-20/mo
- Complexity: Medium (need hosting, backups)
- Scale: Handles millions of users
- Trade-off: Overhead for <100 users

Recommendation: Start with SQLite, migrate at 500+ users
```

## Notes

- **Constitution is living**: Update as you learn
- **Git version control**: See evolution over time
- **Reference often**: Claude checks this before technical decisions
- **Amendment process**: Documented in constitution itself

## Related Commands

- `/vibecode:specify` - Start first feature (next step)
- `/vibecode:memory` - View memory layer
- `/vibecode:skills` - Configure PM skills
