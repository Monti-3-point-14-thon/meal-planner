---
skill: ai-startup-building
category: builder
weight_default: low
source: Dan Shipper (Every), Brandon Chu (Shopify), 2025 AI best practices
vibecoding_phases: [specify, plan, implement]
---

# AI-Native Startup Building

**One-line description:** Build AI-first products using modern prompt engineering, cost optimization, and AI-native UX patterns for 2025+.

---

## When This Skill Activates

### Automatic Triggers
- **Feature keywords:** ai, llm, prompt, model, gpt, claude, anthropic, openai, ml, embedding, vector, rag, agent
- **Workflow phases:** specify, plan, implement
- **Context signals:** AI feature development, prompt engineering, model selection, cost optimization

### Manual Activation
Users can force-enable via `.vibecode/pm-skills-config.json`

---

## Core Frameworks

### Framework 1: AI-Native Startup Playbook
**Source:** Dan Shipper (Built 5 AI products → 7-fig revenue)
**When to use:** Building AI-first products as solo founder
**How to apply:**

**Core Principle:**
> "AI makes small teams as powerful as large teams. Ship fast, learn from users, iterate with AI."

**The 4 Pillars:**

**1. Build Fast with AI**
- Use AI to write code, design, copywriting
- Prototype in days, not months
- Focus on core value prop

**2. Test with Real Users Immediately**
- Launch to small group (10-50 users)
- Don't wait for perfect
- Learn what users actually need

**3. Iterate Based on Usage**
- Watch how users actually use it
- Double down on what works
- Cut what doesn't

**4. Distribution > Perfect Product**
- AI products are commoditizable
- Distribution is moat (SEO, integrations, community)
- Ship good-enough, grow fast

**Example (Vibecoding Context):**
```markdown
Building AI Code Review Feature:

❌ SLOW APPROACH:
1. Research all LLMs (2 weeks)
2. Build perfect prompts (1 week)
3. Create extensive tests (1 week)
4. Launch when "ready" (never)

✅ FAST APPROACH:
1. Use Claude API (1 day)
2. Write basic prompt (1 day)
3. Ship to 10 beta users (1 day)
4. Iterate based on feedback (ongoing)

Result: Ship in 3 days, learn what users need, iterate fast
```

**Questions to ask:**
- What's the simplest AI feature I can ship in 3 days?
- Can I use AI to build this faster?
- How do I get feedback from real users this week?
- What's my distribution strategy?

---

### Framework 2: 2025 Prompt Engineering Best Practices
**Source:** Brandon Chu (Shopify), OpenAI/Anthropic guidelines
**When to use:** Implementing AI features
**How to apply:**

**Modern Approach (2025):**

**1. Structured Outputs (Use JSON)**
```typescript
// ❌ OLD: Unstructured text
const prompt = "Analyze this code and tell me what's wrong";
// Response: "Well, I see a few issues..."

// ✅ NEW: Structured JSON
const prompt = `Analyze this code. Return JSON:
{
  "issues": [
    {"severity": "high|medium|low", "line": number, "description": string}
  ],
  "suggestions": [string]
}`;
// Response: Parseable, testable, reliable
```

**2. Implement Streaming**
```typescript
// Show partial results as they arrive
async function* streamCompletion(prompt: string) {
  for await (const chunk of ai.stream(prompt)) {
    yield chunk; // User sees progress
  }
}
```

**3. Retry Logic**
```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

**4. Model Switching (Not Locked In)**
```typescript
// Abstract away provider
interface AIProvider {
  complete(prompt: string): Promise<string>;
}

class OpenAIProvider implements AIProvider { ... }
class AnthropicProvider implements AIProvider { ... }

// Easy to swap
const ai: AIProvider = new AnthropicProvider();
```

**Questions to ask:**
- Am I using structured outputs (JSON)?
- Do users see progress (streaming)?
- What happens if the API fails?
- Can I swap models easily?

---

### Framework 3: Cost Optimization
**Source:** AI startup best practices (2025)
**When to use:** Scaling AI products
**How to apply:**

**The 3 Levers:**

**1. Caching (80% savings potential)**
```typescript
// Cache common queries
const cache = new Map<string, string>();

async function cachedCompletion(prompt: string): Promise<string> {
  const cacheKey = hash(prompt);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!; // Free!
  }

  const result = await ai.complete(prompt);
  cache.set(cacheKey, result);
  return result;
}

// Example: Code review for same file → cache hit
```

**2. Model Routing (50% savings potential)**
```typescript
// Simple queries → cheap model
// Complex queries → expensive model

function selectModel(prompt: string): Model {
  const complexity = analyzeComplexity(prompt);

  if (complexity === 'simple') {
    return 'haiku'; // $0.80 / 1M tokens
  } else {
    return 'sonnet'; // $3 / 1M tokens
  }
}

// Example:
// "Fix typo" → Haiku
// "Refactor architecture" → Sonnet
```

**3. Batching (30% savings potential)**
```typescript
// Batch similar requests together
const queue: string[] = [];

setInterval(() => {
  if (queue.length > 0) {
    const batch = queue.splice(0, 10);
    processBatch(batch); // One API call for 10 items
  }
}, 1000); // Every second
```

**Cost Analysis Example:**
```markdown
Feature: AI code suggestions (1000 requests/day)

Before Optimization:
- Model: Claude Sonnet ($3/1M tokens)
- Average tokens: 2000 per request
- Cost: 1000 * 2000 * $3/1M = $6/day = $180/month

After Optimization:
1. Caching (80% hit rate):
   - Paid requests: 200/day
   - Cost: $36/month (save $144)

2. Model routing (60% simple → Haiku):
   - Simple: 120 * $0.80/1M = $4.80
   - Complex: 80 * $3/1M = $7.20
   - Cost: $12/month (save $24 more)

Total: $180 → $12 (93% reduction)
```

**Questions to ask:**
- What's cacheable?
- Which queries are simple vs complex?
- What can be batched vs needs real-time?
- What's cost per user?

---

### Framework 4: AI-Native UX Patterns
**Source:** Modern AI product design (2025)
**When to use:** Designing AI features
**How to apply:**

**Key Patterns:**

**1. Progressive Enhancement**
```
Start: Show baseline result immediately
Then: Stream AI improvements
Finally: Polish with full context
```

**2. Confidence Indicators**
```
High confidence: Show result boldly
Medium: Show with "AI suggested"
Low: Show as optional, ask for feedback
```

**3. Edit, Don't Replace**
```
❌ BAD: AI replaces user's work
✅ GOOD: AI suggests, user accepts/rejects
```

**Example (Vibecoding Context):**
```markdown
Feature: AI code completion

UX Flow:
1. User types code
2. AI suggests completion (grayed out)
3. User presses Tab to accept OR keeps typing to ignore
4. If accepted, track for future improvement

NOT:
- Auto-replacing user's code
- Forcing AI suggestions
- No way to reject
```

**Questions to ask:**
- Does user maintain control?
- Is AI help optional, not forced?
- Can user see confidence level?
- Can user correct AI mistakes?

---

## Decision Trees

**Primary decision:** Should I build this AI feature?

```
AI FEATURE IDEA
  ↓
Q: Can I ship MVP in <1 week?
  - No → Simplify scope
  - Yes → Continue
      ↓
Q: Do I have 10 users to test with?
  - No → Get users first
  - Yes → Continue
      ↓
Q: What's the fallback if AI fails?
  - None → Add fallback
  - Has fallback → Continue
      ↓
Q: What's cost per user?
  - >$5 → Optimize first
  - <$5 → Ship and learn
```

---

## Skill Interactions

**Works with:**
1. Use `ai-product-patterns` for technical implementation details
2. Apply `ai-startup-building` for startup-specific strategy
3. Use `ship-decisions` to decide when AI feature is ready
4. Apply `exp-driven-dev` to A/B test AI features

**Note:** `ai-product-patterns` focuses on technical patterns (evals, latency, model selection). This skill (`ai-startup-building`) focuses on startup strategy (fast shipping, cost optimization, distribution).

---

## Vibecoding Integration

<!-- COMMAND_SECTION_START: specify -->
### In /vibecode:specify
**AI feature specification:**

When specifying AI features:
- [ ] Define baseline (non-AI) experience
- [ ] Define AI enhancement
- [ ] Specify fallback if AI fails
- [ ] List confidence thresholds
- [ ] Define success metrics

Template:
```markdown
## AI Feature Spec

**Baseline (no AI):**
[What happens if AI unavailable]

**AI Enhancement:**
[What AI adds to experience]

**Fallback Strategy:**
- If AI slow (>5s): [show baseline]
- If AI errors: [graceful degradation]
- If AI low confidence: [ask user to verify]

**Success Metrics:**
- User adoption: [X]%
- AI accuracy: [Y]%
- Cost per user: <$[Z]

**MVP Scope (ship in 1 week):**
- [ ] Core prompt working
- [ ] Streaming implemented
- [ ] Basic error handling
- [ ] 10 beta users lined up
```
<!-- COMMAND_SECTION_END: specify -->

<!-- COMMAND_SECTION_START: plan -->
### In /vibecode:plan
**AI implementation plan:**

When planning AI features:
- [ ] Choose model (start with one, make swappable)
- [ ] Design prompt (structured output)
- [ ] Plan caching strategy
- [ ] Define cost budget
- [ ] Plan gradual rollout

Template:
```markdown
## AI Implementation Plan

**Model Selection:**
- Start: [Claude Sonnet / GPT-4 / etc.]
- Why: [reasoning]
- Cost: [$X per 1K requests]
- Swappable: [yes, abstracted behind interface]

**Prompt Design:**
- Input: [what we send]
- Output: [structured JSON format]
- Example:
  ```json
  {
    "result": "...",
    "confidence": 0.95
  }
  ```

**Optimization:**
- Caching: [what to cache, TTL]
- Model routing: [simple vs complex heuristic]
- Batching: [what can be batched]

**Cost Budget:**
- Expected usage: [X requests/day]
- Cost per request: [$Y]
- Monthly budget: [$Z]
- Optimization target: <[$Z/2]

**Rollout:**
- Week 1: 10 beta users
- Week 2: 50 users (if positive feedback)
- Week 3: 100% (if cost < budget)
```

Document to: `.vibecode/memory/decisions/active/[date]-ai-[feature].md`
<!-- COMMAND_SECTION_END: plan -->

<!-- COMMAND_SECTION_START: implement -->
### In /vibecode:implement
**AI implementation patterns:**

When building:
- [ ] Wrap AI provider in interface (easy to swap)
- [ ] Use structured outputs (JSON)
- [ ] Implement streaming
- [ ] Add retry logic
- [ ] Add caching
- [ ] Track costs

Code template:
```typescript
// 1. Abstract provider
interface AIProvider {
  stream(prompt: string): AsyncGenerator<string>;
  complete(prompt: string): Promise<string>;
}

// 2. Structured prompt
const prompt = `
Task: [describe task]
Input: ${userInput}
Output format:
{
  "result": string,
  "confidence": number,
  "reasoning": string
}
`;

// 3. Streaming implementation
async function* streamAI(userInput: string) {
  const cached = cache.get(userInput);
  if (cached) {
    yield cached;
    return;
  }

  let fullResponse = '';
  for await (const chunk of ai.stream(prompt)) {
    fullResponse += chunk;
    yield chunk;
  }

  cache.set(userInput, fullResponse);
}

// 4. Cost tracking
function trackCost(tokens: number, model: string) {
  const costPer1M = MODEL_COSTS[model];
  const cost = (tokens / 1_000_000) * costPer1M;

  metrics.track('ai_cost', { cost, model, tokens });
}
```

Testing checklist:
- [ ] Test with real user input
- [ ] Test fallback when AI fails
- [ ] Test streaming performance
- [ ] Verify cost < budget
- [ ] Monitor accuracy with evals
<!-- COMMAND_SECTION_END: implement -->

---

## Configuration

**Default weight:** `low`
**Recommended for:** AI-first products, AI features, solo founders building with AI
**Optional for:** Non-AI features (use `ai-product-patterns` for technical AI details)

**Note:** This skill complements `ai-product-patterns`:
- **ai-product-patterns:** Technical implementation (evals, latency, model selection)
- **ai-startup-building:** Startup strategy (fast shipping, cost optimization, distribution)

