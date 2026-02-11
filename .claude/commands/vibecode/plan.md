---
name: vibecode.plan
description: Create technical implementation plan - define HOW to build it
arguments: [tech_stack_description]
---

# /vibecode.plan - Technical Implementation Plan

## Purpose

Define **HOW** you'll build the feature - tech stack, architecture, data model.

**This is where memory layer shines** - Claude checks past decisions first.

## Arguments

```bash
/vibecode.plan "[tech stack preferences]"

# Examples:
/vibecode.plan "Next.js with MongoDB, use Ship-Fast boilerplate"
/vibecode.plan "Simple vanilla JS, no frameworks, SQLite database"
/vibecode.plan "Use existing tech stack" # Checks memory
```

## Execution Steps

> **⚠️ PLAN MODE CONFLICT WARNING**
> Claude Code's plan mode may activate during this command. If it does, it will:
> 1. Force the plan to be written to `.claude/plans/` instead of `.vibecode/specs/[feature]/plan.md`
> 2. Say "You can now start coding" when the plan is approved
>
> **Both of these are WRONG for the vibecoding workflow.** After plan mode exits:
> - You MUST still write the plan to `.vibecode/specs/[current-feature]/plan.md` (Step 6)
> - You MUST complete Steps 7-10 (decisions, components, state, confirm)
> - You MUST NOT start writing implementation code
> - The next step is `/vibecode:tasks`, NOT implementation
>
> See CLAUDE.md "Workflow Integrity" rules for authority on this.

### Step 1: Check Prerequisites

```bash
Verify: Current feature spec exists
Read: .vibecode/specs/[current-feature]/spec.md
Read: .vibecode/session/state.json (confirm phase = "specify" or later)
```

If no spec: "Run /vibecode.specify first to define what to build"

### Step 2: Load Memory Layer (CRITICAL)

**Check past decisions BEFORE making new ones**:

```bash
Read: .vibecode/memory/core/constitution.md (principles)
Read: .vibecode/memory/core/tech-stack-rationale.md (if exists)
Read: .vibecode/memory/core/architecture-decisions.md (if exists)
Read: .vibecode/memory/decisions/active/*.md (recent decisions)
Read: .vibecode/memory/trade-offs/prototyping-vs-robust.md (patterns)
```

**Check boilerplate**:
```bash
Read: .vibecode/boilerplate/boilerplate-config.json
If enabled: Note which features are already built
```

### Step 3: Activate PM Skills

- `design-first-dev` (craft quality standards)
- `strategic-build` (build vs buy decisions)
- `ai-product-patterns` (if feature involves AI)

### Step 4: Technical Implications Flow

For EACH major technical decision, use the **ask-context-explain** pattern:

```
Claude identifies: [technical implication]

Claude asks for business context:
- How many users initially?
- Budget for infrastructure?
- Timeline (MVP or core feature)?
- Scale expectations?
- Any constraints?

User provides context

Claude presents options with trade-offs:

Option A: [Approach 1]
├─ Time: [days to build]
├─ Cost: [monthly]
├─ Complexity: [simple/medium/complex]
├─ Pros: [list]
├─ Cons: [list]
└─ Migration path: [how to upgrade later]

Option B: [Approach 2]
[same structure]

Recommendation: [Choice] because:
[rationale based on user's context]

Should I log this pattern in trade-offs memory?
```

### Step 5: Check for Inconsistencies

**Before proposing anything, check memory**:

```
If user says "use Postgres" BUT memory shows "we chose SQLite":

⚠️ Inconsistency Detected

I see in previous decisions (memory/decisions/active/001-database-choice.md)
we chose SQLite for [reason].

This new feature suggests Postgres.

Options:
A) Use SQLite (maintain consistency)
B) Switch to Postgres (explain migration impact)
C) Use Postgres only for this feature (explain why separate)

Which approach makes sense?
```

### Step 6: Create Technical Plan

```bash
Write: .vibecode/specs/[current-feature]/plan.md
```

**Plan Structure**:

```markdown
# Technical Implementation Plan: [Feature]

## Overview

**Approach**: [Prototype/Robust - from constitution]
**Timeline**: [estimated days]
**Complexity**: [simple/medium/complex]

## Tech Stack

**Language/Framework**: [choice + rationale]
**Database**: [choice + rationale]
**Authentication**: [if needed]
**AI/ML**: [if needed]
**Hosting**: [deployment approach]

[For each choice, reference memory if decision was made before]

## Architecture

### Data Model

**Entities**:
- [Entity 1]: [attributes, relationships]
- [Entity 2]: [attributes, relationships]

**Database Schema**: [high-level]

### API Design

**Endpoints**:
- `POST /api/[resource]` - [purpose]
- `GET /api/[resource]` - [purpose]

### Component Structure

**UI Components**:
- [Component 1]: [purpose, reusable?]
- [Component 2]: [purpose, reusable?]

[Check components-registry for existing components to reuse]

## Implementation Details

### Phase 1: [User Story P1]
- Task: [what to build]
- Files: [which files to create/modify]
- Dependencies: [what needs to exist first]

### Phase 2: [User Story P2]
[same structure]

## Technical Decisions Log

[Document key decisions made during planning]:

**Decision 1**: [what was decided]
- Context: [user numbers, budget, timeline]
- Options considered: [A, B, C]
- Choice: [X]
- Rationale: [why]
- Migration trigger: [when to upgrade]

[After plan, these get saved to memory/decisions/active/]

## Dependencies

**External**:
- [Library/API]: [version, why needed]

**Internal**:
- [Existing component/service]: [how it's used]

## Risks & Mitigation

- **Risk**: [what could go wrong]
  **Mitigation**: [how to handle]

## Testing Strategy

[Based on constitution's testing standards]

- Unit tests: [what to test]
- Integration tests: [if needed]
- Manual testing: [user flows to verify]
```

### Step 6b: POST-PLAN-MODE RECOVERY (Execute After Plan Approval)

If Claude Code's plan mode was active during this command, the plan was likely written to `.claude/plans/` instead of the vibecoding canonical location. Run this recovery checklist NOW:

**Checklist** (all items mandatory):

1. **Write canonical plan.md**: Check if `.vibecode/specs/[current-feature]/plan.md` exists. If it does NOT exist, write the full plan content there now. Use the plan you just created (whether it's in `.claude/plans/` or in your context).

2. **Verify content**: The plan.md in `.vibecode/specs/` must contain the complete technical plan — not a stub, not a reference to another file.

3. **Do NOT start coding**: Even if plan mode said "start coding" or "you can now implement," the vibecoding workflow requires completing Steps 7-10 below, then running `/vibecode:tasks` before any implementation.

4. **Continue to Step 7**: Proceed immediately to save decisions to memory.

**Self-check before continuing**:
- [ ] `.vibecode/specs/[current-feature]/plan.md` exists with full plan content
- [ ] Zero implementation code has been written
- [ ] About to execute Step 7 (Save Decisions to Memory)

### Step 7: Save Decisions to Memory

For EACH major technical decision:

```bash
Create: .vibecode/memory/decisions/active/[date]-[decision-name].md
```

**Decision Format**:

```markdown
# Decision: [Title]

**Date**: [YYYY-MM-DD]
**Feature**: [feature-name]
**Context**: [business context - users, budget, timeline]

## Options Considered

### Option A: [Name]
- Pros: [list]
- Cons: [list]
- Cost: [time + money]

### Option B: [Name]
[same]

## Decision

**Chosen**: [Option X]

**Rationale**:
[Why this choice based on context]

## Consequences

**Enables**:
- [what this makes possible]

**Prevents**:
- [what this makes harder]

## Migration Path

**Trigger**: [when to upgrade]
**Effort**: [estimated]

## Review Date

[Optional: when to revisit this decision]
```

### Step 8: Update Component Registry

If plan introduces new reusable components:

```bash
Update: .vibecode/components-registry/[ui|feature]-components.md
```

Add components with:
- Purpose
- Props/interface
- Where used
- Reusability notes

### Step 9: Update State

```bash
Update: .vibecode/session/state.json
- Set current.phase = "plan"
- Set current.last-command = "plan"
- Set project.last-active = [current timestamp]
```

Update active feature summary:
```bash
Update: .vibecode/session/active-feature.md
- Set Phase: plan
- Update Current Status:
  - Done: Spec created, technical plan defined
  - In Progress: Plan review
  - Next: Task breakdown (/vibecode:tasks)
- Update Key Decisions Made: [list decisions logged during this command]
```

### Step 10: Confirm Next Steps

```
Technical Plan Created!

Plan: .vibecode/specs/[feature]/plan.md
Decisions logged: [count] decisions in memory/decisions/active/

Plan Summary:
- Approach: [Prototype/Robust]
- Tech stack: [key technologies]
- Estimated timeline: [X days]
- New components: [count]
- Dependencies: [count external libs]

Memory Updated:
- Technical decisions logged
- Component registry updated
- Trade-off patterns applied

Next Steps:
1. Review plan: Ensure it matches your vision
2. Run: /vibecode:tasks to create task breakdown
3. Then: /vibecode:implement to start building
```

## Example: Meal Plan Generator

```
User: /vibecode.plan "Use OpenRouter free models, Ship-Fast boilerplate"

Claude reads memory:
✓ Constitution: MVP-first approach
✓ Boilerplate: Ship-Fast (Next.js, MongoDB, NextAuth)
✓ No previous AI decisions

Technical Implications:

Decision 1: AI Model for Meal Plans
Context needed: Expected users? API budget?
User: "100 users, <$10/mo for AI"

Options:
A) OpenRouter free models (GPT-3.5, Llama)
  - Cost: $0/mo
  - Quality: Good for MVP
  - Speed: 3-5 seconds per plan
  - Limitation: 10-20 req/min

B) OpenAI GPT-4
  - Cost: ~$30/mo for 100 users
  - Quality: Excellent
  - Speed: 5-10 seconds
  - Limitation: Over budget

Recommendation: Option A (free models)
Rationale: MVP validation phase, quality acceptable, $0 cost
Migration trigger: 500+ users OR users complain about quality

Should I log this pattern? YES

Decision 2: User Data Storage
Memory check: Ship-Fast uses MongoDB ✓
Using existing MongoDB (maintain consistency)

Decision 3: Meal Plan Editing
Options: Real-time chat UI vs form-based
User context: MVP, ship fast
Recommendation: Form-based (1 day vs 3 days for chat)

Plan created with:
- Next.js + MongoDB (Ship-Fast)
- OpenRouter free models
- Form-based editing
- 3 decisions logged to memory

Estimated: 5-7 days to implement
```

## Notes

- **Memory first**: Always check past decisions
- **Context matters**: Technical implications need business context
- **Log decisions**: Future you will thank you
- **Reuse components**: Check registry before creating new

## Related Commands

- `/vibecode:tasks` - Break plan into actionable tasks (NEXT)
- `/vibecode:memory` - Query memory layer
- `/vibecode:components` - View component registry
