# Decision: MongoDB Free Tier (Atlas M0) for MVP

**Date**: 2026-02-14
**Feature**: 003-database-auth-infrastructure
**Context**: Need MongoDB hosting for Feature 003. Ship-Fast uses MongoDB. Question: which tier/provider?

## Options Considered

### Option A: MongoDB Atlas Free Tier (M0)
- **Pros**:
  - $0/month cost
  - 512 MB storage (enough for 1000s of meal plans)
  - Shared cluster (acceptable for MVP)
  - Easy upgrade path to paid tiers
  - Ship-Fast already configured for Atlas
- **Cons**:
  - Shared resources (occasional slowness possible)
  - 512 MB limit (but sufficient for MVP)
- **Cost**: $0/month

### Option B: MongoDB Atlas Paid Tier (M10)
- **Pros**:
  - Dedicated resources
  - Better performance
  - 10 GB storage
- **Cons**:
  - $57/month (over budget for MVP validation phase)
  - Over-provisioned for 2-100 users
- **Cost**: $57/month

### Option C: Self-Hosted MongoDB
- **Pros**:
  - Full control
  - Lower cost at scale
- **Cons**:
  - Management overhead (backups, security, updates)
  - Not Ship-Fast default (extra config)
  - Deployment complexity
- **Cost**: $5-10/month + time overhead

## Decision

**Chosen**: Option A (MongoDB Atlas Free Tier M0)

**Rationale**:
1. **Budget**: MVP phase, $0/month aligns with constitution's MVP-first approach
2. **Scale**: M0 supports 100+ concurrent connections, 512 MB handles 1000s of meal plans (each plan ~5-10 KB)
3. **Ship-Fast compatibility**: Atlas is Ship-Fast default, no extra configuration
4. **Upgrade path**: Trivial to upgrade to M10 when validated (click button in Atlas dashboard)
5. **Constitution alignment**: Prototype-first, upgrade when scale demands

## Consequences

**Enables**:
- $0 infrastructure cost during validation phase
- Immediate deployment (Ship-Fast already configured)
- Easy scaling when needed

**Prevents**:
- Guaranteed performance SLA (but not needed for MVP)

## Migration Path

**Trigger**: Any of these conditions:
- 100+ active users (storage pressure)
- Performance complaints from users
- Preparing for public launch

**Effort**: < 1 hour (Atlas dashboard upgrade + connection string update)

**Storage Math** (when to upgrade):
- 1 meal plan = ~5 KB (JSON: 3 meals + 3 snacks + macros + metadata)
- 512 MB = 102,400 meal plans
- Assume 100 users × 50 plans each = 5,000 plans = 25 MB
- **Trigger: 50,000+ meal plans stored** (500 users × 100 plans each)

## Review Date

Monitor Atlas metrics dashboard. Set alert at 400 MB usage (80% capacity).
