# Development Guidelines

Git Repo: https://github.com/mountain-pass/voder.ai-website.git


1. Mockup of the various sections are in `assets/mockups/`
2. You must check that screenshots of website closely resemble the mockups
3. The code MUST be committed frequently. THIS IS VERY IMPORTANT
4. IF THERE ARE more that 5 modified or untracked files, you MUST plan to commit NOW!
5. IF none of the last 5 actions in the history are a commit, you MUST plan to commit NOW!
6. If there are un-pushed commits, you MUST plan to push NOW! If it's not safe, you MUST plan NOW to make the changes so that it is safe to push!
7. DO NOT KEEP PROCESSES RUNNING LONGER THAN NECESSARY. IF YOU NO LONGER HAVE A NEED FOR A PROCESS, YOU MUST PLAN TO STOP IT NOW!
8. DO NOT USE OLD VERSIONS OF DEPENDENCIES
9. DO NOT USE reveal.js
10. Technology choices (e.g. testing frameworks, databases, hosting, etc) MUST be recorded as architectural decision records (ADRs) in `docs/decisions` using MADR format.
   1. Architectural decision records MUST match the format the template `assets/adr-template.md`
   2. DO NOT BET AGAINST THE MARKET. As in, don't choose non-market leading technologies
11. Record screenshots and log files in `outputs/`, but do NOT commit them
12. ACCESSIBILITY IS EXTREMELY IMPORTANT. MAKE SURE THERE IS SUFFICIENT COLOR CONTRAST BETWEEN TEXT AND IT'S BACKGROUND.
13. The site MUST display correctly on mobile, tablet and desktop
14. YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED
15. YOU ARE NOT DONE UNTIL THE SCREENSHOTS MATCH THE REQUIREMENTS
16. YOU ARE NOT DONE UNTIL THE CI PIPELINE IS PASSING.