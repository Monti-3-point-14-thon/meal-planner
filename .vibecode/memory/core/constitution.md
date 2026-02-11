# Project Constitution

**Version**: 1.0.0
**Created**: 2026-02-07
**Last Updated**: 2026-02-11

## Core Principles

### I. Science-First, Always
All nutritional advice, meal plans, and AI-generated content must be rooted in scientifically proven facts. We never present assumptions, unverified claims, or pop-nutrition as guidance. When evidence is uncertain, we say so explicitly.

### II. User Sovereignty Over Goals
The user owns their goals, preferences, and personal context. The platform and AI own the scientific knowledge. We never assume what the user wants — we ask. We never override their preferences with our opinion of what's "better."

### III. Personalization Is the Product
Generic meal plans are the problem we're solving. Every interaction should deepen our understanding of the user's context (health conditions, training regimen, dietary restrictions, taste preferences) to deliver plans that feel made-for-them, not downloaded-from-a-blog.

### IV. Health Over Culinary Entertainment
Our north star is health outcomes, not recipe novelty. Meals should be nutritionally optimal for the user's goals first. Enjoyment matters (adherence depends on it), but it never compromises the health mission.

### V. Ongoing Support Over One-Shot Output
A single meal plan isn't the product — iterative, adaptive guidance is. We build for relationships over time: check-ins, adjustments, progress tracking. The value compounds with continued use.

## Work Classification (Shreyas Doshi LNO Framework)

### Leverage Work
- **Definition**: Work that makes meal planning deeply personal and non-generic
- **How to identify**: "Does this help us understand the user better or tailor output more precisely?"
- **Examples**: Detailed onboarding/persona capture, AI personalization pipeline, iterative feedback loops, science-backed recommendation engine
- **Our standards**: Test thoroughly, document reasoning, plan for data model evolution. This is where we invest our best effort.

### Neutral Work
- **Definition**: Output and delivery that needs to work reliably but doesn't need to be fancy
- **How to identify**: "Does this need to function, but won't differentiate us?"
- **Examples**: Meal plan PDF export, basic UI layouts, standard CRUD operations, auth flow
- **Our standards**: Clean, functional, actionable. "Good enough" is fine — ship it and move on.

### Overhead Work
- **Definition**: Adjacent features that don't serve the core meal planning mission
- **How to identify**: "Would removing this still leave our core value proposition intact?"
- **Examples**: Social features, gamification, recipe sharing community, integrations with non-essential third-party services
- **Our approach**: Defer, eliminate, or timebox aggressively. Don't build until core is validated.

## Technical Standards

### Architecture Decisions
- **Foundation**: ship-fast boilerplate as quickstart
- **Framework**: Next.js (React) — app router, server components where beneficial
- **AI Gateway**: OpenRouter for multi-model access
- **Research Tool**: Tavily for scientific literature search and fact-checking
- **Approach**: Monolith-first. No microservices until scale demands it.
- **API**: REST by default. GraphQL only if query flexibility becomes a real bottleneck.

### Code Quality
- **Testing**: Write tests for critical paths — AI recommendation logic, nutritional calculations, user data handling. Don't test basic UI rendering.
- **Documentation**: Write code that a junior developer can understand. Add comments where logic isn't self-evident. Document architectural decisions in `.vibecode/memory/decisions/`.
- **Code review**: Self-review checklist: Does it work? Is it safe? Would a junior dev understand this in 6 months?

### Tech Stack Philosophy
- Choose proven, well-documented tools over cutting-edge.
- Minimize dependencies. Every new library is a maintenance cost.
- Prefer Next.js built-in capabilities before reaching for third-party solutions.

## Prototype vs Robust Decision Framework

### Default Approach: Balanced (Prototype-First with Fast Scale Path)
We ship fast, validate with real users, and upgrade what works. Technical debt is acceptable if it's conscious and documented. Build for 100 users, but architect for 10,000.

### When to Prototype (Ship Fast)
- Feature is unvalidated (don't know if users want it)
- Timeline: Need to test hypothesis quickly
- Scale: <100 users
- Budget: Tight
- **Acceptable trade-offs**: Technical debt, manual processes, limited edge case handling
- **Timebox**: 1 week max per prototype feature

### When to Build Robust
- Feature is validated (users proven they want it)
- Core product value (personalization engine, nutritional accuracy)
- Involves health data or nutritional advice (accuracy is non-negotiable)
- Scale indicators: rapid user growth, revenue validated
- **Non-negotiable robustness**: Anything where wrong output could harm health
- **Acceptable trade-offs**: Takes longer, more upfront complexity

### Migration Path
1. Prototype with clear boundaries (feature flags or separate modules)
2. Validate with users (minimum 2 weeks of usage data)
3. Decide: kill, keep as-is, or rebuild robust
4. Document decision in `.vibecode/memory/decisions/active/`

## AI Usage Guidelines

### When to Use AI
- **Core**: Meal plan generation, nutritional reasoning, personalization
- **Support**: Parsing user preferences, adapting plans based on feedback
- **Never**: Making health claims without scientific backing, inferring conditions the user hasn't disclosed

### Model Selection (via OpenRouter)
- **MVP Phase (<100 users)**: Free/cheap models (Claude Haiku, GPT-4o-mini, Gemini Flash)
- **Validated Features**: Upgrade to premium models (Claude Sonnet/Opus, GPT-4) for accuracy-critical nutritional reasoning
- **Cost optimization**: Use cheap models for UI suggestions, premium for health-critical outputs
- **Strategy**: Start all-free, upgrade bottlenecks based on user feedback
- **Nutritional reasoning**: Always use the most capable model available for health-critical decisions

### Tavily Integration
- Use Tavily to validate nutritional claims before presenting to users
- Cross-reference AI-generated meal rationale with scientific sources
- Build a cache of validated nutrition facts to reduce repeated searches
- Flag AI-generated content as "pending verification" if Tavily validation fails

### Fallback Strategy
- Every AI feature MUST have a graceful degradation path
- If OpenRouter is unavailable: show clear messaging, never show partial/wrong results
- If Tavily fails: defer to nutritionist-curated database, flag as "pending verification"
- Nutritional data should have a non-AI fallback (curated database)

## Design Philosophy

### UX Principles
- **Mobile-first, responsive desktop**: Design for phone in hand, ensure it works on desktop
- **Lightweight design system from day one**: Consistent tokens (colors, spacing, typography) before building components
- **Clarity over cleverness**: Health information must be immediately understandable
- **Progressive disclosure**: Don't overwhelm — reveal complexity as the user needs it

### Visual Standards
- Build and document design system in `.vibecode/memory/design-system/`
- Component registry in `.vibecode/components-registry/`
- Prioritize readability for nutritional data (tables, macros, ingredient lists)

### Accessibility
- WCAG AA as baseline target
- Critical for health-related content — users with health conditions may also have accessibility needs
- Semantic HTML, proper contrast ratios, keyboard navigation

## Governance

### Constitution Authority
This constitution supersedes ad-hoc decisions. If a decision contradicts the constitution:
1. Document the conflict
2. Either update constitution (with rationale) OR change the decision
3. Never silently violate principles

### Amendment Process
1. Identify what needs to change and why
2. Document in `.vibecode/memory/decisions/active/`
3. Update constitution with version bump
4. Archive old version

### Review Cadence
- Review after each major feature ships
- Full review after first 10 real users
- Update as project matures (MVP -> scale-up)

---

**This constitution is a living document. As you learn, it should evolve.**
