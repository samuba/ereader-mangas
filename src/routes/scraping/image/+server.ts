import type { RequestHandler } from './$types';
import { fail } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	console.log({ imageUrl });
	if (!imageUrl) throw fail(400);
	const urlParts = imageUrl.split('.');
	const filetype = urlParts[urlParts.length - 1].toLowerCase();
	const data = await fetch(imageUrl, { headers: { Referer: new URL(imageUrl).origin } });

	if (!data.ok || !data.headers.get('Content-Type')?.includes('image')) {
		throw fail(502, { msg: `Error getting image from ${imageUrl}.\n${await data.text()}` });
	}

	const cachedMonths = 1 * 30 * 24 * 60 * 60;
	return new Response(data.body, {
		headers: {
			'Content-Type': `image/${filetype}`,
			'Cache-Control': `max-age=${cachedMonths}, immutable`,
		},
	});
}) satisfies RequestHandler;
