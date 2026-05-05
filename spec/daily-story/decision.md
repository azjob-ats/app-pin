# Decisão: Suspensão da feature `home-daily-story`

- **Data:** 2026-05-05
- **Status:** Suspensa (não removida)
- **Responsável:** azjob-ats
- **Branch:** master

## Resumo

A feature `home-daily-story` foi temporariamente desativada (código comentado, não removido).
Após avaliação de diferentes modelos/abordagens visuais e de interação para o componente
de "Daily Story" no Home, **nenhuma das implementações testadas se mostrou compatível com
o restante do projeto** no momento (identidade visual, padrão de cards, navegação, ergonomia
e consistência com `watch`, `showcase`, `collection` e `polaroid-photo-card`).

A decisão foi pausar a entrega para evitar inserir um padrão que destoasse do resto da Home,
preservando a opção de retomar quando houver um modelo definitivo.

## Motivos

1. Os modelos testados não atingiram coerência visual com o sistema de cards/feed atual.
2. A interação (drag horizontal, skeleton, polaroid) não convergiu em um padrão único
   alinhado às outras seções da Home.
3. Sem definição clara de produto, manter a feature ativa adicionaria ruído visual e
   código sem retorno imediato.

## Escopo do que foi comentado

A implementação **não foi apagada**: foi comentada com referência a este documento.
Para reativar, basta restaurar os blocos comentados.

### Frontend — componente `home-daily-story`

- [`src/app/domain/home/components/daily-story/daily-story.component.ts`](../../src/app/domain/home/components/daily-story/daily-story.component.ts) — classe `DailyStoryComponent` comentada.
- [`src/app/domain/home/components/daily-story/daily-story.component.html`](../../src/app/domain/home/components/daily-story/daily-story.component.html) — template comentado.
- [`src/app/domain/home/components/daily-story/daily-story.component.scss`](../../src/app/domain/home/components/daily-story/daily-story.component.scss) — estilos comentados.

### Frontend — interface

- [`src/app/domain/home/interfaces/daily-story.ts`](../../src/app/domain/home/interfaces/daily-story.ts) — interface `DailyStory` comentada.

### Frontend — integração no Home

- [`src/app/domain/home/pages/home/home.component.ts`](../../src/app/domain/home/pages/home/home.component.ts):
  - Imports `DailyStoryComponent`, `ShopWindowApi` e `ShopWindow` comentados.
  - Entrada `DailyStoryComponent` em `imports[]` do `@Component` comentada.
  - Signals `dailyStories` e `isLoadingDailyStories` comentadas.
  - Injeção `shopWindowApi = inject(ShopWindowApi)` comentada.
  - Chamada `this.shopWindowApi.list().subscribe(...)` em `loadFeed()` comentada.
- [`src/app/domain/home/pages/home/home.component.html`](../../src/app/domain/home/pages/home/home.component.html):
  - Tag `<home-daily-story>` comentada.

### Frontend — página standalone (vazia)

- [`src/app/domain/daily-story/pages/daily-story/`](../../src/app/domain/daily-story/pages/daily-story/) — diretório existia vazio; mantido como está.

## O que NÃO foi alterado e por quê

- **`@shared/apis/shop-window.api.ts`**, **`@shared/maps/shop-window.map.ts`**, **`@shared/interfaces/entity/shop-window.ts`** e **`@shared/interfaces/dto/response/shop-window.ts`**:
  permanecem ativos. São consumidos por `domain/showcase` (não apenas pelo daily-story).
- **`api-server/src/routes/daily-story.js`** e **`api-server/src/data/daily-story.js`**:
  apesar do nome, esses arquivos servem a rota `/api/boards` e expõem `MOCK_BOARDS`,
  consumidos também por `api-server/src/routes/users.js`. Não estão ligados ao feature
  `home-daily-story` no frontend (que consumia `/api/shop-window`). Mantidos intactos.

## Como reativar

1. Descomentar os blocos marcados com `FEATURE DESATIVADA: home-daily-story` em todos os
   arquivos listados em "Escopo do que foi comentado".
2. Validar que o componente `home-daily-story` continua compatível com o `polaroid-photo-card`
   atual (assinatura de `CollectionBundle`).
3. Rodar a Home, verificar carregamento via `ShopWindowApi.list()` e a renderização do track
   horizontal antes das `home-dynamic-interest-tabs`.
4. Atualizar este documento alterando o status para "Reativada" com a data.

## Próximos passos

- Definir, junto a produto/design, qual é o modelo definitivo do "Daily Story" (formato do card,
  tipo de mídia, regras de ordenação, integração com o feed, equivalência com `watch`/`showcase`).
- Abrir nova issue/branch quando houver alinhamento.
