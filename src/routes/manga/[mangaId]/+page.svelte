<script lang="ts">
	import { page } from '$app/stores';
	import NavMenu from '$lib/NavMenu.svelte';
	import { routes } from '$lib/routes';
	import type { PageData } from './$types';

	export let data: PageData;

	const order = Number($page.url.searchParams.get('order'));
</script>

<NavMenu />

<svelte:head>
	<title>{data.title} | Overview</title>
</svelte:head>

<div class="container">
	<table class="margin-top: 24px;">
		<tbody>
			<tr>
				<td>
					<img src={data.thumbnail} style="margin-right: 24px;" alt="" />
				</td>
				<td>
					<hgroup style="margin-bottom: 12px;">
						<h1>{data.title}</h1>
						<h6 style="font-size: 12px">{data.alternativeTitles.join(', ')}</h6>
					</hgroup>
					<table>
						<tbody>
							{#each data.infoElements as info}
								<tr>
									<td>{info.label}:</td>
									{#if info.html.startsWith('<td')}
										{@html info.html}
									{:else}
										<td>{@html info.html}</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>

					{#if data.userPosition.lastPage && data.userPosition.lastChapter}
						<a
							href={routes.readPage(data.mangaId, data.userPosition.lastChapter, data.userPosition.lastPage)}
							role="button"
							style="margin-right: 24px;"
						>
							<b> ▶&nbsp;&nbsp; Continue </b>
						</a>
					{:else}
						<a href={routes.readPage(data.mangaId, 'chapter-1', '0')} role="button" style="margin-right: 24px;">
							<b> ▶&nbsp;&nbsp; Read </b>
						</a>
					{/if}
					{#if data.isFavorite}
						<a href="?unfavorite=true" style="margin-right: 24px;" class="outline" role="button">
							<b> ★&nbsp;&nbsp; Remove Favorite </b>
						</a>
					{:else}
						<a href="?favorite=true" style="margin-right: 24px;" class="outline" role="button">
							<b> ☆&nbsp;&nbsp; Add Favorite </b>
						</a>
					{/if}
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
