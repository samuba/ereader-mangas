<script lang="ts">
	import { routes } from '$lib/routes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		imgElement.onload = () => (optimizeForWidePage = imgElement.width > imgElement.height);
	});

	let imgElement: HTMLImageElement;
	let optimizeForWidePage = false; // does not work on kindle. Looks like kindle does not allow dom update from javascript, or javascript is not executed at all
</script>

<div style="overflow: auto;">
	<a href={data.nextPageUrl}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<img
			id="image"
			bind:this={imgElement}
			src={data.currentImageUrl}
			style="object-fit: contain; max-width: unset;"
			style:height={optimizeForWidePage ? window.innerHeight + 'px' : '100%'}
			style:width={optimizeForWidePage ? 'unset' : '100%'}
			alt="n"
		/>
	</a>
</div>
<center style="display: flex; justify-content: center; ">
	<a href={data.previousChapterUrl} style="padding-right:1rem;">← Chapter</a>
	<a href={data.previousPageUrl} style="padding-right:1rem;">← Page</a>
	<a href="/" style="padding-right:1rem;">Home</a>
	<a href={`/manga/${data.mangaId}`} style="padding-right:1rem;">Overview</a>
	<a href={data.nextPageUrl} style="padding-right:1rem;">Page →</a>
	<a href={data.nextChapterUrl}>Chapter →</a>
</center>

<!-- for prewarming cache. see app.html -->
<span id="next-page-url" style="display: none">{data.nextPageUrl}</span>
<span id="next-image-url" style="display: none">{data.nextImageUrl}</span>
