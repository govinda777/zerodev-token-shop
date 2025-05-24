# PROMPT PARA CORREÇÃO E MELHORIA DO DESIGN - ZERODEV TOKEN SHOP

## CONTEXTO ATUAL
O projeto ZeroDev Token Shop é uma aplicação Next.js com design glassmorphism e gradientes roxos. Atualmente tem componentes funcionais mas necessita melhorias significativas no layout, responsividade e experiência do usuário.

## PROBLEMAS IDENTIFICADOS E SOLUÇÕES NECESSÁRIAS

### 1. **LAYOUT E ESPAÇAMENTO**
#### Problemas:
- Espaçamentos inconsistentes entre seções
- Falta de hierarquia visual clara 
- Elementos muito próximos ou muito distantes
- Grid de produtos não está otimizado

#### Correções necessárias:
- Padronizar sistema de espaçamento (usar múltiplos de 8px: 8, 16, 24, 32, 48, 64, 96)
- Criar hierarquia visual clara com tamanhos de fonte progressivos
- Melhorar o grid responsivo dos produtos (1 col mobile, 2 tablet, 3-4 desktop)
- Adicionar containers com max-width consistentes

### 2. **RESPONSIVIDADE**
#### Problemas:
- Layout quebra em telas pequenas
- Texto muito pequeno no mobile
- Botões difíceis de tocar em mobile
- Menu mobile não intuitivo

#### Correções necessárias:
- Mobile-first approach com breakpoints: 375px, 768px, 1024px, 1440px
- Aumentar tamanhos de fonte para mobile (mínimo 16px para texto base)
- Botões com altura mínima de 44px para touch targets
- Menu hambúrguer mais acessível com animações suaves

### 3. **TIPOGRAFIA**
#### Problemas:
- Hierarquia de títulos inconsistente
- Contraste insuficiente em alguns textos
- Line-height inadequado para leitura

#### Correções necessárias:
- Escala tipográfica clara: H1(48-72px), H2(36-48px), H3(24-32px), Body(16-18px)
- Melhorar contraste para acessibilidade (mínimo 4.5:1)
- Line-height otimizado: títulos 1.2, corpo 1.6

### 4. **CORES E CONTRASTES**
#### Problemas:
- Alguns elementos com baixo contraste
- Cores de estado (success, error, warning) inconsistentes
- Efeitos neon muito intensos causando fadiga visual

#### Correções necessárias:
- Suavizar efeitos neon mantendo a identidade visual
- Criar palette de cores de estado consistente
- Garantir contraste WCAG AA em todos os textos

### 5. **COMPONENTES ESPECÍFICOS**

#### Header:
- Simplificar navegação desktop
- Melhorar indicador de carteira conectada
- Otimizar TokenBalance display
- Menu mobile mais intuitivo

#### ProductGrid:
- Cards com aspect ratio consistente (16:9 ou 4:3)
- Hover states mais sutis
- Loading states mais elegantes
- Melhor tratamento de estados vazios

#### ProductCard:
- Imagens com lazy loading e fallbacks
- Preços mais destacados
- Botões de ação mais evidentes
- Estados de produto esgotado

#### Footer:
- Informações organizadas em colunas
- Links de navegação secundária
- Informações legais e contato

### 6. **ANIMAÇÕES E MICROINTERAÇÕES**
#### Problemas:
- Animações muito rápidas ou lentas
- Falta de feedback visual em ações
- Transições abruptas

#### Correções necessárias:
- Timing consistente: 150ms para microinterações, 300ms para transições
- Easing natural (ease-out para entrada, ease-in para saída)
- Loading states animados
- Feedback visual em hover, focus e active

### 7. **ACESSIBILIDADE**
#### Problemas:
- Falta de labels adequados
- Navegação por teclado limitada
- Contraste insuficiente em alguns elementos

#### Correções necessárias:
- ARIA labels em todos os elementos interativos
- Focus indicators visíveis
- Skip links para navegação
- Suporte completo a screen readers

## IMPLEMENTAÇÃO PRIORITÁRIA

### FASE 1 - ESTRUTURA BASE (ALTA PRIORIDADE)
1. **Layout System**
   ```css
   - Container max-width: 1200px
   - Padding lateral: 16px mobile, 24px tablet, 32px desktop
   - Seções: py-16 mobile, py-24 desktop
   - Cards: p-6 mobile, p-8 desktop
   ```

2. **Typography Scale**
   ```css
   - H1: text-4xl md:text-6xl (36px/60px)
   - H2: text-3xl md:text-4xl (30px/36px)  
   - H3: text-xl md:text-2xl (20px/24px)
   - Body: text-base md:text-lg (16px/18px)
   - Small: text-sm (14px)
   ```

3. **Color System**
   ```css
   - Primary: #8B5CF6 (purple-500)
   - Primary-light: #A78BFA (purple-400)
   - Primary-dark: #7C3AED (purple-600)
   - Success: #10B981 (emerald-500)
   - Error: #EF4444 (red-500)
   - Warning: #F59E0B (amber-500)
   - Background: #0F0F0F
   - Surface: rgba(255,255,255,0.05)
   ```

### FASE 2 - COMPONENTES CRÍTICOS (MÉDIA PRIORIDADE)
1. **Header otimizado**
2. **ProductGrid responsivo**
3. **ProductCard redesign**
4. **Estados de loading melhorados**

### FASE 3 - REFINAMENTOS (BAIXA PRIORIDADE)
1. **Animações avançadas**
2. **Microinterações**
3. **Dark mode toggle**
4. **Tema customizável**

## CÓDIGO DE EXEMPLO PARA IMPLEMENTAR

### Container responsivo:
```jsx
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* conteúdo */}
</div>
```

### Grid de produtos otimizado:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
  {/* produtos */}
</div>
```

### Typography components:
```jsx
const Typography = {
  H1: "text-4xl md:text-6xl font-bold font-heading leading-tight",
  H2: "text-3xl md:text-4xl font-bold font-heading leading-tight", 
  H3: "text-xl md:text-2xl font-semibold leading-snug",
  Body: "text-base md:text-lg leading-relaxed",
}
```

## CRITÉRIOS DE SUCESSO
- [ ] Layout funciona perfeitamente em todas as telas (320px - 1920px)
- [ ] Contraste WCAG AA em todos os textos
- [ ] Navegação por teclado 100% funcional
- [ ] Tempos de carregamento otimizados
- [ ] Design system consistente
- [ ] Microinterações fluidas
- [ ] Estados de loading elegantes
- [ ] Feedback visual em todas as ações

## FERRAMENTAS PARA VALIDAÇÃO
- Lighthouse (Performance, Accessibility, SEO)
- axe DevTools (Acessibilidade)
- ResponsivelyApp (Testes de responsividade)
- Color contrast analyzers

## NOTAS FINAIS
Este prompt deve ser executado com foco na experiência do usuário, priorizando clareza, usabilidade e acessibilidade sobre efeitos visuais complexos. O objetivo é criar um design profissional, moderno e funcional que transmita confiança e facilite a navegação.

**Tempo estimado de implementação:** 2-3 dias de desenvolvimento focado.
**Impacto esperado:** Melhoria significativa na UX, aumento na taxa de conversão e maior acessibilidade. 