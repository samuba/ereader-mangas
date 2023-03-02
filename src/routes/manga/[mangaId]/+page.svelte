<script lang="ts">
	import { page } from '$app/stores';
	import StarIcon from '$lib/icons/StarIcon.svelte';
	import NavMenu from '$lib/NavMenu.svelte';
	import { routes } from '$lib/routes';
	import type { PageData } from './$types';

	export let data: PageData;

	const order = Number($page.url.searchParams.get('order'));
</script>

<NavMenu />

<svelte:head>
	<title>{data.title} | Overview</title>
</svelte:head>

<div class="mx-auto w-fit px-4">
	<div class="mt-10 md:flex block">
		<div class="inline-block align-top">
			<img src={data.thumbnail} class=" max-h-[23rem] max-w-[17rem] object-cover h-[26rem] mr-4 sm:mr-8" />
		</div>
		<div class="inline-block align-top text-gray-900 max-w-2xl leading-snug">
			<h1 class="text-4xl text-indigo-900">{data.title}</h1>
			<h6 style="text-sm" title="alternative titles">{data.alternativeTitles.join(', ')}</h6>
			<div class="mt-4">
				{#each data.authors as author, authorIndex}
					<a href={`/?search=${encodeURIComponent('authors:' + author)}`} title="Author" class="link" data-sveltekit-reload>
						{author}
					</a>
					{#if authorIndex < data.authors.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>

			<div class="whitespace-normal mt-4">
				{#each data.genres as genre, i}
					<a href={`/?search=${encodeURIComponent('genres:' + genre)}`} title="Genre" class="link" data-sveltekit-reload
						>{genre}</a
					>
					{#if i < data.genres.length - 1}
						<span class="pr-1">-</span>
					{/if}
				{/each}
			</div>

			<div class="mt-4">
				<span>
					Updated: {data.lastUpdate}
				</span>
				<span class="ml-4">
					{data.rating}
					<StarIcon class="inline h-4 align-middle" />
				</span>
				<span class="ml-4">
					{data.views} Views
				</span>
			</div>

			<div class="mt-4">
				{data.description}
			</div>

			<div class="mt-4">
				{#if data.userPosition.lastPage && data.userPosition.lastChapter}
					<a
						href={routes.readPage(data.mangaId, data.userPosition.lastChapter, data.userPosition.lastPage)}
						role="button"
						class="border-indigo-900 bg-white border rounded px-4 py-2 mr-4 inline-block"
					>
						<b> ▶&nbsp;&nbsp; Continue </b>
					</a>
				{:else}
					<a
						href={routes.readPage(data.mangaId, 'chapter-1', '0')}
						role="button"
						class="border-indigo-900 bg-white border rounded px-4 py-2 mr-4 inline-block"
					>
						<b> ▶&nbsp;&nbsp; Read </b>
					</a>
				{/if}
				{#if data.isFavorite}
					<a href="?unfavorite=true" class="border-indigo-900 bg-white border rounded px-4 py-2 mr-4 inline-block" role="button">
						<b> ★&nbsp;&nbsp; Remove Favorite </b>
					</a>
				{:else}
					<a href="?favorite=true" class="border-indigo-900 bg-white border rounded px-4 py-2 mr-4 inline-block" role="button">
						<b> ☆&nbsp;&nbsp; Add Favorite </b>
					</a>
				{/if}
			</div>
		</div>
	</div>

	<ul class="mt-10 max-w-xl mx-auto w-fit">
		{#each data.chapters as chapter}
			<li style="margin-bottom: 12px;">
				<a href={chapter.url} class="link" data-sveltekit-reload>{chapter.text}</a>
				<span class="block -mt-1 text-xs"> uploaded: {chapter.date}</span>
			</li>
		{/each}
	</ul>
</div>
