## NOW
Run `git add . && git commit -m "chore: commit pending verified fixes"` to record the current local modifications that restored pipeline success.

## NEXT
Run `npm run verify` to confirm the build, lint, format, and tests remain green; if any failures appear, apply targeted fixes, stage & commit them, then re-run `npm run verify` until fully green.

## LATER
- Add a `"check:duplicates": "sh scripts/duplicate-detect.sh"` entry to `package.json`  
- Insert `npm run check:duplicates` immediately after `npm audit fix --force` in the `verify` script  
- Proceed with ADR-0013 documentation consolidation in small commits, verifying with `npm run verify` after each change