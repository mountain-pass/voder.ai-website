<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  onMount(async () => {
    if (browser) {
      const { initScrollAnimations } = await import('$lib/scroll-init.js');
      initScrollAnimations();
    }
  });
</script>

<main>
  <section>
    <h1 class="typing-animation">Tell Us What You Want. Let Voder Build It.</h1>
    <p class="fade-in">Define your vision in prompts, watch it become code.</p>
  </section>

  <section>
    <h2 class="fade-in">The Problem</h2>
    <p class="fade-in">
      Today’s code generation tools still leave you stuck fiddling with source code.
      Voder lets you work at a higher level—focused on application behaviour,
      brand identity, and business outcomes.
    </p>
  </section>

  <section>
    <h2 class="fade-in">GPS vs Directions</h2>
    <p class="fade-in">[Car + route planning vs manual zig-zag path]</p>
  </section>

  <section>
    <h2 class="fade-in">How It Works</h2>
    <svg class="fade-in" width="600" height="100" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="50" class="accent">
        Business Intent → Source Prompts → Voder → Working Software
      </text>
    </svg>
  </section>

  <section class="slide-prompt-iteration">
    <h2 class="fade-in">Prompt-Driven Iteration</h2>
    <p class="fade-in">
      Only the parts you change will regenerate—preserving structure and speed.
    </p>
    <div class="fade-in">[Animated diff scene]</div>
  </section>

  <section class="slide-outcome-focus">
    <h2 class="fade-in">The Outcome</h2>
    <ul class="fade-in">
      <li>Clarity</li>
      <li>Speed</li>
      <li>Alignment</li>
    </ul>
  </section>

  <section class="slide-closing-moment">
    <h1 class="fade-in">The Compiler for Prompts.</h1>
    <p class="fade-in">Coming Soon.</p>
  </section>
</main>

<footer>Voder. 2025.</footer>