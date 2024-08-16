import * as anchor from "@coral-xyz/anchor";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  PublicKey,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
} from "@solana/spl-token";
import { Token } from "../data/tokens";

const solanaRPC =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC
    : process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC;

export async function createBuyTransaction(
  account: PublicKey,
  amount: number,
  wallet_address: string,
  token: Token
) {
  const connection = new anchor.web3.Connection(
    solanaRPC || clusterApiUrl("devnet")
  );
  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 15000,
  });

  const instructions = [addPriorityFee];
  const platformPublicKey = new PublicKey(process.env.SHOP!);
  let transferAmount = 0.0;
  let feeAmount = 0.0;

  // Add SPL Token Transfer Instruction
  if (amount > 0) {
    const mintPublicKey = new PublicKey(token.address);
    const fromPublicKey = account;
    const destPublicKey = new PublicKey(wallet_address);

    const totalAmount = BigInt(amount * 10 ** token.decimals);
    const platformFee = (totalAmount * BigInt(1)) / BigInt(100); // 1% fee
    const tokenTransferAmount = totalAmount - platformFee;
    feeAmount = Number(platformFee) / (10 ** token.decimals)
    transferAmount = Number(tokenTransferAmount) / 10 ** token.decimals;

    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      fromPublicKey
    );
    const destTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      destPublicKey
    );
    const receiverAccount = await connection.getAccountInfo(destTokenAccount);
    //Create associated token acoount for the reciever if they dont have
    if (receiverAccount === null) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          fromPublicKey,
          destTokenAccount,
          destPublicKey,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    instructions.push(
      createTransferInstruction(
        fromTokenAccount,
        destTokenAccount,
        fromPublicKey,
        tokenTransferAmount
      )
    );

    // Platform fee transfer to the platform's wallet
    const platformTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      platformPublicKey
    );

    const platformReceiverAccount = await connection.getAccountInfo(
      platformTokenAccount
    );

    // Create associated token account for the platform if they don't have one
    if (platformReceiverAccount === null) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          fromPublicKey,
          platformTokenAccount,
          platformPublicKey,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    instructions.push(
      createTransferInstruction(
        fromTokenAccount,
        platformTokenAccount,
        fromPublicKey,
        platformFee
      )
    );
  }

  const { blockhash } = await connection.getLatestBlockhash({
    commitment: "max",
  });

  const messageV0 = new anchor.web3.TransactionMessage({
    payerKey: account,
    recentBlockhash: blockhash,
    instructions: instructions,
  }).compileToV0Message();

  const versionedTransaction = new anchor.web3.VersionedTransaction(messageV0);
  return {
    versionedTransaction,
    feeAmount,
    transferAmount,
    feeAddress: platformPublicKey.toString(),
  };
}
