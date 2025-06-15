import { Transaction } from '@/types/transaction';

const STORAGE_KEYS = {
  TOKEN_BALANCE: (address: string) => `token_balance_${address}`,
  TRANSACTIONS: (address: string) => `transactions_${address}`,
  WELCOME_REWARD: (address: string) => `welcome_reward_${address}`,
  STAKE_POSITIONS: (address: string) => `stake_positions_${address}`,
  LAST_SYNC: (address: string) => `last_sync_${address}`,
} as const;

// Configuração de sincronização
const SYNC_CONFIG = {
  ENABLED: true,
  SYNC_INTERVAL: 30000, // 30 segundos
  API_URL: 'https://jsonplaceholder.typicode.com', // Usando JSONPlaceholder como mock API
  STORAGE_PREFIX: 'zerodev_',
};

interface WalletData {
  address: string;
  balance: number;
  transactions: Transaction[];
  welcomeReward: boolean;
  stakePositions: any[];
  lastUpdated: number;
}

// Função para sincronizar dados com armazenamento externo (simulado)
const syncDataExternal = async (address: string, data: WalletData): Promise<boolean> => {
  if (!SYNC_CONFIG.ENABLED) return false;
  
  try {
    console.log('🔄 Sincronizando dados para:', address);
    
    // Simular upload dos dados (em produção seria uma API real)
    const response = await fetch(`${SYNC_CONFIG.API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${SYNC_CONFIG.STORAGE_PREFIX}${address}`,
        body: JSON.stringify(data),
        userId: 1
      }),
    });
    
    if (response.ok) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC(address), Date.now().toString());
      console.log('✅ Sincronização realizada com sucesso');
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('⚠️ Falha na sincronização externa:', error);
    return false;
  }
};

// Função para recuperar dados do armazenamento externo (simulado)
const getDataExternal = async (address: string): Promise<WalletData | null> => {
  if (!SYNC_CONFIG.ENABLED) return null;
  
  try {
    console.log('📥 Buscando dados sincronizados para:', address);
    
    // Simular download dos dados (em produção seria uma API real)
    // Como JSONPlaceholder não permite busca real, vamos simular
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC(address));
    if (lastSync) {
      const timeSinceSync = Date.now() - parseInt(lastSync);
      if (timeSinceSync < SYNC_CONFIG.SYNC_INTERVAL) {
        console.log('📝 Dados recentes encontrados, usando cache local');
        return null; // Usar dados locais
      }
    }
    
    // Em uma implementação real, aqui faria fetch dos dados
    console.log('💾 Nenhum dado externo encontrado, usando localStorage');
    return null;
  } catch (error) {
    console.warn('⚠️ Falha ao buscar dados externos:', error);
    return null;
  }
};

// Função para carregar dados com sincronização
const loadWalletData = async (address: string): Promise<WalletData> => {
  // Primeiro, tentar buscar dados externos
  const externalData = await getDataExternal(address);
  
  if (externalData) {
    console.log('📥 Usando dados sincronizados externamente');
    // Atualizar localStorage com dados externos
    localStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE(address), externalData.balance.toString());
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS(address), JSON.stringify(externalData.transactions));
    localStorage.setItem(STORAGE_KEYS.WELCOME_REWARD(address), externalData.welcomeReward.toString());
    localStorage.setItem(STORAGE_KEYS.STAKE_POSITIONS(address), JSON.stringify(externalData.stakePositions));
    
    return externalData;
  }
  
  // Usar dados locais
  const localData: WalletData = {
    address,
    balance: await getTokenBalanceLocal(address),
    transactions: getTransactionsLocal(address),
    welcomeReward: hasReceivedWelcomeRewardLocal(address),
    stakePositions: getStakePositionsLocal(address),
    lastUpdated: Date.now()
  };
  
  console.log('💾 Usando dados locais para:', address);
  return localData;
};

// Função para salvar dados com sincronização
const saveWalletData = async (address: string): Promise<void> => {
  const data = await loadWalletData(address);
  data.lastUpdated = Date.now();
  
  // Tentar sincronizar externamente (não bloquear se falhar)
  syncDataExternal(address, data).catch(err => 
    console.warn('Sincronização externa falhou, dados salvos localmente:', err)
  );
};

// Funções locais (localStorage)
const getTokenBalanceLocal = async (address: string): Promise<number> => {
  const balance = localStorage.getItem(STORAGE_KEYS.TOKEN_BALANCE(address));
  return balance ? parseInt(balance, 10) : 0;
};

const getTransactionsLocal = (address: string): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS(address));
  return transactions ? JSON.parse(transactions) : [];
};

const hasReceivedWelcomeRewardLocal = (address: string): boolean => {
  return localStorage.getItem(STORAGE_KEYS.WELCOME_REWARD(address)) === 'true';
};

const getStakePositionsLocal = (address: string): any[] => {
  const positions = localStorage.getItem(STORAGE_KEYS.STAKE_POSITIONS(address));
  return positions ? JSON.parse(positions) : [];
};

// Funções públicas da API
export const getTokenBalance = async (address: string): Promise<number> => {
  const data = await loadWalletData(address);
  return data.balance;
};

export const addTokens = async (address: string, amount: number): Promise<void> => {
  const currentBalance = await getTokenBalance(address);
  const newBalance = currentBalance + amount;
  localStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE(address), newBalance.toString());
  
  console.log(`💰 Tokens adicionados: ${amount} (Novo saldo: ${newBalance})`);
  
  // Sincronizar após mudança
  await saveWalletData(address);
};

export const spendTokens = async (address: string, amount: number): Promise<boolean> => {
  const currentBalance = await getTokenBalance(address);
  
  if (currentBalance < amount) {
    console.warn(`❌ Saldo insuficiente: ${currentBalance} < ${amount}`);
    return false;
  }

  const newBalance = currentBalance - amount;
  localStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE(address), newBalance.toString());
  
  console.log(`💸 Tokens gastos: ${amount} (Novo saldo: ${newBalance})`);
  
  // Sincronizar após mudança
  await saveWalletData(address);
  return true;
};

export const getTransactions = (address: string): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS(address));
  return transactions ? JSON.parse(transactions) : [];
};

export const addTransaction = (address: string, transaction: Transaction): void => {
  const transactions = getTransactions(address);
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS(address), JSON.stringify(transactions));
  
  // Sincronizar após mudança (sem await para não bloquear)
  saveWalletData(address);
};

export const hasReceivedWelcomeReward = (address: string): boolean => {
  return localStorage.getItem(STORAGE_KEYS.WELCOME_REWARD(address)) === 'true';
};

export const markWelcomeRewardReceived = (address: string): void => {
  localStorage.setItem(STORAGE_KEYS.WELCOME_REWARD(address), 'true');
  
  // Sincronizar após mudança (sem await para não bloquear)
  saveWalletData(address);
};

// Função para sincronização manual
export const forceSyncWalletData = async (address: string): Promise<boolean> => {
  try {
    console.log('🔄 Forçando sincronização para:', address);
    await saveWalletData(address);
    return true;
  } catch (error) {
    console.error('❌ Erro na sincronização forçada:', error);
    return false;
  }
};

// Função para debug - verificar dados
export const debugWalletData = async (address: string): Promise<WalletData> => {
  const data = await loadWalletData(address);
  console.log('🔍 Debug - Dados da carteira:', data);
  return data;
}; 