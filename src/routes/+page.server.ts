import type { PageServerLoad } from './$types';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';
import { create, search as searchWithLyra, insert } from '@lyrasearch/lyra';

let mangas = [] as ScrapedManga[];
const lyraDb = create({
	schema: {
		t: 'string',
		a: 'string'
	}
});

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
		searchResults: searchTerm ? search(searchTerm) : [],
		allMangasCount: mangas.length,
		favorites
	};
}) satisfies PageServerLoad;

async function fetchMangas(url: URL) {
	if (mangas.length != 0) return;
	console.time('fetch');
	mangas = await fetch(`${url.origin}/mangas.json`).then((x) => x.json());

	console.time('insertLyra');
	for (const manga of mangas) {
		// 600ms faster than insertBatch()
		insert(lyraDb, manga);
	}
	console.timeEnd('insertLyra');

	console.timeEnd('fetch');
}

async function search(term: string) {
	console.time('searchLyra');
	const results = searchWithLyra(lyraDb, {
		term,
		tolerance: 8,
		limit: 1000
	}).hits.map((x) => scrapedMangaToManga(x.document));
	console.timeEnd('searchLyra');

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
