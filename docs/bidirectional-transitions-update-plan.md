# Bidirectional Scroll Transitions: Required Prompt Updates

## Problem Statement

The current implementation only plays transitions when scrolling down (forward) but doesn't reverse them when scrolling up. This breaks the core narrative flow requirement that all scroll-triggered transitions must be bidirectional.

## Root Cause

The prompts are not explicit enough about reverse behavior. While the main files mention bidirectional requirements, individual transition files lack specific implementation details for reverse scrolling.

## Required Updates

### 1. ✅ Already Updated Files

These files already have strong bidirectional requirements:

- `prompts/sections/00 Narrative Structure.md` - Has "Critical Bidirectional Scroll Requirements" section
- `prompts/transition-patterns.md` - Has "CRITICAL: Bidirectional Scroll-Triggered Transition" with code examples
- `prompts/sections/02 Transition: Brand Entry → The Why copy.md` - Now has explicit reverse behavior section

### 2. 🔧 Files That Need Updates

Each remaining transition file needs a **"🔄 Bidirectional Scroll Behavior (CRITICAL)"** section added:

#### Required for Each Transition File:

- `prompts/sections/01 Transition: On Load → Brand Entry.md` (not scroll-triggered, but needs clarity)
- `prompts/sections/03 Transition: The Why → Problem Space copy.md`
- `prompts/sections/04 Transition: Problem Space → Metaphor.md`
- `prompts/sections/05 Transition: Metaphor → Vision Flow.md`
- `prompts/sections/06 Transition: Vision Flow → Prompt-Driven Iteration.md`
- `prompts/sections/07 Transition: Prompt-Driven Iteration → Outcome Focus.md`
- `prompts/sections/08 Transition: Outcome Focus → Closing Moment.md`

#### Template to Add to Each File:

```markdown
### 🔄 Bidirectional Scroll Behavior (CRITICAL)

**This transition must work in BOTH directions:**

#### Forward (Scroll Down: [Section A] → [Section B])
- [Specific animation details for forward direction]
- [Element movements, opacity changes, transforms]
- [Timeline of visual changes]

#### Reverse (Scroll Up: [Section B] → [Section A])
- [Specific animation details for reverse direction]
- [How elements return to previous state]
- [Reverse timing considerations]

#### GSAP ScrollTrigger Implementation
```typescript
ScrollTrigger.create({
  trigger: "[trigger-element]",
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play reverse play reverse", // CRITICAL: bidirectional
  onStart: () => announceToScreenReader("[forward-message]"),
  onComplete: () => announceToScreenReader("[forward-complete]"),
  onReverseComplete: () => announceToScreenReader("[reverse-complete]")
});
```

#### Testing Both Directions
```typescript
// Test forward transition
await page.mouse.wheel(0, 100);
await waitForAnimationsComplete(page);
await expect(page.locator('[data-testid="[section-b-element]"]')).toBeVisible();

// Test reverse transition
await page.mouse.wheel(0, -100);
await waitForAnimationsComplete(page);
await expect(page.locator('[data-testid="[section-a-element]"]')).toBeVisible();
```
```

### 3. Implementation Clarity Needed

For each transition, the prompts should specify:

1. **Forward Animation Details**: Exact property changes, timing, easing
2. **Reverse Animation Details**: How to undo the forward changes
3. **State Management**: How to track which state we're transitioning to/from
4. **Accessibility**: Screen reader announcements for both directions
5. **Testing**: Assertions for both scroll directions

### 4. Key GSAP ScrollTrigger Requirements

Every scroll-triggered transition MUST use:

```typescript
toggleActions: "play reverse play reverse"
// NOT just: onEnter: () => animation.play()
```

### 5. Testing Requirements

Every transition test suite must include:

- Forward scroll behavior verification
- Reverse scroll behavior verification  
- State restoration validation
- Accessibility announcements for both directions

## Implementation Priority

1. **HIGH**: Update `src/lib/TransitionController.ts` to use `toggleActions` instead of `onEnter`
2. **MEDIUM**: Add bidirectional sections to all remaining transition prompt files
3. **LOW**: Update existing Playwright tests to verify both directions

## Expected Outcome

After these updates:
- All scroll transitions will play forward on scroll down AND reverse on scroll up
- LLMs implementing transitions will have clear, actionable guidance for bidirectional behavior
- Tests will verify both directions work correctly
- The narrative flow will feel natural when users scroll up and down through sections
