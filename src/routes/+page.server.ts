import type { PageServerLoad } from './$types';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';
import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

const mongoClient = new MongoClient(MONGODB_URI);

export const load = (async ({ url, cookies }) => {
	const searchTerm = url.searchParams.get('search');
	const favoriteMangaIds = getFavorites(cookies);

	const favorites = [] as Manga[];
	for (const favoriteId of favoriteMangaIds) {
		const manga = await findById(favoriteId);
		if (manga) favorites.push(manga);
	}

	return {
		search: searchTerm,
		searchResults: searchTerm ? await search(searchTerm) : [],
		allMangasCount: await mangaCount(),
		favorites,
	};
}) satisfies PageServerLoad;

async function search(term: string) {
	console.time('search took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.find({ $text: { $search: term } }, { score: { $meta: 'textScore' } })
			.sort({ score: { $meta: 'textScore' } })
			.toArray()) as unknown as ScrapedManga[];
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	}
	console.timeEnd('search took');
}

async function findById(mangaId: string) {
	try {
		const result = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.findOne({ id: mangaId })) as unknown as ScrapedManga;
		if (!result) return undefined;
		return scrapedMangaToManga(result);
	} catch (error) {
		console.error(error);
	}
}

async function mangaCount() {
	try {
		return await mongoClient.db('ereader-mangas').collection('manga-meta').count();
	} catch (error) {
		console.error(error);
	}
}

function scrapedMangaToManga(scrapedManga: ScrapedManga) {
	console.log({ scrapedManga });
	return {
		mangaId: 'manga-' + scrapedManga.id,
		author: scrapedManga.author,
		thumbnail: scrapedManga.picture,
		rating: scrapedManga.rating,
		title: scrapedManga.title,
		updated: scrapedManga.lastUpload,
		views: scrapedManga.views,
	};
}
