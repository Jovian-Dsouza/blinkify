import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
	getTodos: publicProcedure.query(async () => {
		return [10, 20, 30];
	}),
	addTodos: publicProcedure.input(z.string()).mutation(async (opts) => {
		console.log(opts.input)
		return true;
	})
});

export type AppRouter = typeof appRouter;