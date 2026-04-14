

## Problem

The GitHub Actions workflow fails because `package-lock.json` is out of sync with `package.json`. Test-related dependencies (vitest, @testing-library/*, jsdom, etc.) were added to `package.json` but never recorded in the lock file.

## Solution

Run `npm install` locally to regenerate `package-lock.json`, then commit and push both files. This is a one-step fix.

### Steps

1. **Regenerate the lock file** — In the Lovable sandbox, delete the current `package-lock.json` and run `npm install` to create a fresh one that includes all dependencies from `package.json`.

2. **Commit and push** — After the lock file is regenerated, commit the updated `package-lock.json` to the `main` branch and push. The GitHub Actions workflow will then succeed with `npm ci`.

### Technical Detail

`npm ci` requires an exact match between `package.json` and `package-lock.json`. Since Lovable added testing packages (vitest, jsdom, @testing-library/*) to `package.json` without updating the lock file, the mismatch causes the CI failure. Regenerating the lock file resolves this entirely.

