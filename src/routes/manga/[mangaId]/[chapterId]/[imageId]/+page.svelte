<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href={data.nextPageUrl}>
	<img src={data.currentImageUrl} style="height: 100%; width: 100%; object-fit: contain;" alt="n" />
</a>
<center style="display: flex; justify-content: center; ">
	<a href="/" style="padding-right:1rem;">Home</a>
	<a href={`/manga/${data.mangaId}`} style="padding-right:1rem;">Overview</a>
	<a href={data.nextPageUrl} style="padding-right:1rem;">Next Page</a>
	<a href={data.nextChapterUrl}>Next Chapter</a>
</center>
