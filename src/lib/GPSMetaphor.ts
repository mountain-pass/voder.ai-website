/**
 * Interactive GPS vs Directions Metaphor Visualization
 * Creates animated comparison between traditional coding (directions) and AI-powered development (GPS)
 */

interface RoutePoint {
  x: number;
  y: number;
  label: string;
  type: 'start' | 'waypoint' | 'destination';
}

interface GPSVisualizationConfig {
  container: HTMLElement;
  width: number;
  height: number;
  animationDuration: number;
}

export class GPSMetaphor {
  private svg!: SVGSVGElement;
  private config: GPSVisualizationConfig;
  private directionsRoute!: RoutePoint[];
  private gpsRoute!: RoutePoint[];
  private currentMode: 'directions' | 'gps' = 'directions';

  constructor(config: GPSVisualizationConfig) {
    this.config = config;
    this.initializeRoutes();
    this.createSVG();
    this.setupInteraction();
  }

  private initializeRoutes(): void {
    // Traditional "directions" route - complex, indirect path
    this.directionsRoute = [
      { x: 50, y: 180, label: 'Idea', type: 'start' },
      { x: 120, y: 140, label: 'Research', type: 'waypoint' },
      { x: 180, y: 160, label: 'Plan', type: 'waypoint' },
      { x: 240, y: 120, label: 'Design', type: 'waypoint' },
      { x: 300, y: 140, label: 'Mockup', type: 'waypoint' },
      { x: 360, y: 100, label: 'Code', type: 'waypoint' },
      { x: 420, y: 120, label: 'Debug', type: 'waypoint' },
      { x: 480, y: 80, label: 'Test', type: 'waypoint' },
      { x: 540, y: 100, label: 'Deploy', type: 'waypoint' },
      { x: 600, y: 60, label: 'Ship', type: 'destination' }
    ];

    // GPS route - direct, optimized path
    this.gpsRoute = [
      { x: 50, y: 180, label: 'Idea', type: 'start' },
      { x: 200, y: 140, label: 'AI Analysis', type: 'waypoint' },
      { x: 400, y: 100, label: 'Generated Code', type: 'waypoint' },
      { x: 600, y: 60, label: 'Ship', type: 'destination' }
    ];
  }

  private createSVG(): void {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', this.config.width.toString());
    this.svg.setAttribute('height', this.config.height.toString());
    this.svg.setAttribute('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
    this.svg.style.width = '100%';
    this.svg.style.height = 'auto';
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', 'GPS vs Directions metaphor visualization');

    // Create gradient definitions
    this.createGradients();

    // Initially show directions route
    this.renderRoute(this.directionsRoute, 'directions');

    this.config.container.appendChild(this.svg);
  }

  private createGradients(): void {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Directions route gradient (complex, winding)
    const directionsGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    directionsGradient.id = 'directionsGradient';
    directionsGradient.setAttribute('x1', '0%');
    directionsGradient.setAttribute('y1', '0%');
    directionsGradient.setAttribute('x2', '100%');
    directionsGradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ff6b6b');
    stop1.setAttribute('stop-opacity', '0.8');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#ffa726');
    stop2.setAttribute('stop-opacity', '0.8');

    directionsGradient.appendChild(stop1);
    directionsGradient.appendChild(stop2);

    // GPS route gradient (smooth, efficient)
    const gpsGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gpsGradient.id = 'gpsGradient';
    gpsGradient.setAttribute('x1', '0%');
    gpsGradient.setAttribute('y1', '0%');
    gpsGradient.setAttribute('x2', '100%');
    gpsGradient.setAttribute('y2', '0%');

    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '0%');
    stop3.setAttribute('stop-color', '#4CAF50');
    stop3.setAttribute('stop-opacity', '0.9');

    const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop4.setAttribute('offset', '100%');
    stop4.setAttribute('stop-color', '#2196F3');
    stop4.setAttribute('stop-opacity', '0.9');

    gpsGradient.appendChild(stop3);
    gpsGradient.appendChild(stop4);

    defs.appendChild(directionsGradient);
    defs.appendChild(gpsGradient);
    this.svg.appendChild(defs);
  }

  private renderRoute(route: RoutePoint[], mode: 'directions' | 'gps'): void {
    // Clear existing content
    const existingPaths = this.svg.querySelectorAll('.route-path, .route-point, .route-label');
    existingPaths.forEach(el => el.remove());

    // Create path
    const path = this.createPath(route, mode);
    this.svg.appendChild(path);

    // Create points and labels
    route.forEach((point, index) => {
      const circle = this.createPoint(point, index === 0 || index === route.length - 1);
      const label = this.createLabel(point);
      
      this.svg.appendChild(circle);
      this.svg.appendChild(label);
    });

    // Add mode indicator
    this.addModeIndicator(mode);
  }

  private createPath(route: RoutePoint[], mode: 'directions' | 'gps'): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    let pathData = `M ${route[0].x} ${route[0].y}`;
    
    if (mode === 'directions') {
      // Create winding path with curves for complexity
      for (let i = 1; i < route.length; i++) {
        const current = route[i];
        const previous = route[i - 1];
        const controlX = (previous.x + current.x) / 2;
        const controlY = previous.y - 30; // Create bumps
        pathData += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
      }
    } else {
      // Create smooth, direct path for GPS
      for (let i = 1; i < route.length; i++) {
        const current = route[i];
        pathData += ` L ${current.x} ${current.y}`;
      }
    }

    path.setAttribute('d', pathData);
    path.setAttribute('stroke', mode === 'directions' ? 'url(#directionsGradient)' : 'url(#gpsGradient)');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.classList.add('route-path');

    // Add animation
    const pathLength = (path as SVGPathElement).getTotalLength?.() || 1000;
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();
    path.style.animation = `drawPath ${this.config.animationDuration}ms ease-out forwards`;

    return path;
  }

  private createPoint(point: RoutePoint, isEndpoint: boolean): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x.toString());
    circle.setAttribute('cy', point.y.toString());
    circle.setAttribute('r', isEndpoint ? '8' : '5');
    circle.setAttribute('fill', isEndpoint ? '#ffffff' : '#f0f0f0');
    circle.setAttribute('stroke', isEndpoint ? '#333' : '#666');
    circle.setAttribute('stroke-width', '2');
    circle.classList.add('route-point');

    // Add pulse animation for endpoints
    if (isEndpoint) {
      circle.style.animation = 'pulse 2s infinite';
    }

    return circle;
  }

  private createLabel(point: RoutePoint): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', point.x.toString());
    text.setAttribute('y', (point.y + 25).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', point.type === 'start' || point.type === 'destination' ? 'bold' : 'normal');
    text.setAttribute('fill', '#333');
    text.textContent = point.label;
    text.classList.add('route-label');

    return text;
  }

  private addModeIndicator(mode: 'directions' | 'gps'): void {
    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    indicator.setAttribute('x', '20');
    indicator.setAttribute('y', '30');
    indicator.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    indicator.setAttribute('font-size', '16');
    indicator.setAttribute('font-weight', 'bold');
    indicator.setAttribute('fill', mode === 'directions' ? '#ff6b6b' : '#4CAF50');
    indicator.textContent = mode === 'directions' ? '📍 Traditional Directions' : '🛰️ AI-Powered GPS';
    indicator.classList.add('mode-indicator');

    this.svg.appendChild(indicator);
  }

  private setupInteraction(): void {
    // Add scroll-triggered mode switching
    let switched = false;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !switched) {
          // Switch to GPS mode after a delay
          setTimeout(() => {
            this.switchToGPS();
            switched = true;
          }, 1500);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.config.container);

    // Add click interaction for manual switching
    this.svg.addEventListener('click', () => {
      if (this.currentMode === 'directions') {
        this.switchToGPS();
      } else {
        this.switchToDirections();
      }
    });

    this.svg.style.cursor = 'pointer';
  }

  public switchToGPS(): void {
    if (this.currentMode === 'gps') return;
    
    this.currentMode = 'gps';
    this.animateTransition(() => {
      this.renderRoute(this.gpsRoute, 'gps');
    });
  }

  public switchToDirections(): void {
    if (this.currentMode === 'directions') return;
    
    this.currentMode = 'directions';
    this.animateTransition(() => {
      this.renderRoute(this.directionsRoute, 'directions');
    });
  }

  private animateTransition(callback: () => void): void {
    // Fade out current route
    const currentElements = this.svg.querySelectorAll('.route-path, .route-point, .route-label, .mode-indicator');
    currentElements.forEach(el => {
      (el as SVGElement).style.opacity = '0';
      (el as SVGElement).style.transition = 'opacity 300ms ease-out';
    });

    // Render new route after fade out
    setTimeout(() => {
      callback();
      
      // Fade in new route
      const newElements = this.svg.querySelectorAll('.route-path, .route-point, .route-label, .mode-indicator');
      newElements.forEach(el => {
        (el as SVGElement).style.opacity = '0';
        (el as SVGElement).style.transition = 'opacity 500ms ease-in';
        setTimeout(() => {
          (el as SVGElement).style.opacity = '1';
        }, 50);
      });
    }, 300);
  }

  public addAnimationStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes drawPath {
        to {
          stroke-dashoffset: 0;
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
      }

      .route-point {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }

      .route-label {
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
      }

      .mode-indicator {
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
      }
    `;
    
    document.head.appendChild(style);
  }
}
