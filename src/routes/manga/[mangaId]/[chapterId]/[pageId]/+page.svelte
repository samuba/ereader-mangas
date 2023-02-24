<script lang="ts">
	import { browser } from '$app/environment';
	import { switchAllClassesToNoEreader } from '$lib/common';
	import { routes } from '$lib/routes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import PageButton from './PageButton.svelte';

	export let data: PageData;

	let style = 'object-fit: contain; max-width: unset; width: 100%; display: block; '; // this is the style that kindle will use

	onMount(() => {
		imgElement.onload = () => {
			// not executed on kindle. Looks like kindle does not allow dom update from javascript, or javascript is not executed at all

			isWideImage = imgElement.width > imgElement.height;
			style = calculateStyle(isWideImage);

			scrollElement.scrollIntoView(); // cuz mangas read from right to left
		};

		switchAllClassesToNoEreader(); // onMount does not get executed on kindle
	});

	function tailwindCssScreenSize() {
		if (!browser) return '?';
		if (document?.documentElement?.clientWidth >= 1536) return '2xl';
		if (document?.documentElement?.clientWidth >= 1280) return 'xl';
		if (document?.documentElement?.clientWidth >= 1024) return 'lg';
		if (document?.documentElement?.clientWidth >= 768) return 'md';
		if (document?.documentElement?.clientWidth >= 640) return 'sm';
		return 'sm';
	}

	function calculateStyle(isWideImage: boolean) {
		if (!browser) return '';
		if (isPhone()) {
			return `object-fit: unset;  max-width: unset;  height: ${window.innerHeight}px;  width: unset;  overflow: auto;`;
		}
		if (isBigScreen()) {
			if (isWideImage) {
				return `object-fit: contain;  max-width: unset;  height: ${window.innerHeight}px;  width: 100%;  overflow: auto;`;
			} else {
				return `object-fit: contain;  max-width: 45rem;  height: 100%;  width: 100%`;
			}
		}
		return `object-fit: contain; max-width: unset; height: 100%; width: 100%`;
	}

	const isPhone = () => tailwindCssScreenSize() === 'sm';
	const isBigScreen = () => document?.documentElement?.clientWidth >= 768;

	let imgElement: HTMLImageElement;
	let scrollElement: HTMLElement;
	let isWideImage = false; // does not work on kindle. Looks like kindle does not allow dom update from javascript, or javascript is not executed at all
</script>

<svelte:head>
	<title>{data.title} | {data.chapterId}</title>
</svelte:head>

<div style="overflow: auto; display: flex; justify-content: center;">
	<a href={data.nextPageUrl}>
		<center>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img id="image" bind:this={imgElement} src={data.currentImageUrl} {style} />
		</center>
	</a>
	<div bind:this={scrollElement} style="display: inline-block; margin: 0; padding: 0;" />
</div>
<div style="margin-bottom: 1rem; display: flex; justify-content: center;">
	<div class="buttons-ereader">
		<PageButton url={data.previousChapterUrl} title="previous page">«</PageButton>
		<PageButton url={data.previousPageUrl} title="previous chapter">‹</PageButton>

		<PageButton url="/" title="next page" class="outline">⌂</PageButton>
		<PageButton url={`/manga/${data.mangaId}`} title="next page" class="outline">{data.chapterId}</PageButton>

		<PageButton url={data.nextPageUrl} title="next page">›</PageButton>
		<PageButton url={data.nextChapterUrl} title="next chapter">»</PageButton>
	</div>
</div>

<div style="display: none !important;" class="buttons-noereader">
	css-class-dummy: use dynamic classes here so svelte does not tree shake them away
</div>

<!-- for prewarming cache. see app.html -->
<span id="next-page-url" style="display: none">{data.nextPageUrl}</span>
<span id="next-image-url" style="display: none">{data.nextImageUrl}</span>

<style>
	.buttons-ereader {
		display: flex;
		justify-content: center;
	}
	.buttons-noereader {
		display: flex;
		justify-content: space-evenly;
		/* max-width: 30rem; */
		width: 28rem;
	}
</style>
