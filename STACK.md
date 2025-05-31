# STACK

https://github.com/govinda777/zerodev-token-shop/blob/main/STACK.md

The project leverages a modern Web3 stack that integrates Alchemy’s infrastructure and ZeroDev’s account abstraction features for a seamless user experience. While the core account abstraction (ERC-4337/EIP-7702) is powered by ZeroDev Kernel—enabling smart accounts, social authentication, batch transactions, and gas sponsorship—the project also utilizes the Alchemy RPC endpoint for reliable blockchain data access and advanced APIs

Stack do projeto com Alchemy

---

## **Stack Atualizada – Tabela de Tecnologias**

| Área                | Tecnologia/Provedor      | Função Principal                                                                 | Observações/Opcionais            |
|---------------------|-------------------------|----------------------------------------------------------------------------------|----------------------------------|
| **Frontend**        | Next.js 14              | Framework base para SSR, App Router e páginas dinâmicas                          | Versão estável                   |
|                     | Tailwind CSS            | Estilização rápida e responsiva                                                  | Facilita customização            |
|                     | shadcn/ui               | Biblioteca de componentes UI reutilizáveis                                       | Foco em acessibilidade           |
|                     | Viem 2.x                | Interação com blockchain, suporte a múltiplos providers                          | Integração com Alchemy           |
|                     | Wagmi 2.x               | Gerenciamento de conexão de carteiras e providers                                | Compatível com ZeroDev           |
| **Account Abstraction** | ZeroDev Kernel      | Smart contracts accounts (ERC-4337/EIP-7702), autenticação social, batch tx      | Kernel principal do projeto      |
| **Autenticação**    | Privy                   | Autenticação Web3 (carteiras, social login via configuração Privy)                 | Principal sistema de auth        |
|                     | Magic.Link              | Autenticação Web2 via email/redes sociais                                        | Opcional/Alternativa ao Privy    |
| **Infraestrutura RPC**| ZeroDev RPC             | Endpoint configurado via `NEXT_PUBLIC_ZERODEV_RPC` para interação com a blockchain | Pode usar Alchemy por baixo      |
|                     | Alchemy RPC             | Pode ser usado como alternativa ou se ZeroDev RPC for baseado em Alchemy         | Alta disponibilidade, APIs avançadas |
| **Bundler & Paymaster** | ZeroDev Bundler     | Processamento de user operations (ERC-4337)                                      | Integração com paymaster         |
|                     | ZeroDev Paymaster       | Sponsorship de taxas de gas (gasless)                                            | Facilita UX para usuários        |
| **Smart Contracts** | Solidity                | Linguagem para desenvolvimento de contratos inteligentes                         | Padrão Ethereum                  |
|                     | Foundry                 | Ambiente de desenvolvimento, testes e deploy de contratos                        | Forge, Anvil, Cast               |

---

## **Fluxo de Integração – Tabela de Passos**

| Etapa                | Descrição                                                                                 | Tecnologia/Provedor      |
|----------------------|------------------------------------------------------------------------------------------|--------------------------|
| **Login do Usuário** | Autenticação via Privy (carteiras Web3; social login se configurado no Privy)            | Privy                    |
| **Criação de Conta** | ZeroDev cria uma smart account associada ao login do usuário (se EOA for usado com ZeroDev) | ZeroDev Kernel           |
| **Interação Blockchain** | Frontend utiliza o RPC configurado (ZeroDev RPC) para consultas e envio de transações | ZeroDev RPC / Viem       |
| **Processamento Tx** | ZeroDev processa user operations via bundler próprio                                     | ZeroDev Bundler          |
| **Sponsorship Gas**  | Paymaster da ZeroDev patrocina as taxas de gas, se configurado                           | ZeroDev Paymaster        |
| **UX Avançada**      | Usuário interage sem seed phrase, token nativo para gas ou múltiplas aprovações           | ZeroDev + Alchemy        |

---

## **Resumo**

| Camada               | Tecnologias Principais                        | Benefícios Principais                                 |
|----------------------|-----------------------------------------------|------------------------------------------------------|
| **Frontend**         | Next.js, Tailwind, shadcn/ui, Viem, Wagmi     | UI moderna, interação fácil com blockchain           |
| **AA & Auth**        | ZeroDev, Privy                                | Autenticação Web3 flexível, smart accounts, gasless  |
| **Infraestrutura**   | ZeroDev RPC (Bundler/Paymaster)               | Abstração de conta completa, sponsorship             |
| **Smart Contracts**  | Solidity, Foundry                             | Contratos seguros, testes automatizados              |

---

Essa estrutura oferece clareza sobre as tecnologias utilizadas e o fluxo de funcionamento do projeto.
