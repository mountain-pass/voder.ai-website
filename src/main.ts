import './style.css';
// Import GSAP first
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Setup global access for GSAP
declare global {
  interface Window {
    gsap: typeof gsap;
  }
}

window.gsap = gsap;

import { TransitionController } from './lib/TransitionController';
import { WhyToProblemSpaceTransition } from './lib/WhyToProblemSpaceTransition';
import { problemSpaceToMetaphorConfig } from './transitions/ProblemSpaceToMetaphorConfig';
import { brandEntryToWhyConfig } from './transitions/BrandEntryToWhyConfig';
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
  // eslint-disable-next-line no-console
  console.log('Reduced motion detected, skipping complex animations.');
}
initScrollAnimations();
// Re-enabled BrandEntryToWhyConfig for overlay fading - conflicts resolved
new TransitionController(brandEntryToWhyConfig).init();

// Initialize the new 4-second choreographed transition
const whyToProblemTransition = new WhyToProblemSpaceTransition();
whyToProblemTransition.init();

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
