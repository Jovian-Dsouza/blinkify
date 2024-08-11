import { ConfirmedSignatureInfo, Connection, Keypair, ParsedInstruction, PublicKey, Signer } from "@solana/web3.js";
import base58 from "bs58";
import bs58 from "bs58";
import nacl from "tweetnacl";
import {
  ActionIdentifierError,
  findReference,
  SOLANA_ACTIONS_PROTOCOL,
} from "@solana/actions";


const ACTIONS_IDENTITY_SCHEMA = {
  separator: ":",
  protocol: ("solana-action:" as SOLANA_ACTIONS_PROTOCOL).replace(":", ""),
  /** avoids magic numbers */
  scheme: {
    protocol: 0, // should always be zero
    identity: 1,
    reference: 2, // reference
    signature: 3,
  },
};

export function getActionIdentityFromEnv(envKey = "ACTION_IDENTITY_SECRET") {
  try {
    if (!process.env[envKey]) throw Error("missing env key");
    return Keypair.fromSecretKey(base58.decode(process.env[envKey] as string));
  } catch (err) {
    throw new Error(`invalid identity in env variable: '${envKey}'`);
  }
}

export function findSplMemoInstruction(
  instructions: ParsedInstruction[]
): ParsedInstruction {
  // Iterate over each instruction in the list
  for (const instruction of instructions) {
    // Check if the instruction's program is 'spl-memo'
    if (instruction.program === "spl-memo") {
      // Return the matching instruction
      return instruction;
    }
  }
  // If no spl-memo instruction is found, return null
  throw new Error("Could not find spl-memo instruction");
}

export async function verifySignatureInfoForIdentity(
  connection: Connection,
  identity: Signer,
  sigInfo: ConfirmedSignatureInfo
): Promise<boolean> {
  try {
    const validated = validateActionIdentifierMemo(
      identity.publicKey,
      sigInfo.memo
    );
    if (!validated) return false;
    // Not able to find the reference as soon as webhook is called add delay. 
    // Or check for repeat referece in the DB instead
    // const confirmedSigInfo = await findReference(
    //   connection,
    //   new PublicKey(validated.reference)
    // );
    // if (confirmedSigInfo.signature === sigInfo.signature) return true;
    return true; //Check reference in DB if already existing
  } catch (err) {
    throw err;
  }
  return false;
}

export function validateActionIdentifierMemo(
  identity: PublicKey,
  memos: string | string[] | null
): false | { verified: true; reference: string } {
  if (!memos) return false;
  // web3js SignatureResultInfo can have multiple memos in the response
  // each memo is semi-colon separated
  if (typeof memos == "string") memos = memos.split(";");

  for (let i = 0; i < memos.length; i++) {
    try {
      let memo = memos[i].trim();
      // Remove the Memo program's byte count prefix
      if (/^\[\d+\] /.test(memo)) {
        memo = memo.match(/^\[\d+\] (.*)/)?.[1].trim() || memo;
      }

      if (/^([\w\d\-]+:){2,}/g.test(memo) == false) {
        throw new ActionIdentifierError("invalid memo formatting");
      }

      const identifier = memo.split(ACTIONS_IDENTITY_SCHEMA.separator);
      if (
        identifier.length !== Object.keys(ACTIONS_IDENTITY_SCHEMA.scheme).length
      ) {
        throw new ActionIdentifierError("invalid memo length");
      }

      // todo: ? verify the identifier protocol matches the desired one (i.e. ACTIONS_IDENTITY_SCHEMA.protocol)
      // const protocol = identifier[ACTIONS_IDENTITY_SCHEMA.scheme.protocol];
      let memoIdentity: PublicKey;
      try {
        memoIdentity = new PublicKey(
          identifier[ACTIONS_IDENTITY_SCHEMA.scheme.identity]
        );
      } catch (err) {
        throw new ActionIdentifierError("malformed memo identity");
      }

      if (!memoIdentity)
        throw new ActionIdentifierError("invalid memo identity");
      if (memoIdentity.toBase58() !== identity.toBase58()) {
        throw new ActionIdentifierError("identity mismatch");
      }

      const verified = nacl.sign.detached.verify(
        bs58.decode(identifier[ACTIONS_IDENTITY_SCHEMA.scheme.reference]),
        bs58.decode(identifier[ACTIONS_IDENTITY_SCHEMA.scheme.signature]),
        identity.toBytes()
      );

      if (verified) {
        return {
          verified: true,
          reference: identifier[ACTIONS_IDENTITY_SCHEMA.scheme.reference],
        };
      }
    } catch (err) {
      console.log("error", err);
      // do nothing
    }
  }
  return false;
}