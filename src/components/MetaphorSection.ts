// src/components/MetaphorSection.ts
import { GPSMetaphor } from '../lib/GPSMetaphor';

export class MetaphorSection {
  private gpsViz?: GPSMetaphor;

  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.setAttribute('data-testid', 'metaphor-section');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', 'metaphor-heading');

    const heading = document.createElement('h2');
    heading.id = 'metaphor-heading';
    heading.textContent = "You've been in the passenger seat.";
    section.appendChild(heading);

    // Interactive GPS vs Directions visualization
    const vizContainer = document.createElement('div');
    vizContainer.className = 'gps-visualization';
    vizContainer.style.margin = '2rem 0';
    vizContainer.style.padding = '1rem';
    vizContainer.style.backgroundColor = '#f8f9fa';
    vizContainer.style.borderRadius = '8px';
    vizContainer.style.border = '1px solid #e9ecef';
    section.appendChild(vizContainer);

    // Initialize GPS metaphor visualization
    this.initializeGPSVisualization(vizContainer);

    // Fallback diagram for reduced motion or script failure
    const diagram = document.createElement('div');
    diagram.className = 'journey-diagram';
    diagram.setAttribute('role', 'img');
    diagram.setAttribute('aria-labelledby', 'metaphor-description');
    diagram.style.display = 'none'; // Hidden by default, shown if GPS viz fails
    section.appendChild(diagram);

    const desc = document.createElement('div');
    desc.id = 'metaphor-description';
    desc.className = 'sr-only';
    desc.textContent =
      'Interactive visualization comparing traditional development (complex, winding path through many steps) with AI-powered development (direct, efficient route to the destination).';
    section.appendChild(desc);

    const p1 = document.createElement('p');
    p1.textContent =
      "Tools like Copilot and Cursor help you steer... but you're still stuck giving directions.";
    section.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'What if your system already knew the destination?';
    section.appendChild(p2);

    // Instructions for interaction
    const instructions = document.createElement('p');
    instructions.style.fontSize = '0.9rem';
    instructions.style.color = 'var(--color-paper-white)'; // Use high contrast white
    instructions.style.fontStyle = 'italic';
    instructions.style.textAlign = 'center';
    instructions.style.opacity = '0.8'; // Slightly dim for visual hierarchy
    instructions.textContent = 'Click the visualization above to switch between traditional development and AI-powered development';
    section.appendChild(instructions);

    container.appendChild(section);
  }

  private initializeGPSVisualization(container: HTMLElement): void {
    try {
      this.gpsViz = new GPSMetaphor({
        container,
        width: 650,
        height: 220,
        animationDuration: 2000
      });

      // Add animation styles
      this.gpsViz.addAnimationStyles();

      // Set up reduced motion support
      this.setupReducedMotionSupport(container);
    } catch {
      // GPS visualization failed, fallback will be shown
      this.showFallbackDiagram(container);
    }
  }

  private setupReducedMotionSupport(container: HTMLElement): void {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion && this.gpsViz) {
      // Disable animations for reduced motion by adding class to container
      container.classList.add('reduced-motion');
      
      // Add reduced motion styles
      const style = document.createElement('style');
      style.textContent = `
        .gps-visualization.reduced-motion * {
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private showFallbackDiagram(container: HTMLElement): void {
    // Hide GPS container and show fallback
    container.style.display = 'none';
    const fallback = container.parentElement?.querySelector('.journey-diagram') as HTMLElement;
    if (fallback) {
      fallback.style.display = 'block';
    }
  }
}
