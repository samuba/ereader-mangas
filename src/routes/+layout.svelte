<script lang="ts">
	import { browser } from '$app/environment';
	import { isPhone } from '$lib/common';
	import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';
	import { fade } from 'svelte/transition';
	import '../app.css';

	let loadingNewPage = false;

	if (browser) {
		if (isPhone()) killBackButton(); // back button breaks on mobile cuz page will have loading indicator and you cannot do anything

		addEventListener('beforeunload', () => {
			loadingNewPage = true;
			document.documentElement.style.overflow = 'hidden';
		});
	}

	function killBackButton() {
		history.pushState(null, document.title, location.href);
		history.back();
		history.forward();
		window.onpopstate = function () {
			history.go(1);
		};
	}
</script>

{#if loadingNewPage}
	<div
		class="bg-slate-700/50 z-50 fixed w-screen h-screen flex justify-center items-center backdrop-blur-[3px]"
		in:fade={{ delay: 300, duration: 200 }}
	>
		<svg class="animate-spin h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	</div>
{/if}

<slot />

<GoogleAnalytics />
