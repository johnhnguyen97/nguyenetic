# Build Project

Build the current project.

## Arguments
$ARGUMENTS

## Instructions

### 1. Detect Project Type

Check for:
- `Cargo.toml` → Rust: `cargo build`
- `package.json` → Node: `npm run build`
- `pyproject.toml` → Python: `python -m build` or `uv build`
- `go.mod` → Go: `go build`
- `Makefile` → Make: `make`

### 2. Build Options

If `--release` or `release` in arguments:
- Rust: `cargo build --release`
- Node: `npm run build` (usually already production)

### 3. Run Build

Execute the appropriate build command.

### 4. Report Results

```
## Build Results

**Command**: [command run]
**Duration**: [time]
**Status**: ✅ Success / ❌ Failed

### Output Location
[path to built artifacts]

### Warnings (if any)
- [warning 1]
- [warning 2]
```

### 5. On Failure
If build fails:
1. Show the error
2. Identify the issue
3. Offer to fix it
