# Development Guidelines

**Git Repository:** <https://github.com/mountain-pass/voder.ai-website.git>

## Project Requirements & Design

1. **Mockups & Visual Validation**
   - Mockups for various sections are located in `assets/mockups/`
   - You MUST NOT put the files in `assets` into `.gitignore` or `.voderignore`
   - Screenshots of the website must resemble the mockups, but DO NOT expect them to be the right size. These are look and feel mockups not high-fidelity mockups. DO NOT USE THEM FOR VISUAL REGRESSION TESTS
   - Capture screenshots for comparison against the spec, but DO NOT CREATE VISUAL REGRESSION TESTS

2. **3D Elements**
   - Copy `assets/mockups/cube.glb` to use as a placeholder for 3D elements
   - Generate placeholder images as needed
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

## Technology & Architecture

1. **Technology Choices**
   - DO NOT USE OLD VERSIONS OF DEPENDENCIES
   - DO NOT USE reveal.js
   - Technology choices (e.g. testing frameworks, databases, hosting, etc) MUST be recorded as architectural decision records (ADRs) in `docs/decisions` using MADR format
   - Architectural decision records MUST match the format in template `assets/adr-template.md`
   - DO NOT BET AGAINST THE MARKET. As in, don't choose non-market leading technologies
   - Also record implementation decisions (e.g. for CSS and Animation) so we don't go back and forth between options. If an option doesn't work, YOU MUST update the decision with details of why it failed, so we don't try the same thing again.

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
2. **Responsive Design**
   - The site MUST display correctly on mobile, tablet and desktop

## Libraries

- For each library depended on, you MUST maintain a copy it's README.md into in `docs/libraries`.
- The README.md must match the correct version from the dependency
- The preferred way of doing this is to create a symbolic link to the dependency's README.md in the `node_modules` directory

## Local Servers

- use `start_server` to start a local dev server. Keep it running if it supports hot-module-replacement. Otherwise, only run it as needed.
- use `start_server` to start a local preview server. It won't support hot-module-replacement, so make sure you shut it down when it's not needed.
- use `stop_background_process` to stop the local servers as this will udpate the process file. If you've killed it another way and you no longer have the PID, use `npx kill-port` to stop it.

## Definition of Done

1. **Completion Criteria**
   - YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED
   - YOU ARE NOT DONE UNTIL THE SCREENSHOTS MATCH THE REQUIREMENTS
   - YOU ARE NOT DONE UNTIL THE CI PIPELINE IS PASSING
