import type { RequestHandler } from './$types';
import { fail } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	console.log({ imageUrl });
	if (!imageUrl) throw fail(400);
	const urlParts = imageUrl.split('.');
	const filetype = urlParts[urlParts.length - 1].toLowerCase();
	const data = await fetch(imageUrl, { headers: { Referer: 'https://chapmanganato.com/' } });
	const cachedMonths = 12 * 30 * 24 * 60 * 60;
	return new Response(data.body, {
		headers: {
			'Content-Type': `image/${filetype}`,
			'Cache-Control': `max-age=${cachedMonths}, immutable`
		}
	});
}) satisfies RequestHandler;
