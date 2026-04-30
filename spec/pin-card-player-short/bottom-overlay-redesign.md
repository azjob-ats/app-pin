# Bottom Overlay Redesign — `PinCardPlayerShort`

> Reorganização do bloco inferior do player de shorts para reforçar identidade do conteúdo dentro da própria grade.

---

## 1. Visão Geral

### O que é

Uma reformulação do **bloco inferior** (overlay bottom) do componente `PinCardPlayerShort`. O contador numérico de tempo decorrido (`0:42 / 1:30`) foi removido e o espaço passou a exibir, em ordem vertical:

1. **Título do vídeo**
2. **Linha de meta** — nome oficial do canal · visualizações formatadas · tempo relativo desde a postagem
3. **Barra de progresso** — preservada como estava

Tudo continua dentro da camada de overlay sobre o vídeo, herda o gradiente de legibilidade já existente e desaparece junto com os demais controles após 5s de inatividade.

### Como funciona, em uma frase

Quando o usuário aciona o player (toque/hover) o card expõe — sobre o vídeo — o título, a identidade do canal e o engajamento, mantendo o contexto do conteúdo sem sair do feed.

### Onde se encaixa no produto

O `PinCardPlayerShort` é o card de vídeo que protagoniza a **home** e a **busca** da RealWe. Esta mudança afeta todas as superfícies que usam o componente — inclusive no modo `uniformAspect` (grade densa de 6 colunas), em que o footer textual havia sido removido para enxugar o card.

```
┌──── Card (overlay visível) ────┐
│  [vol]                  [→]    │  ← Top: volume + abrir post
│                                │
│              ▶                 │  ← Center: play / pause
│                                │
│  Título do vídeo em até 2 lin… │  ← Bottom (novo)
│  Canal Oficial · 1,2 mil visu… │
│  ────────●────────────────     │  ← Progresso
└────────────────────────────────┘
```

---

## 2. Propósito

### Por que essa funcionalidade existe

Com a adoção do **uniform-aspect mode** (commit `e4817ca`), o footer textual de cada card foi removido para deixar o feed visualmente uniforme. O efeito colateral foi um problema de **contexto**: o usuário via vídeos rolando em mosaico, mas perdia rapidamente a referência de _quem postou_, _o que é aquilo_ e _quando saiu_. A descoberta visual ganhou densidade, mas a descoberta semântica enfraqueceu.

Por outro lado, o contador `0:42 / 1:30` que vivia no bottom era uma informação **redundante**: a mesma noção de progresso já é comunicada pela barra (`pcps__progress`) e shorts são, por definição, vídeos curtos — o tempo absoluto importa pouco no momento da descoberta.

### Qual problema resolve

> _"Como recuperar a identidade do conteúdo (título, canal, frescor) dentro do card, sem voltar a engordar o feed com um footer fixo?"_

A solução é **mover essas informações para dentro do overlay** que já só aparece em interação. O card em repouso continua limpo (foco total no vídeo); ao passar o mouse ou tocar, o usuário vê tudo o que precisa para decidir clicar.

### Qual necessidade do usuário atende

- **Reconhecimento imediato do criador** — o nome do canal aparece sem exigir clique para entrar no detalhe.
- **Sinal de relevância** — número de visualizações funciona como prova social ("vale assistir").
- **Sinal de frescor** — tempo relativo ("há 2 d", "há 3 sem") indica se o conteúdo é recente ou perene.
- **Limpeza visual em repouso** — quando o overlay some, o feed volta a ser puro mosaico.

---

## 3. Objetivo

### O que se espera alcançar

1. **Resgatar a camada semântica** perdida com a remoção do footer no modo grade densa.
2. **Eliminar redundância** — o tempo decorrido em texto era ruído; a barra já transmite o progresso.
3. **Manter o card "limpo em repouso"** — toda a informação textual vive no overlay, que só aparece sob demanda.
4. **Preservar acessibilidade** — texto sobre vídeo continua legível graças ao gradiente do overlay e ao `text-shadow` aplicado.

### Benefícios diretos para o usuário

| Antes | Depois |
|---|---|
| `0:42 / 1:30` (tempo numérico) | Título do vídeo (até 2 linhas) |
| Sem nome do canal no card grid | Canal oficial visível no overlay |
| Sem indicador de popularidade | Visualizações formatadas (1,2 mil / 3,4 mi / 1 bi) |
| Sem indicador de frescor | Tempo relativo em pt-BR ("há 2 d") |
| Decisão de clicar exigia abrir o detalhe | Decisão de clicar acontece no próprio card |

### Benefícios para o negócio / plataforma

- **Maior CTR esperado** — a tríade *título + canal + views* é o padrão consolidado do mercado (YouTube, TikTok) por aumentar a taxa de clique.
- **Visibilidade para criadores** — o nome oficial aparece em todo card do feed, reforçando branding sem precisar de identificadores visuais extras.
- **Sinal de qualidade do catálogo** — exibir contagem de visualizações educa o usuário sobre o que está performando, alimentando o ciclo de descoberta.
- **Prepara terreno para experimentos** — métricas como hover-to-click ratio podem ser medidas com instrumentação no overlay.

### Indicadores que validam a feature

- **CTR no card** — comparativo antes/depois, segmentado por desktop / mobile.
- **Tempo até o primeiro clique** — proxy para "o overlay deu informação suficiente".
- **Taxa de hover sustentado** (≥ 1s) — proxy para "usuário leu título/canal".
- **% de cards com título preenchido** — qualidade de catálogo (cards sem título caem em fallback).

---

## 4. Especificação do conteúdo

### 4.1 Título
- **Fonte:** `post.media.title`
- **Renderização:** só aparece se houver título (clausula `@if`)
- **Limite visual:** clamp em 2 linhas via `-webkit-line-clamp`, com ellipsis
- **Tipografia:** `var(--text-2xs)`, `font-weight-medium`, cor `rgba(255,255,255,0.85)`

### 4.2 Linha de meta
Formato: `Canal · N visualizações · há T`

| Elemento | Fonte | Formatação |
|---|---|---|
| Canal | `post.channel.profileNameOfficial` | Truncado a 60% da largura, sem quebra |
| Visualizações | `post.views` | `formatViews()` → `< 1k` literal · `1.5 mil` · `3.4 mi` · `1 bi` |
| Tempo relativo | `post.timestamp` | `timeAgo()` em pt-BR: `agora` · `há N min` · `há N h` · `há N d` · `há N sem` · `há N meses` · `há N anos` |
| Separador | — | bullet `•` com `opacity: 0.65` |

### 4.3 Barra de progresso
Inalterada — mantém:
- Track de 3px (5px no hover)
- Fill em `var(--pin-red)`
- Thumb circular (13px) revelado no hover
- Tooltip com tempo formatado durante scrubbing

---

## 5. Princípios não-negociáveis

1. **Aparece com o overlay, some com o overlay.** Título e meta seguem o mesmo ciclo `controlsVisible` dos demais controles — desaparecem após 5s de inatividade durante reprodução.
2. **Sem redundância de tempo numérico.** A barra é a única fonte visual de progresso; o contador `m:ss / m:ss` foi descartado em definitivo.
3. **Texto sempre legível sobre o vídeo.** `text-shadow` + gradiente inferior do overlay garantem contraste mínimo, independentemente da cor do frame.
4. **Sem dependência de novos dados.** Toda a informação já vinha no contrato `Post` — nenhuma alteração de API, DTO ou map.
5. **Acessibilidade preservada.** Separadores `•` marcados como `aria-hidden`; controles de progresso continuam expostos como `role="slider"` com `aria-valuenow`.

---

## 6. Mudanças aplicadas

### Template
- [pin-card-player-short.component.html](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.html) — bloco `pcps__time` removido; inseridos `pcps__title` e `pcps__meta` antes da `pcps__progress`.

### Lógica
- [pin-card-player-short.component.ts](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.ts) — novos helpers:
  - `formatViews(value: number): string` — abreviação numérica em pt-BR (`mil`, `mi`, `bi`)
  - `timeAgo(dateStr: string): string` — tempo relativo em pt-BR (`agora` → `há N anos`)

### Estilo
- [pin-card-player-short.component.scss](../../src/app/shared/components/pin-card-player-short/pin-card-player-short.component.scss) — substituído `.pcps__time` / `.pcps__time-sep` por `.pcps__title`, `.pcps__meta`, `.pcps__meta-channel`, `.pcps__meta-sep`. Cor base unificada em `rgba(255,255,255,0.85)` para coerência visual entre título e meta.

---

## 7. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Títulos longos quebrarem o layout | Clamp em 2 linhas com ellipsis |
| Nome do canal muito comprido empurrar a meta | `max-width: 60%` + `text-overflow: ellipsis` |
| Texto ilegível sobre frames muito claros | `text-shadow` + gradiente do overlay |
| Posts sem `title` ou sem `views` | `@if` no título; `formatViews` retorna `0` quando ausente |
| Timestamp inválido | `timeAgo` retorna string vazia se `diff` não for finito |

---

## 8. Próximos passos sugeridos

- **Avatar do canal** — adicionar miniatura circular antes do nome para reforçar reconhecimento visual.
- **Selo verified** — recuperar o ícone `verified` (presente no antigo footer) ao lado do nome quando `channel.verified === true`.
- **Internacionalização** — extrair sufixos (`mil`, `mi`, `bi`, `há … min/h/d/sem/meses/anos`) para um pipe i18n quando a plataforma for multilíngue.
- **A/B test** — comparar CTR do card com e sem a meta line para validar o ganho hipotetizado.
