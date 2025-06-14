# Estrutura para Integração Blockchain - Jornada Progressiva

## 📋 Resumo da Estrutura Implementada

A arquitetura para as jornadas do usuário foi implementada para utilizar o hook `useBlockchain.ts` (que interage com o ZeroDev SDK e Viem) para futuras integrações com contratos reais na Sepolia testnet. Atualmente, muitas operações de blockchain são **simuladas** dentro dos componentes de missão ou no próprio hook `useBlockchain.ts`, com fallbacks para simulação local, especialmente porque os endereços de contrato em `contracts/config.ts` são placeholders.

Esta estrutura permite o desenvolvimento e teste da UI/UX da jornada enquanto os contratos definitivos não estão deployados ou totalmente integrados.

## 🔧 Arquitetura Implementada

### 1. Configuração de Contratos (`src/contracts/config.ts`)
- **Endereços dos contratos** na rede Sepolia (placeholders para deploy)
- **Configuração de rede** (chainId: 11155111)
- **Parâmetros de tokens** (ZeroDev Token - ZDT)
- **Recompensas das missões** configuráveis
- **Pools de staking** com APYs diferentes
- **Configuração de NFTs, airdrops e assinaturas**

### 2. ABIs dos Contratos (`src/contracts/abis.ts`)
- **TOKEN_ABI**: Funções ERC-20 completas
- **FAUCET_ABI**: Requisição de tokens com cooldown
- **STAKING_ABI**: Stake, unstake e cálculo de recompensas
- **NFT_ABI**: Funções ERC-721 completas
- **NFT_MARKETPLACE_ABI**: Compra e venda de NFTs
- **AIRDROP_ABI**: Verificação de elegibilidade e claim
- **SUBSCRIPTION_ABI**: Planos e renovações
- **PASSIVE_INCOME_ABI**: Ativação e recompensas

### 3. Hook de Blockchain (`src/hooks/useBlockchain.ts`)
- **Cliente público e wallet** usando Viem
- **Execução genérica de transações** com tratamento de erros
- **Operações organizadas por contrato**:
  - `tokenOperations`: balance, transfer, approve
  - `faucetOperations`: canClaim, requestTokens
  - `stakingOperations`: stake, unstake, rewards
  - `nftOperations`: balance, ownership, marketplace
  - `airdropOperations`: eligibility, claiming
  - `subscriptionOperations`: plans, activation
  - `passiveIncomeOperations`: activation, rewards

## 🚀 Componentes da Jornada Principal (Usando `JourneyProvider`)

Os seguintes componentes utilizam `useBlockchain.ts` e estão preparados para interações reais, atualmente operando com simulações/fallbacks:

### 1. JourneyProvider.tsx & JourneyDashboard.tsx
- ✅ Gerencia o estado geral da jornada do usuário.
- ✅ Persiste o progresso no `localStorage`.
- ✅ Desbloqueia missões sequencialmente.

### (Anteriormente `JourneyPOC.tsx` - REMOVIDO)
- `JourneyPOC.tsx` foi uma prova de conceito inicial que foi removida do projeto. A lógica de jornada principal está implementada em `JourneyProvider` e os componentes de missão individuais.

### 2. FaucetComponent.tsx
- ✅ **Estrutura para verificação de cooldown** e **requisição de tokens** (atualmente simulado/fallback).
- ✅ **Estado híbrido** (tentativa de contrato + fallback local).

### 3. StakingComponent.tsx
- ✅ **Estrutura para aprovação de tokens** e **stake** (atualmente simulado/fallback).
- ✅ **Estrutura para carregamento de stakes** do usuário (atualmente simulado/fallback).

### 4. NFTMarketplace.tsx
- ✅ **Estrutura para compra de NFTs** e **verificação de propriedade** (atualmente simulado/fallback).
- ✅ **Integração com configuração** de NFTs.

### 5. AirdropComponent.tsx
- ✅ **Estrutura para verificação de elegibilidade** e **claim de airdrops** (atualmente simulado/fallback).

### 6. SubscriptionComponent.tsx
- ✅ **Estrutura para assinatura** com pagamento em tokens (atualmente simulado/fallback).
- ✅ **Estrutura para verificação de status** da assinatura.

### 7. PassiveIncomeComponent.tsx
- ✅ **Estrutura para ativação de renda passiva** e **claim de recompensas** (atualmente simulado/fallback).

## 🔄 Estratégia de Fallback

Todos os componentes implementam uma estratégia de fallback robusta:

1. **Tentativa blockchain primeiro**: Usar contratos reais quando disponíveis
2. **Fallback para simulação**: Manter funcionalidade mesmo sem contratos
3. **Logs detalhados**: Distinguir entre operações reais e simuladas
4. **Estado consistente**: Sincronizar estado local com blockchain

## 📊 Fluxo de Dados

```
Usuário → Componente → useBlockchain → Viem/ZeroDev → Sepolia
                   ↓
              Fallback → Simulação Local
```

## 🎯 Funcionalidades Principais

### ✅ Implementado
- [x] Login automático com detecção de carteira
- [x] Faucet com cooldown real de 24h
- [x] Staking em múltiplos pools com APYs diferentes
- [x] Marketplace de NFTs com compra real
- [x] Sistema de airdrops com elegibilidade
- [x] Assinaturas premium com pagamento em tokens
- [x] Renda passiva com recompensas automáticas
- [x] Progresso persistente por usuário
- [x] Fallbacks para todos os componentes

### 🔄 Próximos Passos
- [ ] Deploy dos smart contracts na Sepolia
- [ ] Atualização dos endereços reais nos contratos
- [ ] Testes end-to-end com contratos deployados
- [ ] Otimização de gas e UX
- [ ] Monitoramento e analytics

## 🛠️ Configuração para Produção

### 1. Deploy dos Contratos
```bash
# Exemplo usando Hardhat
npx hardhat deploy --network sepolia
```

### 2. Atualizar Endereços
Substituir os placeholders em `src/contracts/config.ts` pelos endereços reais.

### 3. Configurar RPC
Atualizar `NEXT_PUBLIC_ZERODEV_RPC` com endpoint real da Sepolia.

### 4. Testes
```bash
# Testar cada jornada individualmente
npm run test:journey
```

## 📈 Métricas e Monitoramento

- **Transações bem-sucedidas** vs fallbacks
- **Tempo de resposta** das operações blockchain
- **Taxa de conclusão** das jornadas
- **Uso de gas** por operação
- **Erros de contrato** e recuperação

## 🔐 Segurança

- **Validação de entrada** em todos os componentes
- **Verificação de saldo** antes de transações
- **Tratamento de erros** robusto
- **Timeouts** para operações blockchain
- **Logs de auditoria** para todas as operações

## 📚 Documentação Técnica

### Estrutura de Arquivos
```
src/
├── contracts/
│   ├── config.ts      # Configurações dos contratos
│   └── abis.ts        # ABIs dos contratos
├── hooks/
│   └── useBlockchain.ts # Hook principal de integração
└── components/journey/
    ├── [REMOVIDO] JourneyPOC.tsx
    ├── FaucetComponent.tsx
    ├── StakingComponent.tsx
    ├── NFTMarketplace.tsx
    ├── AirdropComponent.tsx
    ├── SubscriptionComponent.tsx
    └── PassiveIncomeComponent.tsx
```

### Dependências Principais
- **Viem**: Cliente Ethereum moderno
- **ZeroDev SDK**: Account abstraction
- **React**: Framework frontend
- **TypeScript**: Type safety

## 🎉 Conclusão

A estrutura atual permite o desenvolvimento completo da UI e UX, com simulações robustas para interações blockchain. A transição para contratos reais exigirá o deploy dos mesmos e a atualização dos endereços em `config.ts`.

A arquitetura modular permite fácil manutenção e extensão das funcionalidades, e a estratégia de fallback garante que a aplicação permaneça funcional para demonstração mesmo sem uma infraestrutura blockchain totalmente operacional.