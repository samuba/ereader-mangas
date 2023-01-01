import type { PageServerLoad } from './$types';
import mangas from './mangas.json' assert { type: 'json' };
import Fuse from 'fuse.js';

export const load = (async ({ url }) => {
	const search = url.searchParams.get('search');
	let searchResults = [] as Fuse.FuseResult<Manga>[];

	if (search) {
		const fuse = new Fuse(mangas as ScrapedManga[], {
			isCaseSensitive: false,
			shouldSort: true,
			minMatchCharLength: 3,
			threshold: 0.3,
			keys: ['t', 'a']
		});
		searchResults = fuse.search(search).map((x) => ({
			...x,
			item: {
				mangaId: 'manga-' + x.item.i,
				author: x.item.a,
				thumbnail: x.item.p,
				rating: x.item.r,
				title: x.item.t,
				updated: x.item.u,
				views: x.item.v
			}
		}));
	}

	return {
		search,
		searchResults,
		allMangasCount: (mangas as []).length
	};
}) satisfies PageServerLoad;

type ScrapedManga = {
	i: string; //id
	t: string; //title
	p: string; //picture
	v: string; //views
	a: string; //author
	r: number; //rating
	u: string; //updated
};

type Manga = {
	mangaId: string;
	title: string;
	thumbnail: string;
	views: string;
	author: string;
	rating: number;
	updated: string;
};
