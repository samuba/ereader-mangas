import type { PageServerLoad } from './$types';
import Fuse from 'fuse.js';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';

let mangas = [] as ScrapedManga[];

export const load = (async ({ url, cookies }) => {
	const searchTerm = url.searchParams.get('search');
	const favorites = [] as Manga[];

	await fetchMangas(url);
	getFavorites(cookies).forEach((x) => {
		const manga = (mangas as ScrapedManga[]).find((y) => y.i === x);
		if (manga) favorites.push(scrapedMangaToManga(manga));
	});

	return {
		search: searchTerm,
		searchResults: searchTerm ? search(searchTerm) : ([] as Fuse.FuseResult<Manga>[]),
		allMangasCount: mangas.length,
		favorites
	};
}) satisfies PageServerLoad;

async function fetchMangas(url: URL) {
	if (mangas.length != 0) return;
	console.time('fetch');
	mangas = await fetch(`${url.origin}/mangas.json`).then((x) => x.json());
	console.timeEnd('fetch');
}

async function search(term: string) {
	console.time('search');
	const fuse = new Fuse(mangas as ScrapedManga[], {
		isCaseSensitive: false,
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ['t', 'a']
	});
	const results = fuse.search(term).map((x) => ({
		...x,
		item: scrapedMangaToManga(x.item)
	}));
	console.timeEnd('search');
	return results;
}

function scrapedMangaToManga(scrapedManga: ScrapedManga) {
	return {
		mangaId: 'manga-' + scrapedManga.i,
		author: scrapedManga.a,
		thumbnail: scrapedManga.p,
		rating: scrapedManga.r,
		title: scrapedManga.t,
		updated: scrapedManga.u,
		views: scrapedManga.v
	};
}
