import type { Cookies } from '@sveltejs/kit';

const cookieItemSeperator = '-';
const maxAge = 60 * 60 * 24 * 999;
const sameSite = 'strict';

///
/// Favorites
///
export function getFavorites(cookies: Cookies) {
	const cookieStr = cookies.get('favorites') ?? '';
	if (!cookieStr) return [];
	return cookieStr.split('-').map((x) => x);
}

export function addFavorite(cookies: Cookies, mangaId: string) {
	let favorites = cookies.get('favorites') ?? '';
	if (favorites.includes(shortMangaId(mangaId))) return;
	favorites += `${shortMangaId(mangaId)}${cookieItemSeperator}`;
	cookies.set('favorites', favorites, {
		path: `/`,
		maxAge,
		sameSite,
	});
}

export function removeFavorite(cookies: Cookies, mangaId: string) {
	let favorites = cookies.get('favorites') ?? '';
	favorites = favorites.replace(`${shortMangaId(mangaId)}${cookieItemSeperator}`, '');
	cookies.set('favorites', favorites, {
		path: `/`,
		maxAge,
		sameSite,
	});
}

export function refreshFavoritesCookie(cookies: Cookies) {
	// refresh these every time so they do not get lost if somebody does not modify them for some time
	cookies.set('favorites', cookies.get('favorites') ?? '', {
		path: `/`,
		maxAge,
		sameSite,
	});
}

///
/// User position
///
export function setUsersLastPosition(cookies: Cookies, mangaId: string, chapterId: string, pageId: string) {
	cookies.set('chapter', chapterId, {
		path: `/manga/${mangaId}`,
		maxAge,
		sameSite,
	});
	cookies.set('page', pageId, {
		path: `/manga/${mangaId}`,
		maxAge,
		sameSite,
	});
}

export function shortMangaId(mangaId: string) {
	return mangaId.replace('manga-', '');
}
