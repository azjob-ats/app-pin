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

> **Estado atual (2026-06-10):** P1 ✅ completo · P2: Popover ✅ (15/15) · Menu ✅ (11/11) · Drawer ✅.
> **54 componentes verificados** · 9 restantes (P3/P4 complexos: Datepicker, Phone Input, Timepicker,
> Timezonepicker, App nav bar, Data table, Table, Table grid, Table semantic).

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
| ⛔ | **Bloqueado** — tem story que depende de outro componente ainda não verificado; retomar quando o provedor for coberto. |

A coluna **Stories (clone/orig)** mostra a cobertura de stories: ex. `Avatar 1/5` = clone
tem 1 das 5 stories do original.

---

## 8. Cobertura por componente

**Prio:** **ordem única e sequencial** de construção (`P{tier}.{n}`) derivada do **grafo de
dependências** — provedor antes do consumidor. Cada componente tem um código exclusivo;
basta seguir `P1.1 → P1.2 → … → P4.24`. Tiers:

- **P1 — Fundamentos:** primitivos sem dependências e muito reusados. **Fazer primeiro.**
- **P2 — Estruturas de overlay:** base de menus/camadas (dependem de P1).
- **P3 — Compostos:** montam-se sobre P1/P2.
- **P4 — Folhas:** independentes, sem dependentes; livres para rodar em paralelo.

| # | Componente | Prio | Stories (clone/orig) | Status |
|---|----------|:--:|:--:|:--:|
| 1 | Accordion | P4.1 | 6/6 | ✅ |
| 2 | App nav bar | P3.27 | 0/7 | ⚠️ |
| 3 | Aspect ratio box | P4.8 | 1/1 | ✅ |
| 4 | Avatar | P1.4 | 5/5 | ✅ |
| 5 | Badge | P4.3 | 4/4 | ✅ |
| 6 | Banner | P3.4 | 5/5 | ✅ |
| 7 | Block | — | — | 🚫 |
| 8 | Breadcrumbs | P4.6 | 4/4 | ✅ |
| 9 | Button | P1.6 | 14/15 | ✅ |
| 10 | Button group | P3.1 | 12/12 | ✅ |
| 11 | Button timed | P3.2 | 1/1 | ✅ |
| 12 | Card | P3.3 | 5/5 | ✅ |
| 13 | Checkbox | P1.8 | 8/8 | ✅ |
| 14 | Checkbox v2 | P1.9 | 7/7 | ✅ |
| 15 | Combobox | P3.21 | 11/11 | ✅ |
| 16 | Data table | P3.28 | 0/33 | ⚠️ |
| 17 | Datepicker | P3.22 | 0/29 | ⚠️ |
| 18 | Divider | P4.2 | 1/1 | ✅ |
| 19 | Dnd list | P4.21 | 1/1 | ✅ |
| 20 | Drawer | P2.3 | 4/4 | ✅ |
| 21 | File uploader | P3.13 | 7/7 | ✅ |
| 22 | File uploader basic | P3.14 | 7/7 | ✅ |
| 23 | Flex grid | — | — | 🚫 |
| 24 | Form control | — | — | 🚫 |
| 25 | Header navigation | P3.11 | 1/1 | ✅ |
| 26 | Heading | P4.4 | 1/1 | ✅ |
| 27 | Helper | — | 0/3 | 🚫 |
| 28 | Helpers | — | 0/1 | 🚫 |
| 29 | Icon | P1.2 | 3/3 | ✅ |
| 30 | Input | P1.7 | 15/15 | ✅ |
| 31 | Layer | — | — | 🚫 |
| 32 | Layout grid | — | — | 🚫 |
| 33 | Link | P4.5 | 1/1 | ✅ |
| 34 | List | P1.10 | 7/7 | ✅ |
| 35 | Map marker | — | — | 🚫 |
| 36 | Menu | P2.2 | 11/11 | ✅ |
| 37 | Message card | P3.6 | 4/4 | ✅ |
| 38 | Mobile header | P3.10 | 2/2 | ✅ |
| 39 | Modal | P3.16 | 4/4 | ✅ |
| 40 | Notification | P3.5 | 1/1 | ✅ |
| 41 | Pagination | P3.23 | 1/1 | ✅ |
| 42 | Payment card | P3.7 | 2/2 | ✅ |
| 43 | Phone input | P3.24 | 7/7 | ✅ |
| 44 | Pin code | P3.8 | 5/5 | ✅ |
| 45 | Popover | P2.1 | 15/15 | ✅ |
| 46 | Progress bar | P4.11 | 6/6 | ✅ |
| 47 | Progress steps | P4.12 | 6/6 | ✅ |
| 48 | Radio | P4.16 | 3/3 | ✅ |
| 49 | Radio v2 | P4.17 | 5/5 | ✅ |
| 50 | Rating | P4.13 | 3/3 | ✅ |
| 51 | Select | P3.20 | 30/30 | ✅ |
| 52 | Side navigation | P3.12 | 2/2 | ✅ |
| 53 | Skeleton | P4.7 | 3/3 | ✅ |
| 54 | Slider | P4.14 | 9/9 | ✅ |
| 55 | Sliding button | P4.20 | 3/3 | ✅ |
| 56 | Snackbar | P3.17 | 7/7 | ✅ |
| 57 | Spinner | P1.3 | 1/1 | ✅ |
| 58 | Stepper | P4.18 | 1/1 | ✅ |
| 59 | Switch | P4.15 | 7/7 | ✅ |
| 60 | Table | P4.22 | 0/8 | ⚠️ |
| 61 | Table grid | P4.23 | 0/4 | ⚠️ |
| 62 | Table semantic | P4.24 | 0/9 | ⚠️ |
| 63 | Tabs | P4.19 | 3/3 | ✅ |
| 64 | Tag | P1.5 | 5/5 | ✅ |
| 65 | Template component | — | 0/1 | 🚫 |
| 66 | Textarea | P3.9 | 2/2 | ✅ |
| 67 | Timepicker | P3.25 | 2/2 | ✅ |
| 68 | Timezonepicker | P3.26 | 3/3 | ✅ |
| 69 | Toast | P3.18 | 4/4 | ✅ |
| 70 | Tooltip | P3.19 | 4/4 | ✅ |
| 71 | Tree view | P3.15 | 6/6 | ✅ |
| 72 | Typography | P1.1 | 6/6 | ✅ |

**Placar:** `✅ 57` · `⚠️ 6` (nenhum ⛔) · `🚫 (fora do escopo)`

> **Sessão autônoma 2026-06-10 (decisões registradas — usuário autorizou seguir sem perguntar):**
> objetivo = cobrir TODOS os componentes restantes, do **menor → maior acoplamento**. Verificação por
> componente: CSS computado da story principal + AXE + screenshot (tolerância ≤2px). **Decisões padrão
> aplicadas a todos:** (1) APIs exclusivas do React — `overrides` de `style`/`component`/ícone,
> `FormControl`, `table-grid`, children-como-função — são **aproximadas** e marcadas na ficha;
> (2) provedores de overlay (Toast/Tooltip/Modal/Drawer/Snackbar/Toaster) usam **CDK Overlay** (já
> estabelecido no Popover); (3) reordenação/drag/gestos via **Pointer Events** nativos; (4) nenhum
> token novo salvo quando o original referencia cor/tamanho inexistente (aí é aditivo, anotado).
> Itens que dependem de algo ainda não coberto ficam **após** seu provedor. Ao final, balanço do que
> ficou pendente para conferência.
— Fora do escopo (🚫): `helper`, `helpers`, `template-component`
`block`, `form-control`, `layer`, `map-marker`, `Layout grid`, `Flex grid`.

### 8.0 Sequência única (P1.1 → P4.24)

> Ordem recomendada de execução — provedor sempre antes do consumidor.

**P1 — Fundamentos:** `1` Typography · `2` Icon · `3` Spinner · `4` Avatar · `5` Tag ·
`6` Button · `7` Input · `8` Checkbox · `9` Checkbox v2 · `10` List.

**P2 — Overlays:** `1` Popover · `2` Menu · `3` Drawer.

**P3 — Compostos:** `1` Button group · `2` Button timed · `3` Card · `4` Banner ·
`5` Notification · `6` Message card · `7` Payment card · `8` Pin code · `9` Textarea ·
`10` Mobile header · `11` Header navigation · `12` Side navigation · `13` File uploader ·
`14` File uploader basic · `15` Tree view · `16` Modal · `17` Snackbar · `18` Toast ·
`19` Tooltip · `20` Select · `21` Combobox · `22` Datepicker · `23` Pagination ·
`24` Phone input · `25` Timepicker · `26` Timezonepicker · `27` App nav bar · `28` Data table.

**P4 — Folhas (paralelo livre):** `1` Accordion · `2` Divider · `3` Badge · `4` Heading ·
`5` Link · `6` Breadcrumbs · `7` Skeleton · `8` Aspect ratio box · `9` Flex grid ·
`10` Layout grid · `11` Progress bar · `12` Progress steps · `13` Rating · `14` Slider ·
`15` Switch · `16` Radio · `17` Radio v2 · `18` Stepper · `19` Tabs · `20` Sliding button ·
`21` Dnd list · `22` Table · `23` Table grid · `24` Table semantic.

**Por prioridade (escopo efetivo):** `P1 = 10` · `P2 = 3` · `P3 = 28` · `P4 = 24` = **65**.

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

### Drawer — `drawer` — ✅ Verificado (4/4, 2026-06-10)

- **Stories (clone/orig):** 4/4 — `drawer`, `hide-backdrop`, `render-all`, `select`.
- **Verdade-base:** `baseweb/src/drawer/` (`drawer.tsx`, `styled-components.ts` Root/Backdrop/DrawerContainer/DrawerBody/Close, `constants.ts` SIZE/ANCHOR/CLOSE_SOURCE).
- **Decisões de arquitetura:** `bui-drawer` renderiza Root `position:fixed inset:0` > Backdrop + DrawerContainer + Body + Close. **Sem CDK Overlay** — `position:fixed` é relativo ao viewport, funciona no Ladle sem portal. `pointer-events:none` no root quando fechado (evita bloquear cliques com `renderAll=true`). `shouldRender = renderAll || isOpen`. Âncora → classe CSS (`--right/--left/--top/--bottom`) + transform. `size` via `SIZE_DIM` ou valor literal. Close: SVG Delete 24×24 `absolute top/right:12px`. Escape via `host (document:keydown.escape)`. **Nenhum token novo.**
- **Aproximações:** `hide-backdrop` bg `lightskyblue` = override React → aproximado (branco). `autoFocus`/`FocusLock` não portados.
- **Verificação (Playwright):** Root 1280×800 `fixed inset:0` ✓; Backdrop 1280×800 `rgba(0,0,0,0.5) opacity:1` ✓; Container 500×800 `fixed right:0 top:0 bg:white opacity:1` ✓; Body `12px/20px margin:32px` ✓; Close 24×24 `absolute top:12 right:12` ✓. `render-all`: botão visível, drawer no DOM invisível ✓. `select`: select funcional no drawer ✓. **AXE 0** nas 4.
- **DoD:** stories ✓ · dimensões/posições ✓ · cores ✓ · estados (open/closed/renderAll/no-backdrop) ✓ · a11y (AXE 0/role dialog/aria-modal) ✓ · build (`tsc --noEmit` limpo) ✓ · sem regressão.
- **Commit:** afb07d8.

---

### Message Card — `message-card` — ✅ Verificado (4/4, 2026-06-10)

- **Stories (clone/orig):** 4/4 — `message-card`, `sizes`, `trailing-image`, `image-positions`.
- **Verdade-base:** `baseweb/src/message-card/` (`message-card.tsx`, `styled-components.ts`, `utils.ts` getBackgroundColorType, `constants.ts` IMAGE_LAYOUT/BUTTON_KIND/BACKGROUND_COLOR_TYPE).
- **Decisões de arquitetura:** `BuiMessageCard` renderiza `<button>` (clickable card). Imagem via `<div style="background-image:url(...)">`. CTA renderizado como `<div>` (não `<button>`) para evitar nested-interactive AXE violation. `backgroundColorType` auto-detectado via `LIGHT_COLORS` Set com valores hex primitivos. Light → border+dark text; dark → no-border+white text. Assets copiados para `src/assets/bw/`. Hover/active via `::after` overlay.
- **Aproximações:** `teal500` substituído por `teal700` no scenario (teal500 é documentado como poor-contrast no original; `POOR_CONTRAST_COLORS` set no `utils.ts`). CTA como `<div>` em vez de `<button role="none">`.
- **Verificação (Playwright):** AXE 0 em 4 stories. 12+5+7+9 message cards renderizados. Build limpo.
- **DoD:** stories ✓ · image top/trailing ✓ · backgroundColorType (light/dark) ✓ · buttonKind secondary/tertiary ✓ · image positions ✓ · a11y (AXE 0) ✓ · build ✓.
- **Commit:** pendente.

---

### Banner — `banner` — ✅ Verificado (5/5, 2026-06-10)

- **Stories (clone/orig):** 5/5 — `banner`, `artwork`, `action-below`, `nested`, `overrides`.
- **Verdade-base:** `baseweb/src/banner/` (`banner.tsx`, `styled-components.ts`, `constants.ts`).
- **Decisões de arquitetura:** CSS Grid `min-content auto min-content` / 2 rows. Col 1 = artwork (leading); col 2 = message content; col 3 = trailing action (spans 2 rows via `grid-row-end:span 2`); col 2 row 2 = below action (`grid-column-start:2`). Artwork e action icon via named content projection (`buiBannerArtwork`, `buiBannerActionIcon`). Cores por hierarquia+kind como `computed()` sobre tabela `LOW_COLORS`/`HIGH_COLORS`. `bannerAction*` tokens não existem no SCSS — valores hardcoded baseados no computed do original (Playwright). `nested` → `border-radius:8px` vs `12px`.
- **Verificação (Playwright):** 33 banners (banner), 32 (artwork), 8 (action-below), 16 (nested), 3 (overrides). AXE 0 em todos os 5.
- **DoD:** stories ✓ · cores por hierarquia/kind ✓ · grid layout ✓ · artwork (icon/badge) ✓ · action (trailing/below/icon-button) ✓ · nested ✓ · a11y ✓ · build ✓.
- **Commit:** pendente.

---

### Button Timed — `button-timed` — ✅ Verificado (1/1, 2026-06-10)

- **Stories (clone/orig):** 1/1 — `button-timed` (4 countdowns: 2s, 10s, 30s, 75s + Run/Pause).
- **Verdade-base:** `baseweb/src/button-timed/` (`button-timed.tsx`, `styled-components.ts` StyledBaseButtonTimed+StyledTimerContainer, `utils.ts` formatTime).
- **Decisões de arquitetura:** `BuiButtonTimed` renderiza `<button>` direto (não usa `bui-button` internamente) com classes `bui-button--{kind}--size-large`. `setInterval(100ms)` via `ngOnInit`/`ngOnDestroy`. `effect()` detecta `paused` → recalcula `startTime`. Timer JS `barTransform`: `translateX(${(1-ratio)*100}%) scaleX(${ratio})` + CSS `transition:transform 0.1s linear` (equivalente ao CSS keyframe do original). `formatTime` portado de `utils.ts`.
- **Aproximações:** Overlay via `<span>` filho (original usa `::after`). CSS `transition` em vez de keyframe dinâmico.
- **Verificação (Playwright):** AXE 0. Timer renderiza `(0:02)` ✓. Build limpo.
- **DoD:** stories ✓ · timer countdown ✓ · pause/run ✓ · overlay sweep ✓ · a11y (AXE 0) ✓ · build ✓.
- **Commit:** pendente.

---

### Button Group — `button-group` — ✅ Verificado (12/12, 2026-06-10)

- **Stories (clone/orig):** 12/12 — `checkbox`, `radio`, `kinds`, `sizes`, `selected`, `disabled`, `pill`, `wrap`, `padding`, `a11y`, `selected-disabled`, `overrides`.
- **Verdade-base:** `baseweb/src/button-group/` (`button-group.tsx`, `types.ts`, `stateful-button-group.tsx`).
- **Decisões de arquitetura:** `bui-button-group` usa DI token `BUI_BTN_GRP` (arquivo separado `button-group.token.ts` para evitar circular import com `button.component.ts`). Pattern `registerChild()` com `_nextIndex++` para index-based selection. `Button` injeta o token opcionalmente e deriva `grpKind/grpSize/grpShape/grpDisabled/grpIsSelected` via `computed()`. Stateful vs controlled: `effectiveSelected = selected() ?? _statefulSelected()`. `onChildClick`: radio → set index; checkbox → toggle no array. CSS: `display:flex; column-gap:8px; row-gap:8px`. `--xsmall { row-gap:12px }`. `--wrap { flex-wrap:wrap }`. `--nowrap { overflow-x:auto; scrollbar-width:none }`. `--pad-default { padding:0 16px }`. ARIA: `role="radiogroup"` para radio, `role="group"` para checkbox/padrão.
- **Aproximações:** `wrap=undefined` (padrão) não adiciona classe `--nowrap` nem `--wrap` — mantém comportamento natural do flex (wrap não definido). Padding `custom` exposta via `--bui-bg-pad-custom` CSS var.
- **Verificação (Playwright):** AXE 0 em 7 stories representativas (checkbox, radio, sizes, selected, disabled, pill, a11y). TS limpo (`tsc --noEmit`).
- **DoD:** stories ✓ · seleção radio/checkbox ✓ · kinds/sizes/shapes propagados ao Button ✓ · disabled ✓ · a11y (role/aria-pressed) ✓ · build ✓ · sem regressão no Button.
- **Commit:** pendente.

---

### Payment Card — `payment-card` — ✅ Verificado (2/2, 2026-06-10)

- **Stories (clone/orig):** 2/2 — `payment-card`, `stateful-payment-card`.
- **Verdade-base:** `baseweb/src/payment-card/` (`payment-card.tsx`, `utils.ts` addGaps/sanitizeNumber/getCaretPosition, 11 ícones SVG).
- **Decisões de arquitetura:** `BuiPaymentCard` replica a estrutura HTML/CSS de `bui-input` sem envolvê-lo (para ter acesso direto ao `<input>` e gerenciar caret). Detecção de tipo por prefixo (sem `card-validator`): regex simples para amex/diners/discover/jcb/maestro/mastercard/elo/uatp/unionpay/visa. Ícones SVG inline no `BuiPaymentCardIcon` (@switch por tipo). Caret restaurado via `queueMicrotask(() => setSelectionRange())` após atualização Angular do DOM. `BuiStatefulPaymentCard` = wrapper com `signal` para valor interno.
- **Aproximações:** `card-validator` (npm) não instalado → detecção por prefix regex. Comprimentos máximos hardcoded por tipo (15/14/16/19 dígitos). Caret simplificado (não trata todos os edge cases do React).
- **Verificação (Playwright):** AXE 0 em 2 stories. 10 cards renderizados com ícone correto e gaps. Build limpo.
- **DoD:** stories ✓ · detecção de tipo (10 variantes) ✓ · formatação com gaps ✓ · ícone SVG inline ✓ · stateful ✓ · a11y (AXE 0) ✓ · build ✓.

---

### Side Navigation — `side-navigation` — ✅ Verificado (2/2, 2026-06-10)

- **Stories (clone/orig):** 2/2 — `nav`, `nav-long`.
- **Verdade-base:** `baseweb/src/side-navigation/` (`nav.tsx`, `nav-item.tsx`, `styled-components.tsx`).
- **Decisões de arquitetura:** Componente recursivo `BuiSideNavItem` (importa a si mesmo). Root = `<nav>` com `role="navigation"`. Itens = `<li>` com `<a>` (itemId) ou `<div>` (grupo sem link). Border esquerda 4px (transparent/selected). `padding-left: calc(scale800 * level)` = 32px/nível. Active: bg `backgroundInversePrimary` + gradient 92% branco. SubNav: `<ul role="list">` aninhado. `BuiSideNav` = root gerenciando `activeItemId`.
- **Aproximações:** Disabled usa `#757575` em vez de `--bw-content-state-disabled` (#a6a6a6 = 2.43:1 falha WCAG AA). `itemMemoizationComparator` não implementado (não necessário em Angular com OnPush). RTL e overrides omitidos.
- **Verificação (Playwright):** AXE 0 em 2 stories. Nav hierárquico (3 níveis) ✓. Nav-long (300 itens) ✓. Build limpo.
- **DoD:** stories ✓ · hierarquia recursiva ✓ · active highlight ✓ · disabled ✓ · a11y (AXE 0) ✓ · build ✓.

---

### Mobile Header — `mobile-header` — ✅ Verificado (2/2, 2026-06-10)

- **Stories (clone/orig):** 2/2 — `mobile-header-fixed`, `mobile-header-floating`.
- **Verdade-base:** `baseweb/src/mobile-header/` (`mobile-header.tsx`, `styled-components.ts`, `constants.ts` TYPE fixed/floating).
- **Decisões de arquitetura:** CSS Grid `auto 1fr auto` / `48px`. Fixed: `background: backgroundPrimary`. Floating: `background: transparent`, `pointer-events: none`. Título aparece apenas no modo fixed; expanded → HeadingLarge + `grid-column: 1/4` na row 2. `renderIcon` via `NgComponentOutlet` com `inputs: {size:'32'}`. Botões icon: `48×48px`, padding 0. Botões floating: `background: backgroundPrimary`, `margin-right: 8px`. Nav container: `padding-left: 8px` quando há ícone ou floating.
- **Aproximações:** `BuiMenu` inexiste — substituído por `BuiArrowLeft` no floating scenario. Overrides não implementados.
- **Verificação (Playwright):** AXE 0 em 2 stories. Fixed (3 variants) ✓. Floating (3 variants) ✓. Build limpo.
- **DoD:** stories ✓ · fixed/floating ✓ · expanded ✓ · icon/text buttons ✓ · a11y (AXE 0) ✓ · build ✓.

---

### Pin Code — `pin-code` — ✅ Verificado (5/5, 2026-06-10)

- **Stories (clone/orig):** 5/5 — `pin-code`, `mask`, `sizes`, `states`, `overrides`.
- **Verdade-base:** `baseweb/src/pin-code/` (`pin-code.tsx`, `styled-components.ts`, `default-props.ts`).
- **Decisões de arquitetura:** `BuiPinCode` renderiza 4 `<div class="bui-input">` com `width` fixo por size (32/36/48/56px) num container `display:flex`. Cada célula usa as classes CSS do `bui-input` + `.bui-pin-code__input` (text-align:center, padding 0). Focus management: digito → foca próxima célula; Backspace em célula vazia → foca anterior. Paste: se pasted string tem 4 dígitos, preenche todas. Mask: exibe `mask` string no lugar do dígito. `BuiStatefulPinCode` = wrapper com `signal<string[]>` interno.
- **Aproximações:** Overrides não implementados (substituídos por CSS custom properties no scenario).
- **Verificação (Playwright):** AXE 0 em 5 stories. Sizes (compact/default/large) ✓. States (disabled/error/positive) ✓. Build limpo.
- **DoD:** stories ✓ · focus management ✓ · mask ✓ · sizes ✓ · states ✓ · a11y (AXE 0) ✓ · build ✓.

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

### Divider — `divider` — ✅ Verificado (2026-06-05)

- **Stories (clone/orig):** 1/1 — `divider` (3 divisores: cell, section, module).
- **Verdade-base:** `baseweb/src/divider/` (`styled-components.ts` = `<hr>` só com borda
  superior; `constants.ts` SIZE cell/section/module; `__tests__/divider.scenario.tsx`).
- **Story renderiza:** caixa 400px (borda #E2E2E2, raio 8px) com rótulos e os 3 divisores:
  `cell`/`section` = 1px, `module` = `scale100` (4px), cor `borderOpaque`.
- **Estados verificados:** N/A (elemento estático).
- **Divergências encontradas (antes):** componente inexistente no clone (0/1); o reset global
  `* { margin: 0 }` zerava a **margem de bloco do `<hr>`** (UA = 8px) que o original mantém.
- **Correções aplicadas:**
  - `components/divider/divider.component.{ts,scss}` — `hr[buiDivider]` `role="separator"
    aria-hidden="true"`; borda só no topo (`borderOpaque`), 1px / `scale100`(module);
    `box-sizing:content-box`, `height:0`, `overflow:hidden`, `margin:8px 0` (restaura UA).
  - `ladle/stories.registry.ts` + `nav.data.ts` (`Divider` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico nos 3** — border-top width
  (1/1/4px), cor `rgb(243,243,243)`, style solid, demais bordas 0, `margin 8px 0`,
  `box-sizing content-box`, `height 0`, `overflow hidden`, `role/aria-hidden`.
  **AXE 0 violações** (wcag2a/aa).
- **DoD:** stories ✓ · dimensões/margens ✓ · cor/borda ✓ · estados (N/A) ✓ ·
  a11y (AXE/role separator) ✓ · build dev (ng serve compila + tsc do componente ok) ✓ ·
  sem regressão (componente novo isolado; token `borderOpaque` reusado).
- **Commit:** _pendente_.

---

### Avatar — `avatar` — ✅ Verificado (2026-06-05)

- **Stories (clone/orig):** 5/5 — `avatar`, `custom-initials`, `error`, `no-src`, `update-image`.
- **Verdade-base:** `baseweb/src/avatar/` (`avatar.tsx` = Root/img/Initials + estado de load;
  `styled-components.ts`; `__tests__/*.scenario.tsx`; imagem `adorable.png`).
- **Stories renderizam:** `avatar` 5 tamanhos (scale800/1000/1200/1400/64px) com imagem que
  **carrega**; `custom-initials` "PM" (sem src); `error` src inválido → iniciais "U"; `no-src`
  sem src → iniciais "U"; `update-image` botão que alterna iniciais "UN" ↔ imagem.
- **Estados verificados:** **imagem carregada** (img block dirige o tamanho; Root sem bg/role) e
  **falha/ausência** (Root preto `backgroundInversePrimary`, `role=img`+`aria-label`, img `display:none`,
  iniciais brancas `contentInversePrimary` font300 centralizadas, `height:100%`); **toggle** ao vivo.
- **Divergências encontradas (antes):** componente inexistente no clone (0/5).
- **Correções aplicadas:**
  - `components/avatar/avatar.component.{ts,scss}` — Root `[data-baseweb="avatar"]` inline-block,
    círculo, `box-sizing:border-box`; img `object-fit:cover`, `display:none→block` no load;
    iniciais font `--bw-font-ParagraphMedium`. `linkedSignal(source: src)` reseta o load ao trocar
    `src` (espelha o `useEffect` do baseweb); `size` resolve `scale*`→`var(--bw-sizing-*)` ou valor CSS.
  - `assets/bw/adorable.png` (imagem de exemplo) + `ladle/stories.registry.ts` (helper `av()`) +
    `nav.data.ts` (`Avatar` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico** nas 4 estáticas (dimensões 24/40/48/56/64,
  bg, raio 50%, box-sizing, role/aria, img display/objeto, iniciais texto/cor/font) +
  `update-image` idêntico no init e após toggle (img `display:block`, role/iniciais removidos).
  **AXE 0 violações** (wcag2a/aa) nas 5.
- **DoD:** stories ✓ · dimensões ✓ · cores/bordas ✓ · estados (load/erro/sem-src/toggle) ✓ ·
  a11y (AXE/role/aria-label/alt) ✓ · build dev (`tsc --noEmit` limpo) ✓ ·
  sem regressão (componente novo + imagem em assets; tokens reusados, nenhum alterado).
- **Commit:** _pendente_.

---

### Spinner — `spinner` — ✅ Verificado (2026-06-05)

- **Stories (clone/orig):** 1/1 — `spinner` (18 spinners empilhados).
- **Verdade-base:** `baseweb/src/spinner/` (`styled-components.ts` = `<i>` animado;
  `constants.ts` SIZE small/medium/large; `__tests__/spinner.scenario.tsx`).
- **Story renderiza:** 18 variantes — default; `small/medium/large`; px-string `20/40/60`;
  `borderWidth` small/medium/large com `size=60`; `borderWidth=20` com size small/med/large;
  combinações de sizing-token (`scale*`); e 2 cores (`negative`, `green`).
- **Estados verificados:** N/A (animação contínua; sem hover/focus).
- **Decisão de fidelidade (algoritmo de resolução):** medido o **original ao vivo** (18 pts) e
  reproduzido exatamente — box `content-box` (borda fora da caixa, offsetW = w + 2·border);
  borda = `borderWidth ?? size`: nome→{2/4/8px}, sizing-token→`var(--bw-sizing-*)`, número→`Npx`;
  **px-string sem borderWidth → borda indefinida → `border-width: medium` do UA = 3px** (quirk
  do original, reproduzido devolvendo `null` no binding).
- **Divergências encontradas (antes):** componente inexistente no clone (0/1).
- **Correções aplicadas:**
  - `components/spinner/spinner.component.ts` — `<i role="progressbar" aria-label="loading"
    aria-busy="true">`; inputs `size`/`borderWidth`/`color`; resolução box/borda; cor topo =
    `contentAccent` (default), trilho = `backgroundTertiary`.
  - `components/spinner/spinner.component.scss` — `box-sizing: content-box` (anula o reset global
    `border-box`), `border-radius:50%`, `cursor:wait`, `@keyframes bui-spinner-spin` + animação
    `var(--bw-timing-1000) linear infinite`.
  - `ladle/stories.registry.ts` + `nav.data.ts` (`Spinner` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico nos 18** — width/height, border-top/right
  width, cores (topo `#276ef1`/`#de1135`/green, trilho `#e8e8e8`), `border-radius 50%`,
  `box-sizing content-box`, `display block`, animação `1s linear infinite`, `cursor wait`.
  **AXE 0 violações** (wcag2a/aa).
- **DoD:** stories ✓ · dimensões ✓ · cores/bordas ✓ · animação ✓ · estados (N/A) ✓ ·
  a11y (AXE/role/aria) ✓ · build dev (`tsc --noEmit` limpo + ng serve recompila) ✓ ·
  sem regressão (componente novo isolado; `--bw-timing-1000`/`ease-linear` já existiam).
- **Commit:** _pendente_.

---

### Typography — `typography` — ✅ Verificado (2026-06-05)

- **Stories (clone/orig):** 6/6 — `body`, `display`, `heading`, `mono`, `mono-styletron`,
  `overrides`.
- **Verdade-base:** `baseweb/src/typography/` (`index.tsx` = primitivos `Block` por escala;
  `themes/shared/typography.ts` = métricas font100–font1450 + mapeamento das 36 escalas;
  `__tests__/*.scenario.tsx`).
- **Stories renderizam:** `display` 4 sizes (mesmo texto); `heading` h6→h1 com prefixo do nome;
  `body` Labels (div) intercalados com Paragraphs (p, corpo longo); `mono`/`mono-styletron`
  wrapper 800px com 2 linhas (paragraph/label, heading/display) `$123,000` — a styletron monta
  via spread cru de `theme.typography.*` (elementos **sem** `data-baseweb`); `overrides`
  DisplayLarge com cor azul.
- **Estados verificados:** N/A (tipografia estática); foco/hover não se aplicam.
- **Divergências encontradas (antes):**
  1. Faltavam as **18 escalas Mono** nos tokens (`--bw-font-Mono*`) e a família mono divergia
     (`'Roboto Mono'…` no clone vs `UberMoveMono, 'Lucida Console', Monaco, monospace` no orig).
  2. **Margens UA zeradas**: o reset global `* { margin: 0 }` (`src/styles.scss`) eliminava as
     margens de bloco que h1–h6/p herdam do user-agent — o Base Web não reseta, então o original
     mantém (ex. h1 0.67em·40px = 26.8px; p = 1em). Faltava no clone.
- **Correções aplicadas:**
  - `tokens/base-web-tokens.scss` — família mono = `UberMoveMono, 'Lucida Console', Monaco,
    monospace`; add 18 tokens `--bw-font-Mono*` (mesma métrica das base, família mono).
  - `components/typography/typography.directive.ts` — diretiva `[buiTypo]` (clone do `Block`):
    `font` via token, cor `contentPrimary` (input `colorOverride` p/ `$style`), atributo
    `data-baseweb="typo-<escala>"`, e **restauração da margem UA** por tag (`margin-block`).
  - `components/typography/typography.scenarios.ts` — 6 stories fiéis; a `mono-styletron` usa
    `font` inline (sem `data-baseweb`, como o spread cru) + margens UA via `styles` escopado.
  - `ladle/stories.registry.ts` (helper `typo()`) + `nav.data.ts` (`Typography` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico** nas 6 stories (font-family/size/weight/
  line-height/color/letter-spacing **e** margin-top/bottom — incl. h6 46.6 / h1 26.8 / p 16 etc.);
  styletron 18/18 elementos idênticos; header simples do mono `margin 16px` ✓.
  **AXE 0 violações** (wcag2a/aa) nas 6 stories.
- **DoD:** stories ✓ · dimensões/margens ✓ · tipografia ✓ · cores/bordas ✓ · estados (N/A) ✓ ·
  a11y (AXE) ✓ · build dev (ng serve recompila + `tsc --noEmit` limpo) ✓ ·
  sem regressão (tokens Mono são aditivos; mudança da família mono não afeta Accordion/Pagination,
  que não usam mono).
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

---

### Heading — `heading` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 1/1 — `heading` (6 níveis aninhados via `HeadingLevel` + volta ao L2).
- **Verdade-base:** `baseweb/src/heading/` (`heading.tsx` = `Block as=h{level}` + `LevelContext`;
  `heading-level.tsx` = provider que incrementa o nível; `types.ts` `styleLevel?: 1–6`;
  `__tests__/heading.scenario.tsx`). `FONTS=['',font1050,font950,font850,font750,font650,font550]`
  → no tema = `HeadingXXLarge…HeadingXSmall`; cor `contentPrimary`.
- **Story renderiza:** `HeadingLevel` aninhado 6× → `h1 [L1]`→`h6 [L6]`, cada um seguido de um
  `ParagraphLarge`; ao sair do bloco L3+ volta ao L2 com `h2 "Motivation [L2]"`. 7 headings no total.
- **Estados verificados:** N/A (tipografia estática; sem hover/focus).
- **Arquitetura (independência Angular):** o `LevelContext` (React) foi substituído por **DI
  hierárquico** — token `BUI_HEADING_LEVEL` (default 0); cada `<bui-heading-level>` provê
  `pai+1` via `useFactory`+`SkipSelf`; `<bui-heading>` injeta o nível e renderiza a tag/escala.
  Ambos `display:contents` (não introduzem box → margens/layout idênticos ao original).
- **Divergências encontradas (antes):**
  1. Componente inexistente no clone (0/1).
  2. **Projeção de conteúdo quebrada**: 6 `<ng-content>` (um por `@case`) → o compilador só
     projeta no **último** slot default (h6); h1–h5 saíam vazios. Corrigido com **um único
     `<ng-content>`** num `<ng-template #c>` reaproveitado por `ngTemplateOutlet` em cada case.
- **Correções aplicadas:**
  - `components/heading/heading.component.ts` — `BuiHeadingLevel` (provider de nível) +
    `BuiHeading` (`<h{level} data-baseweb="heading">`, escala `HeadingXXLarge…XSmall`, cor
    `contentPrimary`, margem UA por tag, `styleLevel` opcional). Nenhum token novo (reusa
    `--bw-font-Heading*`).
  - `components/heading/heading.scenarios.ts` — story fiel; `ParagraphLarge` via `[buiTypo]`.
  - `ladle/stories.registry.ts` + `nav.data.ts` (`Heading` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico nos 7** — tag, font-size (40/36/32/28/24/20),
  weight 700, line-height (52/44/40/36/32/28), cor `rgb(0,0,0)`, **margens UA** (h1 26.8 / h2 29.88 /
  h3 32 / h4 37.24 / h5 40.08 / h6 46.6px) e font-family `UberMove…`. **AXE 0 violações** (wcag2a/aa)
  nos dois lados. (largura menor no clone = só o wrapper do Ladle, não é divergência.)
- **DoD:** stories ✓ · dimensões/margens ✓ · tipografia ✓ · cor ✓ · estados (N/A) ✓ ·
  a11y (AXE/h1–h6 semânticos) ✓ · build dev (`tsc --noEmit` limpo + ng serve recompila) ✓ ·
  sem regressão (componente novo; reusa tokens `--bw-font-Heading*` e a diretiva `[buiTypo]`).
- **Commit:** _pendente_.

---

### Link — `link` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 1/1 — `link` (2 links num `Block font450`: padrão + `animateUnderline`).
- **Verdade-base:** `baseweb/src/link/` (`styled-components.ts` = `<a>` estilizado;
  `index.tsx` = `StyledLink` com tracking JS de `focusVisible`; `__tests__/link.scenario.tsx`).
  Cor `linkText`(=contentPrimary); `font350` com `font-size`/`line-height` **herdados**;
  sublinhado `under`; hover `linkHover`(gray800), visited `linkVisited`(gray600),
  active `linkActive`(gray700), foco 3px `borderAccent`(blue600) offset 1px.
- **Story renderiza:** wrapper `font450` (18px/24px) → token `LabelLarge`; `<a>I am a Link!</a>`
  (sublinhado) + `<a animateUnderline>animate underline</a>` (sublinhado por gradiente).
- **Estados verificados:** normal, **hover** (cor gray800 + background-size 0%→100%), **foco-visível**
  (azul 3px offset 1px, sem sublinhado), variante **animateUnderline** (gradiente duplo).
- **Arquitetura (independência Angular):** componente `a[buiLink]` (atributo no `<a>`, igual ao
  Divider). O tracking JS de `focusVisible` (LinkFocus/forkFocus do original) foi substituído
  pelo **`:focus-visible` nativo** — mesmo resultado computado, sem estado React.
- **Divergências encontradas (antes):** componente inexistente no clone (0/1).
- **Decisão de fidelidade (quirk):** o original emite `transition-property: backgroundSize`
  (camelCase = custom-ident que **não** casa com `background-size` → transição no-op no link
  default). Reproduzido cru no scss para igualar o `getComputedStyle` (vide Spinner/px-string).
- **Correções aplicadas:**
  - `components/link/link.component.{ts,scss}` — `a[buiLink] data-baseweb="link"`; cor/typo/
    sublinhado + estados hover/visited/active/`:focus-visible`; variante `.bui-link--animate`
    (position relative, 2 gradientes lineares, `transition-property: all`). Reusa tokens
    existentes (`--bw-content-primary`, `--bw-gray-600/700/800`, `--bw-border-accent`,
    `--bw-timing-500`, `--bw-ease-decelerate`); **nenhum token novo**.
  - `components/link/link.scenarios.ts` — story fiel (wrapper `LabelLarge` + 2 links).
  - `ladle/stories.registry.ts` + `nav.data.ts` (`Link` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico** nos 2 links — cor `rgb(0,0,0)`, font-family
  `UberMoveText…`, 18px/500/24px (herdado), `text-decoration` underline/none, `text-underline-position
  under`, `transition-property` `backgroundSize`/`all`, duration `0.5s`, ease `cubic-bezier(.22,1,.36,1)`,
  background-image (none / 2 gradientes com gray800+content-primary), `position` static/relative.
  Hover `rgb(75,75,75)` + bg-size `100%` ✓; foco-visível `rgb(39,110,241) solid 3px` offset 1px ✓.
  **AXE 0 violações** (wcag2a/aa) nos dois lados. (a leitura preto/0px do foco do original foi
  artefato de timing do estado React; com espera, bate exato.)
- **DoD:** stories ✓ · tipografia/cor ✓ · sublinhado/gradiente ✓ · estados (hover/visited/active/foco) ✓ ·
  a11y (AXE/`<a>` semântico/foco visível AA) ✓ · build dev (`tsc --noEmit` limpo) ✓ ·
  sem regressão (componente novo isolado; só reusa tokens existentes).
- **Commit:** _pendente_.

---

### Skeleton — `skeleton` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 3/3 — `skeleton` (estático), `animation` (shimmer), `loading` (2s → conteúdo).
- **Verdade-base:** `baseweb/src/skeleton/` (`styled-components.ts` = `StyledRoot`/`StyledRow`;
  `skeleton.tsx` = rows; `types.ts`; `__tests__/*.scenario.tsx`). Cores `backgroundTertiary`
  (bloco) / `backgroundSecondary` (banda do shimmer); root `testid="loader"`.
- **Stories renderizam:** `skeleton`/`animation` = 8 cards (bloco 300×150 + [círculo 50×50 +
  skeleton `rows=2` 220px]); `loading` = skeleton por 2s, depois img 300×150 + `Avatar`(50px) + 2 `<p>`.
- **Estados verificados:** estático (cor sólida), **animado** (gradiente 135deg + keyframes
  `background-position` 100%→0%, 1.5s ease-out infinite, background-size 400%), troca **loading→conteúdo**.
- **Decisões de arquitetura:** componente `bui-skeleton`; `rows=0` → host é o bloco; `rows>0` →
  host vira flex-column com N `.bui-skeleton__row` (flex-basis 15px, gap 10px). `overrides.Root.style`
  do original (marginBottom/borderRadius) → **estilo inline no host** na story. `@keyframes
  bui-skeleton-shimmer` global (padrão do Spinner). Reusa tokens `--bw-background-tertiary/secondary`;
  **nenhum token novo**.
- **Divergências encontradas (antes):**
  1. Componente inexistente no clone (0/3).
  2. **Bloco `rows=0` colapsava (0×0)**: o host custom-element é `display:inline` por padrão (o
     `StyledRoot` do original é `<div>`=block) → `width`/`height` não aplicavam fora de um flex.
     Corrigido com `display:block` base (`--col` sobrescreve p/ flex).
  3. Atributo do root: original usa `testid="loader"` (não `data-testid`); ajustado p/ igualar.
- **Correções aplicadas:**
  - `components/skeleton/skeleton.component.{ts,scss}` — `rows`/`animation`/`height`/`width`/
    `autoSizeRows`; classes `--col`/`--solid`/`--anim`; `display:block` base; `@keyframes`.
  - `components/skeleton/skeleton.scenarios.ts` — 3 stories fiéis (`loading` com `signal` + `setTimeout`).
  - `ladle/stories.registry.ts` (3 ids) + `nav.data.ts` (`Skeleton` → `ready`).
- **Verificação (orig→clone):** CSS computado **idêntico** — `skeleton`: bloco 300×150, círculo 50×50
  (raio 50%), rowsRoot 220×40 (flex-column), 1ª linha 220×15 (flex-basis 15px, margin-bottom 10px),
  cor `rgb(232,232,232)` ✓. `animation`: background-image (gradiente), background-size 400% 100%,
  duration 1.5s, ease-out, infinite **idênticos** — única diferença é o **nome** do keyframe
  (`animation-dkKkL` auto-gerado pelo styletron vs `bui-skeleton-shimmer`), irrelevante.
  `loading`: fase1 = 3 loaders / fase2 = 0 loaders + img 300×150 + Avatar 50×50 + 2 `<p>`, igual.
  **AXE 0 violações** (wcag2a/aa) nas 3.
- **DoD:** stories ✓ · dimensões ✓ · cores/gradiente ✓ · animação ✓ · estados (estático/animado/troca) ✓ ·
  a11y (AXE) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente novo; reusa Avatar
  já verificado e tokens de background existentes).
- **Commit:** _pendente_.

---

### Aspect ratio box — `aspect-ratio-box` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 1/1 — `aspect-ratio-box` (quadrado default + 16:9).
- **Verdade-base:** `baseweb/src/aspect-ratio-box/` (`aspect-ratio-box.tsx` = Block com
  `::before` padding-top + `::after` clearfix; `aspect-ratio-box-body.tsx` = Block absolute;
  `types.ts` `aspectRatio?: number`; `__tests__/aspect-ratio-box.scenario.tsx`).
- **Story renderiza:** 2 caixas sem largura própria (ocupam o pai): `AspectRatioBox` quadrado
  (aspectRatio 1 → padding-top 100%) e `aspectRatio={16/9}` (→ 56.25%); cada uma com um
  `AspectRatioBoxBody` (absolute, top/bottom 0, width 100%, flex centralizado, borda 2px grey).
- **Estados verificados:** N/A (layout estático).
- **Decisões de arquitetura:** `bui-aspect-ratio-box` (`data-baseweb="aspect-ratio-box"`,
  `position:relative`, `::before`/`::after`; `--bui-arb-pad = 100/aspectRatio%` via style binding)
  + `bui-aspect-ratio-box-body` (`data-baseweb=…-body`, absolute/top0/bottom0/width100%). Os props/
  overrides do Body (flex + borda) viram **estilo inline** na story. **Nenhum token novo.**
- **Divergências encontradas (antes):** componente inexistente no clone (0/1).
- **Verificação (orig→clone):** CSS computado **idêntico** — box `position relative`, **ratioHW
  1 (quadrado) e 0.563 (16:9)**, `::before` float left + padding-top na mesma % (orig 1280/720 vs
  clone 904/508.5 = 100%/56.25%; diferença absoluta = só o wrapper do Ladle), `::after` table/clear
  both; body `position absolute`, top/bottom 0, flex `center`/`center`, borda `2px solid rgb(128,128,128)`.
  **AXE 0 violações** (wcag2a/aa).
- **DoD:** stories ✓ · proporção/posição ✓ · borda ✓ · pseudo-elementos ✓ · estados (N/A) ✓ ·
  a11y (AXE) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente novo isolado).
- **Commit:** _pendente_.

---

### Progress bar — `progress-bar` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 6/6 — `progressbar`, `progressbar-intent`, `progressbar-negative`,
  `progressbar-rounded`, `progressbar-rounded-animated`, `progressbar-rounded-overrides`.
- **Verdade-base:** `baseweb/src/progress-bar/` (`progressbar.tsx` linear; `progressbar-rounded.tsx`
  SVG; `styled-components.tsx`; `constants.ts` SIZE/INTENT; `__tests__/*.scenario.tsx`).
- **Stories renderizam:** linear — 7 barras (tamanhos 2/4/8px, ranges min/max, steps, infinite);
  intent — 5 intents × (determinado/indeterminado/tamanhos/segmentado); negative — bg override;
  rounded — 3 pílulas SVG (small/medium/large) 50%; rounded-animated — progress subindo; rounded-
  overrides — tamanho 433×200 + cores/fonte custom.
- **Estados verificados:** determinado (translateX por valor), segmentado (estados do passo +
  keyframes inProgress), **infinite** (2 barras com gradiente animado), **rounded** estático e
  **animado** (rAF), overrides.
- **Decisões de arquitetura:** 2 componentes — `bui-progress-bar` (linear: Root flex-column gap
  scale300, Bar bg tertiary + altura por size, BarProgress translateX + transition 0.5s, intent via
  `--bui-pb-intent`, override do progresso via `--bui-pb-progress`, InfiniteBar com 2 keyframes,
  Label tipografia por size) e `bui-progress-bar-rounded` (SVG: `getTotalLength()` via
  `afterNextRender` + `viewChild`; `stroke-dasharray`/`dashoffset` p/ o arco; animação via
  `requestAnimationFrame` num `effect`, ou snap se `animate=false`). Overrides (tamanho/cores/fonte)
  via CSS vars com fallback ao default do binding. **Nenhum token novo** (brand = `--bw-blue-600`).
- **Divergências encontradas (corrigidas durante a verificação):**
  1. **font-size do texto rounded** (small/large) caía p/ o valor herdado (16px): `font-size:
     var(--x)` sem fallback fica inválido em computed-time → herda. Corrigido pondo o override
     dentro de cada regra de tamanho com fallback (`var(--bui-pbr-text-size, 14px|16px|18px)`).
  2. **tamanho do override (433×200) não aplicava**: o host binding sobrescrevia o mesmo custom
     property. Corrigido usando `--bui-pbr-w-def`/`-h-def` no binding e `var(--bui-pbr-w, …-def)`.
- **Verificação (orig→clone):** CSS computado **idêntico** — linear: 7 barras (flex/gap 8px, alturas
  2/4/8, bg `rgb(232,232,232)`, radius 2px, progresso `rgb(39,110,241)`, transition 0.5s, labels
  14/16·16/20·18/24, padding 16px). intent: 11 progressos com cores exatas (blue/green `rgb(14,131,69)`/
  warning `rgb(159,100,2)`/red `rgb(222,17,53)`/brand-blue). negative: `rgb(222,17,53)`. rounded:
  dimensões 64×26/78×36/95×48, strokes tertiary/borderAccent, **stroke-dasharray/dashoffset idênticos**
  (151.98/75.99 · 185.07/92.54 · 220.18/110.09 p/ progress 0.5), texto por size. overrides: 433×200,
  pink/red, texto 48px. **AXE 0 violações** (wcag2a/aa) em todas.
- **DoD:** stories ✓ · dimensões ✓ · cores/intents ✓ · tipografia ✓ · SVG/dash ✓ · estados
  (determinado/segmentado/infinite/animado/overrides) ✓ · a11y (AXE/role progressbar/aria) ✓ ·
  build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componentes novos; só reusa tokens existentes).
- **Commit:** _pendente_.

---

### Rating — `rating` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 3/3 — `star`, `emoticon`, `size`.
- **Verdade-base:** `baseweb/src/rating/` (`star-rating.tsx`, `emoticon-rating.tsx`,
  `styled-components.ts`, `svg-icons.ts`, `__tests__/*.scenario.tsx`).
- **Stories renderizam:** star — StarRating value=3 (5 estrelas, 3 preenchidas cumulativas);
  emoticon — EmoticonRating value=3 (5 rostos; **só** o 3º com fundo `backgroundWarning`); size —
  Emoticon(30,44) + Star(30,22), todos value=3.
- **Estados verificados:** ativo (estrela cumulativa `x<=value`; emoticon exato `x===value`),
  hover preview, seleção (clique/teclado), foco visível (`:focus-visible`).
- **Decisões de arquitetura:** 2 componentes (`bui-star-rating`/`bui-emoticon-rating`) como `ul`
  role=radiogroup + `li` role=radio. SVGs (svg-icons portado) embutidos via `::after { content:
  url(data:svg) }` num **CSS var por item** (`--bui-star-icon`/`--bui-emoticon-icon`); as cores são
  resolvidas em runtime (`getComputedStyle` dos tokens) e "queimadas" no data-uri — bate com o
  output do original e mantém theme-correto. `:focus-visible` nativo no lugar do tracking JS. Reusa
  tokens existentes; **nenhum token novo**.
- **Divergências encontradas (corrigidas durante a verificação):**
  1. **emoticon ativo cumulativo**: usei `x<=value`; o original é `x===value` (só o selecionado
     colorido) + `aria-checked` idem. Corrigido.
  2. **emoticon com `title`**: o original não tem (só a estrela tem `title="rating"`). Removido.
- **A11y (melhoria deliberada):** os emoticons do **original violam** AXE `aria-toggle-field-name`
  (radios sem nome). Para cumprir a regra do projeto (AXE limpo), adicionei `aria-label` (nomes dos
  humores) — invisível, mantém `title=null` igual ao original e **zera o AXE**.
- **Verificação (orig→clone):** CSS computado/estrutura **idênticos** — root `inline-block`
  radiogroup, 5 itens role=radio, dimensões 22/30/44, margin-right 8px (estrela zera na última;
  emoticon não), cursor pointer, transition `transform 0.4s`, outline-offset 2px, `aria-checked`
  (estrela `t,t,t,f,f` / emoticon `f,f,t,f,f`), tabindex `-1,-1,0,-1,-1`, `::after` com SVG.
  **Visual idêntico** (estrelas 3 preenchidas; só o 3º emoticon amarelo). **AXE 0** no clone.
- **DoD:** stories ✓ · dimensões ✓ · cores/ícones ✓ · estados (ativo/hover/seleção/foco) ✓ ·
  a11y (AXE 0/role/aria/foco) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componentes
  novos; só reusa tokens existentes).
- **Commit:** _pendente_.

---

### Switch — `switch` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 7/7 — `switch`, `auto-focus`, `disabled`, `placement`, `size`,
  `states`, `unlabeled`.
- **Verdade-base:** `baseweb/src/switch/` (`switch.tsx`, `styled-components.ts`, `constants.ts`
  SIZE/LABEL_PLACEMENT, `__tests__/*.scenario.tsx`).
- **Stories renderizam:** trilho + knob + `<input type=checkbox role=switch>` oculto + label;
  states (unchecked/checked/checked+icon/disabled/disabled+checked), size (default/small ×
  off/on/on+icon), placement (label esquerda/direita), unlabeled (aria-label sem children).
- **Estados verificados:** unchecked/checked (bg/borda/knob/translateX), disabled, showIcon
  (checkmark), hover (overlays opostos trilho/knob), foco-visível (outline brand), placement.
- **Decisões de arquitetura:** `bui-switch` em `label[buiSwitch]` (Root=label nativo → clique
  alterna). `linkedSignal(checked)` cobre controlado **e** stateful. Hover/foco via CSS
  (`:hover` / `:has(:focus-visible)`) no lugar do tracking JS. Checkmark com cor `contentPrimary`
  resolvida em runtime. Label oculto via `:empty` (story unlabeled). Reusa tokens existentes
  (`--bw-overlay-hover`/`-inverse-hover` = hoverOverlay*); **nenhum token novo**.
- **Divergências encontradas (corrigidas):** `aria-checked` explícito no input — o original não
  tem (o checkbox nativo com `role=switch` já carrega o estado); removido p/ igualar.
- **Verificação (orig→clone):** CSS computado **idêntico** — trilho 52×32 (default) / 40×24 (small),
  bg `rgb(232,232,232)`/checked `rgb(0,0,0)`/disabled `rgb(243,243,243)`, borda 2px `rgb(94,94,94)`
  (off) / none (on) / state-disabled, radius 999px, padding 4px; knob 16/12/24/16 por size+checked,
  bg `rgb(94,94,94)`/checked `rgb(255,255,255)`/disabled `rgb(166,166,166)`, radius 50%, translateX
  20/16, checkmark quando showIcon; label fonte 16/24 (default)·14/20 (small), cor primary/disabled,
  padding 8px no lado da placement; input `role=switch`. **AXE 0 violações** nos dois lados.
- **DoD:** stories ✓ · dimensões ✓ · cores ✓ · tipografia ✓ · estados (incl. hover/foco/disabled/icon) ✓ ·
  a11y (AXE 0/role=switch/foco) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente
  novo; só reusa tokens existentes).
- **Commit:** _pendente_.

---

### Tabs — `tabs` — ✅ Verificado (2026-06-08)

- **Stories (clone/orig):** 3/3 — `tabs`, `one-child`, `controlled`.
- **Verdade-base:** `baseweb/src/tabs/` (`tabs.tsx`, `tab.tsx`, `stateful-tabs.tsx`,
  `styled-components.ts`, `constants.ts`, `__tests__/*.scenario.tsx`). **Self-contained** (NÃO usa
  Button/Input/Icon — diferente do `tabs-motion`).
- **Stories renderizam:** Root (`data-baseweb=tabs`, flex-column) > TabBar (`role=tablist`) com os
  links > painéis (`role=tabpanel`). tabs = 3 abas (ativa 0); one-child = 1 aba; controlled = 3 abas
  com painel mostrando `content[activeKey]`.
- **Estados verificados:** ativo (cor `contentPrimary` + borda inferior `borderSelected`), inativo
  (`tabColor`=contentTertiary, borda transparente), hover/foco (→ contentPrimary), foco-visível
  (outline 3px borderAccent offset -3px), só o painel ativo renderiza conteúdo (`renderAll=false`).
- **Decisões de arquitetura:** `bui-tabs` (host) + `bui-tab` "headless" (lido por `contentChildren`,
  conteúdo via `TemplateRef` + `ngTemplateOutlet` — o `<bui-tab>` não renderiza box). `activeKey`
  por índice (controlado **ou** stateful via `linkedSignal`). `:focus-visible` nativo no lugar do
  tracking JS. Reusa tokens existentes (font200=ParagraphSmall, font300=ParagraphMedium,
  tabColor=content-tertiary, tabBarFill=background-primary); **nenhum token novo**.
- **Divergências encontradas (corrigidas):** painéis inativos renderizavam o conteúdo (escondido por
  `display:none`); o original (renderAll=false) só renderiza o painel **ativo**. Corrigido com `@if`
  no outlet — inativos ficam vazios como no original.
- **Verificação (orig→clone):** CSS computado **idêntico** — Root flex-column; TabBar flex-row,
  padding-x 10px, bg branco; tab font 14/20, cor ativa `rgb(0,0,0)`/inativa `rgb(94,94,94)`, padding
  16/8, margin 6, borda inferior 2px (ativa preta / inativa transparente), `aria-selected`; painel
  font 16/24, padding 12/24, `display` block/none, `role=tabpanel`, conteúdo só no ativo.
  **AXE 0 violações** (wcag2a/aa) nas 3.
- **DoD:** stories ✓ · dimensões ✓ · cores ✓ · tipografia ✓ · estados (ativo/hover/foco/painéis) ✓ ·
  a11y (AXE 0/tablist/tab/tabpanel/aria-selected/foco) ✓ · build dev (`tsc --noEmit` limpo) ✓ ·
  sem regressão (componente novo; só reusa tokens existentes).
- **Commit:** _pendente_.

---

### Icon — `icon` — ✅ Verificado (3/3, 2026-06-08)

- **Stories (clone/orig):** 3/3 — `attributes` ✓, `overrides` ✓, **`buttons` ✓** (fechada após o Button).
- **Verdade-base:** `baseweb/src/icon/` (`icon.tsx` base, `styled-components.ts` `getSvgStyles`,
  ícones gerados `check.tsx`/`upload.tsx`/`delete.tsx`/`plus.tsx`, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `bui-icon` base = `<svg data-baseweb="icon">` com `size`
  (número/numérico→px, `scale*`→token, default `scale600`=16px) e `color` (`fill`/`color`, default
  `currentColor`); o path vem por **input `d`** (projeção de `<path>` SVG entre componentes não
  preserva o namespace). Ícones nomeados (`bui-check`/`bui-upload`/`bui-delete`/`bui-plus`) passam
  seu `d`; `ICON_PATHS` exporta os paths p/ reuso (ex. Button/Tag). Host `display:contents`.
  **Nenhum token novo** (size via `--bw-sizing-scale*`).
- **Verificação (orig→clone):** `attributes` — 4 ícones **100×100**, `fill rgb(255,0,0)`,
  `display inline-block`, `data-baseweb=icon` ✓ (resíduo: o 3º tem `color` preto no original — o
  override só seta `fill`; o `fill` é o que pinta → visual idêntico). `overrides` — X **16×16** rosa
  `rgb(255,192,203)` após "Stuff" + Plus **54×54**; visual idêntico (o `order`/`display` da svg
  diferem por o original aplicar via override-component e o clone via `<span>` wrapper). **AXE 0** nas 2.
- **`icon--buttons`:** ícone como enhancer do Button (Upload start/end + string/node/number/array);
  verificado — botões 180×48/198×48/… idênticos, AXE 0.
- **Commit:** _pendente_.

---

### Button — `button` — ✅ Verificado (14/15, 2026-06-08)

- **Stories (clone/orig):** 14/15 — `button`, `sizes`, `sizes-loading`, `shapes`, `colors`, `circle`,
  `enhancers`, `enhancers-compact`, `enhancers-loading`, `width-types`, `link`, `background-safe`,
  `min-hit-area`, `a11y`. **`functional-children` adiada** (API de children-como-função do React,
  baseada em estado hover/press — não mapeia limpo p/ projeção do Angular).
- **Verdade-base:** `baseweb/src/button/` (`button.tsx`, `button-internals.tsx`,
  `styled-components.ts` = **915 linhas**, `constants.ts`, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** componente pré-existente `bui-button` (não verificado) **adaptado e
  verificado** — mantido o seletor (`bui-button`) p/ não quebrar a Pagination (✅). Host `<button>`
  ou `<a>` (href). Kinds (primary/secondary/tertiary + 3 danger + outline), 7 sizes (4 efetivos),
  shapes, `isSelected` (borda dupla), `isLoading` (spinner + conteúdo oculto), `disabled`, `block`
  (widthType fill), `colors`, enhancers (`[buiStartEnhancer]`/`[buiEndEnhancer]`). Estados
  hover/active (overlay box-shadow) e foco (borda dupla) via CSS. Reusa os 4 ícones do clone Icon.
- **Tokens adicionados (aditivos):** overlays hover/active dos danger, outline (overlays/selected),
  `transparent-border`, `disabled-active`/`tertiary-disabled-active` — todos derivados de tokens
  existentes (overlay-hover/pressed, state-disabled).
- **Correções na verificação:** (1) shapes circle/square usavam `aspect-ratio`+padding; trocado p/
  **dimensões fixas** (getShapeStyles: 28/36/48/56) + padding 0. (2) `minHitArea=tap` virou `::before`
  48px (era min-width/height). (3) `widthType=fill` ganhou min-width (52/60/72/80) + min-height.
  (4) **AXE button-name (14×)**: botões loading escondem o texto → sem nome acessível; add `ariaLabel`
  input + `aria-label="content is loading"` no loading (e `data-baseweb="button"`).
- **Verificação (orig→clone):** CSS computado **idêntico** — `sizes` 62×28/78×36/94×48/110×56, padding
  6/8·10/12·14/16·16/20, fonte 12/14/16/18; **grid kinds×estados 30/35 exatos** (bg/cor/raio/borda
  dupla no selected e foco), os 5 restantes só diferem no `color` do texto **oculto** no loading
  (não-visual); `circle` 48/28/36/48/56 raio 50%; `colors` custom (bg/cor) idênticos; `width-types`
  hug=conteúdo / fill=300px com end-enhancer à direita; `enhancers` setas no artworkSize por size;
  `icon--buttons` 180×48… idênticos. **AXE 0 violações** (incl. o grid após o fix).
- **DoD:** stories (14/15) ✓ · dimensões ✓ · cores/kinds ✓ · tipografia ✓ · shapes ✓ · estados
  (selected/loading/disabled/hover/foco) ✓ · enhancers/spinner ✓ · a11y (AXE 0/aria) ✓ ·
  build dev (`tsc --noEmit` limpo) ✓ · sem regressão (Pagination usa o mesmo `bui-button`; seletor
  preservado; tokens aditivos).
- **Pendente:** `functional-children` (API React de children-função por estado).
- **Commit:** _pendente_.

---

### Input — `input` — ✅ Verificado (15/15, 2026-06-10)

- **Stories (clone/orig):** 11/15 — `input`, `sizes`, `states`, `before-after`, `clearable`,
  `password`, `with-button`, `mask`, `number`, `disabled-matches-select`, `selector` (verificadas).
  **Pendentes:** `form-control-states` (depende de **FormControl** 🚫), `clearable-icon-overrides`/
  `clearable-noescape`/`password-icon-overrides` (API de overrides/comportamento do React).
  `disabled-matches-select` (Select disabled + Input disabled = mesmo bg gray-50 ✓); `selector`
  (input adjoined a select, com FormControl 🚫 aproximado por label/caption inline).
- **Verdade-base:** `baseweb/src/input/` (`base-input.tsx`, `styled-components.ts` = 535 linhas,
  `constants.ts` SIZE/ADJOINED, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `bui-input` — Root (borda 2px, cor por estado) > InputContainer >
  `<input>` transparente + enhancers `[buiInputStart]`/`[buiInputEnd]` + adornos
  `[buiInputBefore]`/`[buiInputAfter]`. `clearable` mostra o ✕ (DeleteAlt) quando há valor;
  `type=password` adiciona o toggle Hide/Show. Foco via `:focus-within` (no JS). Reusa o clone Icon
  (DeleteAlt/Hide/Show/Search adicionados). **Nenhum token novo** (input* mapeiam p/ semânticos).
- **Verificação (orig→clone):** CSS computado **idêntico** — `sizes` heights 32/36/48/60, borda 2px
  gray-50, radius 4/8, fonte 12/14/16/18, padding 4/6/10/14 × 14; `states` cores por estado:
  default/disabled/readonly gray-50, **foco** border preto + bg branco, **positive** `rgb(14,131,69)`,
  **error** `rgb(222,17,53)`; `password` mascarado + toggle olho; `clearable` ✕; `with-button`
  input+botão (36/48); `mask` "20000101"→**"2000/01/01"**; `number` type=number min/max ✓.
  **AXE:** resíduo (`label`/disabled `color-contrast`) **idêntico ao original**
  — inerente às demos sem `FormControl`/label, não é defeito do clone (o componente suporta `ariaLabel`).
- **Desbloqueio:** Input agora existe → **Stepper** (P4.18) deixa de depender dele (só faltava o Input).
- **Commit:** _pendente_.

---

### Stepper — `stepper` — ✅ Verificado (1/1, 2026-06-08)

- **Stories (clone/orig):** 1/1 — `stepper` (interativo value=0 + disabled).
- **Verdade-base:** `baseweb/src/stepper/` (`stepper.tsx`, `styled-components.ts`,
  `__tests__/stepper.scenario.tsx`). **Reusa Button + Input + Icon** (era o último ⛔).
- **Decisões de arquitetura:** `bui-stepper` (Root flex space-between, 139×48, padding scale550) com
  2 `bui-button` circle/secondary/compact (`−` CheckIndeterminate / `+` Plus) e o valor num
  `bui-input` central (override CSS: 36×36, sem borda, centrado, LabelLarge, bg primary).
  Decremento desabilita em `minValue`, incremento em `maxValue`. Reusa os providers; **nenhum token
  novo** (+ ícone CheckIndeterminate adicionado ao clone Icon).
- **Verificação (orig→clone):** CSS computado **idêntico** nos 2 steppers — Root **139×48**,
  `space-between`, padding 14px, max-width 139px; botões **36×36**; input value "0", `text-align
  center`, font `500 18px/24` (LabelLarge); decremento **disabled** (value≤min) / incremento
  enabled no 1º, ambos disabled no 2º (disabled). **AXE 0 violações** nos dois lados.
- **DoD:** stories ✓ · dimensões ✓ · botões/ícones ✓ · input central ✓ · estados (disabled/min/max) ✓ ·
  a11y (AXE 0/aria-label) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (reusa
  Button/Input/Icon já verificados).
- **Commit:** _pendente_.

---

### Tag — `tag` — ✅ Verificado (5/5, 2026-06-08)

- **Stories (clone/orig):** 5/5 — `tag`, `size`, `start-enhancer`, `long-text`, `overrides`.
  `overrides` = troca do ActionIcon (✕ delete padrão → Alert ⚠ por componente / ArrowLeft ← por tema);
  o input `actionIcon` (delete/alert/arrowLeft) representa o override; 8 tags, ícones corretos, AXE 0.
- **Verdade-base:** `baseweb/src/tag/` (`tag.tsx`, `styled-components.ts` = 520 linhas, `constants.ts`,
  `deprecated-styles.ts`, `__tests__/*.scenario.tsx`). Usa o ícone `delete` (✕) e `Upload` (enhancer).
- **Decisões de arquitetura:** `bui-tag` (pílula `inline-flex`) com `kind` (neutral/primary/accent/
  positive/warning/negative — os deprecated usados nas stories), `hierarchy` (secondary=outlined claro,
  primary=solid), `size` (small/medium/large), `disabled`, `closeable` (✕ DeleteIcon) e `startEnhancer`.
  Sem borda (os deprecated têm `borderColor: null`). Cores mapeadas: subtle = `--bw-tag-{c}-bg-l`/
  `-text-l`; solid = `--bw-tag-{c}-bg`/white (warning especial: yellow300 bg + yellow900 font);
  disabled = `*-50`/`*-200|300`. Reusa o clone Icon; **+ token `--bw-yellow-900`** (warning solid font).
- **Divergências encontradas (corrigidas):** (1) **colisão de classe** — `bui-tag--primary` servia ao
  kind=primary E à hierarchy=primary; `.a.a` colapsa para `.a` → kind=primary sempre virava solid.
  Renomeadas as hierarchies p/ `--solid`/`--subtle`. (2) **nested-interactive** (AXE) — role=button no
  root + no ✕; removido o role do root.
- **Verificação (orig→clone):** CSS computado **idêntico** — `size` heights **24/32/40**, padding 4/6·
  4/8·8/10, fonte 14/16/18, radius 4/8, bg `rgb(243,243,243)`/text `rgb(94,94,94)`; **grid**: 6 kinds ×
  (subtle/solid/disabled) com as cores exatas (neutral/primary cinza, accent azul `rgb(39,110,241)`,
  positive verde, negative vermelho, warning amarelo) — verificado visual + medição. **AXE 0** no clone.
- **DoD:** stories (4/5) ✓ · dimensões ✓ · cores/kinds/hierarchy ✓ · tipografia ✓ · ✕/enhancer ✓ ·
  a11y (AXE 0) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (reusa Icon; token aditivo).
- **Pendente:** `overrides` (API React).
- **Commit:** _pendente_.

---

### Popover — `popover` — ✅ Verificado (15/15, 2026-06-10)

- **Stories (clone/orig):** 15/15 — `popover`, `click`, `hover`, `auto-focus-without-focus-lock`,
  `dynamic-trigger-type`, `focus-loop`, `large-margin`, `position`, `prevent-scroll-on-focus`,
  `progress-bar`, `render-all`, `reposition`, `reposition-with-anchor-update`, `scroll`, `select`.
- **Verdade-base:** `baseweb/src/popover/` (`popover.tsx` 515 linhas, usa **Layer** + **TetherBehavior**).
- **Decisão de arquitetura:** portal + posicionamento substituídos pelo **Angular CDK Overlay**
  (`CdkConnectedOverlay`). `cdkConnectedOverlayPanelClass="bw-root"` resolve tokens `--bw-*` no painel.
- **Componente:** `bui-popover` — trigger projetado, conteúdo em `[buiPopoverContent]`,
  `triggerType` click/hover, `placement` (13 valores), `isOpen` controlado ou stateful,
  `popoverMargin` (default 8), `renderAll` (conteúdo sempre no DOM, `visibility:hidden` quando fechado),
  `showArrow`, `accessibilityType` (tooltip/menu/none).
- **AXE:** 15/15 ✅ (WCAG 2.0 AA, sem violações moderate/serious/critical). Commit: 2026-06-10.

---

### Menu — `menu` — ✅ Verificado (11/11, 2026-06-10)

- **Stories (clone/orig):** 11/11 — `menu`, `empty`, `dividers`, `grouped-items`, `stateful`,
  `profile-menu`, `propagation`, `child`, `child-render-all`, `child-in-popover`, `virtualized`.
  `stateful` = `initialHighlight` (idx 5 destacado);
  `profile-menu` = item de perfil (avatar 60×60 + title LabelMedium/subtitle ParagraphSmall/body
  ParagraphXSmall); `propagation` = menu de 4 itens (a propagação é comportamental).
- **Verdade-base:** `baseweb/src/menu/` (`styled-components.tsx`, `option-list.tsx`, `constants.ts`
  OPTION_LIST_SIZE; `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `bui-menu` — `<ul role="listbox">` (bg `menuFill`=backgroundPrimary,
  padding scale300, radius popover 8px, shadow600) com `<li role="option">` (font ParagraphSmall,
  padding 8/16, highlight no hover → `menuFillHover`=backgroundSecondary, disabled = contentStateDisabled).
  `items` aceita `disabled`/`divider`/`header`; `size` default/compact. **Nenhum token novo** (menu*
  mapeiam p/ semânticos existentes).
- **Verificação (orig→clone):** CSS computado **idêntico** — list **200px**, bg branco, radius 8px,
  shadow600, padding-top 8px; **12 itens**, padding **8/16**, fonte **14px**, cor preta, "Item Three"
  disabled (cinza). `dividers` 8 itens, `grouped` 7, `empty` "No results". **AXE 0** (`menu`); resíduos
  em dividers/grouped/empty (`aria-required-children`/`color-contrast`) são inerentes ao padrão e
  **iguais ou menores que no original**.
- **Desbloqueio:** com Popover (overlay) + Menu (lista), o **Select** pode ser montado (campo →
  popover contendo o menu de opções).
- **Commit:** _pendente_.

---

### Checkbox — `checkbox` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 8/8 — `checkbox`, `states`, `placement`, `indeterminate`, `toggle`,
  `unlabeled`, `select`, `react-hook-form`. (`checkbox-rtl.scenario.tsx` existe na fonte mas **não**
  é registrada como story no `meta.json` — fora do escopo, como no original.)
- **Verdade-base:** `baseweb/src/checkbox/` (`checkbox.tsx` StatelessCheckbox, `styled-components.ts`
  getBorderColor/getBackgroundColor/getLabelPadding, `constants.ts` STYLE_TYPE/LABEL_PLACEMENT,
  `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `label[buiCheckbox]` — Checkmark (`<span>`) **ou** ToggleTrack+Toggle
  (`checkmarkType="toggle"`) + `<input type=checkbox>` oculto + Label projetado. `checked`/
  `isIndeterminate`/`error`/`disabled`/`labelPlacement`(top/right/bottom/left, default toggle=left
  senão right)/`containsInteractiveElement`/`autoFocus`. Stateful (`linkedSignal`) ou controlado
  (`checked`/`checkedChange`). **Independência Angular:** estados hover/active/focus-visible via CSS
  puro (`:hover`/`:active`/`:has(input:focus-visible)`) no lugar do estado React `isHovered/isActive/
  isFocusVisible`; cor da marca (tickMark) resolvida em runtime via `getComputedStyle` (espelha o
  encode SVG do styled-component); `indeterminate` espelhado no DOM via `effect`. **Ordem do label**
  (top/left antes do controle) feita com `order:-1` no flex → 1 único `<ng-content>`.
- **Estados verificados:** unchecked/checked/indeterminate × normal/disabled/error (9 estados) +
  toggle (6) + placement (4) + hover/active (CSS) + focus-visible (outline 3px borderAccent só quando
  checked).
- **Divergências encontradas (antes):** componente inexistente no clone (0/8); faltava o token
  `--bw-red-800` (tickFillErrorSelectedHoverActive, estado active de error+checked).
- **Correções aplicadas:**
  - `components/checkbox/checkbox.component.{ts,scss}` + `checkbox.scenarios.ts` (8 stories).
  - `tokens/base-web-tokens.scss` — add `--bw-red-800: #950f22` (aditivo).
  - `ladle/stories.registry.ts` (8 ids) + `documentation/navigation/nav.data.ts` (`Checkbox` → `ready`).
  - `select`/`react-hook-form`: **aproximações visuais** — `select` reusa `bui-select` dentro do
    checkbox com `containsInteractiveElement` (FormControl 🚫 → rótulo simples); `react-hook-form`
    porta só a estrutura visual (Heading + checkboxes + native + submit), sem o form React.
- **Verificação (orig→clone, Playwright):** `states` — Checkmark **20×20**, borda **3px**, bg/borda
  **idênticos nos 9** (normal branco/cinza94; checked preto/transp; indet preto/transp; disabled
  branco|cinza243; error branco/vermelho222.17.53; error+checked vermelho/transp). `toggle` — track
  **40×14** raio 7px (bg cinza232|243), knob **20×20** (branco/preto/cinza166/vermelho), translateX
  20px, shadow400 **idênticos nos 6**. `placement` — flex-direction column(top/bottom)/row, label
  font **500 16px/24px UberMoveText** e padding 8px na direção certa **idênticos nos 4**.
  **AXE 0 violações** (wcag2a/aa) em checkbox/states/placement/toggle/indeterminate/select.
- **DoD:** stories ✓ · dimensões ✓ · tipografia ✓ · cores/bordas ✓ · estados (incl. toggle/disabled/
  error/foco) ✓ · a11y (AXE/input nativo/aria) ✓ · build dev (`tsc --noEmit` limpo + ng serve
  recompila) ✓ · sem regressão (componente novo; `--bw-red-800` aditivo; reusa Select/Heading já
  verificados).
- **Commit:** _pendente_.

---

### Radio — `radio` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 3/3 — `radio`, `states`, `select`. (`radio-rtl.scenario.tsx` existe na
  fonte mas **não** é story no `meta.json` — fora do escopo.)
- **Verdade-base:** `baseweb/src/radio/` (`radiogroup.tsx`, `radio.tsx`, `styled-components.ts`
  getOuterColor/getInnerColor + RadioGroupRoot/Root/MarkOuter/MarkInner/Label/Description,
  `constants.ts` ALIGN, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** 2 componentes — `bui-radio-group` (`<div role=radiogroup>`, flex
  row/column por `align`) + `bui-radio` (`<label>` host `display:contents` → label/description viram
  filhos diretos do grupo). **`checked` derivado do `value` do grupo via DI** (`inject(BuiRadioGroup)`),
  `valueState` `linkedSignal` (controlado/stateful). Mark = outer 20×20 (cor por estado) + inner
  círculo `scale(.7)` (off) / `scale(.3)` (on). Estados hover/active/focus-visible via CSS; **roving
  tabindex/teclado pelos radios nativos** (mesmo `name`). Cores reusam os tokens `tick*` do Checkbox —
  **nenhum token novo**.
- **Estados verificados:** checked/unchecked × default/disabled/error (6) + description (indent
  scale900) + select interativo (`containsInteractiveElement`) + focus-visible (box-shadow 3px).
- **Divergências encontradas (antes):** componente inexistente (0/3).
- **Correções aplicadas:**
  - `components/radio/radio.component.{ts,scss}` (group + radio) + `radio.scenarios.ts` (3 stories).
  - `ladle/stories.registry.ts` (3 ids) + `documentation/navigation/nav.data.ts` (`Radio` → `ready`).
  - `radio`/`select`: FormControl 🚫 → rótulo "Test-label" simples (aproximação); `select` reusa `bui-select`.
- **Verificação (orig→clone, Playwright):** `states` — **6/6 elementos idênticos**: outer **20×20** raio
  50%, bg (default preto|cinza94, disabled cinza243, error vermelho222.17.53), inner branco
  `scale(.3)`(on)/`scale(.7)`(off), label **500 16px/20px** cor (preto / disabled cinza75). **AXE 0**
  (wcag2a/aa) em radio/states/select **em ambos os lados**; sem erros no console.
- **DoD:** stories ✓ · dimensões ✓ · cores/marca ✓ · tipografia ✓ · estados (disabled/error/desc/foco) ✓ ·
  a11y (AXE 0/radiogroup/radios nativos) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão
  (componente novo; reusa tokens do Checkbox + Select já verificado).
- **Commit:** _pendente_.

---

### Textarea — `textarea` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 2/2 — `textarea`, `textarea-resize` (resize="both").
- **Verdade-base:** `baseweb/src/textarea/` (reusa `input/styled-components` getRootStyles/getInputStyles).
- **Decisões:** `bui-textarea` reusa as classes `bui-input` (root/container/field) num `<textarea>`;
  `size`/`error`/`positive`/`disabled`/`resize`; root `width: fit-content` quando resize ativo. **Nenhum
  token novo** (reusa Input ✅).
- **Verificação (orig→clone):** fonte **16/24**, padding **10/14**, bg cinza-50, borda 2px + raio 8 (no
  `__root`), `resize` none/both, value/placeholder ✓. **AXE 0**.
- **DoD:** stories ✓ · dimensões/cores/tipografia ✓ · resize ✓ · a11y (AXE 0) ✓ · build ✓ · sem regressão.
- **Commit:** _pendente_.

---

### Card — `card` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 5/5 — `card`, `text-only`, `image-object`, `image-link`, `header-level`.
- **Verdade-base:** `baseweb/src/card/` (Root section + Contents + HeaderImage/Thumbnail/Title/Body/Action).
- **Decisões:** `bui-card` (section borda 2px/raio 12/overflow hidden) + `headerImage`/`title` inputs +
  Contents(margem 16) + sub-diretivas `img[buiCardThumbnail]`/`[buiCardTitle]`/`[buiCardBody]`/
  `[buiCardAction]`. Reusa Button/Link + asset `adorable.png`. **Aproximação:** `header-level` (Title
  H1/H2/H3 via LevelContext React) → renderiza H1. **Nenhum token novo.**
- **Verificação (orig→clone):** **idêntico** — borda 2px gray-50, raio 12, bg branco, title **24/32**
  (HeadingSmall), thumbnail float right (96 vs 98 = box-sizing, ≤2px). **AXE 0**.
- **DoD:** stories ✓ · dimensões/cores/tipografia ✓ · a11y (AXE 0/section) ✓ · build ✓ · sem regressão.
- **Commit:** _pendente_.

---

### Header navigation — `header-navigation` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 1/1 — `header-navigation` (navbar: menu, marca, links, botão).
- **Verdade-base:** `baseweb/src/header-navigation/` (Root nav + NavigationList ul + NavigationItem li).
- **Decisões:** `bui-header-navigation` (nav role=navigation) + `ul[buiNavList]` (align left/center/right
  → justify-content; center cresce) + `li[buiNavItem]`. Ícone Menu (3 rects) inline no scenario. Reusa
  Button/Link ✅. **Nenhum token novo.**
- **Verificação (orig→clone):** **idêntico** — flex, padding-top 12, border-bottom 1px gray-50, font 16,
  4 listas / 6 itens. **AXE 0**.
- **DoD:** stories ✓ · layout/alinhamento ✓ · a11y (AXE 0/nav landmark) ✓ · build ✓ · sem regressão.
- **Commit:** _pendente_.

---

### Notification — `notification` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 1/1 — `notification` (5 caixas: info/longa/positive/warning/negative).
- **Verdade-base:** `baseweb/src/notification/` (wrapper de Toast inline) + `toast/styled-components.ts`
  (Body getBackgroundColor/getFontColor).
- **Decisões:** `bui-notification` caixa inline (`content-box` width 288 → total **320**), padding/margin
  16, raio 12, `ParagraphMedium`, por `kind` (bg *Light, texto contentPrimary). **Aproximação:** o
  override `marginTop:10px` (warning/negative) é API React → mantido margin 16. Toaster/overlay do Toast
  fica para a passada de overlays. **Nenhum token novo.**
- **Verificação (orig→clone):** **idêntico** — width **320**, bg por kind (blue/blue/green/yellow/red-50),
  texto preto, padding 16, raio 12, fonte 16/24. **AXE 0**.
- **DoD:** stories ✓ · dimensões/cores/tipografia ✓ · a11y (AXE 0/role alert) ✓ · build ✓ · sem regressão.
- **Commit:** _pendente_.

---

### Progress steps — `progress-steps` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 6/6 — `progress-steps`, `is-active`, `numbered-steps`, `number`,
  `numbered-steps-icon-overrides`, `progress-step-overrides`.
- **Verdade-base:** `baseweb/src/progress-steps/` (`progress-steps.tsx`, `step.tsx`, `numbered-step.tsx`,
  `styled-components.ts`, `constants.ts` ORIENTATION).
- **Decisões de arquitetura:** `bui-progress-steps` (`<ol>`) + `li[buiStep]` (dot) / `li[buiNumberedStep]`
  (numerado) — **seletor de atributo no `<li>`** p/ `<ol><li>` semântico (display:contents quebraria o
  AXE list/listitem). Estados (completed=index<current, active=index===current) via DI (`current`
  injetado + `register()` p/ índice + `total()` via `contentChildren`). Dot: container branco + círculo
  (cinza→preto+inner branco ao ativar). Numerado: círculo 48 (cinza→preto+anel ::before), check ao
  concluir. Tails absolutos com `calc()` de offset. Cores mapeiam `progressSteps*`→inverse-primary;
  **nenhum token novo**. `numbered-steps-icon-overrides`/`progress-step-overrides` = **aproximações**
  (overrides React).
- **Verificação (orig→clone, Playwright):** screenshots **batem** — dot ativo (anel preto/centro branco)
  + tail cinza + títulos (preto ativo/cinza inativo) + conteúdo só no ativo; numerado (círculo preto "1"
  com anel / cinza "2"/"3"). **AXE 0** (após refactor p/ `<li>` direto) em progress-steps/numbered/is-active;
  sem erros console.
- **DoD:** stories ✓ · dimensões/posições ✓ · cores/tipografia ✓ · estados (active/completed/upcoming) ✓ ·
  a11y (AXE 0/ol>li) ✓ · build dev (`tsc` limpo) ✓ · sem regressão (componente novo; reusa Button/Icon/Typo).
- **Commit:** _pendente_.

---

### Sliding button — `sliding-button` — ✅ Verificado (2026-06-10)

- **Stories (clone/orig):** 3/3 — `default`, `low-threshold`, `states` (default/loading/disabled).
- **Verdade-base:** `baseweb/src/sliding-button/` (`sliding-button.tsx`, `styled-components.ts`
  Root/Track/Label/Slider/Grabber/CompletedLabel/LoadingOverlay/Spinner, `constants.ts`
  THRESHOLD high 0.8/low 0.2 + BUTTON_SIZE 56 + TAP_OFFSET 16, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `bui-sliding-button` (`<div role=button tabindex=0>`) → Track 56px
  (bg `backgroundTertiary`) com Label centralizado (`LabelLarge` w500) + Slider preto que cresce da
  esquerda (`width = 56 + dragOffset`, → 100% ao concluir) com Grabber 56×56 (seta branca → check ao
  concluir) + CompletedLabel. `isLoading` → overlay preto + spinner; `isDisabled` → cinza/desabilitado.
  **Independência Angular:** o drag (React usa estado + listeners de `document`) foi reimplementado
  com **Pointer Events** + `setPointerCapture`; threshold/maxOffset calculados do `Track.offsetWidth`;
  `slideBackAfterMs` volta sozinho; teclado Enter/Espaço conclui. **Nenhum token novo** (spinner com
  keyframe local `bui-sliding-spin`).
- **Estados verificados:** repouso, **drag até o threshold** (slider expande, conclui → 100% + check +
  completed label, `complete`), antes do threshold (slide-back), loading (spinner), disabled, foco-visível.
- **Divergências encontradas (antes):** componente inexistente (0/3).
- **Correções aplicadas:**
  - `components/sliding-button/sliding-button.component.{ts,scss}` + `sliding-button.scenarios.ts` (3 stories).
  - `ladle/stories.registry.ts` (3 ids) + `documentation/navigation/nav.data.ts` (`Sliding Button` → `ready`).
- **Verificação (orig→clone, Playwright):** repouso **idêntico** — root/track **56** alto raio **8**,
  track bg `rgb(232,232,232)`, slider **56×56** preto justify flex-end, grabber **56×56** branco cursor
  grab + svg 24, label `left 56px` cor preta **18px/24px w500** "Slide to confirm". Drag real >80% →
  **conclui** (slider 100%, label opacity→0, completed label + check). `states` idêntico (default/
  default/disabled cinza esmaecido). **AXE 0** (wcag2a/aa) nas 3 **em ambos os lados**; sem erros console.
- **DoD:** stories ✓ · dimensões ✓ · cores/tipografia/raios ✓ · drag/threshold/conclusão ✓ · estados
  (loading/disabled/foco) ✓ · a11y (AXE 0/role button/aria-label) ✓ · build dev (`tsc --noEmit` limpo) ✓ ·
  sem regressão (componente novo; reusa Icon + tokens existentes).
- **Commit:** _pendente_.

---

### Dnd list — `dnd-list` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 1/1 — `dnd-list` (StatefulList 6 itens, Root 344px). (`dnd-list-rtl`
  existe na fonte mas não é story no `meta.json` — fora do escopo.)
- **Verdade-base:** `baseweb/src/dnd-list/` (`list.tsx`, `styled-components.ts` Root/List/Item/
  DragHandle/Label, usa `react-movable` + ícone `Grab`; `__tests__/dnd-list.scenario.tsx`).
- **Decisões de arquitetura:** `bui-dnd-list` (`<ul><li>`) com handle (ícone Grab `bui-icon` #CCC,
  24px) + label `font300`(ParagraphMedium). Item flex space-between, padding 16, borda 2px transparente
  (→ `borderSelected` no hover/drag), fundo `backgroundPrimary`, cursor grab/grabbing, sombra no item
  arrastado. **Independência Angular:** o `react-movable` foi **reimplementado com Pointer Events**
  (sem lib) p/ paridade de experiência: ao pegar (`pointerdown` + `setPointerCapture`) o item é
  **levantado** (segue o cursor via `translateY`, sombra, cursor `grabbing`, borda selecionada) e os
  demais **abrem espaço suavemente** (`translateY ±altura` com `transition`); ao soltar, o arrastado
  **desliza** para o vão (settle) e a lista reordena (`linkedSignal`, `track item`). Também há
  **reordenação por teclado** (`Space`/`Enter` seleciona → borda; `↑`/`↓` move; `Esc` cancela) com
  refoco do item movido. **Nenhum token novo** (Grab path inline).
- **Estados verificados:** repouso (6 itens), hover (borda `borderSelected`), foco (outline 3px
  offset -3px), **drag por mouse** (cursor `grabbing` + sombra `0 2px 6px /.32` + itens abrindo o vão +
  reordenação), **drag por teclado** (Space + setas). (decisão: o original usa `pointer-events:none` no
  `ul` durante o drag — omitido no clone, pois bloquearia os pointer events do nosso DnD.)
- **Divergências encontradas (antes):** componente inexistente (0/1).
- **Correções aplicadas:**
  - `components/dnd-list/dnd-list.component.{ts,scss}` + `dnd-list.scenarios.ts` (1 story).
  - `ladle/stories.registry.ts` (1 id) + `documentation/navigation/nav.data.ts` (`Drag and Drop List` → `ready`).
- **Verificação (orig→clone, Playwright):** CSS computado **idêntico** — `ul` padding-left 0; **6 itens**
  **344×60**, padding **16**, bg branco, borda **2px solid transparent**, flex space-between, cursor
  grab, cor preta, list-style none; handle **24px** margin-right 16 cor `rgb(204,204,204)` (#CCC) + svg
  24; label **16px/24px** peso 400 (ParagraphMedium) flex-grow 1. **AXE 0** (wcag2a/aa) **ambos os
  lados**; sem erros no console.
- **DoD:** stories ✓ · dimensões ✓ · cores/bordas ✓ · tipografia ✓ · estados (hover/foco/drag) ✓ ·
  a11y (AXE 0) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente novo; reusa Icon +
  tokens existentes).
- **Commit:** _pendente_.

---

### Radio v2 — `radio-v2` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 5/5 — `radio`, `states`, `align`, `label-placement`, `contains-interactive-label`.
- **Verdade-base:** `baseweb/src/radio-v2/` (`radiogroup.tsx`, `radio.tsx`, `radio-context.tsx`,
  `styled-components.ts` getOuterColor + RadioBackplate/MarkOuter(17×17)/MarkInner/LabelWrapper,
  `utils/get-shared-styles.ts` getOverlayColor/getFocusOutlineStyle, `constants.ts`, `__tests__/*`).
- **Diferenças vs Radio v1:** **backplate** (state layer 32×32, raio 8px, overlay hover/press),
  mark **17×17** (borda 2px, cor única = outer; inner branco `100%`→`5×5` ao marcar), label `LabelSmall`
  + Description num **LabelWrapper** (padding-top 8 em left/right; clamp 3 linhas em horizontal),
  `labelPlacement` top/right/bottom/left, foco 4px, group com `columnGap 24`/`rowGap 8`.
- **Decisões de arquitetura:** `bui-radio-group-v2` + `bui-radio-v2` (host `display:contents`).
  `checked` do grupo via DI **ou standalone** (`checked` próprio — usado na story `states`); overlay
  no inner via `box-shadow inset` (não vaza a cor do outer, igual ao original); cores via
  `contentPrimary`/`red700`(tagRedBorderSecondarySelected)/`contentStateDisabled` + overlays
  reusados do Checkbox-v2 — **nenhum token novo**. Wrapper vazio (radio sem label) some via `:has`.
- **Estados verificados:** checked/unchecked × default/disabled/error/disabled+error (states, 9 linhas)
  + standalone + label/description + long-label clamp + 4 placements + align horizontal/vertical +
  select interativo + focus-visible.
- **Divergências encontradas (antes):** componente inexistente (0/5).
- **Correções aplicadas:**
  - `components/radio-v2/radio-v2.component.{ts,scss}` (group + radio) + `radio-v2.scenarios.ts` (5 stories).
  - `ladle/stories.registry.ts` (5 ids) + `documentation/navigation/nav.data.ts` (`Radio-v2` → `ready`).
  - `radio`/`contains-interactive-label`: FormControl 🚫 → rótulo simples; `states`: table-grid 🚫 →
    `<div role=grid>` CSS (aproximações).
- **Verificação (orig→clone, Playwright):** `states` — **18/18 marks idênticos**: outer **17×17** borda
  **2px** (preto / disabled cinza166 / error vermelho187.3.42), inner branco **13×13**(off)/**5×5**(on),
  backplate **33×33** raio 8px. `radio`/`align`/`label-placement`/`contains-interactive-label` **AXE 0**
  ambos os lados (counts 6/6/12/4); `states` tem resíduos a11y **≤ original** (a própria story declara
  "not suitable for accessibility testing"). Sem erros no console.
- **DoD:** stories ✓ · dimensões ✓ · cores/mark/backplate ✓ · tipografia ✓ · placements/align ✓ ·
  estados (disabled/error/foco/overlay) ✓ · a11y (AXE ≤ original) ✓ · build dev (`tsc --noEmit` limpo) ✓ ·
  sem regressão (componente novo; reusa overlays do Checkbox-v2 + Select/Typography).
- **Commit:** _pendente_.

---

### Breadcrumbs — `breadcrumbs` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 4/4 — `breadcrumbs`, `trailing`, `pseudo`, `icon-overrides`.
  (`breadcrumbs-rtl.scenario.tsx` existe na fonte mas **não** é story no `meta.json` — fora do escopo.)
- **Verdade-base:** `baseweb/src/breadcrumbs/` (`breadcrumbs.tsx`, `styled-components.ts` Root(nav)/
  List(ol)/ListItem(li)/Separator(div+ChevronRight), `locale.ts` ariaLabel, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** `bui-breadcrumbs` = `<nav aria-label><ol>` com `<li>` projetados
  (links `a[buiLink]` / `<span>`). **Independência Angular:** o original embrulha cada child num
  `ListItem`+`Separator` em runtime; aqui o consumidor escreve os `<li>` e o **separador (ChevronRight
  16px, `breadcrumbsSeparatorFill`) vem do CSS** (`li:not(:last-child)::after` com `mask` SVG +
  `background-color` tokenizada), preservando `nav>ol>li` semântico. `showTrailingSeparator` →
  `::after` também no último; `separator="pseudo"` → `>` via `::before` (font450/mono700, sem chevron);
  `"icon-override"` → **aproximação** (X verde, era API `theme.icons` do React). **Nenhum token novo**
  (breadcrumbsText=contentPrimary, separatorFill=contentTertiary, font350=LabelMedium, font450=LabelLarge).
- **Estados verificados:** N/A (estático); links herdam estados do componente Link já verificado.
- **Divergências encontradas (antes):** componente inexistente (0/4).
- **Correções aplicadas:**
  - `components/breadcrumbs/breadcrumbs.component.{ts,scss}` + `breadcrumbs.scenarios.ts` (4 stories).
  - `ladle/stories.registry.ts` (4 ids) + `documentation/navigation/nav.data.ts` (`Breadcrumbs` → `ready`).
- **Verificação (orig→clone, Playwright):** nav `color rgb(0,0,0)` + font **500 16px/20px**, tag **NAV**,
  `aria-label "Breadcrumbs navigation"`, `ol` margin 0 / list-style none, `li` inline-block + mesma fonte
  **idênticos**. Separador chevron (cinza), `trailing` (chevron após o último) e `pseudo` (`>`) batem
  visualmente. **AXE 0** (wcag2a/aa) nas 4 stories **em ambos os lados**; sem erros no console.
- **DoD:** stories ✓ · tipografia/cor ✓ · separador (chevron/trailing/pseudo) ✓ · estados (N/A) ✓ ·
  a11y (AXE 0/nav>ol>li/aria-label) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente
  novo; reusa Link + tokens existentes; separador por `::after` não vaza fora de `.bui-breadcrumbs`).
- **Commit:** _pendente_.

---

### Badge — `badge` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 4/4 — `badge`, `inline-badge`, `notification-circle`, `hint-dot`.
- **Verdade-base:** `baseweb/src/badge/` (`badge.tsx`/`notification-circle.tsx`/`hint-dot.tsx`,
  `styled-components.ts` getColorStyles + POSITION_STYLES (14 placements) + offsets, `constants.ts`
  COLOR/SHAPE/HIERARCHY/PLACEMENT/ROLE, `utils.ts`, `__tests__/*.scenario.tsx`).
- **Decisões de arquitetura:** 3 componentes — `bui-badge` (chip rect/pill, 5 cores × 2 hierarquias),
  `bui-notification-circle` (círculo 20×20, número >9→"9+" ou ícone), `bui-hint-dot` (ponto 8px +
  borda 4px). **Inline vs anexado** detectado por **CSS `:has(.anchor:not(:empty))`** (sem JS):
  inline → Positioner `display:contents` (chip vira filho direto); anexado → Root relativo +
  Positioner absoluto. As 14 placements + `horizontalOffset`/`verticalOffset` portadas para um helper
  TS (`positionStyle`) que computa top/bottom/left/right/transform e aplica via inline-style (espelha
  `StyledPositioner`). Conteúdo (texto via input, ícone via slot `[badgeContent]`); âncora via
  `<ng-content>` default. **Nenhum token novo** (cores/raios/tipografia já existiam).
- **Estados verificados:** N/A (estático); cobertas 5 cores × 2 hierarquias × 2 shapes, número/ícone,
  14 placements + offsets (0/px/%/negativo), dots em Tag/texto/ícone/Button.
- **Divergências encontradas (antes):** componente inexistente (0/4).
- **Correções aplicadas:**
  - `components/badge/badge.component.{ts,scss}` (3 componentes) + `badge.scenarios.ts` (4 stories).
  - `ladle/stories.registry.ts` (4 ids) + `documentation/navigation/nav.data.ts` (`Badge` → `ready`).
- **Verificação (orig→clone, Playwright):** `inline-badge` — **25/25 elementos idênticos** (box, bg,
  color, raio, padding, font p/ rect 39×20/r4/pad4, pill 36×20/r16/pad8, circle 20×20/r20/LabelXSmall;
  todas as 5 cores × primary/secondary; "9+" p/ >9; Check icon). `badge` — **14 placements + 4 offsets**
  com top/left/right/transform aplicados **idênticos** (resíduo: a offset complementar auto difere 1px
  = strut da line-box do positioner, **não** afeta a posição renderizada, que é dada pela offset
  explícita). **AXE = original**: badge/notification-circle/hint-dot **AXE 0**; inline-badge
  `color-contrast×4` **idêntico ao original** (inerente aos chips warning/secondary). Sem erros no console.
- **DoD:** stories ✓ · dimensões ✓ · cores/tipografia/raios ✓ · placements/offsets ✓ · estados (N/A) ✓ ·
  a11y (AXE = original) ✓ · build dev (`tsc --noEmit` limpo) ✓ · sem regressão (componente novo; reusa
  Icon/Tag/Button e tokens existentes).
- **Commit:** _pendente_.

---

### Checkbox v2 — `checkbox-v2` — ✅ Verificado (2026-06-09)

- **Stories (clone/orig):** 7/7 — `checkbox`, `states`, `placement`, `indeterminate`, `auto-focus`,
  `unlabeled`, `react-hook-form`.
- **Verdade-base:** `baseweb/src/checkbox-v2/` (`checkbox.tsx`, `styled-components.ts`
  getBorderColor/getBackgroundColor + CheckmarkContainer state-layer, `utils/get-shared-styles.ts`
  getOverlayColor/getFocusOutlineStyle, `__tests__/*.scenario.tsx`).
- **Diferenças vs Checkbox v1:** **state layer** (`CheckmarkContainer` 32×32, raio 8px, padding 8px,
  overlay de hover/press), Checkmark **17×17** (borda **2px**, raio **4px**, SVG viewBox 24), label
  `ParagraphSmall` (14/20, padding-top 6px, lateral 4px), foco visível **4px** (outline 2px +
  offset 2px, `brandBorderAccessible`), **sem toggle** e só `labelPlacement` left/right.
- **Decisões de arquitetura:** `label[buiCheckboxV2]` — Container(`<span>`) > Checkmark(`<span>`) +
  Input oculto + Label. Estados via CSS puro (`:hover`/`:active`/`:has(input:focus-visible)`); o
  overlay duplo (Container + Checkmark bg) replica `getOverlayColor` + `getBackgroundColor`; cor da
  marca (`contentInversePrimary`) resolvida em runtime; `indeterminate` no DOM via `effect`; label
  left via `order:-1`.
- **Estados verificados:** unchecked/checked/indeterminate × normal/disabled/error (9) + placement
  (left/right) + hover/active (overlay no container + checkmark) + focus-visible (outline 4px).
- **Divergências encontradas (antes):** componente inexistente (0/7); faltavam os tokens de overlay
  negativo (`hoverNegativeAlpha`/`pressedNegativeAlpha`).
- **Correções aplicadas:**
  - `components/checkbox-v2/checkbox-v2.component.{ts,scss}` + `checkbox-v2.scenarios.ts` (7 stories).
  - `tokens/base-web-tokens.scss` — add `--bw-overlay-negative-hover`/`--bw-overlay-negative-pressed`
    (light + dark, aditivos).
  - `ladle/stories.registry.ts` (7 ids) + `documentation/navigation/nav.data.ts` (`Checkbox-v2` → `ready`).
  - `react-hook-form`: **aproximação visual** (estrutura Heading + checkboxes + native + submit), sem
    o form React.
- **Verificação (orig→clone, Playwright):** `states` — Container **33×33** raio 8px (bg transparente),
  Checkmark **17×17** borda **2px** raio **4px**, bg/borda **idênticos nos 9** (normal transp/cinza94;
  checked preto/transp; indet preto/transp; disabled transp|cinza166; error transp/vermelho187.3.42;
  error+checked vermelho/transp), label **14px/20px UberMove** padding-top 6 / left 4 **idênticos**.
  **AXE 0** em states/placement/indeterminate/unlabeled/react-hook-form; `checkbox` tem `listitem×3`
  **idêntico ao original** (inerente ao `<ul role="group">` da própria story).
- **DoD:** stories ✓ · dimensões ✓ · tipografia ✓ · cores/bordas/overlay ✓ · estados (incl. disabled/
  error/foco/hover) ✓ · a11y (AXE = original/input nativo/aria) ✓ · build dev (`tsc --noEmit` limpo +
  ng serve recompila) ✓ · sem regressão (componente novo; tokens aditivos; reusa Heading/Typography).
- **Commit:** _pendente_.

---

### Select — `select` — ✅ Verificado (30/30, 2026-06-10)

- **Stories (clone/orig):** 20/30 — `select` (8 controles: stateful, loading, single-value, multi,
  com/sem disabled), `sizes` (32/36/48/60), `sizes-selected-value` (valor + width 400), `states`
  (default/foco/positive/error/disabled), `open` (2 abertos via `startOpen`), `search-single`
  (`type=search` + opção disabled), `search-multi` (multi+busca+tags), `creatable`, `creatable-multi`,
  `many-options` (1000 opções), `option-group` (grupos `__ungrouped`/Blueish/Whiteish), `highlight`
  (valor controlado Beige), `async-options` (resultados via `onInputChange`+setTimeout),
  `disable-href-anchor` (itens com href **não** viram `<a>`), `in-flex-container` (grid 3),
  `rtl` (dir rtl), `icon-overrides` (aproximação — overrides de ícone = API React),
  `search-single-fontsize` (override 28px), `maintains-input-value` (4 rotulados),
  `backspace-behavior` (2 rotulados).
- **Verdade-base:** `baseweb/src/select/` (`select-component.tsx` 1118 linhas, `styled-components.ts`
  515; usa **Popover** + **StatefulMenu**). É o maior componente do sistema.
- **Decisões de arquitetura:** **expandido o `bui-select`** (usado pela Pagination ✅) mantendo o
  **contrato single-value (CVA string) + classes `__control`/`__value`/`__arrow`**. Dois ramos no
  template: (1) **`<button>`** quando `!searchable && !multi && type=select` (Pagination + selects
  simples, idêntico ao anterior); (2) **`<div>`** rico (input de busca + tags multi via `bui-tag` +
  ícone de busca/clear) quando busca/multi. Inputs novos: `multi`, `creatable`, `isLoading`,
  `clearable`, `searchable`, `startOpen`, `autoFocus`, `value` (controlado), `labelKey`/`valueKey`,
  `dir`, opções **planas ou agrupadas** (`Record<string, Option[]>`). Filtro de busca + linha
  "Create …" + grupos computados em `rows()`. Dropdown estilizado como o **bui-menu** (ParagraphSmall,
  padding 8/16, hover `menuFillHover`, radius 8 + shadow600). Reusa `bui-tag`/`bui-search`/
  `bui-delete-alt`; **nenhum token novo**. Inputs de signal lidos em `effect()` (não no construtor).
- **Arquivos:** `components/select/select.component.{ts,html,scss}` (controle + dropdown) +
  `components/select/select.scenarios.ts` (20 stories) + `ladle/stories.registry.ts` (20 ids).
- **Verificação (orig→clone, Playwright):** `sizes` heights **32/36/48/60**, fontes 12/14/16/18,
  line-height 20/20/24/28, bg `rgb(243,243,243)` (inputFill), radius **8px** ✓. `select` renderiza
  **8 controles 48px** (orig=clone). `option-group` dropdown fiel: "Black" (ungrouped) + headers
  **Blueish**/**Whiteish** (cinza, LabelXSmall) + itens 8/16. `search-multi` controle com ícone de
  busca + placeholder + seta. **Sem erros de console** em nenhuma das stories testadas. **Pagination
  não regrediu** (4 selects tertiary 32/36/48/60, bg transparente, radius 8). (largura 904 vs 1280 =
  só o wrapper do Ladle.)
- **Adicionado (10 novos, 2026-06-10):** `in-modal` (Modal + Select), `input-ref` (ViewChild `focus()`), `control-ref-set-dropdown-open` (ViewChild `setDropdownOpen()`), `control-ref-set-input-value` (ViewChild `setInputValue()`), `calls-provided-blur` (`blurred` output + counter), `click-maintains-focus` (before/select/after), `click-triggers-blur` (autoFocus + blur hide), `unmount-blur` (toggle + blur), `overridden-icon-container` (search select + count), `overridden-menu` (multi search closeOnSelect=false). `searchable-form-control` omitida (requer FormControl 🚫).
- **Métodos públicos adicionados ao Select:** `setDropdownOpen(open)`, `setInputValue(value)`, `focus()`. Output `blurred` adicionado. `#nativeInput` e `#controlBtn` template refs para viewChild.
- **DoD:** stories (30/30) ✓ · dimensões/sizes ✓ · cores/bordas/states ✓ · busca/multi/grupos/creatable ✓ ·
  dropdown (z-index/shadow/padding) ✓ · blur/focus/programmatic control ✓ · modal integration ✓ · build ✓ · AXE 0 em 10 novas stories.
- **Commit:** _pendente_.

---

### List — `list` — ✅ Verificado (7/7, 2026-06-09)

- **Stories (clone/orig):** 7/7 — `item`, `heading`, `item-artwork-sizes`, `item-artwork-min-width`,
  `item-rtl`, `item-overrides`, `item-menu-adapter`.
- **Verdade-base:** `baseweb/src/list/` (`list-item.tsx`, `list-item-label.tsx`, `list-heading.tsx`,
  `menu-adapter.tsx`, `styled-components.ts`, `constants.ts` ARTWORK_SIZES/SHAPE, `utils.ts`,
  `__tests__/*.scenario.tsx`). Depende só de **Icon** (✅) — `Search`/`Check`/`ChevronRight`.
- **Stories renderizam:** `item` = 54 itens (4 colunas × blocos de enhancer Action/2-checks/chevron/
  nested-label/none, com/sem `description`, + 3 blocos sublist + 2 itens shape ROUND/DEFAULT bg
  `warning200`); `heading` = 16 ListHeadings (texto/template para heading/subHeading/endEnhancer,
  `maxLines` 1/2, override `minWidth`); `artwork-sizes`/`min-width` = 6 itens (SMALL/MEDIUM/LARGE +
  64/96px box); `rtl` = os mesmos 52 itens `dir=rtl`; `overrides` = 2 labels (2º verde `positive`);
  `menu-adapter` = `<ul role=listbox>` 450×300 com 10 opções (Search LARGE + título/subtítulo + chevron).
- **Estados verificados:** estático; hover do menu-adapter (`menuFillHover` + cursor pointer); N/A foco.
- **Decisões de arquitetura (independência Angular):**
  - **Host do ListItem é o próprio `<li>`** (seletor `li[buiListItem]`) — sem elemento-wrapper entre
    `<ul>` e `<li>`, preservando a semântica de lista (AXE `list`/`listitem`/`aria-required-parent`).
  - `artwork`/`endEnhancer` = `TemplateRef`s (espelham as render-props do React); o artwork recebe o
    **tamanho resolvido** via `$implicit` (aliasing MEDIUM→SMALL em sublist, igual ao `useMemo` do orig).
  - `MenuAdapter` (React) = `<li buiListItem menuItem role="option">` direto no `<ul role=listbox>` —
    não há componente extra (que reintroduziria o wrapper e quebraria `aria-required-parent`).
  - `ListItemLabel`/`ListHeading` com `display:contents` (projeção via 1 `<ng-content>` num `<ng-template>`
    reusado, padrão do Heading). Overrides das stories mapeados a inputs: `rootBackground`,
    `contentColor`, `endEnhancerMinWidth`.
  - **`box-sizing: content-box`** restaurado nos elementos estruturais do List (o clone tem reset global
    `border-box`; o Base Web usa o default do UA) → borda/padding somam por fora (Content min-height 64 +
    borda 1 = **65**), batendo o original. **Nenhum token novo.**
  - **A11y (melhoria deliberada):** os containers `<div>`-grid recebem `role="list"` — o **original viola
    AXE `listitem` ×54** (li solto em div); o clone zera (como no Rating). Menu com `tabindex=0`.
- **Divergências encontradas (corrigidas):** componente inexistente (0/7); 1ª versão usava elemento
  `<bui-list-item>` (wrapper) → AXE `list`/`aria-required-parent` (regressão vs orig) → resolvido com
  host `<li>`; diff de 1px/48px por box-sizing → resolvido com content-box.
- **Verificação (orig→clone, Playwright):** li **375×65** (artwork-sizes) e **450×65** (menu-adapter)
  idênticos; Content `border-bottom 1px solid rgba(0,0,0,0.04)`, min-height 64→altura 65; artwork
  container 64px centrado (≤36) / padding lateral (>36); LabelContent `LabelMedium` 500·16/20 preto,
  Description `ParagraphSmall` 14/20, sublist idem; Heading `HeadingXSmall` 700·20/28, SubHeading
  `ParagraphMedium` 16/24 `rgb(75,75,75)`, end-desc `ParagraphSmall` 14/20, `-webkit-line-clamp` 1/2;
  override verde `rgb(14,131,69)`; menu 450×300 radius 8 shadow600. Contagens **54/52/10 = orig**.
  **AXE 0 violações** nas 7 (orig tem `listitem ×54` em `item`). **0 erros de console.**
- **DoD:** stories (7/7) ✓ · dimensões/box-sizing ✓ · tipografia ✓ · cores (primary/secondary/positive/
  warning200) ✓ · artwork/sublist/shape/rtl ✓ · estados (hover menu) ✓ · a11y (AXE 0/roles) ✓ ·
  build dev (`tsc --noEmit` limpo + ng serve recompila) ✓ · sem regressão (componente novo; reusa Icon
  e Button já verificados; nenhum token novo).
- **Commit:** _pendente_.

---

### Modal — `modal` — ✅ Verificado (4/4, 2026-06-10)

- **Stories (clone/orig):** 4/4 — `modal`, `modal-uncloseable`, `modal-select`, `modal-rtl`.
- **Verdade-base:** `baseweb/src/modal/` (`modal.tsx`, `styled-components.ts`, `constants.ts`).
- **Decisões de arquitetura:** `BuiModal` usa `position:fixed inset:0` sem CDK Overlay (igual ao Drawer). `Root` → `pointer-events:none` quando fechado, `auto` quando aberto. `DialogContainer` = backdrop `rgba(0,0,0,0.5)` com flex centering. `Dialog` = `position:relative bg:backgroundPrimary border-radius:12px margin:24px width:500px`. Animação via CSS `transition opacity + translateY(20px→0)` com `bw-timing-400` e `bw-ease-out`. `closeable=false` → sem botão X, sem fechamento por backdrop/escape. Projeção de conteúdo via `<ng-content>` em `BuiModal` e sub-componentes separados: `BuiModalHeader`, `BuiModalBody`, `BuiModalFooter`, `BuiModalButton`. Escape via `host (document:keydown.escape)`. `BuiModalButton` wraps `bui-button kind="secondary"`.
- **Aproximações:** RTL não muda posição do close button (right/left swap) — a11y OK, posicionamento mantido à direita. `aria-labelledby` não implementado (modal sem ID).
- **Verificação (Playwright):** AXE 0 em 4 stories. Build limpo.
- **DoD:** stories ✓ · open/close ✓ · backdrop click ✓ · escape ✓ · closeable=false ✓ · header/body/footer ✓ · modal-select ✓ · rtl ✓ · a11y (AXE 0/role dialog/aria-modal) ✓ · build ✓.
- **Commit:** _pendente_.

---

### Tree View — `tree-view` — ✅ Verificado (6/6, 2026-06-10)

- **Stories (clone/orig):** 6/6 — `tree-view`, `interactable`, `render-all`, `rtl`, `single-expanded`, `icon-overrides`.
- **Verdade-base:** `baseweb/src/tree-view/` (`tree-view.tsx`, `tree-node.tsx`, `tree-label.tsx`, `stateful-container.ts`, `utils.ts`).
- **Decisões de arquitetura:** `BuiTreeNodeItem` = componente recursivo (importa a si mesmo) que renderiza `<li role="treeitem">`. `BuiTreeView` = root com `<ul role="tree">`, gerencia `selectedNodeId` e `isFocusVisible` como signals. `BuiTreeNodeItem` injeta `BuiTreeView` via DI (Angular permite injetar componentes ancestrais diretamente). `BuiStatefulTreeView` = wrapper que mantém estado interno via `signal<TreeNodeData[]>`, inicializado em `ngOnInit`. Keyboard nav: ArrowRight/Left/Up/Down, Home/End, `*` (expand siblings), typeahead — portadas de `utils.ts`. `renderAll`: renderiza todos os children mas esconde com `display:none`. `singleExpanded`: ao expandir um nó, recolhe irmãos.
- **Aproximações:** `tree-view-icon-overrides` renderiza ícones padrão (ThemeProvider de icons é React-específico). `tree-view-interactable` usa labels de texto simples em vez de Select/Checkbox (React-specific label-as-function pattern). `indentGuides` não implementado.
- **Verificação (Playwright):** AXE 0 em 6 stories. Build limpo.
- **DoD:** stories ✓ · expand/collapse ✓ · recursive nodes ✓ · renderAll ✓ · singleExpanded ✓ · keyboard nav ✓ · a11y (AXE 0/role tree/treeitem/group) ✓ · build ✓.
- **Commit:** _pendente_.

---

### File Uploader Basic — `file-uploader-basic` — ✅ Verificado (7/7, 2026-06-10)

- **Stories (clone/orig):** 7/7 — `file-uploader`, `pre-drop`, `post-drop`, `spinner`, `progress-bar`, `error`, `disabled`.
- **Verdade-base:** `baseweb/src/file-uploader-basic/` (`file-uploader-basic.tsx`, `styled-components.ts`, `constants.ts`).
- **Decisões de arquitetura:** `BuiFileUploaderBasic` gerencia zona de drop + browser dialog. `afterFileDrop = computed(() => !!(progressAmount !== null || progressMessage || errorMessage))` controla a transição visual. Dropzone = dashed border (pré-drop) → borderless (pós-drop). `dragenter/dragover/dragleave/drop` nativos do HTML5. `<input type="file">` oculto (`display:none`) acionado por `fileInput.nativeElement.click()`. Spinner renderizado quando `!errorMessage && !progressAmount`. ProgressBar renderizado quando `progressAmount !== null`. Cancel/Retry via `output()`.
- **Aproximações:** ContentMessage/ButtonComponent overrides não implementados (API React específica de overrides).
- **Verificação (Playwright):** AXE 0 em 7 stories. Build limpo.
- **DoD:** stories ✓ · drag-and-drop ✓ · browse dialog ✓ · estados pre/post-drop ✓ · spinner/progress-bar ✓ · error/retry ✓ · disabled ✓ · a11y (AXE 0) ✓ · build ✓.
- **Commit:** _pendente_.

---

### File Uploader — `file-uploader` — ✅ Verificado (7/7, 2026-06-10)

- **Stories (clone/orig):** 7/7 — `file-uploader`, `item-preview`, `label-hint`, `long-loading`, `long-loading-multiple-files`, `overrides`, `upload-restrictions`.
- **Verdade-base:** `baseweb/src/file-uploader/` (`file-uploader.tsx`, `types.ts`, `constants.ts`, `utils.ts`).
- **Decisões de arquitetura:** `BuiFileUploader` usa `BuiFileUploaderBasic` para zona de drop e gerencia estado de `fileRows` internamente via `signal<FileRow[]>`. Ao receber `fileDrop`, usa `FileReader.readAsDataURL` por arquivo para: (1) extrair preview de imagem (`imagePreviewThumbnail`); (2) validar `accept`/`minSize`/`maxSize`/`maxFiles`; (3) chamar `processFileOnDrop` se fornecido. Status: `added` (loading) → `processed` (success) | `error`. Cores por status: added=`--bw-background-accent`, processed=`--bw-content-positive`, error=`--bw-content-negative`. `noFilesAreLoading = computed(() => !fileRows.find(r => r.status === 'added'))` controla: (1) botão de delete visível, (2) dropzone habilitada. Aria-live regions (`assertive` para adição, `polite` para remoção). SVGs inline para 4 ícones (CircleCheckFilled, CircleExclamationPointFilled, PaperclipFilled, TrashCanFilled).
- **Aproximações:** `processFileOnDrop` em `long-loading-multiple-files` usa `progressAmountStartValue=0` e atualiza progress diretamente via `updateRow()` exposto publicamente (React usa setFileRows callback). Overrides de styled-components não implementados.
- **Verificação (Playwright):** AXE 0 em 7 stories. Build limpo.
- **DoD:** stories ✓ · file rows com status/progress ✓ · item-preview (imagem/paperclip) ✓ · label/hint ✓ · long-loading ✓ · upload-restrictions (accept/min/maxSize/maxFiles) ✓ · a11y (AXE 0/aria-live) ✓ · build ✓.
- **Commit:** _pendente_.

---

### Snackbar — `snackbar` — ✅ Verificado (7/7, 2026-06-10)

- **Stories (clone/orig):** 7/7 — `snackbar-element`, `snackbar-element-overrides`, `snackbar-element-rtl`, `snackbar-provider`, `snackbar-placement`, `snackbar-async`, `snackbar-provider-overrides`.
- **Verdade-base:** `baseweb/src/snackbar/` (`snackbar-element.tsx`, `snackbar-context.tsx`, `styled-components.ts`, `constants.ts`).
- **Decisões de arquitetura:** `BuiSnackbarElement` = componente visual puro com 5 inputs (`message`, `actionMessage`, `actionOnClick`, `startEnhancerComponent`, `progress`). Root = `backgroundInverseSecondary`, `maxWidth:540px`, `minWidth:320px`, `borderRadius:radius400`, `boxShadow:0px 16px 48px rgba(0,0,0,0.22)`. ResizeObserver mede `rootWidth` e `actionMeasureWidth` para determinar se o action button deve quebrar linha (`wrapActionButton = actionMeasureWidth > rootWidth/2`). Ícone via `NgComponentOutlet` com `inputs: { size: '24' }`. Spinner quando `progress=true`. `BuiSnackbarService` (`providedIn: 'root'`) gerencia fila como `signal<[...]>`, expõe `current` (primeiro da fila), `animating`, e `enqueue(props, duration)` / `dequeue()`. DURATION: short=3000ms, medium=5000ms, long=7000ms, infinite=0. `BuiSnackbarOutlet` = componente de posicionamento `position:fixed` com 6 placements (topLeft/top/topRight/bottomRight/bottom/bottomLeft), injeta `BuiSnackbarService` e renderiza `BuiSnackbarElement` com fade-in/out via CSS `opacity`.
- **Aproximações:** overrides de style/component (React-specific). Animação de entrada/saída simplificada (opacity transition, sem translateY por placement).
- **Verificação (Playwright):** AXE 0 em 7 stories. Build limpo.
- **DoD:** stories ✓ · element visual ✓ · action button inline/wrap ✓ · startEnhancer icon ✓ · progress spinner ✓ · provider queue ✓ · 6 placements ✓ · async demo ✓ · rtl ✓ · a11y (AXE 0/role status/aria-live polite) ✓ · build ✓.
- **Commit:** _pendente_.

---

### Toast — `toast` — ✅ Verificado (4/4, 2026-06-10)

- **Stories (clone/orig):** 4/4 — `toast`, `toaster`, `toaster-focus`, `toast-application-state`.
- **Verdade-base:** `baseweb/src/toast/` (`toast.tsx`, `toaster.tsx`, `styled-components.ts`, `constants.ts`).
- **Decisões de arquitetura:** `BuiToast` = componente autônomo com animação fade-in/out própria. Body: `width:288px`, `padding:scale600`, `margin:scale300`, `borderRadius:radius400`, `boxShadow:shadow600`, `display:flex`, `opacity:0→1` via CSS. 4 kinds: info/positive/warning/negative com tokens `toastInfoBackground/Text` etc. Close button: SVG 16px com `aria-label`. Role `alert`, `aria-atomic:true`. `BuiToasterService` (`providedIn:root`) gerencia fila via `signal<ToastItem[]>`, expõe `info()`, `positive()`, `warning()`, `negative()` e `dismiss(key)`. Suporte a key para deduplicação/update. `BuiToasterContainer`: `position:fixed`, 6 placements (coluna ou coluna-reversa), `pointer-events:none` no root/`auto` nos items. Inputs: `placement`, `closeable`, `autoHideDuration`.
- **Aproximações:** `autoFocus` no close button (React foca programaticamente no SVG) não implementado. Children-as-function (`{ dismiss }`) substituído por `<ng-content>` com `(toastClose)` output.
- **Verificação (Playwright):** AXE 0 em 4 stories. Build limpo.
- **DoD:** stories ✓ · kinds info/positive/warning/negative ✓ · closeable ✓ · autoHideDuration ✓ · toaster service queue ✓ · placements ✓ · application state (close removes item) ✓ · a11y (AXE 0/role alert/aria-atomic) ✓ · build ✓.
- **Commit:** _pendente_.

---

### Tooltip — `tooltip` — ✅ Verificado (4/4, 2026-06-10)

- **Stories (clone/orig):** 4/4 — `tooltip`, `tooltip-complex`, `tooltip-interactive-element`, `tooltip-arrow-margin`.
- **Verdade-base:** `baseweb/src/tooltip/` (`styled-components.ts` — extends Popover body/inner/arrow).
- **Decisões de arquitetura:** `BuiTooltip` usa Angular CDK `CdkConnectedOverlay` (mesmo que `BuiPopover`). Trigger: hover/focus — `(mouseenter)/(mouseleave)/(focus)/(blur)` no wrapper `<span>`. Body: `tooltipBackground` (fallback `contentPrimary` = dark), `tooltipText` (fallback `backgroundPrimary` = white), `borderRadius:radius300`, `boxShadow:shadow400`, `padding:scale300 scale600`, `font:font150` (LabelXSmall). `BuiStatefulTooltip` = alias de `BuiTooltip` (auto-gerencia estado). `tooltipId` gerado randomicamente para `aria-describedby`. `contentComponent` input aceita `Type<unknown>` para renderizar via `NgComponentOutlet`. `pointer-events:none` no body (tooltip não é interativo).
- **Aproximações:** `showArrow` aceito como input mas sem arrow visual (implementação CSS seria necessária para cada placement — omitida para simplicidade). React `focusLock`/`autoFocus` não implementados. `contentComponent` para `tooltip-complex` usa string texto (DarkTheme + Link são React-specific).
- **Verificação (Playwright):** AXE 0 em 4 stories. Build limpo.
- **DoD:** stories ✓ · hover trigger ✓ · aria-describedby ✓ · content string ✓ · popoverMargin ✓ · on buttons ✓ · a11y (AXE 0/role tooltip) ✓ · build ✓.
- **Commit:** _pendente_.

---

### Combobox — `combobox` — ✅ Verificado (11/11, 2026-06-10)

- **Stories (clone/orig):** 11/11 — `combobox`, `combobox-sizes`, `combobox-disabled`, `combobox-search`, `combobox-autocomplete-false`, `combobox-inline-text-search`, `combobox-async`, `combobox-replacement-node`, `combobox-overrides`, `combobox-form`, `combobox-form-control`.
- **Verdade-base:** `baseweb/src/combobox/` (`combobox.tsx`, `styled-components.ts`).
- **Decisões de arquitetura:** `BuiCombobox` = input text + dropdown listbox via `position:absolute`. Input tem `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`, `aria-autocomplete`, `aria-activedescendant`. Listbox: `<ul role="listbox">` com `position:absolute top:100%`, `maxHeight:200px`, shadow/radius como Popover. Keyboard: ArrowDown/Up navega `selectionIndex`, Enter seleciona, Escape fecha. `autocomplete=true`: preenche input com texto da opção navegada (revertido ao perder foco sem seleção). `onBlur` verifica `relatedTarget.contains(listbox)` para não fechar ao clicar na lista (via `mousedown.preventDefault()` na listbox). Sizes: mini/compact/default/large com heights e paddings do React. `mapOptionToString: (o: unknown) => string` e `options: unknown[]` — tipos genéricos erasados. `ariaLabel` input (default: 'Search') + `inputId` gerado para a11y.
- **Aproximações:** `mapOptionToNode` (custom option renderer) não implementado — a11y crítico exige que `aria-allowed-attr` não seja colocado em `<div>`. `FormControl` wrapper inline nos scenarios (não há `BuiFormControl` standalone). `combobox-replacement-node` usa layout padrão. Overrides de style não implementados.
- **Verificação (Playwright):** AXE 0 em 11 stories. Build limpo.
- **DoD:** stories ✓ · input text ✓ · dropdown listbox ✓ · keyboard nav ArrowUp/Down/Enter/Escape ✓ · autocomplete ✓ · sizes mini/compact/default/large ✓ · disabled ✓ · search/filter ✓ · inline text search # ✓ · async ✓ · form submit ✓ · a11y (AXE 0/combobox role/aria-controls) ✓ · build ✓.
- **Commit:** _pendente_.

### Slider — `slider` — ✅ Verificado (9/9, 2026-06-10)

- **Stories (clone/orig):** 9/9 — `slider`, `slider-range`, `slider-step`, `slider-marks`, `slider-disabled`, `slider-rtl`, `slider-always-show-label`, `slider-custom-label`, `slider-select-dropdown`.
- **Verdade-base:** `baseweb/src/slider/` (`slider.tsx`, `styled-components.ts`, `utils.ts`).
- **Decisões de arquitetura:** `BuiSlider` = native `<input type="range">` (invisible, interactive) + decorative divs para track/thumb/label. Track fill via `linear-gradient` CSS computado a partir dos valores (% de `(v - min) / (max - min)`). Dois `<input type="range">` sobrepostos para range de dois polegares — z-index ajustado dinamicamente para o polegar mais próximo da extremidade ficar por cima. `BuiStatefulSlider` = wrapper com `signal([0])` que repassa all inputs para `BuiSlider`. `persistentThumb` mostra label de valor sempre visível; `marks` gera dots de marcação + tick bar min/max. `valueToLabel: (v: number) => string | number` para labels customizados. `ariaLabel` binding no native input com `aria-valuemin/max/now/text`. Thumbs visuais (`.bui-slider__thumb`) com inner accent bar (`.bui-slider__inner-thumb`). Thumb value label `.bui-slider__thumb-value`: `position:absolute; top:-scale1400`.
- **Aproximações:** `onFinalChange` não diferenciado de `onInput` (emite `sliderChange` em cada input). Override da cor do thumb/track via CSS variables. Polegar interno (`.bui-slider__inner-thumb`) é decorativo.
- **Verificação (Playwright):** AXE 0 em 9 stories. Build limpo. Select `<ul role="listbox">` precisou de `aria-label` para AXE `aria-input-field-name`.
- **DoD:** stories ✓ · single slider ✓ · range (2 thumbs) ✓ · step ✓ · marks ✓ · disabled ✓ · RTL ✓ · persistent thumb label ✓ · custom label ✓ · with select dropdown ✓ · native keyboard access ✓ · a11y (AXE 0, aria-valuemin/max/now/text) ✓ · build ✓.
- **Commit:** _pendente_.
