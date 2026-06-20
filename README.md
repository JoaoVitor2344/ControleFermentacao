"# ControleFermentacao" 

Este projeto foi desenvolvido como parte do processo seletivo da **ArBrain** para a avaliação de competências técnicas em Engenharia de Software. A aplicação tem como objetivo monitorar dados fermentativos, garantindo o controle de qualidade e a conformidade com as normas do MAPA (Ministério da Agricultura e Pecuária).

---

## Arquitetura do Sistema

A solução foi desenhada seguindo os princípios da **Clean Architecture (Arquitetura Limpa)**, combinada ao padrão **CQRS (Command Query Responsibility Segregation)** implementado com a biblioteca **MediatR**. 

A organização do projeto adota a estratégia de **Monorepo**, isolando o ecossistema do backend e do frontend sob uma mesma estrutura de versionamento.

### Divisão em Camadas (Backend)

1. **ControleFermentacao.Domain:** Totalmente isolado e agnóstico a frameworks, bancos de dados ou APIs. Contém as entidades ricas do sistema (`Beer`, `Tank`, `FermentationRecord`), os Enums e as exceções de domínio.
2. **ControleFermentacao.Application:** Depende apenas do Domínio. Implementa o padrão CQRS estruturado por *Features* (funcionalidades). Contém os *Commands*, *Queries*, seus respectivos *Handlers* e DTOs (Data Transfer Objects).
3. **ControleFermentacao.Infrastructure:** Depende da Application e do Domínio. Contém a infraestrutura de acesso a dados usando o Entity Framework Core, mapeamentos Fluent API, migrações e implementações de repositórios.
4. **ControleFermentacao.API:** Depende da Application e da Infrastructure. É a camada de apresentação HTTP, responsável apenas por receber requisições, delegar ao MediatR e retornar as respostas com os devidos códigos de status HTTP.

---

## Estrutura de Pastas do Repositório

```text
├── backend\                                    
│   ├── ControleFermentacao.sln                 <-- Arquivo da Solution
│   │
│   ├── ControleFermentacao.API\                <-- Projeto Web API (.NET 10.0)
│   │   ├── Controllers\
│   │   ├── Extensions\
│   │   ├── Middlewares\
│   │   ├── appsettings.json
│   │   └── Program.cs
│   │
│   ├── ControleFermentacao.Domain\             <-- Class Library (Regras de negócio puras)
│   │   ├── Entities\                           (Beer.cs, Tank.cs, FermentationRecord.cs)
│   │   ├── Enums\                              (FermentationStatus.cs)
│   │   └── Exceptions\                         (DomainException.cs)
│   │
│   ├── ControleFermentacao.Application\        <-- Class Library (CQRS com MediatR)
│   │   ├── Common\                             (Behaviors, Interfaces de infraestrutura)
│   │   └── Features\                           (Organização por Funcionalidade)
│   │       ├── Beers\                          (Commands e Queries de Cervejas)
│   │       ├── Tanks\                          (Commands e Queries de Tanques)
│   │       └── FermentationRecords\            (Commands e Queries de Apontamentos)
│   │
│   └── ControleFermentacao.Infrastructure\     <-- Class Library (Persistência / EF Core)
│       ├── Data\
│       │   ├── Context\                        (AppDbContext.cs)
│       │   ├── Mappings\                       (Configurações Fluent API)
│       │   └── Migrations\                     (Migrações geradas automaticamente)
│       └── Repositories\                       (Implementações reais de acesso a dados)
│
└── README.md                                  

```

---

## Regras de Negócio e Premissas Adotadas

### Classificação Dinâmica do Status Fermentativo (`FermentationStatus`)

O desafio técnico exige a classificação automática dos apontamentos de medição (Temperatura, pH e Extrato) em três categorias: **Dentro do Padrão**, **Atenção** e **Fora do Padrão**.

Para garantir uma aplicação escalável, genérica e capaz de suportar qualquer estilo de cerveja sem a necessidade de valores fixos no código, foi adotada uma premissa algorítmica inspirada no comportamento de **Cartas de Controle Estatístico de Processo (SPC)**.

O status **Atenção (Attention)** é acionado sempre que o valor medido estiver dentro dos limites aceitáveis cadastrados para a cerveja, mas adentrar uma zona de risco correspondente a **10% das extremidades da amplitude total** daquele parâmetro específico.

#### O Algoritmo Matemático

Para qualquer parâmetro monitorado, a entidade `FermentationRecord` calcula o status de forma determinística no momento da sua criação seguindo os passos:

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

A escolha de uma margem estreita e dinâmica baseada na amplitude para disparar o status de alerta simula os limites biológicos e químicos reais encontrados em cervejarias comerciais:

1. **Estresse Térmico e Geração de *Off-Flavors*:** O controle rígoso da temperatura é o pilar mais crítico da fermentação.
* *Referência:* [Esters and Fusel Alcohols - Scott Janish (Review de Estudos Científicos)](https://scottjanish.com/esters-and-fusel-alcohols/)


2. **Monitoramento Químico e Sanidade do Lote (pH):** O pH ao longo da fermentação saudável segue uma linha extremamente tênue (geralmente estabilizando entre 4.1 e 4.4).
* *Referência:* [Understanding The pH Of Beer - Atlas Scientific (Industrial Instrumentation)](https://atlas-scientific.com/blog/ph-of-beer/)
* *Referência:* [The Role of pH in Brewing - Brew Your Own (BYO Journal)](https://byo.com/articles/the-role-of-ph-in-brewing/)


3. **Cartas de Controle Industrial (SPC):** O modelo algorítmico preditivo de emitir um sinal de "Atenção" nas extremidades mimetiza os softwares de automação de salas de controle, que disparam alarmes visuais preventivos quando uma variável física se aproxima das bordas estatísticas de controle, permitindo a atuação corretiva do mestre cervejeiro antes do descarte total do lote.
* *Referência:* [Monitoring Saccharification Process in Brewery Industry Using Quality Control Charts - ResearchGate (Scientific Publication)](https://www.researchgate.net/publication/305741109_Monitoring_Saccharification_Process_in_Brewery_Industry_Using_Quality_Control_Charts)

---

## Respostas do Desafio Técnico

### 1. Quais foram as principais decisões arquiteturais e por que você as escolheu?

A solução backend foi estruturada com **Clean Architecture** e o padrão **CQRS** com **MediatR**.

* A Clean Architecture garante o isolamento absoluto da regra de negócio cervejeira. O Domínio é protegido contra vazamentos de escopo de infraestrutura.
* O CQRS separa fluxos de escrita (Commands) de fluxos de leitura (Queries). Essa decisão prepara o software para cenários futuros onde as consultas e agregações de dados do Dashboard e Histórico de Lotes exijam otimizações de banco de dados ou caches (como Redis) sem impactar a performance do registro de apontamentos.
* A escolha do **Monorepo** unifica o ciclo de vida do backend e do frontend, simplificando os pipelines de CI/CD e facilitando o processo de auditoria e avaliação do código pelos engenheiros da ArBrain.

### 2. Como a Inteligência Artificial foi utilizada no processo de desenvolvimento?

Neste projeto, a Inteligência Artificial atuou estritamente no seguinte envolvimento:

* **Engenharia de Domínio:** Discussão teórica e revisão da literatura científica cervejeira para validar se o modelo de tolerância baseado em 10% da amplitude atendia aos requisitos biológicos reais de controle de contaminantes e ésteres.
* **Refinamento Arquitetural:** Avaliação comparativa entre os impactos do uso de *Service Pattern* versus *CQRS com MediatR* em termos de complexidade de código, *boilerplate* e escalabilidade.
* **Validação de Código Padrão:** Auxílio no mapeamento conceitual da árvore física de diretórios no PowerShell e tratamento de namespaces na IDE.

### 3. Quais melhorias você implementaria se tivesse mais tempo?

* **Containerização Completa:** Criação de múltiplos estágios no `Dockerfile` para a API .NET e o frontend React, unificados por um arquivo `docker-compose.yml` contendo uma instância pré-configurada de banco de dados PostgreSQL.
* **Pipeline de Testes Automatizados (TDD):** Implementação de uma suíte extensiva de testes unitários usando *xUnit*, *FluentAssertions* e *Moq*, focando em 100% de cobertura da matriz de decisão matemática de status da entidade `FermentationRecord` e isolamento dos *Handlers*.
* **Autenticação de Segurança:** Integração do ASP.NET Core Identity com proteção via Tokens JWT e políticas RBAC (Role-Based Access Control) diferenciando acessos entre Operadores de Linha e Mestres Cervejeiros.
* **Processamento Assíncrono (Mensageria):** Substituição do salvamento síncrono por mensageria (ex: RabbitMQ). Em uma fábrica real com centenas de sensores IoT transmitindo telemetria em tempo real, os dados seriam postados em uma fila de alta vazão e ingeridos de forma assíncrona para não estressar as conexões de banco de dados HTTP.
