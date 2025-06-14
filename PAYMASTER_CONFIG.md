# 🚀 Configuração de Paymasters - ZeroDev Token Shop

## Visão Geral

Os paymasters foram configurados para resolver o problema **"Add funds on Sepolia to complete transaction"** permitindo transações patrocinadas sem necessidade de ETH na carteira do usuário.

## 📋 Paymasters Configurados

### 1. **Verifying Paymaster** 🔐
- **Endereço**: `0xd740b875E8b2B1Ec94b624403f5a3427984cF458`
- **Descrição**: Sponsored transactions with verification
- **Uso**: Transações patrocinadas com verificação adicional de segurança

### 2. **ERC20 Paymaster** 💰
- **Endereço**: `0xe6Cc06Dd1447f31036e3F0347E8E6a6bEd8B5D42`
- **Descrição**: Pay gas fees with ERC20 tokens
- **Uso**: Permite pagar taxas de gas usando tokens ERC20 em vez de ETH

### 3. **Default Paymaster** ⚡
- **Descrição**: Default ZeroDev paymaster
- **Uso**: Paymaster padrão do ZeroDev para sponsorship geral

## 🔧 Configuração RPC

```typescript
// RPC configurado com selfFunded=true
const SELF_FUNDED_RPC = "https://rpc.zerodev.app/api/v3/ca6057ad-912b-4760-ac3d-1f3812d63b12/chain/11155111?selfFunded=true"
```

O parâmetro `selfFunded=true` é **crucial** para evitar o erro de fundos insuficientes.

## 🎯 Como Usar

### 1. **Interface Web**
1. Acesse a aplicação em `http://localhost:3000`
2. Faça login com sua carteira
3. Vá para a página `/wallet`
4. Clique na aba **"Paymaster"** 🚀
5. Selecione o tipo de paymaster desejado
6. As transações serão automaticamente patrocinadas!

### 2. **Programaticamente**

```typescript
import { 
  createKernelClientWithVerifyingPaymaster,
  createKernelClientWithERC20Paymaster,
  createKernelClientForUser
} from '@/utils/zerodev';

// Usando Verifying Paymaster
const clientVerifying = await createKernelClientWithVerifyingPaymaster(privateKey);

// Usando ERC20 Paymaster
const clientERC20 = await createKernelClientWithERC20Paymaster(privateKey);

// Usando Default Paymaster
const clientDefault = await createKernelClientForUser(privateKey, 'default');
```

## 🧪 Testando a Configuração

Execute o script de teste para verificar se todos os paymasters estão funcionando:

```bash
npm run test:paymaster
```

O script irá:
- ✅ Testar cada tipo de paymaster
- 📊 Mostrar um resumo dos resultados
- 💡 Fornecer instruções de uso

## 📁 Arquivos Principais

### `src/utils/zerodev.ts`
Configuração principal dos paymasters e clientes ZeroDev.

### `src/components/common/PaymasterSelector.tsx`
Componente React para seleção de paymaster na interface.

### `src/hooks/usePaymaster.ts`
Hook personalizado para gerenciar estado e operações dos paymasters.

### `scripts/test-paymaster.ts`
Script de teste para verificar funcionamento dos paymasters.

## 🔑 Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# Paymaster Configuration
NEXT_PUBLIC_VERIFYING_PAYMASTER=0xd740b875E8b2B1Ec94b624403f5a3427984cF458
NEXT_PUBLIC_ERC20_PAYMASTER=0xe6Cc06Dd1447f31036e3F0347E8E6a6bEd8B5D42
NEXT_PUBLIC_SELF_FUNDED_RPC=https://rpc.zerodev.app/api/v3/ca6057ad-912b-4760-ac3d-1f3812d63b12/chain/11155111?selfFunded=true
```

## 🚨 Resolução do Problema

### Antes:
```
❌ Add funds on Sepolia to complete transaction.
```

### Depois:
```
✅ Transaction sponsored successfully!
✅ No need for Sepolia ETH!
✅ Seamless user experience!
```

## 🎉 Benefícios

1. **Sem necessidade de ETH**: Usuários não precisam de ETH na Sepolia
2. **UX melhorada**: Transações fluidas sem interrupções
3. **Flexibilidade**: Múltiplas opções de paymaster
4. **Configuração automática**: Sistema detecta e usa o paymaster correto
5. **Persistência**: Preferências salvas no localStorage

## 📈 Próximos Passos

1. **Monitoramento**: Adicionar analytics para uso dos paymasters
2. **Otimização**: Implementar seleção automática baseada na transação
3. **Alertas**: Notificações quando paymaster falha
4. **Cache**: Implementar cache para melhor performance

## 🔍 Troubleshooting

### Problema: Paymaster não funciona
**Solução**: Verifique se o RPC inclui `?selfFunded=true`

### Problema: Erro de conexão
**Solução**: Execute `npm run test:paymaster` para diagnosticar

### Problema: Interface não carrega
**Solução**: Verifique se todas as dependências estão instaladas

## 📞 Suporte

Para dúvidas ou problemas:
1. Execute o script de teste: `npm run test:paymaster`
2. Verifique os logs do console
3. Consulte a documentação do ZeroDev
4. Abra uma issue no repositório

---

**🎯 Resultado Final**: Agora você pode fazer transações na Sepolia sem se preocupar com fundos de gas! 🚀 