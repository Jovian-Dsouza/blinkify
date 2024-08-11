import { SolanaAuthProvider } from "@/utils/solana-nextauth/SolanaAuthProvider";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [SolanaAuthProvider],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.publicKey = token.sub;
      return session;
    },
  },
};
