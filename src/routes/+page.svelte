<script lang="ts">
	import { onMount } from 'svelte';
	import engine from '$lib/Engine.svelte';

	let canvas: HTMLCanvasElement | undefined = $state();
	onMount(async () => {
		if (!canvas) {
			return;
		}
		engine.setup(canvas);

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
                if (!canvas) {
                    return;
                }
				const width = entry.contentBoxSize[0].inlineSize;
				const height = entry.contentBoxSize[0].blockSize;
				canvas.width = Math.max(1, width);
				canvas.height = Math.max(1, height);

			}
		});
		observer.observe(canvas);
	});
</script>

<canvas bind:this={canvas} class=" h-screen w-screen bg-black"></canvas>
