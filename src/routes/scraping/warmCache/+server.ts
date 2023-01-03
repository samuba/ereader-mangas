import { sleep } from '$lib/common';
import type { RequestHandler } from './$types';
export const GET = (async ({ url: { searchParams } }) => {
	const urls = JSON.parse(searchParams.get('urls') ?? '[]');
	console.time('warmCache');
	try {
		const controller = new AbortController();
		const { signal } = controller;
		urls.forEach((url) => fetch(url, { signal }).catch(() => null));
		await sleep(100);
		controller.abort();
	} catch (error) {
		// don't care
	}
	console.timeEnd('warmCache');

	return new Response();
}) satisfies RequestHandler;
