# Typing Animation Effect Requirements for The Why Section

## 🎯 **The Why Section Specific Needs**

The the-why-section requires TypingAnimationEffect to provide a simplified interface for typing philosophical content with specific timing and emphasis patterns that go beyond the standard typing effect interface.

## 📋 **Required Method Additions**

### **Convenience Method for Content + Animation**
The section expects a `typeText()` method that combines content setting and animation start:

```typescript
typeText(content: string, options: TypeTextOptions): Promise<void>
```

**Current Interface Gap:** The existing interface requires separate calls to `setContent()` and `startTyping()`, but sections need a single convenient method.

**Options Interface Expected:**
```typescript
interface TypeTextOptions {
  speed: number;                           // Characters per second
  cursor: boolean;                         // Show/hide cursor during typing
  onComplete?: () => void;                 // Callback when typing completes
  onChar?: (char: string, index: number) => void; // Per-character callback for progress
}
```

## 🎨 **The Why Section Specific Configuration**

### **Philosophical Content Requirements**
- **Primary Message**: "We believe software should start with intent..." 
- **Speed Control**: Slower, more deliberate typing for philosophical statements
- **Emphasis Points**: Key words like "intent" need to be highlightable during/after typing
- **Progress Tracking**: Screen reader announcements every 10 characters for accessibility

### **Timing Requirements**
- **Typing Speed**: 40-60 characters per second for contemplative pacing
- **Cursor Behavior**: Visible during typing, hidden after completion
- **Completion Callback**: Must trigger highlight of key phrases and reveal of supporting content

## ⏱️ **Animation Integration with Section Flow**

### **ScrollTrigger Coordination**
- Typing animation triggered when section reaches 80% viewport
- Must support `prefers-reduced-motion` with instant text reveal fallback
- Integration with section's overall narrative pacing

### **Performance Requirements**
- Smooth animation at 60fps during typing
- Character callback optimization for screen reader announcements
- Memory cleanup after animation completion

## 🚫 **NOT Required from TypingAnimationEffect**

### **Section-Specific Logic**
- Content highlighting logic (handled by section)
- Supporting content reveal timing (section responsibility)
- Brand-specific styling (section handles CSS)
- Philosophical content structure (section provides content)

### **Advanced Features Not Needed**
- Backspace/correction animations (not used in The Why section)
- Multiple typing modes (steady typing sufficient)
- Loop functionality (single-play only)
- Complex word-by-word reveals (character-by-character sufficient)

## ✅ **Success Criteria**

The TypingAnimationEffect should support the-why-section's needs for:
1. ✅ Single-method typing with `typeText(content, options)`
2. ✅ Per-character progress callbacks for accessibility
3. ✅ Completion callbacks for section flow coordination
4. ✅ Controllable typing speed for philosophical pacing
5. ✅ Cursor visibility control during/after typing
6. ✅ Support for `prefers-reduced-motion` instant fallback
