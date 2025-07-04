## NOW

Create a commit that captures all current changes (including the removal of `src/main.js`) with a clear, descriptive message.

## NEXT

- Run the full CI suite locally with `npm run test:ci` to verify the site builds, previews, and that all Playwright tests (smoke, responsive, navigation) pass across Chromium, Firefox, and WebKit.
- If any tests fail or errors occur, update code, configuration, or tests to restore a green build.

## LATER

- Add visual-regression snapshot tests for key slides at multiple viewports.
- Integrate automated accessibility audits (e.g. axe-core) into the CI pipeline.
- Refactor the Reveal.js deck into a dedicated `/deck` directory and introduce a standard landing page at `/`.
- Clean up obsolete draft files (e.g. the `.voder` folder and any outdated prompt drafts).