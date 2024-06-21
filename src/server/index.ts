import { brandRouter } from "./router_brand";
import { healthRouter } from "./router_health";
import { productRouter } from "./router_product";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  brand: brandRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;

export { db } from "./database";
