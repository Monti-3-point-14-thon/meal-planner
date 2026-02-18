---
skill: exp-driven-dev
category: builder
weight_default: low
source: Ronny Kohavi (Microsoft/Netflix), Airbnb experimentation culture
vibecoding_phases: [plan, implement]
---

# Experimentation-Driven Development

**One-line description:** Build features with A/B testing, feature flags, and data-driven decisions using proven experimentation frameworks.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** experiment, test, A/B, flag, metric, hypothesis, data, measurement, rollout, variant
- **Workflow phases:** plan, implement
- **Context signals:** Core metric changes, risky features, uncertain impact, gradual rollouts

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: HITS Experiment Design
**Source:** Ronny Kohavi (Microsoft, Netflix)
**When to use:** Testing new features or changes
**How to apply:**

**H - Hypothesis:**
> "We believe that [change] will cause [metric] to [increase/decrease] because [reason]"

**I - Implementation:**
- Feature flag setup
- Control vs Treatment groups
- Sample size calculation

**T - Test:**
- Run until statistical significance
- Monitor guardrail metrics
- Watch for unexpected effects

**S - Ship or Stop:**
- Ship if positive
- Stop if negative
- Iterate if inconclusive

**Example (Vibecoding Context):**
```markdown
Feature: New onboarding flow

Hypothesis:
"We believe that adding a product tour
will increase activation rate by 15%
because users are confused about core features."

Implementation:
- Control: Current onboarding (50% users)
- Treatment: Product tour (50% users)
- Sample: 1,000 users per variant
- Duration: 2 weeks

Test:
- Primary metric: Activation rate (completed first action)
- Guardrails: Time to activation, drop-off rate, support tickets

Ship or Stop:
- If activation +10% or more → Ship to 100%
- If activation -5% or less → Rollback
- If inconclusive → Extend test or redesign
```

**Questions to ask:**
- What metric am I trying to move?
- What's my hypothesis about why this will work?
- What's the minimum detectable effect?
- What guardrails prevent gaming the metric?

---

### Framework 2: Metric Selection (Primary + Guardrails)
**Source:** Netflix, Airbnb experimentation teams
**When to use:** Defining success for experiments
**How to apply:**

**Primary Metric:**
- ONE metric you're optimizing
- Directly tied to business value
- Clear success threshold

**Guardrail Metrics:**
- Metrics that shouldn't degrade
- Prevent unintended consequences
- Ensure quality maintained

**Example (Vibecoding Context):**
```markdown
Feature: Faster checkout flow

Primary Metric:
✅ Purchase completion rate
   - Current: 65%
   - Target: 75% (+10%)
   - Threshold: 70% (+5% minimum)

Guardrail Metrics:
⚠️ Cart abandonment (don't increase)
⚠️ Return rate (don't increase)
⚠️ Average order value (maintain)
⚠️ Support tickets (don't increase)
⚠️ Page load time (stay <2s)

Why Guardrails Matter:
Without them, we might "win" by:
- Removing payment verification (increases completion, hurts fraud)
- Hiding shipping costs (increases completion, hurts returns)
- Removing product details (faster checkout, more mistakes)
```

**Questions to ask:**
- What's the ONE metric I'm optimizing?
- What metrics might degrade if I game the primary?
- What's acceptable degradation on guardrails?
- What external factors might affect results?

---

### Framework 3: Feature Flag Architecture
**Source:** Stripe, GitLab, LaunchDarkly patterns
**When to use:** Gradual rollouts, safe deployments
**How to apply:**

**Pattern:**
```typescript
// Feature flag config
const FEATURES = {
  'new-checkout': {
    enabled: true,
    rollout: 10,  // 10% of users
    description: 'New streamlined checkout'
  }
};

// Check if enabled for user
function isEnabled(userId: string, feature: string): boolean {
  const config = FEATURES[feature];
  if (!config || !config.enabled) return false;

  // Consistent hashing (same user always same variant)
  const bucket = hash(userId) % 100;
  return bucket < config.rollout;
}

// Usage in code
if (isEnabled(user.id, 'new-checkout')) {
  return <NewCheckout />;
} else {
  return <OldCheckout />;
}
```

**Rollout Strategy:**
```
Day 1: 1% (test with small group)
Day 3: 5% (if metrics look good)
Day 5: 25% (if guardrails healthy)
Day 7: 50% (if no issues)
Day 10: 100% (full rollout)

At ANY point: Flip flag to 0% if problems
```

**Example (Vibecoding Context):**
```markdown
Feature: AI code suggestions

Rollout Plan:
- Week 1: 5% (internal team + beta users)
  → Metric: Usage rate, accuracy feedback
  → Guardrail: No performance degradation

- Week 2: 15% (if positive)
  → Metric: Retention of AI users
  → Guardrail: Non-AI users unaffected

- Week 3: 50% (if retention +20%)
  → Metric: Overall product engagement
  → Guardrail: Support ticket volume

- Week 4: 100% (if all metrics green)
  → Remove old code path
  → Delete feature flag

Rollback Plan:
- If accuracy <80%: Stop at 5%
- If performance issues: Instant rollback
- If support tickets +50%: Rollback and debug
```

**Questions to ask:**
- What's the rollback plan if something breaks?
- How fast can we disable the feature?
- What's the smallest test group?
- How will we know if it's working?

---

## Decision Trees

**Primary decision:** Should we experiment or just ship?

```
NEW FEATURE
  ↓
Q: Affects core business metric?
  - Yes → EXPERIMENT REQUIRED
  - No → Continue
      ↓
Q: High risk if wrong?
  - Yes → EXPERIMENT RECOMMENDED
  - No → Continue
      ↓
Q: Uncertain about impact?
  - Yes → EXPERIMENT USEFUL
  - No → Continue
      ↓
Q: Easy to A/B test?
  - Yes → WHY NOT EXPERIMENT?
  - No → Continue
      ↓
SHIP WITHOUT TEST
(But still use feature flag for gradual rollout)
```

---

## Skill Interactions

**Works with:**
1. Use `ship-decisions` to decide if feature is ready to test
2. Apply `exp-driven-dev` to test with real users
3. Use `metrics-frameworks` to choose right metrics
4. Apply `growth-embedded` to test growth features

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Plan experimentation:**

For features affecting core metrics:
- [ ] Define hypothesis (believe → cause → because)
- [ ] Choose primary metric + guardrails
- [ ] Calculate sample size needed
- [ ] Plan feature flag implementation
- [ ] Define rollout strategy
- [ ] Document rollback plan

Template:
```markdown
## Experiment Plan

**Hypothesis:**
We believe [change]
will cause [metric] to [increase/decrease]
because [reasoning]

**Metrics:**
- Primary: [metric] (target: [X]%)
- Guardrails: [list metrics that shouldn't degrade]

**Implementation:**
- Sample size: [X users per variant]
- Duration: [Y days]
- Rollout: 1% → 5% → 25% → 100%

**Success Criteria:**
- [ ] Primary metric improved by [X]%
- [ ] No guardrail degradation
- [ ] Statistical significance reached
- [ ] No unexpected negative effects

**Rollback Plan:**
- If [condition] → rollback immediately
- Monitor: [metrics] hourly during rollout
```

Document to: `.vibecode/memory/decisions/active/[date]-experiment-[feature].md`
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**Implement with feature flags:**

When building:
- [ ] Wrap in feature flag
- [ ] Instrument tracking for metrics
- [ ] Add gradual rollout config
- [ ] Test flag on/off toggle
- [ ] Document monitoring plan

Code template:
```typescript
// 1. Define feature flag
const FEATURES = {
  'feature-name': {
    enabled: true,
    rollout: 10,  // Start at 10%
    description: 'Feature description'
  }
};

// 2. Implement check
function NewFeature({ user }: Props) {
  if (!isEnabled(user.id, 'feature-name')) {
    return <OldFeature />;
  }

  // Track experiment assignment
  track('experiment_assigned', {
    userId: user.id,
    experiment: 'feature-name',
    variant: 'treatment'
  });

  return <NewFeatureImplementation />;
}

// 3. Track key actions
function onUserAction() {
  track('primary_metric_event', {
    userId: user.id,
    experiment: 'feature-name',
    value: metricValue
  });
}
```

Monitoring:
- [ ] Set up metric dashboard
- [ ] Alert on guardrail degradation
- [ ] Review metrics daily during rollout
- [ ] Document learnings for future experiments
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Core product changes, growth features, high-uncertainty features
**Optional for:** Bug fixes, internal tools, obvious improvements, low-traffic features

