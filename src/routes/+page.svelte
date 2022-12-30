<script lang="ts">
	import NavMenu from '$lib/NavMenu.svelte';

	let searchTerm: string;

	async function search() {
		const res = await fetch('https://manganato.com/getstorysearchjson', {
			headers: {
				accept: 'application/json, text/javascript, */*; q=0.01',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7',
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-requested-with': 'XMLHttpRequest'
			},
			referrer: 'https://manganato.com/',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: `searchword=${searchTerm}`,
			method: 'POST',
			mode: 'no-cors',
			credentials: 'include'
		});
		console.log('res', await res.text());
	}

	const pinnedMangas = [
		{
			name: 'Chainsaw Man',
			id: 'manga-dn980422'
		},
		{
			name: 'The Fable',
			id: 'manga-cc980059'
		}
	];
</script>

<NavMenu />

<main class="container">
	<!-- <form on:submit|preventDefault={search}>
		<input type="search" bind:value={searchTerm} />

		<button type="submit">search</button>
	</form> -->

	<ul>
		{#each pinnedMangas as manga}
			<li>
				<a href={`/manga/${manga.id}`} data-sveltekit-reload>{manga.name}</a>
			</li>
		{/each}
	</ul>
</main>
