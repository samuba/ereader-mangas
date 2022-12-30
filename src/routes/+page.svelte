<script lang="ts">
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
</script>

<main class="container">
	<br />
	<h1>ereader-mangas</h1>

	<!-- <form on:submit|preventDefault={search}>
		<input type="search" bind:value={searchTerm} />

		<button type="submit">search</button>
	</form> -->

	<a href="/manga/manga-dn980422" data-sveltekit-reload>Chainsaw Man</a>
</main>
