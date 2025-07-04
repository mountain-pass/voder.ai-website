# Development Guidelines

Git Repo: https://github.com/mountain-pass/voder.ai-website.git

1. The code MUST be committed frequently. THIS IS VERY IMPORTANT
2. IF THERE ARE more that 5 modified or untracked files, you MUST plan to commit NOW!
3. IF none of the last 5 actions in the history are a commit, you MUST plan to commit NOW!
4. If the branch is ahead by 1 commits and it's safe to push, you MUST plan to push NOW! If it's not safe, you MUST plan to make the changes so that it is safe NOW!
5. DO NOT KEEP PROCESSES RUNNING LONGER THAN NECESSARY. IF YOU NO LONGER HAVE A NEED FOR A PROCESS, YOU MUST PLAN TO STOP IT NOW!
6. Technology choices (e.g. testing frameworks, databases, hosting, etc) MUST be recorded as architectural decision records (ADRs) in `docs/decisions` using MADR format.
   1. Architectural decision records MUST match the format the template `prompts/adr-template.md`
7. Record screenshots and log files in `outputs/`, but do NOT commit them
8. ACCESSIBILITY IS EXTREMELY IMPORTANT. MAKE SURE THERE IS SUFFICIENT COLOR CONTRAST BETWEEN TEXT AND IT'S BACKGROUND.
9. You MUST capture screenshots as part of the tests.
10. YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED
11. YOU ARE NOT DONE UNTIL THE SCREENSHOTS MATCH THE REQUIREMENTS