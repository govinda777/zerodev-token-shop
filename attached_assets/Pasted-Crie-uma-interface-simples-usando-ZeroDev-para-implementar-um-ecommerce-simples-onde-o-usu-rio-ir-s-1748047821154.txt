Crie uma interface simples usando ZeroDev para implementar um ecommerce simples onde o usuário irá se logar pela metamask ou login.

O projeto é uma amostra do que o protocolo ERC-4337 pode fazer usando o ZeroDev como provider.

## Fluxo

1 - O usuário acessa a página e clica em "Login"
2 - O usuário ganha 10 tokens
3 - O usuário pode comprar serviços e produtos com os tokens
4 - O usuário pode ver o histórico de compras
5 - O usuário pode ver o saldo de tokens
6 - Investimento
    - Stacke tokens para ganhar tokens
    - Comprar tokens de governança (dividendos / ...)
    - NFT participação nas taxas de transação
    - Pool de tokens para ganhar tokens
7 - Pagamento
    
    * Os produtos e serviços podem ser comprados a vista ou parcelados.

    * Para parvelamento o usuário tem que ter X tokens em stacke.

8 - NFTs
    - Membros da comunidade
    - Airdrop de tokens
    - Airdrop de tokens de governança
    - Airdrop de tokens de stacke
    - Airdrop de tokens de pool
    - Airdrop de tokens de investimento
    - Airdrop de tokens de pagamento
    - Airdrop de tokens de investimento



npm_config_loglevel=silly NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --verbose

1. **Sistema de Login**:
   - Implementar autenticação usando ZeroDev para carteiras Ethereum
   - O login deve ser simples e intuitivo para o usuário
   - Utilizar a biblioteca ZeroDev para gerenciar a autenticação
   - Implementar sistema de logs para:
     * Registrar tentativas de login (sucesso/falha)
     * Armazenar timestamp de cada login
     * Registrar o endereço da carteira do usuário
     * Manter histórico de sessões ativas
     * Logar erros de autenticação para debugging
   - Os logs devem ser persistidos e acessíveis para análise

2. **Sistema de Recompensa**:
   - Detectar automaticamente quando é o primeiro login do usuário
   - Conceder 10 tokens ao usuário após o primeiro login bem-sucedido
   - Armazenar o saldo de tokens do usuário

3. **Loja de Produtos**:
   - Criar uma lista de produtos (pelo menos 5 itens diferentes)
   - Cada produto deve custar exatamente 1 token
   - Exibir o nome, descrição breve e imagem para cada produto
   - Implementar um botão "Comprar" para cada produto

4. **Funcionalidades Adicionais**:
   - Exibir o saldo atual de tokens do usuário
   - Implementar um histórico de compras
   - Adicionar feedback visual quando uma compra for realizada com sucesso

5. **Estrutura do Projeto**:
   - Seguir a estrutura de projeto semelhante aos exemplos do repositório ZeroDev
   - Configurar as variáveis de ambiente necessárias
   - Incluir instruções claras para execução do projeto

Use TypeScript e React para o frontend, e configure o projeto para funcionar na rede Sepolia. Certifique-se de incluir todos os arquivos necessários e comentários explicativos no código.

Por favor, implemente este projeto seguindo as melhores práticas de desenvolvimento e segurança para aplicações Web3.

Citations:
[1] https://github.com/zerodevapp/zerodev-examples
[2] https://github.com/zerodevapp/zerodev-examples
