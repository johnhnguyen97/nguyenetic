# Context Check

Display current session context and token usage.

## Instructions

### 1. Show Git Context
```bash
git status --short
git branch --show-current
git log --oneline -5
```

### 2. Show Project Files
List recently modified files:
```bash
ls -lt src/ | head -10
```

### 3. Report

```
## Current Context

### Git Status
- Branch: [current branch]
- Status: [clean/dirty]
- Recent commits: [last 3-5]

### Files in Context
- [list of files currently being discussed]

### Token Usage
- Approximate: [estimate based on conversation length]

### Recommendations
- [Suggest /compact if context is large]
- [Suggest focus areas if scattered]
```
