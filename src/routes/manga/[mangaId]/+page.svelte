<script lang="ts">
	import { page } from '$app/stores';
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const order = Number($page.url.searchParams.get('order'));
	if (order === 1) {
		data.chapters = data.chapters.reverse();
	}
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
							<tr>
								<td> Actions: </td>
								<td>
									<a href={`?order=${order === 0 ? 1 : 0}`} data-sveltekit-reload>Reverse Order</a>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>

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
