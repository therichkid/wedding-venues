import { numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial().primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	email: varchar().notNull(),
	passwordHash: varchar('password_hash').notNull(),
});

export const venue = pgTable('venue', {
	id: serial().primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	nameEn: varchar('name_en', { length: 256 }),
	description: varchar({ length: 1024 }),
	descriptionEn: varchar('description_en', { length: 1024 }),
	imageUrl: varchar('image_url'),
	url: varchar(),
	lat: numeric({ precision: 8, scale: 6 }),
	lng: numeric({ precision: 9, scale: 6 }),
});
