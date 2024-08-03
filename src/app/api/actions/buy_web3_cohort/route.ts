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
import { web3, BN } from "@coral-xyz/anchor";



export const GET = async (req: Request) => {
  try {
    const payload: ActionGetResponse = {
      title: "Buy Web3 Cohort for $100 USDC",
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

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    //TODO write logic to Transfer required amount of money to destination wallet address

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
