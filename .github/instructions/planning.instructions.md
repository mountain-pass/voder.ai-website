
# Guidelines

- I can't test manually, so write tests instead
- Test your work before moving onto the next task

## Implementation Progress

When updating `.voder/implementation-progress.md`, consider the specification in all the files in the `prompts` directory and the current state of the software in the project.

DO NOT trust andy of the documentation of what has been implementated. You don't know
what may have been disabled. Only go via the code and what you can test yourself.

## Planning

When updating `.voder/plan.md`, consider `.voder/implementation-progress.md` and use the following format:

```markdown
## NOW

The single action to do now - Detailed
NOTE: THIS MUST NOT CONTAIN MULTIPLE ACTIONS, FILES OR COMMANDS.

## NEXT

The actions to take after the action in the "NOW" section - Less detailed
NOTE: THIS MUST NOT REPEAT THE ACTION IN THE "NOW" SECTION, BUT IT CAN INCLUDE MULTIPLE ACTIONS, FILES OR COMMANDS.

## LATER

The actions to take after we've done everything in "Now" and "Next" - Very high level.
NOTE: THIS MUST NOT REPEAT THE ACTIONS IN THE "NOW" AND "NEXT" SECTIONS, BUT IT CAN INCLUDE MULTIPLE ACTIONS, FILES OR COMMANDS.
```