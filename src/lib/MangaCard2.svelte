<script lang="ts">
	import type { Manga } from './types';

	export let manga: Manga;
</script>

<li class="rounded-md shadow-sm inline-block m-2">
	<div class="inline-block align-top bg-gray-800 text-white text-sm font-medium rounded-l-md min-h-[13rem] max-h-[13rem] ">
		<a href={`/manga/${manga.mangaId}`}>
			<img src={manga.thumbnail} class="rounded-l-md max-h-[13rem] max-w-[8.5rem] object-cover" alt="" />
		</a>
	</div>
	<div class="inline-block align-top min-h-[13rem] w-96 rounded-r-md border-t border-r border-b border-gray-200 bg-white">
		<div class="px-4 py-2 text-sm">
			<a href={`/manga/${manga.mangaId}`} class="font-medium text-gray-900 text-lg">
				{manga.title}
			</a>
			<div>
				{#each manga.authors as author, authorIndex}
					<a href={`?search=${encodeURIComponent('authors:' + author)}`} data-sveltekit-reload>
						{author}
					</a>
					{#if authorIndex < manga.authors.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>
			<div class="whitespace-normal">
				{#each manga.genres as genre, i}
					<a href={`?search=${encodeURIComponent('genres:' + genre)}`} data-sveltekit-reload>{genre}</a>
					{#if i < manga.genres.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>
			<div>
				{manga.rating} ★
			</div>
			<div>
				{manga.views} Views
			</div>
			<div>
				Updated: {manga.updated}
			</div>
		</div>
	</div>
</li>
