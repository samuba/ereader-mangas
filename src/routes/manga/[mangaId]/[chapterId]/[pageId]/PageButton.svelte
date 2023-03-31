<script lang="ts">
	export let url: string | undefined;
	export let title: string;
</script>

<a href={url} {title} class="inline-block">
	<button class={$$props.class + ' button-ereader min-h-[1.5rem] min-w-[1.5rem]'}>
		<slot />
	</button>
</a>

<style>
	.button-ereader {
		margin-left: 1.5rem;
		margin-right: 1.5rem;
	}
	.button-noereader {
		font-size: 0.75rem;
	}

	.button-ereader :global(svg) {
		width: 2.2rem;
		height: 2.2rem;
	}
	.button-noereader :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
