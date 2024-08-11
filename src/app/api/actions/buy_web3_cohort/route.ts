import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createBuyTransaction } from "@/app/utils/txn-helpers";
import { getTokenByAddress } from "@/app/data/tokens";
import { getActionIdentityFromEnv } from "@/app/utils/action-helpers";

const amount = 0.1;
const tokenSymbol = "USDC";
// const tokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; //mainnet
const tokenAddress = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"; //devnet
const wallet_address = "Eeaq9tfNzk2f8ijdiHNZpjsBV96agB2F3bNmwx6fdVr6";
// const wallet_address = "6fQytE8KQZvEVvGnSM6kfWbtVbso8j3GhFQPuZoHZCmD";

export const GET = async (req: Request) => {
  try {
    const payload: ActionGetResponse = {
      title: `Buy Web3 Cohort for ${amount} ${tokenSymbol}`,
      icon: new URL(
        "/web3_cohort_banner.png",
        new URL(req.url).origin
      ).toString(),
      description: `Complete Web Development + Devops + Blockchain Cohort`,
      label: `Buy Now`,
      links: {
        actions: [
          {
            label: `Buy Now`,
            href: `/api/actions/buy_web3_cohort?email={email}`,
            parameters: [
              {
                name: "email",
                label: "Enter your Email address",
              },
            ],
          },
        ],
      },
    };

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return NextResponse.json(
      { message },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    // /api/actions/buy_web3_cohort?email={email}
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email query parameter is required" }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
    // Check if the email format is valid
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Invalid account provided" }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
    const token = getTokenByAddress(tokenAddress);
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Invalid token address" }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
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
    // reference, wallet_address, amount, token address, network, product id, email address, destination wallet, fee_wallet, fee_amount, created_at, status
    console.log("email: ", email);
    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(JSON.stringify({ message }), {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
