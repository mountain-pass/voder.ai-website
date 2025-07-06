<script>
  import { onMount } from 'svelte';

  let canvasEl;

  onMount(() => {
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStars();
    }

    function drawStars() {
      const { width, height } = canvas;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      const starCount = 200;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
    }

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  });
</script>

<canvas bind:this={canvasEl} class="starfield"></canvas>

<style>
  .starfield {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    display: block;
  }
</style>