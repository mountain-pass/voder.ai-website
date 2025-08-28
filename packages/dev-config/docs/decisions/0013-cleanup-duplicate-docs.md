---
status: accepted
date: 2025-08-28
deciders:
  - voder-dev-team
owner: voder-dev-team
packages: '@voder/dev-config'
---

# ADR-0013: Consolidate duplicated documentation and refactor duplicated code

## Context and Problem Statement

Over time this repository has accumulated duplicated and near-duplicate content across documentation and some duplicated logic in configuration and utility code. Duplicate documentation increases maintenance cost, creates inconsistent guidance for consumers, and lowers the repository's quality score. Duplicated code fragments increase the risk of regressions and make it harder to reach required coverage and linting goals.

The objective of this ADR is to authorize a focused, conservative cleanup that consolidates user-facing duplicated documentation and safely refactors obvious duplicated code into small shared utilities. The work must preserve the public API, tests, ADR history, and must not modify or remove protected internal prompt material or .voder state.

## Scope

Included (may be modified as part of this ADR):

- docs/ (user-facing documentation), README.md, CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, docs/libraries/usage/*
- Top-level published documentation that consumers rely on (files tracked in git and not under prompts/ or .voder/)
- Code duplication in source trees where refactoring is low-risk and testable: src/, eslint/, scripts/, linters/

Explicitly excluded (protected; DO NOT MODIFY):

- prompts/ (all content under prompts/ is protected and must not be edited)
- prompt-assets/ (template assets are protected; record duplicates only)
- .voder/ (history and agent metadata)
- Any generated or ignored build artifacts (dist/, coverage/, etc. — do not modify tracked ignore patterns)
- Any file that tests or CI depend on which would require cross-repo coordination (unless a separate ADR is created)

## Constraints

- All changes must be small, focused commits referencing ADR-0013.
- Changes must be accompanied by tests (unit tests / documentation linting) and verification steps.
- Documentation merges must preserve headings, formatting, and the canonical meaning of content for consumers.
- No changes to prompts/ or .voder/ content; duplicates found there are to be documented only.
- Maintain public package exports and compiled artifacts expected by existing tests unless replaced by equivalent, well-tested refactors.
- Follow the project's verify order and console-first policy when validating changes.
- If any refactor introduces multiple TypeScript build errors, revert the last change and proceed one file/move at a time.

## Decision (Intended Approach)

We adopt a five-step, conservative workflow for cleanup and refactor:

1. Detect
   - Run a repository-wide duplicate detection (excluding prompts/ and .voder/) to enumerate exact byte-level duplicates and highly similar files. This is a report-only step prior to edits.

2. Classify
   - For each duplicate group, classify as:
     - docs/user-facing (docs/, README.md, CHANGELOG.md, SECURITY.md, etc.)
     - docs/internal (prompt-assets/, other internal templates; document but do not modify unless cleared)
     - code (src/, eslint/, scripts/, linters/)
     - other/protected (.voder/, prompts/, system files)
   - Record classification and canonical file choices in the ADR as notes.

3. Consolidate / Merge (docs/user-facing only)
   - For each user-facing duplicate group:
     - Choose a single canonical file (prefer a file under docs/ or README.md).
     - Merge and deduplicate content into canonical file (preserve headings and links).
     - Remove duplicate files only after merge and verification.
     - Run markdown lint fix, markdown lint check, format, and commit each consolidation.

4. Refactor (code duplication only)
   - For duplicated code fragments:
     - Extract minimal, well-named utilities under src/utils/ (one extraction per commit).
     - Update callers to import the new utility.
     - Add or update unit tests that exercise the extracted logic.
     - Run targeted tests and full verify if needed before committing.

5. Verify
   - After each change/commit run the conservative verify sequence:
     - npm run lint:fix && npm run lint:check
     - npm run lint:md:fix && npm run lint:md
     - npm run format && npm run build
     - Run affected tests (npx vitest run <relevant files>) and, if uncertain, the full test suite.
   - Stop immediately on the first failure, fix the failure, and continue.

This approach prioritizes safety, test coverage, and small, traceable commits.

## Consequences

Positive:

- Reduced maintenance burden and clearer, single-source documentation for consumers.
- Improved code reuse and a smaller surface for bugs.
- Better repository quality scores and easier ADR/decision traceability.

Negative / Risks:

- Mistakes during consolidation could alter consumer-facing guidance if not carefully verified.
- Refactors may transiently break TypeScript build if not performed atomically and tested.
- Work requires careful attention to not modify protected files (prompts/, .voder/).

Mitigations:

- Respect the protected scope; log duplicates for prompts/ in this ADR without editing them.
- Make small, focused commits and run the project's verify pipeline before pushing.
- Revert the last refactor commit if multiple top-level tsc errors occur and perform single-file moves as prescribed.

## CONFIRMATION / Acceptance Criteria

- ADR file exists at docs/decisions/0013-cleanup-duplicate-docs.md (this file).
- Duplicate detection report run and recorded in console output before edits.
- Each user-facing duplicate group consolidated into a single canonical file with a focused commit per group (commits must reference ADR-0013).
- Each code duplication refactor is implemented as a focused extraction with unit tests and a passing verify pipeline.
- No prompts/ or .voder/ content is modified; any duplicates found there are documented in ADR-0013 with rationale for leaving them untouched.
- Final state: `npm run verify` completes successfully; documentation lint and format pass; package build succeeds; and smoke tests pass.

## Operational Owner

Primary owner: voder-dev-team  
Day-to-day executor: the single-agent maintainer performing the changes (document actions in console-first history as required).

ADR recorded by: voder-dev-team on 2025-08-28

ADR notes:

- Any intentional exceptions (duplicates that must remain) must include a short rationale in that canonical file and link back to this ADR.
- Longer-term improvements (CI duplicate checks, CONTRIBUTING updates) will be proposed as follow-up ADRs once consolidation completes.
- Focus on small commits and run verify after each.

## Duplicate classification (finalized)

The entries below replace the earlier auto-stubbed placeholders with conservative canonical choices and one-line rationale for each duplicate group. Canonical choices preferentially use coverage/lcov-report/*for coverage assets and files under typescript/dist/* for built declaration artifacts. These choices are conservative: prefer keeping the copy under coverage/lcov-report/ (human-readable report layout) and keeping declarations under typescript/dist/* (standard build output layout).

Duplicate group — representative files:

1) ./coverage/base.css  <-->  ./coverage/lcov-report/base.css  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/base.css  
   rationale: coverage/lcov-report/ is the canonical generated HTML report location used by coverage consumers; top-level coverage/* copies are generated and should remain ignored.

2) ./coverage/sorter.js  <-->  ./coverage/lcov-report/sorter.js  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/sorter.js  
   rationale: keep assets under the lcov-report directory which is the canonical coverage report output.

3) ./coverage/favicon.png  <-->  ./coverage/lcov-report/favicon.png  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/favicon.png  
   rationale: favicons are part of the lcov HTML report; prefer the lcov-report copy as canonical and ignore other generated copies.

4) ./coverage/block-navigation.js  <-->  ./coverage/lcov-report/block-navigation.js  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/block-navigation.js  
   rationale: keep interactive report scripts inside the lcov-report directory where coverage viewers expect them.

5) ./coverage/prettify.js  <-->  ./coverage/lcov-report/prettify.js  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/prettify.js  
   rationale: prettify.js is a coverage report asset — canonical under lcov-report.

6) ./coverage/prettify.css  <-->  ./coverage/lcov-report/prettify.css  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/prettify.css  
   rationale: CSS assets belong with the HTML report in lcov-report.

7) ./coverage/sort-arrow-sprite.png  <-->  ./coverage/lcov-report/sort-arrow-sprite.png  
   classification: other/protected (generated)  
   chosen canonical: ./coverage/lcov-report/sort-arrow-sprite.png  
   rationale: graphical assets are canonical in the lcov-report directory; other copies are generated duplicates.

8) ./typescript/dist/src/index.test.d.ts  <-->  ./typescript/dist/src/testing/index.test.d.ts  
   classification: code (build artifacts / duplicated declarations)  
   chosen canonical: ./typescript/dist/src/index.test.d.ts  
   rationale: prefer a single top-level generated declaration per compiled module path under typescript/dist/src/ to avoid nested duplication; keep the flat index.d.ts layout as canonical.

9) ./typescript/dist/index.d.ts  <-->  ./typescript/dist/typescript/index.d.ts  
   classification: code (build artifacts / duplicated declarations)  
   chosen canonical: ./typescript/dist/index.d.ts  
   rationale: the package-level dist index.d.ts is the canonical declaration for consumers; nested typescript/ paths are redundant generated artifacts.

# Notes and next steps (reference)

- The canonical choices above are intentionally conservative to minimize build/test impact; the operational cleanup will remove non-canonical tracked duplicates where safe and document exceptions in this ADR when a tracked file must remain.
- Do NOT modify any content under prompts/, prompt-assets/, or .voder/ as part of cleanup.
- When a tracked generated file removal causes verify failures, restore the tracked file and update this ADR to record the exception.
- After any removal or consolidation, run the full conservative verify sequence and stop on the first failure.

# Action log placeholder

- Duplicate classification finalized and recorded in this ADR (2025-08-28).
- Implementation of removal/consolidation steps will be performed in small, focused commits referencing ADR-0013.

- Generated & intentionally ignored: coverage/* — canonical location is coverage/lcov-report/; top-level coverage artifacts are generated and should remain ignored.
- Generated & intentionally ignored: typescript/dist/* — compiled artifacts are generated and intentionally ignored.
- [CANDIDATE] 0005f2900e1fccf134ab517e31bc278f4e40c257 : generated/build-artifact — files: 
- [CANDIDATE] 0005f2900e1fccf134ab517e31bc278f4e40c257 : generated/build-artifact — files: 
- [CLASSIFIED] 0005f2900e1fccf134ab517e31bc278f4e40c257 : generated/build-artifact (heuristic: generated or vendor file)
- [NO-ACTION] 0005f2900e1fccf134ab517e31bc278f4e40c257 — no tracked files to untrack

## Post-verify failure note

- date: 2025-08-28
- summary: Attempted to run the non-interactive verify sequence from a clean state, but the initial `npm ci` step failed because a package-lock.json (or npm-shrinkwrap.json) was not present in the repository. As a result the full `npm run verify` did not execute.
- key errors observed (from /tmp/verify-npm-ci.log):
  - "npm error The `npm ci` command can only install with an existing package-lock.json or npm-shrinkwrap.json"
  - "npm error audit This command requires an existing lockfile. Try creating one first with: npm i --package-lock-only"
- logs produced:
  - /tmp/verify-npm-ci.log  (primary log from the attempted clean install)
  - the `npm run verify` step did not run; /tmp/verify-run-verify.log was not created.
  - additional npm debug logs may be available at: /Users/tomhoward/.npm/_logs/2025-08-28T15_59_25_085Z-debug-0.log and /Users/tomhoward/.npm/_logs/2025-08-28T15_59_25_716Z-debug-0.log
- next steps taken: stop further automatic remediation and record this failure for triage. Do NOT run pushes, package-lock commits, or untrack operations until a human maintainer reviews the logs and approves the next action.

- 2025-08-28T00:00:00+00:00 — duplicate-detection: no tracked non-canonical duplicates found; report at /tmp/duplicate-report.txt
