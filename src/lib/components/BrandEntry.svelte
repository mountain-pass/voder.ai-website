<script lang="ts">
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import type { Mesh } from 'three';

  let hexMesh: Mesh;

  onMount(async () => {
    const { useFrame } = await import('@threlte/core');
    useFrame(() => {
      if (hexMesh) {
        hexMesh.rotation.y += 0.01;
      }
    });
  });
</script>

<style>
  /* make canvas fill its container */
  :global(canvas) {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[2, 2, 2]} intensity={1} />

  <mesh bind:this={hexMesh}>
    <cylinderGeometry args={[1, 1, 0.5, 6]} />
    <meshStandardMaterial color="#5555ff" attach="material-1" />
    <meshStandardMaterial color="#4f46e5" />
  </mesh>
</Canvas>