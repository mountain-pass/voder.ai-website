# @voder/brand-entry-section Dependencies on @voder/services

This document specifies what the `@voder/brand-entry-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: Cinematic 6-second brand introduction sequence

**Package-Specific Requirements:**
- **Multi-phase orchestration**: 5 distinct intro phases (preload→ignition→reveal→presentation→scroll-transition) with precise timing coordination
- **Scroll lock coordination**: Disable scroll during intro, enable after completion with smooth transition
- **3D canvas synchronization**: Animation timing coordinated with Canvas3DEffect rendering phases  
- **Memory-intensive timeline management**: Complex nested timelines requiring performance monitoring

### **AssetService**
**Required for**: Critical brand asset loading and 3D model management

**Package-Specific Requirements:**
- **High-priority preloading**: Critical intro assets must load before any animation begins
- **3D model coordination**: WebGL-compatible .glb file loading for Canvas3DEffect integration
- **Typography loading**: Inter/Satoshi font loading with proper fallback coordination
- **Intro-specific memory management**: Asset cleanup after intro completion to prevent memory leaks

### **AccessibilityService**
**Required for**: Cinematic intro accessibility and skip functionality

**Package-Specific Requirements:**
- **Intro state announcements**: Screen reader notifications for loading, intro phases, and completion
- **Reduced motion handling**: Complete intro bypass with static branding fallback
- **Skip-to-content focus**: Immediate focus management for users who want to bypass intro
- **Loading state accessibility**: ARIA live regions for intro progress announcements

### **ScrollService**
**Required for**: Intro scroll control and post-intro scroll transitions

**Package-Specific Requirements:**
- **Scroll suspension**: Complete scroll disable during 6-second intro without breaking page behavior
- **Skip functionality scrolling**: Smooth scroll to main content when skip button activated
- **Post-intro scroll restoration**: Seamless scroll re-enabling with proper scroll position management

## � **INTEGRATION REQUIREMENTS**

### **With @voder/canvas-3d-effect**
- **Asset coordination**: AssetService must handle both 2D brand assets and 3D model loading
- **Animation synchronization**: AnimationService timing must coordinate with 3D rendering phases
- **Performance coordination**: Memory management across both 2D animations and 3D rendering

### **Section-Specific Context**
- **Cinematic first impression**: Critical performance requirements as first user interaction
- **6-second intro sequence**: Specific timing constraints for branded introduction
- **Memory-intensive operations**: 3D rendering + complex animations requiring careful resource management
- **Skip accessibility requirement**: Must provide immediate skip option while maintaining brand impact
