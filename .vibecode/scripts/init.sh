#!/bin/bash

# Vibecode Initialization Script
# This script initializes a new Vibecode project or updates an existing one
# CRITICAL: This script NEVER overwrites existing files

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project root (parent of .vibecode)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VIBECODE_DIR="$PROJECT_ROOT/.vibecode"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"

echo -e "${BLUE}Vibecode Initialization${NC}"
echo "Project: $PROJECT_NAME"
echo "Root: $PROJECT_ROOT"
echo ""

# Detect project state: fresh, existing-code, or vibecoding-active
detect_project_state() {
    # Check if vibecoding has been used before
    if [ -f "$VIBECODE_DIR/session/state.json" ]; then
        # Parse state.json to check if initialized
        local phase=$(grep '"phase"' "$VIBECODE_DIR/session/state.json" | cut -d'"' -f4)
        local initialized=$(grep '"initialized"' "$VIBECODE_DIR/session/state.json" | head -1 | grep -v "null")

        if [ -n "$initialized" ] && [ "$phase" != "uninitialized" ]; then
            echo "vibecoding-active"
            return
        fi
    fi

    # Check for existing project indicators
    local has_code=0
    [ -f "$PROJECT_ROOT/package.json" ] && has_code=1
    [ -f "$PROJECT_ROOT/requirements.txt" ] && has_code=1
    [ -f "$PROJECT_ROOT/Cargo.toml" ] && has_code=1
    [ -f "$PROJECT_ROOT/go.mod" ] && has_code=1
    [ -d "$PROJECT_ROOT/src" ] && has_code=1
    [ -d "$PROJECT_ROOT/app" ] && has_code=1

    if [ $has_code -eq 1 ]; then
        echo "existing-code"
    else
        echo "fresh"
    fi
}

PROJECT_STATE=$(detect_project_state)

# Handle different project states
case "$PROJECT_STATE" in
    "vibecoding-active")
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}Vibecoding Already Active${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""

        # Show last active date if available
        if [ -f "$VIBECODE_DIR/session/state.json" ]; then
            LAST_ACTIVE=$(grep '"last-active"' "$VIBECODE_DIR/session/state.json" | cut -d'"' -f4)
            [ -n "$LAST_ACTIVE" ] && [ "$LAST_ACTIVE" != "null" ] && echo "Last active: $LAST_ACTIVE"
        fi

        echo ""
        echo "This project is already using vibecoding."
        echo ""
        echo "Options:"
        echo "  1) Update timestamp only (quick resume)"
        echo "  2) Re-onboard codebase (if major changes since last use)"
        echo "  3) Exit (use /vibecode:resume in Claude Code)"
        echo ""
        read -p "Choice [1-3]: " resume_choice

        case $resume_choice in
            1)
                INTEGRATION_MODE="update-only"
                ;;
            2)
                INTEGRATION_MODE="re-onboard"
                ;;
            3)
                echo ""
                echo "Run /vibecode:resume in Claude Code to continue work."
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Exiting.${NC}"
                exit 1
                ;;
        esac
        ;;

    "existing-code")
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}Existing Project Detected${NC}"
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Found existing code:"
        [ -f "$PROJECT_ROOT/package.json" ] && echo "  • package.json"
        [ -f "$PROJECT_ROOT/requirements.txt" ] && echo "  • requirements.txt"
        [ -f "$PROJECT_ROOT/Cargo.toml" ] && echo "  • Cargo.toml"
        [ -f "$PROJECT_ROOT/go.mod" ] && echo "  • go.mod"
        [ -d "$PROJECT_ROOT/src" ] && echo "  • src/ directory"
        [ -d "$PROJECT_ROOT/app" ] && echo "  • app/ directory"
        echo ""
        echo "Initialize vibecoding framework?"
        echo "  1) Yes (integrate into existing project)"
        echo "  2) No (exit)"
        echo ""
        read -p "Choice [1-2]: " init_choice

        if [ "$init_choice" = "1" ]; then
            INTEGRATION_MODE="first-time-existing"
        else
            echo "Initialization cancelled."
            exit 0
        fi
        ;;

    "fresh")
        echo -e "${BLUE}Fresh Project - Greenfield Mode${NC}"
        INTEGRATION_MODE="greenfield"
        ;;
esac

echo ""

# Handle CLAUDE.md based on integration mode
if [ "$INTEGRATION_MODE" = "first-time-existing" ] && [ -f "$PROJECT_ROOT/CLAUDE.md" ]; then
    echo -e "${YELLOW}CLAUDE.md already exists in your project${NC}"
    echo ""
    echo "How should we handle it?"
    echo "  1) Append vibecoding instructions (recommended)"
    echo "  2) Backup existing and create new"
    echo "  3) Skip (manual merge later)"
    echo ""
    read -p "Choice [1-3]: " claude_choice

    case $claude_choice in
        1)
            cp "$PROJECT_ROOT/CLAUDE.md" "$PROJECT_ROOT/CLAUDE.md.backup"
            echo "" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "---" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "# Vibecoding Framework Integration" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "This project now uses the vibecoding framework for structured development." >> "$PROJECT_ROOT/CLAUDE.md"
            echo "" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "See: .vibecode/ directory for framework files" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "See: CLAUDE.md.backup for your original instructions" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "## Setup Checklist" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "- [ ] Run \`/vibecode:onboard\` to audit codebase" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "- [ ] Run \`/vibecode:constitution\` for evolution principles" >> "$PROJECT_ROOT/CLAUDE.md"
            echo "- [ ] Run \`/vibecode:specify\` to start first feature" >> "$PROJECT_ROOT/CLAUDE.md"
            echo ""
            echo -e "${GREEN}✓ Appended to CLAUDE.md (backup created)${NC}"
            echo ""
            ;;
        2)
            mv "$PROJECT_ROOT/CLAUDE.md" "$PROJECT_ROOT/CLAUDE.md.backup"
            echo -e "${GREEN}✓ Backed up to CLAUDE.md.backup${NC}"
            echo "  You can create a new CLAUDE.md or the framework will work without one."
            echo ""
            ;;
        3)
            echo "Skipped CLAUDE.md handling. You can manually merge later."
            echo ""
            ;;
        *)
            echo -e "${RED}Invalid choice. Skipping CLAUDE.md handling.${NC}"
            echo ""
            ;;
    esac
fi

# Check if .vibecode exists
if [ -d "$VIBECODE_DIR" ]; then
    echo -e "${YELLOW}  .vibecode directory already exists${NC}"
    echo "This script will only create missing files, never overwrite existing ones."
    echo ""
fi

# Function to create file if it doesn't exist
SKIPPED_COUNT=0

create_if_missing() {
    local file_path="$1"
    local content="$2"
    local description="$3"

    if [ -f "$file_path" ]; then
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
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

# Set flags based on integration mode
case "$INTEGRATION_MODE" in
    "first-time-existing"|"re-onboard")
        EXISTING_FLAG="true"
        ONBOARDING_NEEDED="true"
        ONBOARDING_COMPLETE="false"
        ;;
    "vibecoding-active"|"update-only")
        EXISTING_FLAG="true"
        ONBOARDING_NEEDED="false"
        ONBOARDING_COMPLETE="true"
        ;;
    "greenfield")
        EXISTING_FLAG="false"
        ONBOARDING_NEEDED="false"
        ONBOARDING_COMPLETE="false"
        ;;
esac

STATE_FILE="$VIBECODE_DIR/session/state.json"

# Validate flags based on actual file state
validate_flags() {
    # Check if constitution is filled (not just template)
    if [ -f "$VIBECODE_DIR/memory/core/constitution.md" ]; then
        if grep -q "\[PRINCIPLE_1_NAME\]" "$VIBECODE_DIR/memory/core/constitution.md" 2>/dev/null; then
            HAS_CONSTITUTION="false"  # Still template
        else
            HAS_CONSTITUTION="true"   # Filled in
        fi
    else
        HAS_CONSTITUTION="false"
    fi

    # Check if boilerplate is configured
    if [ -f "$VIBECODE_DIR/boilerplate/boilerplate-config.json" ]; then
        if grep -q '"enabled": true' "$VIBECODE_DIR/boilerplate/boilerplate-config.json" 2>/dev/null; then
            HAS_BOILERPLATE="true"
        else
            HAS_BOILERPLATE="false"
        fi
    else
        HAS_BOILERPLATE="false"
    fi

    # Check if PM skills are configured (non-default)
    if [ -f "$VIBECODE_DIR/pm-skills-config.json" ]; then
        # Check if any skill has been modified from defaults
        if grep -q '"weight": "custom"' "$VIBECODE_DIR/pm-skills-config.json" 2>/dev/null; then
            PM_SKILLS_CONFIGURED="true"
        else
            PM_SKILLS_CONFIGURED="false"
        fi
    else
        PM_SKILLS_CONFIGURED="false"
    fi

    # Check if design system is initialized
    if [ -d "$VIBECODE_DIR/memory/design-system" ]; then
        # Check if any design system files exist with content (not just .gitkeep)
        local design_files=$(find "$VIBECODE_DIR/memory/design-system" -type f ! -name ".gitkeep" 2>/dev/null | wc -l)
        if [ "$design_files" -gt 0 ]; then
            DESIGN_SYSTEM_INITIALIZED="true"
        else
            DESIGN_SYSTEM_INITIALIZED="false"
        fi
    else
        DESIGN_SYSTEM_INITIALIZED="false"
    fi
}

# Only create state.json if it doesn't exist OR if re-onboarding OR first-time existing
if [ ! -f "$STATE_FILE" ] || [ "$INTEGRATION_MODE" = "re-onboard" ] || [ "$INTEGRATION_MODE" = "first-time-existing" ]; then
    # Validate flags based on actual files
    validate_flags

    # Create with validated flags
    cat > "$STATE_FILE" << EOF
{
  "project": {
    "name": "$PROJECT_NAME",
    "initialized": "$TIMESTAMP",
    "last-active": "$TIMESTAMP",
    "version": "0.1.0"
  },
  "current": {
    "feature": null,
    "phase": "initialization",
    "branch": null,
    "last-command": "init"
  },
  "history": {
    "features-completed": [],
    "total-features": 0,
    "last-milestone": null
  },
  "flags": {
    "has-constitution": ${HAS_CONSTITUTION},
    "has-boilerplate": ${HAS_BOILERPLATE},
    "pm-skills-configured": ${PM_SKILLS_CONFIGURED},
    "design-system-initialized": ${DESIGN_SYSTEM_INITIALIZED},
    "existing-project": ${EXISTING_FLAG},
    "onboarding-complete": ${ONBOARDING_COMPLETE},
    "onboarding-needed": ${ONBOARDING_NEEDED}
  }
}
EOF
    echo -e "${GREEN}  Created${NC}: session/state.json"
else
    # Just update timestamp (vibecoding-active + update-only mode)
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

# Show summary of skipped files
if [ $SKIPPED_COUNT -gt 0 ]; then
    echo -e "${YELLOW}  Skipped${NC} $SKIPPED_COUNT existing files (framework already initialized)"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Initialization Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Provide context-specific next steps based on integration mode
case "$INTEGRATION_MODE" in
    "greenfield")
        echo "Next steps (Greenfield Project):"
        echo "  1. Run: /vibecode:constitution (establish project principles)"
        echo "  2. Run: /vibecode:specify \"your first feature\""
        echo "  3. Run: /vibecode:resume (anytime you start a new session)"
        ;;

    "first-time-existing")
        echo "Next steps (Existing Project Integration):"
        echo "  1. Run: /vibecode:onboard (audit your codebase)"
        echo "  2. Run: /vibecode:constitution (evolution principles)"
        echo "  3. Run: /vibecode:specify \"your next feature\""
        echo ""
        echo "See: docs/EXISTING_PROJECTS.md for detailed integration guide"
        ;;

    "re-onboard")
        echo "Re-onboarding mode active:"
        echo "  1. Run: /vibecode:onboard (refresh codebase knowledge)"
        echo "  2. Run: /vibecode:resume (continue work)"
        ;;

    "update-only")
        echo "Timestamp updated! Ready to resume work:"
        echo "  Run: /vibecode:resume (pick up where you left off)"
        ;;
esac

echo ""
