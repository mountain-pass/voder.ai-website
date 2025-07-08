# Development Guidelines

**Git Repository:** <https://github.com/mountain-pass/voder.ai-website.git>

## Project Requirements & Design

1. **Mockups & Visual Validation**
   - Mockups for various sections are located in `assets/mockups/`
   - Screenshots of the website must closely resemble the mockups (90% match)
   - NOTE: THE SPECIFICATION FOR THE WEBSITE HAS CHANGED SINCE THE CODE WAS FIRST WRITTEN. YOU MUST REMOVE ELEMENTS IN THE WEBSITE THAT ARE NOT IN THE SPECIFICATION, like the "vibe" and "code" buttons and the gear and globe SVGs, etc.

2. **3D Elements**
   - Copy `assets/mockups/cube.glb` to use as a placeholder for 3D elements
   - Generate placeholder images as needed
   - Keep a record of all the placeholders in `docs/placeholders.md` with the filename, where it is used and what is needed in it's place.

## Version Control & Code Management

1. **Git Workflow**
   - Code MUST be committed frequently. THIS IS VERY IMPORTANT
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

## Accessibility & User Experience

1. **Accessibility Requirements**
   - ACCESSIBILITY IS EXTREMELY IMPORTANT BUT THERE IS NO POINT MAKING INCORRECT SOFTWARE ACCESSIBLE. MAKE IT RIGHT, THEN MAKE IT ACCESSIBLE
   - MAKE SURE THERE IS SUFFICIENT COLOR CONTRAST BETWEEN TEXT AND ITS BACKGROUND
   - All components must follow ARIA requirements specified in `prompts/accessibility-requirements.md`
   - Text must meet WCAG 2.1 AA contrast ratios (see `prompts/brand-guide.md` for approved combinations)
   - All interactive elements must be keyboard accessible
   - Respect `prefers-reduced-motion` for animations
   - Screen reader compatibility is mandatory

2. **Responsive Design**
   - The site MUST display correctly on mobile, tablet and desktop

## Definition of Done

1. **Completion Criteria**
   - YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED
   - YOU ARE NOT DONE UNTIL THE SCREENSHOTS MATCH THE REQUIREMENTS
   - YOU ARE NOT DONE UNTIL THE CI PIPELINE IS PASSING
