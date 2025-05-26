"use client";

import { useTokens } from '@/hooks/useTokens';
import { useEffect, useState } from 'react';

export function WelcomeNotification() {
  const { showWelcomeNotification, welcomeReward, dismissWelcomeNotification } = useTokens();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showWelcomeNotification) {
      // Delay to allow for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [showWelcomeNotification]);

  if (!showWelcomeNotification) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-500 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-2xl border border-purple-400/30 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">🎉 Bem-vindo!</h3>
              <p className="text-white/90 text-sm mb-2">
                Você recebeu <span className="font-bold text-yellow-300">{welcomeReward} tokens</span> de boas-vindas!
              </p>
              <p className="text-white/70 text-xs">
                Use seus tokens para comprar produtos no marketplace.
              </p>
            </div>
          </div>
          <button
            onClick={dismissWelcomeNotification}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors ml-2"
            aria-label="Fechar notificação"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-[10000ms] ease-linear"
              style={{ width: isVisible ? '0%' : '100%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
} 