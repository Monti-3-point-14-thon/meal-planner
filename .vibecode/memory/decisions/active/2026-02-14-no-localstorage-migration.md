# Decision: No localStorage Migration to Database

**Date**: 2026-02-14
**Feature**: 003-database-auth-infrastructure
**Context**: Features 001-002 stored user settings in localStorage. Now adding database. Question: auto-migrate localStorage data to DB or let users re-enter?

## Options Considered

### Option A: Auto-Import from localStorage
- **Pros**:
  - Preserves existing user data (settings, meal plans)
  - Better UX for existing users (no re-entry)
  - Shows thoughtfulness about user data
- **Cons**:
  - Complex migration logic (localStorage → DB schema transform)
  - Risk of corrupted/invalid data in localStorage
  - localStorage schema may not match new DB schema exactly
  - No validation on import (garbage in = garbage out)
- **Cost**: 2-3 days (migration logic + validation + error handling)

### Option B: Manual Re-Entry (No Migration)
- **Pros**:
  - Simple implementation (0 migration code)
  - Clean validated data in DB from start
  - Forces users to review/update settings
  - No risk of corrupted localStorage data poisoning DB
- **Cons**:
  - Users must re-enter settings
  - Existing meal plans lost (but localStorage only stores 5 max)
- **Cost**: 0 days

### Option C: Optional Import with Manual Review
- **Pros**:
  - Best of both worlds (preserve data, validate before import)
- **Cons**:
  - Most complex (2-3 days + UI for review)
  - Over-engineered for 2 users
- **Cost**: 3-4 days

## Decision

**Chosen**: Option B (Manual Re-Entry, No Migration)

**Rationale**:
1. **User count**: Only 2 users (you + wife) - minimal impact
2. **Data loss minimal**: localStorage caps at 5 meal plans; unlimited history is the improvement
3. **Data quality**: Clean validated data from start; localStorage may have inconsistencies from rapid Feature 001-002 iteration
4. **Constitution alignment**: Neutral Work - "good enough is fine", migration is over-engineering for MVP
5. **Schema divergence**: Feature 002 changed settings structure (cuisine → cuisines, added food_preferences); localStorage migration would need schema transforms
6. **Time to value**: 0 days vs 2-3 days; ship faster, validate sooner

## Consequences

**Enables**:
- Immediate implementation of Feature 003 (no migration blocker)
- Clean DB data from day 1
- Faster path to multi-user testing

**Prevents**:
- Preserving existing localStorage settings/meal plans

## Migration Path

**Trigger**: If Feature 003 expands to 100+ users before launch, reconsider import feature
**Effort**: Could add optional import later if needed (2-3 days)

**Note for Users**: Both users are technical (founder + wife who validates features), re-entry is acceptable trade-off for speed.

## Review Date

After Feature 003 testing - if re-entry is painful for wife, reconsider import
