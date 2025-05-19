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

// Create a kernel account client for a user with a private key
export const createKernelClientForUser = async (privateKey: string) => {
  const zerodevRPC = process.env.NEXT_PUBLIC_ZERODEV_RPC;
  if (!zerodevRPC) {
    throw new Error("NEXT_PUBLIC_ZERODEV_RPC environment variable is not set");
  }

  // Create signer from private key
  const signer = privateKeyToAccount(privateKey as `0x${string}`);
  
  // Get entryPoint
  const entryPoint = getEntryPoint("0.7");

  // Public client
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

  // Create ZeroDev paymaster client
  const zerodevPaymaster = createZeroDevPaymasterClient({
    chain,
    transport: http(zerodevRPC),
  });

  // Create kernel account client
  const kernelClient = createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(zerodevRPC),
    paymaster: {
      getPaymasterData(userOperation) {
        return zerodevPaymaster.sponsorUserOperation({ userOperation });
      },
    },
  });

  return {
    kernelClient,
    account,
    accountAddress: account.address,
  };
};

// Generate a new private key for a user
export const generateNewPrivateKey = (): string => {
  return generatePrivateKey();
};

// Simplify wallet address for display
export const simplifyAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}; 