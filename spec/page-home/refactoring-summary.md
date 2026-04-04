# Refatoração da Página Home — Alinhamento Semântico

**Data:** 2026-04-04  
**Branch:** master

---

## Objetivo

Alinhar os nomes de componentes, sinais e estruturas da página Home com os conceitos de negócio definidos em [`page-home.md`](./page-home.md), sem alterar comportamento ou visual existente.

---

## Estrutura Gerada

```
src/app/domain/home/
├── interfaces/
│   ├── trending-topic.ts
│   ├── daily-story.ts
│   └── media-content.ts
├── components/
│   ├── trending-topic/
│   │   ├── trending-topic.component.ts
│   │   ├── trending-topic.component.html
│   │   └── trending-topic.component.scss
│   ├── daily-story/
│   │   ├── daily-story.component.ts
│   │   ├── daily-story.component.html
│   │   └── daily-story.component.scss
│   ├── dynamic-interest-tabs/
│   │   ├── dynamic-interest-tabs.component.ts
│   │   ├── dynamic-interest-tabs.component.html
│   │   └── dynamic-interest-tabs.component.scss
│   └── media-card/
│       ├── media-card.component.ts
│       ├── media-card.component.html
│       └── media-card.component.scss
└── pages/
    └── home/
        ├── home.component.ts   ← refatorado
        ├── home.component.html ← refatorado
        └── home.component.scss ← simplificado
```

---

## Interfaces de Domínio

### `TrendingTopic`
```ts
export interface TrendingTopic {
  term: string;
}
```
Representa um tópico em alta (antes: `RelevantResearch`).

---

### `DailyStory`
```ts
export interface DailyStory {
  id: string;
  name: string;
  pinsCount: number;
  coverImages?: string[];
  coverImageUrl?: string;
  owner: { id, username, displayName, avatarUrl? };
  createdAt: string;
}
```
Representa um story diário (antes: `Board`). Estruturalmente compatível com `Board` via duck typing.

---

### `MediaContent`
```ts
export interface MediaContent {
  id: string;
  title?: string;
  imageUrl: string;
  author: { id, username, displayName, avatarUrl? };
  saveCount: number;
  commentCount: number;
  createdAt: string;
  // + demais campos opcionais de Pin
}
```
Representa um conteúdo de mídia no feed (antes: `Pin`). Estruturalmente idêntico a `Pin`.

---

## Componentes Criados

### `<home-trending-topic>`
**Arquivo:** `components/trending-topic/`  
**Conceito:** Tópicos mais buscados exibidos como chips horizontais com ícone de tendência.

| API | Tipo | Descrição |
|-----|------|-----------|
| `topics` | `input<TrendingTopic[]>` | Lista de tópicos em alta |
| `isLoading` | `input<boolean>` | Exibe skeleton enquanto carrega |
| `topicSelect` | `output<string>` | Emite o termo clicado (dispara busca) |

**Comportamento:** Skeleton de chips → `ChipScrollComponent` com ícone `trending_up`.

---

### `<home-daily-story>`
**Arquivo:** `components/daily-story/`  
**Conceito:** Conteúdos publicados nas últimas 24h, exibidos em scroll horizontal.

| API | Tipo | Descrição |
|-----|------|-----------|
| `stories` | `input<DailyStory[]>` | Lista de stories do usuário |
| `isLoading` | `input<boolean>` | Exibe skeleton enquanto carrega |

**Comportamento:** Scroll horizontal com drag-to-scroll (mouse). Lógica de arrastar migrada do `HomeComponent` para cá via `afterNextRender` + `DestroyRef`.

---

### `<home-dynamic-interest-tabs>`
**Arquivo:** `components/dynamic-interest-tabs/`  
**Conceito:** Abas de categoria que mudam conforme trending topics e comportamento dos usuários.

| API | Tipo | Descrição |
|-----|------|-----------|
| `tabs` | `input<ContentCategory[]>` | Categorias disponíveis |
| `selectedTab` | `input<string>` | Aba ativa |
| `isLoading` | `input<boolean>` | Exibe skeleton enquanto carrega |
| `tabSelect` | `output<string>` | Emite a categoria selecionada |

**Comportamento:** Skeleton de chips → `ChipScrollComponent` com destaque na aba ativa.

---

### `<home-media-card>`
**Arquivo:** `components/media-card/`  
**Conceito:** Feed de conteúdos de mídia em formato masonry (imagem, título, canal).

| API | Tipo | Descrição |
|-----|------|-----------|
| `mediaItems` | `input<MediaContent[]>` | Itens do feed |
| `isLoading` | `input<boolean>` | Exibe skeleton loader |
| `isLoadingMore` | `input<boolean>` | Estado do infinite scroll |
| `selectedCategory` | `input<string>` | Categoria ativa (usada no título) |
| `loadMore` | `output<void>` | Dispara carregamento de mais itens |

**Comportamento:** Título dinâmico ("Em Alta" ou nome da categoria) → `MasonryGridComponent` → `InfiniteScrollComponent`.

---

## Renomeação de Sinais no HomeComponent

| Antes | Depois | Motivo |
|-------|--------|--------|
| `pins` | `mediaItems` | Alinhamento com `MediaContent` |
| `popularSearches` | `trendingTopics` | Conceito de negócio |
| `categories` | `interestTabs` | Conceito de negócio |
| `boards` | `dailyStories` | Conceito de negócio |
| `isLoadingBoards` | `isLoadingDailyStories` | Consistência |
| `isLoadingCategories` | `isLoadingInterestTabs` | Consistência |
| `isLoadingPopularSearches` | `isLoadingTrendingTopics` | Consistência |
| `relevantResearch` (computed) | removido | Movido para `TrendingTopicComponent` |
| `gridRecentContent` (computed) | removido | Movido para `DynamicInterestTabsComponent` |
| `boardsTrack` (viewChild) | removido | Movido para `DailyStoryComponent` |

---

## HomeComponent — Antes vs Depois

### Template antes
```html
<div class="home-page">
  <!-- skeleton / chip-scroll com popular searches -->
  <!-- boards scroll com drag logic -->
  <!-- skeleton / chip-scroll com categorias -->
  <!-- título + skeleton / masonry + infinite scroll -->
</div>
```

### Template depois
```html
<div class="home-page">
  <home-trending-topic   [topics]="trendingTopics()"   ... />
  <home-daily-story      [stories]="dailyStories()"    ... />
  <home-dynamic-interest-tabs [tabs]="interestTabs()" ... />
  <home-media-card       [mediaItems]="mediaItems()"   ... />
</div>
```

---

## O que NÃO foi alterado

- Nenhuma regra de negócio
- Nenhuma chamada de API ou serviço (endpoints, payloads, mapeamentos)
- Layout visual (posição, espaçamento, animações, cores)
- Componentes compartilhados (`BoardCardComponent`, `ChipScrollComponent`, `MasonryGridComponent`, etc.)
- Rotas e navegação

---

## Decisões Técnicas

- **Duck typing para compatibilidade:** `DailyStory` é estruturalmente compatível com `Board`, e `MediaContent` com `Pin`. Isso evita adapters desnecessários entre camadas.
- **Drag scroll encapsulado:** A lógica de `mousedown/mousemove/mouseup` foi extraída do `HomeComponent` (onde não pertencia) para `DailyStoryComponent`, usando `afterNextRender` + `viewChild` + `DestroyRef`.
- **Sem `standalone: true`:** Novos componentes seguem Angular v20+ (default standalone).
- **`ChangeDetectionStrategy.OnPush`** em todos os novos componentes.
