import { problemSpaceToMetaphorConfig } from './transitions/ProblemSpaceToMetaphorConfig';
// Stub out missing globals so downstream modules don’t throw
;(window as any).THREE = {};
;(window as any).gsap  = {};

import './style.css';
import { TransitionController } from './lib/TransitionController';
import { brandEntryToWhyConfig } from './transitions/BrandEntryToWhyConfig';
import { whyToProblemSpaceConfig } from './transitions/WhyToProblemSpaceConfig';
import { outcomeFocusToClosingMomentConfig } from './transitions/OutcomeFocusToClosingMomentConfig';
import { metaphorToVisionFlowConfig } from './transitions/MetaphorToVisionFlowConfig';
import { visionFlowToPromptIterationConfig } from './transitions/VisionFlowToPromptIterationConfig';
import { promptIterationToOutcomeFocusConfig } from './transitions/PromptIterationToOutcomeFocusConfig';

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
new TransitionController(brandEntryToWhyConfig).init();
new TransitionController(whyToProblemSpaceConfig).init();
new TransitionController(problemSpaceToMetaphorConfig).init();


// Render dynamic narrative sections and wire their transitions
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

  // 1. Metaphor Section and its transition
  new MetaphorSection(app);
  new TransitionController(metaphorToVisionFlowConfig).init();

  // 2. Vision Flow Section and its transition
  new HowItWorksSection(app);
  new TransitionController(visionFlowToPromptIterationConfig).init();

  // 3. Prompt Iteration Section and its transition
  new PromptIterationSection(app);
  new TransitionController(promptIterationToOutcomeFocusConfig).init();

  // 4. Outcome Focus Section and its transition
  app.appendChild(createOutcomeSection());
  new TransitionController(outcomeFocusToClosingMomentConfig).init();
    new ClosingMomentSection(app);
})();
