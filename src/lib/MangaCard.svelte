<script lang="ts">
	import type { Manga } from './types';

	export let manga: Manga;
</script>

<article style="width:500px; display: inline-block; margin-right: 12px; margin-bottom: 12px; margin-top: 0; padding: 24px;">
	<a href={`/manga/${manga.mangaId}`}>
		<h5 style="margin-bottom: 0px; font-size: 28px;">
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
									{#each manga.authors as author, authorIndex}
										<a href={`?search=${encodeURIComponent('authors:' + author)}`} data-sveltekit-reload>
											{author}
										</a>
										{#if authorIndex < manga.authors.length - 1}
											<span style="padding-right: 0.15rem;">-</span>
										{/if}
									{/each}
								</td>
							</tr>
							<tr>
								<td> Genres: </td>
								<td>
									{#each manga.genres as genre, i}
										<a href={`?search=${encodeURIComponent('genres:' + genre)}`} data-sveltekit-reload>{genre}</a>
										{#if i < manga.genres.length - 1}
											<span style="padding-right: 0.15rem;">-</span>
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
