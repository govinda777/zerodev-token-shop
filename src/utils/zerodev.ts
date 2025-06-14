import { 
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getEntryPoint } from "@zerodev/sdk/constants";

// Chain configuration
export const chain = sepolia;

// Paymaster configuration
export const PAYMASTER_CONFIG = {
  // Verifying Paymaster
  VERIFYING_PAYMASTER: "0xd740b875E8b2B1Ec94b624403f5a3427984cF458",
  // ERC20 Paymaster
  ERC20_PAYMASTER: "0xe6Cc06Dd1447f31036e3F0347E8E6a6bEd8B5D42",
  // RPC with selfFunded=true
  SELF_FUNDED_RPC: "https://rpc.zerodev.app/api/v3/ca6057ad-912b-4760-ac3d-1f3812d63b12/chain/11155111?selfFunded=true"
} as const;

// Paymaster types
export type PaymasterType = 'default' | 'erc20' | 'verifying';

// Create public client for blockchain interactions
export const createClient = () => {
  const zerodevRPC = process.env.NEXT_PUBLIC_ZERODEV_RPC;
  if (!zerodevRPC) {
    throw new Error("NEXT_PUBLIC_ZERODEV_RPC environment variable is not set");
  }

  return createPublicClient({
    transport: http(zerodevRPC),
    chain,
  });
};

// Create public client with self-funded RPC
export const createSelfFundedClient = () => {
  return createPublicClient({
    transport: http(PAYMASTER_CONFIG.SELF_FUNDED_RPC),
    chain,
  });
};

// Create paymaster client based on type
export const createPaymasterClient = (type: PaymasterType = 'default') => {
  const rpcUrl = PAYMASTER_CONFIG.SELF_FUNDED_RPC;
  
  // All paymaster types use the same client, difference is in usage
  return createZeroDevPaymasterClient({
    chain,
    transport: http(rpcUrl),
  });
};

// Create a kernel account client for a user with a private key
export const createKernelClientForUser = async (
  privateKey: string, 
  paymasterType: PaymasterType = 'default'
) => {
  const zerodevRPC = PAYMASTER_CONFIG.SELF_FUNDED_RPC;

  // Create signer from private key
  const signer = privateKeyToAccount(privateKey as `0x${string}`);
  
  // Get entryPoint
  const entryPoint = getEntryPoint("0.7");

  // Public client with self-funded RPC
  const publicClient = createPublicClient({
    transport: http(zerodevRPC),
    chain,
  });

  // Create ECDSA validator from signer
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
    kernelVersion: KERNEL_V3_1,
  });

  // Create kernel account
  const account = await createKernelAccount(publicClient, {
    entryPoint,
    plugins: {
      sudo: ecdsaValidator,
    },
    kernelVersion: KERNEL_V3_1,
  });

  // Create paymaster client based on type
  const paymasterClient = createPaymasterClient(paymasterType);

  // Create kernel account client
  const kernelClient = createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(zerodevRPC),
    paymaster: {
      getPaymasterData(userOperation) {
        return paymasterClient.sponsorUserOperation({ userOperation });
      },
    },
  });

  return {
    kernelClient,
    account,
    accountAddress: account.address,
    paymasterType,
  };
};

// Create kernel client with verifying paymaster
export const createKernelClientWithVerifyingPaymaster = async (privateKey: string) => {
  return createKernelClientForUser(privateKey, 'verifying');
};

// Create kernel client with ERC20 paymaster
export const createKernelClientWithERC20Paymaster = async (privateKey: string) => {
  return createKernelClientForUser(privateKey, 'erc20');
};

// Generate a new private key for a user
export const generateNewPrivateKey = (): string => {
  return generatePrivateKey();
};

// Simplify wallet address for display
export const simplifyAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Utility function to get paymaster info
export const getPaymasterInfo = (type: PaymasterType) => {
  switch (type) {
    case 'verifying':
      return {
        name: 'Verifying Paymaster',
        address: PAYMASTER_CONFIG.VERIFYING_PAYMASTER,
        description: 'Sponsored transactions with verification'
      };
    case 'erc20':
      return {
        name: 'ERC20 Paymaster',
        address: PAYMASTER_CONFIG.ERC20_PAYMASTER,
        description: 'Pay gas fees with ERC20 tokens'
      };
    default:
      return {
        name: 'Default Paymaster',
        address: 'ZeroDev Default',
        description: 'Default ZeroDev paymaster'
      };
  }
}; 