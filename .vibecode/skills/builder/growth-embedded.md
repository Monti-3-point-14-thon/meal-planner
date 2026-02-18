---
skill: growth-embedded
category: builder
weight_default: low
source: Gustaf Alstromer (YC), Casey Winters, Elena Verna
vibecoding_phases: [specify, plan, implement]
---

# Growth-Embedded Development

**One-line description:** Build growth loops, viral mechanics, and retention hooks into products from day 1 using YC playbook and growth frameworks.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** growth, viral, referral, share, retention, activation, onboarding, loop, network, k-factor
- **Workflow phases:** specify, plan, implement
- **Context signals:** Features with sharing potential, user onboarding, retention features, referral systems

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: YC Growth Playbook (Retention First)
**Source:** Gustaf Alstromer, Partner at YC
**When to use:** Prioritizing growth work
**How to apply:**

**Core Principle:**
> "Retention first, activation second, acquisition last. Don't pour water into a leaky bucket."

**The Three Levers (in order):**

**1. Retention (Fix First)**
- Do users come back?
- Measure: Day 1, Day 7, Day 30 retention
- Goal: >40% Day 1, >20% Day 7 for consumer

**2. Activation (Fix Second)**
- Do users get value quickly?
- Measure: Time to "aha moment"
- Goal: <5 minutes to first value

**3. Acquisition (Fix Last)**
- Only after retention + activation work
- Don't acquire users you can't retain

**Example (Vibecoding Context):**
```markdown
Building MVP Dashboard Feature:

❌ WRONG ORDER:
1. Build viral sharing
2. Add referral program
3. Optimize onboarding
4. Fix retention

✅ RIGHT ORDER:
1. Fix retention (make dashboard useful daily)
   → Metric: 30% weekly active users
   → Test: Do users return without prompting?

2. Fix activation (fast time to value)
   → Metric: 80% see first insight in <2 min
   → Test: Onboarding flow optimized

3. Add acquisition (only after 1+2 work)
   → Metric: Referral program, viral loops
   → Test: Users invite teammates
```

**Questions to ask:**
- What's current Day 7 retention? (If <20%, fix this first)
- How long until users see value? (If >5 min, fix this second)
- Only then: How will users discover this?

---

### Framework 2: Growth Loops
**Source:** Casey Winters
**When to use:** Designing features with viral mechanics
**How to apply:**

**Core Principle:**
> "The best growth loops are built into the product, not bolted on."

**Growth Loop Structure:**
```
User gets value → Action creates visibility → New users see it → Cycle repeats
```

**Loop Types:**

**1. Content Loop:**
- User creates content → Shared publicly → Others discover → Cycle
- Example: Medium articles, Notion docs, GitHub repos

**2. Collaboration Loop:**
- User invites teammate → Both get value → Invite more → Cycle
- Example: Slack, Figma, Notion

**3. Incentive Loop:**
- User refers friend → Both get reward → Friend refers → Cycle
- Example: Dropbox, Superhuman, Robinhood

**Example (Vibecoding Context):**
```markdown
Feature: Shareable component gallery

Growth Loop:
1. User builds component in your product
2. User shares component to gallery (public or team)
3. Others discover component via search/browse
4. Others use component, build more
5. Loop repeats

Implementation:
- Make sharing ONE CLICK (low friction)
- Show "X people used this" (social proof)
- Notify creator when others use it (reward)
- Surface popular components (discovery)
```

**Questions to ask:**
- How does using this feature create visibility?
- What value does a user get from sharing?
- How do new users discover this?
- What makes the loop self-reinforcing?

---

### Framework 3: Referral Mechanics
**Source:** Dropbox playbook
**When to use:** Adding referral systems
**How to apply:**

**Double-Sided Incentive:**
```
Referrer gets: [tangible benefit]
Referred gets: [tangible benefit]
Both win: [immediate value]
```

**Keys to Success:**
1. **Immediate value** (not "maybe later")
2. **Easy to share** (one click)
3. **Clear benefit** (not vague)
4. **Works for both** (not one-sided)

**Example (Vibecoding Context):**
```markdown
Feature: Referral system for design tool

Incentive Structure:
- Referrer: +5 free assets
- Referred: Free month Pro
- Both: Unlock team collaboration features

Implementation:
```typescript
function generateReferralLink(user: User) {
  const link = `app.com/ref/${user.id}`;

  track('referral_link_generated', {
    userId: user.id
  });

  return link;
}

function onReferralSignup(referralCode: string, newUser: User) {
  const referrer = getUserByRefCode(referralCode);

  // Reward both immediately
  giveReward(referrer, 'free_assets', 5);
  giveReward(newUser, 'pro_trial', 30);

  track('referral_converted', {
    referrerId: referrer.id,
    referredId: newUser.id
  });
}
```

Metrics to track:
- Link generation rate (% of users)
- Share rate (% who share link)
- Conversion rate (clicks → signups)
- Activation rate (signups → active users)
- K-factor (viral coefficient)
```

**Questions to ask:**
- What's valuable to both sides?
- Can we make sharing effortless?
- Is the benefit immediate?
- Will users naturally want to share?

---

## Decision Trees

**Primary decision:** Should this feature have growth mechanics?

```
NEW FEATURE
  ↓
Q: Can users share this?
  - Yes → Add sharing functionality
  - No → Continue
      ↓
Q: Does this create network effects?
  - Yes → Optimize for viral loops
  - No → Continue
      ↓
Q: Is this a first-time experience?
  - Yes → Optimize activation (time to value <5 min)
  - No → Continue
      ↓
Q: Is this a repeat-use feature?
  - Yes → Instrument retention tracking
  - No → Standard feature (still track basic analytics)
```

---

## Skill Interactions

**Works with:**
1. Use `zero-to-launch` to define MVP with growth built in
2. Apply `growth-embedded` to add viral mechanics
3. Use `exp-driven-dev` to A/B test growth features
4. Apply `metrics-frameworks` to measure growth loops

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Growth opportunity check:**

For each feature, ask:
- [ ] Can users share this? (add sharing)
- [ ] Does this create network effects? (optimize virality)
- [ ] Is this first-time use? (optimize activation)
- [ ] Is this repeat-use? (optimize retention)

Include in spec:
```markdown
## Growth Mechanics

**Viral potential:**
- Sharing mechanism: [yes/no, how]
- Network effects: [yes/no, type]

**Activation:**
- Time to value target: [<5 min]
- Aha moment: [what user experiences]

**Retention:**
- Usage frequency: [daily/weekly/monthly]
- Retention hooks: [what brings users back]
```
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Growth loop design:**

If feature has viral potential:
- [ ] Design growth loop (user → value → visibility → new users)
- [ ] Plan referral mechanics (incentive structure)
- [ ] Define activation flow (onboarding to aha moment)
- [ ] Identify retention hooks (what brings users back)

Document to: `.vibecode/memory/decisions/active/[date]-growth-[feature].md`

Template:
```markdown
## Growth Loop

**Loop type:** [content/collaboration/incentive]

**Flow:**
1. User action: [what user does]
2. Value created: [what they get]
3. Visibility: [who sees it]
4. New users: [how they discover]
5. Cycle repeats

**Metrics:**
- K-factor target: [>1.0 for viral]
- Activation rate: [>50%]
- Retention D7: [>20%]
```
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**Growth instrumentation:**

When implementing:
- [ ] Track sharing actions
- [ ] Track referral conversions
- [ ] Track activation milestones
- [ ] Track retention cohorts

Code patterns:
```typescript
// Track sharing
track('feature_shared', {
  userId,
  channel: 'link|email|social',
  featureId
});

// Track referral
track('referral_converted', {
  referrerId,
  referredId,
  timeToConversion
});

// Track activation
track('user_activated', {
  userId,
  timeToActivation,
  activationMilestone: 'first_value'
});

// Track retention
track('user_retained_d7', {
  userId,
  cohort: signupWeek
});
```
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Consumer products, network-effect products, viral features
**Optional for:** Internal tools, non-shareable features, B2B enterprise (different growth dynamics)

