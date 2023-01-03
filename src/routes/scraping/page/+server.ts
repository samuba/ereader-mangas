import type { RequestHandler } from './$types';
import { fail } from '@sveltejs/kit';

// this only exists for caching of the scrapped pages

export const GET = (async ({ url }) => {
	const pageUrl = url.searchParams.get('url');
	if (!pageUrl) throw fail(400);
	const data = await fetch(pageUrl, {
		headers: {
			Referer: pageUrl,
			cookie: `content_server=server2`, // server2 seems to be faster
		},
	});

	if (!data.ok || !data.headers.get('Content-Type')?.includes('html')) {
		throw fail(502, { msg: `Error getting page from ${pageUrl}.\n${await data.text()}` });
	}

	const cachedHours = 12 * 60 * 60;
	return new Response(data.body, {
		headers: {
			'Content-Type': `text/html`,
			'Cache-Control': `max-age=${cachedHours}, immutable`,
		},
	});
}) satisfies RequestHandler;
