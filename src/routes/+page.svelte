<script lang="ts">
	import MangaCard from '$lib/MangaCard.svelte';
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
			class="block w-full rounded-md border border-gray-700 bg-gray-700 text-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-white sm:text-sm"
			placeholder="Search"
			type="search"
		/>
	</form>
</NavMenu>

<div class="px-5">
	<ul role="list" class="mt-3 mx-auto max-w-6xl">
		{#each data.searchResults as manga (manga.mangaId)}
			<MangaCard2 {manga} />
		{/each}
	</ul>
</div>

<main class="container">
	<center>
		{#if data.searchResults}
			Found {data.searchResults.length} Mangas out of {data.allMangasCount}
		{/if}
	</center>

	{#if data.searchResults}
		<div>
			{#each data.searchResults as manga (manga.mangaId)}
				<MangaCard {manga} />
			{/each}
		</div>
	{/if}

	<h2>★ Favorites</h2>
	<div>
		{#each data.favorites as manga}
			<MangaCard {manga} />
		{/each}
	</div>
</main>
