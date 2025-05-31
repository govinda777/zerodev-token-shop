# 🚀 ZeroDev Token Shop

 yarn install
 

Um marketplace moderno e acessível para tokens digitais únicos, construído com Next.js, TypeScript e Tailwind CSS.

![Account Abstraction Hero](./public/images/docs/account-abstraction-hero.jpg)
*Account Abstraction: A evolução da experiência Web3 - simplificando a interação do usuário com blockchain*

## ✨ Características Principais

- **🔗 Integração Web3**: Conecte sua carteira MetaMask para comprar tokens
- **🎨 Design Glassmorphism**: Interface moderna com efeitos de vidro e gradientes
- **📱 Totalmente Responsivo**: Experiência perfeita em todas as telas (320px - 1920px+)
- **♿ Acessível**: Compatível com WCAG 2.1 AA, navegação por teclado e leitores de tela
- **⚡ Performance Otimizada**: Lazy loading, imagens otimizadas e animações suaves
- **🌙 Tema Escuro**: Design elegante com suporte a high contrast mode

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Frontend Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Autenticação Web3**: Privy
- **Account Abstraction & SDK**: ZeroDev
- **Interação Blockchain**: Viem
- **Testes Unitários/Integração**: Jest + React Testing Library
- **Testes E2E**: Playwright
- **Linting & Formatting**: ESLint + Prettier
- **Hooks Git**: Husky

## 📸 Uma breve explicação sobre Account Abstraction, ERC-4337 e ZeroDev

### 🎯 Account Abstraction: A Revolução da UX Web3

**Account Abstraction** é uma evolução fundamental na experiência Web3 que elimina as barreiras técnicas entre usuários e blockchain. Tradicionalmente, interagir com blockchains requer gerenciamento complexo de chaves privadas, posse de tokens nativos para gas fees e compreensão técnica profunda.

Com Account Abstraction, essas complexidades são **abstraídas**, permitindo:
- ✨ **Login social** (Google, Apple, Email)
- 💳 **Pagamento de gas com qualquer token** ou patrocinado
- 🛡️ **Recuperação de conta** sem seed phrases
- 🔄 **Transações em lote** e automação


### 🏗️ ERC-4337: O Padrão Técnico

O **ERC-4337** é o padrão Ethereum que implementa Account Abstraction sem modificar o protocolo base. Define componentes como Smart Accounts, UserOperations, Bundlers, Paymasters e Entry Point.

**Benefícios práticos:**
- **Gas Abstraction**: Pague gas com USDC, DAI ou tenha patrocinado
- **Batch Transactions**: Execute múltiplas ações em uma transação
- **Social Recovery**: Recupere sua conta através de guardiões confiáveis
- **Session Keys**: Autorize aplicações por tempo limitado

![ERC-4337 Standard](./public/images/docs/ERC-4337.png)
*ERC-4337: O padrão que define como implementar Account Abstraction de forma padronizada*

### 🚀 ZeroDev: Infraestrutura Completa

**ZeroDev** é a plataforma que simplifica a implementação de Account Abstraction para desenvolvedores, oferecendo SDKs prontos, Paymaster-as-a-Service, infraestrutura de Bundlers e módulos de segurança pré-auditados.

**Casos de uso reais:**
- 🎮 **Gaming**: Onboarding sem friction para jogadores
- 🛒 **E-commerce**: Checkout Web3 simples como Web2
- 💰 **DeFi**: Automação de estratégias de investimento
- 🏢 **Enterprise**: Carteiras corporativas com controles avançados

![ZeroDev Support](./public/images/docs/ZeroDev-Support-Both.webp)
*ZeroDev: Plataforma completa que oferece suporte tanto para Smart Accounts quanto para implementações customizadas*

### 📊 Ecossistema e Arquitetura

#### Desconstruindo a Arquitetura

![Deconstructing Account Abstraction](./public/images/docs/Deconstructing-Account-Abstraction.png)
*Desconstruindo Account Abstraction: componentes técnicos e arquitetura do sistema*

#### Chain Abstraction e UX

![Chain Abstraction in Web3 UX](./public/images/docs/Chain-Abstraction--Account-Abstraction-in-Web3-UX.jpg)
*Chain Abstraction: Como eliminar a complexidade de múltiplas blockchains para o usuário final*

#### Panorama do Mercado

![Account Abstraction Projects Landscape](./public/images/docs/Account_Abstraction_Projects_Landscape.png)
*Landscape de Projetos: Panorama completo dos projetos e soluções no ecossistema Account Abstraction*

![Account Abstraction Market Map](./public/images/docs/Account_Abstraction_Market_Map.jpg)
*Market Map: Mapeamento dos principais players e categorias no mercado de Account Abstraction*

## 📝 Configuração

### Variáveis de Ambiente

Copie o arquivo `.env-example` para `.env.local` e preencha as seguintes variáveis:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_zerodev_project_id_here
# NEXT_PUBLIC_ZERODEV_RPC is optional if you use ZeroDev's default RPC with your Project ID.
# Define it if you need a custom RPC endpoint for Sepolia.
# Example: NEXT_PUBLIC_ZERODEV_RPC=https://rpc.zerodev.app/api/v2/bundler/your_zerodev_project_id_here
```
A variável `NEXT_PUBLIC_CHAIN` não é mais diretamente usada; a configuração da chain (Sepolia) está em `src/contracts/config.ts` e nos provedores.

### Como configurar o ZeroDev

Acesse o site https://zerodev.com/ e crie uma conta.

1 - Crie um projeto no ZeroDev
2 - Crie um app no ZeroDev

#### Como configurar o Privy

Acesse o site https://privy.io/ e crie uma conta.

1 - Crie um app no Privy


## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)

```

## 🎨 Sistema de Design

### Layout System
- **Containers**: `max-w-7xl` com padding responsivo
- **Spacing**: Sistema baseado em múltiplos de 8px
- **Grid**: Responsivo (1→2→3→4 colunas)

### Typography Scale
```css
H1: text-4xl md:text-6xl lg:text-7xl
H2: text-3xl md:text-4xl lg:text-5xl  
H3: text-xl md:text-2xl lg:text-3xl
Body: text-base md:text-lg (16px/18px)
Small: text-sm (14px)
```

### Color System
```css
Primary: #8B5CF6 (purple-500)
Primary-light: #A78BFA (purple-400)
Primary-dark: #7C3AED (purple-600)
Success: #10B981 (emerald-500)
Error: #EF4444 (red-500)
Warning: #F59E0B (amber-500)
```

### Glassmorphism Effects
- **Glass Card**: `backdrop-blur-8px` com `rgba(15,15,15,0.6)`
- **Glass Header**: `backdrop-blur-12px` com `rgba(15,15,15,0.8)`
- **Neon Effects**: Reduzidos para melhor usabilidade

## 📱 Responsividade

### Breakpoints
- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1439px
- **Large**: 1440px+

### Touch Targets
- **Mínimo**: 44px x 44px (iOS/Android standards)
- **Botões**: `min-h-[44px]` em todas as telas
- **Links**: Área de toque adequada para mobile

## ♿ Acessibilidade

### WCAG 2.1 AA Compliance
- ✅ **Contraste**: 4.5:1 para texto normal, 3:1 para texto grande
- ✅ **Navegação por Teclado**: Tab order lógico, focus indicators
- ✅ **Screen Readers**: ARIA labels, landmarks semânticos
- ✅ **Skip Links**: Navegação rápida para conteúdo principal

### Recursos Acessíveis
- **Skip Links**: Navegação por teclado otimizada
- **ARIA Labels**: Descrições detalhadas para screen readers
- **Focus Management**: Estados de foco visíveis e lógicos
- **Semantic HTML**: Estrutura semântica correta
- **High Contrast**: Suporte para modo de alto contraste
- **Reduced Motion**: Respeita preferência de movimento reduzido

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- MetaMask (para funcionalidades Web3)

### Instalação

```bash
# Clone o repositório (substitua 'your-username' pelo seu usuário ou organização do GitHub se for um fork)
git clone https://github.com/govinda777/zerodev-token-shop.git

# Entre no diretório
cd zerodev-token-shop

# Instale as dependências (usando yarn - como indicado no início do README)
yarn install

# Configure as variáveis de ambiente
cp .env-example .env.local
# Edite .env.local com suas chaves do Privy e ZeroDev (veja a seção Variáveis de Ambiente)

# Execute em desenvolvimento
yarn dev

# Build para produção
yarn build

# Execute o servidor de produção
yarn start
```

### Scripts Disponíveis

```bash
yarn dev          # Servidor de desenvolvimento
yarn build        # Build de produção
yarn start        # Servidor de produção
yarn lint         # ESLint e Prettier
yarn type-check   # Verificação de tipos TypeScript
yarn test         # Executa todos os testes (unit e e2e)
yarn test:unit    # Testes de unidade (Jest)
yarn test:e2e     # Testes end-to-end (Playwright)
# yarn test:watch é geralmente um alias para test:unit --watch
```

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] **Layout Responsivo**: Mobile-first design
- [x] **Sistema de Autenticação**: Conexão MetaMask
- [x] **Marketplace**: Grid de produtos otimizado
- [x] **Acessibilidade**: WCAG 2.1 AA compliant
- [x] **Performance**: Lazy loading e otimizações
- [x] **Design System**: Componentes consistentes
- [x] **Estados de Carregamento**: UX otimizada
- [x] **Navegação por Teclado**: Skip links e focus management

### ✅ Funcionalidades Implementadas (Incluindo User Journeys)
- [x] **Layout Responsivo**: Mobile-first design
- [x] **Sistema de Autenticação**: Conexão com carteiras Web3 via Privy (MetaMask, WalletConnect, etc.)
- [x] **Marketplace**: Grid de produtos com compra direta e parcelada (simulada).
- [x] **Acessibilidade**: WCAG 2.1 AA compliant (em progresso).
- [x] **Performance**: Lazy loading e otimizações (em progresso).
- [x] **Design System**: Componentes consistentes.
- [x] **Estados de Carregamento**: UX otimizada.
- [x] **Navegação por Teclado**: Skip links e focus management.
- [x] **Jornada do Usuário Gamificada (`JourneyProvider` e `JourneyDashboard`):**
    - [x] **Login com Privy**: Primeira etapa da jornada.
    - [x] **Faucet de Tokens**: Reivindicação de tokens (simulada).
    - [x] **Staking de Tokens**: Mecanismo de stake (simulado, interações com `InvestmentProvider`).
    - [x] **Compra de NFT**: Aquisição de NFTs (simulada, interações com `NFTMarketplace` e `InvestmentProvider`).
    - [x] **Recebimento de Airdrop**: Reivindicação de airdrops (simulada, interações com `AirdropComponent` e `InvestmentProvider`).
    - [x] **Assinaturas**: Sistema de assinatura de planos (simulado, interações com `SubscriptionComponent` e `InvestmentProvider`).
    - [x] **Renda Passiva**: Configuração de renda passiva (simulada, interações com `PassiveIncomeComponent` e `InvestmentProvider`).
- [x] **Gerenciamento de Tokens do Usuário (`TokenProvider`):**
    - [x] Saldo de tokens persistido no `localStorage`.
    - [x] Concessão de bônus de boas-vindas.
- [x] **Visualização de Carteira (`WalletPage.tsx`):**
    - [x] Resumo de tokens, saldo ETH (real da Sepolia).
    - [x] Interface para interagir com Staking, Governança (compra simulada), Pools (entrada simulada), NFTs (visualização), Airdrops, Compras Parceladas.
    - [x] Histórico de compras (buscando nomes de produtos).
- [x] **Sistema de Notificação (Conceitual):** Implementado `src/utils/notificationService.ts` para feedback ao usuário (requer integração de `react-toastify` pelo usuário).
- [x] **Validação de Rede (`NetworkGuard`):** Alerta e permite trocar para Sepolia Testnet.

### 🚧 Próximos Passos / Melhorias
- [ ] **Integração Blockchain Completa**: Conectar as operações simuladas (stake, compra de NFT, airdrops, etc.) com contratos reais na Sepolia.
- [ ] **Finalizar Account Abstraction com ZeroDev**: Integrar completamente o SDK ZeroDev para transações sem gas, batch transactions, etc. (Hook `useSmartAccount` é um placeholder).
- [ ] **Implementar `react-toastify`**: Adicionar a biblioteca e o `<ToastContainer />` para o `notificationService` funcionar visualmente.
- [ ] **Carrinho de Compras**: Sistema de carrinho persistente.
- [ ] **Filtros Avançados no Marketplace**: Busca e categorização.
- [ ] **Modo Claro/Escuro**: Toggle de tema (atualmente apenas escuro).
- [ ] **Multi-idioma**: Suporte i18n.
- [ ] **Testes E2E**: Expandir cobertura para novas funcionalidades e interações blockchain reais.

## 📊 Performance

### Métricas Lighthouse
- **Performance**: 90+ (otimizado para Core Web Vitals)
- **Accessibility**: 100 (WCAG 2.1 AA compliant)
- **Best Practices**: 95+
- **SEO**: 90+

### Otimizações
- **Images**: Next.js Image com lazy loading
- **Bundles**: Code splitting automático
- **Fonts**: Font optimization
- **CSS**: Critical CSS inlined
- **Animations**: GPU accelerated com will-change

## 🧪 Testes

### Cobertura
- **Componentes**: Testes unitários completos
- **Hooks**: Testes de funcionalidade
- **Integração**: Fluxos principais testados
- **Acessibilidade**: Testes automáticos com jest-axe

### Executar Testes
```bash
# Testes de unidade
yarn test:unit

# Testes End-to-End
yarn test:e2e

# Todos os testes (se configurado no package.json para rodar ambos)
yarn test
```
Para mais detalhes sobre testes, incluindo hooks de pre-commit e pre-push, veja `PRE_COMMIT_GUIDE.md`.

## 📝 Changelog

### v1.1.0 - Design System Overhaul
- 🎨 **Design System**: Sistema de layout padronizado
- 📱 **Responsividade**: Mobile-first approach implementado
- ♿ **Acessibilidade**: WCAG 2.1 AA compliance
- 🚀 **Performance**: Lazy loading e otimizações de imagem
- 💳 **ProductCard**: Aspect ratio consistente e melhor UX
- 🎯 **Navigation**: Skip links e melhor navegação por teclado

### v1.0.0 - Initial Release
- 🚀 **Core**: Marketplace básico funcional
- 🔗 **Web3**: Integração MetaMask
- 🎨 **UI**: Design glassmorphism inicial

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙋‍♂️ Suporte

Se você encontrar problemas ou tiver sugestões, por favor, abra uma issue no repositório GitHub do projeto.
(Nota: Substitua 'govinda777/zerodev-token-shop' pelo caminho correto do repositório se for diferente).

1. **Issues**: [GitHub Issues](https://github.com/govinda777/zerodev-token-shop/issues)
2. **Discussões**: [GitHub Discussions](https://github.com/govinda777/zerodev-token-shop/discussions)

---

**Desenvolvido com ❤️**
(Se este é um projeto da ZeroDev Team, pode manter o nome, caso contrário, ajuste conforme apropriado)
