---
name: vibecode.memory
description: Query memory layer - decisions, patterns, trade-offs
arguments: [query_or_category]
---

# /vibecode.memory - Query Memory Layer

## Purpose

Search and view your project's memory (decisions, patterns, trade-offs).

## Commands

```bash
/vibecode.memory decisions           # List recent decisions
/vibecode.memory trade-offs          # View trade-off patterns
/vibecode.memory design-system       # View design system
/vibecode.memory "[search query]"    # Search memory for query
```

## Execution

```bash
Read: .vibecode/memory/[category]/
Display: Relevant files based on query
If search: grep memory layer for query terms
```

## Output Format

```
🧠 Memory Results: [query]

Recent Decisions:
- [Date] [Decision]: [summary]

Trade-off Patterns:
- [Pattern]: [summary]

Constitution Principles:
- [Principle]: [summary]
```
