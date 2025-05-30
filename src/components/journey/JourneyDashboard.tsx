"use client";

import React from 'react';
import { useJourney } from './JourneyProvider';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/hooks/useTokens';
import { Mission } from '@/types/journey';
import { FaucetComponent } from '@/components/journey/FaucetComponent';
import { StakingComponent } from '@/components/journey/StakingComponent';
import { NFTMarketplace } from '@/components/journey/NFTMarketplace';
import { AirdropComponent } from '@/components/journey/AirdropComponent';
import { SubscriptionComponent } from '@/components/journey/SubscriptionComponent';
import { PassiveIncomeComponent } from '@/components/journey/PassiveIncomeComponent';
import { NetworkGuard } from '@/components/common/NetworkGuard';

interface ActiveMissionDisplayProps {
  missionId: string;
}

function ActiveMissionDisplay({ missionId }: ActiveMissionDisplayProps) {
  switch (missionId) {
    case 'faucet':
      return <NetworkGuard><FaucetComponent /></NetworkGuard>;
    case 'stake':
      return <NetworkGuard><StakingComponent /></NetworkGuard>;
    case 'buy-nft':
      return <NetworkGuard><NFTMarketplace /></NetworkGuard>;
    case 'airdrop':
      return <NetworkGuard><AirdropComponent /></NetworkGuard>;
    case 'subscription':
      return <NetworkGuard><SubscriptionComponent /></NetworkGuard>;
    case 'passive-income':
      return <NetworkGuard><PassiveIncomeComponent /></NetworkGuard>;
    default:
      return <p className="text-white/80">Componente da missão não encontrado.</p>;
  }
}

interface MissionCardProps {
  mission: Mission;
  onComplete?: () => void; // May become redundant or repurposed
  isNextAvailableMission: boolean;
}

function MissionCard({ mission, onComplete, isNextAvailableMission }: MissionCardProps) {
  const getStatusColor = () => {
    if (mission.completed) return 'bg-green-500/20 border-green-500/30';
    if (mission.unlocked) return 'bg-purple-500/20 border-purple-500/30';
    return 'bg-gray-500/20 border-gray-500/30';
  };

  const getStatusIcon = () => {
    if (mission.completed) return '✅';
    if (mission.unlocked) return '🔓';
    return '🔒';
  };

  const isActiveInteractiveMission = isNextAvailableMission && mission.unlocked && !mission.completed;

  return (
    <div className={`card card-hover ${getStatusColor()} relative overflow-hidden flex flex-col`}>
      <div className="flex-grow">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 text-2xl">
          {getStatusIcon()}
        </div>

        {/* Mission Icon */}
        <div className="text-4xl mb-4">{mission.icon}</div>

        {/* Mission Info */}
        <h3 className="text-h3 font-bold text-white mb-2">{mission.title}</h3>
        <p className="text-white/80 text-body mb-4">{mission.description}</p>

        {/* Reward */}
        {mission.reward && (
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <div className="text-sm text-purple-300 font-medium mb-1">Recompensa:</div>
            <div className="text-white text-sm">{mission.reward.description}</div>
          </div>
        )}

        {/* Requirements */}
        {mission.requirements && mission.requirements.length > 0 && !mission.completed && (
          <div className="text-xs text-white/60 mb-4">
            <div className="mb-1">Requer:</div>
            <ul className="list-disc list-inside space-y-1">
              {mission.requirements.map((req, index) => (
                <li key={index} className="capitalize">{req.replace('-', ' ')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Interactive Component or Status Buttons */}
      <div className="mt-auto">
        {isActiveInteractiveMission ? (
          <div className="my-4"> {/* Added margin for spacing */}
            <ActiveMissionDisplay missionId={mission.id} />
          </div>
        ) : (
          <>
            {mission.unlocked && !mission.completed && onComplete && mission.id !== 'login' && (
              <button
                onClick={onComplete}
                disabled // Disabled if it's not the active one, or active one handles its own completion
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500"
              >
                Completar Missão (Indisponível) {/* Placeholder, ideally this button is not shown or styled differently if not active */}
              </button>
            )}
            {mission.completed && (
              <div className="w-full bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-center">
                Concluída!
              </div>
            )}
            {!mission.unlocked && (
              <div className="w-full bg-gray-600/20 text-gray-400 font-medium py-2 px-4 rounded-lg text-center">
                Bloqueada
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { MissionCard };

export function JourneyDashboard() {
  const { isConnected } = usePrivyAuth();
  const { balance } = useTokens();
  const { journey, getNextAvailableMission } = useJourney();

  const nextMission = getNextAvailableMission(); // Get the next available mission

  if (!isConnected) {
    return (
      <section className="section-spacing">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="text-h2 font-bold text-white mb-4">Jornada do Usuário</h2>
            <p className="text-white/80 text-body-lg mb-8">
              Conecte sua carteira para começar sua jornada e desbloquear funcionalidades!
            </p>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-h3 font-bold text-white mb-2">Primeira Missão</h3>
              <p className="text-white/80">Conecte sua carteira para ganhar 10 tokens de boas-vindas!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // const nextMission = getNextAvailableMission(); // Already defined above
  const progressPercentage = (journey.completedMissions.length / journey.missions.length) * 100;

  // This function might be simplified if components handle their own completion
  const handleMissionComplete = (missionId: string) => {
    // For now, we assume components call completeMission from useJourney directly.
    // This function can be a fallback or for missions without specific components.
    console.log(`Attempting to complete mission: ${missionId} from dashboard handler`);
    // The actual completeMission(missionId) should be called by the interactive component itself.
    // completeMission(missionId); // Example: if a generic button was still used.
  };

  return (
    <section className="section-spacing">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold text-white mb-4">Sua Jornada</h2>
          <p className="text-white/80 text-body-lg mb-8">
            Complete missões para desbloquear novas funcionalidades e ganhar recompensas!
          </p>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="card text-center">
              <div className="text-h2 font-bold text-purple-400 mb-2">{journey.completedMissions.length}</div>
              <div className="text-white/80 text-body-sm">Missões Concluídas</div>
            </div>
            <div className="card text-center">
              <div className="text-h2 font-bold text-purple-400 mb-2">{balance}</div>
              <div className="text-white/80 text-body-sm">Tokens Ganhos</div>
            </div>
            <div className="card text-center">
              <div className="text-h2 font-bold text-purple-400 mb-2">{Math.round(progressPercentage)}%</div>
              <div className="text-white/80 text-body-sm">Progresso Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-white/60 text-sm mt-2">
              {journey.completedMissions.length} de {journey.missions.length} missões concluídas
            </div>
          </div>
        </div>

        {/* Next Mission Highlight - This section can be kept or removed if the active mission card is prominent enough */}
        {nextMission && !journey.missions.find(m => m.id === nextMission.id)?.completed && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-sm text-purple-300 font-medium mb-2">Próxima Missão Ativa</div>
              <div className="text-3xl mb-3">{nextMission.icon}</div>
              <h3 className="text-h3 font-bold text-white mb-2">{nextMission.title}</h3>
              <p className="text-white/80 mb-4">{nextMission.description}</p>
              {nextMission.reward && (
                <div className="text-purple-300 text-sm font-medium">
                  🎁 {nextMission.reward.description}
                </div>
              )}
              {/* Indication that this mission's component is now embedded below if it's the one in the grid */}
               <p className="text-pink-400/80 text-body-sm mt-4">Interaja com esta missão diretamente no card correspondente abaixo.</p>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journey.missions.map((mission) => {
            // Determine if this card is for the next available (active) mission
            const isNext = nextMission?.id === mission.id && mission.unlocked && !mission.completed;
            if (mission.id === 'login' && mission.completed) return null; // Don't show completed login mission card

            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                isNextAvailableMission={isNext}
                // onComplete prop might be needed if we want a generic way to complete from card,
                // but typically the embedded component handles its own completion.
                // For non-active missions, onComplete could be used if they had a simple complete button.
                onComplete={mission.id !== 'login' && !isNext ? () => handleMissionComplete(mission.id) : undefined}
              />
            );
          })}
        </div>

        {/* Completion Message */}
        {journey.completedMissions.length === journey.missions.length && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-h2 font-bold text-white mb-4">Parabéns!</h3>
              <p className="text-white/80 text-body-lg mb-6">
                Você completou todas as missões e desbloqueou todas as funcionalidades da plataforma!
              </p>
              <div className="text-green-400 font-medium">
                Total de tokens ganhos: {journey.totalTokensEarned} 🪙
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}