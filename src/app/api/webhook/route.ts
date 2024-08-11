import { NextResponse } from "next/server";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: any[];
}

export interface Events {}

export interface Instruction {
  accounts: any[];
  data: string;
  innerInstructions: any[];
  programId: string;
}

export type WebhookResponse = {
  accountData: AccountData[];
  description: string;
  events: Events;
  fee: number;
  feePayer: string;
  instructions: Instruction[];
  nativeTransfers: any[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: any[];
  transactionError: any;
  type: string;
}[];

const solanaRPC =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC
    : process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC;

export const POST = async (req: Request) => {
  const authHeader = req.headers.get("authorization");

//   if (authHeader === env.HELIUS_WEBHOOK_SECRET) {
    const connection = new Connection(solanaRPC || clusterApiUrl("devnet"));
    const body = await req.json();
    console.log(body)
    const data: WebhookResponse = body;
    const signature = data[0].signature;
    const details = await connection.getParsedTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (details === null || details.meta === null) {
      return NextResponse.json(
        { message: "can't fetch log messages for that transaction" },
        { status: 400 }
      );
    }

    const logMessages = details.meta.logMessages;
    const sender = details.transaction.message.accountKeys[1].pubkey.toString();

    if (!logMessages) {
      return NextResponse.json(
        { message: "can't fetch log messages for that transaction" },
        { status: 400 }
      );
    }
    // }

    return NextResponse.json({ message: "webhook received" }, { status: 200 });
//   } else {
//     return NextResponse.json({ message: "unauthorized" }, { status: 401 });
//   }
};
