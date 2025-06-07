import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function Login() {
  const { login, logout, user } = usePrivy();
  const [loading, setLoading] = useState(false);

  const handleMetamaskLogin = async () => {
    setLoading(true);
    try {
      await login({
        loginMethod: "metamask",
        onSuccess: () => {
          console.log("Successfully logged in with Metamask");
        },
      });
    } catch (error) {
      console.error("Error logging in with Metamask:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailLogin = async () => {
    setLoading(true);
    try {
      await login({
        loginMethod: "google",
        onSuccess: () => {
          console.log("Successfully logged in with Gmail");
        },
      });
    } catch (error) {
      console.error("Error logging in with Gmail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Welcome, {user?.email || user?.address}!</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleMetamaskLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login with Metamask"}
      </button>
      <button
        onClick={handleGmailLogin}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login with Gmail"}
      </button>
    </div>
  );
}
