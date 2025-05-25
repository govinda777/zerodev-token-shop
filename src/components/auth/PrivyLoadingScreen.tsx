"use client";

import { useEffect, useState } from "react";

export function PrivyLoadingScreen() {
  const [dots, setDots] = useState('');
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Mostrar troubleshooting após 8 segundos
    const timeout = setTimeout(() => {
      setShowTroubleshooting(true);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen gradient-background">
      <div className="text-center max-w-md">
        <div className="loading-spinner mx-auto mb-6 w-16 h-16"></div>
        <h2 className="text-h2 font-bold text-white mb-3">Inicializando autenticação</h2>
        <p className="text-body text-gray-400 mb-6">
          Conectando com o Privy{dots}
        </p>
        
        {showTroubleshooting && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">Demorou mais que o esperado?</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Verifique sua conexão com a internet</p>
              <p>• Tente recarregar a página</p>
              <p>• Desative bloqueadores de anúncios temporariamente</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary btn-sm w-full mt-4"
            >
              Recarregar Página
            </button>
          </div>
        )}
        
        <div className="mt-6 text-xs text-gray-500">
          Powered by Privy
        </div>
      </div>
    </div>
  );
} 