<script lang="ts">
	import AppIcon from './icons/AppIcon.svelte';
	import SearchIcon from './icons/SearchIcon.svelte';
</script>

<header class="bg-indigo-900">
	{#if $$slots['search-input']}
		<div class="mx-auto w-96 w-68 px-2 sm:px-4 lg:px-8 h-16 py-3">
			<a href="/">
				<div class="inline-block align-middle text-indigo-400 mr-6">
					<AppIcon class="h-8 inline-block" />
				</div>
			</a>
			<div class="inline-block align-middle w-[16rem]">
				<div class="w-full">
					<div class="relative">
						<div class="pointer-events-none absolute top-2 left-0  pl-3">
							<SearchIcon class="h-5 w-5 text-indigo-900" />
						</div>
						<slot name="search-input" />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<center class="h-16 py-4">
			<a href="/">
				<div class="inline-block align-middle text-indigo-300">
					<AppIcon class="h-8 inline-block" />
					<h1 class="inline-block ml-4 text-lg">eReader-Mangas</h1>
				</div>
			</a>
		</center>
	{/if}
</header>
