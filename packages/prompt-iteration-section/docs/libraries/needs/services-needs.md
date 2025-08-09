# @voder/prompt-iteration-section Dependencies on @voder/services

This document specifies what the `@voder/prompt-iteration-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService** 
**Required for**: Code demonstration reveals and interactive diff animations

**Package-Specific Requirements:**
- **Code comparison timing**: Scroll-scrubbed reveals must be precisely timed for code readability
- **Diff highlighting coordination**: Animation timing coordinated with syntax highlighting updates  
- **Demo switching performance**: Smooth transitions between 4-6 curated code examples without layout thrash
- **Staggered code reveals**: Sequential animation of code blocks with 200ms stagger timing

### **AccessibilityService**
**Required for**: Code demonstration accessibility and demo navigation

**Package-Specific Requirements:**
- **Dynamic code announcements**: Live announcements of code changes and adaptations with technical context
- **Demo navigation shortcuts**: Keyboard controls for code example navigation (arrows, enter, escape)
- **Code context announcements**: Screen reader descriptions of "before/after" code comparisons
- **Progressive enhancement**: Fallback to static code presentation when reduced motion preferred

### **ScrollService** 
**Required for**: Demo staging and performance-optimized code rendering

**Package-Specific Requirements:**
- **Multi-threshold observation**: 4+ scroll thresholds for staged demo progression through code examples
- **Code visibility optimization**: Efficient rendering of syntax-highlighted code blocks based on viewport
- **Demonstration pacing**: Scroll-driven progression through curated code examples
- **Performance throttling**: 16ms throttled scroll events during code rendering operations

## 🚫 **SERVICES NOT REQUIRED**

### **AssetService**
This section works entirely with text-based code demonstrations. No external assets needed.

## 🔧 **INTEGRATION REQUIREMENTS**

### **With @voder/code-display-effect**
- **Syntax highlighting coordination**: AnimationService timing must sync with CodeDisplayEffect rendering
- **Performance handoff**: ScrollService must efficiently coordinate with code display visibility logic

### **Section-Specific Context**
- **4-6 code examples**: Multiple curated demonstrations requiring efficient memory management
- **Before/after comparisons**: Dual code block presentations requiring coordinated animation timing
- **Technical demonstration focus**: Code-centric content requiring specialized accessibility announcements
