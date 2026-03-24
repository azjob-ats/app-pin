# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (http://localhost:4200)
npm run start

# Production build (output: dist/)
ng build

# Run unit tests (Vitest)
ng test
```

## Project Architecture - Angular Frontend

### Visão Geral

Este projeto Angular adota uma arquitetura baseada em:

- **core** </br>
    Recursos centrais da aplicação
 
- **domain** </br>
    Funcionalidades de negócio organizadas por domínio

- **shared** </br>
    Utilitários reutilizáveis e componentes visuais compartilháveis

### Exemplificação

- **Core** </br>
Infraestrutura e módulos de nível de aplicação:
    - **Infra**: Camada responsável pela implementação de integrações externas e bibliotecas, permitindo sua substituição sem afetar o núcleo da aplicação (ex.: criptografia, armazenamento, APIs).

- **Domain** </br>
Contém os módulos de negócio, organizados por funcionalidade. Cada módulo inclui:
    - **Services**: Regras de negócio e orquestração (ex.: validação de imposto).
    - **Pages**: Containers de telas conectadas às rotas.
 
- **Shared** </br>
Compartilhamento de utilitários globais, não ligados a UX ou domínio específico.
    - **Apis**: Camada para chamadas ao backend (APIs REST, GraphQL etc.).
    - **Caches**: Estratégias locais de cache para otimizar performance.
    - **Interfaces**: Contratos TypeScript para modelar dados.
    - **Maps**: Transformações e mapeamentos de dados entre camadas.
    - **Constants**: Constantes genéricas (ex.: formatos padrão).
    - **Enums**: Enumerações para valores fixos.
    - **Guards**: Proteções de rota.
    - **Interceptors**: Interceptadores HTTP para manipulação de requisições e respostas.
    - **Services**: Serviços globais (ex.: gerenciamento de estado, loading spinner).
    - **Utils**: Funções auxiliares (ex.: formatar datas, validar e-mails).
    - **Components**: Componentes “presentacionais” (ex.: botões, cards, modais).
    - **Directives**: Diretivas customizadas (ex.: máscara de input).
    - **Pipes**: Pipes reutilizáveis para transformação de dados em templates.

### Convenções de nomenclatura
- Classes: PascalCase (e.g., AuthService)
- Interfaces: PascalCase (e.g., Authentication)
- Enums: PascalCase (e.g., UserStatus)
- Arquivos/Pastas: kebab-case (e.g., auth.service.ts)

### Angular Best Practices Adopted
- Código sempre em inglês.
- Importações utilizando aliases (ex.: @domain/auth/services/auth.service).

### Componente "Burro" (Apresentacional)
TODO COMPONENTE PRESENTACIONAL DEVE

**Ter inputs e outputs claros**:
 ```ts
@Input() public formControl!: FormControl<any>;
```

```ts
@Output() public valueChanged = new EventEmitter<any>();
```

**Ter Métodos padrão**:
 ```ts 
enable(): void {}
```

 ```ts
disable(): void {}
```

 ```ts 
resetToInitialState(): void {}
```

 ```ts 
isRequired(): boolean { return false; }
```

### Estrutura de pasta
```text
src/
└── app/
    ├── core/
    │   └── infra/
    │       └── crypto/
    ├── domain/
    │   ├── change-language/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── index.routes.ts
    ├── shared/
    │   ├── constants/
    │   ├── apis/
    │   ├── caches/
    │   ├── maps/
    │   ├── mocks/
    │   ├── enums/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── interfaces/
    │   ├── services/
    │   ├── utils/
    │   ├── components/
    │   ├── directives/
    │   └── pipes/
    └── app.config.ts

```

## Objetivo do projeto RealWe

A **RealWe** é uma plataforma de conteúdo profissional humanizado, focada no conceito de que **"pessoas confiam em pessoas"**. O objetivo central é conectar profissionais, candidatos e empresas através de transparência e autoridade real.

### Concept: O Funil de Conteúdo
A plataforma opera em quatro estágios principais para transformar curiosidade em confiança:
1. **Descoberta:** Vídeos curtos (shorts) que funcionam como "trailers" para despertar interesse.
2. **Profundidade:** Vídeos longos onde o criador (colaborador) aprofunda o tema, ensina e constrói autoridade.
3. **Conversão:** Botão "Saiba Mais" que direciona para ações concretas (vagas, vendas, treinamentos).
4. **Comunidade:** Espaço de interação e relacionamento contínuo com a audiência.

### Pilares da Plataforma
- **Pessoas Reais:** Colaboradores atuam como criadores autorizados, mostrando o dia a dia, ferramentas e desafios reais.
- **Autoridade Profissional:** O foco não é venda direta, mas sim a construção de reputação e transparência.
- **Ecossistema Completo:** Organizado por categorias como Vagas, Produtos, Treinamentos, Experiências e Empresas.
- **Métricas e Qualidade:** Uso de retenção e engajamento para validar conteúdos. Campanhas patrocinadas só são permitidas para conteúdos com bom desempenho orgânico.

### Aplicabilidade
Este projeto busca resolver o distanciamento entre marcas e pessoas, substituindo o marketing institucional por conexões humanas. Para o desenvolvimento, os componentes devem focar em descoberta visual (scroll de vídeos), conversão dinâmica (formulários customizáveis) e gestão de autoridade (perfis integrados e métricas).

### 🎨 Design System e Inspiração
O layout, a paleta de cores, a tipografia e a experiência de navegação da plataforma foram diretamente inspirados no **Design System do Pinterest**. Isso reflete em uma interface limpa, focada em "cards" visuais, descoberta infinita e uma estética premium e minimalista. Todo o layout, a paleta de cores e a tipografia da plataforma RealWe foram inspirados no Design System do Pinterest, priorizando uma estética de "cards" visuais, descoberta infinita e uma interface limpa e minimalista que facilita o consumo de conteúdo profissional.