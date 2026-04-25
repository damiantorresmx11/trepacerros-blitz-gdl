"use client";

import { useCallback, useMemo } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatUnits, parseAbiItem, type Log } from "viem";
import { CONTRACTS, MONAD_CHAIN_ID } from "@/lib/contracts";
import { RASTRO_NFT_ABI, PRIMA_TOKEN_ABI } from "@/lib/abis";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RastroOnChain {
  hiker: `0x${string}`;
  distanceMeters: bigint;
  durationSeconds: bigint;
  trashGrams: bigint;
  trashType: number; // 0=MIXED 1=PET 2=GLASS 3=METAL 4=ORGANIC 5=HAZARDOUS_REPORT
  trailType: number; // 0=PRIMAVERA 1=COLLI 2=COLOMOS 3=METROPOLITANO 4=OTHER
  officialCheckpoint: boolean;
  timestamp: bigint;
}

export interface MintHikeArgs {
  to: `0x${string}`;
  tokenURI: string;
  distanceMeters: bigint;
  durationSeconds: bigint;
  trashGrams: bigint;
  trashType: number;
  trailType: number;
  officialCheckpoint: boolean;
}

export interface UserNFT {
  tokenId: bigint;
  rastro: RastroOnChain;
  tokenURI: string;
}

export interface UseMintHikeReturn {
  mintHike: (args: MintHikeArgs) => Promise<`0x${string}`>;
  txHash: `0x${string}` | undefined;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

export interface UsePrimaBalanceReturn {
  balance: bigint;
  formatted: string;
  isLoading: boolean;
  refetch: () => void;
}

export interface UseUserNFTsReturn {
  nfts: UserNFT[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseHikerStatsReturn {
  totalKg: bigint;
  hikes: bigint;
  isLoading: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// useMintHike
// ─────────────────────────────────────────────────────────────────────────────

export function useMintHike(): UseMintHikeReturn {
  const {
    writeContractAsync,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isReceiptLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: MONAD_CHAIN_ID,
  });

  const mintHike = useCallback(
    async (args: MintHikeArgs): Promise<`0x${string}`> => {
      const hash = await writeContractAsync({
        chainId: MONAD_CHAIN_ID,
        abi: RASTRO_NFT_ABI,
        address: CONTRACTS.RASTRO_NFT,
        functionName: "mintRastro",
        args: [
          args.to,
          args.tokenURI,
          args.distanceMeters,
          args.durationSeconds,
          args.trashGrams,
          args.trashType,
          args.trailType,
          args.officialCheckpoint,
        ],
      });
      return hash;
    },
    [writeContractAsync],
  );

  return {
    mintHike,
    txHash,
    isPending: isWritePending || isReceiptLoading,
    isSuccess,
    error: writeError,
    reset,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// usePrimaBalance
// ─────────────────────────────────────────────────────────────────────────────

export function usePrimaBalance(
  address: `0x${string}` | undefined,
): UsePrimaBalanceReturn {
  const { data, isLoading, refetch } = useReadContract({
    chainId: MONAD_CHAIN_ID,
    abi: PRIMA_TOKEN_ABI,
    address: CONTRACTS.PRIMA_TOKEN,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
    },
  });

  const balance: bigint = (data as bigint | undefined) ?? 0n;

  const formatted = useMemo(() => {
    const raw = formatUnits(balance, 18);
    // Trim to 2 decimals.
    const dot = raw.indexOf(".");
    if (dot === -1) return raw;
    return raw.slice(0, dot + 3);
  }, [balance]);

  return {
    balance,
    formatted,
    isLoading,
    refetch: () => {
      void refetch();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useUserNFTs
// ─────────────────────────────────────────────────────────────────────────────

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

// RastroNFT was deployed around this block on Monad testnet
const RASTRO_NFT_DEPLOY_BLOCK = 27651400n;
const LOG_CHUNK_SIZE = 2000n;

interface TransferLogArgs {
  from?: `0x${string}`;
  to?: `0x${string}`;
  tokenId?: bigint;
}

async function getPaginatedLogs(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  address: `0x${string}`,
  toAddress: `0x${string}`,
): Promise<Array<Log & { args: TransferLogArgs }>> {
  const latestBlock = await publicClient.getBlockNumber();
  const allLogs: Array<Log & { args: TransferLogArgs }> = [];

  let toBlock = latestBlock;
  let fromBlock = toBlock > LOG_CHUNK_SIZE
    ? toBlock - LOG_CHUNK_SIZE + 1n
    : RASTRO_NFT_DEPLOY_BLOCK;
  if (fromBlock < RASTRO_NFT_DEPLOY_BLOCK) fromBlock = RASTRO_NFT_DEPLOY_BLOCK;

  while (toBlock >= RASTRO_NFT_DEPLOY_BLOCK) {
    try {
      const chunk = (await publicClient.getLogs({
        address,
        event: TRANSFER_EVENT,
        args: { to: toAddress },
        fromBlock,
        toBlock,
      })) as Array<Log & { args: TransferLogArgs }>;
      allLogs.push(...chunk);
    } catch {
      // If chunk is still too large, silently skip (best-effort)
    }

    if (fromBlock <= RASTRO_NFT_DEPLOY_BLOCK) break;
    toBlock = fromBlock - 1n;
    fromBlock = toBlock > LOG_CHUNK_SIZE
      ? toBlock - LOG_CHUNK_SIZE + 1n
      : RASTRO_NFT_DEPLOY_BLOCK;
    if (fromBlock < RASTRO_NFT_DEPLOY_BLOCK) fromBlock = RASTRO_NFT_DEPLOY_BLOCK;
  }

  return allLogs;
}

export function useUserNFTs(
  address: `0x${string}` | undefined,
): UseUserNFTsReturn {
  const publicClient = usePublicClient({ chainId: MONAD_CHAIN_ID });

  const query = useQuery<UserNFT[], Error>({
    queryKey: ["userNFTs", CONTRACTS.RASTRO_NFT, address],
    enabled: Boolean(address) && Boolean(publicClient),
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    queryFn: async (): Promise<UserNFT[]> => {
      if (!address || !publicClient) return [];

      // 1. Get Transfer logs in paginated chunks to avoid 413 errors
      const logs = await getPaginatedLogs(publicClient, CONTRACTS.RASTRO_NFT, address);

      // 2. Collect unique tokenIds
      const tokenIdSet = new Set<bigint>();
      for (const log of logs) {
        const id = log.args.tokenId;
        if (typeof id === "bigint") tokenIdSet.add(id);
      }
      const candidateIds = Array.from(tokenIdSet);

      // 3. Verify current ownership (filter out NFTs transferred away)
      const ownerChecks = await Promise.all(
        candidateIds.map(async (tokenId) => {
          try {
            const owner = (await publicClient.readContract({
              address: CONTRACTS.RASTRO_NFT,
              abi: RASTRO_NFT_ABI,
              functionName: "ownerOf",
              args: [tokenId],
            })) as `0x${string}`;
            return owner.toLowerCase() === address.toLowerCase()
              ? tokenId
              : null;
          } catch {
            // tokenId may have been burned or otherwise reverted
            return null;
          }
        }),
      );
      const ownedIds = ownerChecks.filter(
        (v): v is bigint => v !== null,
      );

      // 4. Fetch rastro + tokenURI for each owned id in parallel
      const nfts = await Promise.all(
        ownedIds.map(async (tokenId): Promise<UserNFT> => {
          const [rastroRaw, uri] = await Promise.all([
            publicClient.readContract({
              address: CONTRACTS.RASTRO_NFT,
              abi: RASTRO_NFT_ABI,
              functionName: "getRastro",
              args: [tokenId],
            }),
            publicClient.readContract({
              address: CONTRACTS.RASTRO_NFT,
              abi: RASTRO_NFT_ABI,
              functionName: "tokenURI",
              args: [tokenId],
            }),
          ]);

          const r = rastroRaw as {
            hiker: `0x${string}`;
            distanceMeters: bigint;
            durationSeconds: bigint;
            trashGrams: bigint;
            trashType: number;
            trailType: number;
            officialCheckpoint: boolean;
            timestamp: bigint;
          };

          return {
            tokenId,
            rastro: {
              hiker: r.hiker,
              distanceMeters: r.distanceMeters,
              durationSeconds: r.durationSeconds,
              trashGrams: r.trashGrams,
              trashType: Number(r.trashType),
              trailType: Number(r.trailType),
              officialCheckpoint: r.officialCheckpoint,
              timestamp: r.timestamp,
            },
            tokenURI: uri as string,
          };
        }),
      );

      // Sort newest-first by timestamp
      nfts.sort((a, b) =>
        a.rastro.timestamp > b.rastro.timestamp
          ? -1
          : a.rastro.timestamp < b.rastro.timestamp
            ? 1
            : 0,
      );

      return nfts;
    },
  });

  return {
    nfts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: () => {
      void query.refetch();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useHikerStats
// ─────────────────────────────────────────────────────────────────────────────

export function useHikerStats(
  address: `0x${string}` | undefined,
): UseHikerStatsReturn {
  const { data, isLoading } = useReadContract({
    chainId: MONAD_CHAIN_ID,
    abi: RASTRO_NFT_ABI,
    address: CONTRACTS.RASTRO_NFT,
    functionName: "getHikerStats",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
    },
  });

  const tuple = data as readonly [bigint, bigint] | undefined;

  return {
    totalKg: tuple?.[0] ?? 0n,
    hikes: tuple?.[1] ?? 0n,
    isLoading,
  };
}
