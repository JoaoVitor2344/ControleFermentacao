# ControleFermentacaoCervejeira

Este é o repositório do **ControleFermentacaoCervejeira**, projeto desenvolvido para o desafio técnico da **ArBrain**. A ideia central é fornecer um sistema robusto para monitorar as etapas de fermentação de lotes de cerveja, garantindo o padrão de qualidade e facilitando o cumprimento das exigências regulatórias do MAPA.

---

## Arquitetura do Sistema

Estruturei a aplicação usando **Clean Architecture** e **CQRS** (via MediatR). Essa combinação separa claramente a regra de negócio da infraestrutura e divide as rotas de leitura e escrita, facilitando manutenções e escala futura. Optei por um formato de **Monorepo**, mantendo backend e frontend no mesmo lugar para simplificar a execução e a avaliação do projeto.

### Divisão em Camadas (Backend)

No backend, os projetos estão divididos assim:
- **Domain:** O coração da aplicação. Não conhece banco de dados nem API, apenas concentra as regras de negócio puras e entidades (`Beer`, `Tank`, `FermentationRecord`).
- **Application:** Onde o CQRS ganha vida. Separada por *Features*, contém nossos *Commands*, *Queries* e *Handlers*. Só enxerga o domínio.
- **Infrastructure:** A camada que lida com o banco de dados. É aqui que moram o EF Core, os mapeamentos Fluent API e os repositórios.
- **API:** Nossa porta de entrada HTTP. Só recebe as chamadas, joga para o MediatR processar e devolve o status HTTP correto (limpa e sem lógica de negócio nos controllers).

---

## Visão Geral das Pastas

```text
├── backend\                                    
│   ├── ControleFermentacaoCervejeira.sln                 
│   │
│   ├── ControleFermentacaoCervejeira.API\                <-- Web API (.NET 10.0)
│   ├── ControleFermentacaoCervejeira.Domain\             <-- Entidades e Regras de Negócio
│   ├── ControleFermentacaoCervejeira.Application\        <-- CQRS (Comandos e Casos de Uso)
│   └── ControleFermentacaoCervejeira.Infrastructure\     <-- Banco de Dados (EF Core)
│
├── frontend\                                   <-- Aplicação React + TypeScript (Vite)
│   ├── public\                                 
│   ├── src\
│   │   ├── api\                                <-- Camada isolada para requisições HTTP (Axios)
│   │   ├── components\                         <-- UI reutilizável
│   │   ├── layouts\                            <-- Sidebar e Header
│   │   ├── pages\                              <-- Telas (Dashboard, Fermentation, Beers, Tanks)
│   │   ├── types\                              <-- Contratos TypeScript do back
│   │   ├── App.tsx                             
│   │   └── index.css                           <-- Tokens e design via Tailwind CSS
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                                  
```

---

## Como Executar o Backend

A ideia é que seja simples rodar o projeto na sua máquina. O Swagger já está configurado para documentar e testar os endpoints.

**Pré-requisitos:** .NET 10 SDK e um banco PostgreSQL (local ou Docker).

1. Clone o repositório.
2. No projeto `ControleFermentacaoCervejeira.API`, abra o `appsettings.json` e ajuste a string de conexão. Se preferir, é só rodar `docker-compose up -d` na raiz para subir um banco rápido.
3. Abra um terminal na pasta `ControleFermentacaoCervejeira.Infrastructure` e rode as migrations para criar as tabelas:
```bash
dotnet ef database update --startup-project ../ControleFermentacaoCervejeira.API
```
4. Rode o projeto `ControleFermentacaoCervejeira.API`.
5. Pronto! O navegador vai abrir sozinho no Swagger (`http://localhost:5106/swagger`) para você testar as rotas.

---

## Como Executar o Frontend

**Pré-requisitos:** Node.js 18+.

1. Entre na pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Crie seu `.env` copiando o nosso arquivo de exemplo:
```bash
cp .env.example .env
```
*(A base URL padrão que vem no arquivo é `http://localhost:5106/api`)*.
4. Inicie o servidor: `npm run dev`.
5. Acesse `http://localhost:5173`.

> **Dica:** Lembre-se de deixar o backend rodando antes de começar a usar o front!

---

## Soft Delete (Exclusão Lógica)

Para garantir a rastreabilidade exigida por órgãos como o MAPA, cervejas e tanques **nunca são deletados de verdade** (hard delete). Quando você exclui um tanque, o sistema apenas preenche o campo `DeletedAt`.

Configurei um filtro global (`HasQueryFilter`) no EF Core para que esses registros inativos sumam automaticamente de todas as consultas normais, de forma transparente. Se precisar consultar o que foi apagado, é só passar `?includeDeleted=true` nas rotas de `GET` que o repositório desativa temporariamente esse filtro usando `.IgnoreQueryFilters()`.

---

## Regras de Negócio e o Algoritmo de Status

Um dos pontos principais do desafio era classificar um apontamento como **Dentro do Padrão**, **Atenção** ou **Fora do Padrão**.

Em vez de chumbar valores fixos no código que só funcionariam para um estilo de cerveja específico, criei um algoritmo matemático e dinâmico inspirado em **Cartas de Controle Estatístico de Processo (SPC)** da indústria.

Funciona assim: a própria entidade calcula uma margem de risco equivalente a **10% da amplitude total** (a diferença entre o limite máximo e mínimo que o usuário cadastrou) para a temperatura, o pH ou o extrato.
Se a medição cair nesses 10% próximos às bordas, o sistema entra em estado de **Atenção**. Se estourar os limites de vez, é **Fora do Padrão**.

Me baseei em necessidades reais de chão de fábrica para isso:
- O controle milimétrico de temperatura é crítico para evitar *off-flavors*.
- O pH de uma fermentação saudável segue uma curva bem apertada.
- O uso da margem de 10% mimetiza sistemas de automação caros, que disparam alarmes preventivos antes que um lote seja perdido.

---

## Respostas do Desafio Técnico

### 1. Como você modelou a solução?
**Backend:** Segui pelo caminho da Clean Architecture + CQRS. Isolar o domínio me garantiu que nenhuma regra de negócio fosse misturada com a infraestrutura (banco de dados). O CQRS foi escolhido já pensando num cenário de escala onde o Dashboard passe a sofrer muitas consultas simultâneas; separar a escrita da leitura facilita otimizações futuras. E para fechar, usei Fluent API com `DeleteBehavior.Restrict` para blindar o banco e não deixar ninguém excluir acidentalmente um tanque que já tenha cerveja fermentando dentro.

**Frontend:** Fiz em React com TypeScript usando o Vite. Dividi as responsabilidades claramente: a pasta `api/` faz as chamadas HTTP (isoladas por domínio), a pasta `types/` reflete os contratos exatos do backend, e a `components/` concentra toda a UI reaproveitável.

### 2. Premissas adotadas: Quais decisões precisou tomar por conta própria?
A principal premissa foi a modelagem da margem dinâmica de 10% (estatística) para calcular o status, em vez de exigir que o operador cadastrasse manualmente limites de "alerta" para cada cerveja. 
Também decidi implementar o **Soft Delete** obrigatório para proteger o histórico contra exclusões acidentais, algo crucial na indústria alimentícia. Por fim, fiz questão de que a data e hora do apontamento (`RecordedAt`) seja **sempre** carimbada pelo backend; isso evita bizarrices se o tablet do operador estiver com o fuso horário ou a hora desajustados.

### 3. O que faria diferente e quais melhorias implementaria se tivesse mais tempo?
Alguns overdeliveries eu já adiantei no código atual (como o gráfico de evolução do lote integrado com Recharts e o select dinâmico). Mas, para o projeto rodar redondo em ambiente de produção na V2, eu atacaria:
- **Testes Automatizados:** Usar xUnit e FluentAssertions para bater 100% de cobertura naquele algoritmo de cálculo de status (a entidade de apontamento). E testes de componente no front com Vitest.
- **Docker Completo:** Fazer o build da API .NET e do React direto num `docker-compose` para subir todo o ecossistema com um comando só, não apenas o banco.
- **Autenticação (Identity):** Restringir o acesso com JWT. O operador anota os dados; apenas o Mestre Cervejeiro cadastra novos estilos e altera capacidades de tanque.
- **Relatórios Exportáveis:** Uma rota que cospe o PDF de um lote específico para ser entregue nas auditorias frequentes do MAPA.

### 4. O uso de ferramentas de IA é permitido e incentivado. Caso utilize, descreva:
Usei o **Gemini** e o **Claude Code** no estilo *pair-programming*. Eles me ajudaram muito a debater as opções teóricas de arquitetura e a estruturar a base inicial do código. Como nenhuma IA é perfeita, eu precisei atuar ativamente fazendo *code review* e ajustes manuais pesados: 
Tive que refatorar os problemas de CORS que foram sugeridos incorretamente, arrumar a lógica de data/hora que o gerador tentava montar de forma errada no payload do frontend, e trocar Exceções Genéricas (`Exception`) por Exceções de Domínio Customizadas (`NotFoundException` e `BusinessValidationException`) para tratá-las de forma elegante através de um Middleware global na API.
