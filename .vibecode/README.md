# Vibecode Framework

This directory contains all framework configuration and memory for your project.

## Quick Start

```bash
# Resume where you left off
/vibecode:resume

# Start new feature
/vibecode:specify "feature description"

# Check PM skills configuration
/vibecode:skills list
```

## Directory Structure

- **session/**: Current project state and resume context
- **memory/**: Long-term project memory (decisions, principles, patterns)
- **specs/**: Feature specifications
- **components-registry/**: Catalog of reusable components
- **skills/**: PM skills library
- **boilerplate/**: Optional boilerplate configuration
- **scripts/**: Automation scripts

## Key Concepts

### Memory Layer
The memory layer is your "technical co-founder" knowledge base. It remembers:
- Project principles (constitution)
- Technical decisions and rationale
- Trade-off patterns (prototype vs robust)
- Design system rules
- Component catalog

### Session Management
The session system tracks current work and enables seamless resume after closing Claude Code.

### PM Skills
Product Management skills from world-class PMs guide strategic decisions.
Configure in `pm-skills-config.json`.

## Learn More

See framework documentation in project root.

