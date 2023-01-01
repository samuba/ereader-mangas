import type { PageServerLoad } from './$types';
import { load as cheerioLoad } from 'cheerio';
import { refreshFavoritesCookie, setUsersLastPosition } from '$lib/cookies';

export const load = (async ({ params, cookies }) => {
	const { mangaId, chapterId, pageId } = params;
	const imageNumber = Number(pageId);
	console.log({ mangaId, chapterId, pageId });

	setUsersLastPosition(cookies, mangaId, chapterId, pageId);
	refreshFavoritesCookie(cookies);

	const data = await fetch(`https://chapmanganato.com/${mangaId}/${chapterId}`, {
		mode: 'no-cors'
	});
	const $ = cheerioLoad(await data.text());
	const imgUrls = $('.container-chapter-reader img')
		.map(function () {
			return $(this).attr('src');
		})
		.get();

	const chapterPrefix = chapterId.split('-')[0];
	const chapterNumber = Number(chapterId.split('-')[1]);
	const nextPageUrl =
		imageNumber >= imgUrls.length - 1
			? `/manga/${mangaId}/${chapterPrefix}-${chapterNumber + 1}/0`
			: `/manga/${mangaId}/${chapterId}/${imageNumber + 1}`;
	const previousPageUrl =
		imageNumber === 0
			? `/manga/${mangaId}/${chapterPrefix}-${chapterNumber - 1}/${imgUrls.length - 1}`
			: `/manga/${mangaId}/${chapterId}/${imageNumber - 1}`;
	const nextChapterUrl = `/manga/${mangaId}/${chapterPrefix}-${chapterNumber + 1}/0`;
	const previousChapterUrl = `/manga/${mangaId}/${chapterPrefix}-${chapterNumber - 1}/0`;

	return {
		mangaId,
		chapterId,
		pageId,
		imageNumber,
		nextPageUrl,
		previousPageUrl,
		nextChapterUrl,
		previousChapterUrl,
		imgUrls,
		currentImageUrl: `/image?url=${encodeURIComponent(imgUrls[imageNumber])}`
	};
}) satisfies PageServerLoad;
