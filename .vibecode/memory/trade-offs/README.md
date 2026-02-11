# Trade-offs Library

This is your **Technical Co-Founder's pattern library** - accumulated wisdom from decisions you've made.

## Purpose

When Claude encounters a similar decision in the future, it references these patterns to:
1. Remind you what you decided before
2. Explain why that decision was made
3. Suggest following the same pattern (or explain why this case is different)

## Structure

Each file represents a **category of technical decision** with accumulated patterns.

### Example Pattern Entry:
```markdown
## Pattern: Photo Storage for MVP

**Context**:
- Users: <100
- Budget: <$50/mo
- Timeline: Need to validate if users upload photos

**Decision**: Simple server storage

**Rationale**:
- $0 cost vs $5-10/mo for S3
- 2 days to build vs 5 days
- Easy migration path (1 day) when needed

**Trigger for upgrade**: 500+ users OR load speed becomes critical

**Learned**: [Update this after you migrate or learn something new]
```

## Files

### prototyping-vs-robust.md
Patterns for when to ship fast vs build for scale. Included with the template.

### Additional files (created as patterns accumulate)
As you make decisions during `/vibecode:plan` and `/vibecode:implement`, new pattern files are created automatically in relevant categories such as:
- AI implementation patterns
- UX vs technical complexity trade-offs
- Storage and data decisions
- Authentication approaches
- And more based on your project's needs

## How to Use

**When making a decision**:
1. Check if similar pattern exists
2. Follow it OR document why this case is different
3. After decision proves out, update pattern with learnings

**When Claude suggests something different than past pattern**:
- Claude should say: "I notice we chose X before for similar case, but suggesting Y because..."
- You can challenge or approve

## Maintenance

- **Update after implementation**: Add "Learned" section after building
- **Archive obsolete patterns**: Move to archived/ if no longer relevant
- **Keep patterns concise**: 1 pattern = 1 decision category
