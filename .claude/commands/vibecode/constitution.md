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
- Proceed to Step 2

### Step 2: Activate PM Skills

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
