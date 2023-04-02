import { browser } from '$app/environment';

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// WARNING: does not work with SVGs there are ways to change SVG classes but the browser will not apply the css for these classes. very weird
// use `div :global(.buttons-ereader)` to prevent svelte unused style purging
export function switchAllEreaderClassesToNoEreader() {
	const all = document.querySelectorAll('[ class*="-ereader" ]');
	for (let i = 0, max = all.length; i < max; i++) {
		const element = all[i];
		if (element.className?.replace) {
			element.className = element.className.replace(/-ereader/g, '-noereader');
		}
	}
}

function tailwindCssScreenSize() {
	if (!browser) return '?';
	if (document?.documentElement?.clientWidth >= 1536) return '2xl';
	if (document?.documentElement?.clientWidth >= 1280) return 'xl';
	if (document?.documentElement?.clientWidth >= 1024) return 'lg';
	if (document?.documentElement?.clientWidth >= 768) return 'md';
	if (document?.documentElement?.clientWidth >= 640) return 'sm';
	return 'sm';
}

export const isPhone = () => tailwindCssScreenSize() === 'sm';
export const isBigScreen = () => document?.documentElement?.clientWidth >= 768;

export function isClientEreader(requestHeaders: Headers) {
	// Kindle user agent: Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+
	return requestHeaders.get('user-agent')?.includes('kindle');
}
