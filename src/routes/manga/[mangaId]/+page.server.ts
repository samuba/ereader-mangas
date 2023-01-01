import { addFavorite, getFavorites, removeFavorite } from '$lib/cookies';
import { load as cheerioLoad } from 'cheerio';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url: { searchParams }, cookies }) => {
	const { mangaId } = params;

	if (searchParams.get('favorite') === 'true') addFavorite(cookies, mangaId);
	if (searchParams.get('unfavorite') === 'true') removeFavorite(cookies, mangaId);

	const page = await fetch(`https://chapmanganato.com/${mangaId}`, { mode: 'no-cors' }).then((x) => x.text());
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

	return {
		mangaId,
		title,
		chapters,
		thumbnail,
		userPosition: {
			lastChapter: cookies.get('chapter'),
			lastPage: cookies.get('page')
		},
		isFavorite: getFavorites(cookies).includes(mangaId.replace('manga-', '')),
		infoElements: [
			{
				label: 'Author',
				html: $('.info-author')
					.parent()
					.siblings()
					.first()
					.text()
					.split('-')
					.map((x) => `<a href="/?search=${encodeURIComponent(x)}">${x}</a>`)
					.join(' - ')
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
		]
	};
}) satisfies PageServerLoad;
