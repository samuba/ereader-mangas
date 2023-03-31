<script lang="ts">
	export let url: string | undefined;
	export let title: string;
</script>

<div class="wrapper-ereader inline-block">
	<a href={url} {title}>
		<button class={$$props.class + ' button-ereader'}>
			<slot />
		</button>
	</a>
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
		padding-right: 1rem;
		padding-left: 1rem;
	}
	.button-noereader {
		margin-top: 1rem;
		margin-bottom: 0;
		font-size: 0.75rem;
	}

	.button-ereader :global(svg) {
		width: 2rem;
		height: 2rem;
	}
	.button-noereader :global(svg) {
		width: 1rem;
		height: 1rem;
	}
</style>
