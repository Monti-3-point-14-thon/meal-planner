# Decision: Data Storage Strategy for MVP

**⚠️ ARCHIVED: 2026-02-15**
**Superseded by**: Feature 003 (Database & Auth Infrastructure)
**Reason**: This decision to use localStorage for MVP was successfully implemented in Feature 001-002. Feature 003 completed the planned migration to MongoDB with NextAuth authentication, making this decision complete and no longer active. See active decisions:
- `2026-02-14-mongodb-free-tier.md` - MongoDB Atlas implementation
- `2026-02-14-no-localstorage-migration.md` - Migration strategy decision
- `2026-02-14-user-profile-separate-model.md` - Data model architecture

---

**Date**: 2026-02-11
**Feature**: 001-meal-plan-generator
**Context**: MVP with 2 users, no auth yet, need fast implementation

---

## Options Considered

### Option A: localStorage (Client-side)
**Pros**:
- Zero setup time
- No backend needed
- Free (no hosting cost)
- Fast implementation (1 hour)
- Works offline

**Cons**:
- Data lost if browser cache cleared
- Can't sync across devices
- Limited to ~5-10MB
- No multi-user support

**Cost**: $0

---

### Option B: MongoDB (via ship-fast)
**Pros**:
- Persistent storage
- Multi-device sync
- Ship-fast already configured
- Scalable
- Supports user auth (future)

**Cons**:
- Requires backend setup
- Needs MongoDB hosting (~$0-10/mo)
- Requires user authentication
- Slower implementation (2-3 days)

**Cost**: ~$0-10/mo (MongoDB Atlas free tier or M0)

---

### Option C: Hybrid (localStorage now, MongoDB later)
**Pros**:
- Ship fast with localStorage
- Easy migration path (design for MongoDB)
- Zero cost for MVP
- localStorage as offline fallback

**Cons**:
- Need to design data models carefully
- Migration work later (2-3 days)

**Cost**: $0 now, ~$0-10/mo later

---

## Decision

**Chosen**: **Option C (localStorage for MVP, MongoDB migration path)**

**Rationale**:
1. **Speed**: localStorage = 1 hour vs MongoDB = 2-3 days
2. **Cost**: $0 for MVP validation
3. **Users**: Only 2 users (him + wife), single device OK
4. **Constitution**: "Prototype-first" approach - validate before investing
5. **Migration**: TypeScript interfaces designed for MongoDB compatibility

**Quote from constitution**: "Build for 100 users, but architect for 10,000."

---

## Implementation Details

### localStorage Keys:
- `meal_planner_settings` - UserSettings object
- `meal_planner_current` - Current MealPlan
- `meal_planner_history` - Array of last 5 plans

### Data Structure:
```typescript
// Designed for MongoDB compatibility
interface UserSettings {
  id: string; // uuid (will become MongoDB _id)
  primary_goal: string;
  biometrics: { ... };
  cultural_context: { ... };
  dietary_restrictions: string[];
  created_at: string; // ISO timestamp
  updated_at: string;
}
```

### MongoDB Migration Checklist (Future):
1. Create MongoDB schemas matching TypeScript interfaces
2. On user signup, check localStorage for existing data
3. Migrate localStorage data to MongoDB
4. Keep localStorage as fallback/offline mode
5. Estimated effort: 2-3 days

---

## Consequences

**Enables**:
- Ship in 5-7 days (vs 7-10 with MongoDB)
- Zero infrastructure cost for MVP
- Fast iteration without database concerns
- Offline-first UX

**Prevents**:
- Multi-device sync (user can only use one browser)
- Data backup (lost if cache cleared)
- Multi-user features (sharing meal plans)

---

## Migration Path

**Trigger**: When adding user authentication OR when scaling to >10 users

**Migration Steps**:
1. Set up MongoDB (ship-fast boilerplate ready)
2. Create collections: UserSettings, MealPlans
3. Add migration endpoint: POST /api/migrate-from-localStorage
4. Update UI to check both localStorage and MongoDB
5. Keep localStorage as offline fallback

**Estimated Migration Effort**: 2-3 days

**Data Compatibility**: TypeScript interfaces designed for 1:1 MongoDB mapping (no breaking changes)

---

## Risk Mitigation

**Risk**: User clears browser cache, loses meal plans

**Mitigation**:
- Add "Export Data" button (download JSON)
- Add "Import Data" button (restore from JSON)
- Warn user if localStorage quota approaching limit
- Prioritize MongoDB migration if users report data loss

---

## Review Date

**Next review**: When adding user authentication OR after 10 users

---

## Related Decisions

- Ship-fast boilerplate integration (constitution: 2026-02-11)
- Future: User authentication strategy (TBD)
