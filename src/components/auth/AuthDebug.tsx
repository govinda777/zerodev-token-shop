"use client";

export function AuthDebug() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    ZERODEV_PROJECT_ID: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
    ZERODEV_RPC: process.env.NEXT_PUBLIC_ZERODEV_RPC,
    CHAIN: process.env.NEXT_PUBLIC_CHAIN,
  };

  return (
    <div className="fixed top-4 right-4 bg-red-500 border border-red-600 rounded-lg p-4 text-xs text-white max-w-sm z-50 max-h-64 overflow-y-auto">
      <h3 className="font-bold mb-2 text-yellow-400">🔧 ENV DEBUG</h3>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="font-semibold">{key}:</span> {
            value ? (
              <span className="text-green-300">
                {key.includes('APP_ID') || key.includes('PROJECT_ID') ? 
                  `${value.substring(0, 8)}...` : 
                  value
                }
              </span>
            ) : (
              <span className="text-red-300">MISSING</span>
            )
          }
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-red-400">
        <div className="text-yellow-300 text-xs">
          URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}
        </div>
      </div>
    </div>
  );
} 