# @voder/problem-space-section Dependencies on @voder/services

This document specifies what the `@voder/problem-space-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: Chaos visualization with particle system coordination

**Package-Specific Requirements:**
- **Chaos intensity scaling**: Scroll position directly mapped to particle system intensity (0-100%)
- **Visual disruption effects**: Background blur/hue rotation synchronized with particle burst events
- **Performance-adaptive animation**: Chaos effect reduction based on device performance monitoring
- **Problem reveal coordination**: Animation timing synchronized with ParticleSystemEffect chaos events

### **AccessibilityService**
**Required for**: Complex chaos visualization accessibility

**Package-Specific Requirements:**
- **Chaos metaphor translation**: Text alternatives explaining visual chaos represents development complexity
- **Skip chaos functionality**: Complete bypass option for users who cannot/prefer not to view intense effects
- **Problem list accessibility**: ARIA structure for development problems presented as chaos resolves
- **Chaos context announcements**: Screen reader explanations of why chaos visualization represents problems

### **ScrollService**
**Required for**: Chaos intensity control and performance monitoring

**Package-Specific Requirements:**
- **Chaos progression mapping**: Precise scroll-to-chaos-intensity calculation for dramatic effect
- **Performance-aware scrolling**: Throttled scroll events during intensive particle rendering
- **Problem staging coordination**: Scroll-based problem reveals as chaos intensity increases

## � **INTEGRATION REQUIREMENTS**

### **With @voder/particle-system-effect**
- **Animation coordination**: AnimationService chaos intensity must drive ParticleSystemEffect parameters
- **Performance coordination**: ScrollService performance monitoring must adapt particle system complexity

### **Section-Specific Context**
- **Chaos visualization metaphor**: Visual representation of development complexity requiring careful intensity scaling
- **Performance-critical rendering**: Particle systems requiring adaptive performance optimization
- **Accessibility-sensitive content**: Intense visual effects requiring comprehensive skip options and alternatives
- **Problem revelation focus**: Chaos serves to highlight specific development problems as section progresses
