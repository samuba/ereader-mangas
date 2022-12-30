import type { RequestHandler } from './$types';
import axios from 'axios';
import { fail } from '@sveltejs/kit';

axios.defaults.headers.common['Referer'] = 'https://chapmanganato.com/';

export const GET = (async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	console.log({ imageUrl });
	if (!imageUrl) throw fail(400);
	const urlParts = imageUrl.split('.');
	const filetype = urlParts[urlParts.length - 1].toLowerCase();

	const { data } = await axios.get(url, { responseType: 'arraybuffer' });

	// TODO do not go over glitch me for this
	// const data = await fetch(`https://mangas-for-ereaders.glitch.me/image?url=${imageUrl}`, {
	// 	headers: {
	// 		accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
	// 		'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7',
	// 		'sec-fetch-dest': 'image',
	// 		'sec-fetch-mode': 'no-cors',
	// 		'sec-fetch-site': 'cross-site'
	// 	},
	// 	referrer: 'https://chapmanganato.com/',
	// 	referrerPolicy: 'strict-origin-when-cross-origin',
	// 	method: 'GET',
	// 	mode: 'no-cors',
	// 	credentials: 'omit'
	// });

	return new Response(await data, { headers: { 'Content-Type': `image/${filetype}` } });
}) satisfies RequestHandler;

// fastify.get('/image', async function (request, reply) {
// 	const { url } = request.query;
// 	const urlParts = url.split('.');
// 	const filetype = urlParts[urlParts.length - 1].toLowerCase();
// 	try {
// 		const { data } = await axios.get(url, { responseType: 'arraybuffer' });
// 		return reply.type(`image/${filetype}`).send(data);
// 	} catch (err) {
// 		console.error(err);
// 	}
// });
