# Development Guidelines

Git Repo: https://github.com/mountain-pass/voder.ai-website.git

1. The code MUST be committed frequently. THIS IS VERY IMPORTANT
2. IF THERE ARE more that 5 modified or untracked files, you MUST plan to commit NOW!
3. IF none of the last 5 actions in the history are a commit, you MUST plan to commit NOW!
4. If the branch is ahead by 1 commits and it's safe to push, you MUST plan to push NOW! If it's not safe, you MUST plan to make the changes so that it is safe NOW!
5. Technology choices (e.g. testing frameworks, databases, hosting, etc) MUST be recorded as architectural decision records (ADRs) in `docs/decisions` using MADR format.
   1. Architectural decision records MUST match the format the template `prompts/adr-template.md`
6. Record screenshots and server log files in `outputs/`, but do NOT commit them
7. ACCESSIBILITY IS EXTREMELY IMPORTANT. MAKE SURE THERE IS SUFFICIENT COLOR CONTRAST BETWEEN TEXT AND IT'S BACKGROUND.