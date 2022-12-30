<script lang="ts">
	import cheerio from 'cheerio';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href={data.nextPageUrl}>
	<img src={data.currentImageUrl} style="height: 100%; width: 100%; object-fit: contain;" alt="n" />
</a>
<center style="display: flex; justify-content: center; ">
	<a href="/" style="padding-right:1rem;">Home</a>
	<a href="/">Overview</a>
</center>
