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
	if (term.startsWith('genres:')) {
		return await findByGenres(term.split('genres:')?.[1].split(','));
	}
	if (term.startsWith('authors:')) {
		return findByAuthors(term.split('authors:')?.[1].split(','));
	}

	console.log(`searching for: ${term}`);
	console.time('search took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.aggregate([
				{
					$search: {
						index: 'mangas-fuzzy',
						compound: {
							should: [
								{
									text: {
										query: term,
										path: 'title',
										score: {
											boost: {
												// path: 'viewsNumber',
												// undefined: 1,
												value: 2,
											},
										},
									},
								},
								{
									text: {
										query: term,
										path: 'alternativeTitles',
										score: {
											boost: {
												// path: 'viewsNumber',
												// undefined: 1,
												value: 2,
											},
										},
									},
								},
								{
									text: {
										query: term,
										path: 'authors',
										fuzzy: {},
									},
								},
							],
						},
					},
				},
				{
					$limit: 50,
				},
			])
			.toArray()) as unknown as Omit<ScrapedManga, 'description'>[];
		console.log({ results });
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('search took');
	}
}

async function findByAuthors(authors: string[]) {
	if (!authors?.length) return [];
	console.time('findByAuthors took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.find({ authors: { $all: authors } })
			.toArray()) as unknown as ScrapedManga[];
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('findByAuthors took');
	}
}

async function findByGenres(genres: string[]) {
	if (!genres?.length) return [];
	console.time('findByGenres took');
	try {
		const results = (await mongoClient
			.db('ereader-mangas')
			.collection('manga-meta')
			.find({ genres: { $all: genres } })
			.toArray()) as unknown as ScrapedManga[];
		return results.map((x) => scrapedMangaToManga(x));
	} catch (error) {
		console.error(error);
	} finally {
		console.timeEnd('findByGenres took');
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

function scrapedMangaToManga(scrapedManga: ScrapedManga): Manga {
	return {
		mangaId: 'manga-' + scrapedManga.id,
		authors: scrapedManga.authors,
		thumbnail: scrapedManga.picture,
		rating: scrapedManga.rating,
		title: scrapedManga.title,
		updated: scrapedManga.lastUpload,
		views: scrapedManga.views,
		genres: scrapedManga.genres,
	};
}
