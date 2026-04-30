# Uniform-Aspect Mode — `PinCardPlayerShort`

> Referência do commit: `e4817ca` — _feat(pin-card-player-short): add uniform-aspect mode to eliminate grid gaps_

---

## 1. Visão Geral

### O que é

O **Uniform-Aspect Mode** é um novo modo de exibição opt-in do componente `PinCardPlayerShort` (o card de vídeo curto que protagoniza o feed da RealWe). Quando ativado pela flag `[uniformAspect]="true"`, o card abandona a proporção original do vídeo (que vinha do banco de dados) e adota uma **proporção padronizada controlada pela grade** — 9:16 para portrait, 27:16 (desktop) ou 9:8 (mobile) para landscape.

Em paralelo, a grade do feed (`media-card`) deixou de ser uma multi-coluna estilo Pinterest e passou a ser um **CSS Grid denso** de 6 colunas no desktop e 2 colunas no mobile, com `grid-auto-flow: dense` para empacotar automaticamente os cards e fechar buracos.

### Como funciona, em uma frase

O componente padroniza a altura dos cards via `aspect-ratio` injetado por CSS variable, e a grade usa packing denso para encaixar landscape (span 3) e portrait (span 1) sem deixar vazios.

### Onde se encaixa no produto

Vive nos dois pontos de descoberta visual da plataforma:

- **Home da RealWe** ([`media-card.component`](../../src/app/domain/home/components/media-card/media-card.component.scss)) — o feed principal de shorts e vídeos.
- **Página de busca** ([`search.component`](../../src/app/domain/search/pages/search/search.component.html)) — resultado de pesquisa por termo.

```
┌────────── Antes (multi-column) ──────────┐
│  [9:16]  [9:16]  [9:16]  [9:16]  [9:16]  │
│  [9:16]  [16:9 ─────]  [9:16]   ░░░░░░░  │  ← buraco
│  [9:16]  [9:16]   ░░░░░  [9:16]  [9:16]  │  ← buracos
└──────────────────────────────────────────┘

┌────────── Depois (grid dense) ───────────┐
│  [9:16][9:16][9:16][9:16][9:16][9:16]    │
│  [9:16][9:16][27:16 ───────][9:16]       │  ← landscape ocupa 3 col
│  [9:16][9:16][9:16][9:16][9:16][9:16]    │  ← grade 100% cheia
└──────────────────────────────────────────┘
```

---

## 2. Propósito

### Por que essa funcionalidade existe

A grade da home e da busca são montadas a partir de posts com aspect ratios variados — o criador faz upload em portrait (9:16), quadrado (1:1) ou landscape (16:9). Antes deste commit, cada card respeitava a proporção real da mídia, o que deixava o layout em "tetris" — alturas desiguais que abriam **buracos brancos** quando o algoritmo de empilhamento (CSS multi-column) não conseguia fechar a linha.

Esses buracos eram um problema porque:

- **Quebravam a estética minimalista** inspirada no Pinterest, que é pilar de design da RealWe.
- **Reduziam a densidade percebida** de conteúdo — a grade parecia incompleta.
- **Pareciam erro de carregamento** — o usuário interpretava o vácuo como falha visual.
- **Distraíam do conteúdo** — a atenção fugia para o "vazio".

### Qual problema resolve

> _"Como manter a grade visualmente coesa quando os vídeos vêm em proporções diferentes?"_

O Uniform-Aspect Mode resolve isso **forçando uma proporção comum** por contexto de exibição (vertical na grade portrait, horizontal mais largo no landscape) e deixa o packing denso da grade encaixar tudo sem espaço residual.

### Qual necessidade do usuário atende

- **Continuidade visual** — a rolagem é fluida, sem "saltos" ou cortes.
- **Foco no conteúdo** — todos os cards parecem irmãos: o destaque vai para o vídeo, não para o tamanho do moldura.
- **Densidade de descoberta** — mais conteúdo na primeira dobra (passou de 5 → 6 colunas no desktop).
- **Mobile mais imersivo** — cards portrait ocupam quase a largura total da tela (gap de apenas 6px).

---

## 3. Objetivo

### O que se espera alcançar

1. **Zero buracos visíveis** na grade da home e da busca, em qualquer resolução.
2. **Densidade aumentada** — desktop com 6 colunas (antes 5) e gap reduzido a 1px (antes 16px), evocando o efeito "mosaic wall" usado por plataformas como Pinterest e TikTok Discover.
3. **Compatibilidade retroativa** — o modo é **opt-in**: contextos que ainda dependem da proporção original (página `/pin/:id`, embeds, watch page) continuam funcionando sem alteração.
4. **Performance preservada** — toda a mudança é CSS puro (CSS Grid + custom properties); nenhum JavaScript adicional, nenhum re-layout custoso.

### Benefícios diretos para o usuário

| Antes | Depois |
|---|---|
| Cards de alturas variáveis | Cards uniformes, alinhados |
| Buracos brancos no meio do feed | Grade 100% preenchida |
| 5 colunas no desktop, gap de 16px | 6 colunas, gap de 1px (mosaico) |
| Footer com título + canal abaixo do vídeo | Card "limpo", foco total no vídeo |
| Landscape quebrava a coluna inteira | Landscape ocupa 3 colunas e a grade segue fluindo |

### Benefícios para o negócio / plataforma

- **Maior densidade = mais impressões por scroll** — diretamente correlacionado com CTR e tempo de sessão.
- **Estética premium** — alinhamento visual reforça a percepção de "produto polido", crítico para retenção de criadores e empresas.
- **Base para Winning-Slots** — a grade determinística e densa é o substrato sobre o qual os winning-slots ([ver spec](../winning-slots/winning-slots.md)) operam: ambos compartilham a mesma promessa de "grade sempre cheia".
- **Mobile-first ready** — o layout 2-colunas em mobile com landscape em span-2 reproduz a experiência de feed vertical de TikTok/Reels, sem retrabalho.

### Indicadores que validam a feature

- **% de gaps visuais** — meta: 0% em qualquer breakpoint acima da última linha.
- **Tempo médio na home / busca** — comparativo antes/depois.
- **Cards visíveis na primeira dobra** — meta: +20% no desktop (5 → 6 colunas + gap menor).
- **Bounce rate** na página de busca — proxy para "a grade me convidou a explorar".

---

## 4. Comportamento por contexto

| Contexto | Colunas | Gap | Landscape ocupa | `--pcps-aspect` portrait | `--pcps-aspect` landscape |
|---|---|---|---|---|---|
| **Home desktop** | 6 | 1px | `span 3` | `9 / 16` | `27 / 16` |
| **Home mobile** (≤768px) | 2 | 6px | `span 2` | `9 / 16` | `9 / 8` |
| **Busca desktop** | herda multi-column | — | `column-span: all` | `9 / 16` | proporção original |
| **Busca mobile** (≤768px) | herda | — | `column-span: all` | `9 / 16` | `9 / 8` |
| **Watch / página do Pin** | — | — | — | **modo desligado** (mantém aspect-ratio original do vídeo) |

---

## 5. Princípios não-negociáveis

1. **Modo é opt-in.** O componente só aplica a proporção uniforme quando recebe explicitamente `[uniformAspect]="true"`. Contextos legados continuam intactos.
2. **A grade dita a proporção, não o vídeo.** O contêiner pai define `--pcps-aspect`; o card apenas consome. Isso permite que a mesma instância do componente se adapte a diferentes layouts sem variantes.
3. **Footer fora do card no modo grid.** Título e identificação do canal foram removidos do card no contexto de feed denso — o foco é a mídia. A informação textual é recuperada na página de detalhe do Pin.
4. **Landscape nunca distorce.** Em vez de esticar, o card landscape ocupa múltiplas colunas, preservando proporção e mantendo a sensação de mosaico.
5. **CSS-only.** Nenhum JavaScript de medição, observers ou cálculos de layout — toda a magia acontece via CSS Grid + custom properties.

---

## 6. Mudanças aplicadas (resumo do commit)

### Componente — `PinCardPlayerShort`

- **TS** ([pin-card-player-short.component.ts](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.ts:30)): novo input `uniformAspect = input(false)` e host binding `[class.uniform-aspect]`.
- **HTML** ([pin-card-player-short.component.html](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.html)): `aspect-ratio` inline desabilitado quando o modo está ativo; bloco `pcps__footer` (título + canal + verified) removido.
- **SCSS** ([pin-card-player-short.component.scss](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.scss)): nova regra `:host(.uniform-aspect) .pcps__media { aspect-ratio: var(--pcps-aspect, 9 / 16); }`. `border-radius` da mídia → 0. `margin-bottom` → 0.

### Grade — Home

- **HTML** ([media-card.component.html](../../src/app/domain/home/components/media-card/media-card.component.html)): passa `[uniformAspect]="true"` ao card.
- **SCSS** ([media-card.component.scss](../../src/app/domain/home/components/media-card/media-card.component.scss)): migração de `columns: 5` → `display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-flow: dense; gap: 1px;`. Landscape ocupa `span 3` no desktop, `span 2` no mobile.

### Grade — Busca

- **HTML** ([search.component.html](../../src/app/domain/search/pages/search/search.component.html)): passa `[uniformAspect]="true"`.
- **SCSS** ([search.component.scss](../../src/app/domain/search/pages/search/search.component.scss)): mobile landscape ganha `--pcps-aspect: 9 / 8`.

---

## 7. Para desenvolvedores: como adotar em novas telas

```html
<!-- Padrão (compatível, mantém aspect-ratio original do vídeo) -->
<app-pin-card-player-short [post]="post" />

<!-- Modo grid uniforme -->
<app-pin-card-player-short [post]="post" [uniformAspect]="true" />
```

No SCSS do contêiner pai, defina o `--pcps-aspect` apropriado para landscape (e demais variações):

```scss
.minha-grade {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-flow: dense;
  gap: 1px;

  app-pin-card-player-short.is-landscape {
    grid-column: span 3;
    --pcps-aspect: 27 / 16;
  }
}
```

A classe `.is-landscape` é aplicada automaticamente pelo componente via host binding quando o post é horizontal.

---

## 8. Próximos passos sugeridos

- **Unificar com Winning-Slots:** o `WinningSlotCard` deve adotar o mesmo contrato de `--pcps-aspect` para que slots e posts sejam visualmente intercambiáveis.
- **Documentar tokens de proporção** em um arquivo central (`tokens/aspect-ratios.scss`) para evitar valores mágicos espalhados pelos SCSS de domínio.
- **A/B test:** medir CTR da home antes vs. depois com instrumentação por slot/posição na grade.
