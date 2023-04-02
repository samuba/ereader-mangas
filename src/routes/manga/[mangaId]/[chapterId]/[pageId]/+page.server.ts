import type { PageServerLoad } from './$types';
import { load as cheerioLoad } from 'cheerio';
import { refreshFavoritesCookie, setUsersLastPosition } from '$lib/cookies';
import { routes } from '$lib/routes';
import { error } from '@sveltejs/kit';
import { isClientEreader } from '$lib/common';

export const load = (async ({ params, cookies, url, setHeaders, request }) => {
	console.log('user-agent', request.headers.get('user-agent'));
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
	let title = $(`a[href="https://chapmanganato.com/${mangaId}"]`).first().text();
	title = title !== '' ? title : $(`a[href="https://manganato.com/${mangaId}"]`).first().text();
	const previousChapterId = $('.navi-change-chapter-btn-prev').attr('href')?.split('/')?.reverse()?.[0];
	const nextChapterId = $('.navi-change-chapter-btn-next').attr('href')?.split('/')?.reverse()?.[0];
	const isLastPageOfChapter = pageNumber >= imgUrls.length - 1;
	const isFirstPageOfChapter = pageNumber === 0;

	setHeaders({ 'Cache-Control': `max-age=${60 * 60 * 24}, immutable` });
	return {
		title,
		mangaId,
		chapterId,
		pageId,
		imageNumber: pageNumber,
		nextPageUrl: isLastPageOfChapter
			? nextChapterId
				? routes.readPage(mangaId, nextChapterId, '0')
				: undefined
			: routes.readPage(mangaId, chapterId, `${pageNumber + 1}`),
		previousPageUrl: isFirstPageOfChapter
			? previousChapterId
				? routes.readPage(mangaId, previousChapterId, `${imgUrls.length - 5}`) // dont know how many imgs last chapter had, just try to not get 404
				: undefined
			: routes.readPage(mangaId, chapterId, `${pageNumber - 1}`),
		nextChapterUrl: nextChapterId ? routes.readPage(mangaId, nextChapterId, `0`) : undefined,
		previousChapterUrl: previousChapterId ? routes.readPage(mangaId, previousChapterId, `0`) : undefined,
		imgUrls,
		currentImageUrl: routes.scrapeImage(imgUrls[pageNumber], remotePageUrl),
		nextImageUrl: routes.scrapeImage(imgUrls[pageNumber + 1], remotePageUrl),
		isEreader: isClientEreader(request.headers),
	};
}) satisfies PageServerLoad;
