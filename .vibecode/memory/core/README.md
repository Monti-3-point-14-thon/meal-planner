# Core Memory

This directory contains the foundational documents that guide all project decisions.

## Files

### constitution.md
**Purpose**: Project principles and decision-making framework
**Update frequency**: When principles evolve (major milestones)
**Format**: Living document (edit in place, don't append)
**Created by**: `/vibecode:constitution` command

### tech-stack-rationale.md (created during /vibecode:plan)
**Purpose**: Why we chose our technologies
**Update frequency**: When adding new major technology
**Format**: Living document with clear sections per technology
**Created by**: Auto-generated when first tech stack decisions are made during `/vibecode:plan`

### architecture-decisions.md (created during /vibecode:plan)
**Purpose**: High-level architectural choices (monolith vs microservices, API design, data model philosophy)
**Update frequency**: When making structural changes
**Format**: Living document with decision records
**Created by**: Auto-generated when first architecture decisions are made during `/vibecode:plan`

## How These Files Are Used

**When Starting a New Feature**:
1. Claude reads constitution to understand principles
2. Claude references tech-stack-rationale to maintain consistency (if it exists)
3. Claude checks architecture-decisions for patterns to follow (if it exists)

**When Making Technical Decisions**:
- Constitution defines the "why" (principles)
- Tech stack defines the "what" (tools)
- Architecture defines the "how" (patterns)

**When Context Window Is Full**:
- These files are PRIORITY 3 in loading order (after state.json and active-feature.md)
- They are summarized rather than fully loaded if needed

## Maintenance

- **Edit, don't append**: Keep these files lean and current
- **Archive old versions**: Use git history, don't keep old content in file
- **Review quarterly**: Ensure these still match your current thinking
