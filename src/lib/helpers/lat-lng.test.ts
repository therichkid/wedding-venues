import { describe, expect, it } from 'vitest';
import { parseLatLng } from './lat-lng';

// Test cases with expected results
const validTestCases = [
	{
		url: 'https://maps.google.com/?q=41.7257,13.1125',
		expected: { latitude: 41.7257, longitude: 13.1125 },
	},
	{
		url: 'https://www.google.com/maps/place/41°43\'32.5"N+13°06\'45.0"E/@41.7257,13.1099251,17z',
		expected: { latitude: 41.7257, longitude: 13.1099251 },
	},
	{
		url: 'https://www.google.com/maps/@41.7257,13.1099251,17z',
		expected: { latitude: 41.7257, longitude: 13.1099251 },
	},
	{
		url: 'https://maps.google.com/?q=41.7257,13.1125&other=params',
		expected: { latitude: 41.7257, longitude: 13.1125 },
	},
	{
		url: 'https://maps.google.com/?q=41.7257 , 13.1125',
		expected: { latitude: 41.7257, longitude: 13.1125 },
	},
	{
		url: 'https://maps.google.com/?q=42.2299,%2012.2569',
		expected: { latitude: 42.2299, longitude: 12.2569 },
	},
	{
		url: 'https://www.google.com/maps?q=42.3507,+12.0829',
		expected: { latitude: 42.3507, longitude: 12.0829 },
	},
];

describe('parseLatLng', () => {
	// Test all valid cases
	validTestCases.forEach(({ url, expected }) => {
		it(`should parse correctly: ${url}`, () => {
			expect(parseLatLng(url)).toEqual(expected);
		});
	});

	// Error cases
	it('should throw error for empty URL', () => {
		expect(() => parseLatLng('')).toThrowError('URL cannot be null or empty');
	});

	it('should throw error for null URL', () => {
		expect(() => parseLatLng(null as unknown as string)).toThrowError('URL cannot be null or empty');
	});

	it('should throw error for unsupported URL format', () => {
		expect(() => parseLatLng('https://example.com')).toThrowError('Unsupported URL format');
	});

	it('should throw error for invalid coordinate format', () => {
		expect(() => parseLatLng('https://maps.google.com/?q=invalid,coordinates')).toThrowError('Invalid coordinate format');
	});
});
