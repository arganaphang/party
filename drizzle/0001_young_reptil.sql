ALTER TABLE "products" RENAME COLUMN "stock" TO "quantity";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "brand" SET NOT NULL;