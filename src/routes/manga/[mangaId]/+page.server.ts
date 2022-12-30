import { error } from '@sveltejs/kit';
import { load as cheerioLoad } from 'cheerio';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { mangaId } = params;
	const data = await fetch(`https://chapmanganato.com/${mangaId}`, {
		mode: 'no-cors'
	});
	const page = await data.text();
	// console.log({ page });
	const $ = cheerioLoad(page);
	const title = $('h1').text();
	const thumbnail = $('.info-image img').attr('src');
	const chapters = $('.row-content-chapter li')
		.map((_, el) => {
			const remoteUrl = $(el).find('a').attr('href');
			const chapterId = remoteUrl.split('/').reverse()[0];
			return {
				text: $(el).find('a').text(),
				url: `/manga/${mangaId}/${chapterId}/0`,
				date: $(el).find('.chapter-time').text()
			};
		})
		.get();
	return { title, chapters, thumbnail };
}) satisfies PageServerLoad;
