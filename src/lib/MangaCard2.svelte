<script lang="ts">
	import StarIcon from './icons/StarIcon.svelte';
	import type { Manga } from './types';

	export let manga: Manga;
</script>

<div class="rounded-xl shadow inline-block m-2 bg-white">
	<center
		class="sm:inline-block align-top bg-indigo-900 rounded-t-xl sm:rounded-l-xl min-h-[13rem] max-h-[13rem] w-full sm:w-auto"
	>
		<a href={`/manga/${manga.mangaId}`}>
			<img src={manga.thumbnail} class="sm:rounded-l-xl max-h-[13rem] max-w-[8.5rem] object-cover h-[13rem]" />
		</a>
	</center>
	<div
		class="sm:inline-block align-top min-h-[13rem] sm:rounded-r-xl sm:border-l-0 rounded-b-xl border-t border-r border-b border-gray-200 bg-white -ml-[0.2rem] leading-snug w-96"
	>
		<div class="px-4 py-2 ">
			<a href={`/manga/${manga.mangaId}`} class="font-medium text-slate-900 text-xl">
				{manga.title}
			</a>
			<div>
				{#each manga.authors as author, authorIndex}
					<a href={`?search=${encodeURIComponent('authors:' + author)}`} title="Author" class="link" data-sveltekit-reload>
						{author}
					</a>
					{#if authorIndex < manga.authors.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>
			<div class="mt-4 tracking">
				<span>
					Updated: {manga.updated}
				</span>
				<span class="ml-4">
					{manga.rating}
					<StarIcon class="inline h-4 w-4 " />
				</span>
				<span class="ml-4">
					{manga.views} Views
				</span>
			</div>
			<div class="whitespace-normal mt-4">
				{#each manga.genres as genre, i}
					<a href={`?search=${encodeURIComponent('genres:' + genre)}`} title="Genre" class="link" data-sveltekit-reload>{genre}</a
					>
					{#if i < manga.genres.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
