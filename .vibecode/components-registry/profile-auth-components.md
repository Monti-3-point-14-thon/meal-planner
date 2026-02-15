# Profile & Auth Components Registry

**Last Updated**: 2026-02-14
**Feature**: 003-database-auth-infrastructure

---

## Authentication Components

### Protected Route Wrapper
**File**: `app/components/ProtectedRoute.tsx` (or HOC pattern)
**Purpose**: Wraps pages that require authentication, redirects to sign-in if no session
**Status**: Pending implementation (Phase 1)

**Usage Pattern** (Ship-Fast NextAuth):
```typescript
// In page.tsx or layout.tsx
import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  // Page content...
}
```

**Reusability**: ✅ High
- Use in: ProfileOnboarding, ProfileSettings, Dashboard, MealPlanHistory
- Standard pattern for all authenticated pages

---

## Profile Management Components

### ProfileForm
**File**: `app/components/ProfileForm.tsx`
**Purpose**: Reusable form for creating/editing user profile data
**Status**: Pending implementation (Phase 2)

**Props**:
```typescript
interface ProfileFormProps {
  initialData?: UserProfile | null;  // For edit mode, null for create
  onSubmit: (data: UserProfileInput) => Promise<void>;
  isLoading?: boolean;
  errors?: Record<string, string>;
  mode: 'create' | 'edit';
}

interface UserProfileInput {
  biometrics: {
    weight: number;        // kg
    height: number;        // cm
    age: number;
    sex: 'male' | 'female';
  };
  dietaryRestrictions: string[];
  foodPreferences: {
    dislikes: string[];
  };
  culturalCuisines: string[];
  location: string;
}
```

**Internal Structure**:
- Uses existing components from Feature 002:
  - `BiometricsInput` for weight/height/age/sex
  - `CultureSelector` for cuisines + location
  - `PreferencesInput` for food preferences (dislikes)
  - `RestrictionsInput` for dietary restrictions
- Submit button with loading state
- Client-side validation before submit
- Server error display

**Behavior**:
- **Create mode**: Empty form, "Create Profile" button, redirects to dashboard on success
- **Edit mode**: Pre-filled form, "Save Changes" button, stays on settings page

**Reusability**: ✅ High
- Used in: ProfileOnboarding page, ProfileSettings page
- Could be used in future profile import/migration features

**Validation**:
- All biometrics required
- At least 1 cuisine required
- Location required
- Restrictions and preferences optional

---

### ProfileOnboarding (Page Component)
**File**: `app/profile/create/page.tsx`
**Purpose**: First-time profile setup for new users (onboarding flow)
**Status**: Pending implementation (Phase 2)

**Flow**:
1. User signs in with Google OAuth
2. NextAuth creates User record in DB
3. App checks: Does `UserProfile` exist for this user?
4. If NO → Redirect to `/profile/create`
5. User fills `ProfileForm` (create mode)
6. Submit → `POST /api/profile` → creates UserProfile
7. Redirect to `/dashboard`

**Layout**:
- Centered card layout
- Header: "Welcome! Let's set up your profile"
- Subheader: "We need a few details to personalize your meal plans"
- `ProfileForm` with mode='create'
- Skip button (optional): "I'll do this later" → dashboard (but meal plan generation will require profile)

**Related Components**:
- Uses: `ProfileForm` (create mode)
- Protected by: Auth check (session required)

---

### ProfileSettings (Page Component)
**File**: `app/settings/profile/page.tsx`
**Purpose**: Edit existing user profile
**Status**: Pending implementation (Phase 2)

**Flow**:
1. User navigates to Settings → Profile
2. Page fetches `UserProfile` from DB
3. Displays `ProfileForm` pre-filled with current data (edit mode)
4. User modifies fields
5. Submit → `PATCH /api/profile` → updates UserProfile
6. Success toast, stays on page

**Layout**:
- Full-width form
- Header: "Your Profile"
- Subheader: "Changes will apply to future meal plans. Existing plans remain unchanged."
- `ProfileForm` with mode='edit' and initialData from DB
- Cancel button: Reverts to last saved state

**Related Components**:
- Uses: `ProfileForm` (edit mode)
- Protected by: Auth check (session required)

**Data Fetching**:
```typescript
// Server component
const session = await auth();
const profile = await UserProfile.findOne({ userId: session.user.id });
return <ProfileForm initialData={profile} mode="edit" ... />;
```

---

## Meal Plan History Components

### MealPlanHistory (Page Component)
**File**: `app/history/page.tsx`
**Purpose**: List all user's past meal plans with pagination
**Status**: Pending implementation (Phase 4)

**Layout**:
- Header: "Your Meal Plan History"
- List of `WeekPlan` cards (newest first)
- Each card shows:
  - Date range (start → end)
  - Primary goal (e.g., "Muscle Building")
  - Thumbnail or summary (e.g., "7 days, 21 meals")
  - Click → Opens `MealPlanDetail` page or modal
- Pagination: 20 plans per page
- Empty state: "You haven't generated any meal plans yet. Let's create your first one!" with CTA button

**Data Fetching**:
```typescript
// Server component with pagination
const session = await auth();
const page = parseInt(searchParams.page || '1');
const limit = 20;
const skip = (page - 1) * limit;

const plans = await WeekPlan.find({ userId: session.user.id })
  .sort({ createdAt: -1 })  // Newest first
  .skip(skip)
  .limit(limit)
  .lean();

const total = await WeekPlan.countDocuments({ userId: session.user.id });
```

**Related Components**:
- May create: `MealPlanCard` (reusable card for plan preview)
- Protected by: Auth check (session required)

**Future Enhancements** (out of scope for Feature 003):
- Search/filter plans by goal, date range
- Sort by date, goal
- Delete plan
- Duplicate plan

---

### MealPlanCard (Optional - Reusable)
**File**: `app/components/MealPlanCard.tsx`
**Purpose**: Display meal plan preview in history list
**Status**: Pending implementation (Phase 4)

**Props**:
```typescript
interface MealPlanCardProps {
  plan: {
    id: string;
    startDate: string;
    endDate: string;
    primaryGoal: string;
    dayPlans: { date: string }[];  // For count
  };
  onClick: (id: string) => void;
}
```

**Layout**:
- Card with shadow/border
- Header: Date range (e.g., "Feb 12 - Feb 18, 2026")
- Badge: Primary goal (e.g., "Muscle Building")
- Body: Summary (e.g., "7 days • 21 meals • 3 snacks/day")
- Footer: "View Details" button or click entire card

**Reusability**: ✅ Medium
- Used in: MealPlanHistory page
- Could be used in: Dashboard ("Recent Plans" section)

---

## API Integration Components (Client-Side Utilities)

### ProfileAPI Client
**File**: `app/lib/api/profile.ts`
**Purpose**: Client-side API methods for profile operations
**Status**: Pending implementation (Phase 2)

**Methods**:
```typescript
export async function createProfile(data: UserProfileInput): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create profile');
  return response.json();
}

export async function updateProfile(data: Partial<UserProfileInput>): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
}

export async function getProfile(): Promise<UserProfile | null> {
  const response = await fetch('/api/profile');
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}
```

**Reusability**: ✅ High
- Used by: ProfileForm, ProfileOnboarding, ProfileSettings
- Standard pattern for all API calls

---

## Component Dependencies

```
ProfileOnboarding Page
  └── ProfileForm (create mode)
      ├── BiometricsInput (from Feature 002)
      ├── CultureSelector (from Feature 002)
      ├── PreferencesInput (from Feature 002)
      └── RestrictionsInput (from Feature 002)

ProfileSettings Page
  └── ProfileForm (edit mode)
      └── [same children as above]

MealPlanHistory Page
  └── MealPlanCard (optional reusable)
```

---

## Data Flow Diagrams

### Profile Creation Flow
```
1. User signs in (Google OAuth)
   ↓
2. NextAuth creates User in DB
   ↓
3. Check: UserProfile exists?
   ├─ YES → Redirect to /dashboard
   └─ NO → Redirect to /profile/create
       ↓
4. User fills ProfileForm
   ↓
5. Submit → POST /api/profile
   ↓
6. UserProfile created in DB (linked to userId)
   ↓
7. Redirect to /dashboard
```

### Meal Plan Generation with Profile
```
1. User clicks "Generate Meal Plan"
   ↓
2. User fills plan-specific inputs (goal, date)
   ↓
3. Submit → POST /api/meal-plans/generate
   ↓
4. API fetches UserProfile from DB
   ↓
5. API combines profile + plan inputs
   ↓
6. API calls AI with combined context
   ↓
7. AI generates meal plan
   ↓
8. API saves WeekPlan → DayPlan → Meals/Snacks to DB
   ↓
9. API returns generated plan
   ↓
10. User views plan, redirected to /meal-plan/[id]
```

---

## Testing Checklist

**Profile Components**:
- [ ] ProfileForm renders in create mode (empty)
- [ ] ProfileForm renders in edit mode (pre-filled)
- [ ] ProfileForm validates all required fields
- [ ] ProfileForm submits and calls onSubmit prop
- [ ] ProfileForm displays server errors
- [ ] ProfileOnboarding redirects after successful profile creation
- [ ] ProfileSettings stays on page after update
- [ ] ProfileSettings shows success toast after update

**History Components**:
- [ ] MealPlanHistory displays plans newest first
- [ ] MealPlanHistory pagination works (next/prev)
- [ ] MealPlanHistory shows empty state when no plans
- [ ] MealPlanCard displays plan details correctly
- [ ] MealPlanCard click navigates to detail page

**Auth Protection**:
- [ ] Unauthenticated users redirected to sign-in
- [ ] Authenticated users can access profile pages
- [ ] Session persists across browser restarts

---

## Ship-Fast Integration Notes

**NextAuth Patterns**:
- Always use `import { auth } from "@/libs/auth";` for server components
- Check session: `const session = await auth();`
- Redirect if no session: `if (!session?.user) redirect("/api/auth/signin");`
- User ID available as: `session.user.id`

**MongoDB Patterns**:
- Always connect: `await connectMongo();` before queries
- Use Mongoose models: `import UserProfile from "@/models/UserProfile";`
- Model exports use pattern: `mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema)`

**API Route Patterns**:
```typescript
import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongo();
    // Business logic...
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Migration Notes (Feature 002 → Feature 003)

**Settings Form Split**:
- Feature 002: Single "Settings" page with localStorage
- Feature 003: Split into:
  - `/settings/profile` (user-level, persistent in DB)
  - Meal plan generation form (plan-level, per generation)

**Components Reused**:
- `BiometricsInput` (unchanged from Feature 002)
- `CultureSelector` (unchanged from Feature 002)
- `PreferencesInput` (unchanged from Feature 002)
- `RestrictionsInput` (unchanged from Feature 002)

**New Wrapper**:
- `ProfileForm` wraps the above components for profile CRUD operations

---

## Future Enhancements (Out of Scope)

❌ Profile photo upload
❌ Profile sharing between users
❌ Profile import/export UI
❌ Profile versioning (history of profile changes)
❌ Advanced search/filter in history
❌ Meal plan templates from history
