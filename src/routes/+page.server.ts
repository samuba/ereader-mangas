import type { PageServerLoad } from './$types';
import Fuse from 'fuse.js';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';
import { create, search as searchWithLyra, insert } from '@lyrasearch/lyra';

let mangas = [] as ScrapedManga[];
let fuse: Fuse<ScrapedManga>;
const lyraDb = create({
	tokenizer: {},
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

	console.time('insertFuse');
	fuse = new Fuse(mangas as ScrapedManga[], {
		isCaseSensitive: false,
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ['t', 'a']
	});
	console.timeEnd('insertFuse');

	console.time('insertLyra');
	for (const manga of mangas) {
		// 600ms faster than insertBatch()
		insert(lyraDb, manga);
	}
	console.timeEnd('insertLyra');

	console.timeEnd('fetch');
}

async function searchLyra(term: string) {
	console.time('searchLyra');
	const results = searchWithLyra(lyraDb, {
		term,
		tolerance: 8,
		limit: 1000
	}).hits.map((x) => scrapedMangaToManga(x.document));
	console.timeEnd('searchLyra');
	console.log('searchLyra results', results.length);

	return results;
}

async function search(term: string) {
	const lyraResults = searchLyra(term);

	console.time('fuseSearch');
	const results = fuse.search(term).map((x) => ({
		...x,
		item: scrapedMangaToManga(x.item)
	}));
	console.timeEnd('fuseSearch');
	console.log('fuseSearch results', results.length);
	return lyraResults;
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
