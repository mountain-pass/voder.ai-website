# Canvas 3D Effect Requirements for Brand Entry Section

## 🎯 **Brand Entry Specific Configuration**

The brand-entry-section requires Canvas3DEffect to be configured with specific brand-related scene setup and materials that align with Voder's visual identity.

## 📋 **Required Methods from Canvas3DEffect Interface**

### **Standard Interface Methods** (now available in canvas-3d-effect.md)
- `setIntensity(progress: number)` - Adjust overall scene intensity based on scroll progress (0-1)
- `startObjectRotation(speed?: number)` - Begin continuous rotation of brand logo object
- `enableParticleSystem()` - Activate particle effects for logo emphasis
- `reduceLOD()` / `restoreLOD()` - Performance optimization for off-screen rendering
- `clearUnusedTextures()` / `reduceParticleCount()` - Memory management methods

## 🎨 **Brand Entry Scene Configuration**

### **Required Scene Setup**
```typescript
interface BrandEntrySceneConfig extends Canvas3DEffectConfig {
  branding: {
    logoModel: string;              // Path to Voder logo 3D model
    glowIntensity: number;         // Base glow intensity (0.3)
    rotationSpeed: number;         // Continuous rotation speed (0.02 rad/frame)
    particleCount: number;         // Background particle count (200)
  };
  materials: {
    logoMaterial: MaterialConfig;   // Voder teal glow material (#24D1D5)
    particleMaterial: MaterialConfig; // Particle system material
  };
}
```

### **Brand-Specific Lighting Requirements**
- **Key light**: Directional light highlighting logo edges
- **Rim light**: Soft teal glow (#24D1D5) around logo silhouette  
- **Point light**: Central glow effect that pulses with brand rhythm

## ⏱️ **Animation Timeline Integration**

### **Intro Sequence Requirements**
1. **Phase 1 (0-0.5s)**: Scene initialization with logo hidden
2. **Phase 2 (0.5-1.5s)**: Logo fade-in with particle system activation
3. **Phase 3 (1.5-3s)**: Logo rotation start with intensity ramp-up
4. **Phase 4 (3-4s)**: Continuous rotation with scroll-tied intensity

### **Scroll-Tied Behavior**
- Logo intensity fades from 100% to 0% as user scrolls past section
- Rotation speed maintained but LOD reduced when off-screen
- Particle system disabled when section < 20% visible

## 🚫 **NOT Required from Canvas3DEffect**

### **Other Section Features**
- GPS device visualization (metaphor-section specific)
- Interactive camera controls (not used in brand entry)
- Complex model swapping (brand entry uses single logo model)
- Route animation capabilities (metaphor-section specific)

## ✅ **Success Criteria**

The Canvas3DEffect implementation for brand-entry-section should:
1. ✅ Support logo-specific rotation animation control
2. ✅ Provide scroll-tied intensity adjustment (0-100%)
3. ✅ Enable/disable particle system on demand
4. ✅ Implement performance optimization for off-screen rendering
5. ✅ Handle brand-specific lighting setup automatically
6. ✅ Support `prefers-reduced-motion` with static logo fallback
