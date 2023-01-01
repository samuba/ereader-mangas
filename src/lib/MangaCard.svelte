<script lang="ts">
	import type { Manga } from './types';

	export let manga: Manga;

	const authors = manga.author.split(',');
</script>

<article style="width:500px; display: inline-block; margin-right: 12px">
	<a href={`/manga/${manga.mangaId}`}>
		<h5 style="margin-bottom: 0px;">
			{manga.title}
		</h5>
	</a>
	<table style="margin-bottom: 0px;">
		<tbody>
			<tr>
				<td style="border: unset; width: 130px;">
					<a href={`/manga/${manga.mangaId}`}>
						<img src={manga.thumbnail} style="max-height: 200px; max-width: 120px" alt="" />
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
								<td>{manga.rating} ★</td>
							</tr>
							<tr>
								<td> Views: </td>
								<td>{manga.views}</td>
							</tr>
							<tr>
								<td> Updated: </td>
								<td>{manga.updated}</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</article>
