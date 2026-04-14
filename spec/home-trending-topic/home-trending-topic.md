# Home Trending Topic — RealWe

## Objetivo

Os Trending Topics são o mecanismo de **descoberta assistida** na Home da plataforma RealWe. Eles apresentam ao usuário os termos de busca mais relevantes do momento — curados editorialmente pela plataforma — e, com um único clique, conduzem a resultados de conteúdo precisos e estratégicos.

O propósito central é **reduzir o atrito entre a intenção e o conteúdo**: o usuário não precisa saber o que digitar. A plataforma já sabe o que é relevante e entrega isso como um atalho visual.

---

## Problema que Resolve

Usuários frequentemente chegam à plataforma com uma intenção difusa. Sabem que querem aprender algo ou encontrar uma oportunidade, mas não sabem como formular a busca.

Os Trending Topics resolvem isso ao oferecer **termos de busca pré-formatados com alta relevância editorial**: o usuário vê "hacker security", "o que é gptw" ou "vaga de java em 2025" e reconhece instantaneamente o que é relevante para ele — sem precisar pensar na query.

Adicionalmente, a plataforma resolve o problema de **resultados de busca genéricos**: por trás de cada trending topic há uma lista de posts curados manualmente (`organically`), garantindo que os primeiros resultados sempre sejam conteúdos estratégicos, e não apenas o que o algoritmo textual retornar.

---

## Como Funciona

### Fluxo de interação

```
Usuário visualiza chips na Home (ex: "hacker security", "dia da mulher")
  → Clica em um chip
    → Navegação para /search?q={term}
      → SearchComponent carrega com query = term
        → GET /api/post?search={term}
          → Backend aplica busca híbrida
            → Retorna posts ordenados por relevância
              → Resultados exibidos no grid da Search page
```

### Busca híbrida

Ao receber um termo de busca, o backend aplica três estratégias em ordem de prioridade:

#### 1. Correspondência exata por ID

Se o `term` for igual ao `id` de um post:

```
POST encontrado por ID exato → retorna apenas esse post
Busca textual e organicamente são ignoradas
```

#### 2. Posts organicamente (curados)

Cada trending topic pode ter uma lista de posts definidos manualmente no backend:

```
popularSearch.organically = [
  { id: '7db72442-...' },
  { id: 'a348561f-...' }
]
```

Esses posts são buscados diretamente por ID e aparecem **primeiro** no resultado — independente de corresponderem textualmente ao termo.

#### 3. Busca textual

Posts cujos campos contenham o `term` (comparação case-insensitive):

| Campo analisado | Exemplo |
|---|---|
| `media.title` | "Hack Hunters - Cyber investigations" |
| `media.description` | "...investigação ativa no ciberespaço..." |
| `media.slang[]` | `['Hack Hunters', 'Educação']` |

#### 4. Deduplicação

Posts que aparecem em ambas as estratégias (organicamente e textual) são incluídos **apenas uma vez**, preservando a ordem de prioridade.

```
Resultado final:
  [organically results] + [textual results] → uniqueById()
```

### Exemplo completo

**Term:** `"hacker security"`

```
Organicamente:
  post 7db72442 (Hack Hunters - Cyber investigations) ← aparece 1º
  post a348561f (outro post curado)                    ← aparece 2º

Textual:
  post 7db72442 → já incluído (descartado)
  post 5358f749 → media.description contém "ciberespaço" → incluído 3º

Resultado final: [7db72442, a348561f, 5358f749]
```

---

## Dados de Configuração

Os trending topics são configurados no backend em:

```
api-server/src/data/popular-searches.js
```

Estrutura de cada entrada:

```js
{
  term: 'hacker security',         // termo exibido no chip e usado na busca
  organically: [
    { id: '7db72442-...' },         // posts com prioridade máxima nos resultados
    { id: 'a348561f-...' }
  ]
}
```

### Termos atuais

| Term | Posts curados (organically) |
|---|---|
| `hacker security` | 2 posts |
| `dia da mulher` | 1 post |
| `o que é gptw` | nenhum (apenas busca textual) |
| `como funciona one-on-one` | 1 post |
| `vaga de java em 2025` | nenhum (apenas busca textual) |

> Termos sem `organically` dependem exclusivamente da busca textual para retornar resultados.

---

## Experiência do Usuário

### Estados visuais

| Estado | Comportamento |
|---|---|
| **Carregando** | Exibe 8 chips skeleton com larguras variadas, evitando layout shift |
| **Carregado** | Chips horizontalmente scrolláveis com ícone `trending_up` e o termo |
| **Clique** | Navegação imediata para `/search?q={term}` |
| **Sem resultados** | Search page exibe estado vazio com ícone `search_off` |
| **Com resultados** | Grid de posts renderizados com `PinCardPlayerShortComponent` |

### Skeleton de carregamento

Durante o carregamento dos topics, são exibidos 8 chips skeleton com larguras pré-definidas:

```
[96px] [140px] [112px] [160px] [120px] [88px] [144px] [104px]
```

A variação de tamanhos simula a diversidade real dos termos e previne o salto de layout (CLS).

### Interação com os chips

Os chips suportam **scroll horizontal por arraste** (`drag-to-scroll`): o usuário pode deslizar a barra de chips tanto com toque quanto com o mouse, sem ativar o clique acidentalmente. Há tolerância de 5px de deslocamento antes de suprimir o evento de clique.

---

## Impacto no Produto

### Para o usuário

- **Descoberta sem fricção:** encontra conteúdo relevante sem precisar formular uma busca
- **Sinal de relevância:** os chips indicam o que está em evidência na plataforma naquele momento
- **Resultado qualificado:** os primeiros posts retornados são sempre conteúdos estratégicos, não resultados aleatórios

### Para criadores e empresas

- **Visibilidade curada:** ao ser incluído na lista `organically` de um trending topic, um post ganha destaque privilegiado nos resultados daquele termo
- **Controle de narrativa:** empresas podem garantir que seus conteúdos mais relevantes apareçam primeiro para usuários que buscam temas do seu segmento
- **Alcance sem dependência de SEO:** o conteúdo é promovido ativamente pela plataforma, sem necessidade de otimização manual

### Para a plataforma

- **Controle editorial:** a equipe da RealWe define quais temas são expostos e quais posts são priorizados — sem depender do algoritmo
- **Aceleração do funil:** trending topics conduzem o usuário diretamente para conteúdos de descoberta, alimentando o funil Descoberta → Profundidade → Conversão
- **Dados de intenção:** os termos mais clicados revelam o que a audiência quer ver, orientando decisões de conteúdo e curadoria

---

## Arquitetura Técnica

### Componentes

```
TrendingTopicComponent
  selector:    home-trending-topic
  strategy:    ChangeDetectionStrategy.OnPush

  inputs:
    topics:       TrendingTopic[]     — lista de trending topics do backend
    isLoading:    boolean             — controla exibição do skeleton

  outputs:
    topicSelect:  EventEmitter<string> — emite o term do chip clicado
```

```
ChipScrollComponent
  selector: app-chip-scroll

  inputs:
    chips:    ChipItem[]   — { key, icon?, labelKey }
    selected: string       — key do chip ativo (visual)

  outputs:
    chipSelect: EventEmitter<string> — emite o key do chip clicado
```

### Fluxo de dados

```
RelevantResearchApi
  GET /api/relevant-research
    → trendingTopics (signal) em HomeComponent
      → TrendingTopicComponent [topics]
        → ChipScrollComponent [chips]
          → clique emite topicSelect
            → HomeComponent.search(term)
              → Router.navigate(['/search'], { queryParams: { q: term } })
                → SearchComponent recebe query param
                  → PostApi.search(term)
                    → GET /api/post?search={term}
                      → posts (signal)
                        → PinCardPlayerShortComponent grid
```

### Backend — Endpoint de busca

```
GET /api/post?search={term}
GET /api/post?search={term}&page={n}&pageSize={n}
```

Lógica aplicada (em ordem):

```js
1. Exact ID match  → [singlePost]
2. Organically     → posts curados por ID da entrada MOCK_POPULAR_SEARCHES[term]
3. Textual         → posts onde media.title | description | slang contém term
4. Merge           → uniqueById([...organicResults, ...textResults])
5. Paginação       → source.slice(start, start + pageSize)
```

### Backend — Endpoint de trending topics

```
GET /api/relevant-research
GET /api/relevant-research?page={n}&pageSize={n}
```

Retorna a lista de `MOCK_POPULAR_SEARCHES` paginada. O frontend usa apenas o campo `term` de cada entrada — o campo `organically` é consumido exclusivamente pelo backend durante a busca.

---

## Separação de Responsabilidades

| Camada | Responsabilidade |
|---|---|
| `popular-searches.js` | Define quais termos são exibidos e quais posts são priorizados |
| `GET /api/relevant-research` | Expõe os termos para exibição no frontend |
| `GET /api/post?search=` | Executa a busca híbrida usando os mesmos dados |
| `TrendingTopicComponent` | Renderiza os chips e propaga o clique |
| `HomeComponent` | Orquestra a navegação para `/search?q=` |
| `SearchComponent` | Executa a busca e exibe os resultados em grid |

> O campo `organically` nunca trafega pelo frontend — é um dado interno do backend. O frontend só conhece o `term`.

---

## Referências de Produto Similares

| Plataforma | Implementação equivalente |
|---|---|
| YouTube | "O que está em alta" / chips de trending na busca |
| TikTok | Trending searches na tela de descoberta |
| LinkedIn | Trending topics no feed e na busca |
| Twitter/X | Trending hashtags e termos na sidebar |

A RealWe adapta este padrão para o contexto de **conteúdo profissional intencional**: os trending topics não são baseados em volume bruto de buscas, mas em curadoria editorial — o que garante relevância qualificada, não popularidade vazia.

---

## Possíveis Evoluções

- **Trending dinâmico:** calcular os topics automaticamente com base no volume de buscas e cliques reais, substituindo ou complementando a curadoria manual
- **Personalização por usuário:** priorizar trending topics alinhados com o histórico e interesses declarados do usuário
- **Score de relevância:** ordenar resultados de busca por score composto (posição no `organically` + frequência textual + engajamento do post)
- **Trending por segmento:** exibir topics diferentes para recrutadores, candidatos e criadores de conteúdo
- **Badge de "novo":** sinalizar visualmente chips que entraram na lista recentemente
- **Analytics por chip:** medir taxa de clique (CTR) por term para orientar a curadoria editorial com dados reais
- **Sugestão progressiva:** ao digitar na barra de busca, sugerir trending topics que iniciem com o texto digitado
