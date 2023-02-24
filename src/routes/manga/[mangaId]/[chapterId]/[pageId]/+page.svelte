<script lang="ts">
	import { browser } from '$app/environment';
	import { switchAllClassesToNoEreader } from '$lib/common';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import PageButton from './PageButton.svelte';

	export let data: PageData;

	let imgStyle = 'object-fit: contain; max-width: unset; width: 100%; display: block; '; // this is the style that kindle will use
	let imgElement: HTMLImageElement;
	let imgContainer: HTMLElement;
	let isWideImage = false; // does not work on kindle. Looks like kindle does not allow dom update from javascript, or javascript is not executed at all

	let observer = null;

	onMount(() => {
		imgElement.onload = function () {
			// not executed on kindle. Looks like kindle does not allow dom update from javascript, or javascript is not executed at all

			scrollImageToTheRight();

			isWideImage = this.width > this.height;
			imgStyle = calculateStyle(isWideImage);
		};

		switchAllClassesToNoEreader(); // onMount does not get executed on kindle

		scrollImageToTheRight();

		imgStyle = calculateStyle(false);

		respondToVisibility(imgElement, () => {
			// did not find a better way to trigger this reliably on phones
			scrollImageToTheRight();
		});
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
			return 'overflow-x: auto; height: 100vh;';
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
</script>

<svelte:head>
	<title>{data.title} | {data.chapterId}</title>
</svelte:head>

<a href={data.nextPageUrl}>
	<center>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div style="overflow: auto;" bind:this={imgContainer}>
			<img id="image" bind:this={imgElement} src={data.currentImageUrl} style={imgStyle} />
		</div>
	</center>
</a>

<div style="margin-bottom: 1rem; display: flex; justify-content: center;">
	<center class="buttons-ereader">
		<PageButton url={data.previousChapterUrl} title="previous page">«</PageButton>
		<PageButton url={data.previousPageUrl} title="previous chapter">‹</PageButton>

		<PageButton url="/" title="next page" class="outline">⌂</PageButton>
		<PageButton url={`/manga/${data.mangaId}`} title="next page" class="outline">{data.chapterId}</PageButton>

		<PageButton url={data.nextPageUrl} title="next page">›</PageButton>
		<PageButton url={data.nextChapterUrl} title="next chapter">»</PageButton>
	</center>
</div>

<div style="display: none !important;" class="buttons-noereader">
	css-class-dummy: use dynamic classes here so svelte does not tree shake them away
</div>

<!-- for prewarming cache. see app.html -->
<span id="next-page-url" style="display: none">{data.nextPageUrl}</span>
<span id="next-image-url" style="display: none">{data.nextImageUrl}</span>

<style>
	.buttons-ereader {
		/* center tag already centers */
	}
	.buttons-noereader {
		display: flex;
		justify-content: space-evenly; /* important for phones */
		width: 28rem;
	}

	.img-phone {
	}
</style>
