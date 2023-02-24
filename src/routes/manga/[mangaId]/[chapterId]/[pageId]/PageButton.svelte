<script lang="ts">
	export let url: string | undefined;
	export let title: string;
</script>

<div style="display: inline-block; margin-right: 0.5rem; margin-left: 0.5rem;">
	{#if url}
		<a href={url} {title}>
			<button style="font-size: 10pt; padding-right: 0.5rem; padding-left: 0.5rem;" class={$$props.class}>
				<slot />
			</button>
		</a>
	{:else}
		<button
			style="font-size: 10pt; padding-right: 0.5rem; padding-left: 0.5rem;"
			class={$$props.class}
			disabled
			title={`${title} not available`}
		>
			<slot />
		</button>
	{/if}
</div>
