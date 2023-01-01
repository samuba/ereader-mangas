<script lang="ts">
	import { page } from '$app/stores';
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const order = Number($page.url.searchParams.get('order'));
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
					{#if data.userPosition.lastPage}
						<a
							href={`/manga/${data.mangaId}/${data.userPosition.lastChapter}/${data.userPosition.lastPage}`}
							data-sveltekit-reload
							role="button"
							style="margin-right: 12px;"
						>
							▶&nbsp;&nbsp; Continue
						</a>
					{:else}
						<a
							href={`/manga/${data.mangaId}/chapter-1/0`}
							data-sveltekit-reload
							role="button"
							style="margin-right: 12px;"
						>
							▶&nbsp;&nbsp; Read
						</a>
					{/if}
					<a
						href={`?order=${order === 0 ? 1 : 0}`}
						role="button"
						class="secondary outline"
						data-sveltekit-reload
					>
						Reverse Chapters
					</a>
				</td>
			</tr>
		</tbody>
	</table>

	<ul style="margin-top: 24px;">
		{#each data.chapters as chapter}
			<li style="margin-bottom: 12px;">
				<a href={chapter.url} data-sveltekit-reload>{chapter.text}</a>
				<small>— uploaded: {chapter.date}</small>
			</li>
		{/each}
	</ul>
</div>
