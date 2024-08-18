"use client";
import React from "react";
import dynamic from "next/dynamic";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode, useCallback, useMemo } from "react";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import { useCluster } from "./cluster-provider";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

require("@/utils/solana-nextauth/style.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const TipLinkProvider = dynamic(
  async () => await import("./tiplink-provider"),
  {
    ssr: false,
  }
);

export function SolanaProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const { cluster } = useCluster();

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const wallets = useMemo(
    () => [
      new TipLinkWalletAdapter({
        title: "Blinkify",
        clientId: process.env.NEXT_PUBLIC_TIPLINK_WALLET_CLIENT_ID!,
        theme: "dark",
      }),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={cluster.endpoint}>
      <SessionProvider session={session}>
        <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
          <TipLinkProvider>
            <WalletModalProvider>{children}</WalletModalProvider>
          </TipLinkProvider>
        </WalletProvider>
      </SessionProvider>
    </ConnectionProvider>
  );
}
