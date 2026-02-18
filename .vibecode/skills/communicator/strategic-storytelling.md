---
skill: strategic-storytelling
category: communicator
weight_default: low
source: Andy Raskin, Nancy Duarte
vibecoding_phases: [specify]
---

# Strategic Storytelling

**One-line description:** Craft compelling product narratives using strategic narrative structure for launches, pitches, and product positioning.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** story, narrative, pitch, launch, announcement, messaging, framing, positioning
- **Workflow phases:** specify
- **Context signals:** Product launches, feature announcements, landing pages

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework: 5-Act Strategic Narrative
**Source:** Andy Raskin
**When to use:** Writing product launches, pitches, landing pages
**How to apply:**

**Structure:**
1. **Old World** - How things used to be
2. **Insight** - What changed (why now?)
3. **New World** - What's now possible
4. **Stakes** - Win big or lose
5. **Your Role** - How you help them win

**Example (Vibecoding Context):**
```markdown
Product Launch: AI Code Review Tool

Act 1 - Old World:
"Solo founders spent hours manually reviewing code,
context-switching between building and quality checking."

Act 2 - Insight:
"But AI changed everything. Claude and GPT-4 can now
understand code context as well as senior engineers."

Act 3 - New World:
"Now, solo founders can ship with confidence,
getting instant code reviews while staying in flow."

Act 4 - Stakes:
"Founders who leverage AI ship 10x faster.
Those who don't fall behind competitors."

Act 5 - Your Role:
"That's where [Product] comes in. We give you
AI-powered code reviews in <30 seconds,
so you can ship fast without breaking things."
```

**Questions to ask:**
- What's the old world pain?
- What insight makes this possible now?
- What new world are we creating?
- What's at stake?

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Frame features as narrative:**

For product launches or major features:
```markdown
## Product Story

**Old World:** [How users struggled before]
**Insight:** [What changed / why now]
**New World:** [What's now possible]
**Stakes:** [Why this matters / urgency]
**Our Role:** [How this feature helps]
```

Use for: Landing pages, Product Hunt launches, announcement blogs
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Product launches, major feature announcements, landing pages
**Optional for:** Internal features, bug fixes, technical work
