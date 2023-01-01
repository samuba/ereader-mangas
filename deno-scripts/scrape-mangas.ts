import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

console.time('finished after');
const startTime = new Date();
const fileName = './static/mangas.json';
const numberOfConcurrentFetches = 100;
type Manga = {
	mangaId: string;
	title: string;
	thumbnail: string;
	views: string;
	author: string;
	rating: number;
	updated: string;
};

const firstPage = 1;
let currentPage = firstPage;
let lastPage = 9999; // will be overriden

Deno.writeTextFileSync(fileName, '');

while (currentPage <= lastPage) {
	const mangas = [] as Manga[];
	console.log(`fetching pages ${currentPage} - ${currentPage + (numberOfConcurrentFetches - 1)}`);
	try {
		const fetches = [];
		for (let i = 0; i < numberOfConcurrentFetches; i++) {
			fetches.push(fetchContent(currentPage + i, lastPage));
		}
		const contents = await Promise.all(fetches);
		const cheerioContents = contents.map((x) => cheerio.load(x));

		let doAgain = false;
		cheerioContents.forEach(($) => {
			const newLastPage = Number($('.page-last').text().replace('LAST(', '').replace(')', ''));
			if (newLastPage === 0) {
				console.log('page content is invalid for page ' + currentPage + '. Trying again...');
				doAgain = true;
			}
			lastPage = newLastPage;
		});
		if (doAgain) continue;

		cheerioContents.forEach(($) => {
			$('.content-genres-item').map((_, el) => {
				mangas.push({
					title: $(el).find('.genres-item-name').text(),
					mangaId: $(el).find('.genres-item-name').attr('href')!.split('/').reverse()[0],
					thumbnail: $(el).find('.genres-item-img img').attr('src')!,
					views: $(el).find('.genres-item-view').text()!,
					author: $(el).find('.genres-item-author').text()!,
					rating: Number($(el).find('.genres-item-rate').text()!),
					updated: $(el).find('.genres-item-time').text()!
				});
			});
		});
		const previousContent = Deno.readTextFileSync(fileName);
		const previosJson = JSON.parse(previousContent ? previousContent : '[]');
		Deno.writeTextFileSync(fileName, JSON.stringify([...previosJson, ...mangas], null, 2));
		currentPage += numberOfConcurrentFetches;
	} catch (err) {
		console.log('problem fetching for page ' + currentPage + '. Trying again...', err);
		continue;
	}
}
console.log('\nfinished after ' + timeTillNow(startTime));
console.log(`fetched manga pages ${firstPage}-${lastPage}`);

const allMangas = JSON.parse(Deno.readTextFileSync(fileName));
const allMangasUnique = [...new Map(allMangas.map((x) => [x['mangaId'], x])).values()];
Deno.writeTextFileSync(fileName, JSON.stringify(allMangasUnique, null, 2));
console.log(`fetched ${allMangasUnique.length} unique mangas overall`);

async function fetchContent(currentPage: number, lastPage: number) {
	const fetchStart = new Date();
	try {
		const data = await fetch(`https://manganato.com/genre-all/${currentPage}?type=topview`, {
			mode: 'no-cors'
		});
		return await data.text();
	} finally {
		consoleLogSameLine(' fetch took ' + timeTillNow(fetchStart));
	}
}

function consoleLogSameLine(msg: string) {
	return Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(msg));
}

function timeTillNow(date: Date) {
	const remaining = new Date().getTime() - date.getTime();
	const remainingS = remaining / 1000;
	const remainingM = remainingS / 60;
	const remainingH = remainingM / 60;
	if (remainingS < 1) return `${remaining.toFixed(2)}ms`;
	if (remainingM < 1) return `${remainingS.toFixed(2)}s`;
	if (remainingH < 1) return `${remainingM.toFixed(2)}min`;
	return `${remainingM.toFixed(2)}h`;
}
