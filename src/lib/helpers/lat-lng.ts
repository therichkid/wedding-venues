interface LatLng {
	latitude: number;
	longitude: number;
}

export function parseLatLng(url: string): LatLng {
	if (!url?.trim()) {
		throw new Error('URL cannot be null or empty');
	}

	let coordinates: string = '';

	if (url.includes('maps.google.com/?q=')) {
		coordinates = url.split('?q=')[1];
	} else if (url.includes('@')) {
		coordinates = url.split('@')[1].split(',').slice(0, 2).join(',');
	} else {
		throw new Error('Unsupported URL format');
	}

	const [lat, lng] = coordinates.split(',');
	const latitude = parseFloat(lat.trim());
	const longitude = parseFloat(lng.trim());

	if (isNaN(latitude) || isNaN(longitude)) {
		throw new Error('Invalid coordinate format');
	}

	return { latitude, longitude };
}
