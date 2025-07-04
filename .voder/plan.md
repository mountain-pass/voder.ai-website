## NOW

Stage and commit all current working-directory changes with a clear message so the repository is clean and up to date.

## NEXT

- Review each test in `tests/` (`console.spec.js`, `navigation.spec.js`, `responsive.spec.js`, `smoke.spec.js`) to ensure every `page.screenshot` call writes into `outputs/screenshots/`.  
- Search documentation (`README.md`, `docs/decisions/*.md`) for any lingering references to `tests/screenshots` and remove or update them.  
- Confirm that the `tests/screenshots/` directory no longer exists in the project.

## LATER

- Add Playwright visual-regression (snapshot) tests for robust UI change detection.  
- Integrate an automated accessibility audit (e.g., axe-core) into the end-to-end suite.  
- Begin designing a conventional landing page to replace or supplement the Reveal.js deck after launch.