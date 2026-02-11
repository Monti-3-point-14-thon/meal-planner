# Vibecode Commands

Commands are organized in `vibecode/` subdirectory for proper namespacing.

**Type `/vibecode:` to see all vibecode commands!**

---

## Available Commands

### Core Workflow (6 commands)

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/vibecode:resume` | Resume project context | Starting new session, reopening Claude Code |
| `/vibecode:constitution` | Establish principles | Beginning new project, updating standards |
| `/vibecode:specify` | Create feature spec | Starting new feature |
| `/vibecode:plan` | Technical planning | After spec is complete |
| `/vibecode:tasks` | Task breakdown | After plan is approved |
| `/vibecode:implement` | Execute build | Ready to code |

### Supporting Commands (4 commands)

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/vibecode:skills` | Manage PM skills | Customize PM skill weights |
| `/vibecode:memory` | Query memory layer | Search decisions/patterns |
| `/vibecode:components` | View registry | Find reusable components |
| `/vibecode:boilerplate` | Manage boilerplate | Enable/disable Ship-Fast |

---

## Directory Structure

```
.claude/commands/
├── README.md (this file)
└── vibecode/
    ├── resume.md (/vibecode:resume)
    ├── constitution.md (/vibecode:constitution)
    ├── specify.md (/vibecode:specify)
    ├── plan.md (/vibecode:plan)
    ├── tasks.md (/vibecode:tasks)
    ├── implement.md (/vibecode:implement)
    ├── skills.md (/vibecode:skills)
    ├── memory.md (/vibecode:memory)
    ├── components.md (/vibecode:components)
    └── boilerplate.md (/vibecode:boilerplate)
```

## Namespacing

Commands use **colon notation** (`:`) for namespacing:
- Subdirectory: `vibecode/`
- Command files: `resume.md`, `constitution.md`, etc.
- Display: `/vibecode:resume`, `/vibecode:constitution`, etc.

This follows Claude Code's official plugin namespacing convention.

---

## How Commands Work

1. **Type "/" in Claude Code chat** - Command menu appears
2. **Type `/vibecode:` to filter** - Shows only vibecode commands
3. **Select or type command name** - e.g., `/vibecode:resume`
4. **Claude executes instructions** - From markdown body below YAML frontmatter
5. **Command reads/writes memory** - To `.vibecode/` directory
6. **State persists between sessions** - Memory layer tracks everything

---

## Command Structure

Each command file has:

```yaml
---
name: vibecode:resume
description: Resume where you left off
arguments: [optional]
---

# Command Body

Step-by-step instructions for Claude to execute...
```

**Components**:
- **YAML Frontmatter**: Metadata for Claude Code discovery
- **Markdown Body**: Detailed execution instructions
- **Memory Integration**: Commands read/write to `.vibecode/memory/`
- **PM Skills Activation**: Commands enable relevant skills from config

---

## Example Workflow

```bash
# 1. Start project
/vibecode:constitution
# → Establishes principles, LNO framework

# 2. Start feature
/vibecode:specify "meal plan generator"
# → Creates spec with PM guidance

# 3. Technical planning
/vibecode:plan "use OpenRouter free models"
# → Checks memory, logs decisions

# 4. Task breakdown
/vibecode:tasks
# → Creates ordered tasks

# 5. Implementation
/vibecode:implement
# → Builds phase-by-phase

# 6. Resume later
/vibecode:resume
# → Picks up where you left off
```

---

## Memory Layer Integration

Commands interact with `.vibecode/` directory:

```
.vibecode/
├── session/
│   └── state.json              # Current project state
├── memory/
│   ├── core/
│   │   └── constitution.md     # Project principles
│   ├── decisions/
│   │   └── active/            # Recent decisions
│   └── trade-offs/            # Decision patterns
├── specs/
│   └── [feature]/             # Feature specifications
└── pm-skills-config.json      # PM skills configuration
```

**Commands read memory FIRST** before making decisions to maintain consistency.

---

## Adding New Commands

To create a new command:

1. **Create markdown file** in `vibecode/` subdirectory
2. **Add YAML frontmatter**:
   ```yaml
   ---
   name: vibecode:newcommand
   description: What this command does
   ---
   ```
3. **Write execution instructions** in markdown body
4. **Restart Claude Code** to discover new command

**Note**: File location determines namespace. Files in `vibecode/` directory display as `/vibecode:*` commands.

---

## Troubleshooting

### Commands don't appear in "/" menu?

1. **Check directory**: Verify `.claude/commands/` exists
2. **Check YAML**: Ensure frontmatter is valid
3. **Restart VS Code**: Force Claude Code to rescan
4. **Check Claude Code version**: Ensure skills are supported

### Command fails to execute?

1. **Check file paths**: Ensure `.vibecode/` files exist
2. **Check state.json**: Verify project is initialized
3. **Run init script**: `.vibecode/scripts/init.sh`
4. **Check logs**: Look for execution errors

---

## Documentation

- [Framework Overview](../../README.md)
- [Detailed Documentation](../../docs/)
- [CLAUDE.md Project Instructions](../../CLAUDE.md)
