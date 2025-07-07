<script lang="ts">
  import StarfieldBackground from './StarfieldBackground.svelte';
  // No reactive logic for HeroSection yet
</script>

<div class="hero-container">
  <StarfieldBackground />

  <section class="hero-section">
    <div class="hero-logo">
      <img src="/favicon.ico" alt="voder logo" />
      <span class="brand-name">voder</span>
    </div>

    <h1 class="typing-animation fade-in">
      Tell Us What You Want. Let Voder Build It.
    </h1>

    <p class="fade-in">Now it’s time to version our prompts.</p>

    <div class="prompt-bar fade-in" role="form" aria-label="Prompt creation">
      <input
        type="text"
        placeholder="Start to create."
        aria-label="Prompt input"
      />

      <button type="button" class="vibe">Vibe</button>
      <button type="button" class="code">Code</button>

      <img class="icon" src="/assets/gear.svg" alt="gear" />
      <img class="icon" src="/assets/globe.svg" alt="globe" />
      <img class="icon" src="/assets/paperclip.svg" alt="paperclip" />
      <img class="icon" src="/assets/microphone.svg" alt="microphone" />
    </div>

    <nav aria-label="Main navigation">
      <a href="/#about">About</a>
      <a href="/#philosophy">Philosophy</a>
      <a href="/#media">Media</a>
      <a href="/#research">Research</a>
      <a href="/#founders">Founders</a>
    </nav>
  </section>

  <div class="horizon"></div>
</div>

<style>
  .hero-container {
    position: relative;
  }

  .hero-section .hero-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .hero-section .hero-logo img {
    width: 3rem;
    height: 3rem;
  }

  .brand-name {
    font-size: 2rem;
    font-weight: 700;
    text-transform: lowercase;
  }

  .prompt-bar {
    width: 100%;
    max-width: 40rem;
    background-color: #1f2937;
    border-radius: 9999px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .prompt-bar input::placeholder {
    color: #d1d5db;
    opacity: 1;
  }

  .prompt-bar input::-webkit-input-placeholder {
    color: #d1d5db;
    opacity: 1;
  }

  .prompt-bar button.vibe {
    background-color: #2563eb;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    cursor: pointer;
  }

  .prompt-bar button.code {
    background-color: #10b981;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    cursor: pointer;
  }

  .prompt-bar img.icon {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }

  nav a {
    display: inline-flex;
    align-items: center;
    background-color: #1f2937;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  nav a:hover,
  nav a:focus {
    background-color: #374151;
  }

  .horizon {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(to top, #00111a 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
  }

  @media (min-width: 640px) {
    .hero-section .hero-logo {
      gap: 1rem;
      margin-bottom: 3rem;
    }
  }

  @media (min-width: 1024px) {
    .brand-name {
      font-size: 3rem;
    }
  }
</style>
