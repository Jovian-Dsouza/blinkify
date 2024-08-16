import { t, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSession } from "next-auth/react";

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  //@ts-ignore
  const token = ctx.token;
  if (!token || !token.sub) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next({
    ctx: {
      ...ctx,
      token,
    },
  });
});

export const appRouter = router({
  getTodos: publicProcedure.use(authMiddleware).query(async ({ ctx }) => {
    const walletAddress = ctx.token.sub;
    // console.log("walletAddress", walletAddress)
    
    return [10, 20, 30];
  }),
  addTodos: publicProcedure
    .use(authMiddleware)
    .input(z.string())
    .mutation(async ({ input }) => {
      console.log(input);
      return true;
    }),
});

export type AppRouter = typeof appRouter;
