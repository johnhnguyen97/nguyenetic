# Checkpoint (Git-based Save Point)

Create a lightweight git checkpoint to save current progress.

## Arguments
$ARGUMENTS

## Instructions

### 1. Check Current State

```bash
git status
```

### 2. Create Checkpoint

If there are changes:
```bash
git add -A
git commit -m "checkpoint: $ARGUMENTS" || git commit -m "checkpoint: WIP save point"
```

### 3. Report

```
## Checkpoint Created

**Commit**: [short hash]
**Message**: checkpoint: [description]
**Files**: [count] files saved

To restore: `/rewind` or `git reset --soft HEAD~1`
```

## Notes

- Checkpoints are regular commits, can be squashed later
- Use descriptive messages: `/checkpoint before refactor`
- Creates atomic save points during long tasks
