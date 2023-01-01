import type { PageServerLoad } from './$types';
import { load as cheerioLoad } from 'cheerio';

export const load = (async ({ params }) => {
	console.log('scraping...');
	console.time('scraping.');
	const mangas = [] as { mangaId: string; title: string }[];
	let lastPage = 2; // will be overriden
	let currentPage = 1;
	while (currentPage <= lastPage) {
		const data = await fetch(`https://manganato.com/genre-all/${currentPage}`, {
			mode: 'no-cors'
		});
		const $ = cheerioLoad(await data.text());
		lastPage = 100; //Number($('.page-last').text());

		$('.genres-item-name').map((_, el) => {
			mangas.push({
				mangaId: $(el).attr('href')!.split('/').reverse()[0],
				title: $(el).text()
			});
		});
		currentPage++;
	}

	// console.log({ mangas });
	console.timeEnd('scraping.');

	return {
		mangas
	};
}) satisfies PageServerLoad;
