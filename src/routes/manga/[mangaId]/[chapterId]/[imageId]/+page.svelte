<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		imgElement.onload = () => {
			adjustImgHeight();
		};
	});

	function adjustImgHeight() {
		console.log(imgElement.complete);
		console.log(imgElement.naturalHeight);
		// if (imgElement.naturalHeight === 0) return; // image loading failed
		console.log('h', imgElement.height);
		console.log('w', imgElement.width);
		showDifferent = imgElement.width > imgElement.height;
		imgHeight = showDifferent ? window.innerHeight + 'px' : '100%';
	}

	let imgHeight = '100%';
	let imgElement: HTMLImageElement;

	let showDifferent = false;
</script>

{#if browser}
	inner: {window.innerHeight}
	imgHeight: {imgHeight}
{/if}
<div style="overflow: auto;">
	<a href={data.nextPageUrl}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<img
			on:click={adjustImgHeight}
			bind:this={imgElement}
			src={data.currentImageUrl}
			style="object-fit: contain; max-width: unset;"
			style:height={imgHeight}
			style:width={showDifferent ? 'unset' : '100%'}
			alt="n"
		/>
	</a>
</div>
<center style="display: flex; justify-content: center; ">
	<a href="/" style="padding-right:1rem;">Home</a>
	<a href={`/manga/${data.mangaId}`} style="padding-right:1rem;">Overview</a>
	<a href={data.nextPageUrl} style="padding-right:1rem;">Next Page</a>
	<a href={data.nextChapterUrl}>Next Chapter</a>
	{showDifferent}
</center>
