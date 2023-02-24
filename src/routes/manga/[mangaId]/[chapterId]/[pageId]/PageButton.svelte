<script lang="ts">
	import { onMount } from 'svelte';

	export let url: string | undefined;
	export let title: string;
</script>

<div class="wrapper-ereader" style="display: inline-block;">
	{#if url}
		<a href={url} {title}>
			<button class={$$props.class + ' button-ereader'}>
				<slot />
			</button>
		</a>
	{:else}
		<button disabled class={$$props.class + ' button-ereader'} title={`${title} not available`}>
			<slot />
		</button>
	{/if}
</div>

<style>
	.wrapper-ereader {
		margin-right: 1rem;
		margin-left: 1rem;
	}
	.wrapper-noereader {
		/* margin-right: 0.5rem;
		margin-left: 0.5rem; */
	}

	.button-ereader {
		font-size: 9pt;
		padding-right: 1rem;
		padding-left: 1rem;
	}
	.button-noereader {
		margin-top: 1rem;
		margin-bottom: 0;
	}
</style>
