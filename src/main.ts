// Stub out missing globals so downstream modules don’t throw
;(window as any).THREE = {};
;(window as any).gsap  = {};

import './style.css';
import { BrandEntry } from './components/BrandEntry';
import { renderWhySection } from './components/WhySection';
import { renderProblemSection } from './components/ProblemSection';
import { initScrollAnimations } from './lib/animations';
import { prefersReducedMotion } from './lib/utils';

const app = document.body;

// Render static sections immediately
app.appendChild(BrandEntry());
renderWhySection(app);
renderProblemSection(app);

// Start scroll animations immediately if motion is allowed
if (prefersReducedMotion()) {
  console.log('Reduced motion detected, skipping complex animations.');
}
initScrollAnimations();

// Dynamically load and initialize narrative sections, then start animations
(async () => {
  const [
    { MetaphorSection },
    { HowItWorksSection },
    { PromptIterationSection },
    { createOutcomeSection },
    { ClosingMomentSection }
  ] = await Promise.all([
    import('./components/MetaphorSection'),
    import('./components/HowItWorksSection'),
    import('./components/PromptIterationSection'),
    import('./components/OutcomeSection'),
    import('./components/ClosingMomentSection')
  ]);

  new MetaphorSection(app);
  new HowItWorksSection(app);
  new PromptIterationSection(app);
  app.appendChild(createOutcomeSection());
  new ClosingMomentSection(app);
})();
