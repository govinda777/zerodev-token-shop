# ZeroDev Token Shop - Exemplo de E-commerce com Account Abstraction

Este projeto demonstra a implementação de um e-commerce simples utilizando ZeroDev para Account Abstraction (AA) na Ethereum. O objetivo é servir como um exemplo prático de como integrar Smart Accounts em uma aplicação de e-commerce, mostrando desde a autenticação até o gerenciamento de tokens e compras.

## 🎯 Objetivo

Este exemplo visa demonstrar:
- Como implementar autenticação Web3 usando ZeroDev Smart Accounts
- Como gerenciar tokens e transações em uma loja digital
- Como vender NFTs e autenticar pessoas que tem uma NFT e com isso permite ela entrar em uma área restrita do site para apenas as pessoas que tem a NFT
- Fazer um cobrança recorrente.
- Fazer stack em USDC  
- Comprar NFT e receber renda passiva
- Compra a prazo
- Como estruturar uma aplicação Next.js com integração Web3
- Boas práticas de implementação de Account Abstraction

## 🏗️ Arquitetura

### Componentes Principais

1. **Smart Account (ZeroDev)**
   - Implementação de Account Abstraction para gerenciamento de contas
   - Geração e recuperação de chaves privadas
   - Integração com a rede Sepolia para transações

2. **Sistema de Autenticação**
   - Gerenciamento de sessão via Smart Account
   - Persistência de estado usando Local Storage
   - Integração com provedores de carteira (WalletConnect)

3. **Sistema de Tokens**
   - Gerenciamento de saldo de tokens
   - Distribuição de tokens de boas-vindas
   - Validação de transações

4. **Loja Digital**
   - Catálogo de produtos
   - Sistema de compra
   - Histórico de transações
  
5. **Auditoria**
   - Contas a pagar
   - Contas a receber
   - Dashboard saude financeira
   - 

## 💻 Stack Tecnológica

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript 5.0+
- **Estilização**: 
  - TailwindCSS 3.4
  - CSS Modules para componentes específicos
- **Gerenciamento de Estado**: 
  - React Context para estado global
  - Local Storage para persistência

### Web3
- **SDK**: ZeroDev SDK v2
- **Rede**: Sepolia Testnet
- **Smart Accounts**: ZeroDev Kernel
- **Provedores**: 
  - WalletConnect v2
  - ZeroDev RPC

### Desenvolvimento
- **Package Manager**: npm 9+
- **Node.js**: v18.17.0+
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint + Prettier
- **Formatação**: Prettier

## 📦 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação (Next.js App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── providers.tsx      # Provedores da aplicação
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   │   ├── AuthButton.tsx    # Botão de conexão
│   │   ├── AuthProvider.tsx  # Provedor de autenticação
│   │   └── useAuth.ts        # Hook de autenticação
│   ├── shop/             # Componentes da loja
│   │   ├── ProductCard.tsx   # Card de produto
│   │   ├── ProductGrid.tsx   # Grid de produtos
│   │   └── PurchaseModal.tsx # Modal de compra
│   └── common/           # Componentes comuns
│       ├── Header.tsx        # Cabeçalho
│       └── TokenBalance.tsx  # Exibição de saldo
├── hooks/                # Hooks personalizados
│   ├── useSmartAccount.ts   # Hook para Smart Account
│   ├── useTokens.ts         # Hook para tokens
│   └── useProducts.ts       # Hook para produtos
├── utils/                # Utilitários
│   ├── zerodev.ts          # Configuração ZeroDev
│   ├── storage.ts          # Gerenciamento de storage
│   └── constants.ts        # Constantes da aplicação
└── types/                # Definições de tipos
    ├── product.ts          # Tipos de produtos
    └── transaction.ts      # Tipos de transações
```

## 🔧 Configuração do Ambiente

### Pré-requisitos

1. **Node.js e npm**
   ```bash
   node --version  # Deve ser >= 18.17.0
   npm --version   # Deve ser >= 9.0.0
   ```

2. **Carteira Ethereum**
   - MetaMask ou similar
   - Configurada para rede Sepolia
   - ETH de teste para gas fees

3. **ZeroDev Project**
   - Criar projeto em [ZeroDev Dashboard](https://dashboard.zerodev.app/)
   - Obter Project ID
   - Configurar RPC endpoint

### Configuração das Variáveis de Ambiente

#### 1. ZeroDev Setup

1. **Acesse o ZeroDev Dashboard**
   - Vá para [https://dashboard.zerodev.app/](https://dashboard.zerodev.app/)
   - Faça login ou crie uma conta
   - Clique em "Create New Project"

2. **Configure o Projeto**
   - Dê um nome ao projeto (ex: "token-shop")
   - Selecione a rede "Sepolia"
   - Escolha o tipo de conta "Kernel"
   - Clique em "Create Project"

3. **Obtenha as Credenciais**
   - No dashboard do projeto, vá para a aba "Settings"
   - Copie o "Project ID" (será usado como `NEXT_PUBLIC_ZERODEV_PROJECT_ID`)
   - O RPC URL será no formato:
     ```
     NEXT_PUBLIC_ZERODEV_RPC=https://rpc.zerodev.app/api/v2/sepolia/[seu-project-id]
     ```
   - Substitua `[seu-project-id]` pelo ID do seu projeto

4. **Configure a Rede**
   - Para Sepolia testnet:
     ```
     NEXT_PUBLIC_CHAIN=sepolia
     ```
   - Para Mainnet:
     ```
     NEXT_PUBLIC_CHAIN=ethereum
     ```

#### 2. Privy Setup (Opcional, para autenticação social)

1. **Acesse o Privy Dashboard**
   - Vá para [https://console.privy.io/](https://console.privy.io/)
   - Faça login ou crie uma conta
   - Clique em "Create New App"

2. **Configure o App Privy**
   - Dê um nome ao app (ex: "token-shop-auth")
   - Adicione os domínios permitidos:
     - `localhost` para desenvolvimento
     - Seu domínio de produção quando estiver pronto
   - Clique em "Create App"

3. **Obtenha o App ID**
   - No dashboard do app, vá para "Settings"
   - Copie o "App ID"
   - Use como `NEXT_PUBLIC_PRIVY_APP_ID`

#### 3. Configuração Final

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ZeroDev Configuration
NEXT_PUBLIC_ZERODEV_PROJECT_ID=seu-project-id-aqui
NEXT_PUBLIC_ZERODEV_RPC=https://rpc.zerodev.app/api/v2/sepolia/seu-project-id-aqui
NEXT_PUBLIC_CHAIN=sepolia

# Privy Configuration (opcional)
NEXT_PUBLIC_PRIVY_APP_ID=seu-privy-app-id-aqui

# Outras configurações
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 4. Verificação da Configuração

Para verificar se as configurações estão corretas:

1. **Teste o RPC**
   ```bash
   curl -X POST https://rpc.zerodev.app/api/v2/sepolia/seu-project-id-aqui \
   -H "Content-Type: application/json" \
   -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
   Deve retornar um número de bloco válido

2. **Teste o Privy** (se configurado)
   - Acesse `http://localhost:3000`
   - Tente fazer login com o botão de autenticação social
   - Verifique o console do navegador para erros

#### 5. Troubleshooting

Se encontrar problemas:

1. **RPC não responde**
   - Verifique se o Project ID está correto
   - Confirme se a rede está correta (Sepolia)
   - Verifique se o projeto está ativo no dashboard

2. **Privy não funciona**
   - Verifique se o domínio está autorizado
   - Confirme se o App ID está correto
   - Verifique se as configurações de OAuth estão corretas

3. **Erros de Carteira**
   - Certifique-se de que está na rede correta (Sepolia)
   - Verifique se tem ETH suficiente para gas
   - Confirme se a carteira está conectada corretamente

### Instalação

1. **Clone e Dependências**
   ```bash
   # Clone o repositório
   git clone https://github.com/zerodev-examples/zerodev-token-shop.git
   cd zerodev-token-shop

   # Instale as dependências
   npm install
   ```

2. **Execução**
   ```bash
   # Desenvolvimento
   npm run dev

   # Build
   npm run build

   # Produção
   npm start
   ```

## 🚀 Fluxo da Aplicação

### 1. Autenticação
```typescript
// Exemplo de implementação do hook de autenticação
const useAuth = () => {
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  
  const connect = async () => {
    // 1. Inicializa cliente ZeroDev
    const client = await createZeroDevClient({
      projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
    });

    // 2. Cria/recupera Smart Account
    const account = await client.createSmartAccount({
      // Configurações da conta
    });

    // 3. Persiste estado
    setSmartAccount(account);
  };

  return { smartAccount, connect };
};
```

### 2. Sistema de Tokens
- Implementação de saldo local
- Validação de transações
- Distribuição de tokens de boas-vindas

### 3. Loja
- Catálogo de produtos
- Processo de compra
- Histórico de transações

## 🔍 Detalhes de Implementação

### Smart Account
```typescript
// Exemplo de configuração do Smart Account
const smartAccountConfig = {
  projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
  owner: privateKey,
  chain: sepolia,
  bundlerUrl: "https://bundler.zerodev.app/api/v2/sepolia/[project-id]",
  paymasterUrl: "https://paymaster.zerodev.app/api/v2/sepolia/[project-id]",
};
```

### Gerenciamento de Tokens
```typescript
// Exemplo de implementação do sistema de tokens
interface TokenSystem {
  balance: number;
  addTokens(amount: number): Promise<void>;
  spendTokens(amount: number): Promise<boolean>;
  getTransactionHistory(): Transaction[];
}
```

### Transações
```typescript
// Exemplo de implementação de transação
const executeTransaction = async (
  smartAccount: SmartAccount,
  transaction: Transaction
) => {
  // 1. Prepara transação
  const tx = await smartAccount.prepareTransaction(transaction);

  // 2. Executa transação
  const result = await smartAccount.executeTransaction(tx);

  // 3. Atualiza estado
  await updateTransactionHistory(result);
};
```

## 🧪 Testes

### Testes Unitários
```bash
# Executa testes unitários
npm test

# Executa testes com coverage
npm run test:coverage
```

### Testes de Integração
```bash
# Executa testes de integração
npm run test:integration
```

## 📈 Monitoramento

### Logs
- Implementação de logging para transações
- Rastreamento de erros
- Métricas de performance

### Analytics (Opcional)
- Rastreamento de eventos
- Métricas de uso
- Análise de comportamento

## 🔐 Segurança

### Considerações
- Proteção de chaves privadas
- Validação de transações
- Rate limiting
- Sanitização de inputs

### Boas Práticas
- Uso de variáveis de ambiente
- Validação de dados
- Tratamento de erros
- Logs seguros

## 🚨 Limitações Atuais

1. **Armazenamento**
   - Tokens armazenados localmente
   - Sem persistência blockchain
   - Limitações de segurança

2. **Funcionalidades**
   - Sem backend próprio
   - Sem sistema de pagamento real
   - Sem gerenciamento de usuários

3. **Escalabilidade**
   - Limitado a demonstração
   - Sem otimizações de performance
   - Sem cache distribuído

## 🔄 Roadmap

### Fase 1 - Melhorias Imediatas
- [ ] Implementar armazenamento blockchain
- [ ] Adicionar sistema de pagamento
- [ ] Implementar backend próprio

### Fase 2 - Funcionalidades
- [ ] Autenticação social
- [ ] Sistema de recompensas
- [ ] Notificações em tempo real

### Fase 3 - Escalabilidade
- [ ] Otimização de performance
- [ ] Sistema de cache
- [ ] Monitoramento avançado

## 📚 Recursos Adicionais

### Documentação
- [ZeroDev Documentation](https://docs.zerodev.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethereum Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)

### Comunidade
- [ZeroDev Discord](https://discord.zerodev.app)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com)
- [GitHub Issues](https://github.com/zerodev-examples/zerodev-token-shop/issues)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do [ZeroDev Discord](https://discord.zerodev.app).
