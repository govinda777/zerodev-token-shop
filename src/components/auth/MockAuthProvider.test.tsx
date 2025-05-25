import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockAuthProvider, useMockAuth } from './MockAuthProvider';
import React from 'react';

// Componente de teste para usar o hook
function TestComponent() {
  const { isConnected, isConnecting, connect, disconnect, address } = useMockAuth();

  return (
    <div>
      <div data-testid="status">
        {isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected'}
      </div>
      <div data-testid="address">{address || 'no-address'}</div>
      <button onClick={connect} data-testid="connect-btn">
        Connect
      </button>
      <button onClick={disconnect} data-testid="disconnect-btn">
        Disconnect
      </button>
    </div>
  );
}

describe('MockAuthProvider', () => {
  it('deve renderizar children corretamente', () => {
    render(
      <MockAuthProvider>
        <div data-testid="child">Test Child</div>
      </MockAuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('deve fornecer estado inicial correto', () => {
    render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('disconnected');
    expect(screen.getByTestId('address')).toHaveTextContent('no-address');
  });

  it('deve conectar corretamente', async () => {
    render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );

    const connectBtn = screen.getByTestId('connect-btn');
    fireEvent.click(connectBtn);

    // Deve mostrar estado de connecting
    expect(screen.getByTestId('status')).toHaveTextContent('connecting');

    // Aguardar a conexão completar
    await waitFor(
      () => {
        expect(screen.getByTestId('status')).toHaveTextContent('connected');
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('address')).toHaveTextContent('0x1234567890123456789012345678901234567890');
  });

  it('deve desconectar corretamente', async () => {
    render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );

    // Primeiro conecta
    const connectBtn = screen.getByTestId('connect-btn');
    fireEvent.click(connectBtn);

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('connected');
    });

    // Depois desconecta
    const disconnectBtn = screen.getByTestId('disconnect-btn');
    fireEvent.click(disconnectBtn);

    expect(screen.getByTestId('status')).toHaveTextContent('disconnected');
    expect(screen.getByTestId('address')).toHaveTextContent('no-address');
  });

  it('deve lançar erro quando useMockAuth é usado fora do provider', () => {
    // Capturar erros do console para evitar poluição nos testes
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useMockAuth must be used within a MockAuthProvider');

    consoleSpy.mockRestore();
  });

  it('deve permitir múltiplas conexões/desconexões', async () => {
    render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );

    const connectBtn = screen.getByTestId('connect-btn');
    const disconnectBtn = screen.getByTestId('disconnect-btn');

    // Primeira conexão
    fireEvent.click(connectBtn);
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('connected');
    });

    // Primeira desconexão
    fireEvent.click(disconnectBtn);
    expect(screen.getByTestId('status')).toHaveTextContent('disconnected');

    // Segunda conexão
    fireEvent.click(connectBtn);
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('connected');
    });

    // Segunda desconexão
    fireEvent.click(disconnectBtn);
    expect(screen.getByTestId('status')).toHaveTextContent('disconnected');
  });
}); 