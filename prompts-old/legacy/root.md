# Root Integration Instructions for Task 1.10 (Path Mapping Refinement)

This file collects all changes needed at the monorepo root to finish Task 1.10. Move/apply these in the real root repo, then mark the remaining 1.10 sub-actions DONE.

## 1. Add Generation Script to Root package.json

Merge/append (preserve existing scripts):

"scripts": {
"generate:paths": "ts-node packages/dev-config/scripts/generate-paths.ts",
"postinstall": "npm run generate:paths && npm run format --workspaces --if-present",
// or, if you already have a prepare hook you prefer:
// "prepare": "npm run generate:paths && <existing>"
}

Choose either postinstall or prepare (postinstall preferred if you use workspaces + install caching). Ensure ts-node (or tsx) is available; alternatively precompile the script to JS and invoke node directly.

If you prefer JS runtime only:
"generate:paths": "node packages/dev-config/scripts/generate-paths.js"
(Commit a compiled JS variant if needed.)

## 2. Generate File Once

Run: npm run generate:paths
Result: tsconfig.paths.generated.json at repo root (deterministic sorted keys).
Add it to git (tracked file) so editors have paths immediately on fresh clone pre-install (optional but recommended if you also run the script in postinstall to refresh).

## 3. Restructure Root tsconfig

Current (example) may contain wildcard:
"paths": { "@voder/_": ["../_/src"] }
Remove that wildcard.

Option A (Extends Chain – Preferred):

1. Keep existing root base (e.g. tsconfig.base.json) content minus any paths.
2. Create / modify tsconfig.base.json:
   {
   "extends": "./tsconfig.paths.generated.json",
   "compilerOptions": {
   // existing compiler options WITHOUT paths
   }
   }
   Do not redeclare compilerOptions.paths in other extending configs (packages/\*/tsconfig.json). They should simply extend the root base.

Option B (Inline Merge):
Copy the generated file content into base on each run (not recommended – harder diffs). Stick with Option A unless tooling forbids extends chain.

## 4. Package tsconfig Files

Each package tsconfig should:
{
"extends": "../../tsconfig.base.json", // adjust relative path
"compilerOptions": {
// package-specific overrides only (no paths)
}
}
No local paths section; all aliasing flows from the generated file.

## 5. Docs Updates (Universal Guide)

Replace any example showing:
"paths": { "@voder/_": ["../_/src"] }
with a short section:

Generated Path Mappings
We do not use wildcard path globs. Instead a generated file `tsconfig.paths.generated.json` enumerates each public entry: "@voder/<pkg>" -> "packages/<pkg>/src/index.ts". This prevents deep internal imports and accidental resolution of non-public modules. Update by running `npm run generate:paths` after adding a new package.

Add ADR Exception Note:
Any request to map additional entry points (e.g. subpath exports, deep folders) requires an ADR citing Path Mapping Strategy (Q7) with explicit justification.

Add ESLint Guard Snippet (universal):
"no-restricted-imports": ["error", { "patterns": [
"@voder/*/src/*",
"@voder/*/src/**",
"../*/src/*",
"../../*/src/*"
]}]
Rationale: Only public API (index.ts) of each package is importable across package boundaries.

## 6. Docs Updates (dev-config package doc)

Add small section paralleling universal guide:
Path Alias Source of Truth
This package relies on the root-generated `tsconfig.paths.generated.json`. Do not manually edit `compilerOptions.paths` here. Run `npm run generate:paths` when you add a new package.

Add style directive:
Always import other packages using `@voder/<package>` (never relative traversals like `../../other-pkg/src` or deep `@voder/other-pkg/src/*`).

## 7. ADR Boilerplate (for an Exception)

Title: Additional Path Mapping for <package>
Context: Need subpath export `<package>/experimental`.
Decision: Add explicit mapping and export field in that package's package.json.
Consequences: Increases public surface; must document stability level; re-run generation script to include.

Include guard reminding to add restricted-imports pattern to forbid internal paths beyond newly approved subpath(s).

## 8. Validation Checklist After Applying

- [ ] Root package.json contains generate:paths script.
- [ ] tsconfig.paths.generated.json present & committed.
- [ ] Root base tsconfig extends generated file; no wildcard paths anywhere.
- [ ] All package tsconfig files lack local paths definitions.
- [ ] Docs updated (universal + dev-config) replacing wildcard example.
- [ ] ESLint config (central) includes restricted-imports guard.
- [ ] todo.md Task 1.10 all sub-actions checked.

## 9. Optional Enhancements

- Add a CI step: `npm run generate:paths && git diff --exit-code tsconfig.paths.generated.json` to ensure devs ran the script if new packages added.
- Create a simple script (scripts/verify-paths.ts) that fails if wildcard patterns reappear in any tsconfig.

## 10. Marking Completion

After all above merged:

1. Update todo.md: mark remaining 1.10 items [x].
2. Proceed to Task 1.11 (trim duplicate scope section in universal guide).

---

End of root integration instructions for Task 1.10.
