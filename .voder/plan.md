---

## NOW

- Run `npm run lint` to confirm that the `no-undef` errors for `window` and `document` are resolved.

## NEXT

- If lint still reports undefined globals, add specific `globals` entries or adjust the override block until lint exits with code 0.
- Execute `npm run test:ci` to verify the full CI pipeline (including the lint step) completes successfully.

## LATER

- Integrate Prettier into the workflow, add a `format` script, and update ADR 0007 accordingly.
- Add a Git pre-commit hook (e.g., via Husky) to auto-run formatting and lint fixes on staged files.
- Expand Playwright tests to cover ARIA roles, keyboard navigation, and `prefers-reduced-motion` scenarios.x
