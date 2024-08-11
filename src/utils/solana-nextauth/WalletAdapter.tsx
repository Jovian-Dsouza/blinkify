/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { WalletButton } from "@/providers/solana-provider";
import bs58 from "bs58";
import { SigninMessage } from "./signMessage";

export default function WalletAdaptor({
  message: statement,
}: {
  message: string;
}) {
  const { data: session } = useSession();
  const { publicKey, signMessage, disconnecting, disconnect, connected } =
    useWallet();

  const signCustomMessage = async () => {
    if (!publicKey) {
      throw new Error("Wallet not avaiable to process request.");
    }
    try {
      const csrf = await getCsrfToken();
      if (!publicKey || !csrf || !signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (e) {
      disconnect();
      console.log(e);
      return;
    }
  };

  useEffect(() => {
    if (
      connected &&
      // @ts-ignore
      (!session || session.publicKey !== publicKey?.toString())
    ) {
      signCustomMessage();
    }
  }, [connected, session]);

  useEffect(() => {
    if (disconnecting) {
      signOut({ redirect: false });
    }
  }, [disconnecting]);

  //   useEffect(()=>{
  //     if(session){
  //         console.log("session", session)
  //     }
  //   }, [session])

  return <WalletButton />;
}
