import { t, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {  prisma } from "@/utils/prisma-helpers";

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

  getAdvertisements: publicProcedure
    .use(authMiddleware)
    .query(async ({ ctx }) => {
      try {
        const walletAddress = ctx.token.sub;

        const ads = await prisma.ad.findMany({
          where: {
            paymentAddress: walletAddress,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return ads;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve advertisements",
        });
      }
    }),

  addAdvertisement: publicProcedure
    .use(authMiddleware)
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        mediaUrl: z.string(),
        amount: z.number(),
        tokenAddress: z.string(),
        network: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;

        const ad = await prisma.ad.create({
          data: {
            title: input.title,
            content: input.content,
            mediaUrl: input.mediaUrl,
            amount: 0.1,
            tokenAddress: input.tokenAddress,
            network: input.network ,
            active: true,
            paymentAddress: walletAddress,
          },
        });
        return ad;
      } catch (error) {
        console.error(error);
         throw new TRPCError({
           code: "INTERNAL_SERVER_ERROR",
           message: "Failed to create advertisement",
         });
      }
    }),
});

export type AppRouter = typeof appRouter;
