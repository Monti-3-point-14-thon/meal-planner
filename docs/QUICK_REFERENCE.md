# Vibecoding Framework - Quick Reference

## 📋 Three Frameworks at a Glance

| Framework | What It Does | Key Strength | Main Gap |
|-----------|--------------|--------------|----------|
| **Spec-Kit** | Structured workflow: spec → plan → tasks → code | Prevents AI drift with templates | No PM context or memory |
| **Awesome-PM-Skills** | 28 PM frameworks from world-class PMs | Strategic product thinking | Not integrated with code workflow |
| **Ship-Fast** | Next.js boilerplate with auth/payments/DB | 80% of SaaS already built | Generic, no customization memory |

## 🎯 What We're Building: Unified Framework

**Name**: Vibecoding Framework (`.vibecode/`)

**Combines**:
- Spec-Kit's structure (prevent drift)
- PM Skills' frameworks (strategic decisions)
- Ship-Fast's foundation (production-ready)
- **NEW**: Memory layer (decisions, design system, components)

---

## 🗂️ File Structure Comparison

### Current: Spec-Kit Only
```
.specify/
├── memory/constitution.md
├── specs/001-feature/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
└── templates/
```

### Proposed: Vibecoding Framework
```
.vibecode/
├── memory/
│   ├── constitution.md              ✅ From Spec-Kit
│   ├── decisions/                   🆕 NEW
│   │   ├── 001-auth-approach.md
│   │   └── 002-payment-flow.md
│   ├── design-system/               🆕 NEW
│   │   ├── colors.md
│   │   ├── typography.md
│   │   └── components.md
│   └── architecture/                🆕 NEW
│       ├── tech-stack.md
│       └── api-design.md
├── specs/                           ✅ From Spec-Kit
├── components-registry/             🆕 NEW
│   ├── ui-components.md
│   └── feature-components.md
├── skills/                          ✅ From PM-Skills
│   ├── builder/
│   ├── strategist/
│   └── [7 modes]
└── templates/                       ✅ From Spec-Kit + Ship-Fast
```

---

## 🔄 Workflow Commands

### Current: Spec-Kit Commands
```bash
/speckit.constitution    # Set principles
/speckit.specify        # Create spec
/speckit.plan           # Technical plan
/speckit.tasks          # Task breakdown
/speckit.implement      # Build it
```

### Proposed: Vibecoding Commands
```bash
/vibecode.init          # 🆕 Initialize project (Ship-Fast + framework)
/vibecode.constitution  # ✨ Enhanced with PM skills
/vibecode.specify       # ✨ Enhanced with PM skills (zero-to-launch, JTBD)
/vibecode.plan          # ✨ Enhanced with memory checks
/vibecode.tasks         # ✨ Enhanced with component registry
/vibecode.implement     # ✨ Enhanced with auto-logging
/vibecode.launch        # 🆕 Go-to-market (PM skills)
/vibecode.memory        # 🆕 Query memory layer
/vibecode.components    # 🆕 List reusable components
```

---

## 🧠 PM Skills by Phase

| Phase | Active Skills | What They Do |
|-------|---------------|--------------|
| **Constitution** | strategic-build, culture-craft | Define what type of work this is (Leverage/Neutral/Overhead) |
| **Specify** | zero-to-launch, jtbd-building, continuous-discovery | Apply Figma simplicity test, map complete experience, understand jobs |
| **Plan** | design-first-dev, strategic-build, ai-product-patterns | Craft quality standards, build vs buy decisions, AI-first thinking |
| **Tasks** | quality-speed, prioritization-craft | Balance craft vs velocity, ruthless prioritization |
| **Implement** | ship-decisions | When to ship vs iterate |
| **Launch** | launch-execution, positioning-craft, metrics-frameworks | Go-to-market, positioning, what to measure |

---

## 🧪 Sample Workflow

### Example: Building User Authentication

#### Without Framework
```
You: "Add user authentication"
Claude: *Builds auth with Auth0*
[2 weeks later]
You: "Add admin dashboard"
Claude: *Suggests NextAuth, doesn't realize you have Auth0*
Result: Inconsistent, wasted time
```

#### With Framework
```
You: /vibecode.specify "Add user authentication"

Claude:
1. Checks memory/decisions/ - finds nothing
2. Activates zero-to-launch skill:
   - What's the ONE core job? (Figma test)
   - "Users need to securely access their accounts"
3. Creates spec with user stories
4. Asks: "Email/password, OAuth, or magic links?"

You: "Email/password + Google OAuth"

Claude: /vibecode.plan
1. Checks Ship-Fast boilerplate - already has NextAuth
2. Logs decision: memory/decisions/001-auth-approach.md
   "Using NextAuth with Google OAuth + credentials provider"
3. Creates plan.md referencing Ship-Fast patterns

Claude: /vibecode.implement
1. Builds auth using NextAuth (from Ship-Fast)
2. Updates component registry: AuthButton, LoginForm, SignupForm
3. Updates design system: form styles
4. Logs in memory/architecture/auth-flow.md

[2 weeks later]
You: /vibecode.specify "Add admin dashboard"

Claude:
1. Reads memory/decisions/001-auth-approach.md
2. "I see we're using NextAuth. I'll add admin role to User model"
3. Reuses AuthButton component from registry
4. Follows established patterns

Result: Consistent, fast, scalable
```

---

## 🎯 Key Decisions You Need to Make

### 1. Interface
- [ ] VS Code Extension (Claude Code)
- [ ] Terminal CLI
- [ ] Both (which is primary?)

### 2. Memory Layer Strictness
- [ ] **Strict**: Claude MUST follow all decisions
- [ ] **Balanced**: Claude follows by default, can propose changes
- [ ] **Suggestive**: Claude references but doesn't enforce

### 3. PM Skills Depth
- [ ] **Light**: Only core builder skills (zero-to-launch, strategic-build)
- [ ] **Medium**: Builder + Strategist skills
- [ ] **Full**: All 28 skills

### 4. Boilerplate Strategy
- [ ] **Ship-Fast Only**: Next.js is your standard
- [ ] **Multi-Template**: Support Rails, Django, etc.
- [ ] **Bring Your Own**: Framework works with any stack

### 5. Project Type
- [ ] **Multiple MVPs**: Different products, reusable patterns
- [ ] **One Product**: Deep focus on single product
- [ ] **Agency Style**: Client projects with similar needs

---

## 📊 Success Metrics

Track these to know if framework works:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Time to First Feature** | 50% faster | Compare with/without framework |
| **Decision Conflicts** | Zero | Claude never contradicts past decisions |
| **Component Reuse** | 30%+ | How often Claude suggests existing components |
| **Design Consistency** | 90%+ | Manual check of UI elements |
| **Memory Usefulness** | Daily refs | How often Claude references memory |

---

## 🚀 Implementation Roadmap

### Week 1: Foundation (POC)
- [ ] Create `.vibecode/` structure
- [ ] Merge Spec-Kit templates
- [ ] Copy PM Skills
- [ ] Enhance Ship-Fast instructions
- [ ] Test init command

### Week 2: Memory Layer
- [ ] Build decision logging
- [ ] Create design system template
- [ ] Build component registry
- [ ] Test with 2-3 features

### Week 3: Integration
- [ ] PM skills activate contextually
- [ ] Memory referenced automatically
- [ ] Components suggested before creation
- [ ] Full workflow test

### Week 4: Production MVP
- [ ] Choose real product to build
- [ ] Use framework end-to-end
- [ ] Ship working product
- [ ] Document learnings

---

## 🛠️ Technical Implementation Notes

### Where Each Piece Lives

**Claude Code (VS Code Extension)**:
- Reads `.vibecode/` directory
- Slash commands call templates
- Auto-updates memory layer
- References PM skills contextually

**Git Integration**:
- Feature branches from Spec-Kit
- Memory layer version controlled
- Decision history in git log

**File Watchers** (Optional):
- Detect new components → update registry
- Detect decision docs → index for search
- Detect design changes → flag for review

---

## 💡 Example Products to Build

### Tier 1: Simple (Test Framework)
1. **Link-in-bio tool**
   - User stories: 3-4
   - Components: 5-8
   - Time: 1 week

2. **Waitlist landing page**
   - User stories: 2-3
   - Components: 4-6
   - Time: 3-5 days

### Tier 2: Medium (Prove Value)
3. **URL shortener with analytics**
   - User stories: 6-8
   - Components: 10-15
   - Time: 2 weeks

4. **Simple SaaS dashboard**
   - User stories: 8-12
   - Components: 15-20
   - Time: 2-3 weeks

### Tier 3: Complex (Production Test)
5. **Full SaaS product**
   - User stories: 15+
   - Components: 25+
   - Time: 4-6 weeks

---

## 📚 Resources

### Documentation to Read
1. **Spec-Kit**: [github.com/github/spec-kit](https://github.com/github/spec-kit) - Understand workflow
2. **PM Skills**: [github.com/menkesu/awesome-pm-skills](https://github.com/menkesu/awesome-pm-skills) - Browse 28 PM skills
3. **Ship-Fast**: [shipfa.st](https://shipfa.st) - Coding patterns

### Key Files to Examine (on GitHub)
1. Spec-Kit `templates/spec-template.md` - Spec structure example
2. Awesome-PM-Skills `zero-to-launch/SKILL.md` - PM framework example
3. Spec-Kit `memory/constitution.md` - Principles template

---

## ❓ FAQs

**Q: Will this slow me down?**
A: Initially, yes (learning curve). After 2-3 features, 40-60% faster.

**Q: What if I don't want all PM skills?**
A: Pick 5-7 core ones. Start with: zero-to-launch, strategic-build, ship-decisions.

**Q: Can I use this with developers?**
A: Yes! Memory layer especially helps teams. Decisions documented, onboarding easier.

**Q: What if Ship-Fast isn't my stack?**
A: Framework works with any boilerplate. We'd just adapt the patterns.

**Q: How much does memory layer help really?**
A: Biggest win for projects lasting 3+ months or with multiple features. Less valuable for 1-week throwaway prototypes.

**Q: Is this overkill for simple MVPs?**
A: Possibly. Rule of thumb: If < 5 user stories, skip framework. If > 10 user stories, framework pays off.

---

## 🎯 Decision Framework: Should You Use This?

### ✅ Use If:
- Building multiple features (not just 1)
- Want to scale prototype → production
- Need consistent design/architecture
- Solo founder managing complexity
- Projects last 2+ weeks

### ❌ Skip If:
- One-off 2-day prototype
- Pure exploration/learning
- Working with experienced dev team
- Already have your own system that works

---

## 📞 What You Need to Tell Me

### Required Info:
1. **Your use case**: Building what, for whom?
2. **Timeline pressure**: How fast must you move?
3. **Current pain points**: What's breaking in your workflow now?

### Helpful Context:
4. **Past projects**: What have you built? What went wrong?
5. **Tech preferences**: Any strong opinions on stack?
6. **Team structure**: Solo or with others?

### Decision Points:
7. **Memory strictness**: Strict vs balanced vs suggestive?
8. **PM skills depth**: Light vs medium vs full?
9. **Starting approach**: POC vs full build vs experiment?

---

**Ready to proceed?** Share your answers, and let's build this! 🚀
