export type ScrapedManga = {
	i: string; //id
	t: string; //title
	p: string; //picture
	v: string; //views
	a: string; //author
	r: number; //rating
	u: string; //updated
};

export type Manga = {
	mangaId: string;
	title: string;
	thumbnail: string;
	views: string;
	author: string;
	rating: number;
	updated: string;
};
