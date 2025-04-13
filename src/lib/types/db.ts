import { venue } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Venue = InferSelectModel<typeof venue>;

export type InsertVenue = InferInsertModel<typeof venue>;
