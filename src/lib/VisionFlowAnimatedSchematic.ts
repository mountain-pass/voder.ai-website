/**
 * VisionFlowAnimatedSchematic: Sophisticated animated workflow visualization system
 * Implements complete animated schematic flow with glowing nodes, sequential drawing,
 * progressive disclosure, and interactive micro-explanations.
 * Features path morphing transition from GPS Metaphor section.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface VisionFlowElements {
  backgroundLighting: HTMLElement;
  heading: HTMLElement;
  diagramContainer: HTMLElement;
  svg: SVGElement;
  stepExplanations: HTMLElement;
  liveRegion: HTMLElement;
}

interface WorkflowNode {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  color: string;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
}

export class VisionFlowAnimatedSchematic {
  private section: HTMLElement;
  private elements: VisionFlowElements;
  private timeline?: gsap.core.Timeline;
  private scrollTrigger?: ScrollTrigger;
  private hoverInteractions: Map<string, () => void> = new Map();
  private isVisible = false;
  private workflowNodes: WorkflowNode[] = [];
  private connectionLines: ConnectionLine[] = [];
  private morphingPaths: SVGPathElement[] = [];

  constructor(section: HTMLElement, elements: VisionFlowElements) {
    this.section = section;
    this.elements = elements;
    
    gsap.registerPlugin(ScrollTrigger);
    this.initializeWorkflowData();
    this.setupMorphingPaths();
    this.setupScrollTrigger();
    this.setupInteractiveElements();
    this.setupKeyboardNavigation();
    this.setupReducedMotionSupport();
  }

  private initializeWorkflowData(): void {
    // Define workflow nodes with precise positioning and enhanced data
    this.workflowNodes = [
      {
        id: 'source-prompts-node',
        x: 300,
        y: 80,
        label: 'Source Prompts',
        description: 'Business requirements and design intent expressed in natural language',
        color: '#24D1D5'
      },
      {
        id: 'voder-node',
        x: 300,
        y: 240,
        label: 'Voder',
        description: 'AI-powered compiler that transforms prompts into structured code',
        color: '#9AEF00'
      },
      {
        id: 'application-code-node',
        x: 300,
        y: 400,
        label: 'Application Code',
        description: 'Production-ready code with proper architecture and version control',
        color: '#24D1D5'
      },
      {
        id: 'working-product-node',
        x: 300,
        y: 480,
        label: 'Working Product',
        description: 'Complete product that matches the original intent and requirements',
        color: '#24D1D5'
      }
    ];

    // Define connection lines with calculated lengths for animation
    this.connectionLines = [
      {
        id: 'connection-1',
        x1: 300,
        y1: 120,
        x2: 300,
        y2: 200,
        length: 80
      },
      {
        id: 'connection-2',
        x1: 300,
        y1: 280,
        x2: 300,
        y2: 360,
        length: 80
      },
      {
        id: 'connection-3',
        x1: 300,
        y1: 440,
        x2: 300,
        y2: 460,
        length: 20
      }
    ];
  }

  private setupMorphingPaths(): void {
    // Create morphing paths that will transform from GPS routes to schematic lines
    this.connectionLines.forEach((conn, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `morph-path-${index}`);
      path.setAttribute('class', 'morphing-path');
      path.setAttribute('data-testid', `morph-path-${index}`);
      
      // Initial GPS-like curved path (will morph to straight schematic line)
      const initialPath = this.createCurvedPath(conn.x1, conn.y1, conn.x2, conn.y2);
      const finalPath = `M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`;
      
      path.setAttribute('d', initialPath);
      path.setAttribute('data-final-path', finalPath);
      path.setAttribute('stroke', 'url(#connection-gradient)');
      path.setAttribute('stroke-width', '3');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0');
      
      // Calculate path length for stroke animation
      const pathLength = this.calculatePathLength(initialPath);
      path.setAttribute('stroke-dasharray', pathLength.toString());
      path.setAttribute('stroke-dashoffset', pathLength.toString());
      
      this.elements.svg.appendChild(path);
      this.morphingPaths.push(path);
    });
  }

  private createCurvedPath(x1: number, y1: number, x2: number, y2: number): string {
    // Create GPS-style curved path that will morph to straight schematic line
    const midX = (x1 + x2) / 2;
    const controlOffset = 50; // Curve intensity
    
    const cp1x = midX - controlOffset;
    const cp1y = y1 + (y2 - y1) * 0.3;
    const cp2x = midX + controlOffset;
    const cp2y = y1 + (y2 - y1) * 0.7;
    
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  private calculatePathLength(pathData: string): number {
    // Approximate path length calculation for stroke animation
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    document.body.appendChild(path);
    const length = path.getTotalLength();
    document.body.removeChild(path);
    return length;
  }

  private setupScrollTrigger(): void {
    // Use GSAP ScrollTrigger with scrub for scroll-tied, bidirectional animation
    const tl = gsap.timeline();
    
    // Build all animation phases in a single timeline
    this.buildScrollTiedTimeline(tl);
    
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.section,
      start: 'top 70%',
      end: 'bottom 30%',
      animation: tl,
      scrub: 1, // Scroll-tied animation with 1 second lag for smoothness
      markers: false,
      onUpdate: (self) => {
        // Update state based on scroll progress
        if (self.progress > 0.1 && !this.isVisible) {
          this.isVisible = true;
          this.enableInteractivity();
          this.updateLiveRegion('Workflow diagram animation in progress');
        } else if (self.progress <= 0.1 && this.isVisible) {
          this.isVisible = false;
          this.disableInteractivity();
        }
        
        if (self.progress >= 0.9) {
          this.updateLiveRegion('Workflow diagram animation complete. Interactive elements available.');
        }
      }
    });
  }

  private buildScrollTiedTimeline(tl: gsap.core.Timeline): void {
    // Set initial states for all elements
    gsap.set([
      this.elements.backgroundLighting,
      this.elements.heading,
      this.elements.diagramContainer,
      this.elements.stepExplanations
    ], {
      opacity: 0
    });

    gsap.set(this.elements.heading, { y: 30 });
    
    const stepCards = this.elements.stepExplanations.querySelectorAll('.flow-step');
    gsap.set(stepCards, { opacity: 0, y: 20 });

    const nodes = this.elements.svg.querySelectorAll('circle');
    const labels = this.elements.svg.querySelectorAll('text');
    const connections = this.elements.svg.querySelectorAll('line');

    gsap.set([...nodes, ...labels, ...connections], { opacity: 0 });
    gsap.set(nodes, { scale: 0 });
    gsap.set(connections, { strokeDashoffset: 80 });

    // Phase 1: Background lighting transition (0-20% of scroll)
    tl.to(this.elements.backgroundLighting, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0);

    // Phase 2: Heading reveal (10-30% of scroll)
    tl.to(this.elements.heading, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 0.5);

    // Phase 3: Diagram container reveal (20-40% of scroll)
    tl.to(this.elements.diagramContainer, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 1);

    // Phase 4: Sequential node drawing (30-70% of scroll)
    nodes.forEach((node, index) => {
      // Animate node appearance with glow effect
      tl.fromTo(node, {
        opacity: 0,
        scale: 0,
        transformOrigin: 'center'
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, 1.5 + index * 0.3);

      // Animate label appearance
      const label = labels[index];
      if (label) {
        tl.fromTo(label, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 1.7 + index * 0.3);
      }
    });

    // Phase 5: Connection line drawing (50-80% of scroll)
    connections.forEach((line, index) => {
      // Make line visible
      tl.to(line, {
        opacity: 1,
        duration: 0.3
      }, 2.5 + index * 0.2);

      // Animate stroke drawing
      tl.to(line, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 2.5 + index * 0.2);
    });

    // Phase 6: Step explanations reveal (70-100% of scroll)
    tl.to(this.elements.stepExplanations, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 3.5);

    // Animate individual step cards
    stepCards.forEach((card, index) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 3.7 + index * 0.2);
    });
  }

  private setupInteractiveElements(): void {
    const nodes = this.elements.svg.querySelectorAll('circle');
    
    nodes.forEach((node, index) => {
      const nodeId = node.getAttribute('id');
      if (!nodeId) return;

      // Mouse hover interactions
      const handleMouseEnter = () => {
        if (!this.isVisible) return;
        
        // Enhanced glow on hover
        gsap.to(node, {
          scale: 1.3,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Show micro-explanation
        this.showMicroExplanation(nodeId, index);
      };

      const handleMouseLeave = () => {
        if (!this.isVisible) return;
        
        gsap.to(node, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });

        this.hideMicroExplanation(nodeId);
      };

      // Keyboard focus interactions
      const handleFocus = () => {
        if (!this.isVisible) return;
        
        node.setAttribute('stroke-width', '4');
        gsap.to(node, {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out'
        });

        this.showMicroExplanation(nodeId, index);
        
        // Announce to screen readers
        const explanations = [
          'Source Prompts: Intent lives in markdown prompts',
          'Voder: Interprets and compiles your vision', 
          'Application Code: Written, structured, and versioned',
          'Working Product: Fully functional application'
        ];
        this.elements.liveRegion.textContent = explanations[index] || '';
      };

      const handleBlur = () => {
        node.setAttribute('stroke-width', '2');
        gsap.to(node, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });

        this.hideMicroExplanation(nodeId);
      };

      // Add event listeners
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
      node.addEventListener('focus', handleFocus);
      node.addEventListener('blur', handleBlur);

      // Make focusable for keyboard navigation
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', `${nodeId.replace('-', ' ')}: Click for details`);

      // Store cleanup functions
      this.hoverInteractions.set(nodeId, () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
        node.removeEventListener('focus', handleFocus);
        node.removeEventListener('blur', handleBlur);
      });
    });
  }

  private showMicroExplanation(nodeId: string, index: number): void {
    // Create or show tooltip
    let tooltip = document.getElementById(`${nodeId}-tooltip`);
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = `${nodeId}-tooltip`;
      tooltip.className = 'flow-node-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
      tooltip.style.color = '#FFFFFF';
      tooltip.style.padding = '0.75rem';
      tooltip.style.borderRadius = '8px';
      tooltip.style.border = '1px solid #24D1D5';
      tooltip.style.fontSize = '0.9rem';
      tooltip.style.lineHeight = '1.4';
      tooltip.style.maxWidth = '200px';
      tooltip.style.zIndex = '1000';
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.transform = 'translateY(10px)';
      tooltip.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

      const explanations = [
        'Business requirements and design intent expressed in natural language',
        'AI-powered compiler that transforms prompts into structured code',
        'Production-ready code with proper architecture and version control',
        'Complete product that matches the original intent and requirements'
      ];

      tooltip.textContent = explanations[index] || 'Workflow step details';
      
      this.section.appendChild(tooltip);
    }

    // Position tooltip near the node
    const nodeRect = (this.elements.svg.querySelector(`#${nodeId}`) as SVGElement)?.getBoundingClientRect();
    if (nodeRect) {
      const sectionRect = this.section.getBoundingClientRect();
      tooltip.style.left = `${nodeRect.left - sectionRect.left + 30}px`;
      tooltip.style.top = `${nodeRect.top - sectionRect.top - 10}px`;
    }

    // Animate tooltip appearance
    gsap.to(tooltip, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  private hideMicroExplanation(nodeId: string): void {
    const tooltip = document.getElementById(`${nodeId}-tooltip`);
    if (tooltip) {
      gsap.to(tooltip, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          tooltip.remove();
        }
      });
    }
  }

  private setupKeyboardNavigation(): void {
    // Handle keyboard navigation between nodes
    const nodes = Array.from(this.elements.svg.querySelectorAll('circle'));
    
    nodes.forEach((node, index) => {
      node.addEventListener('keydown', (event: Event) => {
        const keyEvent = event as KeyboardEvent;
        
        switch (keyEvent.key) {
          case 'ArrowDown':
            keyEvent.preventDefault();
            if (index < nodes.length - 1) {
              (nodes[index + 1] as SVGCircleElement).focus();
            }
            break;
          case 'ArrowUp':
            keyEvent.preventDefault();
            if (index > 0) {
              (nodes[index - 1] as SVGCircleElement).focus();
            }
            break;
          case 'Enter':
          case ' ':
            keyEvent.preventDefault();
            // Trigger detailed explanation
            this.showDetailedExplanation(index);
            break;
          case 'Escape':
            keyEvent.preventDefault();
            (node as SVGCircleElement).blur();
            break;
        }
      });
    });
  }

  private showDetailedExplanation(index: number): void {
    const stepCards = this.elements.stepExplanations.querySelectorAll('.flow-step');
    const targetCard = stepCards[index];
    
    if (targetCard) {
      // Scroll to the explanation
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the card temporarily
      gsap.to(targetCard, {
        backgroundColor: 'rgba(36, 209, 213, 0.3)',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });

      // Announce to screen readers
      const title = targetCard.querySelector('h3')?.textContent;
      const description = targetCard.querySelector('p')?.textContent;
      this.elements.liveRegion.textContent = `${title}: ${description}`;
    }
  }

  private setupReducedMotionSupport(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show static version immediately
      gsap.set([
        this.elements.backgroundLighting,
        this.elements.heading,
        this.elements.diagramContainer,
        this.elements.stepExplanations
      ], {
        opacity: 1
      });

      gsap.set(this.elements.heading, { y: 0 });

      const nodes = this.elements.svg.querySelectorAll('circle');
      const labels = this.elements.svg.querySelectorAll('text');
      const connections = this.elements.svg.querySelectorAll('line');
      const stepCards = this.elements.stepExplanations.querySelectorAll('.flow-step');

      gsap.set([...nodes, ...labels, ...connections], { opacity: 1 });
      gsap.set(nodes, { scale: 1 });
      gsap.set(connections, { strokeDashoffset: 0 });
      gsap.set(stepCards, { opacity: 1, y: 0 });

      this.isVisible = true;
      
      // Mark as complete immediately for reduced motion
      this.section.setAttribute('data-initial-animation-complete', 'true');
      
      // Still enable interactive elements
      this.setupInteractiveElements();
      
      // Announce completion
      setTimeout(() => {
        this.elements.liveRegion.textContent = 'Workflow diagram displayed. Interactive elements available.';
      }, 100);
    }
  }

  private updateLiveRegion(message: string): void {
    this.elements.liveRegion.textContent = message;
  }

  private enableInteractivity(): void {
    // Enable all interactive features after animation completes
    this.workflowNodes.forEach(node => {
      const nodeElement = this.elements.svg.querySelector(`#${node.id}`);
      if (nodeElement) {
        nodeElement.setAttribute('data-interactive', 'true');
      }
    });
  }

  private disableInteractivity(): void {
    // Disable interactive features during animation
    this.workflowNodes.forEach(node => {
      const nodeElement = this.elements.svg.querySelector(`#${node.id}`);
      if (nodeElement) {
        nodeElement.removeAttribute('data-interactive');
      }
    });
  }

  public dispose(): void {
    // Clean up ScrollTrigger
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    // Clean up timeline
    if (this.timeline) {
      this.timeline.kill();
    }

    // Clean up event listeners
    this.hoverInteractions.forEach(cleanup => cleanup());
    this.hoverInteractions.clear();

    // Remove tooltips
    const tooltips = this.section.querySelectorAll('.flow-node-tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
  }
}
