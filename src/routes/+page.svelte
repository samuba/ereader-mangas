<script lang="ts">
	import NavMenu from '$lib/NavMenu.svelte';
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import { page } from '$app/stores';

	type Manga = {
		mangaId: string;
		title: string;
		thumbnail: string;
		views: string;
		author: string;
		rating: number;
		updated: string;
	};

	let searchTerm = '';
	let mangas = [] as Manga[];
	let fuse: ReturnType<typeof buildFuseSearch>;
	let searchResults = [] as Fuse.FuseResult<Manga>[] | undefined;

	const pinnedMangas = [
		{
			name: 'Chainsaw Man',
			id: 'manga-dn980422'
		},
		{
			name: 'The Fable',
			id: 'manga-cc980059'
		},
		{
			name: 'One Piece',
			id: 'manga-aa951409'
		},
		{
			name: 'Dandadan',
			id: 'manga-lp988998'
		},
		{
			name: 'My Home Hero',
			id: 'manga-fa983083'
		},
		{
			name: 'Onepunch-Man',
			id: 'manga-wd951838'
		},
		{
			name: 'Gleipnir',
			id: 'manga-lx952480'
		},
		{
			name: 'Gantz:e',
			id: 'manga-ho984623'
		},
		{
			name: 'Dr. Stone',
			id: 'manga-yz975382'
		},
		{
			name: 'I Am a Hero',
			id: 'manga-ep954372'
		},
		{
			name: 'Ajin',
			id: 'manga-qj952992'
		}
	];

	onMount(async () => {
		mangas = await fetch('/mangas.json').then((x) => x.json());
		fuse = buildFuseSearch(mangas);
		const paramTerm = $page.url.searchParams.get('search');
		if (paramTerm) searchTerm = paramTerm;
		search();
	});

	function buildFuseSearch(mangas: Manga[]) {
		return new Fuse(mangas, {
			isCaseSensitive: false,
			shouldSort: true,
			minMatchCharLength: 3,
			threshold: 0.3,
			includeScore: true,
			keys: ['title', 'author']
		});
	}

	function search() {
		if (!searchTerm) return;
		searchResults = fuse.search(searchTerm);
	}

	$: if (!searchTerm) {
		searchResults = undefined;
	}
</script>

<NavMenu />

<main class="container">
	<form on:submit={search}>
		<center>
			<input bind:value={searchTerm} type="search" name="search" style="width: 500px;" />
		</center>
		<center>
			{#if searchResults}
				Found {searchResults?.length} Mangas out of {mangas?.length}
			{/if}
		</center>
	</form>

	{#if searchResults}
		<div>
			{#each searchResults as { item, score } (item.mangaId)}
				{@const authors = item.author.split(',')}
				<article style="width:500px; display: inline-block; margin-right: 12px">
					<a href={`/manga/${item.mangaId}`}>
						<h5 style="margin-bottom: 0px;">
							{item.title}
						</h5>
					</a>
					<table style="margin-bottom: 0px;">
						<tbody>
							<tr>
								<td style="border: unset; width: 130px;">
									<a href={`/manga/${item.mangaId}`}>
										<img src={item.thumbnail} style="max-height: 200px; max-width: 120px" alt="" />
									</a>
								</td>
								<td style="border: unset;">
									<table>
										<tbody>
											<tr>
												<td> Author: </td>
												<td>
													{#each authors as author, authorIndex}
														<a href={`?search=${encodeURIComponent(author)}`} data-sveltekit-reload>
															{author}
														</a>
														{#if authorIndex < authors.length - 1}
															<span>-</span>
														{/if}
													{/each}
												</td>
											</tr>
											<tr>
												<td> Rating: </td>
												<td>{item.rating} ★</td>
											</tr>
											<tr>
												<td> Views: </td>
												<td>{item.views}</td>
											</tr>
											<tr>
												<td> Updated: </td>
												<td>{item.updated}</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</article>
			{/each}
		</div>
	{/if}

	<div>
		<h2>Favorites</h2>
		<ul>
			{#each pinnedMangas as manga}
				<li>
					<h5>
						<a href={`/manga/${manga.id}`} data-sveltekit-reload>{manga.name}</a>
					</h5>
				</li>
			{/each}
		</ul>
	</div>
</main>
