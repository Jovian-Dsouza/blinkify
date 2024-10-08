import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClusterProvider, networkType } from "@/providers/cluster-provider";
import { RecoilProvider } from "@/providers/recoil-privoder";
import { SolanaProvider } from "@/providers/solana-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TrpcProvider from "./_trpc/TrpcProvider";
import { CustomThemeProvider } from "@/providers/theme-provider";
import LoginModal from "@/components/LoginModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blinkify",
  description: "Illuminate Your Brand with Every Blink",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
          <ClusterProvider
            network={
              (process.env.NEXT_PUBLIC_NETWORK as networkType) || "mainnet"
            }
          >
            <SolanaProvider session={session}>
              <TrpcProvider>
                <CustomThemeProvider>
                  <LoginModal/>
                  {children}
                </CustomThemeProvider>
              </TrpcProvider>
            </SolanaProvider>
          </ClusterProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}
