<script lang="ts">
	import { browser, dev } from '$app/environment';

	export let id = 'G-ZKN6NSMPGL';
	const doAnalytics = !dev && browser && typeof window !== 'undefined';

	if (doAnalytics) {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag(): void {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		window.gtag('config', id);
	}
</script>

<svelte:head>
	{#if doAnalytics}
		<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
	{/if}
</svelte:head>
