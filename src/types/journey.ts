export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  unlocked: boolean;
  reward?: {
    type: 'tokens' | 'nft' | 'access';
    amount?: number;
    description: string;
  };
  requirements?: string[];
}

export interface UserJourney {
  currentStep: number;
  missions: Mission[];
  totalTokensEarned: number;
  completedMissions: string[];
}

export interface JourneyContextType {
  journey: UserJourney;
  completeMission: (missionId: string) => void;
  checkMissionRequirements: (missionId: string) => boolean;
  getNextAvailableMission: () => Mission | null;
  resetJourney: () => void;
} 