import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { brands } from "./brand";

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
	brand: text("brand")
		.references(() => brands.name)
		.notNull(),
	price: integer("price").notNull(),
	quantity: integer("quantity").default(1).notNull(),
	created_at: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
