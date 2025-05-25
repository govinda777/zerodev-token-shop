import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { PrivyLoadingScreen } from './PrivyLoadingScreen';
import React from 'react';

// Mock do window.location.reload
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    reload: jest.fn()
  }
});

describe('PrivyLoadingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar elementos básicos', () => {
    render(<PrivyLoadingScreen />);

    expect(screen.getByText('Inicializando autenticação')).toBeInTheDocument();
    expect(screen.getByText(/conectando com o privy/i)).toBeInTheDocument();
    expect(screen.getByText('Powered by Privy')).toBeInTheDocument();
  });

  it('deve mostrar loading spinner', () => {
    render(<PrivyLoadingScreen />);

    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('deve animar os pontos no texto de loading', async () => {
    render(<PrivyLoadingScreen />);

    // Inicialmente sem pontos
    expect(screen.getByText('Conectando com o Privy')).toBeInTheDocument();

    // Após 500ms, deve ter 1 ponto
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy.')).toBeInTheDocument();
    });

    // Após mais 500ms, deve ter 2 pontos
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy..')).toBeInTheDocument();
    });

    // Após mais 500ms, deve ter 3 pontos
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy...')).toBeInTheDocument();
    });

    // Após mais 500ms, deve voltar a sem pontos
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy')).toBeInTheDocument();
    });
  });

  it('não deve mostrar troubleshooting inicialmente', () => {
    render(<PrivyLoadingScreen />);

    expect(screen.queryByText('Demorou mais que o esperado?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /recarregar página/i })).not.toBeInTheDocument();
  });

  it('deve mostrar troubleshooting após 8 segundos', async () => {
    render(<PrivyLoadingScreen />);

    // Avançar 7 segundos - não deve mostrar ainda
    act(() => {
      jest.advanceTimersByTime(7000);
    });
    expect(screen.queryByText('Demorou mais que o esperado?')).not.toBeInTheDocument();

    // Avançar mais 1 segundo - deve mostrar
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Demorou mais que o esperado?')).toBeInTheDocument();
    });
    
    expect(screen.getByText('• Verifique sua conexão com a internet')).toBeInTheDocument();
    expect(screen.getByText('• Tente recarregar a página')).toBeInTheDocument();
    expect(screen.getByText('• Desative bloqueadores de anúncios temporariamente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recarregar página/i })).toBeInTheDocument();
  });

  it('deve recarregar a página quando botão é clicado', async () => {
    const mockReload = jest.fn();
    window.location.reload = mockReload;

    render(<PrivyLoadingScreen />);

    // Avançar para mostrar troubleshooting
    act(() => {
      jest.advanceTimersByTime(8000);
    });

    await waitFor(() => {
      expect(screen.getByText('Demorou mais que o esperado?')).toBeInTheDocument();
    });

    const reloadButton = screen.getByRole('button', { name: /recarregar página/i });
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('deve limpar timers quando componente é desmontado', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = render(<PrivyLoadingScreen />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it('deve ter classes CSS corretas para layout', () => {
    render(<PrivyLoadingScreen />);

    const container = screen.getByText('Inicializando autenticação').closest('div');
    expect(container?.parentElement).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen');
  });

  it('deve continuar animação dos pontos mesmo após mostrar troubleshooting', async () => {
    render(<PrivyLoadingScreen />);

    // Avançar para mostrar troubleshooting
    act(() => {
      jest.advanceTimersByTime(8000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Demorou mais que o esperado?')).toBeInTheDocument();
    });

    // Continuar animação dos pontos
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy.')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Conectando com o Privy..')).toBeInTheDocument();
    });
  });
}); 