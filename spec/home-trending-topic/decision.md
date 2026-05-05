# Decisão: Suspensão da feature `home-trending-topic`

- **Data:** 2026-05-05
- **Status:** Suspensa (não removida)
- **Responsável:** azjob-ats
- **Branch:** master

## Resumo

A feature `home-trending-topic` foi temporariamente desativada (código comentado, não removido).
Após avaliação de diferentes modelos/abordagens visuais para a faixa de "Trending Topics" no
topo da Home, **nenhuma das implementações testadas se mostrou compatível com o restante do
projeto** no momento (identidade visual, ergonomia de chips, scroll horizontal, equilíbrio
com `home-dynamic-interest-tabs` logo abaixo).

A decisão foi pausar a entrega para evitar manter um padrão que destoasse do resto da Home,
preservando a opção de retomar quando houver um modelo definitivo.

## Motivos

1. Os modelos testados não atingiram coerência visual com o sistema de chips/tabs atual.
2. Sobreposição funcional com `home-dynamic-interest-tabs` (ambos eram chips horizontais)
   gerou ruído de hierarquia no topo da Home.
3. Sem definição clara de produto, manter a feature ativa adicionaria uma faixa redundante.

## Escopo do que foi comentado

A implementação **não foi apagada**: foi comentada com referência a este documento.
Para reativar, basta restaurar os blocos comentados.

### Frontend — componente `home-trending-topic`

- [`src/app/domain/home/components/trending-topic/trending-topic.component.ts`](../../src/app/domain/home/components/trending-topic/trending-topic.component.ts) — classe `TrendingTopicComponent` comentada.
- [`src/app/domain/home/components/trending-topic/trending-topic.component.html`](../../src/app/domain/home/components/trending-topic/trending-topic.component.html) — template comentado.
- [`src/app/domain/home/components/trending-topic/trending-topic.component.scss`](../../src/app/domain/home/components/trending-topic/trending-topic.component.scss) — estilos comentados.

### Frontend — interface

- [`src/app/domain/home/interfaces/trending-topic.ts`](../../src/app/domain/home/interfaces/trending-topic.ts) — interface `TrendingTopic` comentada.

### Frontend — integração no Home

- [`src/app/domain/home/pages/home/home.component.ts`](../../src/app/domain/home/pages/home/home.component.ts):
  - Imports `TrendingTopicComponent`, `RelevantResearchApi` e `TrendingTopic` comentados.
  - Entrada `TrendingTopicComponent` removida do `imports[]` do `@Component` (com nota
    apontando para esta decisão acima do array, para manter o array estaticamente analisável
    pelo compilador Angular).
  - Signals `trendingTopics` e `isLoadingTrendingTopics` comentadas.
  - Injeção `relevantResearchApi = inject(RelevantResearchApi)` comentada.
  - Chamada `this.relevantResearchApi.list().subscribe(...)` em `loadHomeContent()` comentada.
- [`src/app/domain/home/pages/home/home.component.html`](../../src/app/domain/home/pages/home/home.component.html):
  - Tag `<home-trending-topic>` comentada.

## O que NÃO foi alterado e por quê

- **`@shared/apis/relevant-research.api.ts`**, **`@shared/maps/relevant-research.map.ts`**,
  **`@shared/interfaces/entity/relevant-research.ts`** e
  **`@shared/interfaces/dto/response/relevant-research.ts`**: permanecem ativos.
  Hoje são consumidos apenas pelo Home, mas seguem disponíveis no `@shared` para reaproveitamento
  futuro sem custo de manutenção. Se decidirmos descartar definitivamente o feature, esses
  arquivos podem ser removidos junto.
- **`@shared/components/chip-scroll/chip-scroll.component.ts`**: dependência visual usada pelo
  `TrendingTopicComponent`; mantida porque é compartilhada e pode ser reutilizada por outros
  componentes.
- **`api-server/src/routes/relevant-research.js`** (se existir): mantido intacto. Não impacta
  o frontend desativado e pode ser útil em outras integrações futuras.

## Como reativar

1. Descomentar os blocos marcados com `FEATURE DESATIVADA: home-trending-topic` em todos os
   arquivos listados em "Escopo do que foi comentado".
2. Restaurar a entrada `TrendingTopicComponent` no `imports[]` do `@Component` em
   `home.component.ts`.
3. Validar que `RelevantResearchApi.list()` continua retornando `{ term: string }[]`
   compatível com `TrendingTopic`.
4. Rodar a Home, verificar a renderização da faixa de chips no topo e a interação
   `(topicSelect)="search($event)"`.
5. Atualizar este documento alterando o status para "Reativada" com a data.

## Próximos passos

- Definir, junto a produto/design, qual é o modelo definitivo do "Trending Topics"
  (formato dos chips, fonte de dados, posicionamento na Home, relação com
  `home-dynamic-interest-tabs`).
- Avaliar consolidar Trending Topics e Interest Tabs em um único componente, eliminando
  redundância visual.
- Abrir nova issue/branch quando houver alinhamento.
