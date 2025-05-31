import { validateEnvironmentVariables } from './envValidator';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Salva as variáveis de ambiente originais
const originalEnv = { ...process.env };

beforeEach(() => {
  // Reseta as variáveis de ambiente antes de cada teste
  process.env = { ...originalEnv };
});

afterEach(() => {
  // Restaura as variáveis de ambiente originais após cada teste
  process.env = { ...originalEnv };
});

describe('Environment Variables Validation', () => {
  it('should throw error when required variables are missing', () => {
    // Remove todas as variáveis obrigatórias
    delete process.env.NEXT_PUBLIC_ZERODEV_RPC;
    delete process.env.NEXT_PUBLIC_CHAIN;
    delete process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_PRIVY_APP_ID;

    expect(() => validateEnvironmentVariables()).toThrowError(
      'Missing required environment variables: NEXT_PUBLIC_ZERODEV_RPC, NEXT_PUBLIC_CHAIN, NEXT_PUBLIC_ZERODEV_PROJECT_ID, NEXT_PUBLIC_PRIVY_APP_ID\n' +
      'Please configure these variables in your .env file:\n' +
      '- NEXT_PUBLIC_ZERODEV_RPC\n' +
      '- NEXT_PUBLIC_CHAIN\n' +
      '- NEXT_PUBLIC_ZERODEV_PROJECT_ID\n' +
      '- NEXT_PUBLIC_PRIVY_APP_ID'
    );
  });

  it('should throw error when only some required variables are missing', () => {
    // Mantém apenas uma variável e remove as outras
    process.env.NEXT_PUBLIC_ZERODEV_RPC = 'test';
    delete process.env.NEXT_PUBLIC_CHAIN;
    delete process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_PRIVY_APP_ID;

    expect(() => validateEnvironmentVariables()).toThrowError(
      'Missing required environment variables: NEXT_PUBLIC_CHAIN, NEXT_PUBLIC_ZERODEV_PROJECT_ID, NEXT_PUBLIC_PRIVY_APP_ID\n' +
      'Please configure these variables in your .env file:\n' +
      '- NEXT_PUBLIC_ZERODEV_RPC\n' +
      '- NEXT_PUBLIC_CHAIN\n' +
      '- NEXT_PUBLIC_ZERODEV_PROJECT_ID\n' +
      '- NEXT_PUBLIC_PRIVY_APP_ID'
    );
  });

  it('should not throw error when all required variables are present', () => {
    // Configura todas as variáveis obrigatórias
    process.env.NEXT_PUBLIC_ZERODEV_RPC = 'test';
    process.env.NEXT_PUBLIC_CHAIN = '11155111';
    process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID = 'test';
    process.env.NEXT_PUBLIC_PRIVY_APP_ID = 'test';

    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it('should throw error when variables are empty strings', () => {
    // Configura todas as variáveis como strings vazias
    process.env.NEXT_PUBLIC_ZERODEV_RPC = '';
    process.env.NEXT_PUBLIC_CHAIN = '';
    process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID = '';
    process.env.NEXT_PUBLIC_PRIVY_APP_ID = '';

    expect(() => validateEnvironmentVariables()).toThrowError(
      'Missing required environment variables: NEXT_PUBLIC_ZERODEV_RPC, NEXT_PUBLIC_CHAIN, NEXT_PUBLIC_ZERODEV_PROJECT_ID, NEXT_PUBLIC_PRIVY_APP_ID\n' +
      'Please configure these variables in your .env file:\n' +
      '- NEXT_PUBLIC_ZERODEV_RPC\n' +
      '- NEXT_PUBLIC_CHAIN\n' +
      '- NEXT_PUBLIC_ZERODEV_PROJECT_ID\n' +
      '- NEXT_PUBLIC_PRIVY_APP_ID'
    );
  });
});
