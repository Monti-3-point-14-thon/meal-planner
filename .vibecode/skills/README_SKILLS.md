# PM Skills Library

**28 Product Management frameworks from world-class PMs, integrated into the vibecoding workflow.**

This directory contains skill files that activate automatically during `/vibecode` commands to provide strategic product guidance.

---

## Overview

**Total Skills**: 28
**Source**: [Awesome-PM-Skills](https://github.com/menkesu/awesome-pm-skills) - Frameworks from Lenny's Podcast
**Activation**: Dynamic, context-aware loading based on keywords and workflow phase
**Token Efficiency**: Progressive disclosure system (60-70% reduction) - loads metadata first, full content only when relevant

---

## Skill Categories

### 🏗️ Builder (11 skills)
Build faster, scope smarter, ship sooner.

| Skill | Weight | Description |
|-------|--------|-------------|
| `zero-to-launch` | **Critical** | MVP scoping, Figma simplicity test, experience mapping |
| `strategic-build` | **Critical** | LNO framework - Leverage vs Neutral vs Overhead work |
| `ship-decisions` | **Critical** | When to ship vs iterate, reversible decisions |
| `ai-product-patterns` | **Critical** | AI product development (model selection, evals, costs) |
| `quality-speed` | **High** | Prototype fast vs build robust spectrum |
| `design-first-dev` | **High** | Design system adherence, component reuse |
| `jtbd-building` | Low | Jobs-to-be-Done framework for feature definition |
| `continuous-discovery` | Low | Weekly customer contact, continuous learning |
| `growth-embedded` | Low | Growth loops, viral mechanics, retention |
| `exp-driven-dev` | Low | A/B testing, experimentation frameworks |
| `ai-startup-building` | Low | AI startup-specific patterns and playbook |

### 🎯 Strategist (4 skills)
Define where to play and how to win.

| Skill | Weight | Description |
|-------|--------|-------------|
| `prioritization-craft` | **High** | RICE scoring, Value vs Effort, stack ranking |
| `decision-frameworks` | **Critical** | Structured decision templates, trade-off analysis |
| `strategy-frameworks` | Low | Product strategy, Playing to Win, beachhead markets |
| `okr-frameworks` | Low | Goal setting, OKRs, quarterly planning |

### 💬 Communicator (4 skills)
Tell better stories, position products, communicate effectively.

| Skill | Weight | Description |
|-------|--------|-------------|
| `strategic-storytelling` | Low | Narrative frameworks for launches and pitches |
| `positioning-craft` | Low | Product positioning, differentiation |
| `exec-comms` | Low | Executive communication, decision docs |
| `confident-speaking` | Low | Public speaking, presentation frameworks |

### 🧭 Navigator (3 skills)
Influence without authority, manage relationships (team contexts).

| Skill | Weight | Description |
|-------|--------|-------------|
| `influence-craft` | Low | Influence without authority, power dynamics |
| `stakeholder-craft` | Low | Stakeholder management, feedback (Radical Candor) |
| `workplace-navigation` | Low | Conflict resolution, difficult conversations |

**Note**: Navigator skills are less relevant for solo founders, more useful when building teams.

### 👥 Leader (3 skills)
Build culture, grow careers, think strategically (organizational contexts).

| Skill | Weight | Description |
|-------|--------|-------------|
| `culture-craft` | Low | Team culture building (relevant when hiring) |
| `career-growth` | Low | PM career advancement (corporate context) |
| `strategic-pm` | Low | Strategic vs tactical thinking, north star vision |

**Note**: Leader skills are less relevant for solo founders, apply when transitioning to team leadership.

### 📊 Measurement (2 skills)
Choose metrics, gather feedback, measure what matters.

| Skill | Weight | Description |
|-------|--------|-------------|
| `metrics-frameworks` | Low | North Star metric, AARRR pirate metrics, KPIs |
| `user-feedback-system` | Low | PMF survey, user interviews, feedback loops |

### 🚀 Launch (1 skill)
Plan launches, announce products, distribute effectively.

| Skill | Weight | Description |
|-------|--------|-------------|
| `launch-execution` | Low | Launch planning, announcement structure, distribution |

---

## How Skills Work

### Automatic Activation

Skills activate automatically based on:

1. **Workflow Phase**: Different skills for specify, plan, tasks, implement
2. **Keywords**: Feature descriptions trigger relevant skills
3. **Weight**: Higher weight = more prominent guidance
4. **Configuration**: Enable/disable in `.vibecode/pm-skills-config.json`

**Example**:
```
/vibecode:specify "AI-powered code review for startups"
  ↓
Auto-activates:
- zero-to-launch (mvp scoping)
- ai-product-patterns (AI development)
- strategic-build (LNO classification)
  ↓
Asks strategic questions to scope feature correctly
```

### Progressive Disclosure

**Problem**: Loading 28 full skill files = ~150KB, context bloat
**Solution**: Load `skills-index.json` (~8KB) first, then only read relevant skill sections

**How it works**:
1. Commands load `skills-index.json` metadata
2. Match keywords/phase to determine relevant skills
3. Use section markers to extract only needed content
4. **Result**: 60-70% token reduction, scales to 28+ skills efficiently

### Section Markers

Each skill file has markers for progressive disclosure:

```markdown
<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
[Content specific to specify command]
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
[Content specific to plan command]
<!-- COMMAND_SECTION_END: plan -->
```

Commands read only the sections they need.

---

## Configuration

### Default Configuration

8 skills enabled by default (solo-founder-MVP mode):

**Critical (5)**:
- `zero-to-launch` - MVP scoping
- `strategic-build` - LNO framework
- `ship-decisions` - When to ship
- `ai-product-patterns` - AI development
- `decision-frameworks` - Structured decisions

**High (3)**:
- `quality-speed` - Prototype vs robust
- `design-first-dev` - Design system
- `prioritization-craft` - Feature prioritization

**Low (20)**: Disabled by default, can be enabled per project needs

### Viewing Configuration

```bash
/vibecode:skills list
```

Shows all 28 skills with weights, enabled status, and descriptions.

### Customizing Skills

Edit `.vibecode/pm-skills-config.json`:

```json
{
  "version": "0.2.0",
  "mode": "solo-founder-MVP",
  "scope_forcing": "aggressive",
  "skills": {
    "zero-to-launch": {
      "enabled": true,
      "weight_override": 10
    },
    "growth-embedded": {
      "enabled": true,
      "weight_override": 8
    }
  }
}
```

**Parameters**:
- `enabled`: true/false - activate skill
- `weight_override`: 1-10 - how prominently skill guides (10 = most)
- `scope_forcing`: aggressive/balanced/gentle - how much to challenge scope

---

## Skill Weights Explained

**Critical (weight 8-10)**: Always active, guides every relevant decision
**High (weight 6-7)**: Frequently consulted, important but not every decision
**Low (weight 3-5)**: Consulted when specifically relevant, can skip if unrelated

**Solo Founder Defaults**:
- Critical: Core skills for shipping fast MVPs
- High: Quality/design guidance without over-engineering
- Low: Advanced PM skills for when needed (growth, measurement, launch)

---

## Adding New Skills

To add a custom skill:

1. **Create skill file**: `.vibecode/skills/[category]/[skill-name].md`
2. **Follow template**:
   ```markdown
   ---
   skill: skill-name
   category: builder|strategist|communicator|navigator|leader|measurement|launch
   weight_default: critical|high|low
   source: Source attribution
   vibecoding_phases: [specify, plan, tasks, implement]
   ---

   # Skill Name

   One-line description

   ## When This Skill Activates
   [Automatic triggers, keywords, contexts]

   ## Core Frameworks
   [2-4 frameworks with examples]

   ## Vibecoding Integration
   <!-- COMMAND_SECTION_START: specify -->
   ### In /vibecode:specify
   [Specify-specific guidance]
   <!-- COMMAND_SECTION_END: specify -->
   ```

3. **Add to skills-index.json**:
   ```json
   "skill-name": {
     "file": ".vibecode/skills/[category]/[skill-name].md",
     "weight_default": "critical|high|low",
     "description": "Brief description",
     "source": "Source",
     "triggers": {
       "keywords": ["keyword1", "keyword2"],
       "phases": ["specify", "plan"]
     },
     "frameworks": ["Framework 1", "Framework 2"],
     "vibecoding_sections": {
       "specify": {"marker": "### In /vibecode:specify", "applies": true}
     }
   }
   ```

4. **Enable in config**: Edit `.vibecode/pm-skills-config.json`

---

## File Structure

```
.vibecode/skills/
├── README_SKILLS.md          # This file
├── skills-index.json         # Metadata index (load first)
├── builder/                  # 11 skills
│   ├── zero-to-launch.md
│   ├── strategic-build.md
│   ├── ship-decisions.md
│   ├── ai-product-patterns.md
│   ├── quality-speed.md
│   ├── design-first-dev.md
│   ├── jtbd-building.md
│   ├── continuous-discovery.md
│   ├── growth-embedded.md
│   ├── exp-driven-dev.md
│   └── ai-startup-building.md
├── strategist/               # 4 skills
│   ├── prioritization-craft.md
│   ├── decision-frameworks.md
│   ├── strategy-frameworks.md
│   └── okr-frameworks.md
├── communicator/             # 4 skills
│   ├── strategic-storytelling.md
│   ├── positioning-craft.md
│   ├── exec-comms.md
│   └── confident-speaking.md
├── navigator/                # 3 skills
│   ├── influence-craft.md
│   ├── stakeholder-craft.md
│   └── workplace-navigation.md
├── leader/                   # 3 skills
│   ├── culture-craft.md
│   ├── career-growth.md
│   └── strategic-pm.md
├── measurement/              # 2 skills
│   ├── metrics-frameworks.md
│   └── user-feedback-system.md
└── launch/                   # 1 skill
    └── launch-execution.md
```

---

## Troubleshooting

### "Skills not activating"
- Check `.vibecode/pm-skills-config.json` has skills enabled
- Verify keywords in feature description match skill triggers
- Confirm you're in correct workflow phase (specify/plan/tasks/implement)

### "Too much guidance"
- Reduce weight_override to 3-5 for active skills
- Change scope_forcing to "gentle"
- Disable some low-priority skills

### "Not enough guidance"
- Increase weight_override to 8-10 for key skills
- Change scope_forcing to "aggressive"
- Enable more skills relevant to your domain

### "Skills feel irrelevant"
- Customize which skills are enabled for your product type
- Solo founders: Keep navigator/leader skills disabled
- Growth-focused: Enable growth-embedded, metrics-frameworks
- AI products: Enable ai-product-patterns, ai-startup-building

---

## Credits

**Skills Source**: [Awesome-PM-Skills](https://github.com/menkesu/awesome-pm-skills) by @menkesu
**Original Frameworks**: Lenny Rachitsky's Podcast (Lenny's Newsletter)
**Contributors**: Product leaders from Airbnb, Stripe, Figma, OpenAI, Google, and more

**Adaptation**: Skills have been adapted for the vibecoding workflow, with examples tailored to solo founders and MVP development contexts.

---

## Learn More

- **[Main README](../../README.md)** - Framework overview
- **[PM Skills Guide](../../docs/guides/PM_SKILLS.md)** - Detailed guide with examples
- **[Commands Reference](../../docs/guides/COMMANDS_REFERENCE.md)** - How skills activate in each command
- **[pm-skills-config.json](../pm-skills-config.json)** - Configuration file

---

**Last Updated**: 2026-02-17
**Version**: 0.2.0 (28 skills, progressive disclosure system)
