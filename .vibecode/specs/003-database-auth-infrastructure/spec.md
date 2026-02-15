# Feature Specification: Database & Auth Infrastructure

**Feature ID**: `003-database-auth-infrastructure`
**Feature Branch**: `003-database-auth-infrastructure`
**Created**: 2026-02-14
**Status**: Draft

---

## Core Job

**Enable users to create accounts, authenticate, and persist their meal planning data (profile + meal plans) in a database with unlimited history and cross-device access.**

**Why this matters**: Currently, localStorage stores all data (volatile, device-locked, max 5 plans). This blocks:
- Multi-user testing (you + wife need separate accounts)
- Historical analysis (can't track meal plan improvements over time)
- 7-day meal plans (localStorage too fragile for larger data)
- Feedback infrastructure (needs persistent meal data to link to)

---

## User Scenarios & Testing (PRIORITIZED)

### User Story 1 - User Authentication (Priority: P1)

**User can create account and sign in with Google OAuth to access the app.**

**Why this priority**: Foundation for everything else. Without auth, no multi-user support or data persistence.

**Independent Test**:
1. User clicks "Sign in with Google"
2. Completes OAuth flow
3. Lands on dashboard with session
4. Closes browser, returns later
5. Still authenticated (session persists)

**Acceptance Scenarios**:

1. **Given** user has no account, **When** user visits app, **Then** redirected to sign-in page with "Sign in with Google" button

2. **Given** user clicks "Sign in with Google", **When** OAuth completes successfully, **Then** user account created in DB and session established

3. **Given** user is authenticated, **When** user closes and reopens browser, **Then** session still valid (no re-auth required)

4. **Given** user signs out, **When** user visits app again, **Then** redirected to sign-in page

5. **Given** OAuth fails (network error, user cancels), **When** error occurs, **Then** user sees friendly error message with retry option

---

### User Story 2 - User Profile Creation (Priority: P1)

**User can create their profile with biometrics, dietary restrictions, food preferences, and cuisine preferences (one-time setup).**

**Why this priority**: Core user data that persists across all meal plans. Without this, can't generate personalized plans.

**Independent Test**:
1. New user signs in → redirected to profile setup
2. Fills biometrics, restrictions, preferences, cuisines
3. Saves profile → stored in DB
4. Generates meal plan → uses profile data
5. Updates profile later → next plan uses new data

**Acceptance Scenarios**:

1. **Given** new user signs in, **When** no profile exists, **Then** redirected to `/profile/create` with onboarding form

2. **Given** user fills profile form, **When** user saves, **Then** profile stored in DB linked to user_id and user redirected to dashboard

3. **Given** user has profile, **When** user visits `/settings`, **Then** can edit profile and changes persist

4. **Given** user updates profile (e.g., changes weight), **When** user generates new meal plan, **Then** new plan uses updated profile data

5. **Given** user has existing meal plans, **When** user updates profile, **Then** old plans unchanged (historical accuracy)

**Profile Fields (User-Level, Persistent)**:
- Biometrics: weight (kg), height (cm), age, sex
- Dietary restrictions: allergies, strict dietary requirements (gluten-free, vegan, etc.)
- Food preferences: dislikes (foods to avoid when possible)
- Cultural cuisines: preferred cuisines (Italian, Japanese, etc.)
- Location: user's general location (for seasonal ingredients)
- **Flexible fields**: `training_context?: {[key: string]: any}`, `health_context?: {[key: string]: any}`, `metadata?: {[key: string]: any}` (for future expansion)

---

### User Story 3 - Meal Plan Persistence (Priority: P1)

**Generated meal plans are saved to database with full history (unlimited), accessible anytime.**

**Why this priority**: Core value - without persistent meal plans, can't track progress or test improvements over time.

**Independent Test**:
1. User generates meal plan (1 day for now)
2. Plan saved to DB: week → day → meals
3. User navigates away, comes back
4. Plan still accessible from history
5. User generates another plan
6. Both plans in history

**Acceptance Scenarios**:

1. **Given** user generates meal plan, **When** plan generation completes, **Then** plan saved to DB with structure: `WeekPlan` → `DayPlan` → `Meals` (foreign keys)

2. **Given** plan is saved, **When** user navigates to `/history`, **Then** sees all past plans sorted by date (newest first)

3. **Given** user has multiple plans, **When** user clicks on a plan in history, **Then** full plan loads (all meals, macros, instructions)

4. **Given** user edits a meal in saved plan, **When** edit completes, **Then** updated meal persists in DB and old version goes to edit_history

5. **Given** user accesses app from different device, **When** user signs in, **Then** sees all their plans (cross-device sync)

---

### User Story 4 - Meal Plan Generation with Profile (Priority: P2)

**User can generate meal plans using their saved profile + plan-specific inputs (goal, date range).**

**Why this priority**: Enhances P1-P3. Once profile and persistence work, this connects them for actual meal generation.

**Independent Test**:
1. User has profile saved
2. User clicks "Generate meal plan"
3. Fills plan-specific inputs (goal: "muscle building", date: "2026-02-17")
4. Plan generated using profile data + plan inputs
5. Plan saved to DB and displayed

**Acceptance Scenarios**:

1. **Given** user has profile, **When** user clicks "Generate meal plan", **Then** sees plan generation form with plan-specific inputs only (not biometrics/restrictions - those are in profile)

2. **Given** user fills plan inputs, **When** user submits, **Then** API fetches user profile from DB, combines with plan inputs, generates plan via AI, saves to DB

3. **Given** plan generation succeeds, **When** plan is saved, **Then** plan linked to user_id and includes reference to profile data used

4. **Given** plan generation fails (AI error, network), **When** error occurs, **Then** user sees error message, plan NOT saved to DB, user can retry

**Plan-Specific Inputs** (varies per generation):
- Primary goal: muscle building, weight loss, gut health, mental performance, general health
- Date range: start date (defaults to today for MVP)
- *(Future: training days, specific calorie target, etc. - defer to wife's input)*

---

### User Story 5 - Snacks as Separate Entities (Priority: P3)

**Snacks are stored in separate table with different structure from standard meals.**

**Why this priority**: Data modeling for future flexibility. Snacks may have different fields (timing, quick prep, portability).

**Independent Test**:
1. User generates meal plan with snacks
2. Snacks saved to `snacks` table (not `meals` table)
3. Snacks still display correctly in UI
4. User can add standalone snack
5. Snack saved to `snacks` table

**Acceptance Scenarios**:

1. **Given** meal plan includes snacks, **When** plan is saved, **Then** standard meals go to `meals` table, snacks go to `snacks` table

2. **Given** snack is stored separately, **When** user views plan, **Then** snacks still appear in correct chronological order with meals

3. **Given** user adds standalone snack, **When** snack is saved, **Then** goes to `snacks` table with `day_plan_id` foreign key

4. **Given** snacks have different fields (e.g., `portability: boolean`), **When** snack schema evolves, **Then** doesn't impact `meals` table

---

### User Story 6 - Historical Access & Navigation (Priority: P3)

**User can browse past meal plans, view details, and compare plans over time.**

**Why this priority**: Utility feature that enhances core value but P1-P5 can work without it.

**Independent Test**:
1. User has 5+ meal plans in history
2. User navigates to `/history`
3. Sees list of plans (date, goal, thumbnail)
4. Clicks on a plan from 2 weeks ago
5. Full plan loads with all meals
6. User can compare with current week's plan

**Acceptance Scenarios**:

1. **Given** user has meal plan history, **When** user visits `/history`, **Then** sees paginated list of plans (20 per page, newest first)

2. **Given** user clicks on a plan, **When** plan loads, **Then** displays full plan (all days, all meals, macros, date generated, goal used)

3. **Given** user views old plan, **When** user clicks "Generate similar plan", **Then** pre-fills plan generation form with same goal/inputs

4. **Given** user has no plans yet, **When** user visits `/history`, **Then** sees empty state: "You haven't generated any meal plans yet. Let's create your first one!"

---

## Edge Cases

### Multi-Device Access
- **Scenario**: User starts on laptop, generates plan, logs in on phone
- **Expected**: Phone shows same plan (real-time sync via DB query)

### Concurrent Sessions
- **Scenario**: User logged in on laptop and phone, edits plan on laptop
- **Expected**: Phone sees updated plan after refresh (eventual consistency OK for MVP)

### Profile Without Plans
- **Scenario**: User creates profile, never generates plan
- **Expected**: Dashboard shows empty state: "Ready to generate your first meal plan!"

### Plans Without Profile (Should Never Happen)
- **Scenario**: Edge case - DB corruption or manual deletion
- **Expected**: If profile missing, show error: "Profile data missing. Please recreate your profile."

### Session Expiration
- **Scenario**: User's session expires while browsing app
- **Expected**: Redirect to sign-in, preserve redirect URL, after re-auth return to intended page

### Deleted Account
- **Scenario**: User deletes account
- **Expected**: All data (profile + plans) cascade-deleted from DB (GDPR compliance)

---

## Requirements

### Functional Requirements

**Authentication:**
- **FR-001**: System MUST provide Google OAuth sign-in via NextAuth (reuse Ship-Fast configuration)
- **FR-002**: System MUST create user account in DB on first successful OAuth
- **FR-003**: System MUST maintain user session across browser restarts (NextAuth session persistence)
- **FR-004**: System MUST provide sign-out functionality that clears session

**User Profile:**
- **FR-005**: System MUST store user profile in DB with fields: biometrics, dietary_restrictions, food_preferences, cuisines, location
- **FR-006**: System MUST provide profile creation form for new users (onboarding)
- **FR-007**: System MUST provide profile edit form for existing users
- **FR-008**: System MUST include flexible schema fields (`training_context`, `health_context`, `metadata`) for future expansion

**Meal Plan Persistence:**
- **FR-009**: System MUST store meal plans in relational schema: `week_plans` → `day_plans` → `meals` and `snacks` (foreign keys)
- **FR-010**: System MUST link each plan to `user_id` (foreign key to users table)
- **FR-011**: System MUST store unlimited meal plan history (no 5-plan limit like localStorage)
- **FR-012**: System MUST store meal edit history for each meal (track refinements)

**Meal Plan Generation:**
- **FR-013**: System MUST fetch user profile from DB when generating meal plan
- **FR-014**: System MUST accept plan-specific inputs (goal, date) separate from profile
- **FR-015**: System MUST save generated plan to DB with link to user_id and profile snapshot

**Historical Access:**
- **FR-016**: System MUST provide `/history` page to list all user's past plans
- **FR-017**: System MUST allow user to view full details of any past plan
- **FR-018**: System MUST display plans in reverse chronological order (newest first)

---

### Key Entities

#### **User** (from Ship-Fast, extended)
- `id`: UUID (primary key)
- `email`: string
- `name`: string (from OAuth)
- `image`: string (profile pic from OAuth)
- `created_at`: timestamp
- `updated_at`: timestamp
- **Relationships**: `1:1 UserProfile`, `1:N WeekPlans`

#### **UserProfile** (new)
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key → users.id)
- `biometrics`: JSON
  - `weight`: number (kg)
  - `height`: number (cm)
  - `age`: number
  - `sex`: 'male' | 'female'
- `dietary_restrictions`: string[] (allergies, strict requirements)
- `food_preferences`: JSON
  - `dislikes`: string[] (foods to avoid when possible)
- `cultural_cuisines`: string[] (preferred cuisines)
- `location`: string
- `training_context`: JSON (flexible for future)
- `health_context`: JSON (flexible for future)
- `metadata`: JSON (catch-all)
- `created_at`: timestamp
- `updated_at`: timestamp
- **Relationships**: `N:1 User`

#### **WeekPlan** (new)
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key → users.id)
- `start_date`: date (YYYY-MM-DD, start of week)
- `end_date`: date (YYYY-MM-DD, end of week)
- `primary_goal`: string ('muscle_building' | 'weight_loss' | etc.)
- `profile_snapshot`: JSON (copy of profile at generation time, for historical accuracy)
- `created_at`: timestamp
- **Relationships**: `N:1 User`, `1:N DayPlans`

#### **DayPlan** (new)
- `id`: UUID (primary key)
- `week_plan_id`: UUID (foreign key → week_plans.id)
- `date`: date (YYYY-MM-DD)
- `daily_totals`: JSON (calories, protein, carbs, fat, fiber)
- `created_at`: timestamp
- **Relationships**: `N:1 WeekPlan`, `1:N Meals`, `1:N Snacks`

#### **Meal** (existing schema, now with foreign key)
- `id`: UUID (primary key)
- `day_plan_id`: UUID (foreign key → day_plans.id)
- `type`: 'breakfast' | 'lunch' | 'dinner'
- `name`: string
- `ingredients`: JSON[]
- `instructions`: text
- `macros`: JSON (calories, protein, carbs, fat, fiber)
- `nutritional_reasoning`: text
- `scientific_sources`: string[]
- `prep_time_minutes`: number
- `edit_history`: JSON[] (track refinements)
- `created_at`: timestamp
- `updated_at`: timestamp
- **Relationships**: `N:1 DayPlan`

#### **Snack** (new, separate from Meal)
- `id`: UUID (primary key)
- `day_plan_id`: UUID (foreign key → day_plans.id)
- `type`: 'morning_snack' | 'afternoon_snack' | 'evening_snack'
- `name`: string
- `ingredients`: JSON[]
- `macros`: JSON (calories, protein, carbs, fat, fiber)
- `nutritional_reasoning`: text
- `prep_time_minutes`: number
- `portability`: boolean (future: can user take this on-the-go?)
- `timing_preference`: string (future: pre/post workout?)
- `edit_history`: JSON[]
- `created_at`: timestamp
- `updated_at`: timestamp
- **Relationships**: `N:1 DayPlan`

---

## Success Criteria

### Measurable Outcomes

**SC-001**: Both you and wife can create separate accounts and sign in independently

**SC-002**: User profile persists across browser restarts and devices (test: fill profile on laptop, verify on phone)

**SC-003**: Meal plans persist indefinitely (test: generate 10 plans, all accessible in history)

**SC-004**: Cross-device access works (test: generate plan on laptop, view on phone)

**SC-005**: Meal plan generation uses saved profile (test: change profile weight, next plan reflects new weight in macros)

**SC-006**: Historical access works (test: view plan from 2 weeks ago, all data intact)

**SC-007**: Schema is flexible (test: add new field `training_context.workout_days`, no migration needed)

**SC-008**: No data loss (test: generate plan, clear browser cache, data still in DB)

---

## Non-Requirements (Out of Scope for Feature 003)

❌ **7-day meal plans** - Feature 004 (this feature supports 1-day plans stored in week/day structure)
❌ **Feedback infrastructure** - Feature 005
❌ **Password reset flow** - Manual handling OK for 2 users
❌ **Email verification** - Not needed for MVP
❌ **User profiles beyond basic** - No bio, avatar upload, social sharing
❌ **Sharing meal plans between users** - Private only
❌ **Advanced query features** - No search, filter, tags for history
❌ **Data export/import UI** - Keep localStorage backup functions but no UI for now
❌ **Social login beyond Google** - Just Google OAuth for MVP
❌ **Profile analytics** - No dashboards, charts, trends yet
❌ **Meal plan templates** - No "save as template" or "favorite plans" yet

---

## LNO Classification (Shreyas Doshi Framework)

**Assessment**: **Neutral Work**

**Rationale**:
- **Not Leverage**: Doesn't make meal planning more personal or improve AI personalization. It's infrastructure.
- **Not Overhead**: Absolutely necessary to unlock future Leverage work (feedback, 7-day plans, personalization)
- **Is Neutral**: "Keeps lights on" - reliable infrastructure that needs to work but doesn't differentiate us

**Quality Bar** (from constitution):
> "Neutral Work: Output and delivery that needs to work reliably but doesn't need to be fancy. Quality bar: Works reliably, good enough."

**Application**:
- ✅ Use proven tech (NextAuth, MongoDB from Ship-Fast)
- ✅ Build scalable schemas (flexible for future expansion)
- ❌ Don't over-engineer UI (basic forms, simple history list)
- ❌ Don't build fancy features (analytics, exports, advanced queries)
- Focus: Get data persistence working reliably, move on to Leverage work (Feature 006: Personalization)

---

## Technical Constraints (Technology-Agnostic at This Stage)

**Note**: Detailed technical decisions (MongoDB schema design, NextAuth configuration, API routes) will be in `/vibecode:plan` (next step).

High-level constraints to guide planning:
- Reuse Ship-Fast boilerplate (NextAuth + MongoDB connection)
- Relational schema with foreign keys (not nested documents)
- Snacks in separate table from meals
- Flexible schema fields for future expansion (`training_context`, `health_context`, `metadata`)
- No localStorage import (user re-enters profile)

---

**Specification Complete - Ready for Technical Planning**

Next step: `/vibecode:plan` to define HOW to build this (schema design, API routes, component structure, Ship-Fast integration)
