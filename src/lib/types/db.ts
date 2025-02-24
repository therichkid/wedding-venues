import { user, venue } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Venue = InferSelectModel<typeof venue>;
export type User = InferSelectModel<typeof user>;

export type InsertVenue = InferInsertModel<typeof venue>;
export type InsertUser = InferInsertModel<typeof user>;
