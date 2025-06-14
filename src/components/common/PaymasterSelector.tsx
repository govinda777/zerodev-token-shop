"use client";

import { useState } from 'react';
import { PaymasterType, getPaymasterInfo, PAYMASTER_CONFIG } from '@/utils/zerodev';

interface PaymasterSelectorProps {
  selectedPaymaster: PaymasterType;
  onPaymasterChange: (type: PaymasterType) => void;
  className?: string;
}

export function PaymasterSelector({
  selectedPaymaster,
  onPaymasterChange,
  className = ""
}: PaymasterSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const paymasterTypes: PaymasterType[] = ['default', 'verifying', 'erc20'];

  const getPaymasterIcon = (type: PaymasterType) => {
    switch (type) {
      case 'verifying':
        return '🔐';
      case 'erc20':
        return '💰';
      default:
        return '⚡';
    }
  };

  const getPaymasterColor = (type: PaymasterType) => {
    switch (type) {
      case 'verifying':
        return 'border-green-500 bg-green-500/10';
      case 'erc20':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            🚀 Configuração de Paymaster
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-white/60 hover:text-white text-sm"
          >
            {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
          </button>
        </div>

        <div className="space-y-3">
          {paymasterTypes.map((type) => {
            const info = getPaymasterInfo(type);
            const isSelected = selectedPaymaster === type;
            
            return (
              <div
                key={type}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? getPaymasterColor(type) 
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                  }
                `}
                onClick={() => onPaymasterChange(type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getPaymasterIcon(type)}</span>
                    <div>
                      <h4 className="text-white font-medium">{info.name}</h4>
                      <p className="text-white/60 text-sm">{info.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <span className="text-green-400 text-sm">✓ Ativo</span>
                    )}
                    <div className={`
                      w-4 h-4 rounded-full border-2
                      ${isSelected ? 'bg-current border-current' : 'border-white/40'}
                    `} />
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-white/60 space-y-1">
                      <div>
                        <strong>Endereço:</strong> {info.address}
                      </div>
                      {type === 'verifying' && (
                        <div className="text-green-400">
                          ✅ Transações patrocinadas com verificação adicional
                        </div>
                      )}
                      {type === 'erc20' && (
                        <div className="text-yellow-400">
                          💰 Pague taxas de gas com tokens ERC20
                        </div>
                      )}
                      {type === 'default' && (
                        <div className="text-blue-400">
                          ⚡ Paymaster padrão do ZeroDev
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-green-400 text-lg">💡</span>
            <div>
              <h4 className="text-green-400 font-medium text-sm">
                Self-Funded RPC Ativo
              </h4>
              <p className="text-green-300 text-xs mt-1">
                O RPC está configurado com selfFunded=true para evitar erros de fundos insuficientes.
              </p>
              <p className="text-green-300/80 text-xs mt-1">
                RPC: {PAYMASTER_CONFIG.SELF_FUNDED_RPC}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 