<script lang="ts">
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<NavMenu />

<div class="container">
	<h1>{data.title}</h1>
	<div class="">
		<div style="display: inline-block;">
			<img src={data.thumbnail} alt="" />
		</div>

		<div style="float: right;">
			<table>
				<tbody>
					{#each data.infoElements as info}
						<tr>
							<td>
								{info.label}:
							</td>
							{#if info.html.startsWith('<td')}
								{@html info.html}
							{:else}
								<td>
									{@html info.html}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<br />
	<br />
	<ul>
		{#each data.chapters as chapter}
			<li>
				<a href={chapter.url} data-sveltekit-reload>{chapter.text}</a> | uploaded: {chapter.date}
				<br />
			</li>
		{/each}
	</ul>
</div>
