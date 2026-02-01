# Fix Issues

Automatically fix common issues in the codebase.

## Arguments
$ARGUMENTS

If no arguments: fix all auto-fixable issues.

## Instructions

### 1. Detect Project Type and Run Fixers

**Rust**:
```bash
cargo fmt
cargo clippy --fix --allow-dirty
```

**TypeScript/JavaScript**:
```bash
npm run lint -- --fix
# or
npx eslint --fix .
npx prettier --write .
```

**Python**:
```bash
ruff check --fix .
ruff format .
# or
black .
isort .
```

### 2. Specific Fix Types

If argument specifies a type:
- `format` / `fmt`: Only run formatters
- `lint`: Only run linters with auto-fix
- `imports`: Only fix import ordering
- `types`: Attempt to fix type errors (where possible)

### 3. Report Results

```
## Fix Results

### Changes Made
- Formatted [N] files
- Fixed [N] lint issues
- Organized imports in [N] files

### Files Modified
- `path/to/file.ts`
- `path/to/other.rs`

### Remaining Issues (cannot auto-fix)
- [file:line] - [issue description]
```

### 4. Commit Option
Ask: "Would you like to create a checkpoint with these fixes? (y/n)"
