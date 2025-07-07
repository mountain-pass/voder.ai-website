<script>
  // No script logic needed yet
</script>

<svelte:head>
  <title>voder.ai</title>
  <meta
    name="description"
    content="We version our code. We version our infrastructure. Now it’s time to version our prompts."
  />
  <meta property="og:image" content="/assets/preview.png" />
  <meta property="og:title" content="voder.ai — The Compiler for Prompts." />
  <meta
    property="og:description"
    content="We version our code. We version our infrastructure. Now it’s time to version our prompts."
  />
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

<slot />
<button aria-label="Help" class="help-button">?</button>

<style>
  @import '../app.css';
  /* Add any additional global layout styles here */

  .help-button {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--color-accent);
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
</style>
