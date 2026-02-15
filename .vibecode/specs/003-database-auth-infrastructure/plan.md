# Technical Implementation Plan: Database & Auth Infrastructure (Feature 003)

**Date**: 2026-02-14
**Feature**: 003-database-auth-infrastructure
**Approach**: Balanced (Prototype UI, Robust Infrastructure)
**Timeline**: 7-10 days
**Complexity**: Medium-High

---

## Context

**Why this change**: Currently using localStorage (volatile, device-locked, max 5 plans). Need multi-user support, unlimited history, cross-device access, and persistent data to enable future features (7-day plans, feedback, personalization).

**What prompted it**: Strategic roadmap decision (Phase 1: Data Foundation) to build technical infrastructure before domain-specific features.

**Intended outcome**: You and wife can create separate Google accounts, sign in, save profiles, generate unlimited meal plans, and access them from any device.

---

## Overview

**Approach**: Balanced
- **Infrastructure (Robust)**: NextAuth + MongoDB production-ready (reuse Ship-Fast patterns)
- **UI (Prototype)**: Basic forms, simple history list (good enough for MVP)

**Timeline**: 7-10 days
- Phase 1 (Auth): 2-3 days
- Phase 2 (Profile): 2-3 days
- Phase 3 (Meal Plan Persistence): 2-3 days
- Phase 4 (History): 1 day

**Complexity**: Medium-High
- New concepts: NextAuth, Mongoose, session management
- Reusing Ship-Fast: Reduces complexity significantly
- Learning curve: MongoDB schema design, API routes with auth

---

## Tech Stack

### Framework & UI
**Next.js 15 + React 19** (existing)
- App Router with server components
- **Rationale**: Already in use, Ship-Fast patterns compatible

**Tailwind CSS v4 + DaisyUI v5** (existing)
- Reuse design system tokens from Feature 002
- **Rationale**: Consistent styling, no new dependencies

### Authentication
**NextAuth 5.x** (from Ship-Fast)
- **Provider**: Google OAuth
- **Session Strategy**: JWT (edge-compatible)
- **Adapter**: MongoDBAdapter (automatic user persistence)
- **Rationale**: Production-ready, Ship-Fast already configured, zero setup cost

**Location**: Reuse Ship-Fast's `/libs/auth.js` pattern

### Database
**MongoDB** (from Ship-Fast)
- **Driver**: Mongoose 8.x
- **Connection**: Ship-Fast's `/libs/mongoose.js` wrapper
- **Hosting**: MongoDB Atlas (free tier M0 - 512MB)
- **Rationale**: Ship-Fast configured, scales to millions, flexible schemas

### Schema Design Philosophy
**Relational with foreign keys** (user specified)
- Use Mongoose's `ref` and `populate()` for relationships
- Separate collections: Users, UserProfiles, WeekPlans, DayPlans, Meals, Snacks
- **Rationale**: Clean separation, easier to query, snacks have different structure

### API Layer
**Next.js API Routes** (App Router)
- Pattern: `/app/api/[resource]/route.ts`
- Auth via `auth()` from Ship-Fast
- DB connection via `connectMongo()` from Ship-Fast
- **Rationale**: Built-in, no extra dependencies, Ship-Fast patterns proven

---

## Architecture

### High-Level Data Flow

```
User (Browser)
    ↓ Sign in with Google
NextAuth (OAuth)
    ↓ Create/fetch User
MongoDB (users collection)
    ↓ Create/fetch UserProfile
MongoDB (userProfiles collection)
    ↓ Generate meal plan (POST /api/meal-plans)
AI Model (OpenRouter) + Profile data
    ↓ Save plan
MongoDB (weekPlans → dayPlans → meals/snacks)
    ↓ Display plan
User (Browser)
```

---

## Database Schema Design

### Collection: `users` (Ship-Fast User model, extended)

**Location**: `/models/User.js` (modify existing Ship-Fast model)

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const userSchema = mongoose.Schema(
  {
    // Ship-Fast fields (keep as-is):
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, private: true },
    image: { type: String },
    customerId: { type: String },  // Stripe (unused for now)
    priceId: { type: String },     // Stripe (unused for now)
    hasAccess: { type: Boolean, default: false },  // Stripe (unused for now)

    // Meal planner additions (NONE - use separate UserProfile model):
    // Keep User model as-is for Ship-Fast compatibility
  },
  {
    timestamps: true,  // createdAt, updatedAt
    toJSON: { virtuals: true }
  }
);

userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
```

**Decision**: Keep Ship-Fast User model unchanged, use separate UserProfile for meal planning data.

**Rationale**: Separation of concerns - auth data vs domain data. Easier to maintain Ship-Fast updates.

---

### Collection: `userprofiles` (NEW)

**Location**: `/models/UserProfile.js` (new file)

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const userProfileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,  // 1:1 relationship
    },

    // Biometrics
    biometrics: {
      weight: { type: Number, required: true },  // kg
      height: { type: Number, required: true },  // cm
      age: { type: Number, required: true },
      sex: { type: String, enum: ["male", "female"], required: true },
    },

    // Dietary restrictions (hard restrictions - MUST follow)
    dietaryRestrictions: [{ type: String }],  // e.g., ["Gluten-free", "Dairy-free"]

    // Food preferences (soft preferences - avoid when possible)
    foodPreferences: {
      dislikes: [{ type: String }],  // e.g., ["mushrooms", "cilantro"]
    },

    // Cultural cuisines
    culturalCuisines: [{ type: String }],  // e.g., ["Italian", "Japanese", "Mexican"]

    // Location
    location: { type: String },  // e.g., "Netherlands"

    // Flexible fields for future expansion (wife's input)
    trainingContext: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    healthContext: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

userProfileSchema.plugin(toJSON);

// Virtual: reference to weekPlans
userProfileSchema.virtual("weekPlans", {
  ref: "WeekPlan",
  localField: "_id",
  foreignField: "userProfileId",
});

export default mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);
```

---

### Collection: `weekplans` (NEW)

**Location**: `/models/WeekPlan.js`

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const weekPlanSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },

    startDate: { type: Date, required: true },  // Start of week
    endDate: { type: Date, required: true },    // End of week

    primaryGoal: {
      type: String,
      enum: ["muscle_building", "weight_loss", "gut_health", "mental_performance", "general_health"],
      required: true,
    },

    // Snapshot of profile at generation time (for historical accuracy)
    profileSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

weekPlanSchema.plugin(toJSON);

// Virtual: reference to dayPlans
weekPlanSchema.virtual("dayPlans", {
  ref: "DayPlan",
  localField: "_id",
  foreignField: "weekPlanId",
});

// Index for fast user queries
weekPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.WeekPlan || mongoose.model("WeekPlan", weekPlanSchema);
```

---

### Collection: `dayplans` (NEW)

**Location**: `/models/DayPlan.js`

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const dayPlanSchema = mongoose.Schema(
  {
    weekPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeekPlan",
      required: true,
    },

    date: { type: Date, required: true },  // YYYY-MM-DD

    dailyTotals: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },   // grams
      carbs: { type: Number, required: true },     // grams
      fat: { type: Number, required: true },       // grams
      fiber: { type: Number, required: true },     // grams
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

dayPlanSchema.plugin(toJSON);

// Virtuals: references to meals and snacks
dayPlanSchema.virtual("meals", {
  ref: "Meal",
  localField: "_id",
  foreignField: "dayPlanId",
});

dayPlanSchema.virtual("snacks", {
  ref: "Snack",
  localField: "_id",
  foreignField: "dayPlanId",
});

// Index for fast queries
dayPlanSchema.index({ weekPlanId: 1, date: 1 });

export default mongoose.models.DayPlan || mongoose.model("DayPlan", dayPlanSchema);
```

---

### Collection: `meals` (NEW)

**Location**: `/models/Meal.js`

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },  // e.g., "200g", "1 cup"
}, { _id: false });

const mealEditSchema = mongoose.Schema({
  editedAt: { type: Date, required: true },
  instruction: { type: String, required: true },
  previousName: { type: String },
  previousMacros: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const mealSchema = mongoose.Schema(
  {
    dayPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayPlan",
      required: true,
    },

    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    name: { type: String, required: true },

    ingredients: [ingredientSchema],

    instructions: { type: String },

    macros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: { type: Number, required: true },
    },

    nutritionalReasoning: { type: String },

    scientificSources: [{ type: String }],  // URLs

    prepTimeMinutes: { type: Number, default: 30 },

    editHistory: [mealEditSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

mealSchema.plugin(toJSON);

// Index for fast day queries
mealSchema.index({ dayPlanId: 1, type: 1 });

export default mongoose.models.Meal || mongoose.model("Meal", mealSchema);
```

---

### Collection: `snacks` (NEW, separate from meals)

**Location**: `/models/Snack.js`

```javascript
import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
}, { _id: false });

const snackEditSchema = mongoose.Schema({
  editedAt: { type: Date, required: true },
  instruction: { type: String, required: true },
  previousName: { type: String },
  previousMacros: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const snackSchema = mongoose.Schema(
  {
    dayPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayPlan",
      required: true,
    },

    type: {
      type: String,
      enum: ["morning_snack", "afternoon_snack", "evening_snack"],
      required: true,
    },

    name: { type: String, required: true },

    ingredients: [ingredientSchema],

    macros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: { type: Number, required: true },
    },

    nutritionalReasoning: { type: String },

    prepTimeMinutes: { type: Number, default: 10 },

    // Snack-specific fields (different from meals):
    portability: { type: Boolean, default: false },  // Can take on-the-go?
    timingPreference: { type: String },  // e.g., "pre-workout", "post-workout"

    editHistory: [snackEditSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

snackSchema.plugin(toJSON);

// Index for fast day queries
snackSchema.index({ dayPlanId: 1, type: 1 });

export default mongoose.models.Snack || mongoose.model("Snack", snackSchema);
```

---

## API Design

### Authentication Endpoints (Ship-Fast, no changes)

**Pattern**: Already configured in Ship-Fast

- `GET /api/auth/signin` - NextAuth sign-in page
- `POST /api/auth/signin/google` - Google OAuth initiation
- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/signout` - Sign out

**Usage in components**:
```javascript
import { signIn, signOut } from "next-auth/react";

// Sign in
<button onClick={() => signIn("google")}>Sign in with Google</button>

// Sign out
<button onClick={() => signOut()}>Sign out</button>
```

---

### Profile Endpoints (NEW)

#### `POST /api/profile` - Create user profile
**Auth**: Required
**Purpose**: First-time profile creation after sign-in

**Request**:
```json
{
  "biometrics": {
    "weight": 75,
    "height": 180,
    "age": 30,
    "sex": "male"
  },
  "dietaryRestrictions": ["Gluten-free"],
  "foodPreferences": {
    "dislikes": ["mushrooms", "cilantro"]
  },
  "culturalCuisines": ["Italian", "Japanese"],
  "location": "Netherlands"
}
```

**Response**:
```json
{
  "success": true,
  "profile": { ...profile object }
}
```

**Implementation**:
```javascript
// /app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import UserProfile from "@/models/UserProfile";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await req.json();

    // Check if profile already exists
    const existing = await UserProfile.findOne({ userId: session.user.id });
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    // Create profile
    const profile = await UserProfile.create({
      userId: session.user.id,
      ...body,
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

#### `GET /api/profile` - Get user profile
**Auth**: Required
**Purpose**: Fetch current user's profile

**Response**:
```json
{
  "success": true,
  "profile": { ...profile object }
}
```

---

#### `PUT /api/profile` - Update user profile
**Auth**: Required
**Purpose**: Update profile fields

**Request**: Same as POST (partial updates allowed)

---

### Meal Plan Endpoints (NEW)

#### `POST /api/meal-plans` - Generate and save meal plan
**Auth**: Required
**Purpose**: Generate meal plan using user profile + plan-specific inputs

**Request**:
```json
{
  "primaryGoal": "muscle_building",
  "startDate": "2026-02-17",
  "daysCount": 1  // For MVP, always 1 (7-day in Feature 004)
}
```

**Response**:
```json
{
  "success": true,
  "weekPlan": { ...weekPlan with populated dayPlans, meals, snacks }
}
```

**Implementation Flow**:
1. Get session (auth required)
2. Fetch UserProfile for authenticated user
3. Call existing AI generation API (reuse Feature 001 logic)
4. Save WeekPlan → DayPlan → Meals/Snacks to MongoDB
5. Return populated plan

---

#### `GET /api/meal-plans` - List user's meal plans
**Auth**: Required
**Purpose**: Get history of all user's meal plans

**Query Params**:
- `page` (default: 1)
- `limit` (default: 20)

**Response**:
```json
{
  "success": true,
  "weekPlans": [ ...array of plans ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

#### `GET /api/meal-plans/[id]` - Get specific meal plan
**Auth**: Required (must own plan)
**Purpose**: Fetch full details of a specific plan

**Response**:
```json
{
  "success": true,
  "weekPlan": { ...fully populated plan with meals and snacks }
}
```

---

#### `PUT /api/meal-plans/[weekPlanId]/days/[dayPlanId]/meals/[mealId]` - Edit meal
**Auth**: Required
**Purpose**: Regenerate specific meal (reuse Feature 001 edit logic)

**Request**:
```json
{
  "editInstruction": "Make this vegetarian"
}
```

**Implementation**: Reuse existing `/api/edit-meal` logic, save to MongoDB instead of localStorage

---

## Component Structure

### New Components (MVP - simple forms)

#### `app/auth/signin/page.tsx` (NEW)
- Google OAuth button
- "Sign in with Google" using NextAuth
- Redirect to `/profile/create` if no profile, else `/dashboard`

#### `app/profile/create/page.tsx` (NEW)
- Profile creation form (first-time onboarding)
- Fields: biometrics, restrictions, preferences, cuisines, location
- POST `/api/profile`, redirect to `/dashboard`

#### `app/profile/edit/page.tsx` (NEW)
- Profile edit form (reuse create form, pre-fill with existing data)
- PUT `/api/profile`, redirect back

#### `app/dashboard/page.tsx` (NEW)
- Main landing after sign-in
- Shows: "Generate meal plan" button, recent plans (3-5 most recent)
- Link to `/history` for full history

#### `app/history/page.tsx` (NEW)
- List all meal plans (paginated)
- Each plan: Date, goal, thumbnail (first meal names)
- Click → `/meal-plan/[id]`

#### `app/meal-plan/[id]/page.tsx` (MODIFY existing `/meal-plan`)
- Fetch plan from API instead of localStorage
- Display meals/snacks (reuse existing UI from Feature 001/002)

#### `components/AuthProvider.tsx` (NEW)
- Wrap app with NextAuth SessionProvider
- Add to `app/layout.tsx`

---

### Modified Components

#### `app/generate/page.tsx` (MODIFY)
- **Before**: Fetch settings from localStorage
- **After**: Fetch profile from `/api/profile`, add plan-specific inputs (goal, date)
- POST `/api/meal-plans` instead of `/api/generate-meal-plan`

#### `app/meal-plan/page.tsx` (MODIFY)
- **Before**: Read from localStorage
- **After**: Fetch from `/api/meal-plans/[latest]` or query param `?id=xxx`

---

## Implementation Phases

### Phase 1: Authentication Setup (2-3 days)

**Goal**: User can sign in with Google OAuth and session persists

**Tasks**:
1. Copy Ship-Fast's `/libs/auth.js` to meal planner project (if not already present)
2. Copy Ship-Fast's `/app/api/auth/[...nextauth]/route.js`
3. Add environment variables to `.env.local`:
   ```
   NEXTAUTH_SECRET=<generate with `openssl rand -base64 32`>
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_ID=<from Google Cloud Console>
   GOOGLE_SECRET=<from Google Cloud Console>
   MONGODB_URI=mongodb+srv://...
   ```
4. Create `/components/AuthProvider.tsx` (SessionProvider wrapper)
5. Wrap app in `app/layout.tsx` with AuthProvider
6. Create `/app/auth/signin/page.tsx` (sign-in page with Google button)
7. Create `/app/dashboard/page.tsx` (protected route, shows user name from session)
8. Test: Sign in → redirected to dashboard → browser restart → still signed in
9. Test: Sign out → redirected to sign-in page

**Files Created/Modified**:
- `/libs/auth.js` (copy from Ship-Fast)
- `/app/api/auth/[...nextauth]/route.js` (copy from Ship-Fast)
- `/components/AuthProvider.tsx` (new)
- `/app/layout.tsx` (modify: add AuthProvider)
- `/app/auth/signin/page.tsx` (new)
- `/app/dashboard/page.tsx` (new)
- `.env.local` (add auth vars)

**Dependencies**:
- Google Cloud Console: Create OAuth credentials
- MongoDB Atlas: Create free M0 cluster

---

### Phase 2: Profile Management (2-3 days)

**Goal**: User can create and edit their profile (biometrics, restrictions, preferences, cuisines)

**Tasks**:
1. Copy Ship-Fast's `/libs/mongoose.js` (if not already present)
2. Copy Ship-Fast's `/models/plugins/toJSON.js` (if not already present)
3. Extend Ship-Fast's `/models/User.js` (no changes, keep as-is)
4. Create `/models/UserProfile.js` (new schema, see Architecture section)
5. Create `/app/api/profile/route.ts` (POST, GET, PUT endpoints)
6. Create `/app/profile/create/page.tsx` (onboarding form for new users)
7. Create `/app/profile/edit/page.tsx` (edit form, reuse create form component)
8. Modify `/app/auth/signin/page.tsx`: Redirect logic (check if profile exists → dashboard or profile/create)
9. Test: Sign in → No profile → Redirect to profile/create → Fill form → Save → Redirect to dashboard
10. Test: Edit profile → Update weight → Next meal plan uses new weight

**Files Created/Modified**:
- `/libs/mongoose.js` (copy from Ship-Fast)
- `/models/plugins/toJSON.js` (copy from Ship-Fast)
- `/models/UserProfile.js` (new)
- `/app/api/profile/route.ts` (new)
- `/app/profile/create/page.tsx` (new)
- `/app/profile/edit/page.tsx` (new)
- `/app/auth/signin/page.tsx` (modify redirect logic)

**Dependencies**:
- Phase 1 complete (auth working)

---

### Phase 3: Meal Plan Persistence (2-3 days)

**Goal**: Generated meal plans save to MongoDB and can be retrieved

**Tasks**:
1. Create `/models/WeekPlan.js` (new schema)
2. Create `/models/DayPlan.js` (new schema)
3. Create `/models/Meal.js` (new schema)
4. Create `/models/Snack.js` (new schema, separate from Meal)
5. Create `/app/api/meal-plans/route.ts` (POST, GET endpoints)
6. Create `/app/api/meal-plans/[id]/route.ts` (GET specific plan)
7. Modify `/app/generate/page.tsx`:
   - Fetch profile from API
   - Add plan-specific inputs (goal, date)
   - POST to `/api/meal-plans` instead of `/api/generate-meal-plan`
8. Modify `/app/meal-plan/page.tsx`:
   - Accept query param `?id=xxx` or fetch latest plan
   - Fetch from `/api/meal-plans/[id]` instead of localStorage
9. Update meal edit flow to save to MongoDB
10. Test: Generate plan → Save to DB → Navigate away → Come back → Plan still there
11. Test: Generate another plan → Both plans saved → Can view either one

**Files Created/Modified**:
- `/models/WeekPlan.js` (new)
- `/models/DayPlan.js` (new)
- `/models/Meal.js` (new)
- `/models/Snack.js` (new)
- `/app/api/meal-plans/route.ts` (new)
- `/app/api/meal-plans/[id]/route.ts` (new)
- `/app/generate/page.tsx` (modify to use API)
- `/app/meal-plan/page.tsx` (modify to use API)
- `/app/api/edit-meal/route.ts` (modify to save to MongoDB)

**Dependencies**:
- Phase 2 complete (profile exists in DB)
- Feature 001/002 meal generation logic (reuse)

---

### Phase 4: Historical Access (1 day)

**Goal**: User can browse all past meal plans

**Tasks**:
1. Create `/app/history/page.tsx` (list all plans, paginated)
2. Add "View history" link to dashboard
3. Test: Generate 5 plans → View history → See all 5 → Click on oldest → Full plan loads
4. Test: Wife signs in → Her history separate from yours

**Files Created/Modified**:
- `/app/history/page.tsx` (new)
- `/app/dashboard/page.tsx` (modify: add history link)

**Dependencies**:
- Phase 3 complete (plans saved to DB)

---

## Technical Decisions Log

### Decision 1: User Profile Schema (Separate vs Embedded)

**Context**: Need to store user meal planning data. Ship-Fast User model already exists.

**Options Considered**:

**A) Extend Ship-Fast User Model Directly**
- Pros: Single query to get all user data
- Cons: Mixes auth concerns with domain data, harder to maintain Ship-Fast updates

**B) Separate UserProfile Model (1:1 with User)**
- Pros: Clean separation, Ship-Fast updates don't affect meal planning, can delete profile without deleting auth
- Cons: Requires join/populate queries (minor performance cost)

**Decision**: **Option B (Separate UserProfile)**

**Rationale**:
- Separation of concerns: Auth (User) vs Domain (UserProfile)
- Ship-Fast compatibility: Can update Ship-Fast without touching meal planning logic
- Flexibility: Can add meal-planner-specific fields without polluting User model
- Minor performance cost acceptable for MVP (<100 users)

**Migration Trigger**: N/A (building from scratch)

---

### Decision 2: Meals vs Snacks Schema (Shared vs Separate)

**Context**: Snacks and meals have similar structure but different fields (portability, timing for snacks).

**Options Considered**:

**A) Single Meal Model with Type Discriminator**
- Pros: Fewer models, simpler queries (single collection)
- Cons: Shared schema means snack-specific fields pollute meal schema, harder to evolve independently

**B) Separate Snack Model**
- Pros: Clean separation, different fields (portability, timing), easier to evolve independently
- Cons: Two collections to query (minor complexity)

**Decision**: **Option B (Separate Snack Model)**

**Rationale**:
- User specified: "Snacks might not be the same structure as standard meals"
- Flexibility: Snacks may evolve differently (e.g., add timing, portability fields)
- Clean schema: No pollution with unused fields
- Query cost negligible (always querying by dayPlanId, can populate both in single query)

**Migration Trigger**: N/A (building from scratch)

---

### Decision 3: localStorage Migration Strategy

**Context**: Existing localStorage data from Features 001-002. How to handle migration?

**Options Considered**:

**A) Auto-Import localStorage on First Sign-In**
- Pros: No data loss, seamless UX
- Cons: Complex migration logic, localStorage data may be incomplete

**B) Prompt User to Import (Manual)**
- Pros: User control, simpler implementation
- Cons: Requires manual action, may forget to import

**C) User Re-Enters (No Migration)**
- Pros: Clean start, simplest implementation, forces data validation
- Cons: Loses test data (but only 2 users, minimal impact)

**Decision**: **Option C (User Re-Enters)**

**Rationale**:
- Only 2 users (you + wife), minimal data loss
- Clean data entry with validated schemas
- Simplest implementation (0 migration code)
- Forces proper profile creation flow (better for testing)
- localStorage data is test data only (not production-critical)

**Migration Trigger**: N/A (no migration)

---

### Decision 4: Database Hosting

**Context**: Need MongoDB hosting for MVP

**Options Considered**:

**A) MongoDB Atlas Free Tier (M0)**
- Cost: $0/month
- Storage: 512MB
- Throughput: Shared (sufficient for <100 users)
- Pros: Free, easy setup, production-ready
- Cons: 512MB limit (but 10K meal plans = ~150MB, plenty for MVP)

**B) MongoDB Atlas Paid (M2)**
- Cost: ~$9/month
- Storage: 2GB
- Pros: More storage, dedicated resources
- Cons: Unnecessary for MVP (<10 users)

**Decision**: **Option A (Free Tier M0)**

**Rationale**:
- Cost: $0 for MVP validation
- Capacity: 512MB = ~10K meal plans (more than enough for 2 users)
- Scalability: Easy upgrade to M2 when needed (trigger: >100 users or >400MB storage)

**Migration Trigger**: When storage >400MB OR >100 users

---

## Dependencies

### External Libraries (Already in Ship-Fast)
- `next-auth` (v5.x) - Authentication
- `mongoose` (v8.x) - MongoDB ODM
- `mongodb` (v6.x) - Native driver (for NextAuth adapter)
- No new dependencies needed ✓

### Environment Variables
```env
# NextAuth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_ID=<from Google Cloud Console>
GOOGLE_SECRET=<from Google Cloud Console>

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Existing (keep as-is)
OPENROUTER_API_KEY=<existing>
TAVILY_API_KEY=<existing>
```

### Ship-Fast Files to Reuse
- `/libs/auth.js` - NextAuth configuration
- `/libs/mongoose.js` - MongoDB connection wrapper
- `/libs/mongo.js` - Raw MongoDB client (NextAuth adapter)
- `/models/User.js` - User schema
- `/models/plugins/toJSON.js` - Schema plugin
- `/app/api/auth/[...nextauth]/route.js` - Auth route handler

---

## Risks & Mitigation

### Risk 1: MongoDB Connection Failures

**Mitigation**:
- Implement retry logic in `connectMongo()` (Ship-Fast already has this)
- Show user-friendly error: "Database temporarily unavailable, please try again"
- Log errors to console for debugging

---

### Risk 2: Google OAuth Setup Complexity

**Mitigation**:
- Follow Ship-Fast's existing Google OAuth setup (already configured)
- Document OAuth setup steps in README
- Test OAuth flow in incognito mode to simulate new user

---

### Risk 3: Schema Evolution (Wife's Input Changes Requirements)

**Mitigation**:
- Use flexible schema fields (`trainingContext`, `healthContext`, `metadata`)
- MongoDB supports adding fields without migration
- Document schema changes in decision log

---

### Risk 4: Data Loss During Development

**Mitigation**:
- Use separate MongoDB databases for dev vs prod
- Don't test on production data
- Keep localStorage export/import functions as backup

---

## Testing Strategy

### Unit Tests (Defer to Phase 5)
- Test API routes with mocked auth and database
- Test schema validation (Mongoose validators)

### Integration Tests (Manual for MVP)
**Critical Paths**:
1. **Auth Flow**: Sign in → Create profile → Sign out → Sign in → Profile persists
2. **Profile CRUD**: Create → Edit weight → Verify new weight in next plan
3. **Meal Plan Generation**: Generate → Save → Navigate away → Come back → Plan still there
4. **Multi-User**: You sign in → Generate plan → Wife signs in → Her plans separate
5. **History**: Generate 5 plans → View history → Click on 3rd plan → Correct plan loads
6. **Cross-Device**: Generate plan on laptop → Sign in on phone → Same plan visible

### Manual Testing Checklist
- [ ] Google OAuth sign-in works
- [ ] Session persists across browser restarts
- [ ] Profile creation form validation works
- [ ] Profile edit updates persist
- [ ] Meal plan generation saves to DB
- [ ] Meal plan retrieval works (by ID, latest, history)
- [ ] Meal edit saves to DB (not localStorage)
- [ ] History pagination works
- [ ] Multi-user isolation (your plans ≠ wife's plans)
- [ ] Sign out clears session, redirects to sign-in

---

## Verification

### How to Test End-to-End

1. **Start dev server**: `npm run dev`
2. **Ensure MongoDB running**: Check Atlas cluster status
3. **Sign in**: Click "Sign in with Google" → Complete OAuth → Land on profile/create
4. **Create profile**:
   - Fill biometrics: 75kg, 180cm, 30yo, male
   - Restrictions: Gluten-free
   - Preferences: mushrooms, cilantro
   - Cuisines: Italian, Japanese
   - Save → Redirect to dashboard
5. **Generate meal plan**:
   - Goal: Muscle building
   - Generate → Plan saves to MongoDB → Display plan
6. **Verify persistence**:
   - Close browser → Reopen → Still signed in
   - Navigate to `/meal-plan` → Plan still there (not from localStorage)
7. **Generate 2nd plan**:
   - Go to dashboard → Generate another plan
   - View history → See both plans
8. **Multi-user test**:
   - Sign out → Wife signs in with her Google → Create her profile
   - Generate her plan → View her history → Only her plans visible (not yours)
9. **Cross-device test**:
   - Generate plan on laptop
   - Open phone browser → Sign in → Same plan visible
10. **Check database**:
    - MongoDB Atlas → Browse collections
    - Verify: users, userProfiles, weekPlans, dayPlans, meals, snacks collections exist
    - Verify: 2 users, 2 profiles, 3 weekPlans (yours + wife's)

---

## Timeline Estimate

| Phase | Tasks | Days | Dependencies |
|-------|-------|------|--------------|
| **P1: Auth** | NextAuth + Google OAuth + Session | 2-3 | Google OAuth setup, Ship-Fast patterns |
| **P2: Profile** | UserProfile model + CRUD + Forms | 2-3 | P1 complete |
| **P3: Meal Plans** | WeekPlan/DayPlan/Meal/Snack models + API + UI updates | 2-3 | P2 complete |
| **P4: History** | History page + pagination | 1 | P3 complete |
| **Total** | | **7-10 days** | |

**Buffer**: +2 days for unexpected issues (OAuth debugging, schema adjustments)

**Estimated Completion**: 7-10 working days (1.5-2 weeks)

---

## Next Steps After This Feature

**Immediate (Feature 004)**:
- 7-Day Meal Plan Generation (extend from 1 day to 7 days)
- Uses this feature's persistence layer ✓

**Future (Feature 005)**:
- Feedback Infrastructure (link feedback to meals via `mealId`)
- Uses this feature's meal persistence ✓

**Future (Feature 006)**:
- Personalization Deep Dive (use historical data + wife's expert insights)
- Uses this feature's profile extensibility (`trainingContext`, `healthContext`) ✓

---

**Plan Complete - Ready for Task Breakdown**

Next step: `/vibecode:tasks` to break this plan into ordered, actionable tasks (T001-T0XX)
