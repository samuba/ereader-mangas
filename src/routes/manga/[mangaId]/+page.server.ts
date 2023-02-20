import { addFavorite, getFavorites, removeFavorite } from '$lib/cookies';
import { routes } from '$lib/routes';
import { load as cheerioLoad } from 'cheerio';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url: { searchParams, origin }, cookies }) => {
	const { mangaId } = params;

	if (searchParams.get('favorite') === 'true') addFavorite(cookies, mangaId);
	if (searchParams.get('unfavorite') === 'true') removeFavorite(cookies, mangaId);

	console.time('fetch manga page');
	const page = await fetch(origin + routes.scrapePage(`https://chapmanganato.com/${mangaId}`)).then((x) => x.text());
	console.timeEnd('fetch manga page');

	console.time('parse manga page');
	const $ = cheerioLoad(page);
	const title = $('h1').text();
	const alternativeTitles = $('.info-alternative')
		.parent()
		.next()
		.text()
		.split(';')
		.map((x) => x.trim());
	const thumbnail = $('.info-image img').attr('src');
	const chapters = $('.row-content-chapter li')
		.map((_, el) => {
			const remoteUrl = $(el).find('a').attr('href')!;
			const chapterId = remoteUrl.split('/').reverse()[0];
			return {
				text: $(el).find('a').text(),
				url: `/manga/${mangaId}/${chapterId}/0`,
				date: $(el).find('.chapter-time').text(),
			};
		})
		.get();
	const infoElements = [
		{
			label: 'Author',
			html: $('.info-author')
				.parent()
				.siblings()
				.first()
				.text()
				.split('-')
				.map((x) => `<a href="/?search=authors:${encodeURIComponent(x.trim())}">${x}</a>`)
				.join(' - '),
		},
		{
			label: 'Status',
			html: $('.info-status').parent().siblings().first().toString(),
		},
		{
			label: 'Updated',
			html: $('.info-time').parent().siblings().first().toString(),
		},
		{
			label: 'Genres',
			html: $('.info-genres')
				.parent()
				.siblings()
				.first()
				.text()
				.split('-')
				.map((x) => `<a href="/?search=genres:${encodeURIComponent(x.trim())}">${x}</a>`)
				.join(' - '),
		},
		{
			label: 'Views',
			html: $('.info-view').parent().siblings().first().toString(),
		},
	];
	console.timeEnd('parse manga page');

	return {
		mangaId,
		title,
		alternativeTitles,
		chapters,
		thumbnail,
		userPosition: {
			lastChapter: cookies.get('chapter'),
			lastPage: cookies.get('page'),
		},
		isFavorite: getFavorites(cookies).includes(mangaId.replace('manga-', '')),
		infoElements,
	};
}) satisfies PageServerLoad;
