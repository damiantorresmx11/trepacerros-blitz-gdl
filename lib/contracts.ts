export const BLITZ_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export const BLITZ_COLLECTION_ABI = [
  {
    "inputs": [{"type": "string", "name": "baseURI"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}, {"type": "uint256", "name": "amount"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256[]", "name": "tokenIds"}, {"type": "uint256[]", "name": "amounts"}],
    "name": "mintBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "account"}, {"type": "uint256", "name": "id"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "getItemInfo",
    "outputs": [
      {"type": "string", "name": "itemName"},
      {"type": "uint256", "name": "currentSupply"},
      {"type": "uint256", "name": "maxItemSupply"},
      {"type": "bool", "name": "available"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalItems",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "tokenNames",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "maxSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ============================================================
// Rastros — deployed to Monad testnet (chain id 10143)
// ============================================================

export const CONTRACTS = {
  PRIMA_TOKEN: "0xd4Bf2c611f382Cd51ff484276CE6c008016de881" as const,
  RASTRO_NFT: "0xa224e1861601B2AEce025eb0999CB97833659d22" as const,
  REWARD_REGISTRY: "0x4327566658bA16a37d804e8738AD283170a53b27" as const,
} as const;

export const MONAD_CHAIN_ID = 10143;

// Highest reward id seeded in Deploy.s.sol (41 rewards: ids 0..40 inclusive).
// `_nextRewardId` is private on RewardRegistry, so the frontend iterates 0..MAX_REWARD_ID.
export const MAX_REWARD_ID = 43;

