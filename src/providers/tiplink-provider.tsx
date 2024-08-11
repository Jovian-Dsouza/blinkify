"use client";
import React from "react";
import { TipLinkWalletAutoConnectV2 } from "@tiplink/wallet-adapter-react-ui";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export default function TipLinkProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    return (
      <TipLinkWalletAutoConnectV2 isReady query={searchParams}>
        {children}
      </TipLinkWalletAutoConnectV2>
    );
}