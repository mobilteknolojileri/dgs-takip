# Commit Conventions

Conventional Commits format.

> [!IMPORTANT]
> To maintain backwards traceability of the project history, commits must be as **atomic** (one discrete change per commit) and **clear** as possible. Use plain English to explicitly describe the action performed.

## Format

```
<type>(<scope>): <description>
```

## Types

| Type       | Use for                      |
| ---------- | ---------------------------- |
| `feat`     | New feature                  |
| `fix`      | Bug fix                      |
| `docs`     | Documentation                |
| `style`    | Formatting (no logic change) |
| `refactor` | Code restructure             |
| `perf`     | Performance                  |
| `test`     | Tests                        |
| `build`    | Dependencies, build system   |
| `ci`       | CI/CD                        |
| `chore`    | Maintenance, tooling         |
| `revert`   | Revert previous commit       |

## Scopes

`api` `db` `ui` `components` `pages` `layout` `config` `deps` `ci` `docs`
`dashboard` `exam` `analysis` `history` `countdown` `chart` `form` `types`

> **Note:** For static assets (images, icons), use `chore(assets)`.

## Examples

```
feat(exam): add subject-level input form
fix(api): correct net calculation formula
refactor(types): centralize shared interfaces
docs(readme): update installation guide
chore(deps): upgrade astro to latest
ci: add github actions quality pipeline
style(layout): fix navbar spacing on mobile
perf(dashboard): optimize database queries
feat(chart): add trend visualization component
feat(db): add exam subjects table schema
```

## Rules

- **Atomic**: One logical change per commit
- **Imperative**: "add" not "added"
- **Lowercase**: description starts lowercase
- **No code identifiers**: Avoid function/class/constant names in subject:
  - ❌ `add CloudflareEnv interface` → code identifier
  - ❌ `fix ExamForm component` → PascalCase identifier
  - ✅ `add cloudflare environment types` → descriptive text
  - ✅ `fix exam entry form validation` → descriptive text
- **No period**: no `.` at end
- **Header max 72 chars**: type + scope + description combined

## Breaking Change

Add `!` after scope:

```
feat(db)!: restructure exam schema with subject support
```

## Revert

```
revert: feat(exam): add subject-level input form
```

## Issue Reference

```
fix(api): resolve duplicate exam entry (#12)
```

## AI Instructions

> [!CAUTION]
> **DO NOT** execute git commands directly in the terminal. ALWAYS provide a bulk, copy-pasteable code block containing the commands for the user to run manually.

When suggesting commits:

1. **Batch format**: Provide commits as copy-pasteable PowerShell commands. **NO comment lines** (no `#` prefixes):

```powershell
git add "src/pages/api/exams.ts" "src/pages/api/exams/[id].ts" "src/pages/api/stats.ts"
git commit -m "feat(api): add exam crud and stats endpoints"

git add "src/components/ExamForm.tsx"
git commit -m "feat(form): add tabbed exam entry with subject details"
```

2. **Quote all paths**: PowerShell requires quotes:

```powershell
git add "src/pages/exam/[id].astro"
```

3. **Atomic commits**: Group related files, separate unrelated changes into different commits.

4. **STRICT lowercase rule**: NEVER use camelCase, PascalCase or code identifiers in commit message subject:
   - ❌ `use getStats function` → camelCase identifier
   - ❌ `add SubjectChart component` → PascalCase identifier
   - ✅ `use stats helper` → descriptive lowercase
   - ✅ `add subject performance chart` → descriptive lowercase
