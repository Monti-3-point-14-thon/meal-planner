---
name: vibecode.resume
description: Resume where you left off - loads project context and current state
---

# /vibecode.resume - Resume Project Context

## Purpose

This command helps you pick up exactly where you left off when reopening Claude Code.

**Use this when**:
- You're starting a new Claude Code session
- You've closed VS Code and come back later
- You need to refresh context after a long conversation

## What This Command Does

1. **Reads current project state** from `.vibecode/session/state.json`
2. **Loads active feature** (if you were working on something)
3. **Runs context health check** (verifies expected files exist)
4. **Summarizes recent decisions** from memory layer
5. **Shows what's next** based on current phase

## Execution Steps

### Step 1: Read Project State

```bash
Read: .vibecode/session/state.json
```

Extract:
- Current feature (if any)
- Current phase (uninitialized, constitution, specify, plan, tasks, implement)
- Last command executed
- Project flags (what's been configured)

### Step 2: Context Health Check

Verify expected files exist for the current phase:

#### Artifact-State Consistency Check (Run FIRST, for ALL phases)

Before doing phase-specific checks, cross-validate that `state.json` claims match actual files on disk. This catches cases where a previous command was interrupted or hijacked by plan mode.

If `current.feature` is set, check these paths:
```
spec_path  = .vibecode/specs/[current.feature]/spec.md
plan_path  = .vibecode/specs/[current.feature]/plan.md
tasks_path = .vibecode/specs/[current.feature]/tasks.md
```

- If `phase == "plan"` AND `plan_path` DOES NOT EXIST:
  → FLAG: `"⚠️ INCONSISTENCY: state.json says phase='plan' but plan.md does not exist. The plan may have been written to .claude/plans/ by Claude Code plan mode instead of the vibecoding canonical location. Recovery: Run /vibecode:plan to create the plan in the correct location."`

- If `phase == "tasks"` AND `tasks_path` DOES NOT EXIST:
  → FLAG: `"⚠️ INCONSISTENCY: state.json says phase='tasks' but tasks.md does not exist. Recovery: Run /vibecode:tasks to create the task breakdown."`

- If `phase == "tasks"` AND `plan_path` DOES NOT EXIST:
  → FLAG: `"⚠️ INCONSISTENCY: state.json says phase='tasks' but plan.md does not exist. A previous step may have been skipped or corrupted. Recovery: Run /vibecode:plan first, then /vibecode:tasks."`

- If `phase == "implement"` AND any of (`spec_path`, `plan_path`, `tasks_path`) DOES NOT EXIST:
  → FLAG: `"⚠️ INCONSISTENCY: state.json says phase='implement' but required artifacts are missing: [list missing files]. Recovery: Run the earliest missing command in the cycle: specify → plan → tasks → implement."`

- If `.claude/plans/` directory contains any files:
  → FLAG: `"ℹ️ NOTICE: Found plan mode artifacts in .claude/plans/. If the vibecoding plan.md is missing, these files may contain plan content that was diverted by Claude Code plan mode. The canonical plan location is .vibecode/specs/[feature]/plan.md."`

**If ANY inconsistencies are flagged**, present them prominently at the TOP of the resume output:

```
⚠️ WORKFLOW INTEGRITY ISSUES DETECTED
[List all flagged inconsistencies with their recovery steps]

Resolve these issues before continuing work.
```

Then proceed with the normal phase-specific checks below.

**If phase = "uninitialized"**:
- Project is brand new (template just cloned)
- Check: Does `.vibecode/memory/core/constitution.md` have placeholder brackets? (template not yet filled in)
- Suggest: Run `/vibecode:constitution` to establish project principles
- Also suggest: Run `.vibecode/scripts/init.sh` if state.json has null values for name/initialized

**If phase = "constitution"**:
- Constitution in progress or just completed
- Read: `.vibecode/memory/core/constitution.md`
- Check: Does it still have `[PRINCIPLE_1_NAME]` placeholders? If yes, constitution is incomplete.
- If `flags.has-constitution` = true: Suggest `/vibecode:specify` to start first feature
- If `flags.has-constitution` = false: Suggest completing the constitution

**If phase = "specify"**:
- Feature spec in progress
- Read: `.vibecode/specs/[current-feature]/spec.md`
- Verify file exists. If missing, flag: "Spec file expected but not found"
- Suggest: Complete spec, then `/vibecode:plan`

**If phase = "plan"**:
- Technical plan in progress
- Read: `.vibecode/specs/[current-feature]/plan.md`
- Check: `.vibecode/memory/decisions/active/` for recent decisions
- Verify plan file exists. If missing, flag: "Plan file expected but not found"
- Suggest: Complete plan, then `/vibecode:tasks`

**If phase = "tasks"**:
- Task breakdown in progress
- Read: `.vibecode/specs/[current-feature]/tasks.md`
- Verify tasks file exists. If missing, flag: "Tasks file expected but not found"
- Suggest: Review tasks, then `/vibecode:implement`

**If phase = "implement"**:
- Implementation in progress
- Read: `.vibecode/specs/[current-feature]/tasks.md`
- Check: Which tasks are completed vs remaining
- Suggest: Continue implementing or mark feature complete

### Step 3: Load Memory Context (Priority Order)

1. **Active Feature Summary** (if exists):
   - `.vibecode/session/active-feature.md`

2. **Active Feature Files** (if working on something):
   - `.vibecode/specs/[current-feature]/spec.md`
   - `.vibecode/specs/[current-feature]/plan.md`
   - `.vibecode/specs/[current-feature]/tasks.md`

3. **Project Foundation**:
   - `.vibecode/memory/core/constitution.md` (if has-constitution = true)
   - `.vibecode/memory/core/tech-stack-rationale.md` (if exists)

4. **Recent Decisions**:
   - `.vibecode/memory/decisions/active/` (last 2-3 decisions by date)

5. **Trade-off Patterns**:
   - `.vibecode/memory/trade-offs/prototyping-vs-robust.md` (if has patterns)

### Step 4: Check Completed Features

```bash
Read: .vibecode/session/state.json -> history.features-completed
```

If features have been completed, list them:
```
Completed Features:
- [feature-1]: [brief description]
- [feature-2]: [brief description]
```

This gives context on what's already been built and what decisions have accumulated.

### Step 5: Generate/Update Active Feature Summary

If there is an active feature, generate or update `.vibecode/session/active-feature.md`:

```markdown
# Active Feature: [feature-name]

**Phase**: [current phase]
**Branch**: [branch-name]
**Last Updated**: [now]

## Current Status
- [What's done based on phase]
- [What's in progress]
- [What's next]

## Key Decisions Made
- [List decisions from memory/decisions/active/ related to this feature]

## Core Spec Summary
[1-2 paragraph summary extracted from spec.md]

## Files Modified
- [List key files from spec/plan if available]
```

### Step 6: Generate Context Summary

Provide a summary like this:

```markdown
## Project Context

**Project**: [name from state.json, or "Not yet initialized" if null]
**Last Active**: [timestamp, or "New project" if null]
**Current Phase**: [phase]

## Where You Left Off

[If active feature]:
**Feature**: [feature name]
**Status**: [what's done, what's next]

[If no active feature but project initialized]:
**Status**: Project initialized, ready to start a feature

[If uninitialized]:
**Status**: Fresh template -- needs initialization

## Recent Memory

**Decisions Made**:
- [List 2-3 most recent decisions from active/]

**Key Principles** (from constitution):
- [List 2-3 core principles, or "Constitution not yet created" if unfilled]

## Next Steps

[Based on phase, suggest next command]
```

### Step 7: Update State

Update `.vibecode/session/state.json`:
- Set `last-active` to current timestamp
- Set `last-command` to "resume"

## Example Output: Fresh Template

```
Project Context

Project: Not yet initialized
Current Phase: uninitialized

Where You Left Off

Status: Fresh template -- needs initialization

Next Steps

1. Run: .vibecode/scripts/init.sh (sets project name and timestamp)
2. Run: /vibecode:constitution to establish project principles
3. Then: /vibecode:specify "your first feature" to start building
```

## Example Output: Mid-Feature

```
Project Context

Project: fitness-ai-coach
Last Active: 2 days ago (2026-01-30)
Current Phase: plan

Where You Left Off

Feature: 001-meal-plan-generator
Status: Technical plan 80% complete
  Done: Spec defined, user stories prioritized
  In Progress: Technical plan
  Next: Tasks, then implementation

Recent Memory

Decisions Made:
1. Using OpenRouter with free models for MVP testing (2026-01-30)
2. Hybrid auth: anonymous + saved accounts (2026-01-30)

Key Principles:
- MVP-First: Ship fast, validate, then build robust
- AI-First: Use AI where it 10x's the experience

Next Steps

1. Complete technical plan for meal-plan-generator
2. Run: /vibecode:tasks to create task breakdown
3. Then: /vibecode:implement to start building
```

## Notes

- **Context Window Optimization**: Only load most relevant files based on current phase
- **Archived Decisions**: Not loaded unless specifically referenced
- **Session Continuity**: This enables seamless work across days/weeks
- **Health Check**: Flags missing files early so you can fix issues before they compound

## Related Commands

- `/vibecode:memory` - Query specific memory
- `/vibecode:constitution` - View/edit principles
- Next command depends on phase (see suggestions above)
