# Development Guidelines

**Git Repository:** <https://github.com/mountain-pass/voder.ai-website.git>

## Project Requirements & Design

1. **Mockups & Visual Validation**
   - Mockups for various sections are located in `assets/mockups/`
   - You MUST NOT put the files in `assets` into `.gitignore` or `.voderignore`
   - Screenshots of the website must resemble the mockups, but DO NOT expect them to be the right size. These are look and feel mockups not high-fidelity mockups. DO NOT USE THEM FOR VISUAL REGRESSION TESTS
   - Capture screenshots for comparison against the spec, but DO NOT CREATE VISUAL REGRESSION TESTS
   - The voder logo is `assets/voder_wordmark.svg`. YOU MUST NOT DELETE THIS FILE. IT IS NOT A PLACEHOLDER.
   - The voder cube is `assets/voder_cube.svg`. YOU MUST NOT DELETE THIS FILE. IT IS NOT A PLACEHOLDER.

2. **3D Elements**
   - Copy `assets/cube.glb` is the 3D cube to use with the site
   - Generate placeholder images and 3D elements as needed
   - Keep a record of all the placeholders in `docs/placeholders.md` with the filename, where it is used and what is needed in it's place.

## Version Control & Code Management

1. **Git Workflow**
   - Code MUST be committed frequently. THIS IS VERY IMPORTANT
   - When the tests pass, you MUST commit.
   - IF THERE ARE more than 5 modified or untracked files, you MUST plan to commit NOW!
   - IF none of the last 5 actions in the history are a commit, you MUST plan to commit NOW!
   - If there are un-pushed commits, you MUST plan to push NOW! If it's not safe, you MUST plan NOW to make the changes so that it is safe to push!

2. **Process Management**
   - DO NOT KEEP PROCESSES RUNNING LONGER THAN NECESSARY. IF YOU NO LONGER HAVE A NEED FOR A PROCESS, YOU MUST PLAN TO STOP IT NOW!
   - Record linting and testing output in `outputs/`, but do NOT commit them
   - YOU MUST DELETE THE FILES `outputs/` WHEN THEY ARE NO LONGER NEEDED

3. **Debugging & Troubleshooting**
   - **WHEN TESTS ARE FAILING:** Always run `npm run build` first to check for compilation errors before trying to fix test failures
   - **BUILD ERRORS reveal the root cause** - don't spend time debugging tests when the underlying code won't even compile
   - If tests are failing and you're unsure why, ALWAYS check the build output for TypeScript errors, missing imports, or syntax issues
   - Use `npm run build` to get precise error messages with line numbers and file locations
   - Only debug test logic AFTER confirming the code builds successfully

## Technology & Architecture

1. **Technology Choices**
   - DO NOT USE OLD VERSIONS OF DEPENDENCIES
   - DO NOT USE reveal.js
   - Technology choices (e.g. testing frameworks, databases, hosting, etc) MUST be recorded as architectural decision records (ADRs) in `docs/decisions` using MADR format
   - Architectural decision records MUST match the format in template `assets/adr-template.md`
   - DO NOT BET AGAINST THE MARKET. As in, don't choose non-market leading technologies
   - Also record implementation decisions (e.g. for CSS and Animation) so we don't go back and forth between options. If an option doesn't work, YOU MUST update the decision with details of why it failed, so we don't try the same thing again.
   - **Note:** Critters is deprecated. Use [Beasties](https://github.com/danielroe/beasties) instead for CSS inlining.

## Accessibility & User Experience

1. **Accessibility Requirements**
   - ACCESSIBILITY IS EXTREMELY IMPORTANT BUT THERE IS NO POINT MAKING INCORRECT SOFTWARE ACCESSIBLE. MAKE IT RIGHT, THEN MAKE IT ACCESSIBLE
   - MAKE SURE THERE IS SUFFICIENT COLOR CONTRAST BETWEEN TEXT AND ITS BACKGROUND
   - All components must follow ARIA requirements specified in `prompts/accessibility-requirements.md`
   - Text must meet WCAG 2.1 AA contrast ratios (see `prompts/brand-guide.md` for approved combinations)
   - All interactive elements must be keyboard accessible
   - Respect `prefers-reduced-motion` for animations
   - Screen reader compatibility is mandatory
   - Accessibility Testing can incorrectly fail, if the checks are not performed at the right time. Make sure the scroll is correct and the animations have finished before performing the accessability tests. If it looks like styles are not being correctly applied, ALWAYS check if the animations are impacting the tests.

2. **Layout, Animation & Transition Testing**
   - Test layout responsiveness across mobile, tablet, and desktop breakpoints
   - Verify animations complete properly before running accessibility scans (use `waitForAnimationsComplete` helper)
   - Test `prefers-reduced-motion` behavior - animations should disable gracefully
   - Validate scroll-triggered animations activate at correct viewport positions
   - Check GSAP timeline sequencing and easing functions work as intended
   - Ensure transitions don't cause layout shift or accessibility issues
   - Test Three.js 3D scenes load and render without errors
   - Verify focus management during animated state changes
   - Animation timing should match brand guidelines (calm confidence, not hype)

3. **Responsive Design**
   - The site MUST display correctly on mobile, tablet and desktop

## Performance

**IMPORTANT: Performance optimization is NOT a current priority and will be addressed in a future development phase.**

- Focus on correctness, accessibility, and user experience first
- Basic performance monitoring is included in production validation for baseline measurement only
- Do NOT spend time on performance optimization techniques at this stage
- Performance improvements will be planned and implemented in a dedicated future phase
- Current focus: functional requirements, accessibility compliance, and visual design implementation

## Libraries

- For each library depended on, you MUST maintain a copy it's README.md into in `docs/libraries`.
- The README.md must match the correct version from the dependency
- The preferred way of doing this is to create a symbolic link to the dependency's README.md in the `node_modules` directory

## Local Servers

- use `start_server` to start a local dev server. Keep it running if it supports hot-module-replacement. Otherwise, only run it as needed.
- use `start_server` to start a local preview server. It won't support hot-module-replacement, so make sure you shut it down when it's not needed.
- use `stop_background_process` to stop the local servers as this will udpate the process file. If you've killed it another way and you no longer have the PID, use `npx kill-port` to stop it.

## Deployment

1. **Build & Preview**
   - Always run `npm run build` before deployment to ensure production build works
   - Test production build locally with `npm run preview` before pushing
   - Verify all assets load correctly in production build
   - Check that static files are properly served from `public/` directory

2. **CI/CD Pipeline**
   - All changes MUST pass the CI pipeline before deployment
   - GitHub Actions automatically builds and tests on every push
   - Deployment happens automatically on successful merge to main branch
   - Monitor deployment status and logs for any issues
   - MAKE sure a hosting decision is made before trying to deploy

3. **Production Validation**
   - Verify deployed site loads correctly at production URL
   - Test critical user flows on live site
   - Run accessibility scans against production environment
   - Check performance metrics and Core Web Vitals (for monitoring only - performance optimization will be addressed in a future phase)
   - Validate HTTPS and security headers are properly configured

4. **Rollback Plan**
   - Keep previous working deployment readily available for rollback
   - Document any breaking changes or migration steps
   - Have monitoring in place to detect issues quickly
   - Know how to revert to previous version if critical issues arise

## Definition of Done

1. **Completion Criteria**
   - YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED
   - YOU ARE NOT DONE UNTIL THE SCREENSHOTS MATCH THE REQUIREMENTS
   - YOU ARE NOT DONE UNTIL THE CI PIPELINE IS PASSING
