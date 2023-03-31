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
