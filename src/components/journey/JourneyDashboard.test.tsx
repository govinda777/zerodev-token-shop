import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JourneyDashboard, MissionCard } from './JourneyDashboard'; // Assuming MissionCard is exported for testing
import { useJourney } from './JourneyProvider';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/hooks/useTokens';
import { Mission, UserJourney } from '@/types/journey';

// --- Mocks ---
jest.mock('./JourneyProvider');
jest.mock('@/hooks/usePrivyAuth');
jest.mock('@/hooks/useTokens');

// Mock Mission Components
jest.mock('@/components/journey/FaucetComponent', () => () => <div data-testid="mock-faucet-component" />);
jest.mock('@/components/journey/StakingComponent', () => () => <div data-testid="mock-staking-component" />);
jest.mock('@/components/journey/NFTMarketplace', () => () => <div data-testid="mock-nft-marketplace" />);
jest.mock('@/components/journey/AirdropComponent', () => () => <div data-testid="mock-airdrop-component" />);
jest.mock('@/components/journey/SubscriptionComponent', () => () => <div data-testid="mock-subscription-component" />);
jest.mock('@/components/journey/PassiveIncomeComponent', () => () => <div data-testid="mock-passive-income-component" />);
jest.mock('@/components/common/NetworkGuard', () => ({ children }: { children: React.ReactNode }) => <div data-testid="mock-network-guard">{children}</div>);


const mockUseJourney = useJourney as jest.Mock;
const mockUsePrivyAuth = usePrivyAuth as jest.Mock;
const mockUseTokens = useTokens as jest.Mock;

const defaultMission: Mission = {
  id: 'test-mission',
  title: 'Test Mission Title',
  description: 'Test Mission Description',
  icon: '🧪',
  completed: false,
  unlocked: true,
  reward: { type: 'tokens', amount: 10, description: '10 Test Tokens' },
  requirements: [],
};

const initialMissions: Mission[] = [
  { id: 'login', title: 'Login Mission', description: 'Connect wallet', icon: '🔐', completed: false, unlocked: true, reward: { type: 'tokens', amount: 10, description: '10 Welcome Tokens'} },
  { id: 'faucet', title: 'Faucet Mission', description: 'Use faucet', icon: '🚰', completed: false, unlocked: false, requirements: ['login'], reward: { type: 'tokens', amount: 5, description: '5 Faucet Tokens'} },
  { id: 'stake', title: 'Stake Mission', description: 'Stake tokens', icon: '📈', completed: false, unlocked: false, requirements: ['faucet'], reward: { type: 'access', description: 'Advanced investments'} },
];

const defaultJourneyState: UserJourney = {
  currentStep: 0,
  missions: initialMissions,
  totalTokensEarned: 0,
  completedMissions: [],
};

describe('JourneyDashboard Components', () => {
  // --- ActiveMissionDisplay (Tested indirectly via MissionCard and JourneyDashboard or directly if exported) ---
  // For now, we'll test ActiveMissionDisplay's behavior primarily through MissionCard,
  // as it's not directly exported. If it were, tests would look like:
  /*
  describe('ActiveMissionDisplay (if it were exported)', () => {
    // const { ActiveMissionDisplay } = require('./JourneyDashboard'); // Hypothetical import
    // it('renders FaucetComponent for "faucet" missionId and wraps with NetworkGuard', () => {
    //   render(<ActiveMissionDisplay missionId="faucet" />);
    //   expect(screen.getByTestId('mock-faucet-component')).toBeInTheDocument();
    //   expect(screen.getByTestId('mock-network-guard')).toContainElement(screen.getByTestId('mock-faucet-component'));
    // });
    // ... more tests for other components
  });
  */

  // --- MissionCard Tests ---
  describe('MissionCard', () => {
    beforeEach(() => {
      // Reset mocks for each MissionCard test if necessary, though props should control behavior
    });

    it('renders ActiveMissionDisplay for an active mission', () => {
      const mission: Mission = { ...defaultMission, id: 'faucet', unlocked: true, completed: false };
      render(<MissionCard mission={mission} isNextAvailableMission={true} onComplete={jest.fn()} />);
      expect(screen.getByTestId('mock-faucet-component')).toBeInTheDocument();
      expect(screen.getByTestId('mock-network-guard')).toContainElement(screen.getByTestId('mock-faucet-component'));
      expect(screen.queryByText('Completar Missão')).not.toBeInTheDocument(); // Button might be removed or handled by ActiveMissionDisplay
    });

    it('shows "Concluída!" for a completed mission and no active display', () => {
      const mission: Mission = { ...defaultMission, completed: true };
      render(<MissionCard mission={mission} isNextAvailableMission={false} />);
      expect(screen.getByText('Concluída!')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-faucet-component')).not.toBeInTheDocument();
      expect(screen.queryByText('Completar Missão')).not.toBeInTheDocument();
    });

    it('shows "Bloqueada" for a locked mission and no active display', () => {
      const mission: Mission = { ...defaultMission, unlocked: false };
      render(<MissionCard mission={mission} isNextAvailableMission={false} />);
      expect(screen.getByText('Bloqueada')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-faucet-component')).not.toBeInTheDocument();
      expect(screen.queryByText('Completar Missão (Indisponível)')).toBeInTheDocument(); // Or just no button
    });

    it('renders for unlocked, not completed, but not active mission (shows disabled button)', () => {
      const mission: Mission = { ...defaultMission, id: 'other-mission', unlocked: true, completed: false };
      render(<MissionCard mission={mission} isNextAvailableMission={false} onComplete={jest.fn()} />);
      expect(screen.queryByTestId('mock-faucet-component')).not.toBeInTheDocument(); // Assuming 'other-mission' doesn't have a specific component or ActiveMissionDisplay handles default
      const completeButton = screen.getByText('Completar Missão (Indisponível)');
      expect(completeButton).toBeInTheDocument();
      expect(completeButton).toBeDisabled();
    });
    
    it('does not show complete mission button for login mission even if not active but unlocked/not completed', () => {
      const mission: Mission = { ...defaultMission, id: 'login', unlocked: true, completed: false };
      render(<MissionCard mission={mission} isNextAvailableMission={false} onComplete={jest.fn()} />);
      expect(screen.queryByText('Completar Missão (Indisponível)')).not.toBeInTheDocument();
    });


    it('displays mission title, description, icon, and reward', () => {
      const mission: Mission = {
        ...defaultMission,
        icon: '🌟',
        title: 'Star Mission',
        description: 'Collect all stars.',
        reward: { type: 'tokens', amount: 100, description: '100 Star Tokens' }
      };
      render(<MissionCard mission={mission} isNextAvailableMission={false} />);
      expect(screen.getByText('🌟')).toBeInTheDocument();
      expect(screen.getByText('Star Mission')).toBeInTheDocument();
      expect(screen.getByText('Collect all stars.')).toBeInTheDocument();
      expect(screen.getByText('Recompensa:')).toBeInTheDocument();
      expect(screen.getByText('100 Star Tokens')).toBeInTheDocument();
    });
     it('displays requirements if present and not completed', () => {
      const mission: Mission = { ...defaultMission, requirements: ['req1', 'req2'], completed: false };
      render(<MissionCard mission={mission} isNextAvailableMission={false} />);
      expect(screen.getByText('Requer:')).toBeInTheDocument();
      expect(screen.getByText('Req1')).toBeInTheDocument(); // Capitalized and space
      expect(screen.getByText('Req2')).toBeInTheDocument();
    });

    it('does not display requirements if completed', () => {
      const mission: Mission = { ...defaultMission, requirements: ['req1', 'req2'], completed: true };
      render(<MissionCard mission={mission} isNextAvailableMission={false} />);
      expect(screen.queryByText('Requer:')).not.toBeInTheDocument();
    });
  });

  // --- JourneyDashboard Tests ---
  describe('JourneyDashboard', () => {
    beforeEach(() => {
      mockUsePrivyAuth.mockReturnValue({ isConnected: true, user: { wallet: { address: 'test-address' }} });
      mockUseTokens.mockReturnValue({ balance: 100 });
      mockUseJourney.mockReturnValue({
        journey: defaultJourneyState,
        completeMission: jest.fn(),
        getNextAvailableMission: () => defaultJourneyState.missions.find(m => m.id === 'login'), // Login is initially available
        resetJourney: jest.fn(),
        checkMissionRequirements: jest.fn(() => true),
      });
    });

    it('shows login prompt if user is not connected', () => {
      mockUsePrivyAuth.mockReturnValue({ isConnected: false });
      render(<JourneyDashboard />);
      expect(screen.getByText('Jornada do Usuário')).toBeInTheDocument();
      expect(screen.getByText(/Conecte sua carteira para começar sua jornada/)).toBeInTheDocument();
      expect(screen.getByText('Primeira Missão')).toBeInTheDocument();
      expect(screen.getByText(/Conecte sua carteira para ganhar 10 tokens de boas-vindas!/)).toBeInTheDocument();
    });

    it('renders mission cards based on journey state when connected', () => {
      render(<JourneyDashboard />);
      // initialMissions has 3 missions. Login is active, Faucet and Stake are not completed.
      // Login should be active, Faucet & Stake should be visible.
      expect(screen.getByText('Login Mission')).toBeInTheDocument();
      expect(screen.getByText('Faucet Mission')).toBeInTheDocument();
      expect(screen.getByText('Stake Mission')).toBeInTheDocument();
      // Check if ActiveMissionDisplay is rendered for the 'login' mission
      // Since 'login' doesn't have a specific component in ActiveMissionDisplay, it might render default or nothing.
      // The key is that it's identified as active.
      // We can check if the "Completar Missão (Indisponível)" is NOT there for login.
      const loginCard = screen.getByText('Login Mission').closest('.card');
      expect(within(loginCard!).queryByText('Completar Missão (Indisponível)')).not.toBeInTheDocument();
    });
    
    it('correctly passes isNextAvailableMission=true to the active mission card (faucet)', () => {
        const missionsWithFaucetActive: Mission[] = [
            { ...initialMissions[0], completed: true, unlocked: true }, // login completed
            { ...initialMissions[1], id: 'faucet', unlocked: true, completed: false }, // faucet active
            { ...initialMissions[2], unlocked: false, completed: false }, // stake locked
        ];
        mockUseJourney.mockReturnValue({
            journey: { ...defaultJourneyState, missions: missionsWithFaucetActive, completedMissions: ['login'] },
            completeMission: jest.fn(),
            getNextAvailableMission: () => missionsWithFaucetActive.find(m => m.id === 'faucet'),
            resetJourney: jest.fn(),
            checkMissionRequirements: jest.fn((missionId) => missionId === 'faucet'),
        });
        render(<JourneyDashboard />);
        
        const faucetCard = screen.getByText('Faucet Mission').closest('.card');
        expect(faucetCard).toBeInTheDocument();
        // Check for ActiveMissionDisplay presence within Faucet Card
        expect(within(faucetCard!).getByTestId('mock-faucet-component')).toBeInTheDocument();

        const stakeCard = screen.getByText('Stake Mission').closest('.card');
        expect(stakeCard).toBeInTheDocument();
        expect(within(stakeCard!).queryByTestId('mock-staking-component')).not.toBeInTheDocument();
        expect(within(stakeCard!).getByText('Bloqueada')).toBeInTheDocument(); // As requirements not met for stake yet
    });


    it('displays progress statistics correctly', () => {
      mockUseJourney.mockReturnValue({
        journey: {
          ...defaultJourneyState,
          missions: initialMissions, // 3 missions total
          completedMissions: ['login'], // 1 completed
          totalTokensEarned: 10, // from login
        },
        getNextAvailableMission: () => initialMissions.find(m => m.id === 'faucet'),
        completeMission: jest.fn(),
        resetJourney: jest.fn(),
        checkMissionRequirements: jest.fn((missionId) => missionId === 'faucet'),
      });
      mockUseTokens.mockReturnValue({ balance: 10 }); // Balance matches totalTokensEarned for simplicity here

      render(<JourneyDashboard />);
      expect(screen.getByText('1')).toBeInTheDocument(); // Missões Concluídas
      expect(screen.getByText('Missões Concluídas').previousSibling).toHaveTextContent('1');
      
      expect(screen.getByText('10')).toBeInTheDocument(); // Tokens Ganhos
      expect(screen.getByText('Tokens Ganhos').previousSibling).toHaveTextContent('10');

      const expectedPercentage = Math.round((1 / initialMissions.length) * 100);
      expect(screen.getByText(`${expectedPercentage}%`)).toBeInTheDocument();
      expect(screen.getByText('Progresso Total').previousSibling).toHaveTextContent(`${expectedPercentage}%`);
      
      expect(screen.getByText(`1 de ${initialMissions.length} missões concluídas`)).toBeInTheDocument();
    });

    it('displays the Next Mission Highlight section correctly', () => {
      const nextMission = initialMissions.find(m => m.id === 'faucet');
       mockUseJourney.mockReturnValue({
        journey: { ...defaultJourneyState, completedMissions: ['login'], missions: initialMissions.map(m => m.id === 'login' ? {...m, completed: true} : m).map(m => m.id === 'faucet' ? {...m, unlocked: true} : m)},
        getNextAvailableMission: () => nextMission,
        completeMission: jest.fn(),
        resetJourney: jest.fn(),
        checkMissionRequirements: jest.fn((missionId) => missionId === 'faucet'),
      });
      render(<JourneyDashboard />);
      expect(screen.getByText('Próxima Missão Ativa')).toBeInTheDocument();
      expect(screen.getByText(nextMission!.title)).toBeInTheDocument();
      expect(screen.getByText(nextMission!.description)).toBeInTheDocument();
      expect(screen.getByText(`🎁 ${nextMission!.reward!.description}`)).toBeInTheDocument();
      expect(screen.getByText('Interaja com esta missão diretamente no card correspondente abaixo.')).toBeInTheDocument();
    });

    it('shows journey completion message when all missions are complete', () => {
      const allMissionsCompleted: Mission[] = initialMissions.map(m => ({ ...m, completed: true, unlocked: true }));
      mockUseJourney.mockReturnValue({
        journey: {
          ...defaultJourneyState,
          missions: allMissionsCompleted,
          completedMissions: allMissionsCompleted.map(m => m.id),
          totalTokensEarned: 150, // Sum of all rewards
        },
        getNextAvailableMission: () => null, // No next mission
        completeMission: jest.fn(),
        resetJourney: jest.fn(),
        checkMissionRequirements: jest.fn(() => true),
      });
      mockUseTokens.mockReturnValue({ balance: 150 });

      render(<JourneyDashboard />);
      expect(screen.getByText('Parabéns!')).toBeInTheDocument();
      expect(screen.getByText(/Você completou todas as missões/)).toBeInTheDocument();
      expect(screen.getByText('Total de tokens ganhos: 150 🪙')).toBeInTheDocument();
    });
    
    it('does not render the login mission card if it is completed', () => {
      const missions = [
        { ...initialMissions[0], id: 'login', completed: true },
        initialMissions[1], // faucet
      ];
      mockUseJourney.mockReturnValue({
        journey: { ...defaultJourneyState, missions, completedMissions: ['login'] },
        getNextAvailableMission: () => missions.find(m => m.id === 'faucet'),
        // ... other mocks
      });
      render(<JourneyDashboard />);
      expect(screen.queryByText('Login Mission')).not.toBeInTheDocument();
      expect(screen.getByText('Faucet Mission')).toBeInTheDocument(); // Faucet should still be there
    });
  });
});

// Helper to properly type the MissionCard for direct testing if needed.
// Since MissionCard is not directly exported in the provided code,
// this is more for structural reference or if you decide to export it.
interface MissionCardProps {
  mission: Mission;
  onComplete?: () => void;
  isNextAvailableMission: boolean;
}
const TestMissionCard: React.FC<MissionCardProps> = (props) => {
    // This is a placeholder if MissionCard is not exported.
    // For actual testing, you'd import the real MissionCard.
    // The current tests import MissionCard assuming it's exported.
    return <div data-testid="mission-card-wrapper" />;
};

TestMissionCard.displayName = 'TestMissionCard';
