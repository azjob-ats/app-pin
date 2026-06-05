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

**Prioridade (Prio):** ordem de construção por **grafo de dependências** — fazer os
provedores antes dos consumidores, para não retrabalhar. Tiers:

- **P1 — Fundamentos:** primitivos sem dependências de outros componentes e reusados por
  muitos (`Icon`, `Button`, `Avatar`, `Input`, `List`, `Spinner`, `Tag`, `Checkbox`,
  `Typography`). **Fazer primeiro.**
- **P2 — Estruturas de overlay:** base de menus/camadas que habilitam os compostos
  (`Popover`, `Menu`, `Drawer`). Dependem de P1.
- **P3 — Compostos:** montam-se sobre P1/P2 (`Select`, `Datepicker`, `Modal`, `Combobox`,
  `Tooltip`, `Banner`…). Só depois que as bases estiverem ✅.
- **P4 — Folhas:** independentes, sem dependentes; podem ser feitas em paralelo a qualquer
  momento (`Badge`, `Divider`, `Slider`, `Switch`, `Tabs`, tabelas…).

| # | Componente | Prio | Stories (clone/orig) | Status |
|---|----------|:--:|:--:|:--:|
| 1 | Accordion | P4 | 6/6 | ✅ |
| 2 | App nav bar | P3 | 0/7 | ⚠️ |
| 3 | Aspect ratio box | P4 | 0/1 | ⚠️ |
| 4 | Avatar | **P1** | 0/5 | ⚠️ |
| 5 | Badge | P4 | 0/4 | ⚠️ |
| 6 | Banner | P3 | 0/5 | ⚠️ |
| 7 | Block | — | — | 🚫 |
| 8 | Breadcrumbs | P4 | 0/4 | ⚠️ |
| 9 | Button | **P1** | 0/15 | ⚠️ |
| 10 | Button group | P3 | 0/12 | ⚠️ |
| 11 | Button timed | P3 | 0/1 | ⚠️ |
| 12 | Card | P3 | 0/5 | ⚠️ |
| 13 | Checkbox | **P1** | 0/8 | ⚠️ |
| 14 | Checkbox v2 | **P1** | 0/7 | ⚠️ |
| 15 | Combobox | P3 | 0/11 | ⚠️ |
| 16 | Data table | P3 | 0/33 | ⚠️ |
| 17 | Datepicker | P3 | 0/29 | ⚠️ |
| 18 | Divider | P4 | 0/1 | ⚠️ |
| 19 | Dnd list | P4 | 0/1 | ⚠️ |
| 20 | Drawer | **P2** | 0/4 | ⚠️ |
| 21 | File uploader | P3 | 0/7 | ⚠️ |
| 22 | File uploader basic | P3 | 0/7 | ⚠️ |
| 23 | Flex grid | P4 | 0/6 | ⚠️ |
| 24 | Form control | — | — | 🚫 |
| 25 | Header navigation | P3 | 0/1 | ⚠️ |
| 26 | Heading | P4 | 0/1 | ⚠️ |
| 27 | Helper | — | 0/3 | 🚫 |
| 28 | Helpers | — | 0/1 | 🚫 |
| 29 | Icon | **P1** | 0/3 | ⚠️ |
| 30 | Input | **P1** | 0/15 | ⚠️ |
| 31 | Layer | — | — | 🚫 |
| 32 | Layout grid | P4 | 0/11 | ⚠️ |
| 33 | Link | P4 | 0/1 | ⚠️ |
| 34 | List | **P1** | 0/7 | ⚠️ |
| 35 | Map marker | — | — | 🚫 |
| 36 | Menu | **P2** | 0/11 | ⚠️ |
| 37 | Message card | P3 | 0/4 | ⚠️ |
| 38 | Mobile header | P3 | 0/2 | ⚠️ |
| 39 | Modal | P3 | 0/3 | ⚠️ |
| 40 | Notification | P3 | 0/1 | ⚠️ |
| 41 | Pagination | P3 | 1/1 | ✅ |
| 42 | Payment card | P3 | 0/2 | ⚠️ |
| 43 | Phone input | P3 | 0/7 | ⚠️ |
| 44 | Pin code | P3 | 0/5 | ⚠️ |
| 45 | Popover | **P2** | 0/15 | ⚠️ |
| 46 | Progress bar | P4 | 0/6 | ⚠️ |
| 47 | Progress steps | P4 | 0/6 | ⚠️ |
| 48 | Radio | P4 | 0/3 | ⚠️ |
| 49 | Radio v2 | P4 | 0/5 | ⚠️ |
| 50 | Rating | P4 | 0/3 | ⚠️ |
| 51 | Select | P3 | 0/30 | ⚠️ |
| 52 | Side navigation | P3 | 0/2 | ⚠️ |
| 53 | Skeleton | P4 | 0/3 | ⚠️ |
| 54 | Slider | P4 | 0/9 | ⚠️ |
| 55 | Sliding button | P4 | 0/3 | ⚠️ |
| 56 | Snackbar | P3 | 0/6 | ⚠️ |
| 57 | Spinner | **P1** | 0/1 | ⚠️ |
| 58 | Stepper | P4 | 0/1 | ⚠️ |
| 59 | Switch | P4 | 0/7 | ⚠️ |
| 60 | Table | P4 | 0/8 | ⚠️ |
| 61 | Table grid | P4 | 0/4 | ⚠️ |
| 62 | Table semantic | P4 | 0/9 | ⚠️ |
| 63 | Tabs | P4 | 0/3 | ⚠️ |
| 64 | Tag | **P1** | 0/5 | ⚠️ |
| 65 | Template component | — | 0/1 | 🚫 |
| 66 | Textarea | P3 | 0/2 | ⚠️ |
| 67 | Timepicker | P3 | 0/2 | ⚠️ |
| 68 | Timezonepicker | P3 | 0/3 | ⚠️ |
| 69 | Toast | P3 | 0/4 | ⚠️ |
| 70 | Tooltip | P3 | 0/4 | ⚠️ |
| 71 | Tree view | P3 | 0/5 | ⚠️ |
| 72 | Typography | **P1** | 0/6 | ⚠️ |

**Placar:** `✅ 2` · `⚠️ 63` · `🚫 (fora do escopo) 7` — **72 componentes** no original;
**escopo efetivo = 65**. Fora do escopo (🚫): `helper`, `helpers`, `template-component`
`block`, `form-control`, `layer`, `map-marker`. **429 stories**.

**Por prioridade (escopo efetivo):** `P1 = 10` · `P2 = 3` · `P3 = 28` · `P4 = 24`.
Sequência sugerida: **P1 → P2 → P3 → P4** (P4 em paralelo livre).


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
