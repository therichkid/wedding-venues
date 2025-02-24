<script lang="ts">
	import AddVenue from '$lib/components/AddVenue.svelte';
	import Map from '$lib/components/Map.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-6 gap-3">
	<div class="col-span-4">
		<Map venues={data.venues} />
	</div>
	<div class="col-span-2">
		<AddVenue />
	</div>
</div>
