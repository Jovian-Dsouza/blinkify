import { t, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/utils/prisma-helpers";

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
  getAdvertisements: publicProcedure
    .input(
      z.object({
        network: z.string(),
      })
    )
    .use(authMiddleware)
    .query(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;

        const ads = await prisma.ad.findMany({
          where: {
            paymentAddress: walletAddress,
            network: input.network,
            active: true,
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
            amount: input.amount,
            tokenAddress: input.tokenAddress,
            network: input.network,
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

  getProductPerformance: publicProcedure
    .input(
      z.object({
        network: z.string(),
      })
    )
    .use(authMiddleware)
    .query(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;

        // Fetch all ads associated with the user
        const ads = await prisma.ad.findMany({
          where: {
            network: input.network,
            paymentAddress: walletAddress,
          },
        });

        // Aggregate performance data from payments
        const payments = await prisma.payment.groupBy({
          by: ["adId"],
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
          where: {
            walletAddress: walletAddress,
            network: input.network,
          },
        });

        // Create a map for quick lookup of payment data
        const paymentMap = payments.reduce((acc, payment) => {
          acc[payment.adId] = payment;
          return acc;
        }, {} as Record<string, (typeof payments)[0]>);

        // Map the ads to include performance metrics, defaulting to zero if no payments
        const productPerformance = ads.map((ad) => {
          const payment = paymentMap[ad.id] || {
            _count: { id: 0 },
            _sum: { amount: 0 },
          };
          return {
            id: ad.id,
            name: ad.title ?? "Unknown",
            active: ad.active ?? false,
            saleCount: payment._count.id,
            revenue: payment._sum.amount ?? 0,
          };
        });

        return productPerformance;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve product performance",
        });
      }
    }),

  getMonthlyRevenue: publicProcedure
    .input(
      z.object({
        network: z.string(),
      })
    )
    .use(authMiddleware)
    .query(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;
        const currentDate = new Date();
        const startOfCurrentMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ); // Start of the current month
        const startOfNextMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        ); // Start of the next month
        const startOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        ); // Start of the last month

        // Calculate current month's revenue
        const currentMonthRevenue = await prisma.payment.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            walletAddress: walletAddress,
            network: input.network,
            paymentAt: {
              gte: startOfCurrentMonth,
              lt: startOfNextMonth,
            },
          },
        });

        // Calculate previous month's revenue
        const lastMonthRevenue = await prisma.payment.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            walletAddress: walletAddress,
            network: input.network,
            paymentAt: {
              gte: startOfLastMonth,
              lt: startOfCurrentMonth,
            },
          },
        });

        // Convert Decimal to number
        const currentRevenue = Number(currentMonthRevenue._sum.amount) || 0;
        const previousRevenue = Number(lastMonthRevenue._sum.amount) || 0;

        // Calculate the percentage change
        let percentageChange = 0;
        if (previousRevenue > 0) {
          percentageChange =
            ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        }

        return {
          monthlyRevenue: currentRevenue,
          percentageChange: percentageChange, // Format percentage to 2 decimal places
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to calculate monthly revenue",
        });
      }
    }),

  // The previous getYearlyRevenue remains unchanged
  getYearlyRevenue: publicProcedure
    .input(
      z.object({
        network: z.string(),
      })
    )
    .use(authMiddleware)
    .query(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;
        const currentYear = new Date().getFullYear();
        const startOfCurrentYear = new Date(currentYear, 0, 1); // Start of the current year
        const startOfNextYear = new Date(currentYear + 1, 0, 1); // Start of the next year
        const startOfLastYear = new Date(currentYear - 1, 0, 1); // Start of the last year

        // Calculate current year's revenue
        const currentYearRevenue = await prisma.payment.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            walletAddress: walletAddress,
            network: input.network,
            paymentAt: {
              gte: startOfCurrentYear,
              lt: startOfNextYear,
            },
          },
        });

        // Calculate previous year's revenue
        const previousYearRevenue = await prisma.payment.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            walletAddress: walletAddress,
            network: input.network,
            paymentAt: {
              gte: startOfLastYear,
              lt: startOfCurrentYear,
            },
          },
        });

        // Convert Decimal to number
        const currentRevenue = Number(currentYearRevenue._sum.amount) || 0;
        const previousRevenue = Number(previousYearRevenue._sum.amount) || 0;

        // Calculate the percentage change
        let percentageChange = 0;
        if (previousRevenue > 0) {
          percentageChange =
            ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        }

        return {
          yearlyRevenue: currentRevenue,
          percentageChange: percentageChange, // Format percentage to 2 decimal places
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to calculate yearly revenue",
        });
      }
    }),

  makeAdInactive: publicProcedure
    .use(authMiddleware)
    .input(
      z.object({
        adId: z.string().uuid(),
        network: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const walletAddress = ctx.token.sub;

        // Check if the ad belongs to the user
        const ad = await prisma.ad.findFirst({
          where: {
            id: input.adId,
            paymentAddress: walletAddress,
            network: input.network,
          },
        });

        if (!ad) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Advertisement not found or does not belong to the user",
          });
        }

        // Update the ad to inactive
        const updatedAd = await prisma.ad.update({
          where: {
            id: input.adId,
          },
          data: {
            active: false,
          },
        });

        return updatedAd;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to make advertisement inactive",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
