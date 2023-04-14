export const routes = {
	root: '/',
	manga: (mangaId: string) => `/manga/${mangaId}`,
	readPage: (mangaId: string, chapterId: string, pageId: string) => `/manga/${mangaId}/${chapterId}/${pageId}`,
	scrapeImage: (url: string, referer: string) =>
		`https://img-proxy.szb.workers.dev/?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`,
	scrapePage: (url: string) => `/scraping/page?url=${encodeURIComponent(url)}`,
};
//  "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
