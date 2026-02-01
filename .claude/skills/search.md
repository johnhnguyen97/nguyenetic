# Search Codebase

Search the codebase for patterns, files, or content.

## Arguments
$ARGUMENTS

## Search Types

### 1. Content Search (default)
Find text/patterns in file contents:
```bash
rg "pattern" --type ts --type tsx
# or
grep -r "pattern" --include="*.ts" --include="*.tsx"
```

### 2. File Search
Find files by name:
```bash
fd "pattern"
# or
find . -name "*pattern*" -type f
```

### 3. Symbol Search
Find function/class/variable definitions:
```bash
rg "function\s+$ARGUMENTS|class\s+$ARGUMENTS|const\s+$ARGUMENTS"
```

## Output Format

```
## Search Results for: [query]

### Files Found
- `path/to/file.ts:42` - [matched line preview]
- `path/to/other.tsx:15` - [matched line preview]

### Summary
Found [N] matches in [M] files
```

## Options

- `--files` or `-f`: Only search filenames
- `--type X`: Limit to file type (ts, tsx, md, etc.)
- `--exact` or `-e`: Exact match only
- `--case` or `-c`: Case sensitive
