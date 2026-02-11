# Technical Implementation Plan: AI Meal Plan Generator

**Feature ID**: 001-meal-plan-generator
**Created**: 2026-02-11
**Status**: Ready for Implementation
**Approach**: Prototype-First with Robust AI Core (Balanced per constitution)

---

## Overview

**Core Job**: User provides comprehensive health profile → AI generates science-backed, personalized 1-day meal plan → User refines individual meals through conversational editing

**Timeline Estimate**: 5-7 days
**Complexity**: Medium

**Philosophy**:
- Prototype the UI/UX (ship fast, iterate)
- Build robust AI generation logic (health-critical, must be accurate)
- Use free/low-cost tools (Gemini Flash, Tavily free tier)

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) ✅ from ship-fast
- **UI Library**: React 19 ✅ from ship-fast
- **Styling**: Tailwind CSS + DaisyUI ✅ from ship-fast
- **Forms**: React Hook Form (lightweight, good validation)
- **State Management**: React Context for settings + meal plan state

**Rationale**: Ship-fast provides the foundation. We're adding meal-specific components on top.

### Backend / API
- **API Routes**: Next.js API routes (app/api/*)
- **AI Gateway**: OpenRouter SDK
- **Research Tool**: Tavily API for scientific validation
- **Data Storage**: localStorage (MVP), structured for future MongoDB migration

**Rationale**:
- Next.js API routes = simple, no separate server needed
- OpenRouter = multi-model flexibility
- localStorage = zero cost, no auth needed, fast to implement
- Structure data for easy MongoDB migration when user auth is added

### AI & Data
- **Primary AI Model**: Gemini 1.5 Flash (Free tier via OpenRouter)
  - Rate limits: 15 RPM, 1M RPD, 1500 RPD
  - Cost: $0 for MVP scale (2 users)
  - Quality: Good for structured meal generation
- **Scientific Validation**: Tavily API (Free plan, 1000 searches)
  - Use sparingly: validate nutritional claims only when flagged as uncertain
- **Fallback Strategy**: If Gemini rate limit hit, queue request or show "Try again in 1 minute"

**Rationale**:
- Gemini free tier = perfect for 2-user validation phase
- Tavily free = 1000 credits allows ~300-500 meal plans with selective validation
- Upgrade trigger: When hitting rate limits consistently OR when scaling to paid users

### Data Persistence
- **MVP**: localStorage
  - Settings: `meal_planner_settings`
  - Current plan: `meal_planner_current`
  - History: `meal_planner_history` (last 5 plans)
- **Future Migration**: MongoDB (when user auth added)
  - Settings → UserSettings collection
  - Plans → MealPlans collection
  - Keep localStorage as fallback/offline mode

---

## Architecture

### System Flow

```
[Settings Form Page]
    ↓ (user submits)
[localStorage: save settings]
    ↓
[Generate Button Click]
    ↓
[API Route: /api/generate-meal-plan]
    ↓
[AI Service: buildPrompt(userSettings)]
    ↓
[OpenRouter: call Gemini Flash]
    ↓
[Tavily: validate uncertain claims] (selective)
    ↓
[Response: 3 meals with macros + reasoning]
    ↓
[localStorage: save meal plan]
    ↓
[Meal Plan Display Page]
    ↓
[User clicks Edit on Meal]
    ↓
[API Route: /api/regenerate-meal]
    ↓
[AI Service: buildEditPrompt(meal, userInstruction)]
    ↓
[OpenRouter: regenerate ONLY that meal]
    ↓
[Response: updated meal]
    ↓
[Update localStorage + UI]
```

### Data Model

#### UserSettings (localStorage key: `meal_planner_settings`)
```typescript
interface UserSettings {
  id: string; // uuid
  primary_goal: 'muscle_building' | 'weight_loss' | 'gut_health' | 'mental_performance' | 'general_health';
  biometrics: {
    weight: number; // kg
    height: number; // cm
    age: number;
    sex: 'male' | 'female' | 'other';
  };
  cultural_context: {
    cuisine: string; // from dropdown (Mediterranean, Asian, Mexican, etc.)
    location: string; // country/region
  };
  dietary_restrictions: string[]; // ['vegetarian', 'gluten-free', 'no-shellfish']
  created_at: string; // ISO timestamp
  updated_at: string;
}
```

#### MealPlan (localStorage key: `meal_planner_current`)
```typescript
interface MealPlan {
  id: string; // uuid
  user_settings_id: string; // references UserSettings.id
  date: string; // ISO date
  meals: Meal[]; // array of 3-6 meals
  daily_totals: {
    calories: number;
    protein: number; // grams
    carbs: number;
    fats: number;
  };
  created_at: string;
}
```

#### Meal (individual entity within MealPlan)
```typescript
interface Meal {
  id: string; // uuid
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack_morning' | 'snack_afternoon' | 'snack_evening';
  name: string; // e.g., "Grilled Salmon with Quinoa"
  ingredients: Ingredient[];
  preparation: string; // brief instructions
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  nutritional_reasoning: string; // why this meal serves user's goal
  scientific_sources?: string[]; // Tavily-validated sources (optional)
  edit_history: MealEdit[]; // track refinements
  created_at: string;
  updated_at: string;
}

interface Ingredient {
  name: string;
  quantity: string; // "150g" or "1 cup"
  notes?: string; // optional
}

interface MealEdit {
  id: string;
  user_instruction: string; // "Make it vegetarian"
  timestamp: string;
}
```

---

## API Design

### POST /api/generate-meal-plan

**Request Body**:
```json
{
  "userSettings": { /* UserSettings object */ },
  "options": {
    "includSnacks": false, // P3 feature
    "validateWithTavily": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "mealPlan": { /* MealPlan object */ },
  "generationTime": 18.5, // seconds
  "warnings": [] // e.g., ["Gemini rate limit approaching"]
}
```

**Error Handling**:
- 429: Rate limit hit → return `{ "error": "rate_limit", "retryAfter": 60 }`
- 500: AI generation failed → return `{ "error": "generation_failed", "canRetry": true }`

---

### POST /api/regenerate-meal

**Request Body**:
```json
{
  "mealPlan": { /* current MealPlan */ },
  "mealId": "uuid-of-meal-to-edit",
  "userInstruction": "Make it vegetarian",
  "userSettings": { /* UserSettings for context */ }
}
```

**Response**:
```json
{
  "success": true,
  "updatedMeal": { /* Meal object */ },
  "updatedDailyTotals": { /* recalculated totals */ }
}
```

---

## Component Structure

### Pages (Next.js App Router)

```
app/
├── page.tsx                          # Landing/Home (CTA to settings)
├── settings/
│   └── page.tsx                      # Settings Form (P1)
├── generate/
│   └── page.tsx                      # Loading state during generation
└── meal-plan/
    └── page.tsx                      # Meal Plan Display + Editing (P1, P2)
```

### Components (app/components/)

**Form Components** (Neutral work - simple, functional):
- `SettingsForm.tsx` - Main settings form container
- `GoalSelector.tsx` - Dropdown for primary goal
- `BiometricsInput.tsx` - Weight, height, age, sex inputs
- `CultureSelector.tsx` - Dropdown (20 cuisines) + "Other" text field
- `RestrictionsInput.tsx` - Multi-select checkboxes + custom input

**Meal Display Components** (Neutral work):
- `MealPlanView.tsx` - Container for full day's meals
- `MealCard.tsx` - Individual meal card with edit button
- `MacroDisplay.tsx` - Detailed macro breakdown (P/C/F + calories)
- `DailyTotals.tsx` - Summary of daily macros

**Edit Components** (Neutral work):
- `MealEditModal.tsx` - Modal/expandable edit interface
- `RegenerateButton.tsx` - Submit edit instruction button

**Loading/Error Components** (Neutral work):
- `GenerationLoader.tsx` - Progress indicator for AI generation
- `ErrorDisplay.tsx` - User-friendly error messages

**From Ship-Fast** (reuse existing):
- Button components (DaisyUI)
- Card layouts (DaisyUI)
- Form inputs (DaisyUI)

---

## AI Prompt Engineering (LEVERAGE WORK)

### Prompt Structure for Meal Plan Generation

```typescript
const buildMealPlanPrompt = (settings: UserSettings) => `
You are a science-based nutritionist AI. Generate a personalized 1-day meal plan.

USER CONTEXT:
- Goal: ${settings.primary_goal}
- Biometrics: ${settings.biometrics.weight}kg, ${settings.biometrics.height}cm, ${settings.biometrics.age}yo, ${settings.biometrics.sex}
- Cultural cuisine preference: ${settings.cultural_context.cuisine}
- Location: ${settings.cultural_context.location}
- HARD CONSTRAINTS (never violate): ${settings.dietary_restrictions.join(', ')}

INSTRUCTIONS:
1. Calculate appropriate daily calorie target based on goal and biometrics
2. Determine macro distribution (protein/carbs/fats) for the goal
3. Generate 3 meals (breakfast, lunch, dinner) that:
   - Use ingredients from ${settings.cultural_context.cuisine} cuisine
   - Are available in ${settings.cultural_context.location}
   - NEVER include: ${settings.dietary_restrictions.join(', ')}
   - Align with daily macro targets
   - Include brief scientific reasoning for each meal

OUTPUT FORMAT (JSON):
{
  "daily_targets": { "calories": X, "protein": Y, "carbs": Z, "fats": W },
  "meals": [
    {
      "type": "breakfast",
      "name": "Meal name",
      "ingredients": [{ "name": "...", "quantity": "..." }],
      "preparation": "Brief instructions",
      "macros": { "calories": X, "protein": Y, "carbs": Z, "fats": W },
      "reasoning": "Why this meal serves the user's goal (cite science)"
    },
    // ... lunch, dinner
  ]
}

CRITICAL: Ensure dietary restrictions are honored. Double-check before responding.
`;
```

### Tavily Validation Strategy

**When to use Tavily** (selective to preserve free credits):
- AI uses phrases like "may help", "could benefit", "some studies suggest"
- Nutritional claim is about a specific health condition (gut health, inflammation)
- Unusual ingredient combinations that need justification

**When NOT to use Tavily**:
- Basic macro calculations (protein for muscle building = established science)
- Common cuisine recommendations (Mediterranean diet for heart health = well-known)
- Standard dietary restrictions (gluten-free for celiac = no research needed)

**Implementation**:
```typescript
const validateNutritionalClaim = async (claim: string) => {
  const query = `scientific evidence ${claim} nutrition`;
  const results = await tavily.search(query, { maxResults: 2 });
  return results.length > 0 ? results[0].url : null;
};
```

---

## Implementation Phases

### Phase 1: Settings Form & Data Capture (Days 1-2)

**User Story P1 - Part 1**

**Files to Create**:
- `app/settings/page.tsx` - Settings form page
- `app/components/SettingsForm.tsx`
- `app/components/GoalSelector.tsx`
- `app/components/BiometricsInput.tsx`
- `app/components/CultureSelector.tsx` (20 cuisine dropdown + Other)
- `app/components/RestrictionsInput.tsx`
- `lib/storage.ts` - localStorage utilities
- `lib/types.ts` - TypeScript interfaces (UserSettings, etc.)

**Tasks**:
1. Create settings form UI using DaisyUI components
2. Implement form validation (React Hook Form)
3. Build culture dropdown with 20 common cuisines:
   - Mediterranean, Italian, Mexican, Chinese, Japanese, Indian, Thai, Vietnamese
   - Middle Eastern, Greek, French, Spanish, Korean, Brazilian, Caribbean
   - American, British, German, Scandinavian, African, Other (text input)
4. Add restrictions multi-select (Vegetarian, Vegan, Gluten-free, Dairy-free, Nut allergy, Shellfish allergy, Custom)
5. Save to localStorage on submit
6. Navigate to /generate on completion

**Testing**:
- User can complete form in <3 minutes
- Validation catches invalid inputs (age, weight, height ranges)
- Data persists in localStorage

---

### Phase 2: AI Meal Plan Generation (Days 3-4)

**User Story P1 - Part 2**

**Files to Create**:
- `app/api/generate-meal-plan/route.ts` - API route
- `app/generate/page.tsx` - Loading page
- `app/meal-plan/page.tsx` - Results display
- `lib/ai/openrouter.ts` - OpenRouter SDK wrapper
- `lib/ai/prompts.ts` - Prompt building functions
- `lib/ai/tavily.ts` - Tavily validation (selective)
- `app/components/MealPlanView.tsx`
- `app/components/MealCard.tsx`
- `app/components/MacroDisplay.tsx`
- `app/components/DailyTotals.tsx`
- `app/components/GenerationLoader.tsx`

**Tasks**:
1. Set up OpenRouter SDK with Gemini Flash model
2. Build meal plan generation prompt (see prompt engineering section)
3. Implement API route `/api/generate-meal-plan`
   - Parse user settings
   - Call Gemini via OpenRouter
   - Parse JSON response
   - Calculate daily totals
   - Save to localStorage
4. Implement Tavily selective validation:
   - Detect uncertain language in AI reasoning
   - Validate 1-2 claims per meal plan (preserve credits)
   - Append source URLs to reasoning
5. Build meal plan display UI:
   - 3 meal cards (breakfast, lunch, dinner)
   - Each card shows: name, ingredients, macros, reasoning
   - Daily totals at bottom
   - Edit button on each card (not functional yet)
6. Add loading state with progress indicator
7. Handle errors gracefully (rate limits, generation failures)

**Testing**:
- Meal plan generates in <30 seconds
- Meals respect dietary restrictions (CRITICAL - test with multiple restrictions)
- Meals reflect cultural cuisine preference
- Macros displayed clearly (P/C/F + calories)
- Daily totals calculated correctly

---

### Phase 3: Per-Meal Editing (Days 5-6)

**User Story P2**

**Files to Create**:
- `app/api/regenerate-meal/route.ts` - API route for editing
- `app/components/MealEditModal.tsx`
- `app/components/RegenerateButton.tsx`
- `lib/ai/prompts.ts` (add edit prompt builder)

**Tasks**:
1. Build edit prompt for single meal regeneration:
   - Include original meal context
   - Include user's edit instruction
   - Maintain health goal and restrictions
   - Keep similar calorie/macro profile unless explicitly changed
2. Implement API route `/api/regenerate-meal`
   - Accept meal ID + user instruction
   - Regenerate ONLY that meal
   - Recalculate daily totals
   - Update localStorage
3. Build edit UI:
   - Click edit button → expand meal card or open modal
   - Text input for user instruction
   - Submit button triggers regeneration
   - Show loading state for THAT meal only
4. Update meal card component to handle:
   - Editable state
   - Loading state
   - Updated meal display
5. Track edit history in meal object

**Testing**:
- User can edit individual meals
- Only edited meal regenerates (others unchanged)
- Edit completes in <20 seconds
- Daily totals update correctly
- Multiple edits work (iterative refinement)

---

### Phase 4: Optional Snacks (Day 7 - P3)

**User Story P3** (if time permits)

**Files to Modify**:
- `app/meal-plan/page.tsx` - Add "Add Snack" button
- `app/api/generate-meal-plan/route.ts` - Support snack generation
- `app/components/SnackSelector.tsx` - Choose snack timing

**Tasks**:
1. Add "Add Snack" button to meal plan view
2. Show snack timing options (morning, afternoon, evening)
3. Generate snack based on remaining macro gaps
4. Allow editing snacks same as meals

**Testing**:
- Snacks fill macro gaps appropriately
- User can add/remove snack slots

---

## Technical Decisions Log

### Decision 1: AI Model Selection

**Date**: 2026-02-11
**Context**: 2 users (MVP validation), minimal budget, speed not critical

**Options Considered**:
- A) Claude Haiku (~$0.002/plan)
- B) GPT-4o-mini (~$0.0015/plan)
- C) Gemini 1.5 Flash (free tier)

**Chosen**: **Gemini 1.5 Flash (Free tier via OpenRouter)**

**Rationale**:
- Cost: $0 for MVP scale
- Quality: Good enough for structured meal generation
- Rate limits (15 RPM, 1500 RPD) sufficient for 2 users
- Upgrade path: Switch to GPT-4o-mini when hitting limits or scaling

**Migration Trigger**:
- Hitting rate limits consistently (>10/day)
- Scaling to paid users (>10 users)
- Quality complaints from users

**Estimated Migration Effort**: 1 hour (change model name in OpenRouter config)

---

### Decision 2: Tavily Scientific Validation

**Date**: 2026-02-11
**Context**: Free Tavily plan (1000 credits), constitution emphasizes science-first

**Options Considered**:
- A) Include Tavily in MVP (validate all claims)
- B) Defer to v2
- C) Include but use selectively

**Chosen**: **Option C (Include Tavily, use selectively)**

**Rationale**:
- User has free 1000 credits (no cost)
- Aligns with "science-first" principle
- Selective use preserves credits (~300-500 meal plans possible)
- Wife (nutritionist) can manually review for additional validation

**Implementation**:
- Validate only uncertain AI claims (phrases like "may help", "could benefit")
- Skip validation for established science (protein for muscle, etc.)
- Append source URLs when available

**Migration Trigger**: Running low on credits (<100 remaining) → upgrade to paid Tavily or make validation fully optional

---

### Decision 3: Cultural Cuisine Input Method

**Date**: 2026-02-11

**Options Considered**:
- A) Free text
- B) Dropdown (20 cuisines) + "Other" field
- C) Multi-select tags

**Chosen**: **Option B (Dropdown + Other)**

**Rationale**:
- Covers 90% of cuisines
- Consistent data for AI prompts
- Faster user input than free text
- "Other" field handles edge cases
- Simpler than multi-select

**Cuisine List**:
Mediterranean, Italian, Mexican, Chinese, Japanese, Indian, Thai, Vietnamese, Middle Eastern, Greek, French, Spanish, Korean, Brazilian, Caribbean, American, British, German, Scandinavian, African, Other

---

### Decision 4: Macros Display Detail

**Date**: 2026-02-11
**Context**: Target user works with nutritionist, cares about macros

**Options Considered**:
- A) Detailed (Protein/Carbs/Fats + Calories)
- B) Simplified (Calories only, expandable detail)

**Chosen**: **Option A (Detailed macros by default)**

**Rationale**:
- Aligns with "personalization is the product"
- Target user (working with nutritionist) needs macro breakdown
- Essential for muscle-building and weight-loss goals
- Can always add "simplified view" toggle later if users request

**Display Format**:
```
Calories: 580
Protein: 45g | Carbs: 60g | Fats: 20g
```

---

## Dependencies

### External Libraries

**Production**:
- `openai` (^4.x) - For OpenRouter SDK compatibility
- `react-hook-form` (^7.x) - Form validation
- `uuid` (^9.x) - Generate unique IDs
- `zod` (^3.x) - Schema validation (TypeScript)

**Development**:
- Ship-Fast already includes: Next.js, React, Tailwind, DaisyUI, TypeScript

**API Keys Needed**:
- OpenRouter API key (free tier)
- Tavily API key (free plan)

---

## Risks & Mitigation

### Risk 1: Gemini Rate Limits

**Risk**: 15 RPM limit could be hit during testing/development
**Probability**: Medium
**Impact**: High (blocks development)
**Mitigation**:
- Implement request queuing (1 request per 4 seconds)
- Add friendly error message: "Please wait 1 minute and try again"
- Cache successful generations in localStorage for testing
- Fallback: Temporarily use GPT-4o-mini during heavy development

---

### Risk 2: AI Violates Dietary Restrictions

**Risk**: AI suggests restricted foods (gluten, dairy, etc.)
**Probability**: Low (but catastrophic if happens)
**Impact**: Critical (health risk, trust loss)
**Mitigation**:
- Explicitly emphasize restrictions in prompt (HARD CONSTRAINTS)
- Post-processing validation: scan ingredients for restricted keywords
- Add "Report Issue" button on each meal
- Manual review by wife (nutritionist) for first 20 meal plans

---

### Risk 3: Tavily Credits Run Out

**Risk**: 1000 free credits depleted
**Probability**: Medium (after ~300-500 meal plans)
**Impact**: Low (validation becomes optional)
**Mitigation**:
- Make Tavily validation optional (flag in API request)
- Track credit usage, warn at 100 remaining
- Fallback: Continue without validation, rely on AI model's knowledge
- Upgrade option: Tavily Pro ($60/mo) if product validated

---

### Risk 4: Slow Generation Times

**Risk**: Gemini + Tavily takes >45 seconds
**Probability**: Low-Medium
**Impact**: Medium (poor UX)
**Mitigation**:
- Target: <30 seconds total (Gemini 15s, Tavily 10s)
- Set reasonable expectations with loading messages
- Make Tavily validation async (generate meal plan first, add sources after)
- If consistently slow: disable Tavily or switch to faster model

---

## Testing Strategy

### Critical Path Testing (Per Constitution)

**Must Test**:
- ✅ Dietary restrictions enforcement (automated + manual)
- ✅ Macro calculations accuracy
- ✅ User data persistence (localStorage)
- ✅ API error handling (rate limits, failures)

**Nice to Test** (if time permits):
- UI rendering on mobile
- Form validation edge cases
- Multiple meal edits in sequence

### Test Cases

**Test 1: Dietary Restrictions Honored**
- Input: User with "vegetarian" + "gluten-free"
- Expected: Zero meat, zero gluten ingredients
- Method: Manual review of 10 generated plans

**Test 2: Cultural Cuisine Reflected**
- Input: User selects "Japanese" cuisine
- Expected: Meals use Japanese ingredients (rice, miso, seaweed, etc.)
- Method: Generate 5 plans, verify ingredient choices

**Test 3: Per-Meal Editing**
- Input: Edit breakfast with "No eggs"
- Expected: Only breakfast regenerates, lunch/dinner unchanged
- Method: Functional test + verify localStorage updates

**Test 4: Macro Accuracy**
- Input: Generated meal plan
- Expected: Daily totals = sum of individual meals
- Method: Automated calculation check

---

## Data Migration Path (Future)

### When User Auth is Added

**Current State**: localStorage
**Future State**: MongoDB (via ship-fast)

**Migration Steps**:
1. Create MongoDB schemas matching current TypeScript interfaces
2. On user signup/login, check localStorage for existing data
3. If found, migrate to MongoDB and link to user account
4. Keep localStorage as fallback for offline mode
5. Estimated effort: 2-3 days

**Data Structure Compatibility**:
Current TypeScript interfaces are designed to map 1:1 to MongoDB documents (no breaking changes needed).

---

## Environment Variables

```env
# .env.local
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...

# Optional (for future)
MONGODB_URI=mongodb+srv://...
```

---

## Next Steps After Plan Approval

1. **Create task breakdown**: Run `/vibecode:tasks` to sequence implementation
2. **Set up environment**: Install dependencies, configure API keys
3. **Create feature branch**: `git checkout -b 001-meal-plan-generator`
4. **Start Phase 1**: Settings form & data capture
5. **Log decisions**: Save the 4 decisions above to `.vibecode/memory/decisions/active/`

---

## Estimated Timeline

- **Phase 1** (Settings): 2 days
- **Phase 2** (AI Generation): 2 days
- **Phase 3** (Editing): 2 days
- **Phase 4** (Snacks): 1 day (optional)
- **Testing & Polish**: 1 day

**Total**: 7-8 days for full P1+P2+P3 implementation

**MVP Shippable** (P1+P2 only): 5-6 days

---

**End of Technical Plan**
