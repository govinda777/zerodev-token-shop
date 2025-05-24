# 🚀 ZeroDev Token Shop

Um marketplace moderno e acessível para tokens digitais únicos, construído com Next.js, TypeScript e Tailwind CSS.

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
- **Web3**: MetaMask integration
- **Testes**: Jest + React Testing Library
- **Lint**: ESLint + Prettier

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globais e sistema de design
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/
│   ├── auth/              # Componentes de autenticação
│   ├── common/            # Componentes reutilizáveis
│   │   ├── Header.tsx     # Cabeçalho responsivo
│   │   ├── Footer.tsx     # Rodapé
│   │   ├── SkipLinks.tsx  # Links de navegação acessível
│   │   └── TokenBalance.tsx
│   └── shop/              # Componentes do marketplace
│       ├── ProductCard.tsx # Card de produto otimizado
│       ├── ProductGrid.tsx # Grid responsivo
│       └── ...
├── hooks/                 # React Hooks customizados
├── types/                 # Definições TypeScript
└── utils/                 # Funções utilitárias
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
# Clone o repositório
git clone https://github.com/usuario/zerodev-token-shop.git

# Entre no diretório
cd zerodev-token-shop

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Execute os testes
npm test

# Build para produção
npm run build
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
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

### 🚧 Em Desenvolvimento
- [ ] **Carrinho de Compras**: Sistema de carrinho persistente
- [ ] **Histórico de Transações**: Visualização de compras
- [ ] **Filtros Avançados**: Busca e categorização
- [ ] **Modo Escuro**: Toggle de tema
- [ ] **Multi-idioma**: Suporte i18n

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
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Configuração

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

Se você encontrar problemas ou tiver sugestões:

1. **Issues**: [GitHub Issues](https://github.com/usuario/zerodev-token-shop/issues)
2. **Discussões**: [GitHub Discussions](https://github.com/usuario/zerodev-token-shop/discussions)
3. **Email**: suporte@zerodev-token-shop.com

---

**Feito com ❤️ by ZeroDev Team**
