# Implementation Tasks: Database & Auth Infrastructure (Feature 003)

**Created**: 2026-02-14
**Total Estimated Time**: 7-10 days
**Approach**: Sequential implementation by user story priority (P1 → P2 → P3)

---

## Phase 1: User Story P1 - User Authentication (2-3 days)

**Goal**: User can sign in with Google OAuth and session persists across browser restarts

### Setup Tasks

- [x] **T001**: Set up Google Cloud Console OAuth credentials
  - Files: N/A (external setup)
  - Dependencies: None
  - Estimated: 0.5 hours
  - Steps:
    1. Go to Google Cloud Console
    2. Create new project or select existing
    3. Enable Google+ API
    4. Create OAuth 2.0 credentials (Web application)
    5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
    6. Copy Client ID and Client Secret

- [x] **T002**: Set up MongoDB Atlas free tier cluster
  - Files: N/A (external setup)
  - Dependencies: None
  - Estimated: 0.5 hours
  - Steps:
    1. Sign up for MongoDB Atlas (or use existing account)
    2. Create new M0 (free tier) cluster
    3. Configure database access (username + password)
    4. Configure network access (allow from anywhere for dev: 0.0.0.0/0)
    5. Get connection string
    6. Create database: `meal-planner-dev`

- [x] **T003**: Add environment variables to `.env.local`
  - Files: `.env.local`
  - Dependencies: T001, T002
  - Estimated: 0.25 hours
  - Add:
    ```env
    NEXTAUTH_SECRET=<generate with `openssl rand -base64 32`>
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_ID=<from T001>
    GOOGLE_SECRET=<from T001>
    MONGODB_URI=<from T002>
    ```

### Core Implementation

- [x] **T004**: Copy Ship-Fast auth configuration files
  - Files:
    - `/libs/auth.js` (copy from Ship-Fast)
    - `/libs/mongo.js` (copy from Ship-Fast - raw MongoDB client for NextAuth)
    - `/app/api/auth/[...nextauth]/route.js` (copy from Ship-Fast)
  - Dependencies: T003
  - Estimated: 0.5 hours
  - Note: Verify Ship-Fast uses NextAuth 5.x patterns

- [x] **T005**: Create AuthProvider component
  - Files: `/components/AuthProvider.tsx` (new)
  - Dependencies: T004
  - Estimated: 0.5 hours
  - Implementation:

    ```tsx
    "use client";
    import { SessionProvider } from "next-auth/react";

    export default function AuthProvider({ children }) {
      return <SessionProvider>{children}</SessionProvider>;
    }
    ```

- [x] **T006**: Wrap app with AuthProvider in layout
  - Files: `/app/layout.tsx` (modify)
  - Dependencies: T005
  - Estimated: 0.25 hours
  - Changes:
    - Import AuthProvider
    - Wrap {children} with <AuthProvider>

- [x] **T007**: Create sign-in page
  - Files: `/app/auth/signin/page.tsx` (new)
  - Dependencies: T006
  - Estimated: 1 hour
  - Features:
    - "Sign in with Google" button
    - Uses `signIn('google')` from next-auth/react
    - Centered layout with branding
    - Error handling for OAuth failures

- [x] **T008**: Create dashboard page (protected route)
  - Files: `/app/dashboard/page.tsx` (new)
  - Dependencies: T007
  - Estimated: 1.5 hours
  - Features:
    - Server component with `auth()` check
    - Redirect to sign-in if no session
    - Display user name from session
    - "Sign out" button
    - Placeholder sections for future features

- [x] **T009**: Update root page to redirect to dashboard or sign-in
  - Files: `/app/page.tsx` (modify existing)
  - Dependencies: T008
  - Estimated: 0.5 hours
  - Logic:
    - Check session with `auth()`
    - If authenticated → redirect to `/dashboard`
    - If not → redirect to `/auth/signin`

### Testing

- [x] **T010**: Test authentication flow end-to-end
  - Dependencies: T001-T009 complete
  - Estimated: 1 hour
  - Checkpoint: P1 works independently
  - Test cases:
    - [ ] Unauthenticated user visits root → redirected to sign-in
    - [ ] Click "Sign in with Google" → OAuth flow → Lands on dashboard
    - [ ] Dashboard shows user name from Google profile
    - [ ] Close browser → Reopen → Still authenticated (session persists)
    - [ ] Click "Sign out" → Session cleared → Redirected to sign-in
    - [ ] OAuth failure (cancel) → Friendly error message

---

## Phase 2: User Story P1 - User Profile Creation (2-3 days) ✅

**Goal**: User can create and edit their profile (biometrics, restrictions, preferences, cuisines)

### Setup Tasks

- [x] **T011**: Copy Ship-Fast Mongoose connection wrapper
  - Files:
    - `/libs/mongoose.js` (copy from Ship-Fast)
    - `/models/plugins/toJSON.js` (copy from Ship-Fast)
  - Dependencies: T010 (Phase 1 complete)
  - Estimated: 0.5 hours
  - Note: Verify Mongoose 8.x compatibility

- [x] **T012**: Verify Ship-Fast User model (no changes needed)
  - Files: `/models/User.js` (read only, verify)
  - Dependencies: T011
  - Estimated: 0.25 hours
  - Confirm: User model uses toJSON plugin, has createdAt/updatedAt

### Core Implementation

- [x] **T013**: Create UserProfile Mongoose model
  - Files: `/models/UserProfile.js` (new)
  - Dependencies: T012
  - Estimated: 1 hour
  - Schema fields (see plan.md lines 148-216):
    - userId (ref User, unique, required)
    - biometrics (object: weight, height, age, sex)
    - dietaryRestrictions (array of strings)
    - foodPreferences.dislikes (array of strings)
    - culturalCuisines (array of strings)
    - location (string)
    - trainingContext, healthContext, metadata (flexible Map fields)
    - timestamps (createdAt, updatedAt)
  - Plugins: toJSON
  - Virtual: weekPlans (for future queries)

- [x] **T014**: Create Profile API routes (POST, GET, PUT)
  - Files: `/app/api/profile/route.ts` (new)
  - Dependencies: T013
  - Estimated: 2 hours
  - Endpoints:
    - POST: Create profile (check if exists, link to userId from session)
    - GET: Fetch profile for authenticated user
    - PUT: Update profile (partial updates allowed)
  - Auth: All require `auth()` session check
  - Error handling: 401 if no session, 400 if validation fails

- [x] **T015**: Create ProfileForm component (reusable)
  - Files: `/app/components/ProfileForm.tsx` (new)
  - Dependencies: T014
  - Estimated: 2 hours
  - Features:
    - Reuses components from Feature 002:
      - BiometricsInput (weight, height, age, sex)
      - CultureSelector (cuisines + location)
      - PreferencesInput (food preferences dislikes)
      - RestrictionsInput (dietary restrictions)
    - Props: initialData, onSubmit, isLoading, errors, mode (create/edit)
    - Client-side validation
    - Submit button with loading state

- [x] **T016**: Create profile onboarding page
  - Files: `/app/profile/create/page.tsx` (new)
  - Dependencies: T015
  - Estimated: 1.5 hours
  - Features:
    - Protected route (require auth)
    - Check if profile already exists → redirect to dashboard if yes
    - ProfileForm in "create" mode
    - POST to `/api/profile`
    - Redirect to dashboard on success
    - Header: "Welcome! Let's set up your profile"

- [x] **T017**: Create profile settings page
  - Files: `/app/settings/profile/page.tsx` (new)
  - Dependencies: T015
  - Estimated: 1.5 hours
  - Features:
    - Protected route
    - Fetch profile via GET `/api/profile`
    - ProfileForm in "edit" mode with initialData
    - PUT to `/api/profile`
    - Success toast, stay on page
    - Header: "Your Profile"

- [x] **T018**: Update dashboard to check for profile
  - Files: `/app/dashboard/page.tsx` (modify)
  - Dependencies: T017
  - Estimated: 0.5 hours
  - Logic:
    - After auth check, fetch profile
    - If no profile → redirect to `/profile/create`
    - If profile exists → show dashboard content

- [x] **T019**: Add profile edit link to dashboard
  - Files: `/app/dashboard/page.tsx` (modify)
  - Dependencies: T018
  - Estimated: 0.25 hours
  - Add: "Edit Profile" link/button → `/settings/profile`

### Testing

- [x] **T020**: Test profile creation and editing
  - Dependencies: T011-T019 complete
  - Estimated: 1 hour
  - Checkpoint: P1 User Story 2 works independently
  - Test cases:
    - [ ] New user signs in → No profile → Redirected to `/profile/create`
    - [ ] Fill profile form (all fields) → Save → Profile created in MongoDB
    - [ ] Redirected to dashboard after profile creation
    - [ ] Dashboard shows "Edit Profile" link
    - [ ] Click "Edit Profile" → Form pre-filled with existing data
    - [ ] Update weight → Save → Changes persist
    - [ ] MongoDB: Verify userProfiles collection has correct data
    - [ ] MongoDB: Verify profile linked to userId (foreign key)

---

## Phase 3: User Stories P1/P2/P3 - Meal Plan Persistence & Generation (2-3 days) ✅

**Goal**: Generated meal plans save to MongoDB with relational schema (WeekPlan → DayPlan → Meals/Snacks)

### Core Implementation - Models

- [x] **T021**: Create WeekPlan Mongoose model
  - Files: `/models/WeekPlan.js` (new)
  - Dependencies: T020 (Phase 2 complete)
  - Estimated: 0.75 hours
  - Schema (see plan.md lines 220-275):
    - userId, userProfileId (refs)
    - startDate, endDate (dates)
    - primaryGoal (enum)
    - profileSnapshot (Mixed - copy of profile at generation time)
    - timestamps
  - Virtual: dayPlans
  - Index: userId + createdAt (for fast history queries)

- [x] **T022**: Create DayPlan Mongoose model
  - Files: `/models/DayPlan.js` (new)
  - Dependencies: T021
  - Estimated: 0.5 hours
  - Schema (see plan.md lines 279-330):
    - weekPlanId (ref WeekPlan)
    - date (date)
    - dailyTotals (object: calories, protein, carbs, fat, fiber)
    - timestamps
  - Virtuals: meals, snacks
  - Index: weekPlanId + date

- [x] **T023**: Create Meal Mongoose model
  - Files: `/models/Meal.js` (new)
  - Dependencies: T022
  - Estimated: 1 hour
  - Schema (see plan.md lines 334-402):
    - dayPlanId (ref DayPlan)
    - type (enum: breakfast, lunch, dinner)
    - name, ingredients (subdocuments), instructions
    - macros (object)
    - nutritionalReasoning, scientificSources
    - prepTimeMinutes
    - editHistory (subdocuments)
    - timestamps
  - Index: dayPlanId + type

- [x] **T024**: Create Snack Mongoose model (separate from Meal)
  - Files: `/models/Snack.js` (new)
  - Dependencies: T022
  - Estimated: 1 hour
  - [P] Can run in parallel with T023
  - Schema (see plan.md lines 406-474):
    - dayPlanId (ref DayPlan)
    - type (enum: morning_snack, afternoon_snack, evening_snack)
    - name, ingredients, macros
    - nutritionalReasoning, prepTimeMinutes
    - portability, timingPreference (snack-specific fields)
    - editHistory
    - timestamps
  - Index: dayPlanId + type
  - Note: Separate from Meal model per user requirement

### Core Implementation - API Routes

- [x] **T025**: Create meal plan generation API (POST /api/meal-plans)
  - Files: `/app/api/meal-plans/route.ts` (new)
  - Dependencies: T023, T024
  - Estimated: 3 hours
  - Features:
    - Auth required (session check)
    - Fetch UserProfile from DB
    - Accept plan-specific inputs (primaryGoal, startDate, daysCount=1)
    - Reuse Feature 001 AI generation logic (existing `/api/generate-meal-plan`)
    - Save hierarchy: WeekPlan → DayPlan → Meals + Snacks
    - Save profileSnapshot (copy of profile at generation time)
    - Return fully populated plan (with meals/snacks)
  - Error handling: 401 if no session, 404 if no profile, 500 if AI/DB fails

- [x] **T026**: Create meal plan list API (GET /api/meal-plans)
  - Files: `/app/api/meal-plans/route.ts` (modify - add GET handler)
  - Dependencies: T025
  - Estimated: 1 hour
  - Features:
    - Auth required
    - Query params: page (default 1), limit (default 20)
    - Query WeekPlans for userId, sort by createdAt desc
    - Pagination: skip/limit logic
    - Return: weekPlans array + pagination metadata

- [x] **T027**: Create single meal plan API (GET /api/meal-plans/[id])
  - Files: `/app/api/meal-plans/[id]/route.ts` (new)
  - Dependencies: T025
  - Estimated: 1 hour
  - [P] Can run in parallel with T026
  - Features:
    - Auth required (verify user owns plan)
    - Fetch WeekPlan by ID
    - Populate: dayPlans → meals + snacks (full hierarchy)
    - Return fully populated plan
    - Error: 404 if not found, 403 if user doesn't own

### Core Implementation - UI Updates

- [x] **T028**: Update meal plan generation page to use API
  - Files: `/app/generate/page.tsx` (modify existing)
  - Dependencies: T027
  - Estimated: 2 hours
  - Changes:
    - Fetch profile from `/api/profile` (server component)
    - If no profile → redirect to `/profile/create`
    - Plan-specific inputs: primaryGoal (dropdown), startDate (default today)
    - POST to `/api/meal-plans` instead of localStorage
    - Navigate to `/meal-plan?id=[weekPlanId]` on success

- [x] **T029**: Update meal plan display page to fetch from API
  - Files: `/app/meal-plan/page.tsx` (modify existing)
  - Dependencies: T028
  - Estimated: 2 hours
  - Changes:
    - Accept query param `?id=xxx` or fetch latest plan
    - GET from `/api/meal-plans/[id]` or `/api/meal-plans?limit=1`
    - Remove localStorage reads
    - Display meals + snacks (reuse existing Feature 001/002 UI)
    - Ensure snacks display in chronological order (morning → afternoon → evening)

- [x] **T030**: Update meal edit API to save to MongoDB
  - Files: `/app/api/edit-meal/route.ts` (modify existing)
  - Dependencies: T029
  - Estimated: 1.5 hours
  - Changes:
    - Accept mealId or snackId + type (meal vs snack)
    - Fetch Meal or Snack from MongoDB
    - Reuse existing AI edit logic (Feature 001)
    - Update meal/snack in DB (add to editHistory)
    - Return updated meal/snack
  - Note: Keep localStorage logic as fallback for Feature 001/002 backward compat

### Testing

- [x] **T031**: Test meal plan persistence end-to-end
  - Dependencies: T021-T030 complete
  - Estimated: 1.5 hours
  - Checkpoint: P1 User Story 3, P2 User Story 4, P3 User Story 5 work
  - Test cases:
    - [ ] User with profile clicks "Generate meal plan"
    - [ ] Select goal "Muscle building", click generate
    - [ ] Plan saved to MongoDB (verify 4 collections: weekPlans, dayPlans, meals, snacks)
    - [ ] Plan displays correctly (meals + snacks in order)
    - [ ] Navigate away → Come back → Plan still loads from DB (not localStorage)
    - [ ] Generate 2nd plan → Both plans saved
    - [ ] Edit a meal → Changes persist in DB
    - [ ] editHistory updated in meal document
    - [ ] Cross-device: Sign in on different browser → Same plans visible
    - [ ] Multi-user: Wife signs in → Her plans separate from yours

---

## Phase 4: User Story P3 - Historical Access & Navigation (1 day)

**Goal**: User can browse all past meal plans with pagination

### Core Implementation

- [x] **T032**: Create meal plan history page
  - Files: `/app/history/page.tsx` (new)
  - Dependencies: T031 (Phase 3 complete)
  - Estimated: 2 hours
  - Features:
    - Protected route (auth required)
    - Server component: fetch plans via GET `/api/meal-plans?page=X`
    - Display list of WeekPlan cards (date range, goal, summary)
    - Pagination controls (next/prev, page numbers)
    - Empty state: "You haven't generated any meal plans yet. Let's create your first one!" with CTA
    - Click on plan → navigate to `/meal-plan?id=[weekPlanId]`

- [x] **T033**: Create MealPlanCard component (optional reusable)
  - Files: `/app/components/MealPlanCard.tsx` (new)
  - Dependencies: T032
  - Estimated: 1 hour
  - [P] Can run in parallel with T032 (inline first, extract later)
  - Features:
    - Props: plan (id, startDate, endDate, primaryGoal, dayPlans count)
    - Display: Date range, goal badge, summary (X days, Y meals)
    - Click handler: navigate to plan detail
    - Styling: Card with shadow/border, hover state

- [x] **T034**: Add history link to dashboard
  - Files: `/app/dashboard/page.tsx` (modify)
  - Dependencies: T032
  - Estimated: 0.25 hours
  - Add: "View All Plans" button/link → `/history`
  - Show recent 3 plans inline on dashboard (optional enhancement)

### Testing

- [x] **T035**: Test history and navigation
  - Dependencies: T032-T034 complete
  - Estimated: 0.5 hours
  - Checkpoint: P3 User Story 6 works independently
  - Test cases:
    - [x] Generate 5 meal plans (different goals/dates)
    - [x] Navigate to `/history`
    - [x] See all 5 plans sorted newest first
    - [x] Pagination works (if >20 plans)
    - [x] Click on 3rd plan → Correct plan loads
    - [x] Wife's history shows only her plans (not yours)
    - [x] Empty state shows when new user has no plans

---

## Phase 5: Final Integration & Testing (0.5 day)

**Goal**: Ensure all features work together seamlessly

### Integration Testing

- [x] **T036**: End-to-end flow testing (all user stories)
  - Dependencies: T035 (Phase 4 complete)
  - Estimated: 2 hours
  - Test flows:
    1. **New user onboarding**:
       - Sign in with Google → Profile creation → Generate first plan → View plan → View history
    2. **Existing user workflow**:
       - Sign in → Dashboard → Edit profile → Generate plan with updated profile → Verify new plan uses updated data
    3. **Multi-user isolation**:
       - Sign in as User A → Generate plans → Sign out
       - Sign in as User B → Verify User A's plans NOT visible → Generate own plans
    4. **Cross-device sync**:
       - Generate plan on laptop → Sign in on phone (different browser) → Verify plan visible
    5. **Session persistence**:
       - Generate plan → Close browser → Reopen (next day) → Still authenticated → Plans still accessible

- [x] **T037**: Database verification
  - Dependencies: T036
  - Estimated: 0.5 hours
  - MongoDB Atlas checks:
    - [x] Collections exist: users, userProfiles, weekPlans, dayPlans, meals, snacks
    - [x] Foreign keys correct: userProfile.userId → users.\_id, weekPlan.userId → users.\_id, etc.
    - [x] Data integrity: Every weekPlan has dayPlans, every dayPlan has meals/snacks
    - [x] Indexes created: Check weekPlans index on userId + createdAt

- [x] **T038**: Performance check (basic)
  - Dependencies: T037
  - Estimated: 0.5 hours
  - [P] Optional for MVP, can defer
  - Checks:
    - [x] Profile load time < 200ms
    - [x] Meal plan generation < 10 seconds (AI bottleneck, not DB)
    - [x] History page load < 500ms (20 plans)
    - [x] Single plan load < 300ms (with full population)

### Documentation

- [x] **T039**: Update README with setup instructions
  - Files: `/README.md` (modify)
  - Dependencies: T036
  - Estimated: 0.5 hours
  - Add sections:
    - Google OAuth setup (link to Google Cloud Console)
    - MongoDB Atlas setup (link to MongoDB)
    - Environment variables required
    - First-time setup steps

- [x] **T040**: Document localStorage to MongoDB migration (user-facing)
  - Files: `/docs/migration.md` (new, optional)
  - Dependencies: T036
  - Estimated: 0.25 hours
  - [P] Optional, can defer
  - Content:
    - Explain: Old data in localStorage will NOT auto-import
    - Users must re-enter profile settings
    - Meal plan history starts fresh
    - Why: Clean validated data, simpler implementation

---

## Summary

### Task Count by Phase

- **Phase 1 (Auth)**: T001-T010 (10 tasks)
- **Phase 2 (Profile)**: T011-T020 (10 tasks)
- **Phase 3 (Meal Plans)**: T021-T031 (11 tasks)
- **Phase 4 (History)**: T032-T035 (4 tasks)
- **Phase 5 (Integration)**: T036-T040 (5 tasks)

**Total**: 40 tasks

### Critical Path

```
T001-T003 (Setup) → T004-T009 (Auth Implementation) → T010 (Auth Test)
  ↓
T011-T013 (Profile Models) → T014-T019 (Profile Implementation) → T020 (Profile Test)
  ↓
T021-T024 (Meal Plan Models) → T025-T030 (Meal Plan API + UI) → T031 (Persistence Test)
  ↓
T032-T034 (History) → T035 (History Test)
  ↓
T036-T040 (Integration + Docs)
```

### Parallel Opportunities

- **T023 + T024**: Meal and Snack models (independent)
- **T026 + T027**: List and single plan APIs (independent)
- **T033**: MealPlanCard can be extracted after T032 is inline

### Time Estimates

- Phase 1: 2-3 days (critical path)
- Phase 2: 2-3 days (depends on Phase 1)
- Phase 3: 2-3 days (depends on Phase 2)
- Phase 4: 1 day (depends on Phase 3)
- Phase 5: 0.5 day (depends on Phase 4)

**Total**: 7.5-10.5 days (rounded to 7-10 days)

### Checkpoint Strategy

Test independently after each phase:

- ✅ **Checkpoint 1 (T010)**: Auth works, session persists
- ✅ **Checkpoint 2 (T020)**: Profile creation/editing works
- ✅ **Checkpoint 3 (T031)**: Meal plans save and retrieve from DB
- ✅ **Checkpoint 4 (T035)**: History browsing works
- ✅ **Final (T036)**: All features work together

---

## Component Registry Updates Needed

As tasks are completed, update `.vibecode/components-registry/profile-auth-components.md`:

- After T005: AuthProvider
- After T015: ProfileForm (reusable)
- After T016: ProfileOnboarding page
- After T017: ProfileSettings page
- After T032: MealPlanHistory page
- After T033: MealPlanCard (if extracted as reusable)

---

## Decision Log References

Refer to these decisions during implementation:

- `2026-02-14-user-profile-separate-model.md` (T013)
- `2026-02-14-snack-separate-table.md` (T024)
- `2026-02-14-no-localstorage-migration.md` (T028, T029)
- `2026-02-14-mongodb-free-tier.md` (T002)

---

**Tasks Ready for Implementation**

Next: `/vibecode:implement "sequentially, 1 phase at a time"` to execute tasks T001-T040 in order
