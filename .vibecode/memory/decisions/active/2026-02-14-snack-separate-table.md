# Decision: Snacks as Separate Table from Meals

**Date**: 2026-02-14
**Feature**: 003-database-auth-infrastructure
**Context**: Meal plans include snacks (morning, afternoon, evening). Question: store snacks in same table as meals, or separate table?

## Options Considered

### Option A: Unified Meal Table
- **Pros**:
  - Single query for all meals + snacks
  - Simpler schema (one table)
  - Easy chronological sorting
- **Cons**:
  - Snacks and meals may have different fields (portability, timing preferences)
  - Type checking more complex (6 types vs 3)
  - Future snack-specific features harder to add
- **Cost**: 0 days (simpler)

### Option B: Separate Snack Table
- **Pros**:
  - Clean separation of concerns
  - Snack-specific fields don't pollute Meal model
  - Independent schema evolution (snacks may get unique fields)
  - Type safety (3 meal types, 3 snack types - no mixing)
- **Cons**:
  - Need to query both tables when displaying day plan
  - Slightly more complex API logic
- **Cost**: +0.5 days (extra model + routes)

## Decision

**Chosen**: Option B (Separate Snack Table)

**Rationale**:
1. **User requirement**: User explicitly stated "Snacks maybe be a separate table as it might not be the same structure as the 'standard' meals"
2. **Future flexibility**: Snacks may evolve different features (portability for on-the-go, timing relative to workouts, prep complexity)
3. **Domain expert insights pending**: When nutritionist validates what context matters, snacks may need distinct fields
4. **Type safety**: Separate types prevent meal/snack confusion in UI and API
5. **Query overhead negligible**: At MVP scale, querying 2 tables vs 1 has no performance impact

## Consequences

**Enables**:
- Snack-specific features without affecting meals (portability, timing preferences, workout alignment)
- Clean type definitions in TypeScript
- Independent validation rules for snacks vs meals

**Prevents**:
- Single query for all day items (must query meals + snacks separately)

## Migration Path

**Trigger**: If snack-specific features never materialize after 6 months, could merge into Meal table
**Effort**: 1-2 days (merge schemas, migrate data, update queries)

## Review Date

After Feature 006 (Personalization Deep Dive) - assess whether snack-specific fields justified separation
