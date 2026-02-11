---
name: vibecode.tasks
description: Break plan into actionable tasks with clear dependencies and priorities
---

# /vibecode.tasks - Create Task Breakdown

## Purpose

Break technical plan into **ordered, actionable tasks** that can be implemented step-by-step.

## Execution Steps

### Step 0: PREREQUISITE GATE (Must Pass Before Any Work)

Verify ALL prerequisites before creating any tasks. If ANY check fails, STOP immediately.

**Check 1 — State phase**:
Read `.vibecode/session/state.json`. Verify `current.phase` equals `"plan"`.
If FAIL → STOP: `"Cannot create tasks: state.json shows phase='[actual]', expected 'plan'. Run /vibecode:plan first to complete the planning step."`

**Check 2 — plan.md exists**:
Verify `.vibecode/specs/[current-feature]/plan.md` exists and is non-empty.
If FAIL → STOP: `"Cannot create tasks: plan.md not found at .vibecode/specs/[feature]/plan.md. This may mean the plan was written to .claude/plans/ by plan mode instead of the correct vibecoding location. Run /vibecode:plan to create or re-create the plan."`

**Check 3 — spec.md exists**:
Verify `.vibecode/specs/[current-feature]/spec.md` exists and is non-empty.
If FAIL → STOP: `"Cannot create tasks: spec.md not found. Run /vibecode:specify first."`

**If ANY check fails**, display:

```
⛔ TASK CREATION BLOCKED

Missing prerequisite: [which check failed]
Current state: phase=[X], feature=[Y]

Required workflow: specify → plan → tasks
Suggested fix: Run /vibecode:[missing-command]
```

**Do NOT proceed to Step 1 until all three checks pass.**

### Step 1: Read Plan
```bash
Read: .vibecode/specs/[current-feature]/plan.md
Read: .vibecode/specs/[current-feature]/spec.md (for user stories)
```

### Step 2: Create Task Breakdown

**Structure by User Story** (P1 → P2 → P3):

```markdown
# Implementation Tasks: [Feature]

## Phase 1: User Story P1 - [Title]

### Setup Tasks
- [ ] **T001**: [Setup task]
  - Files: [paths]
  - Dependencies: None
  - Estimated: [time]

### Core Implementation
- [ ] **T002**: [Core task]
  - Files: [paths]
  - Dependencies: T001
  - Estimated: [time]
  - [P] - Can run in parallel with T003

### Testing
- [ ] **T010**: [Test task]
  - Dependencies: T002-T009 complete
  - Checkpoint: P1 works independently

## Phase 2: User Story P2 - [Title]
[Same structure]
```

**Key Principles**:
- Each user story = independent phase
- Tasks within phase ordered by dependency
- Mark parallel tasks with [P]
- Include checkpoint after each phase

### Step 3: Identify Reusable Components

Check `.vibecode/components-registry/`:
- If component exists → Note "Reuse [component]"
- If new component → Mark "Create + add to registry"

### Step 4: Save Tasks and Update State

```bash
Write: .vibecode/specs/[current-feature]/tasks.md

Update: .vibecode/session/state.json
- Set current.phase = "tasks"
- Set current.last-command = "tasks"
- Set project.last-active = [current timestamp]
```

Update active feature summary:
```bash
Update: .vibecode/session/active-feature.md
- Set Phase: tasks
- Update Current Status:
  - Done: Spec created, plan defined, tasks broken down
  - In Progress: Task review
  - Next: Implementation (/vibecode:implement)
```

### Step 5: Confirm

```
Tasks Created!

Total tasks: [X]
Phases: [X user stories]
Estimated: [X days]

Ready to implement: /vibecode:implement
```

## Related Commands

- `/vibecode:implement` - Execute tasks (NEXT)
