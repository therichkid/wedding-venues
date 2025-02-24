interface LatLng {
	latitude: number;
	longitude: number;
}

export function parseLatLng(url: string): LatLng {
	if (!url?.trim()) {
		throw new Error('URL cannot be null or empty');
	}

	const decodedUrl = decodeURIComponent(url);
	let coordinates: string = '';

	if (url.includes('?q=')) {
		coordinates = decodedUrl.split('?q=')[1];
	} else if (url.includes('@')) {
		coordinates = decodedUrl.split('@')[1].split(',').slice(0, 2).join(',');
	} else {
		throw new Error('Unsupported URL format');
	}

	// Remove extra parameters
	coordinates = coordinates.split('&')[0];
	// Remove whitespaces
	coordinates.replace(/\s+/g, '');

	const [lat, lng] = coordinates.split(',');
	const latitude = parseFloat(lat.trim());
	const longitude = parseFloat(lng.trim());

	if (isNaN(latitude) || isNaN(longitude)) {
		throw new Error('Invalid coordinate format');
	}

	return { latitude, longitude };
}
