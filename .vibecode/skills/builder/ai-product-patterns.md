---
skill: ai-product-patterns
category: builder
weight_default: critical
source: Lenny's Podcast - Kevin Weil (OpenAI CPO), Lenny Rachitsky (AI product patterns)
vibecoding_phases: [specify, plan, implement]
---

# AI Product Patterns

**One-line description:** AI-specific product guidance - evals as specifications, model selection, cost modeling, and quality measurement for AI features.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** ai, llm, gpt, chatbot, ml, model, agent, neural, training, generation, embedding, completion, prompt, openai, claude, anthropic
- **Workflow phases:** `/vibecode:specify` (initial context), `/vibecode:plan` (primary), `/vibecode:implement`
- **Context signals:** Feature description mentions AI/ML, spec contains AI keywords

### Manual Activation
Enable when building AI-powered features

---

## Core Frameworks

### Framework 1: Evals as Specifications
**Source:** Kevin Weil (OpenAI CPO) - "Evals are to AI products what unit tests are to traditional software"

**Core principle:** Define success criteria BEFORE building

**How to apply:**
1. **Before writing any AI code**, create eval suite
2. **10-20 test cases** with inputs + expected outputs
3. **Clear pass/fail criteria** for each test
4. **Treat evals like unit tests** - run on every change

**Example (Vibecoding Context):**
```markdown
# AI Evals: Code Review Assistant

## Eval 1: Simple Bug Detection
**Input:**
```python
def calculate(x):
    return x / 0  # Division by zero
```

**Expected Output:**
- Detects division by zero error
- Suggests: "Use conditional check before division"
- Severity: HIGH

**Pass Criteria:** Identifies the bug + suggests valid fix
**Fail Example:** Misses the bug or suggests unrelated fix

## Eval 2: Code Quality Suggestion
**Input:**
```python
def f(a,b,c):
    return a+b+c
```

**Expected Output:**
- Suggests: "Use descriptive function and variable names"
- Example: "def calculate_sum(first, second, third)"

**Pass Criteria:** Identifies naming issue + provides concrete example
```

**Why this matters:**
- Forces clarity on what "good AI output" means
- Catches regressions immediately
- Creates shared understanding of quality
- Typical result: 80%+ pass rate before launch

---

### Framework 2: Model Selection Framework
**Source:** Kevin Weil (OpenAI) - How to choose AI models

**The Spectrum:**
```
← Free Models          Paid Models →
  (Llama, Mistral)     (GPT-4, Claude)

Cost:     $0             $$$
Quality:  Good           Excellent
Latency:  Fast           Variable
Privacy:  Full control   API-dependent
```

**Decision factors:**
1. **Budget:** What's acceptable cost per request?
2. **Quality:** How critical is output quality?
3. **Latency:** Real-time (<500ms), Interactive (<3s), or Async (>5s)?
4. **Volume:** Requests per month?
5. **Privacy:** Sensitive data concerns?

**Cost calculation:**
```
Monthly cost = Requests/month × Avg tokens × Cost per token

Example:
10K requests × 1000 tokens × $0.002 (GPT-3.5) = $20/month
10K requests × 1000 tokens × $0.03 (GPT-4) = $300/month
```

**Decision tree:**
```
IF cost-sensitive + acceptable quality:
  → Start with GPT-3.5 or Llama
  → Upgrade if quality insufficient

ELSE IF quality-critical (customer-facing):
  → GPT-4 or Claude
  → Budget for higher cost

ELSE IF privacy-sensitive:
  → Self-hosted (Llama, Mistral)
  → Accept quality/latency trade-offs
```

---

### Framework 3: Latency Requirements
**Source:** OpenAI product patterns

**Three categories:**

**Real-time (<500ms)**
- **Use case:** Chat, autocomplete, live suggestions
- **Limitations:** Restricts model choice, requires optimization
- **Implications:** Can't use largest models, need caching/streaming

**Interactive (<3s)**
- **Use case:** Most features, content generation, analysis
- **Sweet spot:** Most models work, users tolerate brief wait
- **Implications:** Standard approach, no special optimization

**Async (>5s)**
- **Use case:** Background jobs, email generation, bulk processing
- **Freedom:** Any model, complex prompts, can retry
- **Implications:** Queue-based, show progress, email when done

**Ask during planning:**
- "How latency-sensitive is this use case?"
- "Can users wait 2-3 seconds or needs instant response?"

---

### Framework 4: Fallback Strategy
**Source:** AI reliability patterns

**AI APIs fail. Plan for it:**

**Failure modes:**
- Timeout (model slow)
- Rate limit (too many requests)
- Downtime (API unavailable)
- Quality failure (output doesn't pass evals)

**Fallback options:**

**1. Cached Response**
```javascript
try {
  result = await ai.generate(prompt)
  cache.set(input, result)
  return result
} catch (error) {
  cachedResult = cache.get(input)
  if (cachedResult) return cachedResult
  return fallbackResponse()
}
```

**2. Degraded Mode**
- Show non-AI version
- Example: AI summarization fails → Show full text

**3. Queue for Retry**
- Add to background queue
- Process when API available
- Email user when ready

**4. Generic Message**
- "AI assistant temporarily unavailable"
- Graceful degradation

**Decision:**
```
IF user-blocking (can't proceed without AI):
  → Cached response or retry

ELSE IF nice-to-have:
  → Degraded mode (show non-AI version)

ELSE IF can be async:
  → Queue for background processing
```

---

### Framework 5: Quality Measurement
**Source:** AI product metrics

**How to track AI quality over time:**

**1. Automated Evals (Run on every deploy)**
- Your eval suite → Pass rate %
- Target: 80%+ pass rate

**2. Human Review Loop**
- Sample X% of outputs
- Human rates quality
- Identify patterns in failures

**3. User Feedback**
- 👍👎 buttons on AI outputs
- "Was this helpful?" prompts
- Track feedback rate

**4. A/B Testing**
- Test different prompts/models
- Measure: quality, cost, latency
- Iterate based on data

**Key metrics:**
- Eval pass rate (automated)
- Human review score (sampled)
- User satisfaction (feedback)
- Cost per request
- Latency P50/P95

---

## Decision Trees

**Primary decisions for AI features:**

```
DURING SPECIFY:
  → Note this is AI feature
  → Ask about latency requirements (real-time/interactive/async)
  → Initial quality expectations

DURING PLAN:
  → Model selection (budget, quality, latency, privacy)
  → Evals strategy (create eval suite BEFORE building)
  → Fallback plan (cached, degraded, queue, generic)
  → Cost modeling (estimate monthly spend)
  → Quality measurement approach

DURING IMPLEMENT:
  → Build eval suite FIRST
  → Implement with fallback
  → Add usage logging (track costs)
  → Test against eval suite before shipping
```

---

## Action Templates

### Template 1: AI Feature Plan
**Use case:** Planning any AI feature
```markdown
# AI Feature: [Name]

## Model Selection
**Model:** [GPT-4 | Claude | Llama | etc.]
**Rationale:** [Why this model - quality, cost, latency, privacy]
**Cost estimate:** [Requests/month × tokens × cost/token = $X/month]
**Acceptable budget:** [$Y/month]

## Evals Strategy
**Eval suite location:** `.vibecode/specs/[feature]/ai-evals.md`
**Test cases:** [10-20 examples]
**Pass criteria:** [80%+ pass rate]
**Review frequency:** [On every deploy]

## Latency Requirements
**Category:** [Real-time <500ms | Interactive <3s | Async >5s]
**User expectation:** [What users tolerate]
**Implications:** [Model/architecture constraints]

## Fallback Strategy
**If API fails:** [Cached response | Degraded mode | Queue retry | Generic message]
**Graceful degradation:** [How feature works without AI]

## Quality Measurement
**Automated:** Eval pass rate (target 80%+)
**Manual:** [Human review X% of outputs]
**User feedback:** [👍👎 or "Was this helpful?"]
**Iteration plan:** [A/B test prompts, adjust based on feedback]

## Prompt Strategy
**Complexity:** [Simple | Moderate | Complex]
**Version control:** [Yes - in .vibecode/memory/ai-prompts/ | No - in app]
**Iteration:** [How we improve prompts over time]
```

---

## Quick Reference

**Pre-build checklist:**
- [ ] Eval suite created (10-20 test cases)
- [ ] Model selected (budget × quality × latency)
- [ ] Cost modeled (estimate monthly spend)
- [ ] Fallback plan defined
- [ ] Quality measurement approach decided

**During implementation:**
- [ ] Build eval suite FIRST (before AI code)
- [ ] Implement with try/catch + fallback
- [ ] Add usage logging
- [ ] Test against evals (80%+ pass rate)
- [ ] Deploy with monitoring

**Memorable Quotes:**
> "Evals are to AI products what unit tests are to traditional software."
> — Kevin Weil, OpenAI CPO

---

## Common Pitfalls

**Anti-pattern 1:** Build AI feature first, create evals later
**Why it fails:** No clarity on what "good" looks like, hard to measure progress
**Instead:** Evals first → gives you target to build toward

**Anti-pattern 2:** No fallback strategy
**Why it fails:** API fails → entire feature broken, bad UX
**Instead:** Cached response, degraded mode, or graceful error from day 1

**Anti-pattern 3:** No cost tracking until bill arrives
**Why it fails:** Surprise $1000 bill, need to scramble to optimize
**Instead:** Model costs during planning, log usage from day 1, set alerts

---

## Related Skills

**Works well with:**
- `zero-to-launch` - MVP AI features (start simple, validate, iterate)
- `decision-frameworks` - AI decisions are critical (model choice, prompts, fallbacks)
- `quality-speed` - Balance prototype (iterate prompts) vs robust (eval suite)

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**Use:** Note AI feature, initial context
- Detect AI keywords → flag as AI feature
- Ask: "How latency-sensitive?" (real-time/interactive/async)
- Set expectations for planning phase
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**Primary use:** All AI-specific decisions
- Model selection questions
- Cost calculation
- Evals strategy (create eval suite location)
- Fallback planning
- Quality measurement approach
- Document all decisions to: `.vibecode/memory/decisions/active/[date]-ai-[feature].md`
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**Use:** Build with AI patterns
- Create eval suite FIRST (before AI code)
- Implement with fallback
- Add usage logging
- Test against evals before shipping
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `critical` (for AI features only)
**Recommended for:** Any feature using LLMs/AI
**Auto-activates:** When AI keywords detected

```json
{
  "skills": {
    "builder": {
      "ai-product-patterns": {
        "enabled": true,
        "weight": "critical"
      }
    }
  }
}
```

---

## Version History

- **v0.1.0** (2026-02-16): Initial skill file, adapted from Kevin Weil (OpenAI) frameworks
