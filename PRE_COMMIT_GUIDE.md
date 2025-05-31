# Pre-commit Hook - Guia de Uso

## 📋 Visão Geral

O projeto ZeroDev Token Shop utiliza **Husky** para executar automaticamente testes de unidade antes de cada commit, garantindo que apenas código testado e funcionando seja commitado no repositório.

## 🚀 Como Funciona

### Fluxo Normal de Commit

```bash
# 1. Fazer suas alterações
git add .

# 2. Tentar fazer commit
git commit -m "feat: nova funcionalidade"

# 3. Pre-commit executa automaticamente
🧪 Executando testes de unidade...
# (A saída exata do teste pode variar)
# Exemplo:
# PASS  src/hooks/usePrivyAuth.test.ts
# PASS  src/components/auth/LoginDemo.test.tsx
# ... mais testes ...

# Test Suites: XX passed, XX total
# Tests:       YY passed, YY total

✅ Testes de unidade passaram!

# 4. Commit é realizado com sucesso
[main abc1234] feat: nova funcionalidade
```

### Quando os Testes Falham

```bash
git commit -m "feat: código com bug"

🧪 Executando testes de unidade...
 FAIL  src/components/auth/LoginDemo.test.tsx
  ● LoginDemo › deve renderizar corretamente
    Expected: "Login"
    Received: "Loginn"

❌ Testes de unidade falharam. Commit cancelado.
💡 Execute 'npm run test:unit' para ver os detalhes dos erros.

# Commit é cancelado - você precisa corrigir os erros primeiro
```

## 🧪 Testes Executados

O pre-commit executa os testes de unidade definidos no script `test:unit` do `package.json`.
O número exato de testes pode variar conforme o desenvolvimento.

**Tempo médio de execução**: Varia, mas geralmente alguns segundos.

## 🛠️ Scripts Disponíveis

### Scripts de Teste

```bash
# Executar apenas os testes de unidade (usados pelo pre-commit)
yarn test:unit

# Executar testes de unidade em modo watch (desenvolvimento)
yarn test:unit:watch # Ou o alias configurado em package.json

# Executar testes de unidade com relatório de cobertura
yarn test:unit:coverage # Ou o alias configurado

# Executar TODOS os testes (unitários e e2e, se configurado)
yarn test

# Executar testes End-to-End (Playwright)
yarn test:e2e
```

### Scripts de Commit/Push

```bash
# Push normal (executará pre-push hook se configurado)
git push

# Push pulando hooks de Git (emergência, não recomendado)
git push --no-verify

# (Outros scripts como push:skip-tests, push:all-tests dependem da configuração em package.json)
```

## 🚨 Situações Especiais

### 1. Pular Pre-commit (Emergência)

```bash
# Método 1: Flag --no-verify
git commit -m "hotfix: correção urgente" --no-verify

# Método 2: Script específico
npm run push:skip-tests
```

⚠️ **Use apenas em emergências!** Sempre execute os testes manualmente depois.

### 2. Debugging de Testes

```bash
# Ver detalhes dos erros
npm run test:unit -- --verbose

# Executar teste específico
npm test -- --testPathPattern="LoginDemo"

# Executar com watch para desenvolvimento
npm run test:unit:watch
```

### 3. Verificar Status do Pre-commit

```bash
# Executar manualmente o pre-commit
.husky/pre-commit

# Verificar se Husky está instalado
npx husky --version

# Reinstalar hooks (se necessário)
npm run prepare
```

## 🔧 Configuração Técnica

### Arquivos Envolvidos

```
.husky/
├── pre-commit          # Script executado antes do commit
└── _/
    └── husky.sh       # Configuração do Husky

package.json            # Scripts npm
jest.config.js         # Configuração do Jest
src/setupTests.ts      # Setup global dos testes
```

### Conteúdo do Pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🧪 Executando testes de unidade..."

# Executar testes de unidade
yarn test:unit --silent # ou o comando exato do seu package.json

if [ $? -ne 0 ]; then
  echo "❌ Testes de unidade falharam. Commit cancelado."
  echo "💡 Execute 'npm run test:unit' para ver os detalhes dos erros."
  exit 1
fi

echo "✅ Testes de unidade passaram!"
```

## 📊 Benefícios

### Para o Desenvolvedor
- ✅ **Feedback imediato**: Detecta problemas antes do push
- ✅ **Menos debugging**: Evita bugs em produção
- ✅ **Confiança**: Sabe que o código está testado

### Para a Equipe
- ✅ **Repositório estável**: Sempre em estado funcional
- ✅ **CI/CD otimizado**: Menos falhas no pipeline
- ✅ **Colaboração**: Reduz conflitos e retrabalho

### Para o Projeto
- ✅ **Qualidade**: Mantém padrão alto de código
- ✅ **Produtividade**: Menos tempo corrigindo bugs
- ✅ **Confiabilidade**: Deploy mais seguro

## 🐛 Troubleshooting

### Problema: "Husky command not found"

```bash
# Solução: Reinstalar Husky
yarn add husky --dev
yarn prepare # Ou o comando configurado em package.json para 'prepare'
```

### Problema: "Permission denied"

```bash
# Solução: Dar permissão de execução
chmod +x .husky/pre-commit
```

### Problema: "Tests taking too long"

```bash
# Solução: Executar apenas testes específicos
yarn test:unit --testPathPattern="usePrivyAuth" # Exemplo
```

### Problema: "False positives"

```bash
# Solução: Verificar se há testes instáveis
yarn test # Executar todos os testes para identificar

# Se necessário, revisar ou desabilitar temporariamente o teste problemático
# (e investigar a causa da instabilidade)
```

## 📝 Boas Práticas

### ✅ Faça

- Execute `yarn test:unit` antes de commitar se quiser verificar manualmente.
- Corrija todos os testes que falharem.
- Use commits pequenos e frequentes.
- Escreva mensagens de commit descritivas.

### ❌ Evite

- Usar `--no-verify` em commits ou `git push --no-verify` sem um bom motivo.
- Commitar código que você sabe que está quebrando os testes.
- Ignorar falhas de teste reportadas pelo hook.
- Fazer commits muito grandes que dificultam a identificação de problemas se os testes falharem.

## 🔄 Workflow Recomendado

```bash
# 1. Desenvolvimento
yarn test:unit:watch  # Executar testes de unidade em modo watch enquanto desenvolve

# 2. Antes do commit
yarn lint             # Opcional, mas recomendado: verificar lint e formatação
yarn test:unit        # Verificar se todos os testes de unidade passam

# 3. Commit
git add .
git commit -m "feat: nova funcionalidade"  # Pre-commit hook executa 'yarn test:unit --silent' automaticamente

# 4. Push
git push                 # (Pre-push hook pode executar mais testes, como 'yarn test:e2e', se configurado)
```

## 📞 Suporte

Se você encontrar problemas com o pre-commit:

1. **Primeiro**: Execute `npm run test:unit` manualmente
2. **Segundo**: Verifique os logs de erro
3. **Terceiro**: Consulte este guia
4. **Último recurso**: Use `--no-verify` e corrija depois

---

**Lembre-se**: O pre-commit está aqui para ajudar, não atrapalhar! 🚀 