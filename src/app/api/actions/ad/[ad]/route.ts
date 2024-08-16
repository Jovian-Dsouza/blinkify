import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createBuyTransaction } from "@/utils/txn-helpers";
import { getTokenByAddress } from "@/data/tokens";
import { getActionIdentityFromEnv } from "@/utils/action-helpers";
import { prisma } from "@/utils/prisma-helpers";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    // console.log(url)
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    // console.log("Extracted ID:", id);

    const ad = await prisma.ad.findUnique({
      where: {
        id,
      },
    });

    if (!ad) {
      return new Response(
        JSON.stringify({ message: "Invalid Ad Id" }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
    
    const token = getTokenByAddress(ad.tokenAddress)
    if(!token){
      return new Response(JSON.stringify({ message: "Invalid Token" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const payload: ActionGetResponse = {
      title: `Buy ${ad.title} for ${ad.amount} ${token.symbol}`,
      icon: ad.mediaUrl,
      description: ad.content,
      label: `Buy Now`,
      links: {
        actions: [
          {
            label: `Buy Now`,
            href: `${url.pathname}?email={email}`,
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
    // /api/actions/ad/[adId]?email={email}
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
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

    const ad = await prisma.ad.findUnique({
      where: {
        id,
      },
    });

    if (!ad) {
      return new Response(JSON.stringify({ message: "Invalid Ad Id" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const token = getTokenByAddress(ad.tokenAddress);
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
      ad.amount.toNumber(),
      ad.paymentAddress,
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
    // console.log("email: ", email);
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
