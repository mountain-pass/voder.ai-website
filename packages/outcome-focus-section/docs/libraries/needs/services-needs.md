# @voder/outcome-focus-section Dependencies on @voder/services

This document specifies what the `@voder/outcome-focus-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: Benefits presentation with metrics visualization

**Package-Specific Requirements:**
- **Benefit card staggered reveals**: Sequential presentation of 4-6 benefit cards with 200ms stagger timing
- **Metrics counting animations**: Number/percentage counting with smooth easing and integer snapping
- **Interactive card emphasis**: Hover effects and scaling for benefit card engagement
- **Performance metrics visualization**: Data-driven animations showing time savings, efficiency gains

### **AccessibilityService**
**Required for**: Benefits accessibility and keyboard navigation

**Package-Specific Requirements:**
- **Benefit content announcements**: Screen reader descriptions of value propositions and metrics
- **Card navigation support**: Keyboard controls for exploring benefit cards and details
- **Metrics accessibility**: Screen reader-friendly announcement of performance data and percentages
- **Reduced motion metrics**: Static benefit presentation when motion preferences disabled

### **ScrollService**
**Required for**: Benefit revelation timing and performance tracking

**Package-Specific Requirements:**
- **Benefits staging**: Intersection observation for staged benefit card reveals
- **Metrics trigger points**: Scroll-based activation of counting animations at optimal viewing positions
- **Performance optimization**: Efficient rendering of multiple benefit cards and metrics displays

## 🚫 **SERVICES NOT REQUIRED**

### **AssetService**
This section focuses on text-based benefits and metrics visualization. No external assets needed beyond basic icons.

## 🔧 **INTEGRATION REQUIREMENTS**

### **Section-Specific Context**
- **Value proposition focus**: Clear presentation of Voder's benefits requiring careful revelation timing
- **4-6 benefit cards**: Multiple benefit presentations requiring coordinated staggered animations
- **Performance metrics emphasis**: Data visualization requiring precise counting animations and accessibility
- **Engagement optimization**: Interactive elements requiring responsive hover and focus states
