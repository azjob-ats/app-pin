# Home Dynamic Interest Tabs — RealWe

## Objetivo

As Dynamic Interest Tabs são o mecanismo central de **filtragem contextual de conteúdo** na Home da plataforma RealWe. Elas permitem que o usuário navegue entre categorias de interesse e receba instantaneamente um feed personalizado de posts e coleções relacionados àquela categoria — sem recarregamento de página.

O propósito estratégico é transformar a Home em um espaço de **descoberta intencional**: em vez de um scroll infinito sem direção, o usuário tem controle sobre o tipo de conteúdo que deseja consumir no momento.

---

## Problema que Resolve

Plataformas de conteúdo perdem engajamento quando o feed é genérico demais. O usuário que busca vagas de emprego não quer ver conteúdo de fitness. O profissional de tecnologia quer aprofundamento, não miscelânea.

As Interest Tabs resolvem isso ao criar **canais de intenção explícita**: o usuário declara o que quer ver e recebe exatamente isso.

---

## Como Funciona

### Fluxo de interação

```
Usuário clica em uma tab (ex: "Vagas")
  → selectedCategory atualiza para "Vagas"
  → API é chamada com ?category=Vagas
  → Backend filtra posts onde media.slang inclui "Vagas"
  → Backend filtra collections onde slang inclui "Vagas"
  → Feed atualiza instantaneamente com conteúdo da categoria
```

### Regra de associação

A relação entre categorias e conteúdos é feita exclusivamente via campo `slang`:

| Fonte de dado | Campo usado |
|---|---|
| Posts | `post.media.slang[]` |
| Collections | `collection.slang[]` |
| Categorias (tabs) | `category.key` |

Um post ou collection aparece em uma tab quando `slang` contém o `key` da categoria (comparação case-insensitive).

**Exemplo:**
```
Tab ativa: "Vagas"

Post elegível:
  media.slang = ['Vagas', 'Python', 'Tecnologia']
  → aparece ✔

Post não elegível:
  media.slang = ['Fitness', 'Saúde']
  → não aparece ✗
```

### Tab "all" (ícone de apps)

A primeira tab — identificada pela key `all` — não aplica nenhum filtro. Exibe todo o conteúdo disponível. É o estado padrão ao entrar na Home.

---

## Categorias Disponíveis

As tabs são carregadas dinamicamente do backend (`GET /api/content-category`). As categorias atuais são:

| Key | Descrição |
|---|---|
| `all` | Todo o conteúdo (sem filtro) |
| `Para você` | Conteúdo personalizado |
| `Hypados` | Conteúdo em alta no momento |
| `Fitness e Saúde` | Bem-estar e performance física |
| `Educação` | Cursos, tutoriais e aprendizado |
| `Tecnologia` | Inovação, ferramentas e desenvolvimento |
| `Noticias` | Acontecimentos relevantes |
| `Inteligência artificial` | IA aplicada e tendências |
| `Empreendedorismo` | Negócios e startups |
| `Monetizações` | Estratégias de receita e renda |
| `Ao vivo` | Transmissões em tempo real |
| `Psicologia` | Saúde mental e comportamento |
| `Vagas` | Oportunidades de emprego |
| `Enviados recentemente` | Conteúdo mais recente |
| `Assistidos` | Histórico de visualização |
| `Cursos` | Trilhas de aprendizado |
| `Shopping` | Produtos e serviços |

> As categorias são configuráveis no backend — novos interesses podem ser adicionados sem alteração no frontend.

---

## Experiência do Usuário

### Estados visuais

| Estado | Comportamento |
|---|---|
| **Carregando** | Exibe skeleton chips animados para cada tab, evitando layout shift |
| **Tab selecionada** | Chip destacado visualmente com indicador ativo |
| **Feed vazio** | Exibe estado vazio quando nenhum conteúdo possui o slang da categoria |
| **Troca de tab** | Feed atualiza imediatamente, sem flash ou recarregamento |

### Skeleton de carregamento

Durante o carregamento inicial das categorias, são exibidos 10 chips skeleton com larguras variadas (56px a 136px), simulando a diversidade visual real das tabs e prevenindo o salto de layout.

---

## Impacto no Produto

### Para o usuário

- **Descoberta com intenção:** encontra conteúdo relevante para seu momento atual sem precisar buscar
- **Controle do feed:** escolhe ativamente o tipo de conteúdo que deseja consumir
- **Experiência fluida:** troca de categoria é instantânea, sem loading percebido

### Para criadores de conteúdo

- **Alcance segmentado:** ao taggear o conteúdo com `slang` corretos, aparecem nas tabs certas para a audiência certa
- **Descoberta orgânica:** conteúdo bem categorizado é distribuído automaticamente para quem demonstrou interesse naquele tema

### Para a plataforma

- **Redução de churn:** usuário que encontra conteúdo relevante permanece mais tempo
- **Dados de intenção:** a tab selecionada é um sinal explícito de interesse que pode alimentar algoritmos de recomendação futuros
- **Escalabilidade:** novas categorias são adicionadas no backend sem custo de desenvolvimento frontend

---

## Arquitetura Técnica

### Componente

```
DynamicInterestTabsComponent
  selector:  home-dynamic-interest-tabs
  strategy:  ChangeDetectionStrategy.OnPush

  inputs:
    tabs:        ContentCategory[]   — lista de categorias vinda do backend
    selectedTab: string              — key da categoria ativa
    isLoading:   boolean             — controla exibição do skeleton

  outputs:
    tabSelect:   EventEmitter<string> — emite o key da tab clicada
```

### Fluxo de dados

```
ContentCategoryApi
  GET /api/content-category
    → interestTabs (signal)
      → DynamicInterestTabsComponent [tabs]

HomeComponent.selectCategory(key)
  → selectedCategory (signal)
  → PostApi.list(page, 20, key)         → posts (signal)
  → CollectionBundleApi.list(1, 20, key) → collections (signal)
    → feedItems (computed signal)
      → MediaCardComponent [feedItems]
```

### Filtragem no backend

Ambas as rotas suportam o parâmetro `?category=`:

```
GET /api/post?category=Vagas
GET /api/collection-bundle?category=Vagas
```

O filtro é case-insensitive e opera sobre o array `slang` de cada item. Quando `category` é omitido ou igual a `all`, retorna todos os registros.

---

## Referências de Produto Similares

| Plataforma | Implementação equivalente |
|---|---|
| YouTube | Chips de categoria no topo do feed |
| TikTok | Abas de interesse no For You |
| LinkedIn | Filtros de conteúdo por tema |
| Pinterest | Categorias de descoberta na busca |

A RealWe segue este padrão consolidado de mercado, adaptado para o contexto de **conteúdo profissional gerado por colaboradores**.

---

## Possíveis Evoluções

- **Personalização por usuário:** ordenar tabs por frequência de uso individual
- **Tabs baseadas em comportamento:** destacar categorias com conteúdo novo desde a última visita
- **Sub-categorias:** expandir uma tab em níveis mais específicos (ex: Tecnologia → Frontend, Backend, IA)
- **Contagem de conteúdo por tab:** exibir badge numérico com quantidade de itens disponíveis
- **Tabs patrocinadas:** permitir que marcas destaquem categorias temáticas como formato de mídia
