export const routes = {
	root: '/',
	manga: (mangaId: string) => `/manga/${mangaId}`,
	readPage: (mangaId: string, chapterId: string, pageId: string) => `/manga/${mangaId}/${chapterId}/${pageId}`,
	scrapeImage: (url: string) => `/scraping/image?url=${encodeURIComponent(url)}`,
	scrapePage: (url: string) => `/scraping/page?url=${encodeURIComponent(url)}`,
	warmCache: (urls: string[]) => `/scraping/warmCache?urls=${encodeURIComponent(JSON.stringify(urls))}`,
};
