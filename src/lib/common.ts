export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function switchAllClassesToNoEreader() {
	const all = document.getElementsByTagName('*');
	for (let i = 0, max = all.length; i < max; i++) {
		const element = all[i];
		if (!element.className) continue;
		element.className = element.className.replace(/-ereader/g, '-noereader');
	}
}
