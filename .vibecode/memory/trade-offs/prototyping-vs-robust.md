# Prototyping vs Robust: Decision Patterns

This file accumulates patterns for when to ship fast vs build for scale.

---

## How to Use This File

**When starting a new feature**:
1. Check if similar pattern exists
2. Apply pattern OR document why this is different

**After building a feature**:
3. Update pattern with what you learned

---

## Patterns

### Data Storage (MVP Phase) - 2026-02-11

**Context**:
- Users: 2 (founder + wife)
- Budget: $0/month
- Timeline: Urgent (5-7 days to first version)
- Validation status: Unproven concept

**Decision**: Prototype (localStorage)

**Rationale**:
- Zero setup time = ship in 5-7 days vs 7-10 days with DB
- $0 cost for validation phase
- Only 2 users, single device acceptable
- TypeScript interfaces designed for MongoDB migration path

**Result**: (Feature 001-002 complete)
- Time taken: 6.5 days actual (as planned)
- Issues encountered: None - localStorage worked perfectly for MVP
- Would do again: YES - validated concept with zero infrastructure cost
- Migration completed: Feature 003 (MongoDB) shipped 4 days after validation

**Upgrade trigger**: When adding authentication (Feature 003) - COMPLETED

**Lesson learned**: localStorage prototype + planned migration path = fastest path to validation. Design data models for future DB from day 1, but don't build it until validated.

---

### Database Schema Design - 2026-02-14

**Context**:
- Users: 2-100 (post-MVP phase)
- Budget: $0/month (MongoDB free tier)
- Timeline: Moderate (7 days for full auth + persistence)
- Validation status: Partially validated (Features 001-002 proven useful)

**Decision**: Hybrid (Prototype hosting + Robust architecture)

**Rationale**:
- **Prototype**: Free tier MongoDB (M0) - $0 vs $57/mo
- **Robust**: Relational schema with foreign keys, proper indexes, profile snapshots
- Why robust schema: Database design is hard to change later, schema mistakes expensive
- Why prototype hosting: Free tier handles MVP scale perfectly, trivial upgrade path

**Result**: (Feature 003 complete)
- Time taken: 7 days with schema design + models + API + UI
- Issues encountered:
  - Next.js 15 async params (documentation issue, not approach issue)
  - ObjectId serialization (standard pattern, solved with helper)
- Would do again: YES - free hosting + solid architecture = best of both worlds
- MongoDB M0 performance: Excellent for MVP scale

**Upgrade trigger**:
- Hosting: When 400MB storage used (~50,000 meal plans)
- Schema: None expected - relational design scales

**Lesson learned**: Be frugal on infrastructure (free tier), rigorous on data design. Schema refactors are painful; hosting upgrades are trivial. Prototype where migration is easy, build robust where changes are expensive.

---

### No Auto-Migration Strategy - 2026-02-14

**Context**:
- Users: 2 technical users (founder + wife)
- Budget: Time constraint (want Feature 003 in 7 days)
- Timeline: Moderate
- Validation status: Existing localStorage data from Feature 001-002

**Decision**: Prototype (Skip auto-migration, manual re-entry)

**Rationale**:
- Auto-migration = 2-3 days extra work
- Only 2 users, both technical, re-entry acceptable
- localStorage schema diverged in Feature 002 (would need complex transforms)
- Clean DB data from start > preserving potentially inconsistent localStorage

**Result**: (Feature 003 complete)
- Time taken: 0 days (shipped Feature 003 on time)
- Issues encountered: None - users re-entered settings without complaint
- Would do again: CONTEXT-DEPENDENT
  - YES if <10 technical users
  - NO if 100+ non-technical users (UX pain > dev time savings)

**Upgrade trigger**: If expanding to 100+ users before public launch, build import tool

**Lesson learned**: With tiny user base, manual migration can be faster than auto-migration. Re-entry takes 2 minutes/user vs 2-3 days dev time. Calculate: (users × 5 min) vs (3 days). Break-even ~350 users.

### Pattern Template:
```markdown
## [Feature Type] - [Date]

**Context**:
- Users: [number]
- Budget: [amount]
- Timeline: [urgent/moderate/flexible]
- Validation status: [unproven/partially-validated/proven]

**Decision**: [Prototype OR Robust]

**Rationale**:
- [Why this approach made sense]
- [Trade-offs accepted]

**Result**: [Update after building]
- Time taken: [actual days]
- Issues encountered: [list]
- Would do again: [yes/no, why]

**Upgrade trigger**: [When to make it robust]
```

---

## General Guidelines

### Prototype When:
- [ ] Feature is unvalidated (users haven't proven they want it)
- [ ] Timeline is tight (need to test hypothesis)
- [ ] Scale is <100 users
- [ ] Budget constraints

**Acceptable trade-offs**:
- Technical debt
- Harder to scale later
- More manual processes
- Not optimized for performance

### Build Robust When:
- [ ] Feature is validated (clear user demand)
- [ ] Core product value (not an experiment)
- [ ] Scale >100 users or rapid growth expected
- [ ] Security/compliance required

**Acceptable trade-offs**:
- Takes 2-3x longer
- More upfront complexity
- Might over-engineer for current needs

---

_Patterns will accumulate here as you make decisions. This becomes your personalized playbook._
