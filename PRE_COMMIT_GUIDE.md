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
 PASS  src/hooks/usePrivyAuth.test.ts
 PASS  src/components/auth/LoginDemo.test.tsx
 PASS  src/components/auth/PrivyLoadingScreen.test.tsx
 PASS  src/components/shop/ProductCard.test.tsx

Test Suites: 4 passed, 4 total
Tests:       44 passed, 44 total

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

O pre-commit executa apenas os testes que estão **100% estáveis**:

| Arquivo | Testes | Descrição |
|---------|--------|-----------|
| `usePrivyAuth.test.ts` | 8 | Hook de autenticação |
| `LoginDemo.test.tsx` | 11 | Componente de demo de login |
| `PrivyLoadingScreen.test.tsx` | 9 | Tela de loading |
| `ProductCard.test.tsx` | 16 | Card de produto |
| **Total** | **44** | **100% passando** |

**Tempo médio de execução**: ~6 segundos

## 🛠️ Scripts Disponíveis

### Scripts de Teste

```bash
# Executar apenas os testes do pre-commit
npm run test:unit

# Executar testes em modo watch (desenvolvimento)
npm run test:unit:watch

# Executar testes com relatório de cobertura
npm run test:unit:coverage

# Executar TODOS os testes (incluindo os instáveis)
npm run test:all
```

### Scripts de Commit/Push

```bash
# Push normal (com testes)
git push

# Push pulando testes (emergência)
npm run push:skip-tests

# Push com todos os testes (incluindo e2e)
npm run push:all-tests
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
npm run test:unit -- --silent

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
npm install husky --save-dev
npm run prepare
```

### Problema: "Permission denied"

```bash
# Solução: Dar permissão de execução
chmod +x .husky/pre-commit
```

### Problema: "Tests taking too long"

```bash
# Solução: Executar apenas testes específicos
npm run test:unit -- --testPathPattern="usePrivyAuth"
```

### Problema: "False positives"

```bash
# Solução: Verificar se há testes instáveis
npm run test:all

# Se necessário, remover teste instável do pre-commit
# (editar package.json > test:unit)
```

## 📝 Boas Práticas

### ✅ Faça

- Execute `npm run test:unit` antes de commitar
- Corrija todos os testes que falharem
- Use commits pequenos e frequentes
- Escreva mensagens de commit descritivas

### ❌ Evite

- Usar `--no-verify` sem necessidade
- Commitar código não testado
- Ignorar falhas de teste
- Fazer commits muito grandes

## 🔄 Workflow Recomendado

```bash
# 1. Desenvolvimento
npm run test:unit:watch  # Executar em paralelo

# 2. Antes do commit
npm run test:unit        # Verificar se tudo passa

# 3. Commit
git add .
git commit -m "feat: nova funcionalidade"  # Pre-commit executa automaticamente

# 4. Push
git push                 # Ou npm run push:all-tests para testes completos
```

## 📞 Suporte

Se você encontrar problemas com o pre-commit:

1. **Primeiro**: Execute `npm run test:unit` manualmente
2. **Segundo**: Verifique os logs de erro
3. **Terceiro**: Consulte este guia
4. **Último recurso**: Use `--no-verify` e corrija depois

---

**Lembre-se**: O pre-commit está aqui para ajudar, não atrapalhar! 🚀 