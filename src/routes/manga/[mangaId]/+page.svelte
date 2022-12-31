<script lang="ts">
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<NavMenu />

<div class="container">
	<table class="margin-top: 24px;">
		<tbody>
			<tr>
				<td>
					<img src={data.thumbnail} style="margin-right: 24px;" alt="" />
				</td>
				<td>
					<h1 style="margin-bottom: 12px;">
						{data.title}
					</h1>
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
				</td>
			</tr>
		</tbody>
	</table>

	<div>
		<button on:click={() => (data.chapters = data.chapters.reverse())}>Reverse Order</button>
	</div>

	<ul style="margin-top: 24px;">
		{#each data.chapters as chapter}
			<li style="margin-bottom: 12px;">
				<a href={chapter.url} data-sveltekit-reload>{chapter.text}</a>
				— <small>uploaded: {chapter.date}</small>
				<br />
			</li>
		{/each}
	</ul>
</div>
