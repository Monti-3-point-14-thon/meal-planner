---
name: vibecode.skills
description: View and configure PM skills
arguments: [list|enable|disable|set] [skill_name] [weight]
---

# /vibecode.skills - Manage PM Skills

## Commands

```bash
/vibecode.skills list                    # Show all skills and status
/vibecode.skills enable [skill-name]     # Enable a skill
/vibecode.skills disable [skill-name]    # Disable a skill
/vibecode.skills set [skill] weight=[level]  # Adjust weight
```

## Execution

### list
```bash
Read: .vibecode/pm-skills-config.json
Display: All skills with enabled/disabled status and weights
```

### enable/disable/set
```bash
Read: .vibecode/pm-skills-config.json
Modify: skill configuration
Write: .vibecode/pm-skills-config.json
Confirm: change made
```
