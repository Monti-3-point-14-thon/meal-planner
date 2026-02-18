---
skill: zero-to-launch
category: builder
weight_default: critical
source: Lenny's Podcast - Dylan Field (Figma), Brian Chesky (Airbnb), Greg Brockman (OpenAI)
vibecoding_phases: [specify, constitution]
---

# Zero to Launch

**One-line description:** MVP scoping playbook using proven frameworks from Figma, Airbnb, and OpenAI to ship focused products fast.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** mvp, prototype, launch, ship, validate, experiment, poc, pilot, first version, initial release
- **Workflow phases:** `/vibecode:specify` (primary), `/vibecode:constitution` (for project-level MVP thinking)
- **Context signals:** New features, unvalidated ideas, project kickoff, aggressive scope-forcing mode

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json` (enabled by default at critical weight for solo founders)

---

## Core Frameworks

### Framework 1: Figma Simplicity Test
**Source:** Dylan Field (Figma CEO) - Building a $20B design tool

**When to use:** Any time you're spec'ing a new feature, especially unvalidated ideas

**How to apply:**
1. Ask: **"If you could only ship ONE screen, which would it be?"**
2. Force the user to choose the absolute core of the feature
3. Everything else becomes "phase 2"

**Example (Vibecoding Context):**
```
User: "Build user dashboard with activity feed, settings, profile, analytics, notifications"

Apply Figma test:
Q: "If you could only ship ONE screen, which would it be?"
A: "Activity feed - that's what users come back for"

Result:
- Phase 1: Activity feed only
- Phase 2: Settings, profile
- Phase 3: Analytics, notifications

Ship Phase 1 in 3 days instead of 3 weeks
```

**Questions to ask:**
- "If you could only ship ONE screen, which would it be?"
- "Can you explain this feature in one Figma frame?"
- "What would you demo to a user in the first 30 seconds?"

**Power of this framework:**
- Forces prioritization by making choice painful
- Removes feature bloat before writing any code
- Creates urgency ("only ONE screen")
- Typical result: Cuts scope by 60-80%

---

### Framework 2: Airbnb Experience Mapping
**Source:** Brian Chesky (Airbnb CEO) - How Airbnb designs product experiences

**When to use:** After Figma test identifies core screen, map the minimal viable experience

**How to apply:**
1. **Entry point:** How does the user first encounter this feature?
2. **Main flow:** What are the 3-5 steps in the happy path?
3. **Success state:** What does success look like?
4. **Edge states:** Loading, error, empty state (don't skip these!)

**Example (Vibecoding Context):**
```
Feature: User profile page

Entry point:
- User clicks "Profile" in nav
- Lands on profile page

Main flow:
1. View current info (name, email, avatar)
2. Click "Edit" button
3. Update name/avatar
4. Click "Save"
5. See updated profile

Success state:
- Profile displays updated info
- Confirmation: "Profile updated successfully"

Edge states:
- Loading: Skeleton while fetching profile
- Error: "Failed to load profile. Retry?"
- Empty: New user has no avatar → show default

Result: Comprehensive experience in 5 states, all shippable
```

**Questions to ask:**
- "How does the user first encounter this feature?"
- "What are the 3-5 steps in the core journey?"
- "What does success look like for the user?"
- "What happens when it's loading? When it errors? When it's empty?"

**Power of this framework:**
- Maps complete experience, not just happy path
- Forces thinking about all states upfront
- Prevents "I forgot about loading state" moments post-launch
- Creates shippable, polished experience even for MVPs

---

### Framework 3: OpenAI First Principle Scoping
**Source:** Greg Brockman (OpenAI) - How OpenAI ships AI products

**When to use:** When feature feels too complex or uncertain

**How to apply:**
1. **Ask: "What's the simplest version a user would pay for?"**
2. **Strip away everything that's not essential to core value**
3. **Validate: "Can we learn what we need from this minimal version?"**

**Example (Vibecoding Context):**
```
Feature: "AI-powered code review system with auto-fix, learning, repo analysis, team insights"

Apply first principles:
Q: "What's the simplest version a user would pay for?"
A: "AI suggests one improvement per file"

Stripped away:
- Auto-fix (can add later)
- Learning (overkill for MVP)
- Repo analysis (nice-to-have)
- Team insights (separate feature)

MVP:
- Upload file
- AI returns 1-3 suggested improvements
- User applies manually

Result: Ship in 1 week, validate demand, iterate based on what users actually use
```

**Questions to ask:**
- "What's the simplest version a user would pay for?"
- "What can we remove without losing the core value?"
- "What do we need to learn from users before building more?"
- "If we only had 1 week, what would we ship?"

**Power of this framework:**
- Tests actual demand before over-building
- Creates forcing function around learning goals
- Prevents "we built it but no one wanted it"
- Focuses on user value, not technical impressiveness

---

## Decision Trees

**Primary decision:** How much to build for MVP?

```
IF feature is unvalidated (no user feedback yet):
  → Apply Figma Simplicity Test
  → Strip to ONE core screen/capability
  → Ask: "Can users get value from this alone?"
  → Ship minimal version in < 1 week

ELSE IF feature is validated but scope unclear:
  → Apply Airbnb Experience Mapping
  → Map full experience (entry, flow, success, edges)
  → Build complete experience, but minimal scope

ELSE IF feature feels too complex:
  → Apply OpenAI First Principles
  → Ask: "Simplest version users would pay for?"
  → Cut everything not essential

DEFAULT:
  → Apply Figma test first (always start here)
  → Then Airbnb mapping for experience completeness
```

---

## Action Templates

### Template 1: MVP Spec (Post Figma Test)
**Use case:** After identifying ONE core screen/capability
**Format:**
```markdown
# Feature: [Name]

## MVP Scope (Phase 1)
**Core capability:** [The ONE thing from Figma test]
**User value:** [Why this alone is valuable]
**Ship target:** [< 1 week]

## Experience Map (Airbnb Framework)
**Entry:** [How user encounters this]
**Flow:** [3-5 steps]
**Success:** [What success looks like]
**Edges:** [Loading, error, empty states]

## Phase 2 (Post-validation)
- [Feature cut from MVP]
- [Feature cut from MVP]
- [Will add based on user feedback]

## Success Criteria
- [ ] Users can [core job] without anything else
- [ ] All 4 states implemented (loading, error, empty, success)
- [ ] Ships in < 1 week
```

**Example:**
```markdown
# Feature: User Profile

## MVP Scope (Phase 1)
**Core capability:** View and edit name + avatar (ONE screen)
**User value:** Users can personalize their account
**Ship target:** 3 days

## Experience Map
**Entry:** Click "Profile" in navigation
**Flow:**
1. View current name/avatar
2. Click "Edit"
3. Change name, upload avatar
4. Save

**Success:** See updated profile with confirmation
**Edges:** Loading skeleton, upload error handling, no avatar (default icon)

## Phase 2 (Post-validation)
- Email change (requires verification flow)
- Password reset
- Account deletion
- Notification preferences
- [Will prioritize based on which users request most]

## Success Criteria
- [ ] Users can update profile without needing anything else
- [ ] All edge states polished
- [ ] Ships in 3 days
```

---

### Template 2: Scope Cut Decision Log
**Use case:** When cutting features from MVP
**Format:**
```markdown
# Scope Cut: [Feature Name]

**Cut from:** [Parent feature/MVP]
**Reason:** [Why cutting - Figma test result, unvalidated, not core value, etc.]
**Deferred to:** Phase 2 / Post-validation
**Will revisit when:** [Condition - user feedback, usage data, etc.]

## Value if we built it:
[What we'd gain]

## Cost of building it now:
[Time, complexity, distraction from core]

## Decision:
[Cut and revisit later]
```

---

## Quick Reference

**Key Questions:**
- [ ] "If you could only ship ONE screen, which would it be?" (Figma)
- [ ] "What are the 3-5 steps in the core journey?" (Airbnb)
- [ ] "What's the simplest version a user would pay for?" (OpenAI)
- [ ] "Can users get value from this alone, without anything else?"
- [ ] "What do we need to learn before building more?"

**Checklists:**
- [ ] Applied Figma test → ONE core thing identified
- [ ] Applied Airbnb mapping → Full experience (4 states)
- [ ] Scope can ship in < 1 week
- [ ] Phase 2 features explicitly deferred
- [ ] Success criteria defined

**Memorable Quotes:**
> "If you could only ship ONE screen, which would it be?"
> — Dylan Field, Figma

> "Design the complete experience, even if it's simple."
> — Brian Chesky, Airbnb

> "What's the simplest version users would pay for?"
> — Greg Brockman, OpenAI

---

## Common Pitfalls

**Anti-pattern 1:** "Let's build a complete dashboard with analytics, settings, profile, and notifications"
**Why it fails:** Scope too broad, takes 3 weeks, no single clear value prop
**Instead:** Figma test → Pick ONE (likely analytics if that's core value), ship in 3 days, validate, add rest based on feedback

**Anti-pattern 2:** "MVP is just the happy path, we'll add error handling later"
**Why it fails:** Users hit errors immediately, product feels broken, bad first impression
**Instead:** Airbnb mapping → All 4 states (loading, error, empty, success) from day 1, polished MVP not rushed MVP

**Anti-pattern 3:** "We need X before we can launch Y"
**Why it fails:** Creates dependencies, delays learning, waterfall thinking
**Instead:** OpenAI first principles → What's the simplest version that delivers value? Ship that alone, validate, iterate

---

## Related Skills

**Works well with:**
- `ship-decisions` - After scoping MVP, decide when to ship vs. add more
- `strategic-build` - Use LNO framework to classify MVP features (often Neutral or Leverage)
- `jtbd-building` - Understand the job to be done, then scope MVP to that job alone

**Sequence suggestions:**
1. Apply `zero-to-launch` first to scope the MVP (this skill)
2. Then apply `jtbd-building` to validate the user need is real
3. Then apply `ship-decisions` to decide when to ship phase 1

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
- **Primary activation point** - This skill is CRITICAL for specification phase
- When scope-forcing = "aggressive": Apply Figma test proactively
- When scope-forcing = "balanced": Suggest Figma test if feature seems > 1 week
- When scope-forcing = "consultative": Mention Figma test as option

**Changes these questions:**
- "What's the ONE core job users need to accomplish?" (Figma influence)
- "If you could only ship ONE screen, which would it be?"
- "Can you explain this feature in one sentence?"
- "What are the 3-5 steps in the user journey?" (Airbnb influence)

**Adds these sections to spec:**
- MVP Scope (Phase 1) vs. Phase 2 split
- Experience Map (Entry, Flow, Success, Edges)
- Scope cut decision log (what was cut and why)
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
- Reference MVP scope from spec
- Don't build Phase 2 features in plan
- Architecture should support MVP scope, be extensible for Phase 2
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: tasks -->
### In /vibecode:tasks
- Tasks should match MVP scope only
- Can include "Future: Phase 2" section but don't create tasks for it yet
- Add ship checkpoint after Phase 1 tasks
<!-- COMMAND_SECTION_END: tasks -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
- Build only what's in MVP scope
- Resist adding "quick extras" that weren't scoped
- Update component registry for Phase 1 components only
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical` (for solo founders, MVP builders)
**Recommended for:** Solo founders, early-stage startups, unvalidated features, rapid prototyping
**Optional for:** Large teams with PM, validated features, established products

**Enable:**
```json
{
  "skills": {
    "builder": {
      "zero-to-launch": {
        "enabled": true,
        "weight": "critical"
      }
    }
  }
}
```

**Adjust weight based on context:**
- `critical` (10): Building MVPs, unvalidated features, aggressive shipping
- `high` (7-9): Validated features but want to scope tightly
- `medium` (4-6): Established product, some features can be broader
- `low` (1-3): Large team, PM handles scoping, AI assists with implementation only

---

## Version History

- **v0.1.0** (2026-02-16): Initial skill file created for vibecoding framework, adapted from awesome-pm-skills Figma/Airbnb/OpenAI frameworks
