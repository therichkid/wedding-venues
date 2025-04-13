import { numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const venue = pgTable('venue', {
	id: serial().primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	description: varchar({ length: 1024 }),
	imageUrl: varchar('image_url'),
	url: varchar(),
	lat: numeric({ precision: 8, scale: 6 }),
	lng: numeric({ precision: 9, scale: 6 }),
});
