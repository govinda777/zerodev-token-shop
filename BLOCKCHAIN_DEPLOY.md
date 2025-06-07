# 🚀 Guia de Deploy - Contratos Blockchain ZeroDev

Este guia detalha como fazer o deploy dos contratos smart de token e faucet na rede Sepolia.

## 📋 Pré-requisitos

### 1. Configuração do Ambiente

```bash
# 1. Instalar dependências (se ainda não instalou)
npm install

# 2. Compilar contratos
npm run compile
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` com base no `.env-example`:

```bash
cp .env-example .env
```

Configure as seguintes variáveis obrigatórias:

```env
# Para deploy (NÃO COMMITAR)
PRIVATE_KEY=sua_private_key_aqui
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/SEU_INFURA_KEY
ETHERSCAN_API_KEY=sua_etherscan_api_key

# Para aplicação
NEXT_PUBLIC_ZERODEV_RPC=https://sepolia.infura.io/v3/SEU_INFURA_KEY
NEXT_PUBLIC_CHAIN=11155111
NEXT_PUBLIC_ZERODEV_PROJECT_ID=seu_zerodev_project_id
NEXT_PUBLIC_PRIVY_APP_ID=seu_privy_app_id
```

### 3. Obter ETH de Teste

- Acesse [Sepolia Faucet](https://sepolia-faucet.pk910.de/)
- Solicite ETH para o endereço que você vai usar para deploy
- Aguarde confirmação (pode demorar alguns minutos)

## 🚀 Deploy dos Contratos

### Opção 1: Deploy Completo (Recomendado)

```bash
# Deploy, verificação e teste em um comando
npm run blockchain:setup
```

### Opção 2: Deploy Passo a Passo

```bash
# 1. Deploy na Sepolia
npm run deploy:sepolia

# 2. Verificar no Etherscan
npm run verify:sepolia

# 3. Testar funcionamento
npm run test:claim
```

### Opção 3: Deploy Local (Desenvolvimento)

```bash
# 1. Iniciar node local
npm run node:local

# 2. Em outro terminal - Deploy local
npm run deploy:local

# 3. Testar localmente
npm run test:claim:local
```

## 📊 Informações dos Contratos

### ZeroDevToken (ERC-20)
- **Nome**: ZeroDev Token
- **Símbolo**: ZDT
- **Decimais**: 18
- **Supply Inicial**: 1,000,000 ZDT
- **Funcionalidades**:
  - Transfer/Approve padrão ERC-20
  - Mint (apenas owner)
  - Burn (qualquer usuário)

### TokenFaucet
- **Amount per Claim**: 25 ZDT
- **Cooldown**: 24 horas
- **Supply Inicial**: 100,000 ZDT
- **Funcionalidades**:
  - Claim gratuito de tokens
  - Sistema de cooldown
  - Pause/Unpause
  - Estatísticas detalhadas

## 🔧 Após o Deploy

### 1. Atualizar Frontend

Após o deploy bem-sucedido, atualize seu `.env`:

```env
NEXT_PUBLIC_TOKEN_CONTRACT=0x... # Endereço do token
NEXT_PUBLIC_FAUCET_CONTRACT=0x... # Endereço do faucet
```

### 2. Reiniciar Aplicação

```bash
# Pare o servidor Next.js (Ctrl+C)
# Depois reinicie
npm run dev
```

### 3. Verificar Integração

1. Acesse a aplicação
2. Conecte sua carteira na Sepolia
3. Teste o faucet na seção "Journey"
4. Verifique se tokens são recebidos

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run compile` | Compila os contratos |
| `npm run deploy:sepolia` | Deploy na Sepolia |
| `npm run deploy:local` | Deploy local |
| `npm run verify:sepolia` | Verifica no Etherscan |
| `npm run test:claim` | Testa faucet na Sepolia |
| `npm run test:claim:local` | Testa faucet local |
| `npm run node:local` | Inicia node Hardhat local |
| `npm run blockchain:setup` | Deploy + verificação completa |
| `npm run blockchain:test` | Teste completo do faucet |

## 🔍 Verificação e Monitoramento

### Links Úteis

Após o deploy, você receberá links para:

- **Etherscan Token**: `https://sepolia.etherscan.io/address/TOKEN_ADDRESS`
- **Etherscan Faucet**: `https://sepolia.etherscan.io/address/FAUCET_ADDRESS`
- **Sepolia Explorer**: `https://sepolia.etherscan.io/`

### Monitoramento

```bash
# Verificar estatísticas do faucet
npm run test:claim

# Ver informações no Etherscan
# - Transações
# - Holders do token
# - Atividade do faucet
```

## 🛠 Administração do Faucet

### Reabastecimento

```solidity
// Via Etherscan ou script
faucet.refillFaucet(amount); // Requer aprovação prévia do token
```

### Configurações

```solidity
// Alterar amount por claim
faucet.setFaucetAmount(newAmount);

// Alterar cooldown
faucet.setCooldownTime(newCooldownInSeconds);

// Pausar/Despausar
faucet.pause();
faucet.unpause();
```

### Emergência

```solidity
// Retirar todos os tokens
faucet.emergencyWithdraw();
```

## 🐛 Troubleshooting

### Erros Comuns

#### 1. "insufficient funds for intrinsic transaction cost"
- **Causa**: Não há ETH suficiente na conta
- **Solução**: Obter mais ETH do faucet Sepolia

#### 2. "nonce too high"
- **Causa**: Transação pendente ou nonce desincronizado
- **Solução**: Aguardar ou resetar nonce na MetaMask

#### 3. "Contract not deployed"
- **Causa**: Endereços ainda são placeholders
- **Solução**: Executar deploy primeiro

#### 4. "already verified"
- **Causa**: Contrato já foi verificado
- **Solução**: Isso é normal, não é erro

### Debug

```bash
# Logs detalhados
npx hardhat run scripts/deploy.ts --network sepolia --verbose

# Verificar rede
npx hardhat console --network sepolia
```

## 💰 Custos Estimados

| Operação | Custo (ETH) | Custo (USD) |
|----------|-------------|-------------|
| Deploy Token | ~0.002 | ~$5 |
| Deploy Faucet | ~0.003 | ~$8 |
| Transfer Inicial | ~0.001 | ~$2 |
| Verificação | Grátis | $0 |
| **Total** | **~0.006** | **~$15** |

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que tem ETH suficiente na Sepolia
3. Consulte os logs detalhados dos scripts
4. Verifique o status das transações no Etherscan

## 🎉 Parabéns!

Após concluir este guia, você terá:

- ✅ Token ZDT deployado e verificado
- ✅ Faucet funcional com 100k tokens
- ✅ Frontend integrado com contratos reais
- ✅ Sistema de claims com cooldown de 24h
- ✅ Monitoramento via Etherscan

Seus usuários agora podem reivindicar tokens reais na rede Sepolia! 