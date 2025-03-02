<script lang="ts">
	import { browser } from '$app/environment';
	import type { Venue } from '$lib/types/db';
	import type { Map, Marker } from 'leaflet';
	import { onMount } from 'svelte';

	let { venues = [], activeVenueId = $bindable() }: { venues: Venue[]; activeVenueId?: number } = $props();

	let L: typeof import('leaflet') | null = null;
	let map: Map | null = null;
	let markers: Record<number, Marker> = {};

	let mapInitialized = $state(false);

	onMount(async () => {
		if (browser) {
			L = await import('leaflet');

			map = L.map('map').setView([42.0, 13.2], 8);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);

			mapInitialized = true;
		}
	});

	$effect(() => {
		if (mapInitialized) {
			Object.values(markers).forEach((marker) => marker.remove());
			markers = {};

			venues.forEach((venue) => {
				if (venue.lat && venue.lng) {
					const marker = L!.marker([Number(venue.lat), Number(venue.lng)]).addTo(map!).bindPopup(`
								<strong>${venue.name}</strong><br>
								${venue.url ? `<a href="${venue.url}" target="_blank">Visit Website</a>` : ''}
							`);

					markers[venue.id] = marker;
					marker.on('click', () => {
						activeVenueId = venue.id;
					});
				}
			});
		}
	});

	$effect(() => {
		if (!mapInitialized || !activeVenueId || !markers[activeVenueId]) {
			return;
		}

		const activeMarker = markers[activeVenueId];
		activeMarker.openPopup();
		map?.panTo(activeMarker.getLatLng());
	});
</script>

<div id="map"></div>

<style>
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
