# Decision: AI Model for Meal Plan Generation

**Date**: 2026-02-11
**Feature**: 001-meal-plan-generator
**Context**: MVP validation with 2 users (developer + nutritionist wife), minimal budget, speed not critical

---

## Options Considered

### Option A: Claude Haiku (via OpenRouter)
**Pros**:
- Fast generation (5-15 seconds)
- Good at following instructions
- Reliable dietary restriction adherence

**Cons**:
- Cost: ~$0.002 per meal plan
- Less creative with cuisine variety
- Shorter reasoning explanations

**Cost**: ~$0.25 per 1M input tokens, ~$1.25 per 1M output

---

### Option B: GPT-4o-mini (via OpenRouter)
**Pros**:
- Cheapest paid option (~$0.0015/plan)
- Good cultural cuisine knowledge
- Creative meal suggestions

**Cons**:
- Slightly less reliable at structured output
- Still costs money at scale

**Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output

---

### Option C: Gemini 1.5 Flash (Free tier)
**Pros**:
- **FREE** for MVP scale
- Good structured output
- Reasonable quality for meal generation
- Easy upgrade path

**Cons**:
- Rate limits: 15 RPM, 1M RPD, 1500 RPD
- Less polished reasoning than paid models

**Cost**: $0 (free tier)

---

## Decision

**Chosen**: **Gemini 1.5 Flash (Free tier via OpenRouter)**

**Rationale**:
1. **Budget**: $0 cost perfect for MVP validation phase
2. **Scale**: Rate limits (15 RPM, 1500 RPD) more than sufficient for 2 users
3. **Quality**: Good enough for structured meal generation tasks
4. **Risk**: Low - easy to upgrade if quality issues arise

**Quote from constitution**: "Build for 100 users, but architect for 10,000" - starting free allows budget for other priorities.

---

## Consequences

**Enables**:
- Zero AI cost during validation phase
- Budget available for other tools (Tavily, hosting)
- Fast iteration without cost anxiety

**Prevents**:
- May hit rate limits during heavy development/testing
- Quality ceiling lower than premium models

---

## Migration Path

**Upgrade Trigger**:
- Hitting rate limits consistently (>10/day)
- Scaling to paid users (>10 users)
- Quality complaints from wife/early users
- Users report generic meal plans

**Target Model**: GPT-4o-mini (next cheapest with good quality)

**Estimated Migration Effort**: 1 hour (change model name in OpenRouter config, no code changes)

**Cost at Scale**:
- 10 users × 30 plans/month = 300 plans
- 300 × $0.0015 = $0.45/month
- 100 users × 30 plans/month = 3000 plans
- 3000 × $0.0015 = $4.50/month

---

## Review Date

**Next review**: After 50 meal plans generated OR if quality issues reported

---

## Related Decisions

- Tavily integration (2026-02-11-tavily-validation.md)
- Data storage strategy (to be documented when implemented)
