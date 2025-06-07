"use client";

import React, { useState } from 'react';
import { CONTRACTS, USE_MOCK_CONTRACTS } from '@/contracts/config';

export function ContractDebug() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testContractConnection = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      console.log('🧪 Testando conectividade dos contratos...');
      
      const results = {
        mockMode: USE_MOCK_CONTRACTS,
        contracts: {
          token: CONTRACTS.TOKEN,
          faucet: CONTRACTS.FAUCET,
        },
        tests: {}
      };

      // Teste 1: Verificar se os endereços são válidos
      results.tests = {
        tokenAddressValid: CONTRACTS.TOKEN !== '0x...' && CONTRACTS.TOKEN.length === 42,
        faucetAddressValid: CONTRACTS.FAUCET !== '0x...' && CONTRACTS.FAUCET.length === 42,
      };

      // Teste 2: Se não estiver em mock mode, tentar fazer uma chamada simples
      if (!USE_MOCK_CONTRACTS) {
        try {
          // Teste básico de conectividade usando fetch
          const response = await fetch('https://rpc.zerodev.app/api/v3/ca6057ad-912b-4760-ac3d-1f3812d63b12/chain/11155111', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1
            })
          });

          const data = await response.json();
          results.tests.rpcConnection = !!data.result;
          results.tests.blockNumber = data.result;
        } catch (error) {
          results.tests.rpcConnection = false;
          results.tests.rpcError = error.message;
        }
      }

      setTestResults(results);
      console.log('✅ Teste de contratos concluído:', results);

    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
      <strong>🔧 CONTRACT DEBUG</strong>
      
      <div className="mt-2 space-y-1">
        <div><strong>Mock Mode:</strong> {USE_MOCK_CONTRACTS ? 'Sim' : 'Não'}</div>
        <div><strong>Token Contract:</strong> {CONTRACTS.TOKEN}</div>
        <div><strong>Faucet Contract:</strong> {CONTRACTS.FAUCET}</div>
        
        <div className="mt-3">
          <button
            onClick={testContractConnection}
            disabled={loading}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-2"
          >
            {loading ? 'Testando...' : 'Testar Conectividade'}
          </button>
        </div>

        {testResults && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <strong>Resultados do Teste:</strong>
            <pre className="mt-1 text-black">{JSON.stringify(testResults, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 