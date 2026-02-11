# Decision: Tavily Scientific Validation Integration

**Date**: 2026-02-11
**Feature**: 001-meal-plan-generator
**Context**: User has Tavily free plan (1000 credits), constitution emphasizes "science-first" nutrition

---

## Options Considered

### Option A: Include Tavily in MVP (Validate All Claims)
**Pros**:
- Aligns with "science-first" principle from day 1
- Builds trust with sourced claims
- Free credits available

**Cons**:
- Adds 5-10 seconds per meal (slower generation)
- Burns through 1000 credits quickly (~100-200 meal plans)
- Extra implementation complexity

**Cost**: $0 initially, $60/mo after credits exhausted

---

### Option B: Defer Tavily to v2
**Pros**:
- Ship faster (no additional API integration)
- No cost
- Simpler implementation

**Cons**:
- Violates "science-first" principle
- No source citations for nutritional claims
- Harder to add later (requires prompt redesign)

**Cost**: $0

---

### Option C: Include Tavily, Use Selectively
**Pros**:
- Aligns with constitution
- Preserves free credits (~300-500 meal plans possible)
- Wife (nutritionist) can manually validate if credits run out
- Optional feature (can disable if slow)

**Cons**:
- Requires smart detection of "uncertain" claims
- Slightly more complex implementation

**Cost**: $0 initially (1000 free credits)

---

## Decision

**Chosen**: **Option C (Include Tavily, use selectively)**

**Rationale**:
1. **Alignment with constitution**: "Science-first" is Principle I
2. **No cost**: User has free 1000 credits
3. **Credit preservation**: Selective use = ~300-500 meal plans (enough for MVP validation)
4. **Safety net**: Wife is a nutritionist, can manually review
5. **Competitive advantage**: Sourced nutrition claims differentiate from generic ChatGPT

**Quote from constitution**: "All nutritional advice must be rooted in scientifically proven facts."

---

## Implementation Strategy

### When to Use Tavily (Selective):
✅ **Validate when AI uses uncertain language**:
- "may help", "could benefit", "some studies suggest"
- Claims about specific health conditions (gut health, inflammation)
- Unusual ingredient combinations

❌ **Skip validation for established science**:
- Basic macros (protein for muscle building)
- Common diet recommendations (Mediterranean for heart health)
- Standard restrictions (gluten-free for celiac)

### Technical Approach:
```typescript
// Pseudo-code
if (aiReasoning.includes(['may', 'could', 'some studies'])) {
  const source = await tavily.validate(claim);
  meal.scientific_sources = [source];
}
```

---

## Consequences

**Enables**:
- Science-backed meal plans from day 1
- Trust building with sourced claims
- Differentiation from "just ChatGPT"
- Wife's nutritionist credibility supported by sources

**Prevents**:
- Unlimited validation (credits constrained)
- Instant generation (adds 5-10s when validating)

---

## Migration Path

**Trigger**: Running low on Tavily credits (<100 remaining)

**Options**:
1. **Upgrade to Tavily Pro** ($60/mo) - if product validated
2. **Make validation fully optional** - toggle in settings
3. **Manual nutritionist review** - wife validates uncertain claims

**Estimated Upgrade Cost**:
- Tavily Pro: $60/mo for 1000 searches/month
- Break-even: ~20 paying users at $3/mo would cover cost

---

## Review Date

**Next review**: When credits < 100 remaining OR after first 10 real users

---

## Related Decisions

- AI model selection (2026-02-11-ai-model-selection.md)
- Quality vs speed trade-offs (future decision)
