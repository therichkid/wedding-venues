<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let map;

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');

			map = L.map('map').setView([42.0, 13.2], 8);

			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			L.marker([42.2, 13.2]).addTo(map).bindPopup('A pretty CSS popup.<br> Easily customizable.');
		}
	});
</script>

<div id="map"></div>

<style>
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
