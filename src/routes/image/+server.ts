import type { RequestHandler } from './$types';
import { fail } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	console.log({ imageUrl });
	if (!imageUrl) throw fail(400);
	const urlParts = imageUrl.split('.');
	const filetype = urlParts[urlParts.length - 1].toLowerCase();
	const data = await fetch(imageUrl, { headers: { Referer: 'https://chapmanganato.com/' } });

	return new Response(await data.blob(), {
		headers: { 'Content-Type': `image/${filetype}`, 'Cache-Control': `max-age=${60}, immutable` }
	});
}) satisfies RequestHandler;
