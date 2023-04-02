<script lang="ts">
	import { browser } from '$app/environment';
	import { isBigScreen, isPhone, switchAllEreaderClassesToNoEreader } from '$lib/common';
	import ChevronDoubleLeft from '$lib/icons/ChevronDoubleLeft.svelte';
	import ChevronDoubleRight from '$lib/icons/ChevronDoubleRight.svelte';
	import ChevronLeftIcon from '$lib/icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from '$lib/icons/ChevronRightIcon.svelte';
	import HomeIcon from '$lib/icons/HomeIcon.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import PageButton from './PageButton.svelte';

	export let data: PageData;

	let imgStyle = 'object-fit: contain; max-width: unset; width: 100%; display: block; '; // this is the style that kindle will use
	let imgElement: HTMLImageElement;
	let imgContainer: HTMLElement;
	let imgWidth: number;
	let imgHeight: number;

	$: isWideImage = imgWidth > imgHeight;
	$: imgStyle = calculateStyle(isWideImage);

	onMount(() => {
		scrollImageToTheRight();
		respondToVisibility(imgElement, () => {
			// did not find a better way to trigger this reliably on phones
			scrollImageToTheRight();
		});

		switchAllEreaderClassesToNoEreader(); // onMount does not get executed on kindle
	});

	function scrollImageToTheRight() {
		if (imgContainer?.clientWidth) imgContainer.scrollLeft = imgContainer.clientWidth;
	}

	function respondToVisibility(element, callback) {
		var options = {
			root: document.documentElement,
		};

		var observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				callback(entry.intersectionRatio > 0);
			});
		}, options);

		observer.observe(element);
	}

	function calculateStyle(isWideImage: boolean) {
		if (!browser) return '';
		if (isPhone()) {
			return 'overflow-x: auto; height: 100vh; max-width: unset;';
		}
		if (isBigScreen()) {
			if (isWideImage) {
				return `object-fit: contain;  max-width: unset;  height: ${window.innerHeight}px;  width: 100%;  overflow: auto;`;
			} else {
				return `object-fit: contain;  max-width: 45rem;  height: 100%;  width: 100%`;
			}
		}
		return imgStyle;
	}
</script>

<svelte:head>
	<title>{data.title} | {data.chapterId}</title>
</svelte:head>

<a href={data.nextPageUrl}>
	<center>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div style="overflow: auto;" bind:this={imgContainer}>
			<img
				id="image"
				bind:this={imgElement}
				bind:naturalWidth={imgWidth}
				bind:naturalHeight={imgHeight}
				src={data.currentImageUrl}
				style={imgStyle}
				alt={imgWidth === undefined ? 'loading page...' : 'current page'}
			/>
		</div>
	</center>
</a>

<div class="flex justify-center">
	<div class="text-center buttons-ereader text-indigo-900">
		<PageButton url={data.previousChapterUrl} title="previous page"><ChevronDoubleLeft class="inline" /></PageButton>
		<PageButton url={data.previousPageUrl} title="previous chapter"><ChevronLeftIcon class="inline" /></PageButton>

		<PageButton url="/" title="Home"><HomeIcon class="inline" /></PageButton>
		<PageButton url={`/manga/${data.mangaId}`} title="Manga Overview" class="underline">
			Chapter {data.chapterId?.split('-')[1]}
		</PageButton>

		<PageButton url={data.nextPageUrl} title="next page"><ChevronRightIcon class="inline" /></PageButton>
		<PageButton url={data.nextChapterUrl} title="next chapter"><ChevronDoubleRight class="inline" /></PageButton>
	</div>
</div>

<!-- for prewarming cache. see app.html -->
<span id="next-page-url" style="display: none">{data.nextPageUrl}</span>
<span id="next-image-url" style="display: none">{data.nextImageUrl}</span>

<style>
	div :global(.buttons-ereader) {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
	div :global(.buttons-noereader) {
		display: flex;
		justify-content: space-evenly; /* important for phones */
		width: 28rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
</style>
