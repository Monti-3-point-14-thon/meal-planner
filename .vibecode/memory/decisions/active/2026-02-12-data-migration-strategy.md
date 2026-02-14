# Decision: Data Migration Strategy for CulturalContext Schema Change

**Date**: 2026-02-12
**Feature**: 002-settings-ux-improvements
**Context**: Changing `CulturalContext.cuisine` from single string to `cuisines` array breaks existing localStorage data

## Options Considered

### Option A: Versioned Schema with Migration
- **Pros**:
  - Clean, production-ready approach
  - Handles all edge cases
  - Supports multiple schema versions simultaneously
  - Easy to add future migrations
- **Cons**:
  - Over-engineered for current context (0 real users)
  - Additional code complexity (version checking, migration functions)
  - Slows down current development (2-3 hours setup)
- **Cost**: 0.5 days upfront + ongoing maintenance

### Option B: Backwards-Compatible Read
- **Pros**:
  - Simple implementation (2-line check)
  - Works for dev testing immediately
  - No version tracking needed
  - Easy to upgrade to Option A later if needed
- **Cons**:
  - Tech debt if we ship to real users without upgrading
  - Doesn't handle other schema changes (e.g., Sex type)
  - Could fail silently if migration logic is incomplete
- **Cost**: 0.5 hours implementation

### Option C: Clear localStorage on Deploy
- **Pros**:
  - Simplest possible approach (no migration code)
  - Forces all users to re-enter settings (guarantees new schema)
  - No tech debt
- **Cons**:
  - Users lose settings (bad UX if we have real users)
  - Requires clear communication to users
  - Not scalable (can't do this for every feature)
- **Cost**: 0 hours (just document in release notes)

## Decision

**Chosen**: **Option B (Backwards-Compatible Read)**

**Rationale**:
1. **Current user base**: MVP has 0 real users, only developer testing
2. **Time sensitivity**: Feature 002 already estimated at 5-7 days, don't add overhead
3. **Simple implementation**: 2-line check in storage read function:
   ```typescript
   if (typeof settings.cultural_context.cuisine === 'string') {
     settings.cultural_context.cuisines = [settings.cultural_context.cuisine];
     delete settings.cultural_context.cuisine;
   }
   ```
4. **Upgrade path exists**: If we get real users before feature 003, can add proper versioned migration (0.5 days effort)
5. **Risk is low**: Worst case = user re-enters settings (takes 3 minutes per constitution success criteria)

## Consequences

**Enables**:
- Fast feature delivery (no migration overhead)
- Smooth dev testing experience
- Flexibility to upgrade migration approach when needed

**Prevents**:
- Production-grade schema versioning system
- Handling complex multi-step migrations
- Automatic migration tracking/logging

**Technical Debt Created**:
- Migration code is coupled to data read function (not centralized)
- No audit trail of which data was migrated
- Doesn't handle `Sex: "other"` migration (separate manual prompt)

## Migration Implementation

**Location**: `lib/storage.ts` - `getSettings()` function

**Code**:
```typescript
export function getSettings(): UserSettings | null {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;

  const settings = JSON.parse(stored) as UserSettings;

  // Backwards compatibility: migrate old single cuisine to array
  if (settings.cultural_context &&
      'cuisine' in settings.cultural_context &&
      typeof (settings.cultural_context as any).cuisine === 'string') {
    settings.cultural_context.cuisines = [(settings.cultural_context as any).cuisine];
    delete (settings.cultural_context as any).cuisine;
  }

  // Backwards compatibility: add food_preferences if missing
  if (!settings.food_preferences) {
    settings.food_preferences = { dislikes: [] };
  }

  return settings;
}
```

**Sex "other" Migration**: Handled in BiometricsInput component with alert prompt (not automatic)

## Review Trigger

**Upgrade to Option A (Versioned Schema) when**:
- We acquire first 10 real users, OR
- We plan 3+ more features that modify UserSettings schema, OR
- Migration failures reported in console logs

**Effort to Upgrade**: 0.5 days
- Add schema version field to UserSettings
- Create migrations array with version-to-version transforms
- Centralize migration logic in separate file
- Add migration execution on app load

## Testing Notes

**Manual Test Cases**:
1. Fresh user (no localStorage) → Should work normally
2. Existing feature 001 user with single cuisine → Should migrate to array
3. Existing user with `sex: "other"` → Should prompt for update in BiometricsInput
4. Existing user with no `food_preferences` → Should add empty dislikes array

## Related Files

- `lib/storage.ts` - getSettings() function
- `app/components/BiometricsInput.tsx` - Sex migration alert
- `lib/types.ts` - Schema definitions

## Review Date

Before feature 003 begins - assess if schema changes require versioned migration system
