# Plan: Template Cleanup + Context Engineering Layer

## Context

Two goals merged into one plan:

1. **Template cleanup**: Remove build artifacts, fix broken references, make the repo clonable and immediately usable
2. **Context engineering (Day 2)**: Build the smart layer that maintains project context across conversations, features, and time -- the thing that makes speckit + PM skills actually work for full-project vibecoding

The plan is broken into 7 chunks. Each chunk is independently testable.

---

## Chunk 1: File Organization

**Goal**: Clean root, preserve history

**Moves** (git mv):
- `VIBECODING_FRAMEWORK.md` -> `docs/VIBECODING_FRAMEWORK.md`
- `FRAMEWORK_SUMMARY.md` -> `docs/FRAMEWORK_SUMMARY.md`
- `QUICK_REFERENCE.md` -> `docs/QUICK_REFERENCE.md`
- `WHY_THIS_MATTERS.md` -> `docs/WHY_THIS_MATTERS.md`
- `.vibecode/DAY1_COMPLETE.md` -> `docs/history/DAY1_COMPLETE.md`
- `.vibecode/SLASH_COMMANDS_COMPLETE.md` -> `docs/history/SLASH_COMMANDS_COMPLETE.md`

**Adds**:
- `.gitkeep` in 6 empty directories: `memory/decisions/active/`, `memory/decisions/archived/`, `memory/design-system/`, `specs/`, `components-registry/`, `skills/`
- `LICENSE` (MIT) at root
- `.claude/settings.local.json` added to root `.gitignore`

**Test**: `git ls-files` shows no build logs in `.vibecode/`, docs/ exists, all 6 empty dirs preserved via .gitkeep

---

## Chunk 2: Template Reset & Reference Fixes

**Goal**: Clean slate for new users

**Reset `state.json`** to:
```json
{
  "project": {
    "name": null,
    "initialized": null,
    "last-active": null,
    "version": "0.1.0"
  },
  "current": {
    "feature": null,
    "phase": "uninitialized",
    "branch": null,
    "last-command": null
  },
  "history": {
    "features-completed": [],
    "total-features": 0,
    "last-milestone": null
  },
  "flags": {
    "has-constitution": false,
    "has-boilerplate": false,
    "pm-skills-configured": false,
    "design-system-initialized": false
  }
}
```

**Fix `.vibecode/memory/core/README.md`**:
- `tech-stack-rationale.md` and `architecture-decisions.md` don't exist
- Reword: these are "created during /vibecode:constitution and /vibecode:plan" not pre-existing

**Fix `.vibecode/memory/trade-offs/README.md`**:
- `ai-implementation.md`, `ux-technical-balance.md`, `storage-and-data.md` don't exist
- Reword: these are "created as patterns accumulate" not pre-existing

**Test**: grep for non-existent files returns zero matches. state.json has all null values.

---

## Chunk 3: CLAUDE.md + Context Loading Order (Core of Day 2)

**Goal**: Make Claude automatically context-aware on every conversation

This is the most important chunk. CLAUDE.md is loaded by Claude Code at the start of every conversation. It's the entry point that makes the entire framework work without requiring the user to run `/vibecode:resume` every time.

**Create `CLAUDE.md`** at project root with:

1. **Project identity**: This project uses the Abe vibecoding framework
2. **Automatic context loading instructions**: On every conversation, Claude should:
   - Read `.vibecode/session/state.json` to understand current phase
   - Read `.vibecode/session/active-feature.md` if it exists (current work)
   - Read `.vibecode/memory/core/constitution.md` if it has been filled in (check `flags.has-constitution`)
3. **Memory-first rule**: Before making any technical decision, check:
   - `memory/decisions/active/` for recent decisions
   - `memory/trade-offs/` for established patterns
   - `memory/core/constitution.md` for principles
4. **State management rule**: After any workflow action, update `state.json` with current phase and timestamp
5. **Decision logging rule**: When a significant technical decision is made, create a file in `memory/decisions/active/`
6. **Workflow reference**: Point to the slash commands and their order: constitution -> specify -> plan -> tasks -> implement
7. **Context loading priority order** (what to read and when):
   - Priority 1: `state.json` (always - quick, tells Claude where we are)
   - Priority 2: `session/active-feature.md` (if exists - current work summary)
   - Priority 3: `memory/core/constitution.md` (if filled in - project principles)
   - Priority 4: Current feature files `specs/[feature]/` (if working on a feature)
   - Priority 5: `memory/decisions/active/` (last 2-3 decisions)
   - Priority 6: Trade-offs, design system, component registry (as needed)

**Test**: Open new Claude Code conversation, ask "What is this project?" -- Claude should reference the vibecoding framework without needing `/vibecode:resume`

---

## Chunk 4: Session Management (Day 2 Core Feature)

**Goal**: Seamless context continuity across conversations

### 4a: Create `session/active-feature.md` mechanism

This file is auto-generated whenever a feature is in progress. It's a compact summary optimized for context window efficiency.

**When generated**: By `/vibecode:specify`, `/vibecode:plan`, `/vibecode:tasks`, `/vibecode:implement` -- any command that updates the current feature state.

**Template structure**:
```markdown
# Active Feature: [feature-name]

**Phase**: [specify|plan|tasks|implement]
**Branch**: [branch-name]
**Last Updated**: [timestamp]

## Current Status
- [What's done]
- [What's in progress]
- [What's next]

## Key Decisions Made
- [Decision 1 with rationale]
- [Decision 2 with rationale]

## Core Spec Summary
[1-2 paragraph summary of what we're building and why]

## Files Modified
- [list of key files touched]
```

**Where documented**: Add instructions to each workflow command (specify, plan, tasks, implement) to update this file when they run.

### 4b: Enhance `/vibecode:resume` command

Update `.claude/commands/vibecode/resume.md` to:
- Handle `phase: "uninitialized"` gracefully (fresh template)
- Generate/update `session/active-feature.md` from current state
- Add handling for multi-feature projects (list completed features)
- Add "context health check" -- verify expected files exist for current phase

### 4c: Add state transitions to all workflow commands

Ensure every workflow command properly updates `state.json`:
- `/vibecode:constitution` -> sets `phase: "constitution"`, `flags.has-constitution: true`
- `/vibecode:specify` -> sets `phase: "specify"`, `current.feature`, `current.branch`
- `/vibecode:plan` -> sets `phase: "plan"`
- `/vibecode:tasks` -> sets `phase: "tasks"`
- `/vibecode:implement` -> sets `phase: "implement"`

Each command should also update `session/active-feature.md` with current status.

**Test**: Run `/vibecode:resume` on clean template, verify it gracefully suggests `/vibecode:constitution`. Verify state transitions are documented in each command.

---

## Chunk 5: Command Fixes

**Goal**: No broken references, consistent naming

### 5a: Fix non-existent command references
- `specify.md` lines ~264, ~306, ~368: Replace `/vibecode.clarify` with inline guidance to review spec completeness before `/vibecode:plan`
- `implement.md` line ~95: Replace `/vibecode.ship` with "commit and deploy" / "mark feature complete"

### 5b: Command naming
Keep current naming in YAML frontmatter (`name: vibecode.resume`) -- this is metadata and doesn't affect the `/` menu discoverability. The directory structure `vibecode/` is what makes commands appear when typing `/vibe`. No changes needed for discoverability.

However, update body-text references within command markdown to be consistent. Currently they mix dot and colon notation. Pick one and use it everywhere within the command files.

### 5c: Fix `.claude/commands/README.md`
- Remove links to `DAY1_COMPLETE.md` and `SLASH_COMMANDS_COMPLETE.md` (moved)
- Link to `../../docs/` and `../../README.md` instead

### 5d: Fix `.vibecode/README.md`
- Update notation to be consistent with command files

**Test**: `grep -r "vibecode\.clarify\|vibecode\.ship\|vibecode\.launch\|vibecode\.init" .claude/ .vibecode/` returns zero. `grep -r "DAY1_COMPLETE\|SLASH_COMMANDS_COMPLETE" .claude/ .vibecode/` returns zero.

---

## Chunk 6: init.sh Full Bootstrap

**Goal**: init.sh can recreate entire `.vibecode/` from scratch

Enhance `.vibecode/scripts/init.sh` to create ALL framework files using `create_if_missing`:

**Files to add to init.sh**:
- `session/state.json` (with project name from directory name, current timestamp)
- `memory/core/constitution.md` (template with placeholders)
- `memory/core/README.md`
- `memory/trade-offs/prototyping-vs-robust.md` (template)
- `memory/trade-offs/README.md`
- `pm-skills-config.json`
- `boilerplate/boilerplate-config.json`
- `.gitkeep` files for empty directories

**Behavior**:
- First run on fresh clone: reports "already exists" for all committed files, only updates timestamp
- Run after deleting state.json: recreates it
- Run after deleting entire .vibecode/: recreates full structure

**Test**: Delete `state.json`, run init.sh, verify recreated. Delete `.vibecode/` entirely, run init.sh, verify full structure recreated.

---

## Chunk 7: README Rewrite + Final Polish

**Goal**: Clean, accurate README for template users

**Rewrite `README.md`**:
- Remove all "Day X" references and roadmap
- Remove `[your-username]` placeholders, use actual repo URL
- Remove "coming soon" / "coming in Day 2" references
- Add proper Getting Started: clone -> init.sh -> /vibecode:constitution -> /vibecode:specify -> ...
- Add compact command reference table (absorbed from QUICK_REFERENCE.md)
- Add link to `docs/` for detailed background
- Update version
- Fix LICENSE reference (now exists)

**Save persistent plan copy**:
- Save this plan to `.vibecode/plans/cleanup-and-context-engineering.md`

**Test**: `grep -r "\[your-username\]\|Day 1\|Day 2\|coming soon\|coming in Day" README.md` returns zero.

---

## Implementation Order

Execute chunks sequentially: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

Chunks 1-2 are quick housekeeping. Chunk 3 (CLAUDE.md) is the highest-impact single change. Chunk 4 (session management) is the most substantive new feature. Chunks 5-7 are polish.

## Final Verification

After all chunks:
1. Fresh clone simulation (all dirs exist, state clean, no stale refs)
2. init.sh idempotency (run twice, no overwrites)
3. Broken reference sweep (zero matches for removed/non-existent files)
4. `/vibecode:resume` on clean template (graceful handling)
5. CLAUDE.md integration (new conversation understands the framework)
6. Slash command discovery (all 10 visible when typing `/vibe`)

## Critical Files

| File | Action | Chunk |
|------|--------|-------|
| `CLAUDE.md` | Create new | 3 |
| `.vibecode/session/state.json` | Reset to clean template | 2 |
| `.vibecode/session/active-feature.md` | Define mechanism (not pre-created) | 4 |
| `.vibecode/scripts/init.sh` | Enhance to full bootstrap | 6 |
| `README.md` | Major rewrite | 7 |
| `.claude/commands/vibecode/resume.md` | Enhance for uninitialized state | 4 |
| `.claude/commands/vibecode/specify.md` | Fix clarify references | 5 |
| `.claude/commands/vibecode/implement.md` | Fix ship reference | 5 |
| `.claude/commands/README.md` | Fix dead links | 5 |
| `.vibecode/memory/core/README.md` | Fix references to missing files | 2 |
| `.vibecode/memory/trade-offs/README.md` | Fix references to missing files | 2 |
| `docs/` | New directory, receives moved files | 1 |
| `docs/history/` | New directory, receives build logs | 1 |

## Status

- [x] Chunk 1: File Organization
- [x] Chunk 2: Template Reset & Reference Fixes
- [x] Chunk 3: CLAUDE.md + Context Loading Order
- [x] Chunk 4: Session Management
- [x] Chunk 5: Command Fixes
- [x] Chunk 6: init.sh Full Bootstrap
- [x] Chunk 7: README Rewrite + Plan Saved
