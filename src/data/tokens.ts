import { images } from "./assets";

const devnetTokens: Token[] = [
  {
    name: "USDC_DEVNET",
    symbol: "USDC",
    icon: images.tokens.usdc,
    blockchain: "SOL_DEVNET",
    blockchainIcon: images.tokens.sol,
    decimals: 6,
    address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  },
];

const mainnetTokens: Token[] = [
  {
    name: "USDC",
    symbol: "USDC",
    icon: images.tokens.usdc,
    blockchain: "SOL",
    blockchainIcon: images.tokens.sol,
    decimals: 6,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "SOL",
    blockchainIcon: images.tokens.sol,
    decimals: 6,
    address: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
  },
];

export const tokens = process.env.NEXT_PUBLIC_NETWORK === "devnet" ? devnetTokens : mainnetTokens;

export interface Token {
  name: string;
  symbol: string;
  icon: string;
  blockchain: string;
  blockchainIcon: string;
  decimals: number;
  address: string;
}

export function getTokenByAddress(address: string): Token | undefined {
  return tokens.find(token => token.address === address);
}