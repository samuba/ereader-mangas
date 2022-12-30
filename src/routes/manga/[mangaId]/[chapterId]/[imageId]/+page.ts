import axios from 'axios';
import type { PageLoad } from './$types';
import cheerio from 'cheerio';

export const csr = false;

export const load = (async ({ params }) => {
	const { mangaId, chapterId, imageId } = params;
	const imageNumber = Number(imageId);

	console.log({ mangaId, chapterId, imageId });

	// Fetch HTML of the page we want to scrape
	const data = await fetch(`https://chapmanganato.com/${mangaId}/${chapterId}`, {
		mode: 'no-cors'
	});
	const $ = cheerio.load(await data.text());
	const imgUrls = $('.container-chapter-reader img')
		.map(function () {
			return $(this).attr('src');
		})
		.get();

	//console.log({imgUrls})
	const chapterPrefix = chapterId.split('-')[0];
	const chapterNumber = Number(chapterId.split('-')[1]);
	const nextPageUrl =
		imageNumber >= imgUrls.length - 1
			? `/manga/${mangaId}/${chapterPrefix}-${chapterNumber + 1}/0`
			: `/manga/${mangaId}/${chapterId}/${imageNumber + 1}`;

	return {
		mangaId,
		chapterId,
		imageId,
		imageNumber,
		nextPageUrl,
		imgUrls,
		currentImageUrl: `/image?url=${encodeURIComponent(imgUrls[imageNumber])}`
	};
}) satisfies PageLoad;
