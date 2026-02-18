---
skill: metrics-frameworks
category: measurement
weight_default: low
source: North Star framework, AARRR (Pirate Metrics)
vibecoding_phases: [specify, constitution]
---

# Metrics Frameworks

**One-line description:** Choose the right metrics using North Star framework and AARRR to measure what matters (not vanity metrics).

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** metrics, measurement, kpi, analytics, dashboard, north star, aarrr, tracking
- **Workflow phases:** specify, constitution
- **Context signals:** Choosing metrics, defining success criteria, instrumenting analytics

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: North Star Metric
**Source:** Amplitude, product analytics best practices
**When to use:** Defining product success metric
**How to apply:**

**Definition:**
> The ONE metric that best captures the core value you deliver to customers

**Good North Star:**
- Measures value delivery (not vanity)
- Leading indicator of revenue
- Captures product vision
- Actionable by team

**Examples:**
- Airbnb: Nights booked
- Slack: Messages sent by teams
- Spotify: Time listening
- **For code tool:** Code reviews completed

---

### Framework 2: AARRR (Pirate Metrics)
**Source:** Dave McClure
**When to use:** Instrumenting full product analytics
**How to apply:**

**The 5 Metrics:**
- **Acquisition:** How users find you
- **Activation:** First value experience
- **Retention:** Users coming back
- **Revenue:** Monetization
- **Referral:** Viral growth

**Example (Vibecoding Context):**
```markdown
Product: AI Code Review Tool

Acquisition:
- Signups per day: 50
- Channels: Product Hunt, Twitter, SEO

Activation:
- First review completed: 60% (within 24h)
- Time to first value: 8 minutes (target: <5 min)

Retention:
- Day 1: 70%
- Day 7: 45%
- Day 30: 25%

Revenue:
- Free → Paid conversion: 8%
- ARPU: $29/month
- LTV: $348

Referral:
- K-factor: 0.3
- Referral rate: 15% of users refer
```

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: constitution -->
### In /vibecode:constitution
**Define North Star:**

```markdown
## Product Metrics

**North Star Metric:** [ONE metric that captures core value]
- Current: [X]
- Target: [Y]
- Why this metric: [rationale]

**Supporting Metrics (AARRR):**
- Acquisition: [metric]
- Activation: [metric]
- Retention: [metric]
- Revenue: [metric]
- Referral: [metric]
```
<!-- COMMAND_SECTION_END: constitution -->

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Define success metrics:**

For each feature:
```markdown
## Success Metrics

**Primary Metric:** [The ONE outcome metric]
- Current: [baseline]
- Target: [goal]
- Timeline: [when to measure]

**Secondary Metrics:**
- [Supporting metric 1]
- [Supporting metric 2]

**Anti-Metrics (Guardrails):**
- [What shouldn't degrade]
```
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Product launches, feature specification, analytics setup
**Optional for:** Internal tools, experiments (use simpler metrics)
