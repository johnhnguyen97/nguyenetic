# PR Review

Create or review a pull request.

## Arguments

$ARGUMENTS

## Mode Detection

- **No arguments or "create"**: Create a new PR
- **PR number or URL**: Review that specific PR
- **"mine" or "my"**: List user's open PRs

## Create PR Workflow

1. **Check current state**:
   ```bash
   git status
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```

2. **Ensure remote is up to date**:
   ```bash
   git push -u origin HEAD
   ```

3. **Create PR** using gh CLI:
   ```bash
   gh pr create --title "type(scope): description" --body "## Summary\n..."
   ```

4. **PR body format**:
   ```markdown
   ## Summary
   - Key change 1
   - Key change 2

   ## Test plan
   - [ ] Test step 1
   - [ ] Test step 2
   ```

## Review PR Workflow

1. **Fetch PR details**:
   ```bash
   gh pr view <number> --json title,body,files,commits
   gh pr diff <number>
   ```

2. **Analyze changes**: Look for:
   - Logic errors and bugs
   - Security vulnerabilities
   - Missing error handling
   - Code style issues
   - Test coverage

3. **Provide feedback**:
   - List issues found with file:line references
   - Suggest specific improvements
   - Highlight good patterns

## Rules

- Always use `gh` CLI (unset GITHUB_TOKEN first for keyring auth)
- Check for PR templates in `.github/PULL_REQUEST_TEMPLATE/`
- Never force push to main/master
- Include test plan in PR body
