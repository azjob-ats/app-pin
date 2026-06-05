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

> **Estado atual:** **`Pagination` e `Accordion` cobertos**. Todos os demais estão
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
| — | **Infra / sem story visual** — primitivo utilitário (ex.: `layer`), baixa prioridade. |
| 🚫 | **Fora do escopo** — existe no original mas é infra/dev sem valor de UI; **não clonar** (ver 8.2). |

A coluna **Stories (clone/orig)** mostra a cobertura de stories: ex. `Avatar 1/5` = clone
tem 1 das 5 stories do original.

---

## 8. Cobertura por componente

| # | Componente | Grupo | Stories (clone/orig) | Status | Foco de verificação (específico) |
|---|---|---|:--:|:--:|---|
| 1 | Accordion | `accordion` | 6/6 | ✅ | chevron 24px, header 56px, foco-visível #276EF1, AXE 0 — VERIFICADO (ver ficha) |
| 2 | App nav bar | `app-nav-bar` | 1/7 | ⚠️ | logo, itens primários/secundários, user menu, busca, colapso responsivo |
| 3 | Aspect ratio box | `aspect-ratio-box` | 1/1 | ⚠️ | proporção mantida, conteúdo preenchendo, overflow |
| 4 | Avatar | `avatar` | 1/5 | ⚠️ | tamanhos, imagem vs iniciais, fallback (error/no-src), update-image |
| 5 | Badge | `badge` | 3/4 | ⚠️ | kinds/cores, posicionamento, hint-dot, notification-circle, inline |
| 6 | Banner | `banner` | 1/5 | ⚠️ | kinds, ícone, ação (below), artwork, nested, dismiss |
| 7 | Block | `block` | — | 🚫 | **Removido do clone por decisão** (ver 8.2) |
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
| 24 | Form control | `form-control` | — | 🚫 | **Removido do clone por decisão** (ver 8.2) |
| 25 | Header navigation | `header-navigation` | 1/1 | ⚠️ | alinhamento de itens, borda inferior, ações à direita |
| 26 | Heading | `heading` | 1/1 | ⚠️ | níveis/escala, peso, line-height, cor |
| 27 | Helper | `helper` | 0/3 | 🚫 | **Fora do escopo** — infra, não clonar (ver 8.2) |
| 28 | Helpers | `helpers` | 0/1 | 🚫 | **Fora do escopo** — utilitário interno, não-UI (ver 8.2) |
| 29 | Icon | `icon` | 0/3 | ⚠️ | grid 24px, baseline, tamanho/cor herdada, em botões |
| 30 | Input | `input` | 1/15 | ⚠️ | sizes, estados, before/after, clearable, mask, password, borda 2px |
| 31 | Layer | `layer` | — | 🚫 | **Removido do clone por decisão** (ver 8.2) |
| 32 | Layout grid | `layout-grid` | 1/11 | ⚠️ | colunas, gutter, margens, breakpoints, order/skip/hide |
| 33 | Link | `link` | 1/1 | ⚠️ | cor, underline/hover, focus, dentro de texto |
| 34 | List | `list` | 0/7 | ⚠️ | item (artwork/label/secundário/menu), divisória, alturas, rtl |
| 35 | Map marker | `map-marker` | — | 🚫 | **Removido do clone por decisão** (ver 8.2) |
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
| 65 | Template component | `template-component` | 0/1 | 🚫 | **Fora do escopo** — scaffold de dev (ver 8.2) |
| 66 | Textarea | `textarea` | 1/2 | ⚠️ | sizes, estados, resize, char count, borda 2px |
| 67 | Timepicker | `timepicker` | 0/2 | ⚠️ | lista de horários, step, seleção, formato 12/24h, scroll |
| 68 | Timezonepicker | `timezonepicker` | 1/3 | ⚠️ | busca, agrupamento, offset/label, abbreviations, additional |
| 69 | Toast | `toast` | 1/4 | ⚠️ | kinds, posição/stack, ícone, close, toaster, auto-dismiss |
| 70 | Tooltip | `tooltip` | 1/4 | ⚠️ | seta/placement, delay, fundo escuro, max-width, interactive |
| 71 | Tree view | `tree-view` | 1/5 | ⚠️ | expand/collapse, indentação, ícones, seleção, single-expanded |
| 72 | Typography | `typography` | 0/6 | ⚠️ | escala (display/heading/label/paragraph/mono), 2 famílias, pesos |

**Placar:** `✅ 2` · `⚠️ 63` · `🚫 (fora do escopo) 7` — **72 componentes** no original;
**escopo efetivo = 65**. Fora do escopo (🚫): `helper`, `helpers`, `template-component`
(nunca clonados, infra) + `block`, `form-control`, `layer`, `map-marker` (removidos por
decisão, ver 8.2). **429 stories**.

### 8.2. Componentes FORA do escopo (não clonar)

**(a) Originais que nunca existiram no clone — infra/dev, não-UI:**

| Componente | Stories | Por que não clonar |
|---|---|---|
| `helper` | 3 (`position`, `steps`, `with-steps`) | helper interno; **não necessário**. |
| `helpers` | 1 (`override-avoid-remount`) | utilitários internos (`base-provider`, `overrides`, `i18n`) — não-UI. |
| `template-component` | 1 | scaffold/modelo de dev do Base Web. |

**(b) Removidos do clone por decisão — ✅ REMOVIDOS (nav + registry + pastas):**

| Componente | O que foi removido |
|---|---|
| `block` | nav (Utility), registry, pasta `components/block` |
| `form-control` | nav (Inputs), registry, pasta `components/form-control` |
| `layer` | nav (Utility) — não tinha registry/pasta |
| `map-marker` | seção "Map marker" do nav (4 itens), 4 entradas do registry, pasta `components/map-marker` (fixed/floating/route/puck) |

> Removidos por decisão do projeto mesmo existindo no original. Sem referências externas —
> remoção limpa, build do dev server OK. Para reintroduzir, basta recriar nav+registry+pasta.

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

---

### Accordion — `accordion` — ✅ Verificado (2026-06-04)

- **Stories (clone/orig):** 6/6 — `accordion`, `expanded`, `disabled`, `controlled`,
  `stateless-accordion`, `panel-override`.
- **Verdade-base:** `baseweb/src/accordion/` (`styled-components.ts`, `panel.tsx`,
  `accordion.tsx`, `stateless-accordion.tsx`, `__tests__/*.scenario.tsx`).
- **Estados verificados:** colapsado, expandido, disabled (cinza), foco-visível (Tab), hover.
- **Divergências encontradas (antes):**
  1. **Chevron 20×20** (Material Symbol `font-size:20px`) → header **52px**; original usa
     ToggleIcon `$size={24}` (caixa 24×24) → header **56px**.
  2. **4 das 6 stories inventadas** (não portadas do `.scenario.tsx`):
     - `disabled`: clone tinha Enabled/Disabled/Disabled-exp (3); original = `<Accordion disabled>`
       + 2 panels colapsados (Default panel / Expanded provided as prop).
     - `controlled`: clone "Controlled 1-3" single-open; original = Litany I/II/III, **multi-open**
       (L1+L2 abertos), override Content `fontFamily: 'fantasy'`.
     - `stateless-accordion`: clone "Stateless 1-3" só idx0; original = Panel 1/2/3 (Lorem…),
       **multi-open** (P1+P2 abertos).
     - `panel-override`: clone 1 panel com override de bg; original = 2 panels (hello/hello_world,
       hello_world expandido) com **ToggleIcon → texto** "expand(override)"/"collapse(override)".
- **Correções aplicadas:**
  - `panel.component.scss` — chevron com caixa 24×24 (`width/height:24px`, `font-size:24px`,
    inline-flex centralizado); add `.bui-panel__toggle` (wrapper do toggle).
  - `panel.component.html` — toggle via `<ng-content select="[buiPanelToggle]">` com **fallback**
    (chevron padrão) — permite override do ícone como no baseweb, sem mudar a arquitetura.
  - `accordion.scenarios.ts` — 4 stories reescritas fiéis ao `.scenario.tsx` (títulos, conteúdo,
    qtde, multi-open via `Set`, font `fantasy`, toggle-texto).
- **Verificação (orig→clone):** header **56=56** ✓ · root **171=171** ✓ · ícone **24×24=24×24** ✓ ·
  padding header 16/16/20/20 ✓ · content 24/40/24/24 ✓ · tipografia 500·16/20 e 400·14/20 ✓ ·
  foco-visível `3px solid #276EF1` offset -3px ✓ · **AXE 0 violações** (4 stories) ✓.
  (largura 904 vs 1280 = só o wrapper do clone, não é divergência.)
- **DoD:** stories ✓ · dimensões ✓ · tipografia ✓ · cores/bordas ✓ · estados (incl. disabled/foco) ✓ ·
  a11y (AXE/ARIA/foco) ✓ · build dev ✓ · sem regressão (mudanças isoladas ao accordion).
- **Commit:** _pendente_.
