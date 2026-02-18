---
skill: launch-execution
category: launch
weight_default: low
source: April Dunford, Brian Chesky (Airbnb)
vibecoding_phases: [specify]
---

# Launch Execution

**One-line description:** Launch features effectively with clear positioning, messaging, and distribution strategy.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** launch, release, announcement, go-to-market, gtm, rollout, marketing
- **Workflow phases:** specify
- **Context signals:** Launching features, writing announcements, creating marketing materials

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework: Launch Announcement Structure
**Source:** April Dunford, Airbnb product marketing
**When to use:** Writing launch announcements
**How to apply:**

**The Structure:**
```markdown
# [Feature Name]: [One-line value prop]

## The Problem
[What pain does this solve? Make it relatable.]

## The Solution
[How does this feature work? Keep it simple.]

## Why It Matters
[Customer benefits, not feature lists]

## Get Started
[Clear call to action - one click away]

## Proof (Optional)
[Early user testimonials, metrics if available]
```

**Example (Vibecoding Context):**
```markdown
# AI Code Review: Ship Fast, Break Nothing

## The Problem
Solo founders spend 2+ hours daily reviewing code manually,
context-switching between building and quality checking.

## The Solution
AI Code Review gives you instant code reviews in <30 seconds.
Just push your code, get feedback immediately, fix issues before they ship.

## Why It Matters
- Save 10+ hours per week
- Catch bugs before production
- Ship with confidence
- Stay in flow (no context switching)

## Get Started
Enable in Settings → Integrations → AI Review
First 100 reviews free.

## Proof
"Caught 3 critical bugs in first day. Saved my launch." - @founder
```

---

### Launch Checklist

**Pre-Launch (1 week before):**
- [ ] Positioning clear (who, what, why)
- [ ] Announcement drafted
- [ ] Docs/help articles ready
- [ ] In-app onboarding updated
- [ ] Support team briefed (if applicable)

**Launch Day:**
- [ ] Announcement sent (email list)
- [ ] Social posts (Twitter, LinkedIn)
- [ ] In-app message/banner
- [ ] Product Hunt (if major launch)
- [ ] Monitor feedback channels

**Post-Launch (1 week after):**
- [ ] Track adoption metrics
- [ ] Collect user feedback
- [ ] Iterate on messaging
- [ ] Share early wins publicly
- [ ] Thank early adopters

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Plan launch strategy:**

```markdown
## Launch Strategy

**Positioning:**
- Who: [Target user]
- What: [Category/what is this]
- Why: [Unique value vs alternatives]

**Announcement:**
- Headline: [One-line value prop]
- Problem: [Pain point]
- Solution: [How it works]
- CTA: [What user should do]

**Distribution:**
- [ ] Email list (X subscribers)
- [ ] Twitter/social (X followers)
- [ ] In-app notification
- [ ] Product Hunt (if major)
- [ ] Blog post
- [ ] Docs update

**Success Metrics:**
- Activation: [X]% of users try it
- Adoption: [Y]% use it daily
- Feedback: <24h response time
```
<!-- COMMAND_SECTION_END: specify -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Major launches, new products, significant features
**Optional for:** Bug fixes, minor updates, internal features
