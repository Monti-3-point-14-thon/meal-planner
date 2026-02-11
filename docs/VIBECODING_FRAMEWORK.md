# Vibecoding Framework: Combining Spec-Driven Development with PM Skills

**Version**: 0.1.0 (Experimental)
**Created**: 2026-02-01
**Purpose**: Enable business executives to build production-ready products through AI-driven development with tight controls, PM context, and memory

---

## 🎯 Vision

Create a unified framework that combines:
1. **Spec-Kit's structured workflow** (spec → plan → tasks → implement)
2. **Awesome-PM-Skills' domain expertise** (28 PM skills from Lenny's podcast)
3. **Ship-Fast's production boilerplate** (Next.js starter with auth, payments, etc.)
4. **Long-term memory layer** (decisions, design system, modular architecture)

**Goal**: Enable non-technical founders to build scalable products by vibecoding with Claude Code, while maintaining control, consistency, and scalability.

---

## 📊 Current State Analysis

### 1. Spec-Kit (Spec-Driven Development)

**Purpose**: Transform natural language specs into controlled implementation plans

**Workflow**:
```
/speckit.constitution → /speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
```

**Key Features**:
- ✅ Structured templates for specs, plans, and tasks
- ✅ Constitution/memory system for project principles
- ✅ Git-based branching per feature
- ✅ Slash commands for AI agents (Claude Code supported)
- ✅ Template-driven approach to reduce hallucinations

**Structure**:
```
.specify/
├── memory/
│   └── constitution.md          # Project principles & guidelines
├── specs/
│   └── 001-feature-name/
│       ├── spec.md              # User stories & requirements
│       ├── plan.md              # Technical implementation plan
│       ├── tasks.md             # Actionable task breakdown
│       ├── data-model.md        # Data structures
│       └── contracts/           # API specs, contracts
├── scripts/                     # Automation scripts
└── templates/                   # Reusable templates
```

**Strengths**:
- Prevents AI drift with structured workflow
- Forces clarification before implementation
- Technology-agnostic specifications
- Built-in quality checklists

**Gaps**:
- ❌ No long-term memory across features
- ❌ No design system enforcement
- ❌ No PM/product thinking context
- ❌ No reusable component tracking

---

### 2. Awesome-PM-Skills (Product Management Context)

**Purpose**: Embed world-class PM frameworks into AI coding

**Coverage**: 28 skills across 7 modes:
1. **Builder Mode** (11 skills): zero-to-launch, strategic-build, continuous-discovery, design-first-dev, etc.
2. **Communicator Mode** (4 skills): strategic-storytelling, positioning-craft, exec-comms
3. **Strategist Mode** (4 skills): decision-frameworks, strategy-frameworks, prioritization-craft
4. **Navigator Mode** (3 skills): influence-craft, stakeholder-craft
5. **Leader Mode** (3 skills): culture-craft, career-growth
6. **Measurement Mode** (2 skills): metrics-frameworks, user-feedback-system
7. **Launch Mode** (1 skill): launch-execution

**Structure**:
```
awesome-pm-skills/
├── zero-to-launch/
│   └── SKILL.md                 # Framework, templates, examples
├── strategic-build/
│   └── SKILL.md
└── [26 more skills]/
```

**Each Skill Contains**:
- Activation triggers (when to use)
- Core frameworks (from Lenny's guests)
- Decision trees
- Action templates
- Real-world examples
- Common pitfalls

**Key Frameworks Embedded**:
- **OpenAI's AI-First Product Development** (Kevin Weil)
- **Figma's Simplicity Forcing Function** (Dylan Field)
- **Airbnb's Complete Experience Design** (Brian Chesky)
- **Shreyas Doshi's LNO Framework** (Leverage, Neutral, Overhead)
- **Teresa Torres' Continuous Discovery**
- **Jobs-to-be-Done** (Bob Moesta)

**Strengths**:
- Brings PM context to AI coding
- Contextually activated (no manual invocation)
- Based on 300+ episodes, 40+ world-class PMs
- Provides strategic thinking layer

**Gaps**:
- ❌ No integration with spec workflow
- ❌ No enforcement mechanism
- ❌ Not tied to implementation phases

---

### 3. Ship-Fast (Production Boilerplate)

**Purpose**: Next.js SaaS starter with everything pre-configured

**Tech Stack**:
- Next.js 15 + App Router + React 19
- NextAuth v5 (authentication)
- Stripe (payments)
- MongoDB + Mongoose
- Tailwind CSS + DaisyUI
- Resend (email)

**Includes**:
- ✅ Authentication (Google OAuth, Email)
- ✅ Payment integration (Stripe Checkout, webhooks)
- ✅ Database models and connection
- ✅ Email templates
- ✅ UI components (DaisyUI)
- ✅ API route patterns
- ✅ Deployment config (Vercel)

**Key Files**:
- `claude-instructions.md` - Detailed coding guidelines
- `.cursorrules` - Cursor-specific rules
- `config.js` - Centralized configuration

**Strengths**:
- Production-ready foundation
- Best practices baked in
- Reduces boilerplate work
- Clear patterns and conventions

**Gaps**:
- ❌ No spec workflow integration
- ❌ No component library documentation
- ❌ No design system guidelines
- ❌ Generic, not customized per project

---

## 🏗️ Proposed Framework Architecture

### Core Principles

1. **Structured Creativity**: Use Spec-Kit workflow to prevent drift, PM skills for strategic thinking
2. **Memory-First**: Every decision documented, design system enforced, components catalogued
3. **Product-Driven**: PM skills guide what to build, how to scope, when to ship
4. **Scalable from Day 1**: Ship-Fast foundation + modular architecture = MVP → production
5. **Interface Agnostic**: Works with Claude Code (VS Code extension or CLI)

### Unified Directory Structure

```
project-root/
├── .vibecode/                           # Core framework (new)
│   ├── memory/
│   │   ├── constitution.md              # From Spec-Kit
│   │   ├── decisions/                   # NEW: Decision log
│   │   │   ├── 001-auth-approach.md
│   │   │   ├── 002-payment-flow.md
│   │   │   └── README.md
│   │   ├── design-system/               # NEW: Design system
│   │   │   ├── colors.md
│   │   │   ├── typography.md
│   │   │   ├── components.md
│   │   │   └── patterns.md
│   │   └── architecture/                # NEW: Architecture decisions
│   │       ├── tech-stack.md
│   │       ├── data-model.md
│   │       └── api-design.md
│   ├── specs/                           # From Spec-Kit
│   │   └── 001-feature-name/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       └── contracts/
│   ├── components-registry/             # NEW: Component catalog
│   │   ├── ui-components.md
│   │   ├── feature-components.md
│   │   └── reusable-patterns.md
│   ├── skills/                          # From Awesome-PM-Skills
│   │   ├── builder/
│   │   │   ├── zero-to-launch.md
│   │   │   ├── strategic-build.md
│   │   │   └── [9 more builder skills]
│   │   ├── communicator/
│   │   ├── strategist/
│   │   └── [5 more modes]
│   ├── templates/                       # From Spec-Kit + Ship-Fast
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   └── component-template.md
│   └── claude-instructions.md           # Enhanced from Ship-Fast
│
├── app/                                 # From Ship-Fast (Next.js)
├── components/                          # From Ship-Fast
├── libs/                                # From Ship-Fast
├── models/                              # From Ship-Fast
├── config.js                            # From Ship-Fast
└── [rest of Ship-Fast structure]
```

---

## 🔄 Unified Workflow

### Phase 1: Project Initialization

**Command**: `vibecode init <project-name>`

**What It Does**:
1. Clones Ship-Fast boilerplate
2. Installs Spec-Kit templates
3. Copies PM Skills library
4. Creates `.vibecode/` structure
5. Initializes memory directories
6. Generates project-specific constitution

**Initial Setup Prompts**:
- What's your product vision?
- Who's your target user?
- What's your launch timeline? (MVP vs full product)
- Design preferences? (minimalist, bold, enterprise, etc.)
- Tech stack preferences? (use Ship-Fast defaults or customize)

---

### Phase 2: Feature Development (Enhanced Spec-Kit Flow)

#### Step 1: Constitution + PM Context
**Command**: `/vibecode.constitution`

**Enhanced with PM Skills**:
- Activates: `strategic-build`, `zero-to-launch`
- Asks: What type of work is this? (Leverage, Neutral, Overhead - Shreyas Doshi framework)
- Documents: Project principles, design standards, quality bars

**Output**: `.vibecode/memory/constitution.md` with embedded PM frameworks

---

#### Step 2: Specification (Product-Driven)
**Command**: `/vibecode.specify [feature description]`

**Enhanced with PM Skills**:
- Activates: `zero-to-launch`, `jtbd-building`, `continuous-discovery`
- Applies:
  - **Figma's Simplicity Test**: What's the ONE core job?
  - **Airbnb's Complete Experience**: Map full user journey
  - **Jobs-to-be-Done**: What job is user hiring this for?
- Forces clarification with `/vibecode.clarify` before planning

**Output**: `.vibecode/specs/00X-feature/spec.md` with prioritized user stories

---

#### Step 3: Technical Planning (Memory-Informed)
**Command**: `/vibecode.plan [tech stack preferences]`

**Enhanced Features**:
1. **Checks Memory First**:
   - Reads previous decisions
   - Enforces design system
   - Reuses existing components
2. **PM Skills Active**:
   - `design-first-dev`: Craft quality standards
   - `strategic-build`: Build vs buy decisions
3. **References Ship-Fast Patterns**:
   - Uses existing API patterns
   - Follows authentication flow
   - Maintains coding standards

**Output**:
- `.vibecode/specs/00X-feature/plan.md`
- Updated `.vibecode/memory/decisions/` if new patterns introduced

---

#### Step 4: Task Breakdown (Modular)
**Command**: `/vibecode.tasks`

**Enhanced Features**:
- Identifies reusable components
- Flags design system updates needed
- Orders tasks by dependency + PM priority
- Marks parallel execution opportunities

**Output**:
- `.vibecode/specs/00X-feature/tasks.md`
- Updates `.vibecode/components-registry/` with new components

---

#### Step 5: Implementation (Memory-Writing)
**Command**: `/vibecode.implement`

**Enhanced Features**:
1. **During Implementation**:
   - Logs decisions in `.vibecode/memory/decisions/`
   - Updates component registry
   - Enforces design system
   - References Ship-Fast patterns
2. **PM Skills Active**:
   - `quality-speed`: When to ship vs refine
   - `ship-decisions`: Confidence checklist
3. **Auto-Documentation**:
   - New components added to registry
   - API contracts saved
   - Architecture decisions logged

**Output**:
- Working code
- Updated memory layer
- Component registry
- Decision log

---

### Phase 3: Launch & Iteration

**Command**: `/vibecode.launch`

**PM Skills Active**:
- `launch-execution`: Go-to-market checklist
- `positioning-craft`: How to talk about it
- `metrics-frameworks`: What to measure

**Output**: Launch plan + measurement dashboard

---

## 🧠 Memory Layer Design

### 1. Decision Log

**Purpose**: Never make the same decision twice, challenge decisions consciously

**Structure**:
```markdown
# Decision: [Title]

**Date**: 2026-02-01
**Context**: [Why this decision was needed]
**Options Considered**:
1. Option A - [pros/cons]
2. Option B - [pros/cons]

**Decision**: [Chosen option]
**Rationale**: [Why this choice]
**Consequences**: [What this enables/prevents]
**Review Date**: [When to revisit - optional]
```

**Examples**:
- Authentication approach (NextAuth vs Auth0)
- Payment flow (Stripe Checkout vs custom)
- Database schema design
- API versioning strategy

---

### 2. Design System

**Purpose**: Maintain visual consistency, enable rapid development

**Files**:
- `colors.md`: Brand colors, semantic colors (success, error, etc.)
- `typography.md`: Font scales, weights, line heights
- `components.md`: Design decisions for each component type
- `patterns.md`: Layout patterns, spacing system, breakpoints

**Integration**:
- Claude checks design system before creating UI
- Suggests existing components before creating new ones
- Flags design system violations

---

### 3. Component Registry

**Purpose**: Reuse before rebuild, maintain modular codebase

**Structure**:
```markdown
# Component Registry

## UI Components (Atomic)
- **Button** (`components/Button.js`)
  - Variants: primary, secondary, ghost, danger
  - States: default, loading, disabled
  - Used in: 12 features

- **Input** (`components/Input.js`)
  - Types: text, email, password, number
  - Features: validation, error states, icons
  - Used in: 8 features

## Feature Components (Composed)
- **PaymentForm** (`components/PaymentForm.js`)
  - Uses: Button, Input, Stripe integration
  - Purpose: Collect payment information
  - Used in: checkout flow, account upgrade
```

**Benefits**:
- Claude suggests existing components
- Prevents duplication
- Enables refactoring (see impact)
- Facilitates scaling

---

### 4. Architecture Decisions

**Purpose**: Document technical choices, enable onboarding

**Files**:
- `tech-stack.md`: Chosen technologies + rationale
- `data-model.md`: Database schema philosophy
- `api-design.md`: REST conventions, versioning
- `deployment.md`: Hosting, CI/CD, environments

---

## 🔧 Implementation Plan

### Phase 1: Proof of Concept (Week 1-2)
**Goal**: Build unified framework structure, test with 1 feature

**Tasks**:
1. Create `.vibecode/` directory structure
2. Merge Spec-Kit templates with PM Skills
3. Enhance Ship-Fast `claude-instructions.md` with memory layer
4. Create initialization script
5. Test workflow: Init → Specify → Plan → Tasks → Implement
6. Build 1 sample feature end-to-end

**Success Criteria**:
- Can initialize a new project with combined framework
- Memory layer persists decisions
- Component registry tracks components
- PM skills influence decisions

---

### Phase 2: Memory Layer & Skills Integration (Week 3-4)
**Goal**: Make memory layer intelligent, PM skills contextually active

**Tasks**:
1. Build decision logging system
2. Create design system template
3. Build component registry auto-update
4. Integrate PM skills into each workflow phase
5. Test with 3 features to validate memory works

**Success Criteria**:
- Decisions automatically logged
- Claude references past decisions
- Design system enforced
- Components suggested before creation
- PM skills activate at right times

---

### Phase 3: Production Testing (Week 5-6)
**Goal**: Build real MVP using framework

**Tasks**:
1. Choose a real product idea
2. Use framework end-to-end
3. Build to production
4. Document pain points
5. Refine framework based on learnings

**Success Criteria**:
- Ship working MVP
- Memory layer proves valuable
- Framework accelerates (not slows) development
- Non-technical founder can drive process

---

## ❓ Clarifying Questions

### About Your Workflow

1. **Interface Preference**:
   - Do you prefer VS Code extension or terminal CLI?
   - Does one offer advantages for your use case?

2. **Project Lifecycle**:
   - Are you building one product, or multiple MVPs?
   - Is your goal rapid prototyping or building to scale from day 1?

3. **Decision Making**:
   - How involved do you want to be in technical decisions?
   - Should Claude propose options + rationale, or make sensible defaults?

### About Memory Layer

4. **Decision Challenges**:
   - Can you share an example where you "forgot" a decision and regretted it?
   - What decisions do you want Claude to NEVER override without asking?

5. **Design System**:
   - Do you have existing brand guidelines?
   - Should design system be strict (enforce) or suggestive (guide)?

### About PM Skills

6. **PM Framework Preferences**:
   - Which PM frameworks resonate most? (Shreyas LNO, JTBD, Continuous Discovery, etc.)
   - Are there frameworks you actively dislike or want to avoid?

7. **Strategic vs Tactical**:
   - Do you want Claude to default to "build less, ship fast" or "build right from start"?
   - How much should PM skills influence technical implementation?

### About Ship-Fast Boilerplate

8. **Boilerplate Customization**:
   - Is Ship-Fast tech stack (Next.js, MongoDB, Stripe) your default?
   - Do you need multi-boilerplate support (Next.js, Rails, Django, etc.)?

9. **Production Requirements**:
   - What's non-negotiable for your MVPs? (Auth, payments, analytics, etc.)
   - Any services you always use? (Vercel, AWS, Supabase, etc.)

### About Workflow

10. **Collaboration**:
    - Will you work solo, or with developers who need to understand the codebase?
    - Should the framework optimize for handoff to engineers later?

11. **Iteration Style**:
    - Do you prefer:
      - Plan everything, then build? (waterfall-ish)
      - Build, learn, iterate? (agile-ish)
      - Hybrid?

---

## 🎯 Next Steps

### Immediate Actions

1. **You Review & Respond**:
   - Read this document
   - Answer clarifying questions above
   - Share examples of past pain points
   - Define success criteria for this framework

2. **We Build POC**:
   - Create `.vibecode/` structure
   - Merge frameworks
   - Test initialization
   - Build sample feature

3. **We Iterate**:
   - Identify friction points
   - Refine memory layer
   - Adjust PM skills activation
   - Simplify workflow

### Suggested First Real Test

**Project**: Build a small MVP (1-2 weeks)
**Why**: Real usage reveals framework gaps
**Example Ideas**:
- Link-in-bio tool (simple, clear scope)
- Waitlist landing page with analytics
- Simple SaaS dashboard

**What We'll Learn**:
- Does memory layer actually help?
- Do PM skills guide better decisions?
- Is workflow faster or slower?
- What's missing?

---

## 📚 References

### Repositories
- [Spec-Kit](https://github.com/Monti-3-point-14-thon/spec-kit)
- [Awesome-PM-Skills](https://github.com/menkesu/awesome-pm-skills)
- [Ship-Fast](https://github.com/Monti-3-point-14-thon/ship-fast)

### Key Concepts
- **Spec-Driven Development**: Requirements → Spec → Plan → Tasks → Code
- **PM Skills as Context**: World-class PM frameworks embedded in AI
- **Memory Layer**: Decisions, design system, components, architecture
- **Vibecoding**: Natural language product development with guardrails

---

**Status**: Awaiting feedback to proceed with POC
**Next Update**: After clarifying questions answered
