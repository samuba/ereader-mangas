import type { PageServerLoad } from './$types';
import { load as cheerioLoad } from 'cheerio';
import { refreshFavoritesCookie, setUsersLastPosition } from '$lib/cookies';
import { routes } from '$lib/routes';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, cookies, url, setHeaders }) => {
	const { origin } = url;
	const { mangaId, chapterId, pageId } = params;
	const pageNumber = Number(pageId);
	console.log({ mangaId, chapterId, pageId });

	setUsersLastPosition(cookies, mangaId, chapterId, pageId);
	refreshFavoritesCookie(cookies);

	const remotePageUrl = `https://chapmanganato.com/${mangaId}/${chapterId}`;
	const data = await fetch(origin + routes.scrapePage(remotePageUrl));
	if (!data.ok) {
		throw error(data.status, { message: `Could not scrape manga from source: ${data.statusText}` });
	}
	const pageContent = await data.text();
	if (pageContent.includes('PAGE NOT FOUND')) {
		throw error(404, { message: 'Could not find manga in source. Are you sure it exists?' });
	}
	const $ = cheerioLoad(pageContent);
	const imgUrls = $('.container-chapter-reader img')
		.map(function () {
			return $(this).attr('src');
		})
		.get();

	if (pageNumber > imgUrls.length) {
		throw error(400, { message: 'Manga Page does not exist' });
	}

	const chapterPrefix = chapterId.split('-')[0];
	const chapterNumber = Number(chapterId.split('-')[1]);

	setHeaders({ 'Cache-Control': `max-age=${60 * 60 * 24}, immutable` });
	return {
		mangaId,
		chapterId,
		pageId,
		imageNumber: pageNumber,
		nextPageUrl:
			pageNumber >= imgUrls.length - 1
				? routes.readPage(mangaId, `${chapterPrefix}-${chapterNumber + 1}`, '0')
				: routes.readPage(mangaId, chapterId, `${pageNumber + 1}`),
		previousPageUrl:
			pageNumber === 0
				? routes.readPage(mangaId, `${chapterPrefix}-${chapterNumber - 1}`, `${imgUrls.length - 1}`)
				: routes.readPage(mangaId, chapterId, `${pageNumber - 1}`),
		nextChapterUrl: routes.readPage(mangaId, `${chapterPrefix}-${chapterNumber + 1}`, `0`),
		previousChapterUrl: routes.readPage(mangaId, `${chapterPrefix}-${chapterNumber - 1}`, `0`),
		imgUrls,
		currentImageUrl: routes.scrapeImage(imgUrls[pageNumber], remotePageUrl),
		nextImageUrl: routes.scrapeImage(imgUrls[pageNumber + 1], remotePageUrl),
	};
}) satisfies PageServerLoad;
