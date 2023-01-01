<script lang="ts">
	import { page } from '$app/stores';
	import NavMenu from '$lib/NavMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const order = Number($page.url.searchParams.get('order'));
</script>

<NavMenu />

<div class="container">
	Mangas: {data.mangas.length}
	<pre>
		{JSON.stringify(data.mangas, null, 2)}
	</pre>
	<!-- <ul style="margin-top: 24px;">
		{#each data.mangas as manga}
			<li style="margin-bottom: 12px;">
				<a href={'/manga/' + manga.mangaId} data-sveltekit-reload>{manga.title}</a>
			</li>
		{/each}
	</ul> -->
</div>
