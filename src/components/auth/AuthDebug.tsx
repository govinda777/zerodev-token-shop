"use client";

export function AuthDebug() {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 border border-red-600 rounded-lg p-4 text-xs text-white max-w-sm z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🔧 DEBUG ACTIVE</h3>
      <div>NODE_ENV: {process.env.NODE_ENV}</div>
      <div>PRIVY_APP_ID: {process.env.NEXT_PUBLIC_PRIVY_APP_ID ? 'SET' : 'MISSING'}</div>
    </div>
  );
} 