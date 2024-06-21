import { products } from "@/database/product";
import { eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "./database";
import { publicProcedure, router } from "./trpc";

export const productRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        brand: z.string().optional(),
        page: z.number().positive().default(1),
        per_page: z.number().positive().default(10),
      })
    )
    .query(async (opts) => {
      const offset = (opts.input.page - 1) * opts.input.per_page;
      const whereSearch = opts.input.query
        ? or(
            ilike(products.name, `%${opts.input.query}%`),
            ilike(products.code, `%${opts.input.query}%`)
          )
        : undefined;
      const whereBrand = opts.input.brand
        ? ilike(products.brand, opts.input.brand)
        : undefined;

      return db
        .select()
        .from(products)
        .where(or(whereSearch, whereBrand))
        .limit(opts.input.per_page)
        .offset(offset)
        .orderBy();
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        code: z.string(),
        brand: z.string(),
        price: z.number(),
        stock: z.number(),
      })
    )
    .mutation(async (opts) => {
      return db
        .insert(products)
        .values({
          name: opts.input.name,
          code: opts.input.code,
          brand: opts.input.brand,
          price: opts.input.price,
          stock: opts.input.stock,
        })
        .returning();
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        brand: z.string(),
        price: z.number(),
        stock: z.number(),
      })
    )
    .mutation(async (opts) => {
      return db
        .update(products)
        .set({
          name: opts.input.name,
          code: opts.input.code,
          brand: opts.input.brand,
          price: opts.input.price,
          stock: opts.input.stock,
        })
        .where(eq(products.id, opts.input.id))
        .returning();
    }),
  updateStock: publicProcedure
    .input(
      z.object({
        id: z.number(),
        stock: z.number(),
      })
    )
    .mutation(async (opts) => {
      return db
        .update(products)
        .set({
          stock: opts.input.stock,
        })
        .where(eq(products.id, opts.input.id))
        .returning();
    }),
});
