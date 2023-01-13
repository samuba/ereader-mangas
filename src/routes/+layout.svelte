<script lang="ts">
	import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';
	import '@picocss/pico/css/pico.min.css';
</script>

<svelte:head>
	<title>eReader Mangas</title>
</svelte:head>

<slot />

<GoogleAnalytics />
