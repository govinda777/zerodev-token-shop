// ERC-20 Token ABI (simplified)
export const TOKEN_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{"type": "uint8", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"type": "address", "name": "owner"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {"type": "address", "name": "owner"},
      {"type": "address", "name": "spender"}
    ],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"type": "address", "name": "spender"},
      {"type": "uint256", "name": "amount"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {"type": "address", "name": "from"},
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {"type": "address", "name": "from", "indexed": true},
      {"type": "address", "name": "to", "indexed": true},
      {"type": "uint256", "name": "value", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {"type": "address", "name": "owner", "indexed": true},
      {"type": "address", "name": "spender", "indexed": true},
      {"type": "uint256", "name": "value", "indexed": false}
    ]
  }
] as const;

// Faucet Contract ABI
export const FAUCET_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "tokenAddress",
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "faucetAmount",
    "inputs": [],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cooldownTime",
    "inputs": [],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastClaim",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "canClaim",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "requestTokens",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setFaucetAmount",
    "inputs": [{"type": "uint256", "name": "amount"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCooldownTime",
    "inputs": [{"type": "uint256", "name": "time"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "TokensClaimed",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "FaucetAmountUpdated",
    "inputs": [
      {"type": "uint256", "name": "oldAmount", "indexed": false},
      {"type": "uint256", "name": "newAmount", "indexed": false}
    ]
  }
] as const;

// Staking Contract ABI
export const STAKING_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "tokenAddress",
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "stakingPools",
    "inputs": [{"type": "uint256", "name": "poolId"}],
    "outputs": [{
      "type": "tuple",
      "name": "",
      "components": [
        {"type": "string", "name": "name"},
        {"type": "uint256", "name": "apy"},
        {"type": "uint256", "name": "minStake"},
        {"type": "uint256", "name": "lockPeriod"}
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userStakes",
    "inputs": [
      {"type": "address", "name": "user"},
      {"type": "uint256", "name": "poolId"}
    ],
    "outputs": [{
      "type": "tuple",
      "name": "",
      "components": [
        {"type": "uint256", "name": "amount"},
        {"type": "uint256", "name": "timestamp"},
        {"type": "uint256", "name": "rewards"}
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateRewards",
    "inputs": [
      {"type": "address", "name": "user"},
      {"type": "uint256", "name": "poolId"}
    ],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalStaked",
    "inputs": [{"type": "uint256", "name": "poolId"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "stake",
    "inputs": [
      {"type": "uint256", "name": "poolId"},
      {"type": "uint256", "name": "amount"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unstake",
    "inputs": [
      {"type": "uint256", "name": "poolId"},
      {"type": "uint256", "name": "amount"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [{"type": "uint256", "name": "poolId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "emergencyWithdraw",
    "inputs": [{"type": "uint256", "name": "poolId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "Staked",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "poolId", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "Unstaked",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "poolId", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "RewardsClaimed",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "poolId", "indexed": true},
      {"type": "uint256", "name": "rewards", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  }
] as const;

// NFT Contract ABI (ERC-721)
export const NFT_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"type": "address", "name": "owner"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {"type": "address", "name": "owner"},
      {"type": "address", "name": "operator"}
    ],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "tokenId"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {"type": "address", "name": "operator"},
      {"type": "bool", "name": "approved"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {"type": "address", "name": "from"},
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "tokenId"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {"type": "address", "name": "from"},
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "tokenId"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "string", "name": "uri"}
    ],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {"type": "address", "name": "from", "indexed": true},
      {"type": "address", "name": "to", "indexed": true},
      {"type": "uint256", "name": "tokenId", "indexed": true}
    ]
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {"type": "address", "name": "owner", "indexed": true},
      {"type": "address", "name": "approved", "indexed": true},
      {"type": "uint256", "name": "tokenId", "indexed": true}
    ]
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {"type": "address", "name": "owner", "indexed": true},
      {"type": "address", "name": "operator", "indexed": true},
      {"type": "bool", "name": "approved", "indexed": false}
    ]
  }
] as const;

// NFT Marketplace ABI - simplified
export const NFT_MARKETPLACE_ABI = [
  {
    "type": "function",
    "name": "isListed",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getListingPrice",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "buyNFT",
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  }
] as const;

// Airdrop Contract ABI - simplified
export const AIRDROP_ABI = [
  {
    "type": "function",
    "name": "hasReceivedAirdrop",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isEligible",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimAirdrop",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  }
] as const;

// Subscription Contract ABI
export const SUBSCRIPTION_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "tokenAddress",
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "subscriptionPlans",
    "inputs": [{"type": "uint256", "name": "planId"}],
    "outputs": [{
      "type": "tuple",
      "name": "",
      "components": [
        {"type": "string", "name": "name"},
        {"type": "uint256", "name": "price"},
        {"type": "uint256", "name": "duration"}
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userSubscriptions",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{
      "type": "tuple",
      "name": "",
      "components": [
        {"type": "uint256", "name": "planId"},
        {"type": "uint256", "name": "startTime"},
        {"type": "uint256", "name": "endTime"},
        {"type": "bool", "name": "active"}
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isSubscriptionActive",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSubscriptionEndTime",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "subscribe",
    "inputs": [{"type": "uint256", "name": "planId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renewSubscription",
    "inputs": [{"type": "uint256", "name": "planId"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelSubscription",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "Subscribed",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "planId", "indexed": true},
      {"type": "uint256", "name": "startTime", "indexed": false},
      {"type": "uint256", "name": "endTime", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "SubscriptionRenewed",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "planId", "indexed": true},
      {"type": "uint256", "name": "newEndTime", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "SubscriptionCancelled",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  }
] as const;

// Passive Income Contract ABI
export const PASSIVE_INCOME_ABI = [
  // Read functions
  {
    "type": "function",
    "name": "tokenAddress",
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "subscriptionContract",
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "dailyRate",
    "inputs": [],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userDeposits",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculatePendingRewards",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastClaimTime",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isActive",
    "inputs": [{"type": "address", "name": "user"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view"
  },
  
  // Write functions
  {
    "type": "function",
    "name": "activatePassiveIncome",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deactivatePassiveIncome",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deposit",
    "inputs": [{"type": "uint256", "name": "amount"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [{"type": "uint256", "name": "amount"}],
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable"
  },
  
  // Events
  {
    "type": "event",
    "name": "PassiveIncomeActivated",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "PassiveIncomeDeactivated",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "RewardsClaimed",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {"type": "address", "name": "user", "indexed": true},
      {"type": "uint256", "name": "amount", "indexed": false},
      {"type": "uint256", "name": "timestamp", "indexed": false}
    ]
  }
] as const; 