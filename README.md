# AI-Powered Personalized Meal Planner

A science-backed, personalized meal planning application that uses AI to generate customized nutrition plans based on your health goals, biometrics, cultural preferences, and dietary restrictions.

## What is Abe?

Abe makes Claude Code work like a **technical co-founder** for non-technical founders:

- **Prevents AI drift** with structured workflow (spec -> plan -> tasks -> code)
- **Guides product decisions** with 28 PM frameworks from world-class PMs
- **Remembers everything** through a memory layer (decisions, patterns, design system)
- **Gets smarter over time** with accumulated technical wisdom
- **Never forgets context** even when you close VS Code

## Getting Started

```bash
# 1. Clone this repository
git clone https://github.com/adrienmuller/abe-technical-cofounder-for-vibecoding.git
cd abe-technical-cofounder-for-vibecoding

# 2. Initialize the framework (sets project name, creates any missing files)
.vibecode/scripts/init.sh

# 3. Open in VS Code with Claude Code extension

# 4. Establish your project principles
/vibecode:constitution

# 5. Start your first feature
/vibecode:specify "your feature description"

# 6. Follow the workflow
/vibecode:plan -> /vibecode:tasks -> /vibecode:implement
```

### Prerequisites

- Claude Code (VS Code extension or CLI)
- Git
- Bash (macOS/Linux)

## Slash Commands

Type `/vibecode:` in Claude Code to see all commands.

### Core Workflow

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/vibecode:resume` | Resume where you left off | Starting a new session |
| `/vibecode:constitution` | Establish project principles | New project, updating standards |
| `/vibecode:specify` | Create feature spec (WHAT and WHY) | Starting a new feature |
| `/vibecode:plan` | Technical plan (HOW to build it) | After spec is complete |
| `/vibecode:tasks` | Break plan into ordered tasks | After plan is approved |
| `/vibecode:implement` | Build it, logging decisions | Ready to code |

### Supporting Commands

| Command | Purpose |
|---------|---------|
| `/vibecode:skills` | Manage PM skill weights |
| `/vibecode:memory` | Query decisions and patterns |
| `/vibecode:components` | View reusable component registry |
| `/vibecode:boilerplate` | Enable/disable boilerplate integration |

## How It Works

### The Memory Layer

Unlike traditional AI coding where every session starts fresh, Abe **remembers**:

- **Decisions**: Why you chose NextAuth over Auth0
- **Trade-offs**: When to prototype vs build robust
- **Patterns**: Your accumulated technical wisdom
- **Design System**: Visual consistency rules
- **Components**: What's already built

Each feature is faster than the last (compounding returns).

### PM Skills

Abe activates relevant PM frameworks based on what you're doing:

- **Building features**: zero-to-launch, strategic-build, ship-decisions
- **Making decisions**: decision-frameworks, prioritization-craft
- **Scope forcing**: "What's the ONE core job?" (aggressive by default)

Configure in [.vibecode/pm-skills-config.json](.vibecode/pm-skills-config.json).

### Context Engineering

CLAUDE.md provides automatic context loading on every conversation:
1. Reads project state to know where you are
2. Loads active feature context if you're mid-feature
3. References constitution and past decisions before making new ones
4. Logs decisions automatically during workflow

## Framework Structure

```
.vibecode/
├── session/              # Current work state
│   └── state.json        # Phase, active feature, flags
├── memory/
│   ├── core/             # Constitution, tech stack, architecture
│   ├── trade-offs/       # Decision patterns
│   ├── decisions/        # Decision log (active + archived)
│   └── design-system/    # Visual consistency
├── specs/                # Feature specifications
├── components-registry/  # Component catalog
├── scripts/              # Automation (init.sh)
└── pm-skills-config.json # Skills toggle and weights
```

## Use Cases

### Perfect For
- **Solo founders** building MVPs without technical team
- **Serial MVP builders** who need speed + consistency
- **Product managers** who want to prototype without engineers
- **Technical founders** who want structure + PM expertise

### Not Ideal For
- Large dev teams with established processes
- One-off 2-day prototypes (framework is overkill)
- Pure exploration/learning projects

## Documentation

Detailed background documentation is in [docs/](docs/):
- [Framework Architecture](docs/VIBECODING_FRAMEWORK.md)
- [Executive Summary](docs/FRAMEWORK_SUMMARY.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
- [Value Proposition](docs/WHY_THIS_MATTERS.md)

## Acknowledgments

This framework builds on and combines:

- [**Spec-Kit**](https://github.com/github/spec-kit) - Spec-driven development methodology
- [**Awesome-PM-Skills**](https://github.com/menkesu/awesome-pm-skills) - PM frameworks from Lenny's Podcast
- [**Ship-Fast**](https://shipfa.st) - Next.js SaaS boilerplate (optional integration)

## License

MIT License - See [LICENSE](LICENSE) for details.
