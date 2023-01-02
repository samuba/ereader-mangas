<script lang="ts">
	import MangaCard from '$lib/MangaCard.svelte';
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
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
