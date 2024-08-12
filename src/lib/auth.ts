import { findOrCreateUser } from "@/utils/prisma-helpers";
import { SolanaAuthProvider } from "@/utils/solana-nextauth/SolanaAuthProvider";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [SolanaAuthProvider],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, user, account}) {
      if(token.sub){
        const walletAddress = token.sub;
        const dbUser = await findOrCreateUser(walletAddress);
        token.name = dbUser.name;
        token.email = dbUser.email;
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.publicKey = token.sub;
      session.user = {
        name: token.name,
        email: token.email,
      }
      return session;
    },
  },
};
