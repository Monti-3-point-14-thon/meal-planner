---
skill: user-feedback-system
category: measurement
weight_default: low
source: Superhuman PMF framework, YC "talk to users"
vibecoding_phases: [specify, implement]
---

# User Feedback Systems

**One-line description:** Build feedback loops using Superhuman's PMF survey and YC's "talk to users" methodology.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** feedback, survey, pmf, product-market fit, nps, user research, interview
- **Workflow phases:** specify, implement
- **Context signals:** Measuring PMF, collecting feedback, user research

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: Superhuman PMF Survey
**Source:** Rahul Vohra (Superhuman)
**When to use:** Measuring product-market fit
**How to apply:**

**The Question:**
> "How would you feel if you could no longer use [product]?"
> - Very disappointed
> - Somewhat disappointed
> - Not disappointed

**PMF Threshold:**
- **>40% "very disappointed"** = strong PMF
- **<40%** = need to improve core value

**Follow-up Questions:**
- "What's the main benefit you get from [product]?"
- "What type of person would benefit most?"
- "How can we improve for you?"

**Example Implementation:**
```typescript
// Trigger after 2 weeks of use
const pmfSurvey = {
  question: "How disappointed if you couldn't use our AI code review?",
  options: ["Very disappointed", "Somewhat disappointed", "Not disappointed"],
  followUp: "What's the main benefit you get from it?",
  trigger: "after 14 days of active use"
};
```

---

### Framework 2: Talk to Users (YC Methodology)
**Source:** Y Combinator
**When to use:** Continuous user research
**How to apply:**

**The Approach:**
- **Weekly minimum:** 3-5 user conversations
- **Open-ended questions:** Not "would you use X?" but "how do you currently do Y?"
- **Watch them use product:** Screen shares reveal truth
- **Focus on jobs-to-be-done:** What are they hiring your product to do?

**Good Questions:**
- "Walk me through how you currently [task]"
- "What's frustrating about that?"
- "What workarounds have you tried?"
- "Show me how you use [product]"

**Bad Questions:**
- "Would you pay for this?" (they'll lie)
- "Do you like feature X?" (useless)
- "What features do you want?" (they don't know)

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Plan feedback collection:**

```markdown
## Validation Plan

**Target Users:** [Who to talk to]
**Sample Size:** [5-10 minimum]
**Method:**
- [ ] User interviews (watch them use prototype)
- [ ] PMF survey (after launch)
- [ ] Feature request tracking

**Success Criteria:**
- [ ] 40%+ "very disappointed" on PMF survey
- [ ] Users can articulate main benefit
- [ ] Clear jobs-to-be-done identified
```
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**Implement feedback system:**

```typescript
// PMF Survey (trigger after 2 weeks)
if (daysSinceSignup === 14) {
  showPMFSurvey({
    question: "How disappointed if couldn't use this?",
    options: ["Very", "Somewhat", "Not"],
    followUp: "What's the main benefit?"
  });
}

// In-app feedback widget
<FeedbackButton
  placeholder="What can we improve?"
  onSubmit={(feedback) => {
    track('feedback_submitted', {
      userId,
      feedback,
      context: currentPage
    });
  }}
/>

// User interview scheduler
<InterviewCTA>
  "Help us improve! Book a 15-min call"
  {/* Calendly link */}
</InterviewCTA>
```
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** Product launches, PMF validation, continuous discovery
**Optional for:** Internal tools, late-stage products with established PMF
