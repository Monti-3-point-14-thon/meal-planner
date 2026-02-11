---
name: vibecode.implement
description: Execute implementation - build the feature according to plan and tasks
---

# /vibecode.implement - Build the Feature

## Purpose

Execute the implementation plan by completing tasks in order.

**This is where memory gets written automatically.**

## Execution Steps

### Step 0: PREREQUISITE GATE (Must Pass Before Any Work)

Verify ALL prerequisites before writing any implementation code. If ANY check fails, STOP immediately.

**Check 1 — State phase**:
Read `.vibecode/session/state.json`. Verify `current.phase` equals `"tasks"`.
If FAIL → STOP: `"Cannot implement: state.json shows phase='[actual]', expected 'tasks'. Run /vibecode:tasks first."`

**Check 2 — tasks.md exists**:
Verify `.vibecode/specs/[current-feature]/tasks.md` exists and is non-empty.
If FAIL → STOP: `"Cannot implement: tasks.md not found. Run /vibecode:tasks first."`

**Check 3 — plan.md exists**:
Verify `.vibecode/specs/[current-feature]/plan.md` exists and is non-empty.
If FAIL → STOP: `"Cannot implement: plan.md not found. Run /vibecode:plan first."`

**Check 4 — spec.md exists**:
Verify `.vibecode/specs/[current-feature]/spec.md` exists and is non-empty.
If FAIL → STOP: `"Cannot implement: spec.md not found. Run /vibecode:specify first."`

**If ANY check fails**, display:

```
⛔ IMPLEMENTATION BLOCKED

Missing prerequisite: [which check failed]
Current state: phase=[X], feature=[Y]

Required workflow: specify → plan → tasks → implement
Suggested fix: Run /vibecode:[missing-command]
```

**Do NOT proceed to Step 1 until all four checks pass.**

### Step 1: Read Tasks
```bash
Read: .vibecode/specs/[current-feature]/tasks.md
Read: .vibecode/specs/[current-feature]/plan.md
Read: .vibecode/memory/core/constitution.md (quality standards)
```

### Step 2: Execute Tasks Phase-by-Phase

**For each phase (user story)**:

1. **Announce phase**:
   ```
   🚀 Starting Phase 1: [User Story Title]
   Tasks: T001-T010
   ```

2. **Execute each task**:
   - Read task dependencies
   - Check if parallel tasks can run together
   - Implement according to plan
   - Follow constitution standards

3. **During implementation**:
   - If decision needed → Use technical implications flow
   - If new pattern emerges → Log to trade-offs memory
   - If component created → Update registry
   - Follow Ship-Fast patterns (if boilerplate enabled)

4. **After each task**:
   - Mark task complete in memory (or state)
   - Briefly confirm completion

5. **Phase checkpoint**:
   - Test that user story works independently
   - Confirm with user before moving to next phase

### Step 3: Auto-Log Decisions

**When making decisions during implementation**:

```bash
If decision = significant:
  Create: .vibecode/memory/decisions/active/[date]-[decision].md
  Update: .vibecode/memory/trade-offs/[category].md (add pattern)
```

### Step 4: Update Component Registry

```bash
After creating new components:
  Update: .vibecode/components-registry/[ui|feature]-components.md
```

### Step 5: Update State

```bash
Update: .vibecode/session/state.json
- Set current.phase = "implement"
- Set current.last-command = "implement"
- Set project.last-active = [current timestamp]
```

Update active feature summary after each phase:
```bash
Update: .vibecode/session/active-feature.md
- Set Phase: implement
- Update Current Status with completed/remaining tasks
- Update Key Decisions Made with any new decisions
- Update Files Modified with created/changed files
```

### Step 6: Completion

When all tasks are done:

```bash
Update: .vibecode/session/state.json
- Add feature to history.features-completed[]
- Set current.feature = null
- Set current.phase = "implement-complete"
- Set current.branch = null

Delete: .vibecode/session/active-feature.md (feature is done)
```

```
Implementation Complete!

Feature: [feature-name]
User stories implemented: P1-P[n]
Components created: [count]
Decisions logged: [count]

Memory Updated:
- Decisions logged
- Components registered
- Trade-off patterns updated

Next Steps:
1. Test the feature end-to-end
2. If works: Commit and deploy
3. If issues: Fix and iterate
4. Start next feature: /vibecode:specify "[next feature]"
```

## Notes

- **Log as you go**: Don't batch decisions
- **Follow patterns**: Check memory first
- **Update registry**: Track new components
- **Test checkpoints**: Each user story independently
- **Update active-feature.md**: After each phase completion

## Related Commands

- `/vibecode:specify` - Start next feature
- `/vibecode:memory` - View logged decisions
