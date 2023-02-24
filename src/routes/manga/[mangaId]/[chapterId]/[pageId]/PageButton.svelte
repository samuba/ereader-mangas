<script lang="ts">
	export let url: string | undefined;
	export let title: string;
</script>

<div style="display: inline-block; margin-right: 1rem; margin-left: 1rem;">
	{#if url}
		<a href={url} {title}>
			<button class={$$props.class + ' butt'}>
				<slot />
			</button>
		</a>
	{:else}
		<button disabled class={$$props.class + ' butt'} title={`${title} not available`}>
			<slot />
		</button>
	{/if}
</div>

<style>
	@media (hover) {
		.butt {
			margin-top: 2rem;
			background-color: red;
		}
	}
	@media (monochrome) {
		.butt {
			font-size: 10pt;
			padding-right: 1rem;
			padding-left: 1rem;
		}
	}
</style>
