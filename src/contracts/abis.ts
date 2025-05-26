// ERC-20 Token ABI (simplified)
export const TOKEN_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

// Faucet Contract ABI
export const FAUCET_ABI = [
  // Read functions
  "function tokenAddress() view returns (address)",
  "function faucetAmount() view returns (uint256)",
  "function cooldownTime() view returns (uint256)",
  "function lastClaim(address user) view returns (uint256)",
  "function canClaim(address user) view returns (bool)",
  
  // Write functions
  "function requestTokens() returns (bool)",
  "function setFaucetAmount(uint256 amount)",
  "function setCooldownTime(uint256 time)",
  
  // Events
  "event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event FaucetAmountUpdated(uint256 oldAmount, uint256 newAmount)",
] as const;

// Staking Contract ABI
export const STAKING_ABI = [
  // Read functions
  "function tokenAddress() view returns (address)",
  "function stakingPools(uint256 poolId) view returns (tuple(string name, uint256 apy, uint256 minStake, uint256 lockPeriod))",
  "function userStakes(address user, uint256 poolId) view returns (tuple(uint256 amount, uint256 timestamp, uint256 rewards))",
  "function calculateRewards(address user, uint256 poolId) view returns (uint256)",
  "function totalStaked(uint256 poolId) view returns (uint256)",
  
  // Write functions
  "function stake(uint256 poolId, uint256 amount) returns (bool)",
  "function unstake(uint256 poolId, uint256 amount) returns (bool)",
  "function claimRewards(uint256 poolId) returns (bool)",
  "function emergencyWithdraw(uint256 poolId) returns (bool)",
  
  // Events
  "event Staked(address indexed user, uint256 indexed poolId, uint256 amount, uint256 timestamp)",
  "event Unstaked(address indexed user, uint256 indexed poolId, uint256 amount, uint256 timestamp)",
  "event RewardsClaimed(address indexed user, uint256 indexed poolId, uint256 rewards, uint256 timestamp)",
] as const;

// NFT Contract ABI (ERC-721)
export const NFT_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function totalSupply() view returns (uint256)",
  
  // Write functions
  "function approve(address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function mint(address to, string memory uri) returns (uint256)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
] as const;

// NFT Marketplace ABI
export const NFT_MARKETPLACE_ABI = [
  // Read functions
  "function nftContract() view returns (address)",
  "function tokenContract() view returns (address)",
  "function listings(uint256 tokenId) view returns (tuple(address seller, uint256 price, bool active))",
  "function isListed(uint256 tokenId) view returns (bool)",
  "function getListingPrice(uint256 tokenId) view returns (uint256)",
  
  // Write functions
  "function listNFT(uint256 tokenId, uint256 price) returns (bool)",
  "function buyNFT(uint256 tokenId) returns (bool)",
  "function cancelListing(uint256 tokenId) returns (bool)",
  "function updatePrice(uint256 tokenId, uint256 newPrice) returns (bool)",
  
  // Events
  "event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 timestamp)",
  "event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 timestamp)",
  "event ListingCancelled(uint256 indexed tokenId, address indexed seller, uint256 timestamp)",
] as const;

// Airdrop Contract ABI
export const AIRDROP_ABI = [
  // Read functions
  "function tokenAddress() view returns (address)",
  "function nftContract() view returns (address)",
  "function airdropAmount() view returns (uint256)",
  "function hasReceivedAirdrop(address user) view returns (bool)",
  "function isEligible(address user) view returns (bool)",
  "function totalClaimed() view returns (uint256)",
  
  // Write functions
  "function claimAirdrop() returns (bool)",
  "function setAirdropAmount(uint256 amount)",
  "function addEligibleUsers(address[] memory users)",
  "function removeEligibleUsers(address[] memory users)",
  
  // Events
  "event AirdropClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event AirdropAmountUpdated(uint256 oldAmount, uint256 newAmount)",
  "event EligibilityUpdated(address indexed user, bool eligible)",
] as const;

// Subscription Contract ABI
export const SUBSCRIPTION_ABI = [
  // Read functions
  "function tokenAddress() view returns (address)",
  "function subscriptionPlans(uint256 planId) view returns (tuple(string name, uint256 price, uint256 duration))",
  "function userSubscriptions(address user) view returns (tuple(uint256 planId, uint256 startTime, uint256 endTime, bool active))",
  "function isSubscriptionActive(address user) view returns (bool)",
  "function getSubscriptionEndTime(address user) view returns (uint256)",
  
  // Write functions
  "function subscribe(uint256 planId) returns (bool)",
  "function renewSubscription(uint256 planId) returns (bool)",
  "function cancelSubscription() returns (bool)",
  
  // Events
  "event Subscribed(address indexed user, uint256 indexed planId, uint256 startTime, uint256 endTime)",
  "event SubscriptionRenewed(address indexed user, uint256 indexed planId, uint256 newEndTime)",
  "event SubscriptionCancelled(address indexed user, uint256 timestamp)",
] as const;

// Passive Income Contract ABI
export const PASSIVE_INCOME_ABI = [
  // Read functions
  "function tokenAddress() view returns (address)",
  "function subscriptionContract() view returns (address)",
  "function dailyRate() view returns (uint256)",
  "function userDeposits(address user) view returns (uint256)",
  "function calculatePendingRewards(address user) view returns (uint256)",
  "function lastClaimTime(address user) view returns (uint256)",
  "function isActive(address user) view returns (bool)",
  
  // Write functions
  "function activatePassiveIncome() returns (bool)",
  "function deactivatePassiveIncome() returns (bool)",
  "function claimRewards() returns (bool)",
  "function deposit(uint256 amount) returns (bool)",
  "function withdraw(uint256 amount) returns (bool)",
  
  // Events
  "event PassiveIncomeActivated(address indexed user, uint256 timestamp)",
  "event PassiveIncomeDeactivated(address indexed user, uint256 timestamp)",
  "event RewardsClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event Deposited(address indexed user, uint256 amount, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)",
] as const; 