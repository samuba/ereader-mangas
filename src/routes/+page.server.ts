import type { PageServerLoad } from './$types';
import type { Manga, ScrapedManga } from '$lib/types';
import { getFavorites } from '$lib/cookies';
import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

const mongoClient = new MongoClient(MONGODB_URI);

export const load = (async ({ url, cookies }) => {
	const searchTerm = url.searchParams.get('search');
	return {
		search: searchTerm,
		searchResults: searchTerm ? await search(searchTerm) : [],
		allMangasCount: await mangaCount(),
		favorites: await findByIds(getFavorites(cookies)),
	};
}) satisfies PageServerLoad;

async function search(term: string) {
	console.time('search took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.aggregate([
				{
					$search: {
						index: 'mangas-fuzzy',
						text: {
							query: term,
							path: { wildcard: '*' },
							fuzzy: {},
						},
					},
				},
				{
					$limit: 50,
				},
			])
			.toArray()) as unknown as ScrapedManga[];
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('search took');
	}
}

async function findByIds(mangaIds: string[]) {
	if (!mangaIds?.length) return [];
	console.time('findById took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.find({ $or: mangaIds.filter((x) => x).map((x) => ({ id: x })) })
			.toArray()) as unknown as ScrapedManga[];
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('findById took');
	}
}

async function mangaCount() {
	console.time('count took');
	try {
		return await mongoClient.db('ereader-mangas').collection('manga-meta').count();
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('count took');
	}
}

function scrapedMangaToManga(scrapedManga: ScrapedManga) {
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
