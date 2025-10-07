import * as THREE from 'three';

interface ThreeAnimationOptions {
  container: HTMLElement;
  fallbackContent?: string;
}

export class ThreeAnimation {
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private cube?: THREE.Mesh; // The glass cube
  private animationFrameId?: number;
  private container: HTMLElement;
  private isInitialized = false;
  private supportsWebGL = false;

  constructor(options: ThreeAnimationOptions) {
    this.container = options.container;

    this.checkWebGLSupport();
  }

  // Public method for testing device detection
  public getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent;

    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );

    const isTablet = /iPad|Android(?!.*Mobile)|Kindle|Silk/i.test(userAgent);

    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';

    return 'desktop';
  }

  // Public method for testing responsive calculations
  public getResponsiveConfig(): { fov: number; cameraZ: number } {
    if (typeof window === 'undefined') {
      return { fov: 65, cameraZ: 5 };
    }

    // Use desktop configuration for all devices

    const fov = 20; // Moderate zoom for cube framing

    const cameraZ = 40; // Desktop position for all devices

    return { fov, cameraZ };
  }

  private checkWebGLSupport(): void {
    // Check if we're in a browser environment
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.supportsWebGL = false;

      return;
    }

    try {
      const canvas = document.createElement('canvas');

      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      this.supportsWebGL = !!context;
    } catch {
      this.supportsWebGL = false;
    }
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    // If WebGL is not supported, fall back to 2D content
    if (!this.supportsWebGL) {
      this.initFallback();

      return;
    }

    try {
      /* c8 ignore start -- @preserve: Three.js WebGL initialization cannot be tested in JSDOM environment */
      this.initThreeJS();
      /* c8 ignore stop */
      this.isInitialized = true;
    } catch (error) {
      console.warn('3D animation failed to initialize, falling back to 2D:', error);
      this.initFallback();
    }
  }

  private initFallback(): void {
    this.container.innerHTML = `
      <div class="animation-fallback">
        <div class="geometric-shape">
          <div class="cube-2d">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face right"></div>
            <div class="face left"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
          </div>
        </div>
      </div>`;
    this.isInitialized = true;
  }

  /* c8 ignore start -- @preserve: Three.js scene, camera, and WebGL renderer setup cannot be tested in JSDOM environment */
  private initThreeJS(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a); // Back to original Voder Black

    // Camera setup - Use container dimensions instead of viewport
    const containerWidth = this.container.clientWidth || 400;

    const containerHeight = this.container.clientHeight || 400;

    // Use responsive configuration
    const config = this.getResponsiveConfig();

    this.camera = new THREE.PerspectiveCamera(
      config.fov,
      containerWidth / containerHeight, // Use container aspect ratio
      0.1,
      1000,
    );

    // Use desktop camera position for all devices
    this.camera.position.x = 0;
    this.camera.position.y = 16;
    this.camera.position.z = 40;

    if (this.camera.lookAt) {
      this.camera.lookAt(0, 0, 0); // Look at cube center
    }

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(containerWidth, containerHeight); // Use container dimensions
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a wrapper div
    const canvasWrapper = document.createElement('div');

    canvasWrapper.style.height = '100%';
    canvasWrapper.style.position = 'relative';
    canvasWrapper.style.width = '100%';
    canvasWrapper.appendChild(this.renderer.domElement);
    this.container.appendChild(canvasWrapper);

    // NO AMBIENT LIGHT - only directional lights for testing
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    // this.scene.add(ambientLight);

    // SUPER BRIGHT white directional light from front
    const testLight = new THREE.DirectionalLight(0xffffff, 10.0);

    testLight.position.set(0, 0, 50); // Straight from camera
    this.scene.add(testLight);

    // Test: Add rim light back to working white configuration
    const rimLight = new THREE.DirectionalLight(0xffffff, 8.0);

    rimLight.position.set(0.5, 5, -15); // From behind for rim lighting
    this.scene.add(rimLight);

    // TEMPORARILY DISABLE ALL OTHER LIGHTS
    // Main light from top-right - much more angled for softer glass reflections
    // const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    // mainLight.position.set(5, 8, 20);
    // mainLight.castShadow = true;
    // this.scene.add(mainLight);

    // Softer fill light from left - WHITE for pure reflections
    // const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    // fillLight.position.set(-15, 4, 12);
    // this.scene.add(fillLight);

    // Enhanced back rim light for glass edge definition and bright reflections
    // const rimLight = new THREE.DirectionalLight(0xffffff, 8.0); // Reduced but still bright
    // rimLight.position.set(0.5, 5, -15);
    // this.scene.add(rimLight);

    // Additional side lights for glass reflections - WHITE ONLY
    // const sideLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    // sideLight1.position.set(15, 8, 0);
    // this.scene.add(sideLight1);

    // const sideLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    // sideLight2.position.set(-15, 8, 0);
    // this.scene.add(sideLight2);

    // Create AWESOME living cube with wisps
    this.createAwesomeCube();

    // Skip environment setup for pure light reflections
    // this.setupEnvironmentForGlass();

    // Add scroll interaction for cube rotation
    this.addScrollInteraction();

    // Start animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: Three.js mesh creation and WebGL materials cannot be tested in JSDOM environment */
  private createAwesomeCube(): void {
    // Create proper rounded cube using the correct RoundedBoxGeometry implementation
    const geometry = this.createRoundedBoxGeometry(6, 6, 6, 2, 0.3);

    // Very dark glass - almost black for dramatic depth
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a1015, // Near-black with hint of blue
      transparent: true,
      opacity: 0.75, // Allow caustics to show through
      roughness: 0.02, // Very smooth for crisp reflections
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    this.cube = new THREE.Mesh(geometry, material);

    this.scene?.add(this.cube);

    // Simple orientation: cube sits on bottom face, rotated 45° to show corner-to-camera
    this.cube.rotation.y = Math.PI / 4; // 45 degrees - shows two faces at corner angle

    // Add volumetric caustics
    this.createVolumeLightCaustics();
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL2 volumetric raymarching shader for light caustics effect */
  private createVolumeLightCaustics(): void {
    if (!this.cube || !this.scene) return;

    // Create shader material for volumetric rendering
    const volumeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x5599ee) }, // Medium blue for balanced visibility
        uDensity: { value: 0.22 }, // Moderate density
        uSteps: { value: 40 },
      },
      vertexShader: `
        varying vec3 vObjectPos;
        varying vec3 vLocalCameraPos;
        
        void main() {
          vObjectPos = position;
          // Transform camera position to object space
          vLocalCameraPos = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uDensity;
        uniform int uSteps;
        
        varying vec3 vObjectPos;
        varying vec3 vLocalCameraPos;
        
        // Simple hash for noise
        float hash(float n) {
          return fract(sin(n) * 43758.5453);
        }
        
        // 3D noise
        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          
          float n = p.x + p.y * 57.0 + 113.0 * p.z;
          return mix(
            mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
            mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
        }
        
        // Flowing light ribbons pattern with organic curves
        float causticPattern(vec3 p) {
          vec3 pos = p * 1.2;
          float time = uTime * 0.4;
          
          // Create noise-driven flow fields for organic ribbon paths
          vec3 flow1 = vec3(
            noise(pos + vec3(time * 0.8, 0.0, 0.0)) * 2.0 - 1.0,
            noise(pos + vec3(0.0, time * 0.6, 0.0)) * 2.0 - 1.0,
            noise(pos + vec3(0.0, 0.0, time * 0.7)) * 2.0 - 1.0
          );
          
          vec3 flow2 = vec3(
            noise(pos * 0.8 + vec3(time * 0.9, 5.0, 0.0)) * 2.0 - 1.0,
            noise(pos * 0.8 + vec3(0.0, time * 0.5, 7.0)) * 2.0 - 1.0,
            noise(pos * 0.8 + vec3(3.0, 0.0, time * 0.8)) * 2.0 - 1.0
          );
          
          // Create curved ribbon paths using the flow fields
          vec3 ribbon_pos1 = pos + flow1 * 0.6;
          vec3 ribbon_pos2 = pos + flow2 * 0.5;
          
          // Generate organic ribbon shapes along the flow paths
          float ribbon1 = sin(ribbon_pos1.y * 2.0 + time * 1.5) * 
                         cos(ribbon_pos1.x * 1.3 + sin(ribbon_pos1.z * 1.8 + time) * 0.7);
          
          float ribbon2 = cos(ribbon_pos2.y * 2.3 + time * 1.2) * 
                         sin(ribbon_pos2.z * 1.6 + cos(ribbon_pos2.x * 1.1 + time * 1.3) * 0.8);
          
          float ribbon3 = sin(pos.y * 1.8 + noise(pos * 1.5 + time) * 1.2 + time * 1.8) *
                         cos(pos.x * 1.4 + noise(pos.zyx * 1.2 + time * 0.7) * 0.9);
          
          // Convert to ribbon distances with organic thickness variation
          float thickness1 = 0.7 + noise(ribbon_pos1 * 3.0 + time) * 0.4;
          float thickness2 = 0.8 + noise(ribbon_pos2 * 2.8 + time * 1.1) * 0.3;
          float thickness3 = 0.6 + noise(pos * 3.2 + time * 0.9) * 0.5;
          
          ribbon1 = 1.0 - smoothstep(0.0, thickness1, abs(ribbon1));
          ribbon2 = 1.0 - smoothstep(0.0, thickness2, abs(ribbon2));
          ribbon3 = 1.0 - smoothstep(0.0, thickness3, abs(ribbon3));
          
          // Add flowing energy along the ribbons
          float energy1 = sin(length(ribbon_pos1.xy) * 2.5 + time * 2.0) * 0.5 + 0.5;
          float energy2 = cos(length(ribbon_pos2.xz) * 2.2 + time * 1.7) * 0.4 + 0.6;
          float energy3 = sin(length(pos.yz) * 2.8 + time * 2.3) * 0.3 + 0.7;
          
          ribbon1 *= energy1;
          ribbon2 *= energy2;
          ribbon3 *= energy3;
          
          // Combine ribbons with organic blending
          float result = max(max(ribbon1 * 0.9, ribbon2 * 0.8), ribbon3 * 0.7);
          
          // Add turbulence for more organic feel
          float turbulence = noise(pos * 5.0 + time * 0.8) * 0.3;
          result *= (0.8 + turbulence);
          
          // Smooth falloff toward edges
          float edge_falloff = 1.0 - length(pos) * 0.15;
          result *= max(0.0, edge_falloff);
          
          return result * 1.8;
        }
        
        // Ray-box intersection
        vec2 intersectBox(vec3 orig, vec3 dir, vec3 boxMin, vec3 boxMax) {
          vec3 invDir = 1.0 / dir;
          vec3 tMin = (boxMin - orig) * invDir;
          vec3 tMax = (boxMax - orig) * invDir;
          vec3 t1 = min(tMin, tMax);
          vec3 t2 = max(tMin, tMax);
          float tNear = max(max(t1.x, t1.y), t1.z);
          float tFar = min(min(t2.x, t2.y), t2.z);
          return vec2(tNear, tFar);
        }
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          // Raymarching in object space
          vec3 rayOrigin = vLocalCameraPos;
          vec3 rayDir = normalize(vObjectPos - vLocalCameraPos);
          
          // Box bounds slightly smaller than 5.8 geometry
          vec3 boxMin = vec3(-2.9);
          vec3 boxMax = vec3(2.9);
          
          vec2 tHit = intersectBox(rayOrigin, rayDir, boxMin, boxMax);
          
          // Discard if ray doesn't hit box
          if(tHit.x > tHit.y || tHit.y < 0.0) {
            discard;
          }
          
          // Raymarching setup
          float tStart = max(tHit.x, 0.0);
          float tEnd = tHit.y;
          float marchDist = tEnd - tStart;
          float stepSize = marchDist / float(uSteps);
          
          // Jitter for smoother sampling
          float jitter = hash(gl_FragCoord.xy);
          float t = tStart + jitter * stepSize;
          
          // Accumulate light
          vec3 light = vec3(0.0);
          float transmittance = 1.0;
          
          for(int i = 0; i < 256; i++) {
            if(i >= uSteps) break;
            if(transmittance < 0.01) break;
            
            vec3 pos = rayOrigin + rayDir * t;
            
            // Sample caustics pattern at multiple scales
            float density = causticPattern(pos * 0.8);
            density *= uDensity;
            
            // Accumulate light with moderate intensity for balanced ribbons
            float alpha = density * stepSize * 2.5;
            light += uColor * density * transmittance * alpha * 3.2;
            transmittance *= 1.0 - alpha * 0.25;
            
            t += stepSize;
          }
          
          gl_FragColor = vec4(light, 1.0 - transmittance);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false, // KEY FIX: Render on top of everything, ignore depth buffer
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    // Create volume geometry (slightly smaller than cube)
    const volumeGeometry = new THREE.BoxGeometry(5.8, 5.8, 5.8);

    const volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);

    // Match cube's position and rotation
    volumeMesh.position.copy(this.cube.position);
    volumeMesh.rotation.copy(this.cube.rotation);

    // CRITICAL: Render AFTER the glass cube to appear on top
    volumeMesh.renderOrder = 999;

    // Add to scene
    this.scene.add(volumeMesh);

    // Store references
    this.cube.userData.volumeMaterial = volumeMaterial;
    this.cube.userData.volumeMesh = volumeMesh;
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL texture creation and environment mapping cannot be tested in JSDOM environment */
  private setupEnvironmentForGlass(): void {
    // Create a simple environment map for glass reflections
    // Using a gradient environment to create subtle reflections
    const envMapSize = 256;

    const envMapTexture = new THREE.DataTexture(
      new Uint8Array(envMapSize * envMapSize * 4),
      envMapSize,
      envMapSize,
      THREE.RGBAFormat,
    );

    // Create a simple gradient environment
    const data = envMapTexture.image.data;

    for (let i = 0; i < envMapSize; i++) {
      for (let j = 0; j < envMapSize; j++) {
        const index = (i * envMapSize + j) * 4;

        const x = (j / envMapSize) * 2 - 1;

        const y = (i / envMapSize) * 2 - 1;

        const distance = Math.sqrt(x * x + y * y);

        // Create a radial gradient with teal tones - much brighter for glass reflections
        const intensity = Math.max(0.6, (1 - distance) * 1.0); // Much brighter intensity

        data[index] = Math.floor(0.3 * 255 * intensity); // R - increased warmth
        data[index + 1] = Math.floor(0.8 * 255 * intensity); // G - brighter teal
        data[index + 2] = Math.floor(0.9 * 255 * intensity); // B - brighter teal
        data[index + 3] = 255; // A
      }
    }

    envMapTexture.needsUpdate = true;
    envMapTexture.mapping = THREE.EquirectangularReflectionMapping;

    // Apply environment map to the scene for reflections
    if (this.scene) {
      // Temporarily disable environment map to get pure light reflections
      // this.scene.environment = envMapTexture;
    }

    // Apply the environment map to the cube material if it exists
    if (this.cube && this.cube.material instanceof THREE.MeshPhysicalMaterial) {
      // Disable environment map on material for crisp light reflections
      // this.cube.material.envMap = envMapTexture;
      this.cube.material.needsUpdate = true;
    }
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: Complex Three.js geometry generation cannot be tested in JSDOM environment */
  private createRoundedBoxGeometry(
    width: number,
    height: number,
    depth: number,
    segments: number,
    radius: number,
  ): THREE.BufferGeometry {
    const _tempNormal = new THREE.Vector3();

    const getUv = (
      faceDirVector: THREE.Vector3,
      normal: THREE.Vector3,
      uvAxis: string,
      projectionAxis: string,
      cornerRadius: number,
      sideLength: number,
    ): number => {
      const totArcLength = (2 * Math.PI * cornerRadius) / 4;

      const centerLength = Math.max(sideLength - 2 * cornerRadius, 0);

      const halfArc = Math.PI / 4;

      _tempNormal.copy(normal);
      (_tempNormal as any)[projectionAxis] = 0;
      _tempNormal.normalize();

      const arcUvRatio = (0.5 * totArcLength) / (totArcLength + centerLength);

      const arcAngleRatio = 1.0 - _tempNormal.angleTo(faceDirVector) / halfArc;

      if (Math.sign((_tempNormal as any)[uvAxis]) === 1) {
        return arcAngleRatio * arcUvRatio;
      } else {
        const lenUv = centerLength / (totArcLength + centerLength);

        return lenUv + arcUvRatio + arcUvRatio * (1.0 - arcAngleRatio);
      }
    };

    // ensure segments is odd so we have a plane connecting the rounded corners
    segments = segments * 2 + 1;

    // ensure radius isn't bigger than shortest side
    radius = Math.min(width / 2, height / 2, depth / 2, radius);

    const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);

    // if we just have one segment we're the same as a regular box
    if (segments === 1) {
      geometry.scale(width, height, depth);

      return geometry;
    }

    const geometry2 = geometry.toNonIndexed();

    const newGeometry = new THREE.BufferGeometry();

    newGeometry.setAttribute('position', geometry2.attributes.position);
    newGeometry.setAttribute('normal', geometry2.attributes.normal);
    newGeometry.setAttribute('uv', geometry2.attributes.uv);

    const position = new THREE.Vector3();

    const normal = new THREE.Vector3();

    const box = new THREE.Vector3(width, height, depth).divideScalar(2).subScalar(radius);

    const positions = newGeometry.attributes.position.array as Float32Array;

    const normals = newGeometry.attributes.normal.array as Float32Array;

    const uvs = newGeometry.attributes.uv.array as Float32Array;

    const faceTris = positions.length / 6;

    const faceDirVector = new THREE.Vector3();

    const halfSegmentSize = 0.5 / segments;

    for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
      position.fromArray(positions, i);
      normal.copy(position);
      normal.x -= Math.sign(normal.x) * halfSegmentSize;
      normal.y -= Math.sign(normal.y) * halfSegmentSize;
      normal.z -= Math.sign(normal.z) * halfSegmentSize;
      normal.normalize();

      positions[i + 0] = box.x * Math.sign(position.x) + normal.x * radius;
      positions[i + 1] = box.y * Math.sign(position.y) + normal.y * radius;
      positions[i + 2] = box.z * Math.sign(position.z) + normal.z * radius;

      normals[i + 0] = normal.x;
      normals[i + 1] = normal.y;
      normals[i + 2] = normal.z;

      const side = Math.floor(i / faceTris);

      switch (side) {
        case 0: // right
          faceDirVector.set(1, 0, 0);
          uvs[j + 0] = getUv(faceDirVector, normal, 'z', 'y', radius, depth);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'z', radius, height);
          break;
        case 1: // left
          faceDirVector.set(-1, 0, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'z', 'y', radius, depth);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'z', radius, height);
          break;
        case 2: // top
          faceDirVector.set(0, 1, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'z', radius, width);
          uvs[j + 1] = getUv(faceDirVector, normal, 'z', 'x', radius, depth);
          break;
        case 3: // bottom
          faceDirVector.set(0, -1, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'z', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'z', 'x', radius, depth);
          break;
        case 4: // front
          faceDirVector.set(0, 0, 1);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'y', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'x', radius, height);
          break;
        case 5: // back
          faceDirVector.set(0, 0, -1);
          uvs[j + 0] = getUv(faceDirVector, normal, 'x', 'y', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'x', radius, height);
          break;
      }
    }

    return newGeometry;
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL object manipulation and scroll event handling cannot be tested in JSDOM environment */
  private addScrollInteraction(): void {
    let ticking = false;

    const updateOnScroll = () => {
      if (!this.cube) {
        ticking = false;

        return;
      }

      // Calculate responsive rotation multiplier based on device type
      const deviceType = this.getDeviceType();

      const rotationMultiplier = deviceType === 'mobile' ? 0.003 : 0.005;

      // Map scroll position directly to Y-axis rotation
      // Scroll down = rotate left (negative), scroll up = rotate right (positive)
      const scrollPosition = window.scrollY;

      const rotationY = Math.PI / 4 + scrollPosition * rotationMultiplier;

      // Apply rotation to cube (maintains the initial 45-degree corner orientation)
      this.cube.rotation.y = rotationY;

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL rendering loop with requestAnimationFrame cannot be tested in JSDOM environment */
  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Update time uniform for flowing ribbons
    if (this.cube?.userData.volumeMaterial) {
      const volumeMaterial = this.cube.userData.volumeMaterial as THREE.ShaderMaterial;

      volumeMaterial.uniforms.uTime.value = performance.now() / 1000; // Convert to seconds
    }

    // Sync volume mesh rotation with cube
    if (this.cube?.userData.volumeMesh) {
      const volumeMesh = this.cube.userData.volumeMesh as THREE.Mesh;

      volumeMesh.rotation.copy(this.cube.rotation);
    }

    // Static cube - no animation, just render
    this.renderer.render(this.scene, this.camera);
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL camera and renderer resize handling cannot be tested in JSDOM environment */
  private handleResize(): void {
    if (!this.camera || !this.renderer) return;

    // Skip resize handling on mobile to prevent size jumps (workaround for mobile viewport issue)
    if (this.getDeviceType() === 'mobile') {
      return;
    }

    // Update for container dimensions instead of viewport
    const containerWidth = this.container.clientWidth || 400;

    const containerHeight = this.container.clientHeight || 400;

    // Use responsive configuration
    const config = this.getResponsiveConfig();

    this.camera.fov = config.fov;

    this.camera.aspect = containerWidth / containerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(containerWidth, containerHeight);

    // Use desktop camera position for all devices
    this.camera.position.x = 0;
    this.camera.position.y = 16;
    this.camera.position.z = 40;

    if (this.camera.lookAt) {
      this.camera.lookAt(0, 0, 0); // Ensure camera still looks at center
    }
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: WebGL cleanup methods cannot be tested in JSDOM environment */
  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Clean up glass cube - WebGL object disposal cannot be tested in JSDOM
    if (this.cube && this.cube.parent) {
      this.cube.parent.remove(this.cube);
      this.cube.geometry.dispose();
      if (this.cube.material instanceof THREE.Material) {
        this.cube.material.dispose();
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
      // DOM manipulation of WebGL canvas cannot be tested in JSDOM
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }

    window.removeEventListener('resize', () => this.handleResize());
    // Note: Individual scroll event listeners are cleaned up automatically when the window is destroyed
    this.isInitialized = false;
  }
  /* c8 ignore stop */

  /* c8 ignore start -- @preserve: Animation frame control methods cannot be tested in JSDOM environment */
  public pause(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public resume(): void {
    if (this.isInitialized && this.supportsWebGL && !this.animationFrameId) {
      this.animate();
    }
  }
  /* c8 ignore stop */
}
