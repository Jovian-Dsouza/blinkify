import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createBuyTransaction } from "@/app/utils/txn-helpers";
import { getTokenByAddress } from "@/app/data/tokens";
import base58 from "bs58";

const amount = 100
const tokenSymbol = "USDC"
const wallet_address = "6fQytE8KQZvEVvGnSM6kfWbtVbso8j3GhFQPuZoHZCmD";

export const GET = async (req: Request) => {
  try {
    const payload: ActionGetResponse = {
      title: `Buy Web3 Cohort for ${amount} ${tokenSymbol}`,
      icon: new URL(
        "/web3_cohort_banner.png",
        new URL(req.url).origin,
      ).toString(),
      description: `Complete Web Development + Devops + Blockchain Cohort`,
      label: `Buy Now`,
    };

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new NextResponse(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid account provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    const token = getTokenByAddress(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    if(!token){
       return new Response('Invalid token address', {
         status: 400,
         headers: ACTIONS_CORS_HEADERS,
       });
    }
    const buyTransaction = await createBuyTransaction(
      account,
      amount,
      wallet_address,
      token
    );

    const reference = new Keypair().publicKey;
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: buyTransaction,
        message: "Purchase Successfull! Powered by blinkify.fun",
      },
      reference,
      actionIdentity: getActionIdentityFromEnv("ACTION_IDENTITY_SECRET"),
    });

    //TODO store - transaction details in DB

    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });

  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new NextResponse(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export function getActionIdentityFromEnv(envKey = "ACTION_IDENTITY_SECRET") {
  try {
    if (!process.env[envKey]) throw Error("missing env key");
    return Keypair.fromSecretKey(
      base58.decode(process.env[envKey] as string)
    );
  } catch (err) {
    throw new Error(`invalid identity in env variable: '${envKey}'`);
  }
}
