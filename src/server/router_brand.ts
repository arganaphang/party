import { brands } from "@/database/brand";
import { eq } from "drizzle-orm";
import { z } from "zod"
import { db } from "./database";
import { publicProcedure, router } from "./trpc";

export const brandRouter = router({
  getAll: publicProcedure.query(async (_opts) => {
    return db.select().from(brands).all();
  }),
  get: publicProcedure.input(z.string()).query(async (opts) => {
    return db.select().from(brands).where(eq(brands.name, opts.input)).get();
  }),
  create: publicProcedure.input(z.object({
    name: z.string(),
    img_url: z.string()
  })).mutation(async (opts) => {
    return db.insert(brands).values({
      name: opts.input.name,
      img_url: opts.input.img_url
    }).onConflictDoNothing().returning();
  }),
});
