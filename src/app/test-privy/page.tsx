"use client";

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

function TestComponent() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Carregando Privy...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste do Privy</h1>
      <div className="space-y-4">
        <p>Status: {ready ? '✅ Pronto' : '❌ Não pronto'}</p>
        <p>Autenticado: {authenticated ? '✅ Sim' : '❌ Não'}</p>
        {user && (
          <div>
            <p>Usuário ID: {user.id}</p>
            <p>Carteira: {user.wallet?.address || 'Nenhuma'}</p>
          </div>
        )}
        <div className="space-x-4">
          {!authenticated ? (
            <button
              onClick={login}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestPrivyPage() {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Erro</h1>
        <p>NEXT_PUBLIC_PRIVY_APP_ID não está configurado</p>
        <p>App ID: {appId || 'undefined'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto">
        <PrivyProvider
          appId={appId}
          config={{
            loginMethods: ['wallet'],
            appearance: {
              theme: 'dark',
            },
          }}
        >
          <TestComponent />
        </PrivyProvider>
      </div>
    </div>
  );
} 