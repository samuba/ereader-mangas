<script lang="ts">
	import type { Manga } from './types';

	export let manga: Manga;
</script>

<li class="col-span-1 flex rounded-md shadow-sm">
	<div
		class="flex-shrink-0 flex items-center justify-center max-w-xs bg-gray-800 text-white text-sm font-medium rounded-l-md min-h-[13rem]"
	>
		<a href={`/manga/${manga.mangaId}`}>
			<img src={manga.thumbnail} style="max-width: 140px;" class="rounded-l-md" alt="" />
		</a>
	</div>
	<div class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
		<div class="flex-1 truncate px-4 py-2 text-sm">
			<a href={`/manga/${manga.mangaId}`} class="font-medium text-gray-900 hover:text-gray-600 text-lg">{manga.title}</a>
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
			<div>
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
