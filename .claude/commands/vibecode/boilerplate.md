---
name: vibecode.boilerplate
description: Manage boilerplate integration
arguments: [enable|disable|switch] [boilerplate_name]
---

# /vibecode.boilerplate - Manage Boilerplate

## Commands

```bash
/vibecode.boilerplate list                  # Show available boilerplates
/vibecode.boilerplate enable ship-fast      # Enable Ship-Fast
/vibecode.boilerplate enable custom [path]  # Enable custom
/vibecode.boilerplate disable               # Disable boilerplate
```

## Execution

```bash
Read: .vibecode/boilerplate/boilerplate-config.json
Modify: enabled, type, path
Write: .vibecode/boilerplate/boilerplate-config.json
Update: state.json flags.has-boilerplate
```

## Output

```
✅ Boilerplate Enabled: Ship-Fast

Available features:
- Authentication (NextAuth)
- Payments (Stripe)
- Database (MongoDB)
- UI Components (DaisyUI)

Claude will now reference Ship-Fast patterns during planning.
```
