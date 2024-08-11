import { NextResponse } from "next/server";
import {
  clusterApiUrl,
  ConfirmedSignatureInfo,
  Connection,
  ParsedInstruction,
} from "@solana/web3.js";
import {
  findSplMemoInstruction,
  getActionIdentityFromEnv,
  verifySignatureInfoForIdentity,
} from "@/utils/action-helpers";

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
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader === process.env.HELIUS_WEBHOOK_SECRET) {
      const connection = new Connection(solanaRPC || clusterApiUrl("devnet"));
      const body = await req.json();
      const data: WebhookResponse = body;
      const signature = data[0].signature;
      const details = await connection.getParsedTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (
        details === null ||
        details.meta === null ||
        details.slot === null ||
        details.transaction === null ||
        details.transaction.signatures === null ||
        details.transaction.signatures.length === 0 ||
        details.transaction.message === null ||
        details.transaction.message.instructions === null
      ) {
        console.error("can't parse necessary details");
        return NextResponse.json(
          { message: "can't parse necessary details" },
          { status: 400 }
        );
      }

      const sigInfo: ConfirmedSignatureInfo = {
        signature: details.transaction.signatures[0],
        slot: details.slot,
        err: details.meta.err,
        memo: findSplMemoInstruction(
          details.transaction.message.instructions as ParsedInstruction[]
        ).parsed,
        blockTime: details.blockTime,
        confirmationStatus: "confirmed",
      };

      const identity = getActionIdentityFromEnv("ACTION_IDENTITY_SECRET");
      const isVerified = await verifySignatureInfoForIdentity(
        connection,
        identity,
        sigInfo
      );
      if (!isVerified) {
        console.error("Transaction not verified by identity");
        return NextResponse.json(
          { message: "Transaction not verified by identity" },
          { status: 400 }
        );
      }
      // TODO: check if reference is already used in confirm transaction in DB
      // TODO: Write parser to verify the tranfer amounts
      // TODO: Store required info in DB
      console.log("transaction signature", sigInfo.signature);

      return NextResponse.json(
        { message: "webhook received" },
        { status: 200 }
      );
    } else {
      console.error("unauthorized");
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
