# Feature Specification: AI Meal Plan Generator

**Feature ID**: 001-meal-plan-generator
**Feature Branch**: `001-meal-plan-generator`
**Created**: 2026-02-11
**Status**: Draft
**Classification**: LEVERAGE WORK (Core product differentiation)

---

## Executive Summary

### Core Job
**"User provides comprehensive health profile → AI generates science-backed, personalized 1-day meal plan → User refines individual meals through conversational editing"**

### Why This Matters
Generic meal plans are the problem we're solving. This feature establishes the personalization engine that differentiates us from "just use ChatGPT." By collecting detailed user context (goals, biometrics, cultural background, restrictions), we enable scientifically-grounded, truly personalized nutrition guidance.

### Success Criteria
- User completes settings in <3 minutes
- AI generates personalized meal plan in <30 seconds
- Meal plan reflects user's specific context (cultural cuisine, restrictions, goals)
- User can refine individual meals without regenerating entire day
- Nutritional reasoning is transparent and science-backed

---

## User Stories & Testing (PRIORITIZED)

### User Story 1: Complete Health Profile Setup (Priority: P1)

**As a** user seeking personalized nutrition guidance
**I want to** provide my health goals and personal context
**So that** the AI can generate meal plans tailored to my specific needs

**Why this priority**: Without comprehensive user context, meal plans will be generic. This is the foundation for all personalization.

**Independent Test**: User fills out settings form → data is captured → can generate meal plan using this data

#### Acceptance Scenarios

**Scenario 1.1: User selects primary health goal**
- **Given** user is on settings page
- **When** user selects goal from dropdown (muscle building, weight loss, gut health, mental performance, general health)
- **Then** system captures primary goal
- **And** UI may show goal-specific follow-up questions (future enhancement)

**Scenario 1.2: User enters biometric data**
- **Given** user has selected primary goal
- **When** user enters weight (kg/lbs), height (cm/inches), age (years), biological sex
- **Then** system validates inputs (age 13-120, weight/height reasonable ranges)
- **And** stores biometric data for AI personalization

**Scenario 1.3: User specifies cultural and location context**
- **Given** user is completing profile
- **When** user enters cultural background (free text or dropdown) and location (country/region)
- **Then** system captures cultural cuisine preferences
- **And** AI will prioritize locally-available ingredients and culturally-familiar foods

**Scenario 1.4: User declares dietary restrictions and intolerances**
- **Given** user is completing profile
- **When** user selects/enters restrictions (vegetarian, vegan, gluten-free, dairy-free, specific allergies)
- **Then** system stores restrictions as hard constraints
- **And** AI will NEVER suggest foods that violate these restrictions

**Scenario 1.5: User saves settings**
- **Given** user has completed all required fields
- **When** user clicks "Save Settings" or "Generate Meal Plan"
- **Then** system validates completeness
- **And** stores settings (localStorage for MVP, database for future)
- **And** proceeds to meal plan generation

#### Edge Cases
- **Incomplete form**: If required fields missing, show clear validation errors
- **Invalid biometrics**: If weight/height/age out of reasonable bounds, warn user (don't block)
- **No restrictions**: Allow user to skip/select "None" for restrictions
- **Multiple goals**: For MVP, user selects ONE primary goal (future: multiple weighted goals)

---

### User Story 2: AI-Generated Personalized Meal Plan (Priority: P1)

**As a** user who has completed health profile
**I want to** receive an AI-generated 1-day meal plan
**So that** I have science-backed, personalized nutrition guidance for breakfast, lunch, and dinner

**Why this priority**: This is the core product value. Without AI generation, there's no product.

**Independent Test**: User with saved settings → clicks "Generate Meal Plan" → receives 3 meals with nutritional rationale

#### Acceptance Scenarios

**Scenario 2.1: User initiates meal plan generation**
- **Given** user has completed health profile
- **When** user clicks "Generate Meal Plan" button
- **Then** system shows loading state with progress indicator
- **And** calls AI generation endpoint with user's full context

**Scenario 2.2: AI generates personalized meal plan**
- **Given** AI has received user context (goals, biometrics, culture, restrictions)
- **When** AI processes the request
- **Then** AI generates 3 meals (breakfast, lunch, dinner) that:
  - Align with user's health goal (macro distribution, calorie target)
  - Respect all dietary restrictions (hard constraints)
  - Favor culturally-familiar cuisine
  - Use science-backed nutritional reasoning
- **And** each meal includes:
  - Meal name/description
  - Ingredients with quantities
  - Preparation instructions (brief)
  - Macronutrients (protein, carbs, fats, calories)
  - Nutritional reasoning (why this meal serves the user's goal)

**Scenario 2.3: Meal plan is displayed to user**
- **Given** AI has generated meal plan
- **When** generation completes
- **Then** user sees:
  - 3 meal cards (breakfast, lunch, dinner)
  - Each card shows: meal name, ingredients, macros, reasoning
  - Daily totals (total calories, total protein/carbs/fats)
  - Edit button/icon on each meal card
- **And** loading state is replaced with meal plan UI

**Scenario 2.4: Nutritional reasoning is transparent**
- **Given** user is viewing a meal
- **When** user reads the meal card
- **Then** each meal includes a "Why this meal?" section explaining:
  - How it aligns with their goal (e.g., "High protein for muscle building")
  - Scientific rationale (e.g., "Salmon provides omega-3s for inflammation")
  - Cultural fit (e.g., "Uses familiar Mediterranean ingredients")

#### Edge Cases
- **AI generation fails**: Show error message, offer "Try Again" button, log error for debugging
- **AI takes >45 seconds**: Show "This is taking longer than expected..." message, keep loading
- **AI violates restrictions**: (Should not happen) If detected, flag meal and allow user to report
- **Unrealistic biometrics**: If AI determines inputs are unsafe (e.g., 500 calories for 200lb person), warn user

---

### User Story 3: Edit Individual Meals (Priority: P2)

**As a** user viewing my meal plan
**I want to** refine specific meals with custom instructions
**So that** I can adapt the plan to my preferences without regenerating everything

**Why this priority**: Enhances core value. P1 delivers working meal plan; P2 makes it truly personalized through iteration.

**Independent Test**: User clicks edit on "Lunch" → enters "Make it vegetarian" → AI regenerates only lunch → updated lunch appears

#### Acceptance Scenarios

**Scenario 3.1: User initiates meal edit**
- **Given** user is viewing generated meal plan
- **When** user clicks "Edit" button/pen icon on a specific meal (e.g., Breakfast)
- **Then** meal card expands or shows text input field
- **And** placeholder text suggests example edits (e.g., "Make it spicy", "Swap salmon for chicken")

**Scenario 3.2: User provides refinement instructions**
- **Given** meal edit mode is active
- **When** user types instructions (e.g., "No dairy, I'm lactose intolerant")
- **And** clicks "Regenerate Meal" or presses Enter
- **Then** system captures instructions
- **And** shows loading state for THAT meal only (other meals unchanged)

**Scenario 3.3: AI regenerates only the edited meal**
- **Given** user has submitted meal refinement
- **When** AI processes the request
- **Then** AI generates NEW version of that meal:
  - Incorporates user's instructions
  - Maintains original health goal and restrictions
  - Keeps similar calorie/macro profile (unless instructions change it)
  - Provides reasoning for changes
- **And** other meals remain unchanged

**Scenario 3.4: Updated meal is displayed**
- **Given** AI has regenerated the meal
- **When** regeneration completes
- **Then** meal card updates with new meal
- **And** daily totals update (if macros changed)
- **And** user can edit again if needed (iterative refinement)

**Scenario 3.5: Architectural handling of individual meals**
- **Given** meal plan is stored/displayed
- **When** any meal is edited
- **Then** system treats each meal as independent entity:
  - Each meal has unique ID
  - Each meal stores its own generation history (original + edits)
  - Meals can be edited in any order
  - Future: individual meals can be saved to "favorites"

#### Edge Cases
- **Conflicting instructions**: If user says "High protein" for breakfast AND lunch, warn if daily protein exceeds safe limits
- **Impossible request**: If user asks for "No carbs, no protein, no fat", AI explains it's not feasible
- **Edit during generation**: If user clicks edit while meal is regenerating, queue the request or show "Please wait"
- **Undo edit**: (Future) Allow user to revert to previous version of meal

---

### User Story 4: Optional Snacks (Priority: P3)

**As a** user with higher calorie needs or specific meal timing preferences
**I want to** add snack slots to my daily plan
**So that** I can distribute calories across more eating occasions

**Why this priority**: Nice-to-have. Not critical for validating core meal plan generation. Can add after P1+P2 proven.

**Independent Test**: User clicks "Add Snack" → AI suggests snack based on remaining macros → snack appears in timeline

#### Acceptance Scenarios

**Scenario 4.1: User adds snack slot**
- **Given** user has generated 3-meal plan
- **When** user clicks "Add Snack" button
- **Then** system shows snack timing options (morning, afternoon, evening)
- **And** user selects timing

**Scenario 4.2: AI suggests snack based on daily macros**
- **Given** user has added snack slot
- **When** AI calculates remaining macros (daily target - current 3 meals)
- **Then** AI suggests snack that:
  - Fills macro gaps (e.g., if protein is low, suggest protein-rich snack)
  - Fits cultural preferences
  - Is appropriate for timing (light evening snack vs hearty afternoon snack)

**Scenario 4.3: User can edit snacks like meals**
- **Given** snack is displayed
- **When** user clicks edit on snack
- **Then** same editing flow as P2 applies

#### Edge Cases
- **Already at calorie target**: If 3 meals meet daily calories, warn user before adding snack
- **Multiple snacks**: Allow up to 3 snacks (morning, afternoon, evening)
- **Remove snack**: User can delete snack slot if added accidentally

---

## Requirements

### Functional Requirements

#### Settings & Data Capture
- **FR-001**: System MUST collect user's primary health goal (muscle building, weight loss, gut health, mental performance, general health)
- **FR-002**: System MUST collect biometric data: weight, height, age, biological sex
- **FR-003**: System MUST collect cultural background and location for cuisine personalization
- **FR-004**: System MUST collect dietary restrictions and intolerances as hard constraints
- **FR-005**: System MUST validate input data (age range, reasonable biometrics)
- **FR-006**: System MUST store settings persistently (localStorage for MVP, database for future)
- **FR-007**: Settings data structure MUST be designed for future nesting under user profiles

#### AI Meal Plan Generation
- **FR-008**: System MUST generate 3 meals (breakfast, lunch, dinner) based on user context
- **FR-009**: Each meal MUST include: name, ingredients with quantities, preparation instructions, macros, nutritional reasoning
- **FR-010**: Meal generation MUST respect all dietary restrictions (hard constraints)
- **FR-011**: Meal generation SHOULD favor culturally-familiar cuisine based on user's background
- **FR-012**: Meal generation MUST align with user's health goal (macro distribution, calorie target)
- **FR-013**: System MUST calculate and display daily totals (calories, protein, carbs, fats)
- **FR-014**: System MUST use OpenRouter API for AI generation
- **FR-015**: System SHOULD use Tavily to validate nutritional claims (if time permits in MVP)

#### Per-Meal Editing
- **FR-016**: System MUST treat each meal as an independent entity with unique ID
- **FR-017**: User MUST be able to edit any meal individually
- **FR-018**: When user edits a meal, system MUST regenerate ONLY that meal (not entire day)
- **FR-019**: Edited meals MUST maintain health goal alignment unless user explicitly requests otherwise
- **FR-020**: System MUST store edit history for each meal (original + refinements)
- **FR-021**: System MUST update daily totals when a meal is edited

#### Optional Snacks (P3)
- **FR-022**: User SHOULD be able to add snack slots (morning, afternoon, evening)
- **FR-023**: AI SHOULD suggest snacks that fill macro gaps in daily plan
- **FR-024**: User SHOULD be able to edit snacks same as meals

### Non-Functional Requirements

#### Performance
- **NFR-001**: Settings form MUST load in <2 seconds
- **NFR-002**: Meal plan generation SHOULD complete in <30 seconds (target: 15-20s)
- **NFR-003**: Individual meal regeneration SHOULD complete in <20 seconds
- **NFR-004**: UI MUST show loading states for all async operations

#### Usability
- **NFR-005**: Settings form MUST be completable in <3 minutes
- **NFR-006**: Meal cards MUST be readable on mobile (responsive design)
- **NFR-007**: Nutritional data MUST use clear typography and layout (per constitution)
- **NFR-008**: Edit interactions MUST be intuitive (clear affordances)

#### Reliability
- **NFR-009**: System MUST handle AI generation failures gracefully (error message + retry)
- **NFR-010**: System MUST validate restrictions are honored (never suggest restricted foods)
- **NFR-011**: System MUST never present unverified health claims

#### Data Architecture
- **NFR-012**: Meal data structure MUST support future features (save to favorites, meal history)
- **NFR-013**: Settings data MUST be structured for future user profile integration
- **NFR-014**: Each meal MUST be independently editable and versionable

---

## Key Entities & Data Model

### User Settings (Future: nested under User Profile)
```
UserSettings {
  id: string (uuid)
  primary_goal: enum (muscle_building, weight_loss, gut_health, mental_performance, general_health)
  biometrics: {
    weight: number (kg)
    height: number (cm)
    age: number (years)
    sex: enum (male, female, other)
  }
  cultural_context: {
    background: string (e.g., "Mediterranean", "East Asian")
    location: string (country/region)
  }
  dietary_restrictions: string[] (e.g., ["vegetarian", "gluten-free", "no-shellfish"])
  created_at: timestamp
  updated_at: timestamp
}
```

### Meal Plan
```
MealPlan {
  id: string (uuid)
  user_settings_id: string (references UserSettings)
  date: date (for future: which day this plan is for)
  meals: Meal[] (array of 3-6 meals/snacks)
  daily_totals: {
    calories: number
    protein: number (g)
    carbs: number (g)
    fats: number (g)
  }
  created_at: timestamp
}
```

### Meal (Individual Entity)
```
Meal {
  id: string (uuid)
  meal_plan_id: string (references MealPlan)
  type: enum (breakfast, lunch, dinner, snack_morning, snack_afternoon, snack_evening)
  name: string (e.g., "Grilled Salmon with Quinoa")
  ingredients: Ingredient[] (array)
  preparation: string (brief instructions)
  macros: {
    calories: number
    protein: number (g)
    carbs: number (g)
    fats: number (g)
  }
  nutritional_reasoning: string (why this meal serves user's goal)
  edit_history: MealEdit[] (original + refinements)
  created_at: timestamp
  updated_at: timestamp
}
```

### Ingredient
```
Ingredient {
  name: string (e.g., "Salmon fillet")
  quantity: string (e.g., "150g" or "1 cup")
  notes: string? (optional, e.g., "wild-caught preferred")
}
```

### Meal Edit (Version History)
```
MealEdit {
  id: string (uuid)
  meal_id: string (references Meal)
  user_instruction: string (e.g., "Make it vegetarian")
  previous_version: Meal (snapshot)
  new_version: Meal (snapshot)
  created_at: timestamp
}
```

---

## Success Criteria

### Measurable Outcomes

**SC-001: User Completion Rate**
- **Target**: >80% of users who start settings form complete it
- **Measure**: Track form abandonment points

**SC-002: Generation Speed**
- **Target**: Meal plan generation completes in <30 seconds for 95% of requests
- **Measure**: Log generation time, calculate p95

**SC-003: Personalization Quality**
- **Target**: Meal plans reflect user's cultural cuisine in >90% of cases
- **Measure**: Manual review of sample plans (10 per culture)

**SC-004: Restriction Adherence**
- **Target**: ZERO instances of suggesting restricted foods
- **Measure**: Automated tests + user reports

**SC-005: Edit Success Rate**
- **Target**: >70% of meal edits successfully regenerate in <20 seconds
- **Measure**: Track edit requests and completion time

**SC-006: User Satisfaction (Qualitative)**
- **Target**: Users describe meal plan as "personalized" not "generic"
- **Measure**: User interviews after 5+ users test

---

## Technical Constraints & Considerations

### AI Model Selection (Per Constitution)
- **MVP**: Use free/cheap models (Claude Haiku, GPT-4o-mini, Gemini Flash via OpenRouter)
- **Upgrade trigger**: If users report quality issues, upgrade to premium models for meal generation
- **Cost target**: <$0.10 per meal plan generation (MVP budget)

### Data Storage (MVP)
- **Settings**: localStorage (simple, no auth required)
- **Meal plans**: localStorage or sessionStorage (ephemeral for MVP)
- **Future migration**: When user auth is added, migrate to MongoDB (via ship-fast boilerplate)

### Architecture Notes
- Meals as independent entities: Design API endpoints to support per-meal regeneration
- Settings future-proofing: Structure data to nest under user profiles later (avoid breaking changes)
- Ship-fast integration: Use existing UI components (DaisyUI buttons, cards, forms)

---

## Out of Scope (For This Feature)

### Explicitly NOT Included in v1
- **User authentication**: Settings stored locally, no login required
- **Save meal plans**: Plans are ephemeral (generate, refine, use, regenerate next time)
- **Grocery list generation**: Future feature
- **Multi-day plans**: Only 1 day for MVP
- **Meal swap library**: No pre-built meal database
- **Nutrition education content**: Just meal plans, no articles/guides
- **Social features**: No sharing, no community
- **Payments**: Free to use for MVP

### Why These Are Deferred
- **Focus on core validation**: Does personalized AI meal generation provide value?
- **Avoid overhead work**: These are nice-to-haves that don't test core hypothesis
- **Ship in 1 week**: Adding these would extend timeline to 2-3 weeks

---

## Open Questions & Decisions Needed

### Questions to Resolve Before Planning
1. **AI model choice**: Start with Claude Haiku (fast, cheap) or GPT-4o-mini (better at structured output)?
2. **Tavily integration**: Include in MVP or defer to v2? (Constitution says validate nutritional claims)
3. **Snack default**: Should snacks be opt-in (user adds) or opt-out (included by default)?
4. **Macros display**: Show detailed macros (protein/carbs/fats) or just calories for simplicity?
5. **Cultural cuisine**: Free text input or dropdown of cuisines? (Free text = more flexible, dropdown = easier for AI)

### Decisions to Document
- **Data persistence strategy**: localStorage for MVP, migrate to MongoDB when auth added
- **AI prompt structure**: How to structure prompt to ensure restrictions are honored?
- **Error handling**: What's the retry strategy if AI generation fails?

---

## Next Steps

### After Spec Approval
1. **Technical Planning**: Run `/vibecode:plan` to define HOW to build this
2. **Decision Logging**: Document key decisions (AI model, data storage) in `.vibecode/memory/decisions/`
3. **Design System**: Create meal card component in `.vibecode/components-registry/`
4. **Implementation**: Run `/vibecode:tasks` to break plan into ordered tasks

---

## Appendix: User Flow Diagram (Text)

```
[Landing Page]
    ↓
[Settings Form]
 - Select Goal
 - Enter Biometrics
 - Cultural Context
 - Restrictions
    ↓
[Click "Generate Meal Plan"]
    ↓
[Loading State] (15-30s)
    ↓
[Meal Plan Display]
 - Breakfast Card (Edit button)
 - Lunch Card (Edit button)
 - Dinner Card (Edit button)
 - Daily Totals
    ↓
[User Clicks Edit on "Lunch"]
    ↓
[Edit Interface]
 - Text input: "Make it vegetarian"
 - Click "Regenerate Meal"
    ↓
[Loading State for Lunch only] (10-20s)
    ↓
[Updated Lunch Card]
 - New meal displayed
 - Daily totals updated
    ↓
[User can edit again or proceed]
```

---

**End of Specification**
