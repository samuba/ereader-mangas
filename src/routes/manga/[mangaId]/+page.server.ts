import { load as cheerioLoad } from 'cheerio';
import type { PageServerLoad } from './$types';

const cookieItemSeperator = '-';

export const load = (async ({ params, url, cookies }) => {
	const { mangaId } = params;
	const shortMangaId = mangaId.replace('manga-', '');
	const markFavorite = url.searchParams.get('favorite') === 'true' ? true : false;
	const removeFavorite = url.searchParams.get('unfavorite') === 'true' ? true : false;
	let favorites = cookies.get('favorites') ?? '';

	if (markFavorite && !favorites.includes(shortMangaId)) {
		favorites += `${shortMangaId}${cookieItemSeperator}`;
		cookies.set('favorites', favorites, {
			path: `/`,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 999
		});
	}
	if (removeFavorite && favorites.includes(shortMangaId)) {
		favorites = favorites.replace(`${shortMangaId}${cookieItemSeperator}`, '');
		cookies.set('favorites', favorites, {
			path: `/`,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 999
		});
	}

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
	];

	return {
		mangaId,
		title,
		chapters,
		thumbnail,
		infoElements,
		isFavorite: favorites.includes(shortMangaId),
		userPosition: {
			lastChapter: cookies.get('chapter'),
			lastPage: cookies.get('page')
		}
	};
}) satisfies PageServerLoad;
