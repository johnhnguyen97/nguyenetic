# Claude Command: Commit

Create a git commit with a conventional commit message.

## Process

1. **Check staged changes**:
   ```bash
   git status
   git diff --staged
   ```

2. **If nothing staged**: Show unstaged changes and ask what to stage

3. **Generate commit message** following Conventional Commits:
   - Format: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
   - Use imperative mood ("add" not "added")
   - Keep under 72 characters

4. **Execute commit**:
   ```bash
   git commit -m "type(scope): description"
   ```

5. **Show result**: Display commit hash and summary

## Arguments

$ARGUMENTS

- If provided, use as commit message guidance
- If empty, analyze diff to generate message

## Examples

- `/commit` - Auto-generate message from staged changes
- `/commit fix the login bug` - Generate message for login fix
- `/commit feat: add dark mode` - Use provided message directly

## Rules

- Never use `--amend` unless explicitly requested
- Never add "Co-Authored-By" signatures
- Never skip pre-commit hooks (no `--no-verify`)
- If hooks fail, fix issues and create NEW commit
