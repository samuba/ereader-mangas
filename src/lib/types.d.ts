export type ScrapedManga = {
	id: string;
	title: string;
	picture: string;
	views: string;
	authors: string[];
	rating: number;
	lastUpload: string;
	status: string;
	genres: string[];
	alternativeTitles: string[];
	chapters: Chapter[];
};

export type Chapter = {
	name: string;
	time: string;
	slug: string;
};

export type Manga = {
	mangaId: string;
	title: string;
	thumbnail: string;
	views: string;
	authors: string[];
	rating: number;
	updated: string;
	genres: string[];
};
