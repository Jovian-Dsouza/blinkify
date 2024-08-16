import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function findOrCreateUser(
  walletAddress: string,
  name?: string,
  email?: string
) {
  const user = await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: {
      walletAddress,
      name,
      email,
    },
  });

  return user;
}