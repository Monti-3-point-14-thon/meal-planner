---
name: vibecode.components
description: View component registry - list reusable components
arguments: [list|search] [query]
---

# /vibecode.components - Component Registry

## Commands

```bash
/vibecode.components list          # List all components
/vibecode.components search [q]    # Search for component
```

## Execution

```bash
Read: .vibecode/components-registry/ui-components.md
Read: .vibecode/components-registry/feature-components.md
Display: Components with usage info
```

## Output Format

```
📦 Component Registry

UI Components:
- **Button** (components/Button.js)
  Variants: primary, secondary, ghost
  Used in: 12 places

Feature Components:
- **PaymentForm** (components/PaymentForm.js)
  Purpose: Collect payment info
  Used in: checkout, account-upgrade
```
