"use client";

import React, { useState, useEffect } from 'react';
import { useJourney } from '@/components/journey/JourneyProvider';
import { useBlockchain } from '@/hooks/useBlockchain';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { CONTRACTS, USE_MOCK_CONTRACTS } from '@/contracts/config';

export function FaucetDebug() {
  const { journey, completeMission } = useJourney();
  const { faucetOperations } = useBlockchain();
  const { user, isConnected } = usePrivyAuth();
  const [faucetData, setFaucetData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkFaucetStatus = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const canClaim = await faucetOperations.canClaim();
      const lastClaim = await faucetOperations.getLastClaim();
      
      setFaucetData({
        canClaim,
        lastClaim,
        lastClaimDate: lastClaim > 0 ? new Date(lastClaim) : null,
        userAddress: user?.wallet?.address,
        hasUsedFaucet: lastClaim > 0
      });
    } catch (error) {
      console.error('Erro ao verificar faucet:', error);
      setFaucetData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFaucetStatus();
  }, [isConnected, user]);

  const faucetMission = journey.missions.find(m => m.id === 'faucet');

  if (!isConnected) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>Debug:</strong> Usuário não conectado
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
      <strong>🔍 DEBUG - Status do Faucet</strong>
      
      <div className="mt-2 space-y-1">
        <div><strong>Endereço:</strong> {user?.wallet?.address}</div>
        <div><strong>Usando Mock:</strong> {USE_MOCK_CONTRACTS ? 'Sim' : 'Não'}</div>
        <div><strong>Contrato Faucet:</strong> {CONTRACTS.FAUCET}</div>
        
        <div className="mt-2">
          <strong>Missão Faucet:</strong>
          <ul className="ml-4 list-disc">
            <li>Completa: {faucetMission?.completed ? '✅' : '❌'}</li>
            <li>Desbloqueada: {faucetMission?.unlocked ? '✅' : '❌'}</li>
          </ul>
        </div>

        <div className="mt-2">
          <strong>Journey:</strong>
          <ul className="ml-4 list-disc">
            <li>Missões completas: {journey.completedMissions.join(', ') || 'Nenhuma'}</li>
            <li>Step atual: {journey.currentStep}</li>
          </ul>
        </div>

        {loading ? (
          <div>Carregando dados do faucet...</div>
        ) : faucetData ? (
          <div className="mt-2">
            <strong>Dados do Contrato:</strong>
            <ul className="ml-4 list-disc">
              <li>Pode clamar: {faucetData.canClaim ? '✅' : '❌'}</li>
              <li>Último claim: {faucetData.lastClaim}</li>
              <li>Data último claim: {faucetData.lastClaimDate?.toLocaleString() || 'Nunca'}</li>
              <li>Já usou faucet: {faucetData.hasUsedFaucet ? '✅' : '❌'}</li>
              {faucetData.error && <li className="text-red-600">Erro: {faucetData.error}</li>}
            </ul>
          </div>
        ) : null}

        <div className="mt-3 space-x-2">
          <button
            onClick={checkFaucetStatus}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            disabled={loading}
          >
            Atualizar Status
          </button>
          
          {faucetData?.hasUsedFaucet && !faucetMission?.completed && (
            <button
              onClick={() => completeMission('faucet')}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
            >
              Forçar Completar Missão
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 