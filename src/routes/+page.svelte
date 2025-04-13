<script lang="ts">
	import AddVenue from '$lib/components/AddVenue.svelte';
	import Map from '$lib/components/Map.svelte';
	import Venues from '$lib/components/Venues.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeVenueId = $state<number | undefined>(undefined);
</script>

<svelte:head>
	<title>Wedding Venues</title>
</svelte:head>

<div class="grid h-screen grid-cols-6">
	<div class="col-span-4">
		<Map venues={data.venues} bind:activeVenueId />
	</div>

	<div class="col-span-2 flex h-full flex-col gap-2 overflow-y-hidden">
		<div class="grow overflow-y-auto">
			<Venues venues={data.venues} bind:activeVenueId />
		</div>

		<div class="shrink-0 p-4">
			<AddVenue />
		</div>
	</div>
</div>
