import { publicProcedure, router } from "./trpc";

export const healthRouter = router({
  getHealth: publicProcedure.query(async (_ctx) => {
    return { message: "ok" };
  }),
});
