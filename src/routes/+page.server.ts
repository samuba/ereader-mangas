import type { PageServerLoad } from './$types';
import mangas from './mangas.json' assert { type: 'json' };
import Fuse from 'fuse.js';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';

export const load = (async ({ url, cookies }) => {
	const searchTerm = url.searchParams.get('search');
	const favorites = [] as Manga[];
	getFavorites(cookies).forEach((x) => {
		const manga = (mangas as ScrapedManga[]).find((y) => y.i === x);
		if (manga) favorites.push(scrapedMangaToManga(manga));
	});

	return {
		search: searchTerm,
		searchResults: searchTerm ? search(searchTerm) : ([] as Fuse.FuseResult<Manga>[]),
		allMangasCount: (mangas as []).length,
		favorites
	};
}) satisfies PageServerLoad;

function search(term: string) {
	const fuse = new Fuse(mangas as ScrapedManga[], {
		isCaseSensitive: false,
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ['t', 'a']
	});
	return fuse.search(term).map((x) => ({
		...x,
		item: scrapedMangaToManga(x.item)
	}));
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
