import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";
const secret = process.env.NEXTAUTH_SECRET;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const token = await getToken({
        req: req as unknown as NextApiRequest,
        secret,
      });
      // console.log("token", token);
      return {
        token,
      };
    },
  });

export { handler as GET, handler as POST };
