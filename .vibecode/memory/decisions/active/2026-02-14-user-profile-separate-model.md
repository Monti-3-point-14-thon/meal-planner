# Decision: UserProfile as Separate Model

**Date**: 2026-02-14
**Feature**: 003-database-auth-infrastructure
**Context**: Need to store user profile data (biometrics, dietary restrictions, food preferences, cuisines). Ship-Fast provides User model for authentication. Question: extend User or create separate UserProfile?

## Options Considered

### Option A: Extend Ship-Fast User Model
- **Pros**:
  - Single model for all user data
  - Simpler queries (no joins)
  - Fewer models to maintain
- **Cons**:
  - Mixes auth concerns with domain data
  - Hard to update Ship-Fast boilerplate (conflicts)
  - User model gets bloated with domain-specific fields
- **Cost**: 0-1 day (simpler initially)

### Option B: Separate UserProfile Model (1:1 with User)
- **Pros**:
  - Clean separation: auth vs domain concerns
  - Easy Ship-Fast updates (no User model conflicts)
  - Profile schema evolves independently
  - Clear domain boundaries
- **Cons**:
  - Extra model to maintain
  - Queries need population (minimal overhead)
- **Cost**: 1 day (one extra model + routes)

## Decision

**Chosen**: Option B (Separate UserProfile Model)

**Rationale**:
1. **Constitution alignment**: Two-Track Development Strategy - build domain models independently from boilerplate infrastructure
2. **Maintainability**: Ship-Fast may update User model in future releases; separate profile avoids merge conflicts
3. **Domain clarity**: Profile data is meal planning domain, not authentication concern
4. **Flexible schema philosophy**: Profile schema will evolve as domain expert provides insights; keeping separate prevents bloating User model
5. **Minimal overhead**: Population cost negligible for MVP scale (<100 users)

## Consequences

**Enables**:
- Ship-Fast updates without profile migration
- Profile schema evolution without auth concerns
- Clean API boundaries (`/api/profile` vs `/api/user`)

**Prevents**:
- Direct user-to-profile queries (must populate)

## Migration Path

**Trigger**: None expected - this is the right abstraction for long term
**Effort**: If needed, could merge models later (2-3 days migration)

## Review Date

After Feature 006 (Personalization Deep Dive) - verify profile schema served needs well
