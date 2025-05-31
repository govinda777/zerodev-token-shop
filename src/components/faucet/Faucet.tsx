import { usePrivyAuth } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "@zerodev/sdk";

interface FaucetContract {
  canClaim: (user: string) => Promise<boolean>;
  claimTokens: () => Promise<void>;
}

export default function Faucet() {
  const { user } = usePrivyAuth();
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);

  // Contract configuration
  const contractAddress = process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as string;
  const abi = [
    "function canClaim(address user) view returns (bool)",
    "function claimTokens()"
  ];

  const { data: canClaimData } = useContractRead<FaucetContract>(
    contractAddress,
    abi,
    "canClaim",
    [user?.address || ""]
  );

  const { write: claimTokens } = useContractWrite<FaucetContract>(
    contractAddress,
    abi,
    "claimTokens"
  );

  useEffect(() => {
    if (canClaimData !== undefined) {
      setCanClaim(canClaimData);
    }
  }, [canClaimData]);

  const handleClaim = async () => {
    if (!claimTokens || !user?.address) return;

    setLoading(true);
    try {
      await claimTokens({
        onSuccess: () => {
          console.log("Successfully claimed tokens");
        },
      });
    } catch (error) {
      console.error("Error claiming tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Please login to claim tokens</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-semibold">
        {canClaim ? "You can claim tokens now!" : "You cannot claim tokens yet"}
      </p>
      <button
        onClick={handleClaim}
        disabled={!canClaim || loading}
        className={`px-6 py-2 rounded-lg ${
          canClaim
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        } ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "Claiming..." : canClaim ? "Claim Tokens" : "Wait 24h"}
      </button>
    </div>
  );
}
