// src/components/HowItWorksSection.ts
import { VisionFlowAnimatedSchematic } from '../lib/VisionFlowAnimatedSchematic';

export class HowItWorksSection {
  private animatedSchematic?: VisionFlowAnimatedSchematic;

  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', 'flow-heading');
    section.setAttribute('data-testid', 'vision-flow-section');
    section.id = 'vision-flow';
    section.style.position = 'relative';
    section.style.minHeight = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';
    section.style.backgroundColor = '#0F1A2E'; // Deep Navy
    section.style.padding = '4rem 2rem';
    section.style.overflow = 'hidden';

    // Background lighting container
    const backgroundLighting = document.createElement('div');
    backgroundLighting.className = 'vision-flow-background';
    backgroundLighting.style.position = 'absolute';
    backgroundLighting.style.top = '0';
    backgroundLighting.style.left = '0';
    backgroundLighting.style.width = '100%';
    backgroundLighting.style.height = '100%';
    backgroundLighting.style.background = 'radial-gradient(ellipse at center, rgba(36, 209, 213, 0.1) 0%, transparent 70%)';
    backgroundLighting.style.opacity = '0';
    backgroundLighting.style.transition = 'opacity 0.5s ease-out';
    backgroundLighting.setAttribute('aria-hidden', 'true');
    section.appendChild(backgroundLighting);

    // Main content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.position = 'relative';
    contentWrapper.style.zIndex = '2';
    contentWrapper.style.textAlign = 'center';
    contentWrapper.style.maxWidth = '800px';
    contentWrapper.style.width = '100%';

    // Section heading
    const heading = document.createElement('h2');
    heading.id = 'flow-heading';
    heading.setAttribute('data-testid', 'flow-heading');
    heading.textContent = 'How It Works';
    heading.style.color = '#FFFFFF';
    heading.style.fontSize = '3rem';
    heading.style.fontWeight = '600';
    heading.style.margin = '0 0 3rem 0';
    heading.style.fontFamily = 'Inter, Satoshi, "Neue Haas Grotesk", -apple-system, BlinkMacSystemFont, sans-serif';
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(30px)';
    contentWrapper.appendChild(heading);

    // Animated flow diagram container
    const diagramContainer = document.createElement('div');
    diagramContainer.className = 'flow-diagram-container';
    diagramContainer.setAttribute('data-testid', 'flow-diagram');
    diagramContainer.setAttribute('role', 'group');
    diagramContainer.setAttribute('aria-label', 'Interactive workflow diagram showing how Voder transforms prompts into working products');
    diagramContainer.style.position = 'relative';
    diagramContainer.style.width = '100%';
    diagramContainer.style.maxWidth = '600px';
    diagramContainer.style.height = '500px';
    diagramContainer.style.margin = '0 auto 3rem auto';
    diagramContainer.style.opacity = '0';
    contentWrapper.appendChild(diagramContainer);

    // Create sophisticated SVG diagram
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 600 500');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.overflow = 'visible';

    // Define gradient and glow filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Node glow filter
    const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glowFilter.setAttribute('id', 'node-glow');
    glowFilter.setAttribute('width', '300%');
    glowFilter.setAttribute('height', '300%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    glowFilter.appendChild(feGaussianBlur);
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    glowFilter.appendChild(feMerge);
    defs.appendChild(glowFilter);

    // Connection line gradient
    const lineGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    lineGradient.setAttribute('id', 'connection-gradient');
    lineGradient.setAttribute('x1', '0%');
    lineGradient.setAttribute('y1', '0%');
    lineGradient.setAttribute('x2', '0%');
    lineGradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#24D1D5');
    stop1.setAttribute('stop-opacity', '1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#9AEF00');
    stop2.setAttribute('stop-opacity', '0.8');
    
    lineGradient.appendChild(stop1);
    lineGradient.appendChild(stop2);
    defs.appendChild(lineGradient);
    
    svg.appendChild(defs);

    // Create connection lines (initially hidden)
    const connections = [
      { x1: 300, y1: 120, x2: 300, y2: 200, id: 'connection-1' },
      { x1: 300, y1: 280, x2: 300, y2: 360, id: 'connection-2' },
      { x1: 300, y1: 440, x2: 300, y2: 480, id: 'connection-3' }
    ];

    connections.forEach(conn => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', conn.x1.toString());
      line.setAttribute('y1', conn.y1.toString());
      line.setAttribute('x2', conn.x2.toString());
      line.setAttribute('y2', conn.y2.toString());
      line.setAttribute('stroke', 'url(#connection-gradient)');
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-dasharray', '80');
      line.setAttribute('stroke-dashoffset', '80');
      line.setAttribute('id', conn.id);
      line.setAttribute('data-testid', conn.id);
      line.style.opacity = '0';
      svg.appendChild(line);
    });

    // Create workflow nodes
    const nodes = [
      { x: 300, y: 80, id: 'source-prompts-node', label: 'Source Prompts' },
      { x: 300, y: 240, id: 'voder-node', label: 'Voder' },
      { x: 300, y: 400, id: 'application-code-node', label: 'Application Code' },
      { x: 300, y: 480, id: 'working-product-node', label: 'Working Product' }
    ];

    nodes.forEach((node, index) => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', index === 1 ? '#9AEF00' : '#24D1D5'); // Voder node is accent green
      circle.setAttribute('stroke', '#FFFFFF');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('filter', 'url(#node-glow)');
      circle.setAttribute('id', node.id);
      circle.setAttribute('data-testid', node.id);
      circle.style.opacity = '0';
      circle.style.cursor = 'pointer';
      circle.style.transition = 'all 0.3s ease';
      svg.appendChild(circle);

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', (node.y + 50).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#FFFFFF');
      text.setAttribute('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif');
      text.setAttribute('font-size', '16');
      text.setAttribute('font-weight', '600');
      text.setAttribute('id', `${node.id}-label`);
      text.setAttribute('data-testid', `${node.id}-label`);
      text.textContent = node.label;
      text.style.opacity = '0';
      text.style.userSelect = 'none';
      svg.appendChild(text);
    });

    diagramContainer.appendChild(svg);

    // Accessible description
    const description = document.createElement('div');
    description.id = 'flow-description';
    description.className = 'sr-only';
    description.textContent = 'Voder workflow: Business Intent leads to Source Prompts, which are processed by Voder to create Application Code, resulting in a Working Product.';
    contentWrapper.appendChild(description);

    // Detailed step explanations (initially hidden)
    const stepExplanations = document.createElement('div');
    stepExplanations.className = 'flow-step-explanations';
    stepExplanations.style.marginTop = '2rem';
    stepExplanations.style.opacity = '0';

    const explanationData = [
      {
        id: 'source-prompts-explanation',
        title: 'Source Prompts',
        description: 'Intent lives in markdown prompts.',
        details: 'Business requirements and design intent expressed in natural language'
      },
      {
        id: 'voder-explanation', 
        title: 'Voder',
        description: 'Voder interprets and compiles your vision.',
        details: 'AI-powered compiler that transforms prompts into structured code'
      },
      {
        id: 'application-code-explanation',
        title: 'Application Code',
        description: 'Code is written, structured, and versioned — for real.',
        details: 'Production-ready code with proper architecture and version control'
      },
      {
        id: 'working-product-explanation',
        title: 'Working Product',
        description: 'Fully functional application ready for deployment.',
        details: 'Complete product that matches the original intent and requirements'
      }
    ];

    explanationData.forEach(exp => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'flow-step';
      stepDiv.setAttribute('data-testid', exp.id);
      stepDiv.style.margin = '1rem 0';
      stepDiv.style.padding = '1rem';
      stepDiv.style.backgroundColor = 'rgba(36, 209, 213, 0.1)';
      stepDiv.style.borderRadius = '8px';
      stepDiv.style.border = '1px solid rgba(36, 209, 213, 0.3)';
      stepDiv.style.opacity = '0';
      stepDiv.style.transform = 'translateY(20px)';

      const title = document.createElement('h3');
      title.textContent = exp.title;
      title.style.color = '#24D1D5';
      title.style.fontSize = '1.5rem';
      title.style.fontWeight = '600';
      title.style.margin = '0 0 0.5rem 0';

      const description = document.createElement('p');
      description.textContent = exp.description;
      description.style.color = '#FFFFFF';
      description.style.fontSize = '1.1rem';
      description.style.margin = '0 0 0.5rem 0';

      const details = document.createElement('p');
      details.textContent = exp.details;
      details.style.color = '#C6CBD4';
      details.style.fontSize = '0.9rem';
      details.style.margin = '0';

      stepDiv.appendChild(title);
      stepDiv.appendChild(description);
      stepDiv.appendChild(details);
      stepExplanations.appendChild(stepDiv);
    });

    contentWrapper.appendChild(stepExplanations);
    section.appendChild(contentWrapper);

    // Live region for accessibility announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.top = 'auto';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    section.appendChild(liveRegion);

    container.appendChild(section);

    // Initialize the animated schematic system
    this.animatedSchematic = new VisionFlowAnimatedSchematic(section, {
      backgroundLighting,
      heading,
      diagramContainer,
      svg,
      stepExplanations,
      liveRegion
    });
  }

  public dispose(): void {
    if (this.animatedSchematic) {
      this.animatedSchematic.dispose();
    }
  }
}
