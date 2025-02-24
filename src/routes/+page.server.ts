import { db } from '$lib/server/db';
import { venue } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const venues = await db.select().from(venue);
	return { venues };
};

export const actions = {
	addVenue: async ({ request }) => {
		const formData = await request.formData();

		try {
			const newVenue = await db
				.insert(venue)
				.values({
					name: formData.get('name') as string,
					description: formData.get('description') as string,
					imageUrl: formData.get('imageUrl') as string,
					url: formData.get('url') as string,
					lat: formData.get('lat') as string,
					lng: formData.get('lng') as string,
				})
				.returning();

			return { success: true, venue: newVenue[0] };
		} catch (error) {
			console.error('Failed to add venue: ', error);
			return fail(400, {
				error: 'Failed to add venue',
			});
		}
	},

	updateVenue: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		try {
			const updatedVenue = await db
				.update(venue)
				.set({
					name: formData.get('name') as string,
					description: formData.get('description') as string,
					imageUrl: formData.get('imageUrl') as string,
					url: formData.get('url') as string,
					lat: formData.get('lat') as string,
					lng: formData.get('lng') as string,
				})
				.where(eq(venue.id, Number(id)))
				.returning();

			return { success: true, venue: updatedVenue[0] };
		} catch (error) {
			console.error('Failed to update venue: ', error);
			return fail(400, {
				error: 'Failed to update venue',
			});
		}
	},
} satisfies Actions;
