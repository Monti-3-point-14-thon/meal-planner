---
name: vibecode.onboard
description: Audit existing codebase and populate memory layer with tech stack, architecture, and components
---

# /vibecode.onboard - Onboard Existing Project

## Purpose

Audit an existing codebase and populate the vibecoding memory layer with:
- Tech stack and dependencies
- Architecture patterns
- Component inventory
- Baseline project knowledge

**This command is for existing projects only** - not needed for greenfield projects.

## Execution Steps

### Step 0: Verify Mode

```bash
Read: .vibecode/session/state.json
```

**Check 1 - Existing project flag**:
If `flags.existing-project === false`:
→ STOP: "This command is for existing projects only. Your project is in greenfield mode."

**Check 2 - Onboarding needed or re-onboard request**:
If `flags.onboarding-complete === true` AND `flags.onboarding-needed === false`:
→ ASK: "Onboarding was already completed. Re-onboard codebase? This will refresh memory with current code. (Y/n)"
→ If user says no: STOP with message "Onboarding skipped. Run /vibecode:resume to continue work."

If `flags.onboarding-needed === true` OR user confirms re-onboard:
→ PROCEED to Step 1

### Step 1: Scan Project Structure

**Discover project layout**:
```bash
Glob: **/package.json
Glob: **/requirements.txt
Glob: **/Cargo.toml
Glob: **/go.mod
Glob: **/composer.json
Glob: src/**
Glob: app/**
Glob: components/**
Glob: lib/**
```

**Identify key directories**:
- Source code location (src/, app/, lib/)
- Component structure (components/, ui/, features/)
- Configuration files (tsconfig.json, .env.example, etc.)
- Documentation (README.md, docs/)

### Step 2: Discover Tech Stack

**Parse dependency files to identify**:

**Frontend**:
- Framework: React, Vue, Svelte, Next.js, Remix, etc.
- Styling: Tailwind, CSS-in-JS, SASS, etc.
- State: Redux, Zustand, Context, etc.

**Backend**:
- Runtime: Node.js, Python, Rust, Go, PHP, etc.
- Framework: Express, FastAPI, Axum, Gin, Laravel, etc.
- Database: PostgreSQL, MySQL, MongoDB, SQLite, etc.

**Authentication**:
- Library: NextAuth, Auth0, Supabase Auth, Passport, etc.

**Key Libraries**:
- Top 5-10 most important dependencies

**Hosting/Deployment**:
- Vercel, Railway, AWS, self-hosted (if detectable)

### Step 3: Analyze Architecture

**Routing**:
- File-based (Next.js app/, pages/)
- Explicit (React Router, Vue Router)
- Server-side (Express routes, FastAPI paths)

**API Design**:
- REST endpoints (if detectable)
- GraphQL (check for schema files)
- tRPC (check for routers)

**Data Layer**:
- ORM: Prisma, Drizzle, TypeORM, SQLAlchemy, etc.
- Raw SQL
- Query patterns

**Code Organization**:
- Monolithic vs modular
- Feature folders vs technical folders
- Shared utilities location

### Step 4: Inventory Components

**UI Components**:
```bash
Glob: components/**/*.{tsx,jsx,vue,svelte}
Glob: ui/**/*.{tsx,jsx,vue,svelte}
```

**Identify reusable components**:
- Button, Input, Card, Modal, etc.
- Component library: shadcn, Radix, Chakra, custom, etc.
- Styling patterns (variants, props)

**Feature Modules**:
- Auth components
- Dashboard components
- Domain-specific components

**Count and categorize**:
- Total component count
- Reusable vs page-specific
- Complexity level (simple, medium, complex)

### Step 5: Interactive Clarification

**Ask user for context not detectable from code**:

```
Onboarding Questions:

1. Project Constraints
   - Are there parts of the codebase that are off-limits for changes?
   - Any third-party integrations we should be aware of?
   - Any technical debt areas to avoid or address?

2. Development Status
   - Is this project in active development?
   - Are there recent major changes or refactors?
   - Any known bugs or issues to be aware of?

3. Documentation
   - Is there existing architecture documentation?
   - Are there coding standards or style guides?
   - Any team conventions we should follow?

4. Future Direction
   - Are there planned migrations (e.g., moving to new tech)?
   - Any experimental features in progress?
```

### Step 6: Populate Memory - Tech Stack Rationale

```bash
Write: .vibecode/memory/core/tech-stack-rationale.md
```

**Format**:
```markdown
# Tech Stack Rationale

**Discovered**: [YYYY-MM-DD]
**Onboarding Mode**: Existing Project

## Stack Overview

**Frontend**:
- Framework: [discovered framework]
- Styling: [discovered styling approach]
- State Management: [discovered state approach]

**Backend**:
- Runtime: [runtime]
- Framework: [framework]
- Database: [database]

**Authentication**:
- Library: [auth library]

**Key Dependencies**:
1. [Library 1]: [version] - [purpose]
2. [Library 2]: [version] - [purpose]
...

## Rationale

**Why this stack was chosen** (inferred from user clarifications):
- [Reason 1 from user context]
- [Reason 2 from user context]

**Constraints**:
- [User-provided constraints]

**Technical Debt**:
- [Known issues from user]

## Evolution Path

**Planned Migrations**:
- [User-provided migration plans, if any]

**Improvement Opportunities**:
- [Observed patterns that could be improved, if asked]
```

### Step 7: Populate Memory - Architecture Decisions

```bash
Write: .vibecode/memory/core/architecture-decisions.md
```

**Format**:
```markdown
# Architecture Decisions

**Discovered**: [YYYY-MM-DD]
**Onboarding Mode**: Existing Project

## Routing

**Type**: [File-based / Explicit / Server-side]
**Pattern**: [Description of routing pattern]

## API Design

**Style**: [REST / GraphQL / tRPC / Mixed]
**Endpoints**: [High-level summary]

## Data Layer

**ORM/Query Tool**: [Prisma / Raw SQL / etc.]
**Schema Management**: [Migrations / Manual / etc.]
**Query Patterns**: [Description]

## Code Organization

**Structure**: [Monolithic / Modular / Feature-based]
**Patterns**: [Observed patterns]

## Component Architecture

**Library**: [shadcn / Custom / etc.]
**Pattern**: [Composition / Props / etc.]
**Styling**: [Tailwind / CSS-in-JS / etc.]

## Off-Limits Areas

**Constraints from user**:
- [List areas not to modify]

## Conventions

**Code Standards**:
- [User-provided or observed conventions]
```

### Step 8: Populate Memory - Component Registry

```bash
Write: .vibecode/components-registry/existing-components.md
```

**Format**:
```markdown
# Existing Components

**Cataloged**: [YYYY-MM-DD]
**Total Count**: [X]

## UI Components

### Core Components
- **Button**: [location] - [variants/props]
- **Input**: [location] - [variants/props]
- **Card**: [location] - [variants/props]
...

### Complex Components
- **Modal**: [location] - [purpose]
- **DataTable**: [location] - [purpose]
...

## Feature Components

### Authentication
- [Auth component 1]
- [Auth component 2]

### [Feature Area 1]
- [Component 1]
- [Component 2]

## Reusability Notes

**Highly Reusable**:
- [Components that follow good patterns]

**Needs Refactoring**:
- [Components with issues, if noted]

## Component Library

**Using**: [shadcn / Custom / etc.]
**Location**: [path]
```

### Step 9: Populate Memory - Onboarding Snapshot

```bash
Create: .vibecode/memory/decisions/active/[YYYY-MM-DD]-onboarding-snapshot.md
```

**Format**:
```markdown
# Decision: Onboarding Snapshot

**Date**: [YYYY-MM-DD]
**Context**: Existing project integrated into vibecoding framework

## Project State at Onboarding

**Tech Stack**: [Summary]
**Architecture**: [Summary]
**Component Count**: [X]

## User Clarifications

**Constraints**:
- [User-provided constraints]

**Off-Limits**:
- [Areas not to modify]

**Known Issues**:
- [Technical debt or bugs mentioned]

**Future Plans**:
- [Migrations or changes planned]

## Baseline Established

This snapshot captures the project state when vibecoding was integrated.
All future decisions should respect this baseline unless explicitly changing it.

## Review Date

[3-6 months from now] - Re-onboard to check for major changes
```

### Step 10: Update State

```bash
Update: .vibecode/session/state.json
- Set flags.onboarding-complete = true
- Set flags.onboarding-needed = false
- Set current.phase = "onboarding-complete"
- Set current.last-command = "onboard"
- Set project.last-active = [current timestamp]
```

### Step 11: Confirm Completion

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Onboarding Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Memory Populated:
✓ Tech stack: [frameworks discovered]
✓ Architecture: [patterns discovered]
✓ Components: [count] cataloged
✓ Baseline snapshot: captured

Files Created/Updated:
• .vibecode/memory/core/tech-stack-rationale.md
• .vibecode/memory/core/architecture-decisions.md
• .vibecode/components-registry/existing-components.md
• .vibecode/memory/decisions/active/[date]-onboarding-snapshot.md

Next Steps:
1. Run: /vibecode:constitution (existing project mode)
2. Then: /vibecode:specify "your next feature"

The framework will now respect your existing patterns by default.
```

## Notes

- **Non-destructive**: This command only reads and documents, never modifies code
- **Memory Bootstrap**: Enables Claude to reference existing patterns in future features
- **Re-onboarding**: Safe to run again if major changes occur
- **Incomplete Detection**: If auto-detection misses something, user clarifications fill gaps

## Related Commands

- `/vibecode:constitution` - Establish evolution principles (NEXT)
- `/vibecode:resume` - Resume work after onboarding
