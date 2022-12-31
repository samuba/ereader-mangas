import { load as cheerioLoad } from 'cheerio';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url }) => {
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
			const remoteUrl = $(el).find('a').attr('href')!;
			const chapterId = remoteUrl.split('/').reverse()[0];
			return {
				text: $(el).find('a').text(),
				url: `/manga/${mangaId}/${chapterId}/0`,
				date: $(el).find('.chapter-time').text()
			};
		})
		.get();
	if (Number(url.searchParams.get('order')) === 1) {
		chapters.reverse();
	}

	const infoElements = [
		{
			label: 'Author',
			html: $('.info-author').parent().siblings().first().children().first().toString()
		},
		{
			label: 'Status',
			html: $('.info-status').parent().siblings().first().toString()
		},
		{
			label: 'Updated',
			html: $('.info-time').parent().siblings().first().toString()
		},
		{
			label: 'Genres',
			html: $('.info-genres').parent().siblings().first().toString()
		},
		{
			label: 'Views',
			html: $('.info-view').parent().siblings().first().toString()
		}
	];

	return { title, chapters, thumbnail, infoElements };
}) satisfies PageServerLoad;
