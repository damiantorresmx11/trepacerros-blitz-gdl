"use client";

import { useCallback, useMemo } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import {
  CONTRACTS,
  MONAD_CHAIN_ID,
  MAX_REWARD_ID,
} from "@/lib/contracts";
import { REWARD_REGISTRY_ABI, PRIMA_TOKEN_ABI } from "@/lib/abis";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RewardOnChain {
  id: bigint;
  name: string;
  description: string;
  sponsor: `0x${string}`;
  costInPrima: bigint;
  category: number; // 0=IMMEDIATE 1=EXPERIENCE 2=OUTDOOR 3=SUSTAINABILITY 4=DONATION 5=SERVICE 6=MERCH 7=EXCLUSIVE
  stock: bigint;
  imageURI: string;
  active: boolean;
}

export interface UserRedemption {
  id: bigint;
  rewardId: bigint;
  user: `0x${string}`;
  timestamp: bigint;
  voucherCode: `0x${string}`;
  claimed: boolean;
  reward?: RewardOnChain;
}

export interface UseRewardsListReturn {
  rewards: RewardOnChain[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseRedeemRewardReturn {
  redeem: (rewardId: bigint) => Promise<`0x${string}`>;
  txHash: `0x${string}` | undefined;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

export interface UseUserRedemptionsReturn {
  redemptions: UserRedemption[];
  isLoading: boolean;
  refetch: () => void;
}

export interface UseApprovePrimaReturn {
  approve: (amount?: bigint) => Promise<`0x${string}`>;
  txHash: `0x${string}` | undefined;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// useRewardsList
// ─────────────────────────────────────────────────────────────────────────────

// NOTE: The on-chain `rewards(uint256)` mapping getter returns a tuple in this
// exact order (matches struct declaration in RewardRegistry.sol):
//   (id, name, description, sponsor, costInPrima, category, stock, active, imageURI)
// `active` comes before `imageURI`. We build RewardOnChain accordingly.
type RewardTuple = readonly [
  bigint, // id
  string, // name
  string, // description
  `0x${string}`, // sponsor
  bigint, // costInPrima
  number, // category (uint8)
  bigint, // stock
  boolean, // active
  string, // imageURI
];

function rewardTupleToObject(t: RewardTuple): RewardOnChain {
  return {
    id: t[0],
    name: t[1],
    description: t[2],
    sponsor: t[3],
    costInPrima: t[4],
    category: Number(t[5]),
    stock: t[6],
    active: t[7],
    imageURI: t[8],
  };
}

export function useRewardsList(): UseRewardsListReturn {
  const publicClient = usePublicClient({ chainId: MONAD_CHAIN_ID });

  const query = useQuery<RewardOnChain[], Error>({
    queryKey: ["rewardsList", CONTRACTS.REWARD_REGISTRY, MAX_REWARD_ID],
    enabled: Boolean(publicClient),
    staleTime: 120_000,
    refetchInterval: 300_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    queryFn: async (): Promise<RewardOnChain[]> => {
      if (!publicClient) return [];

      const ids = Array.from(
        { length: MAX_REWARD_ID + 1 },
        (_, i) => BigInt(i),
      );

      const tuples = await Promise.all(
        ids.map(async (id) => {
          try {
            const t = (await publicClient.readContract({
              address: CONTRACTS.REWARD_REGISTRY,
              abi: REWARD_REGISTRY_ABI,
              functionName: "rewards",
              args: [id],
            })) as RewardTuple;
            return t;
          } catch {
            return null;
          }
        }),
      );

      const rewards: RewardOnChain[] = [];
      for (const t of tuples) {
        if (!t) continue;
        const r = rewardTupleToObject(t);
        if (!r.active) continue;
        rewards.push(r);
      }
      return rewards;
    },
  });

  return {
    rewards: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: () => {
      void query.refetch();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useRedeemReward
// ─────────────────────────────────────────────────────────────────────────────

export function useRedeemReward(): UseRedeemRewardReturn {
  const {
    writeContractAsync,
    data: txHash,
    isPending: isWritePending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isReceiptLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: MONAD_CHAIN_ID,
  });

  const redeem = useCallback(
    async (rewardId: bigint): Promise<`0x${string}`> => {
      const hash = await writeContractAsync({
        chainId: MONAD_CHAIN_ID,
        abi: REWARD_REGISTRY_ABI,
        address: CONTRACTS.REWARD_REGISTRY,
        functionName: "redeemReward",
        args: [rewardId],
      });
      return hash;
    },
    [writeContractAsync],
  );

  return {
    redeem,
    txHash,
    isPending: isWritePending || isReceiptLoading,
    isSuccess,
    error,
    reset,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useUserRedemptions
// ─────────────────────────────────────────────────────────────────────────────

type RedemptionTuple = readonly [
  bigint, // rewardId
  `0x${string}`, // user
  bigint, // timestamp
  `0x${string}`, // voucherCode (bytes32)
  boolean, // claimed
];

export function useUserRedemptions(
  address: `0x${string}` | undefined,
): UseUserRedemptionsReturn {
  const publicClient = usePublicClient({ chainId: MONAD_CHAIN_ID });
  const { rewards } = useRewardsList();

  const query = useQuery<UserRedemption[], Error>({
    queryKey: ["userRedemptions", CONTRACTS.REWARD_REGISTRY, address],
    enabled: Boolean(address) && Boolean(publicClient),
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    queryFn: async (): Promise<UserRedemption[]> => {
      if (!address || !publicClient) return [];

      const ids = (await publicClient.readContract({
        address: CONTRACTS.REWARD_REGISTRY,
        abi: REWARD_REGISTRY_ABI,
        functionName: "getUserRedemptions",
        args: [address],
      })) as readonly bigint[];

      const tuples = await Promise.all(
        ids.map(async (id) => {
          const t = (await publicClient.readContract({
            address: CONTRACTS.REWARD_REGISTRY,
            abi: REWARD_REGISTRY_ABI,
            functionName: "redemptions",
            args: [id],
          })) as RedemptionTuple;
          return { id, t };
        }),
      );

      return tuples.map(({ id, t }) => ({
        id,
        rewardId: t[0],
        user: t[1],
        timestamp: t[2],
        voucherCode: t[3],
        claimed: t[4],
      }));
    },
  });

  // Join with reward metadata when available.
  const joined = useMemo<UserRedemption[]>(() => {
    const list = query.data ?? [];
    if (rewards.length === 0) return list;
    const byId = new Map<bigint, RewardOnChain>();
    for (const r of rewards) byId.set(r.id, r);
    return list.map((red) => ({
      ...red,
      reward: byId.get(red.rewardId),
    }));
  }, [query.data, rewards]);

  return {
    redemptions: joined,
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useApprovePrima
// ─────────────────────────────────────────────────────────────────────────────

const MAX_UINT256: bigint = 2n ** 256n - 1n;

// NOTE: PrimaToken.burnFrom is `onlyBurner` and does NOT decrement allowance,
// so this approval is technically redundant. Exposed because product spec
// requires it (forward-compat with future ERC20-standard burn flows).
export function useApprovePrima(): UseApprovePrimaReturn {
  const {
    writeContractAsync,
    data: txHash,
    isPending: isWritePending,
    error,
  } = useWriteContract();

  const { isLoading: isReceiptLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: MONAD_CHAIN_ID,
  });

  const approve = useCallback(
    async (amount?: bigint): Promise<`0x${string}`> => {
      const hash = await writeContractAsync({
        chainId: MONAD_CHAIN_ID,
        abi: PRIMA_TOKEN_ABI,
        address: CONTRACTS.PRIMA_TOKEN,
        functionName: "approve",
        args: [CONTRACTS.REWARD_REGISTRY, amount ?? MAX_UINT256],
      });
      return hash;
    },
    [writeContractAsync],
  );

  return {
    approve,
    txHash,
    isPending: isWritePending || isReceiptLoading,
    isSuccess,
    error,
  };
}
