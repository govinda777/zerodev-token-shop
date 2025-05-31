import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WelcomeNotification } from './WelcomeNotification';
import { useTokens } from '@/hooks/useTokens';

// Mock the useTokens hook
jest.mock('@/hooks/useTokens');
const mockUseTokens = useTokens as jest.Mock;

describe('WelcomeNotification', () => {
  let mockDismissWelcomeNotification: jest.Mock;

  beforeEach(() => {
    mockDismissWelcomeNotification = jest.fn();
    jest.useFakeTimers(); // Use fake timers for setTimeout and animations
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Restore real timers
  });

  it('renders null if showWelcomeNotification is false', () => {
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: false,
      welcomeReward: 0,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    const { container } = render(<WelcomeNotification />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the notification when showWelcomeNotification is true', async () => {
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: true,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    render(<WelcomeNotification />);

    // Notification becomes visible after a short delay due to setTimeout
    act(() => {
      jest.advanceTimersByTime(100); // Advance timer for the initial visibility setTimeout
    });

    await waitFor(() => {
      expect(screen.getByText('🎉 Bem-vindo!')).toBeVisible();
    });
    expect(screen.getByText(/Você recebeu/)).toBeInTheDocument();
    expect(screen.getByText('10 tokens')).toBeInTheDocument(); // Part of "10 tokens de boas-vindas!"
    expect(screen.getByText(/Use seus tokens para comprar produtos no marketplace./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar notificação' })).toBeInTheDocument();
  });

  it('calls dismissWelcomeNotification when the close button is clicked', async () => {
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: true,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    render(<WelcomeNotification />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const closeButton = await screen.findByRole('button', { name: 'Fechar notificação' });
    fireEvent.click(closeButton);
    expect(mockDismissWelcomeNotification).toHaveBeenCalledTimes(1);
  });

  it('applies correct classes for visibility transition', async () => {
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: true,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    const { container } = render(<WelcomeNotification />);
    const notificationDiv = container.querySelector('.fixed'); // Get the main div

    // Initially, it might not have full opacity or be translated
    expect(notificationDiv).toHaveClass('translate-x-full', 'opacity-0');

    act(() => {
      jest.advanceTimersByTime(100); // Advance timer for setTimeout
    });

    // After timeout, it should be visible
    await waitFor(() => {
      // The classes themselves might be controlled by `isVisible` state.
      // The outer div's classes change based on `isVisible`.
      // The main fixed div has the transition classes.
      // We check for the 'translate-x-0' and 'opacity-100' part of the class list.
      expect(notificationDiv).toHaveClass('translate-x-0', 'opacity-100');
    });
  });

  it('hides the notification when showWelcomeNotification becomes false after being true', async () => {
    const { rerender } = render(
      <WelcomeNotification />
    );

    mockUseTokens.mockReturnValue({
      showWelcomeNotification: true,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    rerender(<WelcomeNotification/>);


    act(() => {
      jest.advanceTimersByTime(100);
    });
     await waitFor(() => {
      expect(screen.getByText('🎉 Bem-vindo!')).toBeVisible();
    });
    const notificationDiv = document.querySelector('.fixed');
    expect(notificationDiv).toHaveClass('translate-x-0', 'opacity-100');


    // Now, set showWelcomeNotification to false
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: false,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    rerender(<WelcomeNotification/>);

    // The component should start transitioning out.
    // The `isVisible` state becomes false, which should change the classes.
    // The component itself returns null when showWelcomeNotification is false,
    // so the element might be removed from the DOM entirely after transitions.
    // Let's check the classes that lead to it being hidden.
    // If it's immediately removed, we check for that.
    // Based on current logic, it returns null if showWelcomeNotification is false,
    // so the element should be gone.

    await waitFor(() => {
        expect(screen.queryByText('🎉 Bem-vindo!')).not.toBeInTheDocument();
    });
     expect(document.querySelector('.fixed')).toBeNull(); // The whole component should be gone
  });

  it('progress bar animation starts when notification becomes visible', async () => {
    mockUseTokens.mockReturnValue({
      showWelcomeNotification: true,
      welcomeReward: 10,
      dismissWelcomeNotification: mockDismissWelcomeNotification,
    });
    render(<WelcomeNotification />);

    const progressBarFill = screen.getByRole('progressbar', { hidden: true })?.firstChild as HTMLElement;
    // Initially, width might be 100% (or not set, relying on CSS) before animation starts.
    // The style is `width: isVisible ? '0%' : '100%'` for the *fill* element,
    // and the transition is `duration-[10000ms]`.
    // This means when `isVisible` becomes true, width goes to '0%'.
    // The "animation" is the CSS transition making it appear to shrink from 100% to 0%.

    // Before visibility (isVisible=false, but showWelcomeNotification=true leads to isVisible=true after timeout)
    // So, initially isVisible is false.
    expect(progressBarFill).toHaveStyle('width: 100%');

    act(() => {
      jest.advanceTimersByTime(100); // for setIsVisible(true)
    });

    await waitFor(() => {
       expect(progressBarFill).toHaveStyle('width: 0%'); // Style changes to trigger animation
    });
  });
});
