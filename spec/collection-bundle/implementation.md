# CollectionBundle — Especificação de Implementação

## Status

✅ Implementado em `2026-04-11`

---

## Objetivo

A **Collection Bundle** é a unidade de curadoria de conteúdo da plataforma RealWe.

Ela agrupa mídias relacionadas — vídeos, imagens, áudios ou apps — dentro de um canal, permitindo que empresas e criadores organizem seus conteúdos por tema, produto, treinamento ou campanha.

O componente é o ponto de entrada visual para uma coleção: ao ser clicado, leva o usuário para a página completa da coleção, onde ele pode se aprofundar no conteúdo e avançar no funil de **Descoberta → Profundidade → Conversão**.

---

## Contexto de Negócio

### A plataforma RealWe

A RealWe é uma plataforma de autoridade profissional. Empresas operam como **canais** e seus colaboradores publicam conteúdo real sobre o dia a dia de trabalho: rotina, ferramentas, processos, vagas, treinamentos e produtos.

O funil da plataforma funciona em quatro etapas:

| Etapa | O que acontece |
|-------|---------------|
| **Descoberta** | Vídeos curtos no feed apresentam empresas e temas ao usuário |
| **Profundidade** | O usuário acessa o conteúdo completo para aprofundar o assunto |
| **Conversão** | Botão "Saiba Mais" leva a inscrição em vaga, compra ou treinamento |
| **Comunidade** | O usuário interage com outros que passaram pelo mesmo fluxo |

### Onde a Collection Bundle se encaixa

A Collection Bundle atua na camada de **Profundidade**. Ela organiza um acervo de mídias em torno de um tema específico dentro de um canal, evitando que o conteúdo fique solto e facilitando a navegação contínua do usuário.

Exemplos práticos de uso:

- Canal **Digix** → coleção "Primeiros passos no Habix" (treinamento de produto)
- Canal **Digix** → coleção "Vagas abertas — Q2 2025" (recrutamento)
- Canal **Digix** → coleção "Bastidores do GPTW 2025" (cultura organizacional)

### Tipos de conteúdo suportados

| Tipo | Descrição |
|------|-----------|
| `video` | Vídeos curtos de descoberta ou longos de profundidade |
| `image` | Imagens, fotos, slides ou infográficos |
| `audio` | Podcasts ou áudios informativos |
| `app` | Ferramentas ou mini-aplicativos interativos |

### Regras de negócio

- Uma Collection Bundle **pertence a um canal** e não existe fora dele
- A coleção deve ter nome do canal visível para reforçar a identidade da empresa
- Deve exibir **fallback visual** quando não houver mídias cadastradas (empty state com ícone `collections_bookmark`)
- A navegação leva para `/:channel/collection/:id`, mantendo o contexto do canal

---

## Guia do Usuário

### O que é uma Collection Bundle?

É um conjunto de vídeos e mídias organizados por tema dentro do canal de uma empresa.

Pense como uma **playlist temática**: em vez de ver conteúdos soltos, você encontra tudo sobre um assunto reunido em um único lugar.

### Como usar

**1. Encontrar uma coleção**

Coleções aparecem na página de um canal, agrupadas por tema. Cada card mostra:
- Uma prévia visual com até 3 imagens ou thumbnails
- O nome do canal (empresa responsável)
- Uma descrição curta do tema da coleção

**2. Abrir uma coleção**

Clique no card para acessar a página completa da coleção. Lá você encontrará todos os vídeos e mídias organizados.

**3. Consumir o conteúdo**

Dentro da coleção você pode:
- Assistir aos vídeos em sequência
- Aprofundar o tema no seu próprio ritmo
- Clicar em "Saiba Mais" para avançar para inscrição, compra ou contato

### Para quem é útil?

| Perfil | Como usa |
|--------|----------|
| **Candidato** | Acessa a coleção de vagas ou cultura da empresa antes de aplicar |
| **Aluno / Usuário** | Segue uma coleção de treinamento passo a passo |
| **Parceiro / Prospect** | Explora coleção de produtos e casos de uso |
| **Colaborador** | Acessa material interno publicado no canal da empresa |

---

## Localização dos arquivos

### Card compartilhado (`app-collection-bundle`)

| Arquivo | Caminho |
|---------|---------|
| Componente TS | `src/app/shared/components/collection-bundle/collection-bundle.component.ts` |
| Template HTML | `src/app/shared/components/collection-bundle/collection-bundle.component.html` |
| Estilos SCSS | `src/app/shared/components/collection-bundle/collection-bundle.component.scss` |

### Página completa (`app-collection`)

| Arquivo | Caminho |
|---------|---------|
| Componente TS | `src/app/domain/collection/pages/collection/collection.component.ts` |
| Template HTML | `src/app/domain/collection/pages/collection/collection.component.html` |
| Estilos SCSS | `src/app/domain/collection/pages/collection/collection.component.scss` |

### Interfaces, mapas e APIs

| Arquivo | Caminho |
|---------|---------|
| Interface Entity | `src/app/shared/interfaces/entity/collection-bundle.ts` |
| DTO Response | `src/app/shared/interfaces/dto/response/collection-bundle.ts` |
| Map | `src/app/shared/maps/collection-bundle.map.ts` |
| API Service | `src/app/shared/apis/collection-bundle.api.ts` |

### Mock data (API server)

| Arquivo | Caminho |
|---------|---------|
| Bundles mock | `api-server/src/data/collection-bundles.js` |
| Route handler | `api-server/src/routes/collection-bundle.js` |

---

## Interfaces

```ts
export interface CollectionItem {
  type: 'image' | 'video' | 'audio' | 'app';
  postId?: string;       // UUID referenciando MOCK_POSTS em posts.js
  title?: string;
  duration?: number;     // segundos
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface CollectionBundle {
  id: string;
  channel: string;
  username: string;
  channelPicture?: string;
  verified?: boolean;
  description: string;
  items: CollectionItem[];
  coverUrl?: string;
}
```

> **Atenção:** `postId` deve referenciar o array `MOCK_POSTS` (IDs UUID) exportado em
> `api-server/src/data/posts.js`. O array `mockPostsFormatos` (IDs `demo-*`) **não é exportado**
> e não deve ser usado.

---

## Card compartilhado — API do componente

### Selector

```html
<app-collection-bundle [bundle]="myBundle" />
```

### Input

| Input | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `bundle` | `CollectionBundle` | Sim | Objeto completo da coleção |

### Lógica interna (signals/computeds)

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `coverImages` | `computed<string[]>` | Prioriza `coverUrl`; fallback para até 3 `thumbnailUrl` dos `items` |
| `hasImages` | `computed<boolean>` | `true` se `coverImages` tiver ao menos 1 item |

### Mapa de ícones por tipo

| Tipo | Ícone Material |
|------|----------------|
| `image` | `image` |
| `video` | `play_circle` |
| `audio` | `headphones` |
| `app` | `apps` |

### Variações do cover

| Condição | Layout |
|----------|--------|
| `coverImages.length >= 3` | Grid `2fr 1fr` — imagem principal + 2 menores empilhadas |
| `coverImages.length` 1 ou 2 | Imagem única cobrindo todo o quadrado |
| `coverImages.length === 0` | Placeholder cinza com ícone `collections_bookmark` |

### Comportamento

- **Hover**: `scale(1.02)` + sublinhado no nome do canal
- **Focus visible**: outline `--pin-red` com `outline-offset: 2px`
- **Navegação**: `<a routerLink>` para `/:channel/collection/:id`
- **Lazy loading**: todas as imagens usam `loading="lazy"`
- **Acessibilidade**: `aria-label` no link com a descrição; `aria-hidden` no cover decorativo

---

## Página de coleção — CollectionPageComponent

### Rota

```
/:channel/collection/:id
```

### Layout final (espelha o componente `app-pin`)

```
┌──────────────────────────────────────────────────────────────────┐
│  pin-detail-container  (card com box-shadow)                     │
│  ┌────────────────────────┬─────────────────────────────────────┐│
│  │  pin-detail-image-side │  pin-detail-info                    ││
│  │                        │                                     ││
│  │  <video> ou <img>      │  [❤ like] [•••]  [Salvar]          ││
│  │                        │  [Compartilhar]  [Saiba Mais]       ││
│  │                        │                                     ││
│  │  ──────────────────    │  ┌──────┐  Título da coleção       ││
│  │  [⏮]  [▶/⏸]  [⏭]     │  │cover │  N vídeos               ││
│  │  (cp-controls)         │  └──────┘                          ││
│  │                        │                                     ││
│  │                        │  [avatar] Canal     [Inscrever-se] ││
│  │                        │           X seguidores              ││
│  │                        │                                     ││
│  │                        │  Progresso  ████░░░░  X%           ││
│  │                        │                                     ││
│  │                        │  Conteúdos                          ││
│  │                        │  [thumb] Título  dur.  ○           ││
│  │                        │  [thumb] Título  dur.  ○           ││
│  └────────────────────────┴─────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘

  pin-detail-container  (abaixo do card — detalhes do post atual)
┌──────────────────────────────────────────────────────────────────┐
│  [❤ like] [•••]  [Saiba Mais]           ← sempre visível        │
│                                                                  │
│  X visualizações • Y tempo atrás        ← @if (currentPost())   │
│  Título do post                                                  │
│  Descrição... #hashtag1 #hashtag2                                │
│                                                                  │
│  [avatar]  Nome do canal               [Inscrever-se]           │
│            X seguidores                                          │
│                                                                  │
│  Comentários                                                     │
│  [avatar] [Adicione um comentário...]                            │
│  [avatar]  Usuário • tempo             ← @if (currentPost())    │
│            Texto do comentário  ❤ N                              │
└──────────────────────────────────────────────────────────────────┘
```

### Carregamento de dados

Bundle e posts são carregados em paralelo com `forkJoin`:

```ts
forkJoin({
  bundle: this.collectionApi.detail(bundleId),
  posts: this.postApi.list(1, 100),
}).subscribe({
  next: ({ bundle, posts }) => {
    this.bundle.set(bundle.data);
    this.itemStates.set(bundle.data.items.map(() => ({ status: 'idle', progress: 0 })));
    this.posts.set(posts.data?.data ?? []);
  },
  error: () => this.hasError.set(true),
  complete: () => this.isLoading.set(false),
});
```

### Resolução do post atual (`currentPost`)

```ts
readonly currentPost = computed<Post | null>(() => {
  const item = this.currentItem();
  const allPosts = this.posts();
  if (!item || !allPosts.length) return null;

  // 1. Casa por postId
  if (item.postId) {
    const byId = allPosts.find((p) => p.id === item.postId);
    if (byId) return byId;
  }

  // 2. Fallback: casa por videoUrl
  if (item.videoUrl) {
    return allPosts.find(
      (p) => p.media.long === item.videoUrl || p.media.short === item.videoUrl
    ) ?? null;
  }

  return null;
});
```

### Signals

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `bundle` | `signal<CollectionBundle \| null>` | Bundle carregado da API |
| `posts` | `signal<Post[]>` | Lista completa de posts para resolução do `currentPost` |
| `isLoading` | `signal<boolean>` | Controla exibição do skeleton |
| `hasError` | `signal<boolean>` | Controla exibição do empty state de erro |
| `currentIndex` | `signal<number>` | Índice do item ativo na playlist |
| `isPlaying` | `signal<boolean>` | Estado de reprodução do `<video>` nativo |
| `itemStates` | `signal<ItemPlayState[]>` | Progresso e status de cada item da playlist |
| `commentText` | `signal<string>` | Texto do campo de comentário |

### Computeds

| Computed | Descrição |
|----------|-----------|
| `currentItem` | `bundle().items[currentIndex()]` |
| `currentPost` | Post correspondente ao item atual (postId → videoUrl fallback) |
| `hasPrev` | `currentIndex() > 0` |
| `hasNext` | `currentIndex() < bundle().items.length - 1` |
| `overallProgress` | Média do progresso de todos os itens (0–100) |
| `coverImages` | Até 3 thumbnails; prioriza `bundle.coverUrl` |

### Estado de reprodução por item

```ts
export interface ItemPlayState {
  status: 'idle' | 'playing' | 'done';
  progress: number; // 0–100
}
```

| Status | Ícone na playlist | Descrição |
|--------|-------------------|-----------|
| `idle` | `radio_button_unchecked` | Não iniciado |
| `playing` | `play_circle` | Em reprodução |
| `done` | `check_circle` (verde) | Concluído — item com opacidade reduzida |

### Comportamento do player

| Método | Descrição |
|--------|-----------|
| `selectItem(index)` | Seleciona e inicia reprodução do item clicado |
| `togglePlay()` | Pausa/retoma o `<video>` nativo; atualiza `isPlaying` |
| `prev()` | Navega ao item anterior sem autoplay |
| `next()` | Navega ao próximo item sem autoplay |
| `onVideoTimeUpdate()` | Atualiza o progresso do item em tempo real via `timeupdate` |
| `onVideoEnded()` | Marca item como `done` (100%) e avança automaticamente após 800 ms |

### Estratégia de fallback na seção de detalhes

A seção de detalhes abaixo do card é **sempre renderizada** quando o bundle tem itens. Apenas o conteúdo dependente do post usa `@if (currentPost())`:

| Elemento | Comportamento quando `currentPost()` é nulo |
|----------|---------------------------------------------|
| Action bar (like, •••, Saiba Mais) | Renderiza com `count=0`, `liked=false` |
| Views / tempo / título / descrição | **Oculto** — dentro de `@if (currentPost())` |
| Channel row (nome, seguidores, Inscrever-se) | Renderiza com dados do `bundle()` como fallback |
| Campo de comentário | Sempre visível |
| Lista de comentários | **Oculta** — dentro de `@if (currentPost())` |

---

## Estados de tela

| Condição | Renderização |
|----------|--------------|
| `isLoading()` | Skeleton (`.pin-detail-skeleton`) |
| `hasError() \|\| !bundle()` | Empty state — "Coleção não encontrada" |
| `bundle()!.items.length === 0` | Empty state — "Esta coleção ainda não tem conteúdo" |
| Bundle com itens | Layout completo (card + seção de detalhes) |

---

## Dados mock (API server)

### Bundles disponíveis

| ID | Descrição | Itens |
|----|-----------|:-----:|
| `bundle-habix-001` | Primeiros passos no Habix | 3 |
| `bundle-vagas-001` | Vagas abertas — Python, Backend e Eng. Software | 2 |
| `bundle-cultura-001` | Cultura e ambiente de trabalho na Digix | 1 |
| `bundle-empty-001` | Coleção sem mídias cadastradas | 0 |

### Mapeamento postId → MOCK_POSTS

Os `postId` nos bundles referenciam o array `MOCK_POSTS` (exportado) de `posts.js`.
Os três posts usados foram enriquecidos com `comment.data` e `slang` para renderização completa.

| postId (UUID) | Título |
|---------------|--------|
| `c091c66a-0e28-4e7c-a1c9-1b4cef6da742` | O que é o Habix? |
| `0a51b6fa-6076-4aa8-b436-49640ef61dbb` | Engenheiro de Software Especialista |
| `dbbb73d8-298e-4dce-b75d-293da1b68519` | Digix é Great Place to Work 2025 |

---

## Integração com o Design System

| Token | Uso |
|-------|-----|
| `--radius-lg` | Bordas do card e cover |
| `--pin-transition` | Animação hover |
| `--pin-bg-secondary` | Background placeholder e item ativo |
| `--pin-bg-tertiary` | Background thumbnail sem imagem |
| `--pin-text-primary` | Cor do nome do canal |
| `--pin-text-secondary` | Cor da descrição |
| `--pin-text-muted` | Cor do ícone no placeholder e status idle |
| `--pin-red` | Botão play, progress fill, outline focus-visible |
| `--pin-green` | Ícone `check_circle` de item concluído |
| `--pin-border` | Borda superior da controls bar |
| `--space-xs`, `--space-sm` | Espaçamento interno dos itens da playlist |

---

## Styleguide

O card está registrado no styleguide em:

```
/styleguide/comp-collection-bundle
```

Com dois demos:
- **Com mídias**: 3 thumbnails reais em grid
- **Empty state**: bundle sem items (exibe placeholder)

---

## Exemplo de uso (card)

```ts
const bundle: CollectionBundle = {
  id: 'bundle-habix-001',
  channel: 'Digix',
  username: 'digix',
  channelPicture: 'https://...',
  verified: true,
  description: 'Primeiros passos de como utilizar a plataforma Habix',
  items: [
    {
      type: 'video',
      postId: 'c091c66a-0e28-4e7c-a1c9-1b4cef6da742',
      title: 'O que é o Habix?',
      duration: 142,
      thumbnailUrl: 'https://...',
      videoUrl: 'https://...',
    },
  ],
};
```

```html
<app-collection-bundle [bundle]="bundle" />
```
