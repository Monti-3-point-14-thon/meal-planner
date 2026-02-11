---
name: vibecode.specify
description: Create feature specification - define WHAT to build and WHY (technology-agnostic)
arguments: <feature_description>
---

# /vibecode.specify - Create Feature Specification

## Purpose

Define **WHAT** you want to build and **WHY**, without getting into technical implementation.

**This is where PM skills shine** - helping you scope correctly and avoid over-building.

## When to Use

- Starting a new feature
- Beginning a new project (after constitution)
- Adding functionality to existing product

## Arguments

```bash
/vibecode.specify "<feature description>"

# Examples:
/vibecode.specify "User authentication with email and Google OAuth"
/vibecode.specify "Meal plan generator that creates personalized 7-day plans"
/vibecode.specify "Dashboard showing user activity and analytics"
```

## What This Command Does

1. **Activates PM Skills**: `zero-to-launch`, `jtbd-building`, `strategic-build`
2. **Applies scope forcing**: Figma's "What's the ONE core job?"
3. **Creates feature spec** in `.vibecode/specs/[feature-number]-[feature-name]/`
4. **Prioritizes user stories** for independent testing
5. **Defines success criteria** (measurable, technology-agnostic)

## Execution Steps

### Step 1: Parse Feature Description

Extract from user's description:
- Feature name (short, hyphenated)
- Core job to be done
- User persona (who is this for?)

Generate feature number:
```bash
Read: .vibecode/specs/
Count existing specs, increment by 1
Example: If 001-auth exists, new feature is 002-meal-plans
```

### Step 2: Activate PM Skills

**Primary Skills**:
- `zero-to-launch` (MVP scoping, Figma simplicity, Airbnb complete experience)
- `jtbd-building` (Jobs-to-be-Done framework)
- `strategic-build` (LNO - is this Leverage, Neutral, or Overhead work?)

**Read Configuration**:
```bash
Read: .vibecode/pm-skills-config.json
Check: scope-forcing setting (aggressive/balanced/consultative)
```

### Step 3: Apply Figma's Simplicity Test

**Ask aggressively** (if scope-forcing = aggressive):

```
What's the ONE core job this feature must do?

Your description: "[user's description]"

Let's apply Figma's simplicity test:
- If you could only ship ONE capability, what would it be?
- What's the absolute minimum that would be valuable?
- Can we ship a working version in 1 week?

[If description seems complex]:
⚠️ This feels like it might take >1 week to build. Let's simplify.

Proposed core job: "[extracted core job]"
Everything else: Nice-to-have (can add later)

Does this core job match your intent?
```

### Step 4: Map Complete User Experience (Airbnb Approach)

Once core job is clear, map the FULL user journey:

```
Let's map the complete experience for: "[core job]"

User Journey:
1. Entry point: How does user start?
2. Main flow: Step-by-step actions
3. Success state: What does user achieve?
4. Edge cases: What can go wrong?

All States to Design:
- Loading states
- Error states
- Empty states
- Success states

Questions:
- What happens before this feature?
- What happens after success?
- How does this fit into larger product flow?
```

### Step 5: Create Feature Directory and Branch

```bash
# Create feature directory
Create directory: .vibecode/specs/[number]-[feature-name]/

# Create git branch (if git repo)
Run: git checkout -b [number]-[feature-name]

# Or document branch name if can't auto-create
```

### Step 6: Draft Specification

Using template from `.vibecode/templates/spec-template.md` (if exists) or create new:

**Spec Structure**:

```markdown
# Feature Specification: [Feature Name]

**Feature Branch**: `[number-feature-name]`
**Created**: [DATE]
**Status**: Draft

## User Scenarios & Testing (PRIORITIZED)

### User Story 1 - [Brief Title] (Priority: P1)

[Core job - the ONE thing that must work]

**Why this priority**: This is the core value. Without this, feature doesn't work.

**Independent Test**: Can test by [action] and delivers [value]

**Acceptance Scenarios**:
1. **Given** [state], **When** [action], **Then** [outcome]
2. **Given** [state], **When** [action], **Then** [outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Secondary capability that enhances P1]

**Why this priority**: Enhances core value, but P1 can ship alone.

**Independent Test**: [how to test independently]

**Acceptance Scenarios**:
[scenarios]

---

[Continue with P3, P4 stories...]

### Edge Cases

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements

### Functional Requirements

- **FR-001**: System MUST [capability]
- **FR-002**: System MUST [capability]
- **FR-003**: Users MUST be able to [action]

[Flag unclear requirements]:
- **FR-004**: System MUST [NEEDS CLARIFICATION: ...]

### Key Entities

- **[Entity 1]**: [What it represents, key attributes]
- **[Entity 2]**: [Relationships]

## Success Criteria

### Measurable Outcomes

- **SC-001**: [Metric, e.g., "Users complete X in under 2 minutes"]
- **SC-002**: [Metric, e.g., "System handles 1000 concurrent users"]
- **SC-003**: [User satisfaction metric]
```

### Step 7: Apply Strategic Classification

Using LNO framework from constitution:

```bash
Read: .vibecode/memory/core/constitution.md
Extract: LNO classification criteria
```

Ask:
```
Classification Check (Shreyas Doshi LNO Framework):

Is this feature Leverage, Neutral, or Overhead work?

Leverage: Creates outsized impact (10x a metric, unlocks new capabilities)
Neutral: Necessary but not transformative
Overhead: Low-value, should we even build this?

My assessment: This feels like [LEVERAGE/NEUTRAL/OVERHEAD] because:
[reasoning based on constitution criteria]

Does this match your intent?
If Overhead: Should we reconsider building this?
```

### Step 8: Save Specification

```bash
Write: .vibecode/specs/[number]-[feature-name]/spec.md
```

Update state:
```bash
Update: .vibecode/session/state.json
- Set current.feature = "[number]-[feature-name]"
- Set current.phase = "specify"
- Set current.branch = "[number]-[feature-name]"
- Set current.last-command = "specify"
- Set project.last-active = [current timestamp]
- Increment history.total-features
```

Update active feature summary:
```bash
Write: .vibecode/session/active-feature.md
```

```markdown
# Active Feature: [feature-name]

**Phase**: specify
**Branch**: [number]-[feature-name]
**Last Updated**: [current timestamp]

## Current Status
- Done: Feature spec created with [X] user stories
- In Progress: Spec review and refinement
- Next: Technical planning (/vibecode:plan)

## Core Spec Summary
[1-2 paragraph summary of what this feature does and why]
```

### Step 9: Review and Confirm

After spec is created:

```
Feature Specification Created!

Spec: .vibecode/specs/[number]-[feature-name]/spec.md

Spec Summary:
- Core job: [one sentence]
- User stories: [count] (prioritized P1 -> P[n])
- Classification: [Leverage/Neutral/Overhead]
- Estimated complexity: [Simple/Medium/Complex]

Before moving to technical planning, let's review the spec for completeness:
- Are there underspecified areas that need clarification?
- Are acceptance scenarios clear for each user story?
- Are edge cases and error states covered?
- Do you and Claude share the same mental model of the feature?

If the spec looks good:
Run: /vibecode:plan "[tech stack preferences]"
```

## Example: Meal Plan Generator

```
User: /vibecode.specify "Meal plan generator for fitness app"

Claude applies simplicity test:

🎯 Core Job Identified:
"User enters goals + preferences → AI generates 7-day personalized meal plan"

This is the ONE thing that must work. Everything else is nice-to-have.

Questions to map complete experience:
1. What info do we need from user? (goals, dietary restrictions, cuisine prefs)
2. How do they edit/refine the plan? (conversational? form-based?)
3. What happens after generation? (view, print, save, grocery list?)
4. What if AI fails? (fallback? retry? error message?)

LNO Classification:
This is LEVERAGE work - core product value, differentiates from competitors.
Quality bar: Must work reliably, good UX, handle edge cases.

Spec created: .vibecode/specs/001-meal-plan-generator/spec.md

User Stories:
P1: Generate basic meal plan from user input (core value)
P2: Conversational editing of meal plan (enhances core)
P3: Save plans to user account (utility)
P4: Print/export with grocery list (nice-to-have)

Next: Review spec for completeness, then /vibecode:plan
```

## Scope Forcing Examples

### Aggressive Mode (Recommended for MVPs)

```
Your description: "Build a social fitness app with profiles, friend connections,
activity feed, challenges, leaderboards, and meal tracking"

🚨 SCOPE ALERT

This is 6+ features bundled together. Let's focus:

Core Job: What's the ONE thing users need most?
- Option A: See friends' workouts for motivation
- Option B: Track meals and get nutrition insights
- Option C: Compete in challenges

Pick ONE to ship first. Others can be P2, P3 features.

Why? Each of these is 1-2 weeks of work. Building all = 6-12 weeks.
Ship core value in 1-2 weeks, validate, then expand.
```

### Consultative Mode

```
Your description: "Dashboard with 15 different metrics"

This could be simplified, but I'll build what you want.

Suggestion: Consider showing 1 primary metric + "View all" for others.
Reasoning: 15 metrics = analysis paralysis. Figma simplicity test: What's the ONE metric that drives action?

Your call: Proceed with 15 or simplify to 1 primary?
```

## Technical Implications During Specify

**Important**: This phase is technology-AGNOSTIC.

If user mentions technical details:
```
Note: "[User mentioned Postgres/React/etc.]"

Let's focus on WHAT and WHY first, then we'll plan HOW in /vibecode.plan.

For now, let's define user value independent of technology.
Tech stack comes next!
```

## Notes

- **Spec is living**: Can be updated as you learn
- **Prioritization matters**: P1 must be independently shippable
- **Technology-agnostic**: No implementation details here
- **Measurable success**: Clear criteria for "done"

## Related Commands

- `/vibecode:plan` - Create technical plan (next step)
- `/vibecode:constitution` - View project principles
- `/vibecode:memory` - Reference past decisions
