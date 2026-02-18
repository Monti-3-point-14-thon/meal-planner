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

### Step 3: Load PM Skills Index & Identify Relevant Skills (Progressive Disclosure)

**1. Read skills index (lightweight metadata - ~8KB for all skills):**
```bash
Read: .vibecode/skills/skills-index.json
Load: Complete skill metadata for all available skills
```

**2. Read user configuration:**
```bash
Read: .vibecode/pm-skills-config.json
Extract:
- scope-forcing: [aggressive | balanced | consultative]
- Enabled skills with weights
```

**3. Detect feature context from spec:**
```bash
Read: .vibecode/specs/[current-feature]/spec.md
Scan for trigger keywords from skills-index.json:
- AI keywords: ai, llm, gpt, chatbot, ml, model, prompt, embedding
- Design keywords: ui, design, component, visual, frontend
- Decision keywords: decision, architecture, trade-off
```

**4. Identify relevant skills for planning phase:**
```bash
FOR EACH skill in skills-index.json:
  IF skill.enabled in config = true
  AND skill.weight >= medium
  AND ("plan" in skill.vibecoding_sections)
  AND (skill is base_skill OR spec_keywords match skill.triggers.keywords):
    → Add to loaded_skills_list
```

**Base skills (always considered if enabled):**
- `quality-speed` - Prototype Fast vs Build Robust spectrum
- `design-first-dev` - Design system checks, component reuse
- `decision-frameworks` - Structured decision template
- `strategic-build` - LNO classification

**Conditional skills (load if keywords match):**
- `ai-product-patterns` - If AI keywords in spec

**5. Output loaded skills list:**
```
Skills identified for technical planning:
✓ ai-product-patterns (high, weight: 7) [AI keywords detected in spec]
✓ quality-speed (critical, weight: 10)
✓ design-first-dev (high, weight: 7)
✓ decision-frameworks (critical, weight: 10)
✓ strategic-build (critical, weight: 10)

Note: Skill CONTENT not loaded yet - only metadata.
Full skill content loaded on-demand in Step 4a (progressive disclosure).
Token savings: ~60KB → ~8KB at this stage
```

**Weight interpretation:**
- critical (10): MUST load and apply
- high (7-9): Load and apply frequently
- medium (4-6): Load when relevant
- low (1-3): Skip (don't load)

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

### Step 4a: Apply Loaded PM Skills to Technical Planning (Progressive Disclosure - Read Only Needed Sections)

**FOR EACH skill in loaded_skills_list from Step 3:**

**Progressive disclosure optimization:**
- Get skill file path from skills-index.json
- Read ONLY "## Vibecoding Integration > ### In /vibecode:plan" section
- Skip: Core Frameworks, Examples, Quick Reference (not needed during execution)
- Token savings: ~10KB → ~2-3KB per skill (70-80% reduction)

**Execution pattern:**
```bash
FOR EACH loaded_skill IN [skills loaded in Step 3]:
  # Get metadata from index (already loaded)
  skill_data = skills-index.json[loaded_skill]
  file_path = skill_data.file
  section_marker = skill_data.vibecoding_sections.plan.marker

  # Read ONLY the relevant section (progressive disclosure)
  Read: {file_path}
  Section: Find "## Vibecoding Integration", then find "{section_marker}"
  Extract: Content between "{section_marker}" and next "###" or "##"

  # Execute frameworks from that section only
  Apply: Frameworks listed in extracted content
```

**Typical execution order:**
1. ai-product-patterns (if AI feature) → Model selection, evals, cost modeling, fallback, quality measurement
2. quality-speed (if loaded) → Prototype Fast vs Build Robust spectrum
3. design-first-dev (if loaded) → Design system checks, component reuse
4. decision-frameworks (if loaded) → Structured decision logging template
5. strategic-build (if loaded) → LNO informs architecture quality bar
6. [Any other planning-phase skills loaded]

**Example with progressive disclosure:**

IF ai-product-patterns loaded (AI keywords detected):
- File: `.vibecode/skills/builder/ai-product-patterns.md` (from index)
- Read ONLY: Section starting at "### In /vibecode:plan"
- Stop at: Next "###" or "##" marker
- Apply: All 7 AI frameworks (Model Selection, Evals, Latency, Fallback, Cost, Quality, Prompts)
- Document to: `.vibecode/memory/decisions/active/[date]-ai-[feature].md`
- Token cost: ~3KB (vs ~12KB if reading full file)

IF quality-speed loaded:
- File: `.vibecode/skills/builder/quality-speed.md` (from index)
- Read ONLY: "### In /vibecode:plan" section
- Apply: Context questions, quality-speed spectrum, Dylan Field simplicity forcing
- Document to: `.vibecode/memory/trade-offs/[feature]-quality-speed.md`
- Token cost: ~2.5KB (vs ~9KB full file)

IF design-first-dev loaded:
- File: `.vibecode/skills/builder/design-first-dev.md` (from index)
- Read ONLY: "### In /vibecode:plan" section
- Apply: Design system checks, component registry checks, quality bar questions
- Token cost: ~2KB (vs ~9KB full file)

IF decision-frameworks loaded:
- File: `.vibecode/skills/strategist/decision-frameworks.md` (from index)
- Read ONLY: "### In /vibecode:plan" section
- Apply: Structured decision template for all major technical decisions
- Token cost: ~3KB (vs ~13KB full file)

**Notes:**
- Each skill file's "Vibecoding Integration > In /vibecode:plan" section is authoritative
- Progressive disclosure: Load metadata first (Step 3), content on-demand (Step 4a)
- Skills may reference each other (e.g., quality-speed uses LNO from strategic-build)
- No hardcoded skill logic in commands
- Adding new skills requires NO command changes
- Expected total token savings: 70-80% for skill content (typical: 15K → 5K tokens)

---

### Step 4b: User Response Gate

**If skills raised clarifying questions that require user decisions:**
- List the key questions clearly
- STOP HERE and wait for user responses
- After user responds, integrate their answers into the technical plan
- Then proceed to Step 5

**Examples of questions requiring user input**:
- Quality-speed spectrum: "Where should we be: Prototype Fast or Build Robust?"
- Simplicity forcing: "If we had to cut 50% of this plan, what stays?"
- AI framework decisions: "What's the latency requirement? 200ms, 2s, or 20s?"
- Design system decisions: "Should this follow existing patterns or create new ones?"

**If no critical questions** (or questions were for reflection):
- Proceed directly to Step 5
- Questions can be answered asynchronously during plan review

**Decision criteria**:
- Critical questions = answers affect architecture, tech stack, or implementation approach
- Reflective questions = help user think, don't need immediate answers

---

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
- Add to flags: planning-skills-applied = [EXACT list of ALL skills loaded in Step 3]

  CRITICAL: Include EVERY skill that was loaded (weight >= medium):
  - ai-product-patterns (if loaded - check if AI keywords in spec.md)
  - quality-speed (if loaded)
  - design-first-dev (if loaded)
  - decision-frameworks (if loaded)
  - strategic-build (if loaded)
  - Any other planning-phase skills that were loaded

  Example (AI feature): ["ai-product-patterns", "quality-speed", "design-first-dev", "decision-frameworks", "strategic-build"]
  Example (non-AI feature): ["quality-speed", "design-first-dev", "decision-frameworks", "strategic-build"]
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
- Update PM Skills Applied:
  - Specify Phase: [skills from /vibecode:specify]
  - Plan Phase: [skills loaded and applied in this command]
```

**Example state update:**
```json
{
  "flags": {
    "skills-applied": ["zero-to-launch", "strategic-build"],
    "planning-skills-applied": ["ai-product-patterns", "quality-speed", "decision-frameworks"]
  }
}
```

### Step 10: Confirm Next Steps

```
✅ Technical Plan Created!

Plan: .vibecode/specs/[feature]/plan.md
Decisions logged: [count] decisions in memory/decisions/active/

Plan Summary:
- Approach: [Prototype/Robust]
- Tech stack: [key technologies]
- Estimated timeline: [X days]
- New components: [count]
- Dependencies: [count external libs]

PM Skills Applied:
[List which skills were loaded and applied during planning]
- ✓ ai-product-patterns: [If AI feature - Model selection, evals, cost modeling]
- ✓ quality-speed: [Chose Prototype Fast/Balance/Build Robust for major decisions]
- ✓ design-first-dev: [Referenced design system, identified reusable components]
- ✓ decision-frameworks: [X] structured decisions logged
- ✓ strategic-build: [LNO classification informed architecture quality bar]

Memory Updated:
- Technical decisions logged
- Component registry updated
- Trade-off patterns applied
- AI-specific decisions documented (if applicable)

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
