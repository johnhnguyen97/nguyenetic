# GitHub Issues

Run the GitHub issues script to display current repository information and open issues.

## Arguments
$ARGUMENTS

## Instructions

```bash
GITHUB_TOKEN= gh issue list --state open --limit 10
```

### Modes

- No args: List open issues (default, limit 10)
- `<number>`: View specific issue details
- `mine` or `my`: Issues assigned to current user
- `all`: Include closed issues
- `labels`: List available labels

### Output Format

```
## Open Issues

| # | Title | Labels | Assignee |
|---|-------|--------|----------|
| 1 | Fix login bug | bug | @user |
| 2 | Add dark mode | enhancement | - |

Total: [N] open issues
```
