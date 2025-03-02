<script lang="ts">
	import type { Venue } from '$lib/types/db';
	import type { Map } from 'maplibre-gl';
	import { MapLibre, Marker, NavigationControl, Popup, ScaleControl } from 'svelte-maplibre-gl';

	let { venues = [], activeVenueId = $bindable() }: { venues: Venue[]; activeVenueId?: number } = $props();

	let map = $state<Map | undefined>(undefined);

	$effect(() => {
		const activeVenue = venues.find((venue) => venue.id === activeVenueId);

		if (!activeVenue || !map) {
			return;
		}

		map.flyTo({
			center: { lat: Number(activeVenue.lat), lng: Number(activeVenue.lng) },
			duration: 1000,
		});
	});
</script>

<MapLibre
	class="h-full"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={8.0}
	center={{ lat: 42.0, lng: 13.2 }}
	bind:map
>
	<NavigationControl />
	<ScaleControl />

	{#each venues as venue}
		{#if venue.lat && venue.lng}
			<Marker lnglat={{ lat: Number(venue.lat), lng: Number(venue.lng) }}>
				{#snippet content()}
					<button type="button" class="text-center leading-none" onclick={() => (activeVenueId = venue.id)}>
						<div class="text-4xl">&#128146;</div>
						<div class="text-primary-900 font-bold drop-shadow-md">{venue.name}</div>
					</button>
				{/snippet}
				<Popup open={activeVenueId === venue.id}>
					<div>
						<h4 class="h6">{venue.name}</h4>
						{#if venue.url}
							<a href={venue.url} target="_blank" class="font-medium hover:underline">Visit Website</a>
						{/if}
					</div>
				</Popup>
			</Marker>
		{/if}
	{/each}
</MapLibre>
