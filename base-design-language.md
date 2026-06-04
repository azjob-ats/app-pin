# Base Web Design System — Clone Angular: Cobertura & Verificação

> Documento de **controle e continuidade** do clone fiel do UX/UI do Uber Base Web em
> Angular. É a fonte única de verdade do que **já foi verificado** e do que **falta**.
> Ao retomar: leia este arquivo, escolha o próximo item `⚠️` e siga o **Processo de
> verificação** (seção 4). Atualize o status + o log ao final.
>
> **Fonte de verdade da lista:** o `meta.json` do **original** (Ladle em :61000) —
> **72 componentes / 429 stories**. A lista abaixo espelha exatamente o original; nomes
> que só existem no clone foram removidos do escopo (seção 8.1).

---

## 1. Objetivo

Reproduzir, em Angular, **pixel-a-pixel e em comportamento**, cada componente do Base Web
(`baseweb.design`), mantendo **arquitetura Angular independente** (signals, standalone,
OnPush) — clonamos só a **camada visual/experiência**, não a arquitetura React.

- Clone Angular: `src/app/domain/base-design-language` (rota `/bw`; Ladle em `/bw/ladle`).
- Cada página de componente segue o padrão **"Yard"** do baseweb.design (preview vivo +
  Props/Style Overrides/Theme).

**Definição de "coberto":** não basta existir a pasta/componente, nem a story principal.
Um componente só é `✅ Verificado` quando **todas as suas stories do original** foram
clonadas e **comparadas ao original rodando**, com as divergências corrigidas e os
**critérios de aceite** (seção 6) atendidos.

> **Estado atual:** apenas **`Pagination` está coberto**. Todos os demais estão
> `⚠️ Divergente` (faltam stories e/ou verificação contra o original).

---

## 2. Ambiente & fontes de verdade

| Fonte | Onde | Uso |
|---|---|---|
| **Original ao vivo** | `http://localhost:61000/?story=<id>&mode=preview` | Ladle React, renderiza no **main frame** ~1.5s após `networkidle`. Lista completa em `http://localhost:61000/meta.json`. |
| **Clone ao vivo** | `http://localhost:4200/bw/ladle?story=<id>&mode=preview` | Nosso clone Angular. |
| **Source React** | `base-design-language/baseweb/src/<comp>/` | `styled-components.ts`, `constants.ts`, `__tests__/*.scenario.tsx`. |
| **Render estático** | `static/ladle/…` (scrapes em `/mnt/c/Users/azjob/Downloads/static/ladle`) | CSS computado exato quando os servers estão fora do ar. |

**Pré‑requisitos:** os dois servers no ar (:61000 e :4200) e o **Chromium** do Playwright
(`~/.cache/ms-playwright/chromium-1223`; pacote `playwright` resolve em `app-pin/node_modules`
— rodar scripts a partir da raiz `app-pin/`).

---

## 3. Tipos de verificação

1. **Visual diff** — screenshot full-page dos dois lados (viewport `1280×800`, `deviceScaleFactor: 2`).
2. **CSS computado** — `getComputedStyle` dos elementos‑chave, batidos número a número.
3. **Estados & interação** — hover, focus(-visible), active, disabled, open/expanded, selected,
   loading, error. **Sempre testar estados abertos** (dropdown/menu/overlay).
4. **Estrutura/conteúdo da story** — clonar **todas as stories** do componente no original
   (mesmas variantes/qtde/props do `.scenario.tsx`).
5. **Acessibilidade** — AXE limpo, foco visível, contraste AA, ARIA correto.

---

## 4. Processo de verificação (passo a passo)

Para cada componente `⚠️`:

1. **Listar as stories do original**: `curl -s :61000/meta.json` e filtrar `<comp>--*`
   (ou consultar a seção 9 deste doc).
2. **Ler a verdade-base**: `baseweb/src/<comp>/` (styled-components, constants, scenarios).
3. **Clonar as stories faltantes** no clone (registry + scenarios Angular).
4. **Capturar os dois lados** com Chromium (script da seção 5): screenshot + CSS computado.
5. **Listar divergências**: (a) stories faltantes, (b) dimensões/spacing, (c) cores/tipografia/bordas, (d) estados.
6. **Corrigir** no clone (componente/scss/tokens). Token é global — checar regressão.
7. **Re-medir** até bater; testar estados (incl. abertos).
8. **Critérios de aceite** (seção 6) — todos verdes.
9. **Atualizar este doc**: marcar stories `[x]`, status `⚠️ → ✅`, preencher a ficha (seção 10).
10. **Build + commit** por componente (emoji-conventional), uma fase por vez.

---

## 5. Script de comparação (Chromium / Playwright)

Salvar como `_bw_compare.mjs` na raiz `app-pin/` e rodar `node _bw_compare.mjs <story-id> "<seletor>"`.
Gera screenshots em `/tmp/bw-compare/{original,clone}.png` e imprime o CSS computado.

```js
import { chromium } from 'playwright';
const story = process.argv[2] || 'pagination--pagination';
const sel = process.argv[3] || '[data-baseweb]';
const urls = {
  original: `http://localhost:61000/?story=${story}&mode=preview`,
  clone:    `http://localhost:4200/bw/ladle?story=${story}&mode=preview`,
};
const props = ['font-family','font-size','font-weight','line-height','color','letter-spacing',
  'padding','margin','background-color','border','border-radius','box-shadow','width','height',
  'display','align-items','gap','z-index'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:1280, height:800 }, deviceScaleFactor:2 });
for (const [name, url] of Object.entries(urls)) {
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil:'networkidle', timeout:30000 });
  await p.waitForTimeout(1800);
  await p.screenshot({ path:`/tmp/bw-compare/${name}.png`, fullPage:true });
  const data = await p.mainFrame().evaluate(([sel, props]) => {
    const r = el => { const b=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      const o={ _box:`${Math.round(b.width)}x${Math.round(b.height)}` };
      for (const k of props) o[k]=cs.getPropertyValue(k); return o; };
    return [...document.querySelectorAll(sel)].slice(0,8).map(r);
  }, [sel, props]);
  console.log(`\n### ${name} (${url})`); console.dir(data, { depth:null });
}
await browser.close();
```

> Para abrir overlays/menus antes da captura: `await p.locator(...).click()`.
> Os `_bw_*.mjs` são temporários — **remover** após usar (não comitar).

---

## 6. Critérios de aceite (Definition of Done — vale para TODOS)

- [ ] **Stories completas**: clonadas **todas** as stories do componente no original.
- [ ] **Story fiel**: cada story renderiza as mesmas variantes/qtde/props do `.scenario.tsx`.
- [ ] **Dimensões**: box/altura/padding/margin batem (tolerância ≤ 2px justificável).
- [ ] **Tipografia**: família, tamanho, peso, line-height e cor idênticos.
- [ ] **Cores & bordas**: bg, border, border-radius, box-shadow idênticos (incl. transparências).
- [ ] **Estados**: hover, focus-visible, active, disabled, selected, open, loading, error.
- [ ] **Overlays/menus**: empilhamento (z-index), fundo sólido, sombra, scrim.
- [ ] **A11y**: AXE limpo, foco visível, contraste AA, ARIA/roles corretos.
- [ ] **Build** de desenvolvimento passa sem erros.
- [ ] **Sem regressão** em tokens/Select/Button etc. usados por outros componentes.

---

## 7. Legenda de status

| Símbolo | Significado |
|---|---|
| ✅ | **Verificado** — todas as stories clonadas, comparadas ao original, DoD atendido. |
| ⚠️ | **Divergente** — faltam stories e/ou verificação contra o original. |
| — | **Infra / sem story visual** — primitivo utilitário (helper/layer), baixa prioridade. |

A coluna **Stories (clone/orig)** mostra a cobertura de stories: ex. `Avatar 1/5` = clone
tem 1 das 5 stories do original.

---

## 8. Cobertura por componente

| # | Componente | Grupo | Stories (clone/orig) | Status | Foco de verificação (específico) |
|---|---|---|:--:|:--:|---|
| 1 | Accordion | `accordion` | 6/6 | ⚠️ | header/expand-collapse, rotação do chevron, divisória, animação de altura |
| 2 | App nav bar | `app-nav-bar` | 1/7 | ⚠️ | logo, itens primários/secundários, user menu, busca, colapso responsivo |
| 3 | Aspect ratio box | `aspect-ratio-box` | 1/1 | ⚠️ | proporção mantida, conteúdo preenchendo, overflow |
| 4 | Avatar | `avatar` | 1/5 | ⚠️ | tamanhos, imagem vs iniciais, fallback (error/no-src), update-image |
| 5 | Badge | `badge` | 3/4 | ⚠️ | kinds/cores, posicionamento, hint-dot, notification-circle, inline |
| 6 | Banner | `banner` | 1/5 | ⚠️ | kinds, ícone, ação (below), artwork, nested, dismiss |
| 7 | Block | `block` | 1/1 | ⚠️ | utilitário de estilo (spacing/color/font props) — mapeamento de props |
| 8 | Breadcrumbs | `breadcrumbs` | 1/4 | ⚠️ | separador, item atual vs link, truncamento, hover |
| 9 | Button | `button` | 15/15 | ⚠️ | kinds×sizes×shapes, estados, loading (mantém fill), enhancers |
| 10 | Button group | `button-group` | 0/12 | ⚠️ | single/multiple, modo radio/checkbox, bordas conjuntas, pill, wrap, disabled |
| 11 | Button timed | `button-timed` | 1/1 | ⚠️ | progresso/contagem, fill animado, estado ao completar |
| 12 | Card | `card` | 1/5 | ⚠️ | thumbnail/imagem, título/corpo, link, sombra/borda, header-level |
| 13 | Checkbox | `checkbox` | 6/8 | ⚠️ | checked/unchecked/indeterminate, label, focus, disabled, error, placement |
| 14 | Checkbox v2 | `checkbox-v2` | 1/7 | ⚠️ | idem v1 + diferenças da v2 (auto-focus, placement, states, unlabeled) |
| 15 | Combobox | `combobox` | 1/11 | ⚠️ | input+lista, filtro/autocomplete, teclado, sizes, form-control |
| 16 | Data table | `data-table` | 1/33 | ⚠️ | colunas/sort, seleção, sticky, filtros, densidade, batch-actions |
| 17 | Datepicker | `datepicker` | 1/29 | ⚠️ | calendário, range, navegação, dia selecionado/hoje/disabled, popover |
| 18 | Divider | `divider` | 1/1 | ⚠️ | espessura, cor, margens, orientação |
| 19 | Dnd list | `dnd-list` | 1/1 | ⚠️ | handle, item em drag (sombra/opacidade), drop indicator, reorder |
| 20 | Drawer | `drawer` | 1/4 | ⚠️ | anchor, scrim, animação, close, hide-backdrop, render-all |
| 21 | File uploader | `file-uploader` | 1/7 | ⚠️ | dropzone, hover/dragover, progresso, restrições, preview, erro |
| 22 | File uploader basic | `file-uploader-basic` | 0/7 | ⚠️ | pre/post-drop, progress-bar, spinner, disabled, error |
| 23 | Flex grid | `flex-grid` | 1/6 | ⚠️ | gap, wrap, alinhamentos, responsivo, frações de pixel |
| 24 | Form control | `form-control` | 1/3 | ⚠️ | label, caption, erro/positivo, espaçamento, required |
| 25 | Header navigation | `header-navigation` | 1/1 | ⚠️ | alinhamento de itens, borda inferior, ações à direita |
| 26 | Heading | `heading` | 1/1 | ⚠️ | níveis/escala, peso, line-height, cor |
| 27 | Helper | `helper` | 0/3 | — | infra — helpers de posição/steps (sem visual próprio) |
| 28 | Helpers | `helpers` | 0/1 | — | infra — override/avoid-remount (sem visual) |
| 29 | Icon | `icon` | 0/3 | ⚠️ | grid 24px, baseline, tamanho/cor herdada, em botões |
| 30 | Input | `input` | 1/15 | ⚠️ | sizes, estados, before/after, clearable, mask, password, borda 2px |
| 31 | Layer | `layer` | 0/2 | — | infra — portal/z-index/key-handlers (validar via Modal/Popover/Select) |
| 32 | Layout grid | `layout-grid` | 1/11 | ⚠️ | colunas, gutter, margens, breakpoints, order/skip/hide |
| 33 | Link | `link` | 1/1 | ⚠️ | cor, underline/hover, focus, dentro de texto |
| 34 | List | `list` | 0/7 | ⚠️ | item (artwork/label/secundário/menu), divisória, alturas, rtl |
| 35 | Map marker | `map-marker` | 0/9 | ⚠️ | fixed/floating/route/puck, pin shape, label, ponta, sombra |
| 36 | Menu | `menu` | 1/11 | ⚠️ | item hover/selected, divisórias, ícones, grouped, nested, virtualized |
| 37 | Message card | `message-card` | 1/4 | ⚠️ | imagem, título/parágrafo, botão, layout, hover |
| 38 | Mobile header | `mobile-header` | 0/2 | ⚠️ | título centralizado, ações esq/dir, altura, safe-area |
| 39 | Modal | `modal` | 1/3 | ⚠️ | scrim, animação, header/body/footer, close, foco preso, scroll lock |
| 40 | Notification | `notification` | 1/1 | ⚠️ | kinds, ícone, cor de fundo, close, largura |
| 41 | Pagination | `pagination` | 1/1 | ✅ | 4 sizes, select tertiary, dropdown z-index — VERIFICADO (ver ficha) |
| 42 | Payment card | `payment-card` | 1/2 | ⚠️ | formatação número/bandeira, layout, foco/erro |
| 43 | Phone input | `phone-input` | 1/7 | ⚠️ | seletor país (flag+code), dropdown, máscara, lite, estados |
| 44 | Pin code | `pin-code` | 1/5 | ⚠️ | células, foco/caret, preenchido/erro, sizes, mask |
| 45 | Popover | `popover` | 1/15 | ⚠️ | seta/placement, offset, sombra, animação, z-index, dismiss, scroll |
| 46 | Progress bar | `progress-bar` | 0/6 | ⚠️ | trilho/preenchimento, indeterminado, rounded, intent, negative |
| 47 | Progress steps | `progress-steps` | 1/6 | ⚠️ | nó atual/concluído/futuro, conector, numeração/ícone, vertical |
| 48 | Radio | `radio` | 1/3 | ⚠️ | selected/unselected, label, focus, disabled, error, grupo |
| 49 | Radio v2 | `radio-v2` | 1/5 | ⚠️ | idem + align, label-placement, interactive-label, states |
| 50 | Rating | `rating` | 0/3 | ⚠️ | star/emoticon, hover preview, tamanho, cor |
| 51 | Select | `select` | 1/30 | ⚠️ | control (sizes/estados), menu (z-index/scrim/sombra), search/multi/creatable, open |
| 52 | Side navigation | `side-navigation` | 1/2 | ⚠️ | item ativo (barra/realce), níveis aninhados, ícones (nav/nav-long) |
| 53 | Skeleton | `skeleton` | 1/3 | ⚠️ | shimmer/animação, raio, dimensões, cor base |
| 54 | Slider | `slider` | 1/9 | ⚠️ | trilho/preenchimento, thumb, foco, marks, range, label, rtl |
| 55 | Sliding button | `sliding-button` | 0/3 | ⚠️ | arraste/limiar, fill, confirmado, reset |
| 56 | Snackbar | `snackbar` | 0/6 | ⚠️ | posição/placement, ação, ícone, provider, auto-dismiss |
| 57 | Spinner | `spinner` | 1/1 | ⚠️ | tamanhos, espessura, cor/track, rotação |
| 58 | Stepper | `stepper` | 1/1 | ⚠️ | passos, conector, atual/concluído, orientação |
| 59 | Switch | `switch` | 1/7 | ⚠️ | on/off, thumb, transição, focus, disabled, size, placement |
| 60 | Table | `table` | 0/8 | ⚠️ | header, linhas, borda/zebra, sortable, filter, scroll, pagination |
| 61 | Table grid | `table-grid` | 1/4 | ⚠️ | colunas redimensionáveis, sticky, scroll, seleção |
| 62 | Table semantic | `table-semantic` | 1/9 | ⚠️ | markup <table> puro, estilos base, caption |
| 63 | Tabs | `tabs` | 1/3 | ⚠️ | aba ativa (indicador/animação), fill/intrinsic, controlled, one-child |
| 64 | Tag | `tag` | 1/5 | ⚠️ | kinds×variants, closeable, size, start-enhancer, long-text |
| 65 | Template component | `template-component` | 0/1 | — | infra — scaffold interno (sem visual) |
| 66 | Textarea | `textarea` | 1/2 | ⚠️ | sizes, estados, resize, char count, borda 2px |
| 67 | Timepicker | `timepicker` | 0/2 | ⚠️ | lista de horários, step, seleção, formato 12/24h, scroll |
| 68 | Timezonepicker | `timezonepicker` | 1/3 | ⚠️ | busca, agrupamento, offset/label, abbreviations, additional |
| 69 | Toast | `toast` | 1/4 | ⚠️ | kinds, posição/stack, ícone, close, toaster, auto-dismiss |
| 70 | Tooltip | `tooltip` | 1/4 | ⚠️ | seta/placement, delay, fundo escuro, max-width, interactive |
| 71 | Tree view | `tree-view` | 1/5 | ⚠️ | expand/collapse, indentação, ícones, seleção, single-expanded |
| 72 | Typography | `typography` | 0/6 | ⚠️ | escala (display/heading/label/paragraph/mono), 2 famílias, pesos |

**Placar:** `✅ 1` · `⚠️ 67` · `— (infra) 4` — **72 componentes**, **429 stories**,
clone cobre **81** (~19%).

### 8.1. Divergências de nomenclatura & escopo (corrigir)

**Renomeações no clone (devem usar o nome do original):**
- `side-nav` → **`side-navigation`** (orig: `nav`, `nav-long`)
- `timezone-picker` → **`timezonepicker`**
- `hint-dot`, `notification-circle` → stories de **`badge`** (`badge--hint-dot`, `badge--notification-circle`)
- `fixed-marker`, `floating-marker`, `floating-route-marker`, `location-puck` → stories de **`map-marker`** (9 stories)

**Grupos só no clone (não existem neste `meta.json` do original — fora do escopo / remover):**
`bottom-navigation`, `button-dock`, `dialog`, `empty-state`, `page-control`,
`segmented-control`, `sheet`, `system-banner`, `tabs-motion`, `tag-group`, `tile`.

> Obs.: alguns podem ser componentes mais novos do Base Web. Se forem reintroduzidos, só
> entram no escopo quando existirem no `meta.json` do original usado como referência.

---

## 9. Stories por componente (checklist granular)

`[x]` = existe no clone · `[ ]` = falta. `_(clone: ...)` = existe sob nome divergente.

#### 1. Accordion — `accordion` — 6/6 ⚠️
  - [x] `accordion--accordion`
  - [x] `accordion--controlled`
  - [x] `accordion--disabled`
  - [x] `accordion--expanded`
  - [x] `accordion--panel-override`
  - [x] `accordion--stateless-accordion`

#### 2. App nav bar — `app-nav-bar` — 1/7 ⚠️
  - [x] `app-nav-bar--app-nav-bar`
  - [ ] `app-nav-bar--get-unique-identifier`
  - [ ] `app-nav-bar--icon-overrides`
  - [ ] `app-nav-bar--is-main-item-active`
  - [ ] `app-nav-bar--map-item-to-node`
  - [ ] `app-nav-bar--overrides`
  - [ ] `app-nav-bar--title-node`

#### 3. Aspect ratio box — `aspect-ratio-box` — 1/1 ⚠️
  - [x] `aspect-ratio-box--aspect-ratio-box`

#### 4. Avatar — `avatar` — 1/5 ⚠️
  - [x] `avatar--avatar`
  - [ ] `avatar--custom-initials`
  - [ ] `avatar--error`
  - [ ] `avatar--no-src`
  - [ ] `avatar--update-image`

#### 5. Badge — `badge` — 3/4 ⚠️
  - [x] `badge--badge`
  - [x] `badge--hint-dot` _(clone: `hint-dot--hint-dot`)_
  - [ ] `badge--inline-badge`
  - [x] `badge--notification-circle` _(clone: `notification-circle--notification-circle`)_

#### 6. Banner — `banner` — 1/5 ⚠️
  - [x] `banner--banner`
  - [ ] `banner--banner-action-below`
  - [ ] `banner--banner-artwork`
  - [ ] `banner--banner-nested`
  - [ ] `banner--banner-overrides`

#### 7. Block — `block` — 1/1 ⚠️
  - [x] `block--block`

#### 8. Breadcrumbs — `breadcrumbs` — 1/4 ⚠️
  - [x] `breadcrumbs--breadcrumbs`
  - [ ] `breadcrumbs--icon-overrides`
  - [ ] `breadcrumbs--pseudo`
  - [ ] `breadcrumbs--trailing`

#### 9. Button — `button` — 15/15 ⚠️
  - [x] `button--a11y`
  - [x] `button--background-safe`
  - [x] `button--button`
  - [x] `button--circle`
  - [x] `button--colors`
  - [x] `button--enhancers`
  - [x] `button--enhancers-compact`
  - [x] `button--enhancers-loading`
  - [x] `button--functional-children`
  - [x] `button--link`
  - [x] `button--min-hit-area`
  - [x] `button--shapes`
  - [x] `button--sizes`
  - [x] `button--sizes-loading`
  - [x] `button--width-types`

#### 10. Button group — `button-group` — 0/12 ⚠️
  - [ ] `button-group--a11y`
  - [ ] `button-group--checkbox`
  - [ ] `button-group--disabled`
  - [ ] `button-group--kinds`
  - [ ] `button-group--overrides`
  - [ ] `button-group--padding`
  - [ ] `button-group--pill`
  - [ ] `button-group--radio`
  - [ ] `button-group--selected`
  - [ ] `button-group--selected-disabled`
  - [ ] `button-group--sizes`
  - [ ] `button-group--wrap`

#### 11. Button timed — `button-timed` — 1/1 ⚠️
  - [x] `button-timed--button-timed`

#### 12. Card — `card` — 1/5 ⚠️
  - [x] `card--card`
  - [ ] `card--header-level`
  - [ ] `card--image-link`
  - [ ] `card--image-object`
  - [ ] `card--text-only`

#### 13. Checkbox — `checkbox` — 6/8 ⚠️
  - [x] `checkbox--checkbox`
  - [x] `checkbox--indeterminate`
  - [x] `checkbox--placement`
  - [ ] `checkbox--react-hook-form`
  - [ ] `checkbox--select`
  - [x] `checkbox--states`
  - [x] `checkbox--toggle`
  - [x] `checkbox--unlabeled`

#### 14. Checkbox v2 — `checkbox-v2` — 1/7 ⚠️
  - [ ] `checkbox-v2--auto-focus`
  - [x] `checkbox-v2--checkbox`
  - [ ] `checkbox-v2--indeterminate`
  - [ ] `checkbox-v2--placement`
  - [ ] `checkbox-v2--react-hook-form`
  - [ ] `checkbox-v2--states`
  - [ ] `checkbox-v2--unlabeled`

#### 15. Combobox — `combobox` — 1/11 ⚠️
  - [ ] `combobox--async`
  - [ ] `combobox--autocomplete-false`
  - [x] `combobox--combobox`
  - [ ] `combobox--disabled`
  - [ ] `combobox--form`
  - [ ] `combobox--form-control`
  - [ ] `combobox--inline-text-search`
  - [ ] `combobox--overrides`
  - [ ] `combobox--replacement-node`
  - [ ] `combobox--search`
  - [ ] `combobox--sizes`

#### 16. Data table — `data-table` — 1/33 ⚠️
  - [ ] `data-table--add-remove-columns`
  - [ ] `data-table--batch-action`
  - [ ] `data-table--categorical-column`
  - [ ] `data-table--cell-indices`
  - [ ] `data-table--collection-of-objects`
  - [ ] `data-table--column-width-resize`
  - [ ] `data-table--columns`
  - [ ] `data-table--columns-not-sortable`
  - [x] `data-table--data-table`
  - [ ] `data-table--datetime-column`
  - [ ] `data-table--empty`
  - [ ] `data-table--extracted-filters`
  - [ ] `data-table--extracted-highlight`
  - [ ] `data-table--full-window`
  - [ ] `data-table--get-rows`
  - [ ] `data-table--imperative-clear-selection`
  - [ ] `data-table--included-rows-change`
  - [ ] `data-table--initial-filters`
  - [ ] `data-table--initial-selected-rows`
  - [ ] `data-table--initial-sort`
  - [ ] `data-table--large-data`
  - [ ] `data-table--loading`
  - [ ] `data-table--not-filterable`
  - [ ] `data-table--not-searchable`
  - [ ] `data-table--numerical-column`
  - [ ] `data-table--resizable-column-widths`
  - [ ] `data-table--row-actions`
  - [ ] `data-table--row-actions-button`
  - [ ] `data-table--row-actions-dynamic`
  - [ ] `data-table--row-height`
  - [ ] `data-table--stateful-callback`
  - [ ] `data-table--test-rtl`
  - [ ] `data-table--text-search`

#### 17. Datepicker — `datepicker` — 1/29 ⚠️
  - [ ] `datepicker--calendar`
  - [ ] `datepicker--calendar-icon-overrides`
  - [ ] `datepicker--calendar-multi-month`
  - [ ] `datepicker--calendar-time-select`
  - [x] `datepicker--datepicker`
  - [ ] `datepicker--datepicker-time`
  - [ ] `datepicker--i18n-chinese`
  - [ ] `datepicker--int`
  - [ ] `datepicker--int-range`
  - [ ] `datepicker--mask`
  - [ ] `datepicker--on-change-flow`
  - [ ] `datepicker--range`
  - [ ] `datepicker--range-exclude-dates`
  - [ ] `datepicker--range-highlight`
  - [ ] `datepicker--range-locked-behavior`
  - [ ] `datepicker--range-multi-month`
  - [ ] `datepicker--range-null-start-date`
  - [ ] `datepicker--range-separate-inputs`
  - [ ] `datepicker--stateful`
  - [ ] `datepicker--stateful-calendar`
  - [ ] `datepicker--stateful-calendar-overrides`
  - [ ] `datepicker--stateful-color-states`
  - [ ] `datepicker--stateful-composed-range`
  - [ ] `datepicker--stateful-composed-range-min-max`
  - [ ] `datepicker--stateful-composed-single`
  - [ ] `datepicker--stateful-min-max-date`
  - [ ] `datepicker--stateful-quick-select`
  - [ ] `datepicker--stateful-range`
  - [ ] `datepicker--stateful-range-quick-select`

#### 18. Divider — `divider` — 1/1 ⚠️
  - [x] `divider--divider`

#### 19. Dnd list — `dnd-list` — 1/1 ⚠️
  - [x] `dnd-list--dnd-list`

#### 20. Drawer — `drawer` — 1/4 ⚠️
  - [x] `drawer--drawer`
  - [ ] `drawer--hide-backdrop`
  - [ ] `drawer--render-all`
  - [ ] `drawer--select`

#### 21. File uploader — `file-uploader` — 1/7 ⚠️
  - [x] `file-uploader--file-uploader`
  - [ ] `file-uploader--item-preview`
  - [ ] `file-uploader--label-hint`
  - [ ] `file-uploader--long-loading`
  - [ ] `file-uploader--long-loading-multiple-files`
  - [ ] `file-uploader--overrides`
  - [ ] `file-uploader--upload-restrictions`

#### 22. File uploader basic — `file-uploader-basic` — 0/7 ⚠️
  - [ ] `file-uploader-basic--disabled`
  - [ ] `file-uploader-basic--error`
  - [ ] `file-uploader-basic--file-uploader`
  - [ ] `file-uploader-basic--post-drop`
  - [ ] `file-uploader-basic--pre-drop`
  - [ ] `file-uploader-basic--progress-bar`
  - [ ] `file-uploader-basic--spinner`

#### 23. Flex grid — `flex-grid` — 1/6 ⚠️
  - [x] `flex-grid--flex-grid`
  - [ ] `flex-grid--fractional-pixel`
  - [ ] `flex-grid--missing`
  - [ ] `flex-grid--responsive`
  - [ ] `flex-grid--unequal-narrow`
  - [ ] `flex-grid--unequal-wide`

#### 24. Form control — `form-control` — 1/3 ⚠️
  - [x] `form-control--form-control`
  - [ ] `form-control--id`
  - [ ] `form-control--with-counter`

#### 25. Header navigation — `header-navigation` — 1/1 ⚠️
  - [x] `header-navigation--header-navigation`

#### 26. Heading — `heading` — 1/1 ⚠️
  - [x] `heading--heading`

#### 27. Helper — `helper` — 0/3 —
  - [ ] `helper--position`
  - [ ] `helper--steps`
  - [ ] `helper--with-steps`

#### 28. Helpers — `helpers` — 0/1 —
  - [ ] `helpers--override-avoid-remount`

#### 29. Icon — `icon` — 0/3 ⚠️
  - [ ] `icon--attributes`
  - [ ] `icon--buttons`
  - [ ] `icon--overrides`

#### 30. Input — `input` — 1/15 ⚠️
  - [ ] `input--before-after`
  - [ ] `input--clearable`
  - [ ] `input--clearable-icon-overrides`
  - [ ] `input--clearable-noescape`
  - [ ] `input--disabled-matches-select`
  - [ ] `input--form-control-states`
  - [x] `input--input`
  - [ ] `input--mask`
  - [ ] `input--number`
  - [ ] `input--password`
  - [ ] `input--password-icon-overrides`
  - [ ] `input--selector`
  - [ ] `input--sizes`
  - [ ] `input--states`
  - [ ] `input--with-button`

#### 31. Layer — `layer` — 0/2 —
  - [ ] `layer--key-handlers`
  - [ ] `layer--z-index`

#### 32. Layout grid — `layout-grid` — 1/11 ⚠️
  - [ ] `layout-grid--align`
  - [ ] `layout-grid--compact`
  - [ ] `layout-grid--custom`
  - [ ] `layout-grid--hide`
  - [x] `layout-grid--layout-grid`
  - [ ] `layout-grid--order`
  - [ ] `layout-grid--overrides`
  - [ ] `layout-grid--sizing`
  - [ ] `layout-grid--skip`
  - [ ] `layout-grid--unit`
  - [ ] `layout-grid--wrap`

#### 33. Link — `link` — 1/1 ⚠️
  - [x] `link--link`

#### 34. List — `list` — 0/7 ⚠️
  - [ ] `list--heading`
  - [ ] `list--item`
  - [ ] `list--item-artwork-min-width`
  - [ ] `list--item-artwork-sizes`
  - [ ] `list--item-menu-adapter`
  - [ ] `list--item-overrides`
  - [ ] `list--item-rtl`

#### 35. Map marker — `map-marker` — 0/9 ⚠️
  - [ ] `map-marker--eats-pickup-marker`
  - [ ] `map-marker--fixed-marker`
  - [ ] `map-marker--fixed-marker-map`
  - [ ] `map-marker--floating-marker`
  - [ ] `map-marker--floating-marker-map`
  - [ ] `map-marker--floating-route-marker`
  - [ ] `map-marker--floating-route-marker-map`
  - [ ] `map-marker--location-puck`
  - [ ] `map-marker--location-puck-map`

#### 36. Menu — `menu` — 1/11 ⚠️
  - [ ] `menu--child`
  - [ ] `menu--child-in-popover`
  - [ ] `menu--child-render-all`
  - [ ] `menu--dividers`
  - [ ] `menu--empty`
  - [ ] `menu--grouped-items`
  - [x] `menu--menu`
  - [ ] `menu--profile-menu`
  - [ ] `menu--propagation`
  - [ ] `menu--stateful`
  - [ ] `menu--virtualized`

#### 37. Message card — `message-card` — 1/4 ⚠️
  - [ ] `message-card--image-positions`
  - [x] `message-card--message-card`
  - [ ] `message-card--sizes`
  - [ ] `message-card--trailing-image`

#### 38. Mobile header — `mobile-header` — 0/2 ⚠️
  - [ ] `mobile-header--fixed`
  - [ ] `mobile-header--floating`

#### 39. Modal — `modal` — 1/3 ⚠️
  - [x] `modal--modal`
  - [ ] `modal--select`
  - [ ] `modal--uncloseable`

#### 40. Notification — `notification` — 1/1 ⚠️
  - [x] `notification--notification`

#### 41. Pagination — `pagination` — 1/1 ✅
  - [x] `pagination--pagination`

#### 42. Payment card — `payment-card` — 1/2 ⚠️
  - [x] `payment-card--payment-card`
  - [ ] `payment-card--stateful`

#### 43. Phone input — `phone-input` — 1/7 ⚠️
  - [ ] `phone-input--country-select-dropdown`
  - [ ] `phone-input--country-select-small-dropdown`
  - [ ] `phone-input--custom-flags`
  - [ ] `phone-input--dropdown`
  - [ ] `phone-input--lite`
  - [ ] `phone-input--overrides`
  - [x] `phone-input--phone-input`

#### 44. Pin code — `pin-code` — 1/5 ⚠️
  - [ ] `pin-code--mask`
  - [ ] `pin-code--overrides`
  - [x] `pin-code--pin-code`
  - [ ] `pin-code--sizes`
  - [ ] `pin-code--states`

#### 45. Popover — `popover` — 1/15 ⚠️
  - [ ] `popover--auto-focus-without-focus-lock`
  - [ ] `popover--click`
  - [ ] `popover--dynamic-trigger-type`
  - [ ] `popover--focus-loop`
  - [ ] `popover--hover`
  - [ ] `popover--large-margin`
  - [x] `popover--popover`
  - [ ] `popover--position`
  - [ ] `popover--prevent-scroll-on-focus`
  - [ ] `popover--progress-bar`
  - [ ] `popover--render-all`
  - [ ] `popover--reposition`
  - [ ] `popover--reposition-with-anchor-update`
  - [ ] `popover--scroll`
  - [ ] `popover--select`

#### 46. Progress bar — `progress-bar` — 0/6 ⚠️
  - [ ] `progress-bar--progressbar`
  - [ ] `progress-bar--progressbar-intent`
  - [ ] `progress-bar--progressbar-negative`
  - [ ] `progress-bar--progressbar-rounded`
  - [ ] `progress-bar--progressbar-rounded-animated`
  - [ ] `progress-bar--progressbar-rounded-overrides`

#### 47. Progress steps — `progress-steps` — 1/6 ⚠️
  - [ ] `progress-steps--is-active`
  - [ ] `progress-steps--number`
  - [ ] `progress-steps--numbered-steps`
  - [ ] `progress-steps--numbered-steps-icon-overrides`
  - [ ] `progress-steps--progress-step-overrides`
  - [x] `progress-steps--progress-steps`

#### 48. Radio — `radio` — 1/3 ⚠️
  - [x] `radio--radio`
  - [ ] `radio--select`
  - [ ] `radio--states`

#### 49. Radio v2 — `radio-v2` — 1/5 ⚠️
  - [ ] `radio-v2--align`
  - [ ] `radio-v2--contains-interactive-label`
  - [ ] `radio-v2--label-placement`
  - [x] `radio-v2--radio`
  - [ ] `radio-v2--states`

#### 50. Rating — `rating` — 0/3 ⚠️
  - [ ] `rating--emoticon`
  - [ ] `rating--size`
  - [ ] `rating--star`

#### 51. Select — `select` — 1/30 ⚠️
  - [ ] `select--async-options`
  - [ ] `select--backspace-behavior`
  - [ ] `select--calls-provided-blur`
  - [ ] `select--click-maintains-focus`
  - [ ] `select--click-triggers-blur`
  - [ ] `select--control-ref-set-dropdown-open`
  - [ ] `select--control-ref-set-input-value`
  - [ ] `select--creatable`
  - [ ] `select--creatable-multi`
  - [ ] `select--disable-href-anchor`
  - [ ] `select--highlight`
  - [ ] `select--icon-overrides`
  - [ ] `select--in-flex-container`
  - [ ] `select--in-modal`
  - [ ] `select--input-ref`
  - [ ] `select--maintains-input-value`
  - [ ] `select--many-options`
  - [ ] `select--open`
  - [ ] `select--option-group`
  - [ ] `select--overridden-icon-container`
  - [ ] `select--overridden-menu`
  - [ ] `select--search-multi`
  - [ ] `select--search-single`
  - [ ] `select--search-single-fontsize`
  - [ ] `select--searchable-form-control`
  - [x] `select--select`
  - [ ] `select--sizes`
  - [ ] `select--sizes-selected-value`
  - [ ] `select--states`
  - [ ] `select--unmount-blur`

#### 52. Side navigation — `side-navigation` — 1/2 ⚠️
  - [x] `side-navigation--nav` _(clone: `side-nav--side-nav`)_
  - [ ] `side-navigation--nav-long`

#### 53. Skeleton — `skeleton` — 1/3 ⚠️
  - [ ] `skeleton--animation`
  - [ ] `skeleton--loading`
  - [x] `skeleton--skeleton`

#### 54. Slider — `slider` — 1/9 ⚠️
  - [ ] `slider--always-show-label`
  - [ ] `slider--custom-label`
  - [ ] `slider--disabled`
  - [ ] `slider--marks`
  - [ ] `slider--range`
  - [ ] `slider--rtl`
  - [ ] `slider--select-dropdown`
  - [x] `slider--slider`
  - [ ] `slider--step`

#### 55. Sliding button — `sliding-button` — 0/3 ⚠️
  - [ ] `sliding-button--default`
  - [ ] `sliding-button--low-threshold`
  - [ ] `sliding-button--states`

#### 56. Snackbar — `snackbar` — 0/6 ⚠️
  - [ ] `snackbar--async`
  - [ ] `snackbar--element`
  - [ ] `snackbar--element-overrides`
  - [ ] `snackbar--placement`
  - [ ] `snackbar--provider`
  - [ ] `snackbar--provider-overrides`

#### 57. Spinner — `spinner` — 1/1 ⚠️
  - [x] `spinner--spinner`

#### 58. Stepper — `stepper` — 1/1 ⚠️
  - [x] `stepper--stepper`

#### 59. Switch — `switch` — 1/7 ⚠️
  - [ ] `switch--auto-focus`
  - [ ] `switch--disabled`
  - [ ] `switch--placement`
  - [ ] `switch--size`
  - [ ] `switch--states`
  - [x] `switch--switch`
  - [ ] `switch--unlabeled`

#### 60. Table — `table` — 0/8 ⚠️
  - [ ] `table--borderless`
  - [ ] `table--cells`
  - [ ] `table--few-rows`
  - [ ] `table--filter`
  - [ ] `table--pagination`
  - [ ] `table--scroll`
  - [ ] `table--sortable`
  - [ ] `table--sortable-fill-click`

#### 61. Table grid — `table-grid` — 1/4 ⚠️
  - [ ] `table-grid--jobs`
  - [ ] `table-grid--records`
  - [ ] `table-grid--sortable`
  - [x] `table-grid--table-grid`

#### 62. Table semantic — `table-semantic` — 1/9 ⚠️
  - [ ] `table-semantic--builder`
  - [ ] `table-semantic--builder-divider`
  - [ ] `table-semantic--builder-icon-overrides`
  - [ ] `table-semantic--builder-size`
  - [ ] `table-semantic--compose`
  - [ ] `table-semantic--divider`
  - [ ] `table-semantic--size`
  - [ ] `table-semantic--spacious-sort`
  - [x] `table-semantic--table-semantic`

#### 63. Tabs — `tabs` — 1/3 ⚠️
  - [ ] `tabs--controlled`
  - [ ] `tabs--one-child`
  - [x] `tabs--tabs`

#### 64. Tag — `tag` — 1/5 ⚠️
  - [ ] `tag--long-text`
  - [ ] `tag--overrides`
  - [ ] `tag--size`
  - [ ] `tag--start-enhancer`
  - [x] `tag--tag`

#### 65. Template component — `template-component` — 0/1 —
  - [ ] `template-component--template-component`

#### 66. Textarea — `textarea` — 1/2 ⚠️
  - [x] `textarea--textarea`
  - [ ] `textarea--textarea-resize`

#### 67. Timepicker — `timepicker` — 0/2 ⚠️
  - [ ] `timepicker--time-picker`
  - [ ] `timepicker--time-picker-min-max-diff-day`

#### 68. Timezonepicker — `timezonepicker` — 1/3 ⚠️
  - [x] `timezonepicker--timezone-picker` _(clone: `timezone-picker--timezone-picker`)_
  - [ ] `timezonepicker--timezone-picker-abbreviations`
  - [ ] `timezonepicker--timezone-picker-additional-timezones`

#### 69. Toast — `toast` — 1/4 ⚠️
  - [ ] `toast--application-state`
  - [x] `toast--toast`
  - [ ] `toast--toaster`
  - [ ] `toast--toaster-focus`

#### 70. Tooltip — `tooltip` — 1/4 ⚠️
  - [ ] `tooltip--arrow-margin`
  - [ ] `tooltip--complex`
  - [x] `tooltip--tooltip`
  - [ ] `tooltip--tooltip-interactive`

#### 71. Tree view — `tree-view` — 1/5 ⚠️
  - [ ] `tree-view--icon-overrides`
  - [ ] `tree-view--interactable`
  - [ ] `tree-view--render-all`
  - [ ] `tree-view--single-expanded`
  - [x] `tree-view--tree-view`

#### 72. Typography — `typography` — 0/6 ⚠️
  - [ ] `typography--body`
  - [ ] `typography--display`
  - [ ] `typography--heading`
  - [ ] `typography--mono`
  - [ ] `typography--mono-styletron`
  - [ ] `typography--overrides`

---

## 10. Fichas por componente

Ficha = registro detalhado por componente. Preencher ao verificar (`⚠️ → ✅`).

### Template de ficha (copiar ao iniciar um componente)

```md
### <Nome> — `<grupo>` — <status>
- **Stories (clone/orig):** <x/y>
- **Verdade-base:** baseweb/src/<comp>/{styled-components.ts, constants.ts, __tests__/*.scenario.tsx}
- **Stories a clonar/verificar:** <lista da seção 9>
- **Estados a verificar:** <hover/focus/disabled/open/...>
- **Divergências encontradas:** <lista>
- **Correções aplicadas:** <arquivos + o quê>
- **Verificação:** <medições antes→depois; screenshots ok?>
- **DoD:** <itens da seção 6 marcados>
- **Commit:** <hash/mensagem>
```

---

### Pagination — `pagination` — ✅ Verificado (2026-06-04)

- **Stories (clone/orig):** 1/1.
- **Verdade-base:** `baseweb/src/pagination/` (`styled-components.ts`, `pagination.tsx`,
  `__tests__/pagination.scenario.tsx`).
- **Story renderiza:** **4** paginações empilhadas — `mini`, `compact`, `default`,
  `large` — todas `numPages=10`, página atual `1`.
- **Estados verificados:** página 1 (Prev disabled), dropdown **aberto** (menu + scrim), hover.
- **Divergências encontradas (antes):**
  1. Story renderizava **1** paginação `compact` com `of 4` (deveria ser 4 sizes, `of 10`).
  2. `size` default `'compact'` (baseweb = `'default'`) e **sem** `'large'`.
  3. Select com **fundo cinza** fixo; no original é *tertiary* (transparente, cinza só
     hover/open, sem borda 2px, seta escura).
  4. Altura do select fixa 48px — não acompanhava o size (mini 32 / compact 36 / default 48 / large 60).
  5. **Dropdown aberto vazado**: token `--bw-z-overlay` **inexistente** → `z-index: auto`.
- **Correções aplicadas:**
  - `components/pagination/pagination.component.ts` — 4 sizes/`numPages=10`;
    `size: 'mini'|'compact'|'default'|'large'` default `'default'`; `bui-pg--{size}`;
    select tertiary + `min-height` por size.
  - `tokens/base-web-tokens.scss` — add `--bw-z-overlay: 1000`.
  - `components/select/select.component.scss` — fallback `var(--bw-z-overlay, 1000)` (fix global).
- **Verificação (orig→clone):** `rootH` 36/44/52/60 ✓ · `selH` 32/36/48/60 ✓ ·
  `prevH` 36/44/52/56 ✓ · select bg transparente ✓ · menu `z-index` auto→**1001** ✓.
  Resíduo: largura do select ≤6px (imperceptível).
- **DoD:** stories ✓ · dimensões ✓ · tipografia ✓ · cores/bordas ✓ · estados (incl. aberto) ✓ · build ✓.
- **Commit:** _pendente_.
