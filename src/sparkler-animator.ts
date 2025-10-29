/**
 * SparklerAnimator - Scroll-scrubbed sparkle effect for "magic" word
 * Story 026.03-BIZ-MAGIC-PHASE-ANIMATION
 *
 * Renders particle sparkles that sweep across the "magic" text based on scroll position.
 * Adapted from sparkler demo with scroll-based scrubbing instead of time-based animation.
 */

import type { ScrollLockedReveal } from './scroll-locked-reveal.js';

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  alive: boolean;
  spawnProgress: number; // Track when this particle was spawned (0-1)
}

interface EmissionPoint {
  x: number;
  y: number;
  nx: number; // Normal x
  ny: number; // Normal y
}

export class SparklerAnimator {
  private progressiveReveal: ScrollLockedReveal;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private emitters: EmissionPoint[] = [];
  private particles: Particle[] = [];
  private lastScrollProgress: number = 0;
  private animationFrameId: number | null = null;
  private isActive: boolean = false;
  private sweepStartTime: number = 0;
  private sweepTriggered: boolean = false;
  private lastWasBeforeRange: boolean = true; // Track if we were before the range
  private sweepCompleted: boolean = false; // Track if sweep animation finished
  private readonly SWEEP_DURATION = 800; // 0.8 seconds for full sweep animation

  // Colors from demo - orange core, warm halo
  private coreColor = { h: 30, s: 100, l: 50 }; // #ff7e00 orange
  private haloColor = { h: 42, s: 100, l: 85 }; // #ffecb3 warm yellow

  // Animation constants
  private readonly MAX_PARTICLES = 600;
  private readonly SCRUB_START = 0.2; // Act 1: 20% (during "magic" fade in)
  private readonly SCRUB_END = 0.45; // Act 1: 45% (before "shipping" starts)
  private readonly SPEED_MUL = 0.8;
  private readonly INTENSITY_MUL = 0.32;
  private readonly LENGTH_MUL = 0.81;

  constructor(progressiveReveal: ScrollLockedReveal) {
    this.progressiveReveal = progressiveReveal;
    this.setupCanvas();
    this.buildEmitters();
    this.startAnimation();
  }

  /**
   * Setup canvas overlay for sparkler effect
   */
  private setupCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1'; // Behind text content

    this.ctx = this.canvas.getContext('2d');

    if (this.ctx) {
      // Insert canvas inside the sticky panel
      const stickyPanel = document.querySelector('.sticky-panel');

      if (stickyPanel) {
        stickyPanel.insertBefore(this.canvas, stickyPanel.firstChild);
      } else {
        document.body.appendChild(this.canvas);
      }
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  /**
   * Resize canvas to match viewport
   */
  private resize(): void {
    if (!this.canvas || !this.ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const width = window.innerWidth * dpr;

    const height = window.innerHeight * dpr;

    this.canvas.width = width;
    this.canvas.height = height;

    // Initialize canvas to background color
    this.ctx.fillStyle = 'rgb(12, 12, 13)';
    this.ctx.fillRect(0, 0, width, height);

    this.buildEmitters();
  }

  /**
   * Build emission points from "magic" text edge detection
   */
  private buildEmitters(): void {
    const magicWord = document.querySelector('.magic-word');

    if (!magicWord) return;

    const rect = magicWord.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    // Create offscreen canvas for text rendering
    const scale = 0.5; // Reduce resolution for performance

    const sW = Math.max(2, Math.floor(rect.width * dpr * scale));

    const sH = Math.max(2, Math.floor(rect.height * dpr * scale));

    const offscreen = document.createElement('canvas');

    offscreen.width = sW;
    offscreen.height = sH;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) return;

    // Render text
    const fontSize = parseFloat(window.getComputedStyle(magicWord).fontSize) * dpr * scale;

    offCtx.font = `${fontSize}px ${window.getComputedStyle(magicWord).fontFamily}`;
    offCtx.textAlign = 'left';
    offCtx.textBaseline = 'top';
    offCtx.fillStyle = '#fff';
    offCtx.fillText(magicWord.textContent || 'magic', 0, 0);

    // Edge detection
    const imageData = offCtx.getImageData(0, 0, sW, sH);

    const data = imageData.data;

    const points: EmissionPoint[] = [];

    for (let y = 1; y < sH - 1; y++) {
      for (let x = 1; x < sW - 1; x++) {
        const idx = (y * sW + x) * 4 + 3; // Alpha channel

        const alpha = data[idx];

        if (alpha > 200) {
          // Check neighbors for edge
          const aL = data[(y * sW + (x - 1)) * 4 + 3] || 0;

          const aR = data[(y * sW + (x + 1)) * 4 + 3] || 0;

          const aU = data[((y - 1) * sW + x) * 4 + 3] || 0;

          const aD = data[((y + 1) * sW + x) * 4 + 3] || 0;

          const isEdge = aL < 180 || aR < 180 || aU < 180 || aD < 180;

          if (isEdge) {
            // Calculate normal
            let nx = aR - aL;

            let ny = aD - aU;

            const len = Math.hypot(nx, ny) || 1;

            nx /= len;
            ny /= len;

            // Convert to screen coordinates
            points.push({
              x: rect.left + x / scale / dpr,
              y: rect.top + y / scale / dpr + 8, // Offset down to align with text
              nx,
              ny,
            });
          }
        }
      }
    }

    // Sort emitters left to right by x position for proper sweep
    this.emitters = points.sort((a, b) => a.x - b.x);
  }

  /**
   * Spawn particle from emission point
   */
  private spawn(emitter: EmissionPoint, spawnProgress: number): void {
    const offset = 2 + Math.random() * 3;

    const x = emitter.x + emitter.nx * offset;

    const y = emitter.y + emitter.ny * offset;

    // Random direction with bias toward normal
    const theta = Math.random() * Math.PI * 2;

    const rx = Math.cos(theta);

    const ry = Math.sin(theta);

    let dx = emitter.nx + rx * 0.8;

    let dy = emitter.ny + ry * 0.8;

    const dLen = Math.hypot(dx, dy) || 1;

    dx /= dLen;
    dy /= dLen;

    const speed = (5 + Math.random() * 6) * this.SPEED_MUL;

    const ttl = (90 + Math.random() * 60) * this.LENGTH_MUL;

    this.particles.push({
      x,
      y,
      px: x,
      py: y,
      vx: dx * speed,
      vy: dy * speed - 0.35,
      life: 0,
      ttl,
      alive: true,
      spawnProgress,
    });

    // Limit particle count
    if (this.particles.length > this.MAX_PARTICLES) {
      this.particles.shift();
    }
  }

  /**
   * Update particles physics every frame
   */
  private updateParticles(_scrollProgress: number): void {
    for (const p of this.particles) {
      if (!p.alive) continue;

      // Update life every frame (not based on scroll)
      p.life++;

      // Update position
      p.px = p.x;
      p.py = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravity constant from demo
      p.vx *= 0.997; // drag from demo
      p.vy *= 0.997;

      // Check if particle has lived its life
      if (p.life > p.ttl) {
        p.alive = false;
      }
    }

    // Remove dead particles
    this.particles = this.particles.filter((p) => p.alive);
  }

  /**
   * Render particles with additive blending
   */
  private render(): void {
    if (!this.canvas || !this.ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    // Clear with fade (using background color)
    this.ctx.globalCompositeOperation = 'source-over';
    const fadeAlpha = Math.max(0.01, 0.03 / this.LENGTH_MUL);

    this.ctx.fillStyle = `rgba(12, 12, 13, ${fadeAlpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render particles with additive blending
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 1.2 * dpr;

    for (const p of this.particles) {
      if (!p.alive) continue;

      const t = p.life / p.ttl;

      const alpha = (1 - t) * 0.9;

      // Halo
      this.ctx.strokeStyle = `hsla(${this.haloColor.h}, ${this.haloColor.s}%, ${this.haloColor.l}%, ${alpha * 0.45})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p.px * dpr, p.py * dpr);
      this.ctx.lineTo(p.x * dpr, p.y * dpr);
      this.ctx.stroke();

      // Core
      this.ctx.strokeStyle = `hsla(${this.coreColor.h}, ${this.coreColor.s}%, ${this.coreColor.l}%, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p.px * dpr, p.py * dpr);
      this.ctx.lineTo(p.x * dpr, p.y * dpr);
      this.ctx.stroke();
    }
  }

  /**
   * Main animation loop
   */
  private update(): void {
    const scrollProgress = this.progressiveReveal.getCurrentProgress();

    // Fade canvas opacity based on scroll OR keep visible if animation is running
    if (this.canvas) {
      // If sweep is triggered and still animating OR within fade grace period, keep canvas visible
      const timeElapsed = Date.now() - this.sweepStartTime;

      const gracePeriod = 1000; // Extra 1 second after animation completes for trails to fade

      const isAnimatingOrFading =
        this.sweepTriggered && timeElapsed < this.SWEEP_DURATION + 500 + gracePeriod;

      if (isAnimatingOrFading) {
        this.canvas.style.opacity = '1';
      } else if (scrollProgress < 0.05) {
        // Before "Remember when" starts fading in - fully transparent
        this.canvas.style.opacity = '0';
      } else if (scrollProgress >= 0.05 && scrollProgress < this.SCRUB_START) {
        // Fade in from 5% to 20% (as "Remember when" fades in, before sparkles start)
        const fadeInProgress = (scrollProgress - 0.05) / (this.SCRUB_START - 0.05);

        this.canvas.style.opacity = String(fadeInProgress);
      } else if (scrollProgress >= this.SCRUB_START && scrollProgress < this.SCRUB_END) {
        // Fully opaque during sparkler effect (20-45%)
        this.canvas.style.opacity = '1';
      } else if (scrollProgress >= this.SCRUB_END && scrollProgress <= 0.6) {
        // Fade out from 45% to 60% (complete before "Then it happened" at 60%)
        const fadeOutProgress = (scrollProgress - this.SCRUB_END) / (0.6 - this.SCRUB_END);

        this.canvas.style.opacity = String(1 - fadeOutProgress);
      } else {
        // After 60% - fully transparent
        this.canvas.style.opacity = '0';
      }
    }

    // Calculate how close we are to the sparkler range
    const beforeRange = scrollProgress < this.SCRUB_START;

    const afterRange = scrollProgress > this.SCRUB_END;

    const inRange = !beforeRange && !afterRange;

    // Get the magic word's parent headline to check its opacity
    const magicWord = document.querySelector('.magic-word') as HTMLElement;

    const headline = magicWord?.closest('[data-segment="1"]') as HTMLElement;

    let headlineOpacity = 1;

    if (headline) {
      const revealStart = parseFloat(headline.getAttribute('data-reveal-start') || '0.05');

      const revealEnd = parseFloat(headline.getAttribute('data-reveal-end') || '0.25');

      // Calculate the headline's fade progress (same logic as magic-phase-animator)
      if (scrollProgress < revealStart) {
        headlineOpacity = 0;
      } else if (scrollProgress >= revealStart && scrollProgress <= revealEnd) {
        const elementProgress = (scrollProgress - revealStart) / (revealEnd - revealStart);

        const fadeProgress = Math.min(1, elementProgress * 1.5);

        headlineOpacity = Math.pow(fadeProgress, 2);
      } else {
        headlineOpacity = 1;
      }
    }

    // Only reset sweep trigger when headline has FULLY faded out (opacity = 0)
    // This allows partial scroll-up without retriggering
    if (headlineOpacity === 0) {
      this.sweepTriggered = false;
      this.sweepStartTime = 0;
      this.sweepCompleted = false;
      if (magicWord) {
        magicWord.style.clipPath = 'inset(-2px 100% -2px -2px)';
        magicWord.style.color = ''; // Reset to default (teal from CSS)
      }
    }

    // Before sweep triggers, keep magic word white while headline is visible
    if (!this.sweepTriggered && !this.sweepCompleted && headlineOpacity > 0 && magicWord) {
      magicWord.style.color = 'rgb(255, 255, 255)';
      magicWord.style.clipPath = 'inset(-2px 100% -2px -2px)'; // Hidden initially
    }

    // Trigger sweep only when crossing INTO the range from before (scrolling down)
    // AND when headline is visible enough (opacity > 0.1)
    if (inRange && this.lastWasBeforeRange && !this.sweepTriggered && headlineOpacity > 0.1) {
      this.sweepStartTime = Date.now();
      this.sweepTriggered = true;
    }

    // Update tracking
    this.lastWasBeforeRange = beforeRange;

    // Animation runs to completion once triggered, regardless of scroll position
    if (this.sweepTriggered && headlineOpacity > 0) {
      if (!this.isActive) {
        this.isActive = true;
      }

      // Rebuild emitters every frame to track text position
      this.buildEmitters();

      // Calculate sweep progress based on time elapsed since trigger
      const timeElapsed = Date.now() - this.sweepStartTime;

      const sweepProgress = Math.min(1, timeElapsed / this.SWEEP_DURATION);

      // Mark sweep as completed when it finishes
      if (sweepProgress >= 1.0 && !this.sweepCompleted) {
        this.sweepCompleted = true;
        // Debug logging (disabled for linting)
        // console.log('Sparkler sweep COMPLETED at', Date.now());
      }

      // After sweep completes, fade from white to teal
      if (sweepProgress >= 1.0) {
        if (magicWord) {
          // Calculate fade progress (takes 0.5 seconds after sweep completes)
          const fadeTime = timeElapsed - this.SWEEP_DURATION;

          const fadeDuration = 500; // ms

          const fadeProgress = Math.min(1, fadeTime / fadeDuration);

          // Interpolate between white and teal
          const white = { r: 255, g: 255, b: 255 };

          const teal = { r: 34, g: 199, b: 190 }; // #22c7be

          const r = Math.round(white.r + (teal.r - white.r) * fadeProgress);

          const g = Math.round(white.g + (teal.g - white.g) * fadeProgress);

          const b = Math.round(white.b + (teal.b - white.b) * fadeProgress);

          magicWord.style.color = `rgb(${r}, ${g}, ${b})`;
          magicWord.style.clipPath = 'inset(-2px -2px -2px -2px)';
        }
      }

      // Spawn particles in sweep window
      if (this.emitters.length > 0 && sweepProgress < 1.0) {
        let left, right;

        // Sweep animation: expand then contract
        // First half: expand from left across entire text (0 to 0.5 progress)
        // Second half: contract from left while right edge stays at 1.0 (0.5 to 1.0 progress)
        if (sweepProgress < 0.5) {
          // Expanding: left stays at 0, right expands to full width
          left = 0;
          right = Math.min(1, sweepProgress / 0.5);

          // Reveal text in sync with sweep expansion
          if (magicWord) {
            // Use a small negative inset to prevent clipping of descenders and character edges
            magicWord.style.clipPath = `inset(-2px ${(1 - right) * 100}% -2px -2px)`;
            // Start as white during expansion
            magicWord.style.color = 'rgb(255, 255, 255)';
          }
        } else {
          // Contracting: left moves right toward 1.0, right stays at 1.0
          const contractProgress = (sweepProgress - 0.5) / 0.5;

          left = contractProgress;
          right = 1.0;

          // Keep text fully visible during contract
          if (magicWord) {
            magicWord.style.clipPath = 'inset(-2px -2px -2px -2px)';
            // Keep white during contraction
            magicWord.style.color = 'rgb(255, 255, 255)';
          }
        }

        // Filter emitters in sweep window and spawn particles
        const emittersInWindow = this.emitters.filter((e, idx) => {
          const normalizedX = idx / this.emitters.length;

          return normalizedX >= left && normalizedX <= right;
        });

        // Continuous particle emission (like demo)
        // Spawn particles every frame based on intensity
        const baseEmitCount = Math.floor(
          Math.max(8, Math.min(emittersInWindow.length, 120)) * this.INTENSITY_MUL,
        );

        for (let i = 0; i < baseEmitCount; i++) {
          const emitter = emittersInWindow[Math.floor(Math.random() * emittersInWindow.length)];

          if (emitter) {
            this.spawn(emitter, sweepProgress);
          }
        }
      }

      // Update existing particles
      this.updateParticles(scrollProgress);

      // Render
      this.render();
    } else {
      if (this.isActive) {
        this.isActive = false;
        // Let existing particles fade out naturally
        // Canvas opacity will fade to 0
      }

      // Still update and render existing particles during fade out
      if (this.particles.length > 0) {
        this.updateParticles(scrollProgress);
        this.render();
      }
    }

    this.lastScrollProgress = scrollProgress;
  }

  /**
   * Start animation loop
   */
  private startAnimation(): void {
    const animate = () => {
      this.update();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.particles = [];
    this.emitters = [];
  }

  /**
   * Check if the sweep animation has completed
   * Used by other animators to coordinate timing
   */
  public isSweepCompleted(): boolean {
    return this.sweepCompleted;
  }
}
