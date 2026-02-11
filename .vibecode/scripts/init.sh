#!/bin/bash

# Vibecode Initialization Script
# This script initializes a new Vibecode project or updates an existing one
# CRITICAL: This script NEVER overwrites existing files

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root (parent of .vibecode)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VIBECODE_DIR="$PROJECT_ROOT/.vibecode"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"

echo -e "${BLUE}Vibecode Initialization${NC}"
echo "Project: $PROJECT_NAME"
echo "Root: $PROJECT_ROOT"
echo ""

# Check if .vibecode exists
if [ -d "$VIBECODE_DIR" ]; then
    echo -e "${YELLOW}  .vibecode directory already exists${NC}"
    echo "This script will only create missing files, never overwrite existing ones."
    echo ""
fi

# Function to create file if it doesn't exist
create_if_missing() {
    local file_path="$1"
    local content="$2"
    local description="$3"

    if [ -f "$file_path" ]; then
        echo -e "${YELLOW}  Skipped${NC}: $description (already exists)"
    else
        mkdir -p "$(dirname "$file_path")"
        echo "$content" > "$file_path"
        echo -e "${GREEN}  Created${NC}: $description"
    fi
    return 0
}

# Function to create directory if it doesn't exist
create_dir_if_missing() {
    local dir_path="$1"
    local description="$2"

    if [ -d "$dir_path" ]; then
        return 0
    else
        mkdir -p "$dir_path"
        echo -e "${GREEN}  Created directory${NC}: $description"
    fi
    return 0
}

# Create directory structure
echo "Creating directory structure..."
create_dir_if_missing "$VIBECODE_DIR/session" "session"
create_dir_if_missing "$VIBECODE_DIR/memory/core" "memory/core"
create_dir_if_missing "$VIBECODE_DIR/memory/trade-offs" "memory/trade-offs"
create_dir_if_missing "$VIBECODE_DIR/memory/decisions/active" "memory/decisions/active"
create_dir_if_missing "$VIBECODE_DIR/memory/decisions/archived" "memory/decisions/archived"
create_dir_if_missing "$VIBECODE_DIR/memory/design-system" "memory/design-system"
create_dir_if_missing "$VIBECODE_DIR/specs" "specs"
create_dir_if_missing "$VIBECODE_DIR/components-registry" "components-registry"
create_dir_if_missing "$VIBECODE_DIR/boilerplate" "boilerplate"
create_dir_if_missing "$VIBECODE_DIR/scripts" "scripts"
create_dir_if_missing "$VIBECODE_DIR/skills" "skills"

# Create .gitkeep files for empty directories
echo ""
echo "Ensuring empty directories are preserved..."
for dir in "$VIBECODE_DIR/memory/decisions/active" "$VIBECODE_DIR/memory/decisions/archived" "$VIBECODE_DIR/memory/design-system" "$VIBECODE_DIR/specs" "$VIBECODE_DIR/components-registry" "$VIBECODE_DIR/skills"; do
    if [ ! -f "$dir/.gitkeep" ]; then
        touch "$dir/.gitkeep"
    fi
done

# Create configuration files
echo ""
echo "Creating configuration files..."
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

create_if_missing "$VIBECODE_DIR/session/state.json" "{
  \"project\": {
    \"name\": \"$PROJECT_NAME\",
    \"initialized\": \"$TIMESTAMP\",
    \"last-active\": \"$TIMESTAMP\",
    \"version\": \"0.1.0\"
  },
  \"current\": {
    \"feature\": null,
    \"phase\": \"initialization\",
    \"branch\": null,
    \"last-command\": \"init\"
  },
  \"history\": {
    \"features-completed\": [],
    \"total-features\": 0,
    \"last-milestone\": null
  },
  \"flags\": {
    \"has-constitution\": false,
    \"has-boilerplate\": false,
    \"pm-skills-configured\": false,
    \"design-system-initialized\": false
  }
}" "session/state.json"

# Update state.json timestamp if it already exists
STATE_FILE="$VIBECODE_DIR/session/state.json"
if [ -f "$STATE_FILE" ]; then
    perl -i -pe "s/\"last-active\": \"[^\"]*\"/\"last-active\": \"$TIMESTAMP\"/" "$STATE_FILE"
    perl -i -pe "s/\"name\": null/\"name\": \"$PROJECT_NAME\"/" "$STATE_FILE"
    perl -i -pe "s/\"initialized\": null/\"initialized\": \"$TIMESTAMP\"/" "$STATE_FILE"
    echo -e "${GREEN}  Updated${NC}: session timestamp"
fi

# Create constitution template
create_if_missing "$VIBECODE_DIR/memory/core/constitution.md" '# Project Constitution

**Version**: 1.0.0
**Created**: [DATE]
**Last Updated**: [DATE]

## Core Principles

### I. [PRINCIPLE_1_NAME]
[PRINCIPLE_1_DESCRIPTION]

### II. [PRINCIPLE_2_NAME]
[PRINCIPLE_2_DESCRIPTION]

### III. [PRINCIPLE_3_NAME]
[PRINCIPLE_3_DESCRIPTION]

## Work Classification (Shreyas Doshi LNO Framework)

### Leverage Work
- **Definition**: Work that creates outsized impact relative to effort
- **Our standards**: [Define your quality bar for Leverage work]

### Neutral Work
- **Definition**: Keeps the lights on, necessary but not transformative
- **Our standards**: [Define acceptable quality/speed for Neutral work]

### Overhead Work
- **Definition**: Low-value tasks that should be minimized or eliminated
- **Our approach**: [Define how you handle Overhead work]

## Technical Standards

[Define your approach to architecture, code quality, tech stack]

## Prototype vs Robust Decision Framework

### When to Prototype (Ship Fast)
- Feature is unvalidated
- Scale: <100 users
- Budget: Tight

### When to Build Robust
- Feature is validated
- Core product value
- Scale: >100 users or rapid growth expected

---

**This constitution is a living document. Run /vibecode:constitution to fill it in.**' "memory/core/constitution.md"

# Create core README
create_if_missing "$VIBECODE_DIR/memory/core/README.md" '# Core Memory

Foundational documents that guide all project decisions.

- **constitution.md**: Project principles (created by /vibecode:constitution)
- **tech-stack-rationale.md**: Why we chose our technologies (created during /vibecode:plan)
- **architecture-decisions.md**: High-level architectural choices (created during /vibecode:plan)' "memory/core/README.md"

# Create trade-offs template
create_if_missing "$VIBECODE_DIR/memory/trade-offs/prototyping-vs-robust.md" '# Prototyping vs Robust: Decision Patterns

This file accumulates patterns for when to ship fast vs build for scale.

## Patterns

<!-- Patterns will be added here as decisions are made -->

## General Guidelines

### Prototype When:
- Feature is unvalidated
- Timeline is tight
- Scale is <100 users

### Build Robust When:
- Feature is validated
- Core product value
- Scale >100 users or rapid growth expected' "memory/trade-offs/prototyping-vs-robust.md"

# Create trade-offs README
create_if_missing "$VIBECODE_DIR/memory/trade-offs/README.md" '# Trade-offs Library

Your Technical Co-Founder pattern library - accumulated wisdom from decisions.

- **prototyping-vs-robust.md**: Patterns for when to ship fast vs build for scale
- Additional files are created as patterns accumulate during /vibecode:plan and /vibecode:implement' "memory/trade-offs/README.md"

# Create pm-skills-config.json
create_if_missing "$VIBECODE_DIR/pm-skills-config.json" '{
  "version": "0.1.0",
  "mode": "solo-founder-mvp",
  "technical-cofounder-mode": true,
  "scope-forcing": "aggressive",
  "skills": {
    "builder": {
      "zero-to-launch": { "enabled": true, "weight": "critical" },
      "strategic-build": { "enabled": true, "weight": "critical" },
      "ship-decisions": { "enabled": true, "weight": "critical" },
      "ai-product-patterns": { "enabled": true, "weight": "high" },
      "design-first-dev": { "enabled": true, "weight": "medium" },
      "quality-speed": { "enabled": true, "weight": "medium" }
    },
    "strategist": {
      "decision-frameworks": { "enabled": true, "weight": "critical" },
      "prioritization-craft": { "enabled": true, "weight": "high" }
    }
  }
}' "pm-skills-config.json"

# Create boilerplate config
create_if_missing "$VIBECODE_DIR/boilerplate/boilerplate-config.json" '{
  "enabled": false,
  "type": null,
  "version": null,
  "path": null,
  "available-boilerplates": {
    "ship-fast": {
      "description": "Next.js SaaS boilerplate with auth, payments, DB",
      "path": "../ship-fast"
    },
    "custom": {
      "description": "Your own boilerplate",
      "path": null
    },
    "none": {
      "description": "No boilerplate - build from scratch",
      "path": null
    }
  }
}' "boilerplate/boilerplate-config.json"

# Create .gitignore
create_if_missing "$VIBECODE_DIR/.gitignore" '# Session files (may contain sensitive context)
session/resume-context.md
session/active-feature.md

# Temp files
*.tmp
*.temp

# OS files
.DS_Store
Thumbs.db' ".gitignore"

# Create framework README
create_if_missing "$VIBECODE_DIR/README.md" '# Vibecode Framework

This directory contains all framework configuration and memory for your project.

## Quick Start

```bash
/vibecode:resume       # Resume where you left off
/vibecode:specify      # Start new feature
/vibecode:skills list  # Check PM skills
```

## Directory Structure

- **session/**: Current project state and resume context
- **memory/**: Long-term project memory
- **specs/**: Feature specifications
- **components-registry/**: Reusable component catalog
- **boilerplate/**: Optional boilerplate configuration
- **scripts/**: Automation scripts' "README.md"

echo ""
echo -e "${BLUE}Initialization complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: /vibecode:constitution (establish project principles)"
echo "2. Run: /vibecode:specify \"your first feature\""
echo "3. Run: /vibecode:resume (anytime you start a new session)"
echo ""
