<script lang="ts">
  import { onMount } from 'svelte';
  import BrandEntry from '$lib/components/BrandEntry.svelte';
  import ProblemSection from '$lib/components/ProblemSection.svelte';
  import GpsVsDirectionsSection from '$lib/components/GpsVsDirectionsSection.svelte';
  import HowItWorksSection from '$lib/components/HowItWorksSection.svelte';
  import PromptIterationSection from '$lib/components/PromptIterationSection.svelte';
  import OutcomeSection from '$lib/components/OutcomeSection.svelte';
  import ClosingMomentSection from '$lib/components/ClosingMomentSection.svelte';
  import { initScrollAnimations } from '$lib/scroll-init.js';

  onMount(() => {
    initScrollAnimations();
  });
</script>

<main>
  <BrandEntry />

  <h1 class="typing-animation fade-in">
    Tell Us What You Want. Let Voder Build It.
  </h1>
  <p class="fade-in">
    Define your vision in prompts, watch it become code.
  </p>

  <ProblemSection />
  <GpsVsDirectionsSection />
  <HowItWorksSection />
  <PromptIterationSection />
  <OutcomeSection />
  <ClosingMomentSection />
</main>

<footer class="fade-in">Voder. 2025.</footer>