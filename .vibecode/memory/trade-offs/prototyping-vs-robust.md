# Prototyping vs Robust: Decision Patterns

This file accumulates patterns for when to ship fast vs build for scale.

---

## How to Use This File

**When starting a new feature**:
1. Check if similar pattern exists
2. Apply pattern OR document why this is different

**After building a feature**:
3. Update pattern with what you learned

---

## Patterns

<!-- Patterns will be added here as decisions are made -->

### Pattern Template:
```markdown
## [Feature Type] - [Date]

**Context**:
- Users: [number]
- Budget: [amount]
- Timeline: [urgent/moderate/flexible]
- Validation status: [unproven/partially-validated/proven]

**Decision**: [Prototype OR Robust]

**Rationale**:
- [Why this approach made sense]
- [Trade-offs accepted]

**Result**: [Update after building]
- Time taken: [actual days]
- Issues encountered: [list]
- Would do again: [yes/no, why]

**Upgrade trigger**: [When to make it robust]
```

---

## General Guidelines

### Prototype When:
- [ ] Feature is unvalidated (users haven't proven they want it)
- [ ] Timeline is tight (need to test hypothesis)
- [ ] Scale is <100 users
- [ ] Budget constraints

**Acceptable trade-offs**:
- Technical debt
- Harder to scale later
- More manual processes
- Not optimized for performance

### Build Robust When:
- [ ] Feature is validated (clear user demand)
- [ ] Core product value (not an experiment)
- [ ] Scale >100 users or rapid growth expected
- [ ] Security/compliance required

**Acceptable trade-offs**:
- Takes 2-3x longer
- More upfront complexity
- Might over-engineer for current needs

---

_Patterns will accumulate here as you make decisions. This becomes your personalized playbook._
