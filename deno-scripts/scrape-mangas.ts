import * as cheerio from 'npm:cheerio@1.0.0-rc.12';
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import type { ScrapedManga } from '../src/lib/types.d.ts';

const startTime = new Date();
const allMangasUnique2 = await fetchShallowMangaList();
const allDetailedMangas = [] as ScrapedManga[];
const batchSize = 120;
const count = allMangasUnique2.length;
let processedItems = 0;
do {
	console.time('batch');
	const batch = allMangasUnique2.filter(
		(x) => (allMangasUnique2.indexOf(x) + 1) < (processedItems + batchSize) && (allMangasUnique2.indexOf(x) + 1) > processedItems,
	);
	const detailedMangas = await Promise.all(batch.map((x) => getMangaDetails(x)));
	detailedMangas.forEach((x) => allDetailedMangas.push(x));
	console.timeEnd('batch');

	processedItems += batch.length;
	console.time('fileWrite');
	Deno.writeTextFile('detailed.json', JSON.stringify(allDetailedMangas, null, 2));
	console.timeEnd('fileWrite');
	console.log(`processed ${processedItems} of ${allMangasUnique2.length} mangas\n`);
} while (processedItems < count);

await updateMongo(allDetailedMangas);

console.log(`finished everything after: ${timeTillNow(startTime)}`)
Deno.exit();


//
// Functions
//

async function fetchShallowMangaList(): Promise<ScrapedManga[]> {
	console.log("fetchShallowMangaList...")
	const fileName = "shallow.json"
	// if (await fileExists(fileName)) return JSON.parse(Deno.readTextFileSync(fileName))
	console.time("fetchShallowMangaList took")
	const firstPage = 1;
	let currentPage = firstPage;
	let lastPage = 9999; // will be overriden
	const numberOfConcurrentFetches = 100;
	const mangas = new Map<string, ScrapedManga>
	while (currentPage <= lastPage) {
		const timeStr = `fetching pages ${currentPage} - ${currentPage + (numberOfConcurrentFetches - 1)} took`
		console.time(timeStr);
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
					const id = $(el).find('.genres-item-name').attr('href')!.split('/').reverse()[0].split('-')[1];
					mangas.set(id, {
						id,
						title: $(el).find('.genres-item-name').text(),
						picture: $(el).find('.genres-item-img img').attr('src')!,
						views: $(el).find('.genres-item-view').text()!,
						viewsNumber: viewsToNumber($(el).find('.genres-item-view').text()!),
						author: $(el).find('.genres-item-author').text()!,
						rating: Number($(el).find('.genres-item-rate').text()!),
						lastUpload: $(el).find('.genres-item-time').text()!,
					});
				});
			});
			currentPage += numberOfConcurrentFetches;
		} catch (err) {
			console.log('problem fetching for page ' + currentPage + '. Trying again...', err);
			continue;
		}
		console.timeEnd(timeStr)
	}
	const result = [...mangas.values()]
	Deno.writeTextFile(fileName, JSON.stringify(result, null, 2));
	console.timeEnd("fetchShallowMangaList took")
	return result;
}

function viewsToNumber(views: string) {
	// for e.g.  45M, 23K, ...
	if (views === null || views === undefined) return undefined;
	if (views.includes('K')) return Number(views.split('K')[0]) * 1_000;
	if (views.includes('M')) return Number(views.split('M')[0]) * 1_000_000;
	return Number(views);
}

async function fileExists(filename: string): Promise<boolean> {
  try {
    await Deno.stat(filename);
    return true; // successful, file or directory must exist
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false; // file or directory does not exist
    } else {
      throw error; // unexpected error, maybe permissions, pass it along
    }
  }
}

async function getMangaDetails(manga: ScrapedManga, retries = 0) {
	const fetchStart = new Date();
	try {
		const data = await fetch(`https://chapmanganato.com/manga-${manga.id}`);
		const html = await data.text();
		const $ = cheerio.load(html);
		const status = $('.info-status').parent().next().text();
		const authors = $('.info-author').parent().next().children().map((_, el) => $(el).text()).toArray();
		const genres = $('.info-genres').parent().next().children().map((_, el) => $(el).text()).toArray();
		const alternativeTitles = $('.info-alternative').parent().next().text().split(';').map((x) => x.trim().replace(/\(.*\)/, '')); // remove  "... (english)"
		const description = $('.panel-story-info-description').text().replace('Description :', '').trim();
		delete manga.author;
		return {
			...manga,
			status,
			authors,
			genres,
			alternativeTitles,
			description,
		};
	} catch (error) {
		if (retries < 19) {
			console.error(`error while fetching. retrying round ${retries}...`);
			return getMangaDetails(manga, retries++)
		} else {
			throw new Error("too many retries", error)
		}
	}
}

async function fetchContent(currentPage: number, lastPage: number) {
	const data = await fetch(`https://manganato.com/genre-all/${currentPage}?type=topview`);
	return await data.text();
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

async function updateMongo(mangas: ScrapedManga[]) {
	console.time(`inserting ${mangas.length} to mongo took`);
	const client = new MongoClient();
	try {
		await client.connect(config()['MONGO_URL_DENO']);
		console.log('Connected to mongo');
		const collection = client.database('ereader-mangas').collection('manga-meta');
		await collection.delete({});

		const batchSize = 1000;
		let processedItems = 0;
		do {
			const batch = mangas.filter((x) => (mangas.indexOf(x) + 1) < (processedItems + batchSize) && (mangas.indexOf(x) + 1) > processedItems)
			await collection.insertMany(batch);
			processedItems += batch.length
			console.log(`inserted ${processedItems}`)
		} while(processedItems < mangas.length)
	} catch (error) {
		console.error(error);
	} finally {
		client.close();
		console.timeEnd(`inserting ${mangas.length} to mongo took`);
	}
}
