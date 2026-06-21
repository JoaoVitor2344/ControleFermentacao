# ControleFermentacaoCervejeira

Este projeto foi desenvolvido como parte do processo seletivo da **ArBrain** para a avaliação de competências técnicas
em Engenharia de Software. A aplicação tem como objetivo monitorar dados fermentativos, garantindo o controle de
qualidade e a conformidade com as normas do MAPA (Ministério da Agricultura e Pecuária).

---

## Arquitetura do Sistema

A solução foi desenhada seguindo os princípios da **Clean Architecture (Arquitetura Limpa)**, combinada ao padrão
**CQRS (Command Query Responsibility Segregation)** implementado com a biblioteca **MediatR**.

A organização do projeto adota a estratégia de **Monorepo**, isolando o ecossistema do backend e do frontend sob uma
mesma estrutura de versionamento.

### Divisão em Camadas (Backend)

1. **ControleFermentacaoCervejeira.Domain:** Totalmente isolado e agnóstico a frameworks, bancos de dados ou APIs. Contém as
   entidades ricas do sistema (`Beer`, `Tank`, `FermentationRecord`), os Enums e as regras de negócio puras.
2. **ControleFermentacaoCervejeira.Application:** Depende apenas do Domínio. Implementa o padrão CQRS estruturado por *Features*
   (funcionalidades). Contém os *Commands*, *Queries*, seus respectivos *Handlers* e DTOs (Data Transfer Objects).
3. **ControleFermentacaoCervejeira.Infrastructure:** Depende da Application e do Domínio. Contém a infraestrutura de acesso a
   dados usando o Entity Framework Core, mapeamentos Fluent API, migrações e implementações de repositórios.
4. **ControleFermentacaoCervejeira.API:** Depende da Application e da Infrastructure. É a camada de apresentação HTTP, responsável
   apenas por receber requisições, delegar ao MediatR e retornar as respostas com os devidos códigos de status HTTP.

---

## Estrutura de Pastas do Repositório

```text
├── backend\                                    
│   ├── ControleFermentacaoCervejeira.sln                 <-- Arquivo da Solution
│   │
│   ├── ControleFermentacaoCervejeira.API\                <-- Projeto Web API (.NET 10.0)
│   │   ├── Controllers\                        (BeersController, TanksController, FermentationController)
│   │   ├── Properties\                         (launchSettings.json)
│   │   ├── appsettings.json
│   │   └── Program.cs
│   │
│   ├── ControleFermentacaoCervejeira.Domain\             <-- Class Library (Regras de negócio puras)
│   │   ├── Entities\                           (Beer.cs, Tank.cs, FermentationRecord.cs)
│   │   ├── Enums\                              (FermentationStatus.cs)
│   │   └── Interfaces\                         (IBeerRepository, ITankRepository, IFermentationRecordRepository)
│   │
│   ├── ControleFermentacaoCervejeira.Application\        <-- Class Library (CQRS com MediatR)
│   │   ├── Features\                           (Organização por Funcionalidade)
│   │   │   ├── Beers\                          (Commands e Queries de Cervejas)
│   │   │   ├── Tanks\                          (Commands e Queries de Tanques)
│   │   │   └── FermentationRecords\            (Commands, Queries e DTOs de Apontamentos)
│   │   └── DependencyInjection.cs              (Registro do MediatR no container de DI)
│   │
│   └── ControleFermentacaoCervejeira.Infrastructure\     <-- Class Library (Persistência / EF Core)
│       ├── Data\
│       │   ├── Context\                        (AppDbContext.cs)
│       │   ├── Mappings\                       (Configurações Fluent API)
│       │   └── Migrations\                     (Migrações geradas automaticamente)
│       ├── Repositories\                       (Implementações reais de acesso a dados)
│       └── DependencyInjection.cs              (Registro do DbContext e Repositórios no container de DI)
│
├── frontend\                                   <-- Aplicação React + TypeScript (Vite)
│   ├── public\                                 (Arquivos estáticos públicos)
│   ├── src\
│   │   ├── api\
│   │   │   ├── client.ts                       (Instância base do Axios com a URL da API)
│   │   │   ├── beers.ts                        (Chamadas HTTP de Cervejas)
│   │   │   ├── api.ts                          (Chamadas HTTP de Tanques)
│   │   │   └── fermentation.ts                 (Chamadas HTTP de Fermentação)
│   │   ├── components\                         (Button, Input, Select, StatusBadge)
│   │   ├── layouts\
│   │   │   └── MainLayout.tsx                  (Sidebar + Header compartilhados entre todas as páginas)
│   │   ├── pages\
│   │   │   ├── Dashboard\                      (Cards de resumo dos apontamentos)
│   │   │   ├── Beers\                          (Listagem e formulário de Cervejas)
│   │   │   ├── Tanks\                          (Listagem e formulário de Tanques)
│   │   │   └── Fermentation\                   (Registro de apontamento e Histórico de Lotes)
│   │   ├── types\
│   │   │   └── index.ts                        (Interfaces TypeScript espelhando os contratos do backend)
│   │   ├── App.tsx                             (Configuração de rotas com React Router)
│   │   └── index.css                           (Tokens do design system ArBrain via Tailwind @theme)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
└── README.md                                  
```

---

## Como Executar o Backend

A aplicação foi construída para oferecer uma experiência de desenvolvimento simples e direta. A documentação interativa
dos endpoints é gerada automaticamente pelo **Swagger**.

### Pré-requisitos

* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [PostgreSQL](https://www.postgresql.org/download/) (Local ou via Docker)
* IDE de sua preferência (Rider, Visual Studio, VS Code)

### Passos para Execução

1. Clone o repositório.
2. Na raiz do projeto `ControleFermentacaoCervejeira.API`, configure a *Connection String* do PostgreSQL no arquivo
   `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=ControleFermentacaoCervejeiraDb;Username=postgres;Password=postgres"
   }
   ```
3. Abra um terminal na pasta `ControleFermentacaoCervejeira.Infrastructure` e rode as migrações para criar o banco de dados:
   ```bash
   dotnet ef database update --startup-project ../ControleFermentacaoCervejeira.API
   ```
4. Execute o projeto `ControleFermentacaoCervejeira.API`.
5. O navegador abrirá automaticamente na interface do **Swagger** (`http://localhost:5106/swagger`), onde você
   poderá testar todos os endpoints disponíveis.

---

## Como Executar o Frontend

### Pré-requisitos

* [Node.js 18+](https://nodejs.org/)

### Passos para Execução

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Copie o arquivo de variáveis de ambiente e configure a URL da API:
   ```bash
   cp .env.example .env
   ```
   O arquivo `.env` deve conter:
   ```env
   VITE_API_BASE_URL=http://localhost:5106/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173` no navegador.

> **Importante:** O backend deve estar em execução antes de iniciar o frontend.

---

## Soft Delete (Exclusão Lógica)

Cervejas e Tanques **nunca são removidos fisicamente** do banco de dados. Ao acionar a exclusão, o campo `DeletedAt` da entidade é preenchido com o timestamp da operação — o registro permanece na tabela, mas fica invisível para as consultas padrão.

**Como funciona internamente:**
- O `AppDbContext` registra um **filtro global de query** (`HasQueryFilter`) para as entidades `Beer` e `Tank`, excluindo automaticamente qualquer registro onde `DeletedAt != null`.
- Esse filtro é transparente: nenhuma query precisa saber da sua existência para funcionar corretamente.
- Para consultar os registros removidos, use o parâmetro `?includeDeleted=true` nas rotas `GET /api/beers` e `GET /api/tanks`. O handler chama `.IgnoreQueryFilters()` no EF Core para desativar o filtro naquela requisição específica.

**Por que soft delete?**
Dados fermentativos têm implicações regulatórias (MAPA). Excluir fisicamente um tanque ou cerveja que possui histórico de apontamentos poderia comprometer a rastreabilidade do processo. O soft delete preserva o histórico e ainda impede novas operações sobre o registro removido.

---

## Regras de Negócio e Premissas Adotadas

### Classificação Dinâmica do Status Fermentativo (`FermentationStatus`)

O desafio técnico exige a classificação automática dos apontamentos de medição (Temperatura, pH e Extrato) em três
categorias: **Dentro do Padrão**, **Atenção** e **Fora do Padrão**.

Para garantir uma aplicação escalável, genérica e capaz de suportar qualquer estilo de cerveja sem a necessidade de
valores fixos no código, foi adotada uma premissa algorítmica inspirada no comportamento de **Cartas de Controle
Estatístico de Processo (SPC)**.

O status **Atenção (Attention)** é acionado sempre que o valor medido estiver dentro dos limites aceitáveis cadastrados
para a cerveja, mas adentrar uma zona de risco correspondente a **10% das extremidades da amplitude total** daquele
parâmetro específico.

#### O Algoritmo Matemático

Para qualquer parâmetro monitorado, a entidade `FermentationRecord` calcula o status de forma determinística no momento
da sua criação seguindo os passos:

1. **Cálculo da Amplitude (R):**
   R = Limite Máximo - Limite Mínimo
2. **Cálculo da Margem de Segurança (M):**
   M = R * 0.10
3. **Zonas de Classificação:**

* **Fora do Padrão (`OutOfPattern`):** Valor < Limite Mínimo OU Valor > Limite Máximo
* **Atenção (`Attention`):** O Valor entra no limite de M somado ao Limite Mínimo OU subtraído do Limite Máximo.
* **Dentro do Padrão (`WithinPattern`):** Valores que não se enquadram nas regras anteriores.

---

## Embasamento Técnico e Referências

A escolha de uma margem estreita e dinâmica baseada na amplitude para disparar o status de alerta simula os limites
biológicos e químicos reais encontrados em cervejarias comerciais:

1. **Estresse Térmico e Geração de *Off-Flavors*:** O controle rígido da temperatura é o pilar mais crítico da
   fermentação.

   *Referência:* [Esters and Fusel Alcohols - Scott Janish (Review de Estudos Científicos)](https://scottjanish.com/esters-and-fusel-alcohols/)

2. **Monitoramento Químico e Sanidade do Lote (pH):** O pH ao longo da fermentação saudável segue uma linha extremamente
   tênue (geralmente estabilizando entre 4.1 e 4.4).

   *Referência:* [Understanding The pH Of Beer - Atlas Scientific (Industrial Instrumentation)](https://atlas-scientific.com/blog/ph-of-beer/)

   *Referência:* [The Role of pH in Brewing - Brew Your Own (BYO Journal)](https://byo.com/articles/the-role-of-ph-in-brewing/)

3. **Cartas de Controle Industrial (SPC):** O modelo algorítmico preditivo de emitir um sinal de "Atenção" nas
   extremidades mimetiza os softwares de automação de salas de controle, que disparam alarmes visuais preventivos quando
   uma variável física se aproxima das bordas estatísticas de controle, permitindo a atuação corretiva do mestre
   cervejeiro antes do descarte total do lote.

   *Referência:* [Monitoring Saccharification Process in Brewery Industry Using Quality Control Charts - ResearchGate (Scientific Publication)](https://www.researchgate.net/publication/305741109_Monitoring_Saccharification_Process_in_Brewery_Industry_Using_Quality_Control_Charts)

---

## Respostas do Desafio Técnico

### 1. Quais foram as principais decisões arquiteturais e por que você as escolheu?

**Backend:**

A solução backend foi estruturada com **Clean Architecture** e o padrão **CQRS** com **MediatR**.

* A Clean Architecture garante o isolamento absoluto da regra de negócio cervejeira. O Domínio é protegido contra
  vazamentos de escopo de infraestrutura.
* O CQRS separa fluxos de escrita (Commands) de fluxos de leitura (Queries). Essa decisão prepara o software para
  cenários futuros onde as consultas e agregações de dados do Dashboard e Histórico de Lotes exijam otimizações de banco
  de dados ou caches (como Redis) sem impactar a performance do registro de apontamentos.
* A escolha do **Monorepo** unifica o ciclo de vida do backend e do frontend, simplificando os pipelines de CI/CD e
  facilitando o processo de auditoria e avaliação do código pelos engenheiros da ArBrain.
* **Persistência Limpa (Fluent API) e Integridade:** Optei por não utilizar *Data Annotations* nas entidades para
  preservar o princípio de isolamento do Domínio (as entidades não devem saber que um banco de dados existe). Todo o
  mapeamento foi feito via *Fluent API* no Entity Framework. Além disso, configurei políticas estritas de chave
  estrangeira (`DeleteBehavior.Restrict`) para impedir a exclusão acidental de Tanques ou Cervejas que já possuam
  apontamentos, garantindo a integridade histórica exigida por órgãos reguladores como o MAPA.
* **`RecordedAt` definido pelo servidor:** O timestamp de cada apontamento é gerado no handler com a hora local de
  Brasília (UTC-3), nunca recebido pelo cliente. Isso garante consistência independente do fuso horário ou relógio do
  dispositivo do operador.

**Frontend:**

A interface foi construída com **React + TypeScript** via **Vite**, seguindo a mesma filosofia de separação de
responsabilidades do backend:

* `api/` — funções de acesso HTTP isoladas por domínio. Nenhuma página chama o Axios diretamente, todas passam por
  essa camada. Se a URL da API mudar, o ajuste é feito em um único lugar.
* `types/` — interfaces TypeScript que espelham os contratos do backend, garantindo que qualquer mudança de contrato
  seja capturada em tempo de compilação, não em produção.
* `components/` — componentes reutilizáveis (`Button`, `Input`, `Select`, `StatusBadge`) sem lógica de negócio,
  garantindo consistência visual em toda a aplicação.
* `pages/` — cada tela em sua própria pasta, responsável apenas pela composição visual e orquestração de chamadas.
* `layouts/` — estrutura visual compartilhada (Sidebar + Header) aplicada via **React Router Outlet**, evitando
  repetição em cada página.
* Variáveis de ambiente via `.env` com prefixo `VITE_` para nunca expor configurações sensíveis no código-fonte.

### 2. Como a Inteligência Artificial foi utilizada no processo de desenvolvimento?

O backend foi desenvolvido com auxílio do **Gemini (Google)**, com abordagem pedagógica — a IA explicava o raciocínio
por trás de cada decisão arquitetural antes de apresentar o código, e o desenvolvedor implementava e validava cada etapa.

O frontend foi desenvolvido com auxílio do **Claude Code (Anthropic)**, seguindo a mesma metodologia: a IA guiava
cada passo com explicações do porquê de cada decisão, e o desenvolvedor executava, testava e validava no browser antes
de avançar.

**Onde a IA auxiliou no backend:**
* Discussão teórica e revisão da literatura científica cervejeira para validar o modelo de tolerância baseado em 10%
  da amplitude.
* Avaliação comparativa entre *Service Pattern* versus *CQRS com MediatR* em termos de complexidade e escalabilidade.
* Auxílio no mapeamento conceitual da árvore de diretórios e tratamento de namespaces.

**Onde a IA auxiliou no frontend:**
* Definição da stack (Vite, React Hook Form, Axios, Tailwind v4) e justificativa de cada escolha.
* Estruturação da arquitetura de pastas e separação de responsabilidades.
* Implementação dos formulários com React Hook Form e configuração do design system com os tokens do Figma.
* Identificação e correção do bug do `RecordedAt` salvo como `-infinity` no PostgreSQL.

**O que foi validado e corrigido pelo desenvolvedor:**
* Teste de cada tela no browser após cada passo de implementação.
* Validação da integração real com a API (não apenas código gerado).
* Decisão de corrigir o `RecordedAt` no backend em vez de enviá-lo pelo frontend — o desenvolvedor entendeu o problema
  e escolheu a solução arquiteturalmente correta.
* Configuração do CORS no backend para liberar a origem do frontend.

### 3. Quais melhorias você implementaria se tivesse mais tempo?

As melhorias abaixo foram **efetivamente implementadas** durante o desenvolvimento, além do escopo mínimo do desafio:

* **Soft Delete (Exclusão Lógica):** Cervejas e Tanques nunca são removidos fisicamente do banco. O campo `DeletedAt`
  é preenchido na exclusão e um filtro global no `AppDbContext` os oculta automaticamente das consultas padrão. O
  parâmetro `?includeDeleted=true` permite auditá-los quando necessário — decisão motivada pelas exigências de
  rastreabilidade do MAPA.
* **Formatação Decimal pt-BR:** Todos os valores numéricos exibidos na interface usam vírgula como separador decimal
  (ex: `12,50` em vez de `12.50`), por meio de um utilitário centralizado `formatDecimal` com `toLocaleString('pt-BR')`.
* **Gráfico de Evolução do Lote:** O Histórico de Lotes exibe um gráfico de linha interativo (biblioteca *recharts*)
  com a evolução de Temperatura, pH e Extrato ao longo do tempo, facilitando a visualização de tendências fermentativas
  pelo mestre cervejeiro.

Melhorias que ficariam para uma próxima iteração:

* **Containerização Completa:** Criação de múltiplos estágios no `Dockerfile` para a API .NET e o frontend React,
  unificados por um arquivo `docker-compose.yml` contendo uma instância pré-configurada de banco de dados PostgreSQL,
  permitindo subir toda a stack com um único comando.
* **Pipeline de Testes Automatizados:** Implementação de uma suíte extensiva de testes unitários usando *xUnit*,
  *FluentAssertions* e *Moq*, focando em 100% de cobertura da matriz de decisão matemática de status da entidade
  `FermentationRecord` e isolamento dos *Handlers*. No frontend, testes de componente com *Vitest* e *Testing Library*.
* **Autenticação e Autorização:** Integração do ASP.NET Core Identity com proteção via Tokens JWT e políticas RBAC
  (Role-Based Access Control) diferenciando acessos entre Operadores de Linha e Mestres Cervejeiros.
* **Processamento Assíncrono (Mensageria):** Substituição do salvamento síncrono por mensageria (ex: RabbitMQ). Em uma
  fábrica real com centenas de sensores IoT transmitindo telemetria em tempo real, os dados seriam postados em uma fila
  de alta vazão e ingeridos de forma assíncrona para não estressar as conexões de banco de dados.
* **Listagem de Lotes Disponíveis:** Adicionar um endpoint `GET /api/fermentation/batches` que retorne todos os números
  de lote distintos, permitindo que o frontend exiba um select em vez de um campo de texto livre no Histórico de Lotes.
