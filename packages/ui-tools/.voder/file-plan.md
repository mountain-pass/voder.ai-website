## NOW

Create or update the repository .gitignore and .voderignore together (single action) so large/generated/cached files are excluded from VCS while allowing LLM visibility of selected build artifacts. Use the following patterns when creating/updating those two files:

- .gitignore (add at repo root)
  - Node / build outputs / caches
    - node_modules/
    - dist/
    - build/
    - coverage/
    - .cache/
    - .vite/
    - .nyc_output/
    - *.tsbuildinfo
  - Temporary / output / logs (absolute prohibition list from the guide)
    - *.log
    - *.txt
    - *.out
    - *.tmp
    - *.dump
    - logs/
    - temp/
    - tmp/
    - diagnostics/
    - artifacts/
  - Tool artifacts & editors/IDE
    - .eslintcache
    - .DS_Store
    - .vscode/
    - .idea/
    - *.suo
    - *.user
    - *.swp
  - OS / platform artifacts
    - Thumbs.db
    - .DS_Store
  - Secrets / local environment
    - .env
  - Build/test specific
    - dist-*/               # any alternative dist dirs
    - coverage-*/           # any alternative coverage dirs
  - Keep lockfile and package.json tracked (do NOT ignore package-lock.json, yarn.lock, package.json)

- .voderignore (add at repo root)
  - Negations to retain LLM visibility for selected build outputs that must be inspected by the agent:
    - !dist/
    - !coverage/lcov-report/
    - !build/types/
  - Keep .voderignore minimal otherwise; do not negate node_modules/ or other large runtime directories.

(One action: create/update these two files with the above contents.)

## NEXT

- Validate the ignore rules:
  - Review the new .gitignore/.voderignore contents to ensure package-lock.json and package.json remain tracked.
  - Confirm .env is listed in .gitignore and remove any sensitive files from the working tree if they are accidentally present in Git's index.
  - Run a dry-run or preview (locally) to confirm files that should be untracked will not be committed; update ignore patterns for any additional generated directories (e.g., project-specific build outputs) discovered later.
- If any important build artifacts must remain inspectable by the LLM, add targeted negations to .voderignore (use !path/to/artifact/) rather than exposing whole directories.
- Add a short note to the repository README or a contributing doc describing the purpose of .voderignore negations so future maintainers understand why some gitignored directories are exposed to the LLM.

## LATER

- Implement repository hygiene automation:
  - Add a small pre-commit check (script / CI job) that rejects commits containing forbidden file extensions or files not covered by .gitignore (e.g., any .log, .tmp, dist/ files committed inadvertently).
  - Add a periodic repository scan (script run in CI or on schedule) to detect large blobs and accidental check-ins (e.g., detect files > 5 MB not deliberately tracked).
  - Maintain a documented per-package .voderignore policy that lists which dist or coverage artifacts are intentionally negated for LLM inspection and why.
- Consider using Git LFS or external storage for any legitimate large binary assets that must be tracked (images, large templates) and document that in repo policies.
- Revisit ignore lists when adding new packages or CI workflows so that tooling-specific caches or outputs are consistently ignored across the monorepo.