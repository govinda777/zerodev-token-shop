# Configuração do Privy - ZeroDev Token Shop

## Status Atual ✅

O Privy está configurado e funcionando com **login via carteira** (MetaMask, WalletConnect, etc.).

### Funcionalidades Ativas:
- ✅ Login com carteiras Web3 (MetaMask, WalletConnect, etc.)
- ✅ Embedded wallets para usuários sem carteira
- ✅ Tema dark com cores roxas
- ✅ Integração completa com o sistema de tokens

### Configuração Atual:

```typescript
// src/components/auth/AuthProvider.tsx
loginMethods: ['wallet'], // Apenas carteira por enquanto
```

## Variáveis de Ambiente

```bash
# .env
NEXT_PUBLIC_PRIVY_APP_ID=cmaqqs10k00onl20md0g7c7bg
NEXT_PUBLIC_ZERODEV_PROJECT_ID=ca6057ad-912b-4760-ac3d-1f3812d63b12
```

## Como Usar

### Hook Principal: `usePrivyAuth`

```typescript
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

function MyComponent() {
  const { 
    isAuthenticated, 
    address, 
    userInfo, 
    connect, 
    disconnect 
  } = usePrivyAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Conectado: {address}</p>
          <button onClick={disconnect}>Desconectar</button>
        </div>
      ) : (
        <button onClick={connect}>Conectar Carteira</button>
      )}
    </div>
  );
}
```

### Estados Disponíveis:
- `isReady`: Privy carregou completamente
- `isAuthenticated`: Usuário está logado
- `isConnecting`: Processo de conexão em andamento
- `isConnected`: Alias para isAuthenticated

### Dados do Usuário:
- `user`: Objeto completo do usuário Privy
- `address`: Endereço da carteira conectada
- `userInfo`: Informações formatadas do usuário
- `hasWallet`: Verifica se tem carteira conectada

### Ações:
- `connect()`: Inicia processo de login
- `disconnect()`: Faz logout
- `connectWallet()`: Conecta carteira adicional
- `linkWallet()`: Vincula nova carteira

## Habilitando Login com Google 🔄

Para habilitar o login com Google, você precisa:

### 1. Configurar no Dashboard do Privy
1. Acesse [dashboard.privy.io](https://dashboard.privy.io)
2. Selecione seu app (ID: `cmaqqs10k00onl20md0g7c7bg`)
3. Vá em **Login Methods**
4. Habilite **Google OAuth**
5. Configure as URLs de callback

### 2. Atualizar a Configuração
```typescript
// src/components/auth/AuthProvider.tsx
loginMethods: ['wallet', 'google'], // Adicionar 'google'
```

### 3. Atualizar o Hook (se necessário)
```typescript
// src/hooks/usePrivyAuth.ts
const hasGoogle = !!user?.google?.email;
```

## Troubleshooting

### Erro: "Login with Google not allowed"
- **Causa**: Google OAuth não está configurado no dashboard do Privy
- **Solução**: Configure o Google OAuth no dashboard ou remova 'google' dos loginMethods

### Erro: "NEXT_PUBLIC_PRIVY_APP_ID is not set"
- **Causa**: Variável de ambiente não configurada
- **Solução**: Copie o arquivo `env-example` para `.env`

### Tela de carregamento infinita
- **Causa**: App ID inválido ou problemas de rede
- **Solução**: Verifique o App ID e conexão com internet

## Componentes Principais

### AuthProvider
- Wrapper principal do Privy
- Configuração de tema e métodos de login
- Tratamento de erros

### LoginDemo
- Componente de demonstração
- Mostra status de conexão
- Botões para conectar/desconectar

### PrivyLoadingScreen
- Tela de carregamento elegante
- Exibida enquanto o Privy inicializa

## Próximos Passos

1. **Configurar Google OAuth** no dashboard do Privy
2. **Adicionar mais redes** (Polygon, BSC, etc.)
3. **Implementar social recovery** para carteiras
4. **Adicionar mais métodos de login** (Twitter, Discord, etc.)

## Recursos Úteis

- [Documentação do Privy](https://docs.privy.io/)
- [Dashboard do Privy](https://dashboard.privy.io)
- [Exemplos de Código](https://github.com/privy-io/privy-react-auth)

---

**Status**: ✅ Funcionando com carteiras Web3  
**Última atualização**: 2024-07-27
**Próximo milestone**: Configurar Google OAuth 