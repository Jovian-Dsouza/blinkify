"use client";
import React from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { createContext, ReactNode, useContext, useMemo } from "react";

export interface Cluster {
  name: string;
  endpoint: string;
  networkName: string;
}

export const defaultClusters: Cluster[] = [
  {
    name: "mainnet",
    networkName: "SOLANA",
    endpoint:
      process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC ||
      clusterApiUrl("mainnet-beta"),
  },
  {
    name: "devnet",
    networkName: "SOLANA_DEVNET",
    endpoint:
      process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || clusterApiUrl("devnet"),
  },
];

export interface ClusterProviderContext {
  cluster: Cluster;
  getExplorerUrl: (path: string) => string;
}

const Context = createContext<ClusterProviderContext>(
  {} as ClusterProviderContext,
);

export type networkType = "mainnet" | "devnet"

export function ClusterProvider({
  children,
  network,
}: {
  children: ReactNode;
  network: networkType;
}) {
  const cluster = useMemo(
    () =>
      defaultClusters.find((item) => item.name === network) ||
      defaultClusters[0],
    [network],
  );

  const getExplorerUrl = (path: string) =>
    `https://solscan.io/${path}${getClusterUrlParam(cluster)}`;

  const value = useMemo(
    () => ({
      cluster,
      getExplorerUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cluster],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCluster() {
  return useContext(Context);
}

function getClusterUrlParam(cluster: Cluster): string {
  const urlParam = cluster.name === "mainnet" ? "" : `?cluster=${cluster.name}`;
  return urlParam;
}
