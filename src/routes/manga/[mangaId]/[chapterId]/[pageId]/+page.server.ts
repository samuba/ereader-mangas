import type { PageServerLoad } from './$types';
import { load as cheerioLoad } from 'cheerio';
import { refreshFavoritesCookie, setUsersLastPosition } from '$lib/cookies';
import { routes } from '$lib/routes';

export const load = (async ({ params, cookies, url }) => {
	const { origin } = url;
	const { mangaId, chapterId, pageId } = params;
	const pageNumber = Number(pageId);
	console.log({ mangaId, chapterId, pageId });

	setUsersLastPosition(cookies, mangaId, chapterId, pageId);
	refreshFavoritesCookie(cookies);

	const remotePageUrl = `https://chapmanganato.com/${mangaId}/${chapterId}`;
	const data = await fetch(origin + routes.scrapePage(remotePageUrl));
	const $ = cheerioLoad(await data.text());
	const imgUrls = $('.container-chapter-reader img')
		.map(function () {
			return $(this).attr('src');
		})
		.get();

	const chapterPrefix = chapterId.split('-')[0];
	const chapterNumber = Number(chapterId.split('-')[1]);

	await fetch(
		url.origin +
			routes.warmCache([
				origin + routes.scrapeImage(imgUrls[pageNumber + 1], remotePageUrl),
				origin + routes.scrapeImage(imgUrls[pageNumber + 2], remotePageUrl),
				origin + routes.scrapeImage(imgUrls[pageNumber + 3], remotePageUrl),
			]),
	);

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
	};
}) satisfies PageServerLoad;
