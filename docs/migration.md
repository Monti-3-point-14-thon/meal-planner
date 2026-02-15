# Migration Guide: localStorage to MongoDB

## Overview

**Feature 003** introduced persistent storage with MongoDB Atlas, replacing the browser's localStorage used in Features 001 and 002.

## What Changed

### Before (Features 001 & 002)
- User settings stored in browser's localStorage
- Meal plans saved locally in browser
- Data tied to single device/browser
- No user accounts or authentication

### After (Feature 003)
- User accounts with Google OAuth sign-in
- All data stored in MongoDB Atlas
- Cross-device synchronization
- Multi-user support (separate accounts)
- Unlimited meal plan history

## Migration Strategy

**Important**: Old localStorage data will **NOT** be automatically imported to MongoDB.

### Why No Auto-Migration?

1. **Clean data start**: Ensures all data follows new validated schema
2. **Simpler implementation**: Avoids complex data transformation logic
3. **MVP speed**: Faster to ship without migration overhead
4. **Low user count**: Currently in testing phase with minimal users

### What You Need To Do

If you used Features 001/002 and have existing data in localStorage:

#### 1. **User Profile Settings**
- **Old data**: Stored in browser localStorage
- **Action**: Re-enter your profile information at `/profile/create`
- **Takes**: ~2 minutes
- **Benefits**: Fresh validated data, now synced across devices

#### 2. **Meal Plans**
- **Old data**: Stored in browser localStorage
- **Action**: Meal plan history starts fresh after sign-in
- **Option**: Take screenshots of old plans if you want to keep them
- **Note**: You can regenerate meal plans anytime

## Future Enhancements

If user base grows significantly and auto-migration becomes valuable, we could add:

1. **One-time import tool**:
   - Detect localStorage data on first sign-in
   - Prompt user: "Import existing data?"
   - Transform and validate data
   - Save to MongoDB

2. **Export/Import feature**:
   - Export localStorage data to JSON
   - Import JSON to MongoDB account

**Current Decision**: Defer migration tooling until user demand justifies the implementation cost (estimated 2-3 days of work).

## Questions?

If you encounter issues during the transition, please open an issue with:
- Browser and device used for old data
- What data you're trying to preserve
- Use case for migration tool

## Technical Details

### Schema Differences

**Old localStorage format** (Feature 001/002):
```javascript
{
  "user-settings": {
    "biometrics": {...},
    "dietary_restrictions": [...],
    // snake_case, no foreign keys
  },
  "meal-plans": [
    {
      "meals": [...],
      // flat structure, no relational links
    }
  ]
}
```

**New MongoDB schema** (Feature 003):
```javascript
// Relational structure with foreign keys
User (from NextAuth)
  ↓ userId
UserProfile (1:1 with User)
  ↓ userProfileId
WeekPlan
  ↓ weekPlanId
DayPlan
  ↓ dayPlanId
Meals + Snacks (separate collections)

// camelCase, indexed, validated
```

### Why Relational Schema?

1. **Data integrity**: Foreign keys prevent orphaned records
2. **Query performance**: Indexed relationships for fast lookups
3. **Future features**: Enables grocery lists, meal swaps, recipe sharing
4. **Historical accuracy**: Profile snapshots preserve state at generation time

---

**Last Updated**: 2026-02-14
**Related Feature**: 003-database-auth-infrastructure
