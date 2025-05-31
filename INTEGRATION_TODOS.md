# TODOs para Integração Real - Jornada Progressiva (Referente ao JourneyPOC.tsx Obsoleto)

**NOTA IMPORTANTE:** Este documento refere-se ao componente `src/components/journey/JourneyPOC.tsx`, que é uma Prova de Conceito (POC) inicial e provavelmente está obsoleto. O sistema de jornada principal da aplicação é implementado através de `src/components/journey/JourneyProvider.tsx` e seus componentes de missão associados (e.g., `FaucetComponent.tsx`, `StakingComponent.tsx`), os quais utilizam o hook `src/hooks/useBlockchain.ts` para interações (atualmente simuladas) com a blockchain. As TODOs listadas abaixo são específicas do contexto do `JourneyPOC.tsx` e podem não ser relevantes para o sistema de jornada atual.

---

Este documento lista todas as integrações que precisam ser implementadas para substituir os mocks da POC por funcionalidades reais.

## 🔐 1. Login / Conectar Carteira

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~200

**TODO:** Integrar com Metamask/Privy para login real

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('login') por:
const handleRealLogin = async () => {
  try {
    // Conectar com Metamask
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    // Verificar se está na rede Sepolia
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    
    if (chainId !== '0xaa36a7') { // Sepolia testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    }
    
    // Dar recompensa de login (10 tokens)
    await giveWelcomeTokens(accounts[0]);
    
    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};
```

---

## 🚰 2. Faucet

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~202

**TODO:** Chamar smart contract do faucet na rede Sepolia

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('faucet') por:
const handleRealFaucet = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Endereço do contrato do faucet na Sepolia
    const faucetContract = new ethers.Contract(
      FAUCET_CONTRACT_ADDRESS,
      FAUCET_ABI,
      signer
    );
    
    // Chamar função do faucet
    const tx = await faucetContract.requestTokens();
    await tx.wait();
    
    // Verificar se recebeu os tokens
    const balance = await getTokenBalance(signer.getAddress());
    
    return balance > 0;
  } catch (error) {
    console.error('Erro no faucet:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract de faucet na rede Sepolia
- ABI do contrato de faucet
- Função `requestTokens()` no contrato

---

## 📈 3. Staking

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~204

**TODO:** Chamar função de stake no smart contract

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('stake') por:
const handleRealStaking = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contrato de staking
    const stakingContract = new ethers.Contract(
      STAKING_CONTRACT_ADDRESS,
      STAKING_ABI,
      signer
    );
    
    // Quantidade mínima para stake (ex: 10 tokens)
    const stakeAmount = ethers.utils.parseEther("10");
    
    // Aprovar tokens para o contrato de staking
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_ABI,
      signer
    );
    
    const approveTx = await tokenContract.approve(
      STAKING_CONTRACT_ADDRESS, 
      stakeAmount
    );
    await approveTx.wait();
    
    // Fazer stake
    const stakeTx = await stakingContract.stake(stakeAmount);
    await stakeTx.wait();
    
    return true;
  } catch (error) {
    console.error('Erro no staking:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract de staking
- Smart contract do token (ERC-20)
- Funções `approve()` e `stake()` nos contratos

---

## 🎨 4. Comprar NFT

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~206

**TODO:** Integrar com marketplace de NFTs

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('buy-nft') por:
const handleRealNFTPurchase = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contrato do marketplace de NFTs
    const nftMarketplace = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );
    
    // ID do NFT de membro (pode ser fixo ou dinâmico)
    const nftId = 1;
    const price = ethers.utils.parseEther("1"); // 1 token
    
    // Comprar NFT
    const tx = await nftMarketplace.buyNFT(nftId, { value: price });
    await tx.wait();
    
    // Verificar se o NFT foi transferido
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer
    );
    
    const owner = await nftContract.ownerOf(nftId);
    const userAddress = await signer.getAddress();
    
    return owner.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error('Erro na compra do NFT:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract do marketplace de NFTs
- Smart contract do NFT (ERC-721)
- Funções `buyNFT()` e `ownerOf()`

---

## 🎁 5. Airdrop

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~208

**TODO:** Chamar função de airdrop no smart contract

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('airdrop') por:
const handleRealAirdrop = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    
    // Verificar se o usuário possui NFT de membro
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer
    );
    
    const balance = await nftContract.balanceOf(userAddress);
    if (balance.toNumber() === 0) {
      throw new Error('Usuário não possui NFT de membro');
    }
    
    // Contrato de airdrop
    const airdropContract = new ethers.Contract(
      AIRDROP_CONTRACT_ADDRESS,
      AIRDROP_ABI,
      signer
    );
    
    // Verificar se já recebeu airdrop
    const hasReceived = await airdropContract.hasReceivedAirdrop(userAddress);
    if (hasReceived) {
      throw new Error('Airdrop já foi recebido');
    }
    
    // Receber airdrop
    const tx = await airdropContract.claimAirdrop();
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Erro no airdrop:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract de airdrop
- Funções `hasReceivedAirdrop()` e `claimAirdrop()`
- Verificação de posse de NFT

---

## 💳 6. Assinatura Premium

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~210

**TODO:** Integrar com sistema de pagamento/assinatura

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('subscription') por:
const handleRealSubscription = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contrato de assinatura
    const subscriptionContract = new ethers.Contract(
      SUBSCRIPTION_CONTRACT_ADDRESS,
      SUBSCRIPTION_ABI,
      signer
    );
    
    // Preço da assinatura mensal (ex: 50 tokens)
    const monthlyPrice = ethers.utils.parseEther("50");
    
    // Aprovar tokens para pagamento
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_ABI,
      signer
    );
    
    const approveTx = await tokenContract.approve(
      SUBSCRIPTION_CONTRACT_ADDRESS,
      monthlyPrice
    );
    await approveTx.wait();
    
    // Fazer assinatura (1 = mensal, 2 = anual)
    const subscriptionType = 1; // mensal
    const tx = await subscriptionContract.subscribe(subscriptionType);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Erro na assinatura:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract de assinatura
- Sistema de pagamento recorrente
- Funções `subscribe()` e verificação de status

---

## 💰 7. Renda Passiva

**Arquivo:** `src/components/journey/JourneyPOC.tsx` - linha ~212

**TODO:** Configurar sistema de renda passiva

**Implementação necessária:**
```typescript
// Substituir simulateMissionAction('passive-income') por:
const handleRealPassiveIncome = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    
    // Verificar se tem assinatura ativa
    const subscriptionContract = new ethers.Contract(
      SUBSCRIPTION_CONTRACT_ADDRESS,
      SUBSCRIPTION_ABI,
      signer
    );
    
    const isActive = await subscriptionContract.isSubscriptionActive(userAddress);
    if (!isActive) {
      throw new Error('Assinatura premium necessária');
    }
    
    // Contrato de renda passiva
    const passiveIncomeContract = new ethers.Contract(
      PASSIVE_INCOME_CONTRACT_ADDRESS,
      PASSIVE_INCOME_ABI,
      signer
    );
    
    // Ativar renda passiva
    const tx = await passiveIncomeContract.activatePassiveIncome();
    await tx.wait();
    
    // Configurar auto-claim (opcional)
    const autoClaimTx = await passiveIncomeContract.enableAutoClaim();
    await autoClaimTx.wait();
    
    return true;
  } catch (error) {
    console.error('Erro na renda passiva:', error);
    return false;
  }
};
```

**Contratos necessários:**
- Smart contract de renda passiva
- Sistema de distribuição automática
- Funções `activatePassiveIncome()` e `enableAutoClaim()`

---

## 📋 Checklist de Implementação

### Contratos Smart Contracts Necessários:
- [ ] Token ERC-20 (para transações)
- [ ] Faucet Contract
- [ ] Staking Contract
- [ ] NFT Contract (ERC-721)
- [ ] NFT Marketplace Contract
- [ ] Airdrop Contract
- [ ] Subscription Contract
- [ ] Passive Income Contract

### Integrações Frontend:
- [ ] Configurar ethers.js ou web3.js
- [ ] Adicionar ABIs dos contratos
- [ ] Configurar endereços dos contratos na Sepolia
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Implementar notificações de transação

### Funcionalidades Adicionais:
- [ ] Verificação de rede (Sepolia)
- [ ] Tratamento de transações pendentes
- [ ] Cache de dados do blockchain
- [ ] Sincronização de estado com contratos
- [ ] Logs de auditoria
- [ ] Backup/restore de progresso

### Testes:
- [ ] Testes unitários para cada integração
- [ ] Testes de integração com contratos
- [ ] Testes de fluxo completo da jornada
- [ ] Testes de edge cases e erros

---

## 🚀 Próximos Passos

1. **Deploy dos Smart Contracts na Sepolia**
2. **Configurar ABIs e endereços no frontend**
3. **Implementar uma integração por vez**
4. **Testar cada funcionalidade isoladamente**
5. **Integrar com o fluxo completo da jornada**
6. **Adicionar tratamento de erros e UX**
7. **Testes finais e deploy**

---

## 📝 Notas Importantes

- Todos os contratos devem ser deployados na **rede Sepolia**
- Implementar **fallbacks** para quando transações falham
- Adicionar **loading states** durante transações
- Manter **logs detalhados** para debugging
- Considerar **gas limits** e **gas prices**
- Implementar **retry logic** para transações que falham 