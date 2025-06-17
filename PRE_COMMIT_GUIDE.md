# 🔧 Guia de Pre-commit e Testes

Este guia explica como configurar e usar os hooks de pre-commit e pre-push para manter a qualidade do código.

## 📋 Visão Geral

O projeto usa **Husky** para executar verificações automáticas antes de commits e pushes:

- **Pre-commit**: Executa testes unitários rápidos
- **Pre-push**: Executa validações completas da pipeline

## 🚀 Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Husky (se necessário)
```bash
npx husky install
```

## 🧪 Testes Unitários

### Execução Manual
```bash
# Executar todos os testes unitários
npm run test:unit

# Executar em modo watch (desenvolvimento)
npm run test:unit:watch # Ou o alias configurado em package.json

# Executar com coverage
npm run test:unit:coverage # Ou o alias configurado
```

### Testes Específicos
```bash
# Executar testes de um arquivo específico
npm run test

# Executar testes E2E
npm run test:e2e
```

## 🔄 Hooks Automáticos

### Pre-commit Hook
Executa automaticamente antes de cada commit:

```bash
# O que é executado:
npm run test:unit --silent # ou o comando exato do seu package.json
```

**Se os testes falharem**, o commit será cancelado.

### Pre-push Hook
Executa validações completas antes do push:

1. **Verificação de arquivos essenciais**
2. **Instalação de dependências** 
3. **Lint check**
4. **Type check**
5. **Testes unitários**
6. **Build test**

## 🛠️ Configuração do Husky

### Instalação
```bash
npm add husky --dev
npm prepare # Ou o comando configurado em package.json para 'prepare'
```

### Hooks Configurados

#### `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test:unit --testPathPattern="usePrivyAuth" # Exemplo
```

#### `.husky/pre-push`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Execute npm test # Executar todos os testes para identificar
node scripts/pre-push-test.js
```

## 🐛 Troubleshooting

### Testes Falhando no Pre-commit

1. **Identifique o problema**:
   ```bash
   npm run test:unit
   ```

2. **Corrija os testes ou código**

3. **Teste novamente**:
   ```bash
   npm run test:unit
   ```

4. **Commit novamente**

### Bypass Temporário (NÃO RECOMENDADO)
```bash
# Apenas em emergências
git commit --no-verify -m "fix: correção urgente"
```

### Problemas com Husky
```bash
# Reinstalar hooks
npx husky install
```

## 📝 Fluxo de Desenvolvimento Recomendado

### Durante o Desenvolvimento
```bash
npm run test:unit:watch  # Executar testes de unidade em modo watch enquanto desenvolve
```

### Antes de Commitar
```bash
npm run lint             # Opcional, mas recomendado: verificar lint e formatação
npm run test:unit        # Verificar se todos os testes de unidade passam
```

### Commit
```bash
git add .
git commit -m "feat: nova funcionalidade"  # Pre-commit hook executa 'npm run test:unit --silent' automaticamente
```

### Push
```bash
git push                 # (Pre-push hook pode executar mais testes, como 'npm run test:e2e', se configurado)
```

## ⚙️ Configuração Avançada

### Customizar Testes do Pre-commit

Edite `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Executar apenas testes específicos
npm run test:unit --testPathPattern="(usePrivyAuth|ProductCard|AuthButton)"

# Ou executar todos os testes unitários
npm run test:unit
```

### Configurar Pre-push Personalizado

Edite `scripts/pre-push-test.js` para adicionar/remover verificações.

### Desabilitar Hooks Temporariamente

```bash
# Desabilitar para um commit específico
git commit --no-verify -m "commit sem verificações"

# Desabilitar para um push específico  
git push --no-verify
```

## 📊 Métricas e Coverage

### Executar com Coverage
```bash
npm run test:unit:coverage
```

### Visualizar Relatório
O relatório de coverage é gerado em `coverage/lcov-report/index.html`.

## 🔍 Debugging de Testes

### Executar Testes Específicos
```bash
# Por arquivo
npm run test:unit src/hooks/usePrivyAuth.test.ts

# Por padrão
npm run test:unit --testNamePattern="should connect"
```

### Modo Debug
```bash
# Com logs detalhados
npm run test:unit --verbose

# Com watch mode
npm run test:unit --watch
```

## 📚 Recursos Adicionais

- [Husky Documentation](https://typicode.github.io/husky/)
- [Jest Testing Framework](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

## 🎯 Melhores Práticas

1. **Sempre execute testes antes de commitar**
2. **Mantenha testes rápidos e focados**
3. **Use mocks para dependências externas**
4. **Escreva testes para novos recursos**
5. **Mantenha coverage alto (>80%)**

---

**Lembre-se**: Os hooks existem para manter a qualidade do código. Se estão falhando, há algo que precisa ser corrigido! 🚀 