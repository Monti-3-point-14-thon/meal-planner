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

### Step 2: Load Context

```bash
Read: .vibecode/session/state.json
Extract: project context, last active feature
```

### Step 2a: Load PM Skills Index & Identify Relevant Skills (Progressive Disclosure)

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

**3. Detect feature context from user description:**
Scan for trigger keywords from skills-index.json:
- **AI keywords**: ai, llm, gpt, chatbot, ml, model, prompt, embedding, etc.
- **MVP keywords**: mvp, prototype, launch, idea, startup
- **Design keywords**: ui, design, component, visual, frontend

**4. Identify relevant skills for specify phase:**
```bash
FOR EACH skill in skills-index.json:
  IF skill.enabled in config = true
  AND skill.weight >= medium
  AND ("specify" in skill.vibecoding_sections)
  AND (skill is base_skill OR feature_keywords match skill.triggers.keywords):
    → Add to loaded_skills_list
```

**Base skills (always considered if enabled):**
- `zero-to-launch` - MVP scoping
- `strategic-build` - LNO classification

**Conditional skills (load if keywords match):**
- `ai-product-patterns` - If AI keywords detected

**5. Output loaded skills list:**
```
Skills identified for application:
✓ zero-to-launch (critical, weight: 10)
✓ strategic-build (critical, weight: 10)
✓ ai-product-patterns (high, weight: 7) [AI keywords detected]

Note: Skill CONTENT not loaded yet - only metadata.
Full skill content loaded on-demand in Step 4 (progressive disclosure).
Token savings: ~60KB → ~8KB at this stage
```

**Weight interpretation:**
- critical (10): MUST load and apply
- high (7-9): Load and apply frequently
- medium (4-6): Load when relevant
- low (1-3): Skip (don't load)

### Step 2b: Detect Feature Type & Suggest Skills

**Run feature type detection on user's description:**

Scan description for keywords:
- **AI Feature**: ai, llm, gpt, chatbot, ml, model, agent, neural, completion, prompt
- **MVP/Prototype**: mvp, prototype, test, validate, experiment, poc, pilot
- **Analytics**: dashboard, analytics, metrics, reporting, insights, charts
- **Auth**: auth, login, security, oauth, permissions, roles
- **Integration**: integrate, api, third-party, webhook, payment, stripe
- **Growth**: viral, referral, sharing, invite, social, loop

**IF AI keywords detected AND ai-product-patterns disabled OR weight < medium:**
```
Display skill suggestion:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PM Skills Configuration Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature Type Detected: AI Feature
Keywords matched: [list keywords]
Description: "[user input]"

Recommended Skills:
✓ zero-to-launch (enabled, weight: critical)
✓ strategic-build (enabled, weight: critical)
✗ ai-product-patterns (weight: low / disabled)
  → Benefit: AI-specific guidance (model selection, evals, cost modeling)
  → Activates in /vibecode:plan for detailed AI planning

Would you like to:
A) Enable ai-product-patterns for this feature
B) Proceed with current configuration
C) Learn more about AI product patterns

Choice: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IF user chooses A:
  Update .vibecode/pm-skills-config.json
  Set ai-product-patterns: enabled=true, weight=high
  Reload skills for this session

IF user chooses B:
  Continue with current config
  Log: User opted to skip AI skills suggestion

IF user chooses C:
  Display brief overview from ai-product-patterns.md
  Then retry suggestion
```

**IF no strong feature type match:**
- No suggestion displayed
- Use default config (zero-to-launch + strategic-build if enabled)

### Step 3: Apply Scope Forcing (Adaptive Based on Config)

Read scope-forcing setting from config loaded in Step 2a.

**IF scope-forcing = "aggressive":**
```
Behavior: Challenge scope proactively

What's the ONE core job this feature must do?

Your description: "[user's description]"

Let's apply scope forcing:
- "What's the ONE capability you can't ship without?"
- "Can you explain this in one sentence?"
- "If this took more than 1 week, what would you cut?"

[IF zero-to-launch loaded AND weight >= high]:
  Apply Figma simplicity test:
  - "If you could only ship ONE screen, which would it be?"
  - "Can you explain this in one Figma frame?"

[If description seems complex]:
⚠️ This feels like it might take >1 week to build. Let's simplify.

Proposed core job: "[extracted core job]"
Everything else: Nice-to-have (can add later)

Does this core job match your intent?
```

**ELSE IF scope-forcing = "balanced":**
```
Behavior: Suggest scope reduction (gentler)

Your description: "[user's description]"

Let's identify the core user need:
- "What's the main job users are trying to accomplish?"
- "What's the simplest version that delivers value?"
- "How might we scope this to ship in < 2 weeks?"

[Gentle suggestions, not challenges]

Proposed focus: "[core job]"
Additional features: "[phase 2 items]"

Does this feel right?
```

**ELSE IF scope-forcing = "consultative":**
```
Behavior: Document as described, trust user judgment

Your description: "[user's description]"

I'll build what you've described.

[Only intervene if obviously >4 weeks]
IF estimated >4 weeks:
  "This sounds substantial. Would you like suggestions on how to break this into phases?"
```

### Step 4: Apply Loaded PM Skills (Progressive Disclosure - Read Only Needed Sections)

**FOR EACH skill in loaded_skills_list from Step 2a:**

**Progressive disclosure optimization:**
- Get skill file path from skills-index.json
- Read ONLY "## Vibecoding Integration > ### In /vibecode:specify" section
- Skip: Core Frameworks, Examples, Quick Reference (not needed during execution)
- Token savings: ~10KB → ~2KB per skill (80% reduction)

**Execution pattern:**
```bash
FOR EACH loaded_skill IN [skills loaded in Step 2a]:
  # Get metadata from index (already loaded)
  skill_data = skills-index.json[loaded_skill]
  file_path = skill_data.file
  section_marker = skill_data.vibecoding_sections.specify.marker

  # Read ONLY the relevant section (progressive disclosure)
  Read: {file_path}
  Section: Find "## Vibecoding Integration", then find "{section_marker}"
  Extract: Content between "{section_marker}" and next "###" or "##"

  # Execute frameworks from that section only
  Apply: Frameworks listed in extracted content
```

**Typical execution order:**
1. zero-to-launch (if loaded) → MVP scoping, Figma simplicity test, Airbnb experience mapping
2. strategic-build (if loaded) → LNO classification
3. ai-product-patterns (if loaded) → Initial AI scoping questions
4. [Any other builder skills loaded]

**Example with progressive disclosure:**

IF zero-to-launch loaded (weight >= medium):
- File: `.vibecode/skills/builder/zero-to-launch.md` (from index)
- Read ONLY: Section starting at "### In /vibecode:specify"
- Stop at: Next "###" or "##" marker
- Apply: Figma Simplicity Test, Airbnb Experience Mapping, OpenAI First Principles
- Token cost: ~2KB (vs ~10KB if reading full file)

IF strategic-build loaded:
- File: `.vibecode/skills/builder/strategic-build.md` (from index)
- Read ONLY: "### In /vibecode:specify" section
- Apply: LNO Classification framework
- Token cost: ~1.5KB (vs ~8KB full file)

IF ai-product-patterns loaded (AI keywords detected):
- File: `.vibecode/skills/builder/ai-product-patterns.md` (from index)
- Read ONLY: "### In /vibecode:specify" section
- Apply: Initial AI scoping questions
- Token cost: ~2KB (vs ~12KB full file)

**Notes:**
- Each skill file's "Vibecoding Integration > In /vibecode:specify" section is authoritative
- Progressive disclosure: Load metadata first (Step 2a), content on-demand (Step 4)
- No hardcoded skill logic in commands
- Adding new skills requires NO command changes - just create skill file + enable in config
- Expected total token savings: 60-70% for skill content

### Step 4b: User Response Gate

**If skills raised clarifying questions that require user decisions:**
- List the key questions clearly
- STOP HERE and wait for user responses
- After user responds, integrate their answers into the specification
- Then proceed to Step 5

**Examples of questions requiring user input**:
- Scope decisions: "What's the ONE core job this must do?"
- Priority decisions: "If you only had 1 week, what would you build?"
- AI capability decisions: "What's the AI capability? Summarization, generation, classification?"
- Technical constraints: "Real-time or async acceptable?"

**If no critical questions** (or questions were rhetorical/for reflection):
- Proceed directly to Step 5
- Questions can be answered asynchronously during review

**Decision criteria**:
- Critical questions = answers affect spec structure, scope, or approach
- Rhetorical questions = user reflection prompts, don't need immediate answers

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
- Add to flags: skills-applied = [EXACT list of ALL skills loaded in Step 2a]

  CRITICAL: Include EVERY skill that was loaded (weight >= medium):
  - zero-to-launch (if loaded)
  - strategic-build (if loaded)
  - ai-product-patterns (if loaded - check if AI keywords detected)
  - Any other builder skills that were loaded

  Example: ["zero-to-launch", "strategic-build", "ai-product-patterns"]
  Or: ["zero-to-launch", "strategic-build"] (if no AI keywords)
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

## PM Skills Applied
[List skills that were loaded and used during specification]
- zero-to-launch: [If applied - what frameworks: Figma test, Airbnb mapping, etc.]
- strategic-build: [If applied - LNO classification result]
- ai-product-patterns: [If applied - AI context noted]

## Core Spec Summary
[1-2 paragraph summary of what this feature does and why]
```

### Step 9: Review and Confirm

After spec is created:

```
✅ Feature Specification Created!

Spec: .vibecode/specs/[number]-[feature-name]/spec.md

Spec Summary:
- Core job: [one sentence]
- User stories: [count] (prioritized P1 -> P[n])
- Classification: [Leverage/Neutral/Overhead]
- Estimated complexity: [Simple/Medium/Complex]

PM Skills Applied:
[List which skills were loaded and applied]
- ✓ zero-to-launch: [Applied Figma simplicity test, Airbnb experience mapping]
- ✓ strategic-build: [Classified as LEVERAGE/NEUTRAL/OVERHEAD]
- ✓ ai-product-patterns: [If AI feature - noted initial context]

Scope Forcing Mode: [aggressive | balanced | consultative]

Before moving to technical planning, let's review the spec for completeness:
- Are there underspecified areas that need clarification?
- Are acceptance scenarios clear for each user story?
- Are edge cases and error states covered?
- Do you and Claude share the same mental model of the feature?

If the spec looks good:
Run: /vibecode:plan

[If AI feature detected]:
Note: /vibecode:plan will apply detailed AI-specific guidance (model selection, evals, cost modeling)
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
