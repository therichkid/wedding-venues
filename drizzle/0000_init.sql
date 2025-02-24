CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venue" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"name_en" varchar(256),
	"description" varchar(1024),
	"description_en" varchar(1024),
	"image_url" varchar,
	"url" varchar,
	"lat" numeric(8, 6),
	"lng" numeric(9, 6)
);
