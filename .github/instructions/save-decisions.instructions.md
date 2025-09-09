---
applyTo: '**'
---

When I give you instructions for modifying how decisions are managed, you need to:

1. **Create a new ADR** in `docs/decisions/` for any architectural or process decision, following the MADR 4.0 format
2. **Then update** the requirements in #file:../../prompts/release-0.5/in-scope/001.1-PO-DECISION-MANAGEMENT.md to reflect the new decision

**What requires a new ADR:**

- Changes to decision management processes (review cycles, approval workflows, etc.)
- Changes to standards cultivation approaches (how standards are proposed, reviewed, or evolved)
- Changes to ADR format or structure requirements
- Changes to exemption handling or tracking
- Any architectural choice about how the decision system works

**What goes in the requirements update:**

- Document the expected behavior resulting from the ADR decision
- Update requirements to align with the new ADR
- Do NOT document issues found - focus on expected behavior

This doesn't mean you should document issues found. Instead, you should document the expected behaviour of the decision management.

When creating or updating decisions, ensure they conform to the MADR 4.0 format as per #file:../../prompt-assets/adr-template.md and follow the standards cultivation principles outlined in #file:../../prompts/release-0.5/in-scope/001.1-PO-DECISION-MANAGEMENT.md .

When making changes to decision files, ensure they are named according to the `<ID>-<kebab-case-title>.<status>.md` format and that IDs are unique and sequential.

When making a new decision, create the corresponding ADR file in the `docs/decisions/` directory, following the MADR 4.0 template structure.

When updating decision files, ensure that the status is clearly indicated (proposed, accepted, rejected, deprecated, superseded) and that any changes are reflected in the decision content.

When deprecating or superseding decisions, ensure that the new decision references the old one and explains the rationale for the change.
