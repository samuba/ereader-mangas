<script lang="ts">
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import StarIcon from '$lib/icons/StarIcon.svelte';
	import MangaCard2 from '$lib/MangaCard2.svelte';
	import NavMenu from '$lib/NavMenu.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>eReader Mangas</title>
</svelte:head>

<NavMenu>
	<form slot="search-input">
		<input
			value={data.search}
			id="search"
			name="search"
			class="block w-full rounded-md border border-indigo-300 bg-indigo-300 text-indigo-900 py-2 pl-10 pr-3 text-sm placeholder-indigo-900 focus:border-indigo-200  focus:placeholder-indigo-500 focus:outline-none focus:ring-indigo-200 sm:text-sm"
			placeholder="Search"
			type="search"
		/>
	</form>
</NavMenu>

<main class="w-full px-5">
	<div class="mt-3 mx-auto lg:max-w-[68rem] max-w-[34rem]">
		{#if data.searchResults && data.search}
			<h2 class="text-2xl text-indigo-900 mb-4 mt-6">
				<SearchIcon class="h-7 w-7 inline-block text-indigo-800" />
				Found {data.searchResults.length} Mangas out of {data.allMangasCount}
			</h2>
		{/if}
		{#each data.searchResults as manga (manga.mangaId)}
			<MangaCard2 {manga} />
		{/each}

		<h2 class="text-2xl text-indigo-900 mb-4 mt-8 ">
			<StarIcon class="h-7 w-7 inline-block text-indigo-800" />
			Favorites
		</h2>
		{#each data.favorites as manga}
			<MangaCard2 {manga} />
		{/each}
	</div>
</main>
