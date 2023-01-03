<script>
	import { page } from '$app/stores';
	import NavMenu from '$lib/NavMenu.svelte';
</script>

<NavMenu />

<div class="container">
	<center>
		<h1>Error {$page.status}</h1>
		<h5>
			<pre>{$page.error?.message}</pre>
		</h5>
	</center>
</div>
