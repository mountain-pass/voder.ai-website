import './style.css';
import { BrandEntry } from './components/BrandEntry';
import { renderWhySection } from './components/WhySection';
import { renderProblemSection } from './components/ProblemSection';
import { MetaphorSection } from './components/MetaphorSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PromptIterationSection } from './components/PromptIterationSection';
import { createOutcomeSection } from './components/OutcomeSection';
import { ClosingMomentSection } from './components/ClosingMomentSection';
import { initScrollAnimations } from './lib/animations';
import { prefersReducedMotion } from './lib/utils';

const app = document.body;

// Brand entry and foundational sections
app.appendChild(BrandEntry());
renderWhySection(app);

renderProblemSection(app);

// Narrative sections
new MetaphorSection(app);
new HowItWorksSection(app);
new PromptIterationSection(app);
app.appendChild(createOutcomeSection());
new ClosingMomentSection(app);

// Initialize scroll-driven animations
// Defer animations: run immediately if reduced-motion, otherwise on first scroll
if (prefersReducedMotion()) {
  initScrollAnimations();
} else {
  const onFirstScroll = (): void => {
    initScrollAnimations();
    window.removeEventListener('scroll', onFirstScroll);
  };
  window.addEventListener('scroll', onFirstScroll, { passive: true });
}
