---
skill: strategy-frameworks
category: strategist
weight_default: low
source: Playing to Win (Lafley/Martin), Crossing the Chasm (Geoffrey Moore)
vibecoding_phases: [constitution, specify]
---

# Product Strategy Frameworks

**One-line description:** Define where to play and how to win using Playing to Win, Crossing the Chasm, and beachhead market selection.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** strategy, market, competitive, positioning, advantage, segment, beachhead, vision, aspiration
- **Workflow phases:** constitution, specify
- **Context signals:** Defining product direction, choosing target markets, competitive positioning

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Playing to Win (5 Strategic Choices)
**Source:** A.G. Lafley & Roger Martin (P&G)
**When to use:** Defining or refining product strategy
**How to apply:**

**Core Principle:**
> "Strategy is about choice. What will we do and what will we NOT do?"

**The 5 Choices:**

**1. What is our winning aspiration?**
- What does winning look like in 3-5 years?
- Make it inspiring but specific

**2. Where will we play?**
- Which market/segment?
- Which customers?
- Which geographies?

**3. How will we win?**
- What's our competitive advantage?
- Why will customers choose us?
- What's our defensible moat?

**4. What capabilities must we have?**
- What must we be world-class at?
- What can we partner for?
- What should we build vs buy?

**5. What management systems are required?**
- How do we measure success?
- How do we stay focused?
- How do we say "no" to distractions?

**Example (Vibecoding Context):**
```markdown
Product: AI-powered code review tool for solo founders

1. Winning Aspiration:
   "Be THE code quality tool for solo founders shipping AI products"

2. Where to Play:
   - Market: Solo founders building AI/SaaS products
   - NOT playing: Enterprise teams, non-technical founders, agencies
   - Geography: Global (English-speaking first)

3. How to Win:
   - Speed: Reviews in <30 seconds (10x faster than manual)
   - Context: Understands startup code patterns (not just style)
   - Price: $29/month (accessible for bootstrappers)

4. Capabilities Needed:
   - AI model fine-tuned on startup codebases
   - Integration with popular stacks (Next.js, Supabase, etc.)
   - Community of solo founders (feedback loop)

5. Management Systems:
   - Metric: Time saved per review
   - Focus: Say no to enterprise features
   - Review: Monthly strategy check-in
```

**Questions to ask:**
- What does winning look like for us?
- Which segment can we dominate?
- What will we explicitly NOT do?
- What's our unfair advantage?

---

### Framework 2: Crossing the Chasm (Beachhead Strategy)
**Source:** Geoffrey Moore
**When to use:** Launching new products or entering new markets
**How to apply:**

**Core Principle:**
> "The number one reason startups fail is premature scaling. Pick ONE beachhead segment and dominate it."

**The Chasm:**
```
Early Adopters → [THE CHASM] → Early Majority
(innovators)                     (pragmatists)
```

**Beachhead Strategy:**

**1. Choose ONE Segment**
- Narrow enough to dominate
- Large enough to matter
- Reachable with your resources

**2. Become THE Whole Solution**
- Not "one of many options"
- The ONLY solution for that segment
- Complete solution for their problem

**3. Build from Strength**
- Dominate beachhead first
- Then expand to adjacent segments
- Use success as proof for next segment

**Example (Vibecoding Context):**
```markdown
Product: Developer productivity tool

❌ TOO BROAD:
"Tool for all developers"
→ Result: Lost in competition, no clear positioning

✅ BEACHHEAD:
"Tool for Next.js solo founders building AI SaaS"
→ Narrow segment: ~50K developers
→ Specific problem: Shipping AI features fast
→ Reachable: Active on Twitter, Reddit r/SaaS, Indie Hackers

Expansion Path:
Phase 1: Next.js + AI (beachhead)
Phase 2: Add React + AI
Phase 3: Add Vue/Svelte + AI
Phase 4: Add non-AI tools

Strategy: Dominate Next.js + AI segment first,
then expand with credibility and proven success.
```

**Questions to ask:**
- What's our beachhead segment? (Narrow enough to dominate?)
- Can we be THE solution for them? (Not just "one option")
- What's the expansion path once we dominate?
- Are we trying to serve too many segments too early?

---

### Framework 3: Strategic Positioning Canvas
**Source:** Adapted from Blue Ocean Strategy
**When to use:** Defining competitive positioning
**How to apply:**

**The Canvas:**
```
Compare yourself vs competitors on key factors:

Factor               | Competitors | Us
---------------------|-------------|----
Price                | High        | Low
Setup Time           | Hours       | Minutes
AI Quality           | Generic     | Specialized
Support              | Tickets     | Community
Learning Curve       | Steep       | Gentle
```

**Strategic Moves:**

**Eliminate:** What factors can we remove that the industry takes for granted?
**Reduce:** What factors can we reduce below industry standard?
**Raise:** What factors can we raise above industry standard?
**Create:** What factors can we create that the industry has never offered?

**Example (Vibecoding Context):**
```markdown
AI Code Review Tool Positioning:

ELIMINATE:
- Enterprise features (SSO, RBAC, compliance)
- Custom deployment options
- Account managers

REDUCE:
- Price ($29 vs $99+ competitors)
- Configuration complexity (zero-config)
- Documentation length (quick start only)

RAISE:
- Review speed (<30s vs 5 min)
- Context awareness (understands startup patterns)
- Integration ease (one-click install)

CREATE:
- Startup code pattern library
- Community-contributed rules
- "Ship faster" metrics dashboard

Result: Positioned as "Fast, focused, founder-friendly"
NOT: "Enterprise-grade, comprehensive, configurable"
```

**Questions to ask:**
- What can we eliminate that competitors assume is necessary?
- What can we do 10x better than anyone?
- What new value can we create?
- How do we position AGAINST the category leader?

---

## Decision Trees

**Primary decision:** What's our strategy?

```
START: Defining strategy
  ↓
Q: What's our winning aspiration? (5 years)
  - Define clearly
      ↓
Q: Where will we play?
  - List all possible segments
  - Narrow to ONE beachhead
      ↓
Q: Can we dominate this beachhead?
  - Yes → How will we win?
  - No → Choose narrower segment
      ↓
Q: What's our unfair advantage?
  - Speed / Quality / Price / Network / Data
  - If none → Build one first
      ↓
Q: What capabilities do we need?
  - Must-have: [build/acquire]
  - Nice-to-have: [defer]
      ↓
Strategy defined → Document & revisit quarterly
```

---

## Skill Interactions

**Works with:**
1. Use `strategy-frameworks` to define where to play
2. Apply `zero-to-launch` to build MVP for beachhead
3. Use `okr-frameworks` to set measurable goals aligned with strategy

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: constitution -->
### In /vibecode:constitution
**Define product strategy:**

When creating constitution, include strategy section:

```markdown
## Product Strategy

### Winning Aspiration (3-5 years)
[What does winning look like?]

### Where We Play
**Target Market:**
- Segment: [specific segment]
- Beachhead: [first segment to dominate]

**NOT Playing:**
- [Segments we avoid and why]

### How We Win
**Competitive Advantage:**
- [What we do 10x better]
- [Our defensible moat]

### Capabilities Required
- [Capability 1]
- [Capability 2]

### Strategic Roadmap
- **Now (0-6 months):** [focus]
- **Next (6-18 months):** [focus]
- **Later (18+ months):** [focus]
```

Document to: `.vibecode/memory/core/constitution.md` (Strategy section)
<!-- COMMAND_SECTION_END: constitution -->

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Connect features to strategy:**

For each feature, answer:
- [ ] Does this serve our beachhead segment?
- [ ] Does this strengthen our competitive advantage?
- [ ] Does this build required capabilities?
- [ ] If no to above → why are we building this?

Include in spec:
```markdown
## Strategic Fit

**Segment:** [Does this serve our beachhead?]
**Advantage:** [Does this strengthen our moat?]
**Capabilities:** [Does this build what we need?]

**If doesn't fit strategy:**
- Reason to build anyway: [justify]
- OR Defer: [explain why not now]
```
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Early-stage products, market entry decisions, annual strategy reviews
**Optional for:** Established products with clear strategy, tactical features, internal tools

