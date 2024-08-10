import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { createBuyTransaction } from "@/app/utils/txn-helpers";
import { getTokenByAddress } from "@/app/data/tokens";

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
    const serializedBuyTransaction = await createBuyTransaction(
      account,
      amount,
      wallet_address,
      token
    );

    return new Response(
      JSON.stringify({
        transaction: serializedBuyTransaction,
        message: "Purchase Successfull! Powered by blinkify.fun",
      }),
      {
        headers: ACTIONS_CORS_HEADERS,
      }
    );

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
