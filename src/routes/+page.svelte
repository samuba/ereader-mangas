<script lang="ts">
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

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
</script>

<NavMenu />

<main class="container">
	<form>
		<center>
			<input value={data.search} type="search" name="search" style="width: 500px;" />
		</center>
		<center>
			{#if data.searchResults}
				Found {data.searchResults.length} Mangas out of {data.allMangasCount}
			{/if}
		</center>
	</form>

	{#if data.searchResults}
		<div>
			{#each data.searchResults as { item } (item.mangaId)}
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
