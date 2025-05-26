# Jornadas do Usuário

O layout da home não está fazendo muito sentido.

A ideia era criar uma página onde conforme o usuário faça as missões ele seja capaz de esperimentar novas funcionalidades.

Exemplo:

1 - Login
2 - Faucets
3 - Stacke
4 - By NFE 
5 - Get Air Drop
6 - Fazer assinatura, pagamento mensal ou anual
7 - Renda Passiva


## 1. Login e Recompensa Inicial

**Objetivo:** Permitir que o usuário acesse a plataforma e receba tokens de boas-vindas.

**Passos:**
1. O usuário acessa a página inicial da aplicação.
2. Clica no botão **"Login"**.
3. É solicitado a conectar sua carteira Ethereum (via ZeroDev).
4. Após o primeiro login bem-sucedido:
   - O sistema detecta que é o primeiro acesso.
   - O usuário recebe automaticamente 10 tokens de recompensa.
   - O saldo de tokens é atualizado e exibido na interface.
5. O sistema registra logs de autenticação, incluindo endereço da carteira, timestamp e status da tentativa.

---

## 2. Visualização de Saldo e Histórico

**Objetivo:** Permitir que o usuário acompanhe seu saldo de tokens e histórico de compras.

**Passos:**
1. Após o login, o usuário visualiza seu saldo atual de tokens no dashboard.
2. O usuário pode acessar a seção **"Histórico de Compras"** para ver todas as transações realizadas, incluindo data, produto/serviço adquirido e quantidade de tokens gastos.

---

## 3. Compra de Produtos e Serviços

**Objetivo:** Permitir que o usuário utilize tokens para adquirir produtos ou serviços.

**Passos:**
1. O usuário navega até a loja de produtos.
2. Visualiza uma lista de pelo menos 5 produtos, cada um com nome, descrição e imagem.
3. Para cada produto, há um botão **"Comprar"** (custo: 1 token).
4. Ao clicar em "Comprar":
   - O saldo de tokens do usuário é verificado.
   - Se houver saldo suficiente, a compra é realizada.
   - O saldo é atualizado e o histórico de compras é incrementado.
   - Um feedback visual confirma a compra bem-sucedida.
   - Se não houver saldo suficiente, o usuário recebe uma mensagem de erro.

---

## 4. Investimento e Stacke de Tokens

**Objetivo:** Permitir que o usuário invista tokens para obter benefícios adicionais.

**Passos:**
1. O usuário acessa a área de investimentos.
2. Pode optar por:
   - Stackear tokens para ganhar mais tokens.
   - Comprar tokens de governança.
   - Participar de pools de tokens.
   - Adquirir NFTs de participação.
3. O sistema exibe informações sobre cada opção e os requisitos necessários (ex: quantidade mínima de tokens para stacke).

---

## 5. Pagamento Parcelado

**Objetivo:** Permitir que o usuário compre produtos/serviços de forma parcelada.

**Passos:**
1. O usuário seleciona um produto/serviço elegível para parcelamento.
2. O sistema verifica se o usuário possui a quantidade mínima de tokens em stacke.
3. Se sim, a opção de parcelamento é liberada.
4. O usuário escolhe o número de parcelas e confirma a compra.
5. O sistema registra a transação e atualiza o saldo e o histórico.

---

## 6. NFTs e Airdrops

**Objetivo:** Permitir que o usuário receba NFTs e participe de airdrops.

**Passos:**
1. O usuário pode receber NFTs de participação na comunidade ou em eventos especiais.
2. O sistema pode realizar airdrops automáticos de diferentes tipos de tokens (governança, stacke, pool, investimento, pagamento).
3. O usuário é notificado sobre os recebimentos e pode visualizar seus NFTs e tokens na plataforma.

---

## Observações Gerais

- Todas as ações relevantes são registradas em logs para auditoria e análise.
- O sistema utiliza a rede Sepolia para todas as operações blockchain.
- A interface é responsiva e fornece feedback visual para todas as ações do usuário.
- O usuário pode sair da sessão a qualquer momento, e o histórico de sessões é mantido para segurança.

