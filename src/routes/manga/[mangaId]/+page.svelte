<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container">
	<br />
	<div class="grid">
		<h1>{data.title}</h1>
		<img src={data.thumbnail} alt="" />
		<br />
	</div>
	<ul>
		{#each data.chapters as chapter}
			<li>
				<a href={chapter.url} data-sveltekit-reload>{chapter.text}</a> | uploaded: {chapter.date}
				<br />
			</li>
		{/each}
	</ul>
</div>
