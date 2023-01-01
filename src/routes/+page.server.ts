import type { PageServerLoad } from './$types';
import mangas from './mangas.json' assert { type: 'json' };
import Fuse from 'fuse.js';

export type Manga = {
	mangaId: string;
	title: string;
	thumbnail: string;
	views: string;
	author: string;
	rating: number;
	updated: string;
};

export const load = (async ({ url }) => {
	const search = url.searchParams.get('search');
	let searchResults: Fuse.FuseResult<Manga>[] | undefined;

	if (search) {
		const fuse = new Fuse(mangas as Manga[], {
			isCaseSensitive: false,
			shouldSort: true,
			minMatchCharLength: 3,
			threshold: 0.3,
			includeScore: true,
			keys: ['title', 'author']
		});
		searchResults = fuse.search(search);
	}

	return { search, searchResults, allMangasCount: (mangas as []).length };
}) satisfies PageServerLoad;
