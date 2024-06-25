import { pgTable, text } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
	name: text("name").primaryKey(),
	img_url: text("img_url").notNull(),
});
