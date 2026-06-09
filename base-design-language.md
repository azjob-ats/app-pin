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

> **Estado atual:** **`Pagination`, `Accordion`, `Typography`, `Spinner`, `Avatar`, `Divider`,
> `Heading`, `Link`, `Skeleton`, `Aspect ratio box`, `Progress bar`, `Rating`, `Switch` e
> `Tabs` cobertos**. Todos os demais estão `⚠️ Divergente` (faltam stories e/ou verificação).
> **Icon (P1.2) ✅, Button (P1.6) ✅, Input (P1.7, 9/15 core) e Stepper (P4.18) ✅ cobertos.**
> **Nenhum bloqueio (`⛔`) restante.** `Tag` livre (depende só de Icon). O restante da P1
> (Checkbox→select/heading; Checkbox-v2→heading) e a P2 (Popover/Menu/Drawer) seguem acoplados aos
> seus provedores (Select/Heading/etc.).

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
| 5 | Badge | P4.3 | 0/4 | ⚠️ |
| 6 | Banner | P3.4 | 0/5 | ⚠️ |
| 7 | Block | — | — | 🚫 |
| 8 | Breadcrumbs | P4.6 | 0/4 | ⚠️ |
| 9 | Button | P1.6 | 14/15 | ✅ |
| 10 | Button group | P3.1 | 0/12 | ⚠️ |
| 11 | Button timed | P3.2 | 0/1 | ⚠️ |
| 12 | Card | P3.3 | 0/5 | ⚠️ |
| 13 | Checkbox | P1.8 | 0/8 | ⚠️ |
| 14 | Checkbox v2 | P1.9 | 0/7 | ⚠️ |
| 15 | Combobox | P3.21 | 0/11 | ⚠️ |
| 16 | Data table | P3.28 | 0/33 | ⚠️ |
| 17 | Datepicker | P3.22 | 0/29 | ⚠️ |
| 18 | Divider | P4.2 | 1/1 | ✅ |
| 19 | Dnd list | P4.21 | 0/1 | ⚠️ |
| 20 | Drawer | P2.3 | 0/4 | ⚠️ |
| 21 | File uploader | P3.13 | 0/7 | ⚠️ |
| 22 | File uploader basic | P3.14 | 0/7 | ⚠️ |
| 23 | Flex grid | — | — | 🚫 |
| 24 | Form control | — | — | 🚫 |
| 25 | Header navigation | P3.11 | 0/1 | ⚠️ |
| 26 | Heading | P4.4 | 1/1 | ✅ |
| 27 | Helper | — | 0/3 | 🚫 |
| 28 | Helpers | — | 0/1 | 🚫 |
| 29 | Icon | P1.2 | 3/3 | ✅ |
| 30 | Input | P1.7 | 9/15 | ⚠️ |
| 31 | Layer | — | — | 🚫 |
| 32 | Layout grid | — | — | 🚫 |
| 33 | Link | P4.5 | 1/1 | ✅ |
| 34 | List | P1.10 | 0/7 | ⚠️ |
| 35 | Map marker | — | — | 🚫 |
| 36 | Menu | P2.2 | 0/11 | ⚠️ |
| 37 | Message card | P3.6 | 0/4 | ⚠️ |
| 38 | Mobile header | P3.10 | 0/2 | ⚠️ |
| 39 | Modal | P3.16 | 0/3 | ⚠️ |
| 40 | Notification | P3.5 | 0/1 | ⚠️ |
| 41 | Pagination | P3.23 | 1/1 | ✅ |
| 42 | Payment card | P3.7 | 0/2 | ⚠️ |
| 43 | Phone input | P3.24 | 0/7 | ⚠️ |
| 44 | Pin code | P3.8 | 0/5 | ⚠️ |
| 45 | Popover | P2.1 | 3/15 | ⚠️ |
| 46 | Progress bar | P4.11 | 6/6 | ✅ |
| 47 | Progress steps | P4.12 | 0/6 | ⚠️ |
| 48 | Radio | P4.16 | 0/3 | ⚠️ |
| 49 | Radio v2 | P4.17 | 0/5 | ⚠️ |
| 50 | Rating | P4.13 | 3/3 | ✅ |
| 51 | Select | P3.20 | 0/30 | ⚠️ |
| 52 | Side navigation | P3.12 | 0/2 | ⚠️ |
| 53 | Skeleton | P4.7 | 3/3 | ✅ |
| 54 | Slider | P4.14 | 0/9 | ⚠️ |
| 55 | Sliding button | P4.20 | 0/3 | ⚠️ |
| 56 | Snackbar | P3.17 | 0/6 | ⚠️ |
| 57 | Spinner | P1.3 | 1/1 | ✅ |
| 58 | Stepper | P4.18 | 1/1 | ✅ |
| 59 | Switch | P4.15 | 7/7 | ✅ |
| 60 | Table | P4.22 | 0/8 | ⚠️ |
| 61 | Table grid | P4.23 | 0/4 | ⚠️ |
| 62 | Table semantic | P4.24 | 0/9 | ⚠️ |
| 63 | Tabs | P4.19 | 3/3 | ✅ |
| 64 | Tag | P1.5 | 4/5 | ✅ |
| 65 | Template component | — | 0/1 | 🚫 |
| 66 | Textarea | P3.9 | 0/2 | ⚠️ |
| 67 | Timepicker | P3.25 | 0/2 | ⚠️ |
| 68 | Timezonepicker | P3.26 | 0/3 | ⚠️ |
| 69 | Toast | P3.18 | 0/4 | ⚠️ |
| 70 | Tooltip | P3.19 | 0/4 | ⚠️ |
| 71 | Tree view | P3.15 | 0/5 | ⚠️ |
| 72 | Typography | P1.1 | 6/6 | ✅ |

**Placar:** `✅ 18` · `⚠️ 45` (nenhum ⛔ — Input 9/15 core) · `🚫 (fora do escopo)`
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

### Input — `input` — ⚠️ Parcial (9/15, 2026-06-08) — núcleo + tipos verificados

- **Stories (clone/orig):** 9/15 — `input`, `sizes`, `states`, `before-after`, `clearable`,
  `password`, `with-button`, `mask`, `number` (verificadas). **Pendentes (bloqueadas por provedor):**
  `selector` e `disabled-matches-select` (dependem de **Select**/P3.20), `form-control-states`
  (depende de **FormControl** 🚫), `clearable-icon-overrides`/`clearable-noescape`/
  `password-icon-overrides` (API de overrides/comportamento do React).
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

### Tag — `tag` — ✅ Verificado (4/5, 2026-06-08)

- **Stories (clone/orig):** 4/5 — `tag`, `size`, `start-enhancer`, `long-text`. **`overrides` adiada**
  (API React de override de sub-nós).
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

### Popover — `popover` — ⚠️ Parcial (3/15, 2026-06-08) — infra de overlay (CDK) estabelecida

- **Stories (clone/orig):** 3/15 — `popover` (isOpen), `click`, `hover`. Pendentes: position (todos os
  placements), reposition, scroll, focus-loop, render-all, etc. (comportamentos de posicionamento/foco).
- **Verdade-base:** `baseweb/src/popover/` (`popover.tsx` 515 linhas, `styled-components.ts`,
  `constants.ts` PLACEMENT/TRIGGER, `utils.ts`; usa **Layer** (portal) + **TetherBehavior** (popper)).
- **Decisão de arquitetura (chave para toda a camada de overlay):** o portal + posicionamento do
  Base Web (Layer/Tether/popper) foram substituídos pelo **Angular CDK Overlay**
  (`CdkConnectedOverlay` + `FlexibleConnectedPositionStrategy`) — arquitetura Angular nativa. **Dois
  pré-requisitos de infra resolvidos:** (1) importado `@angular/cdk/overlay-prebuilt.css` no
  `styles.scss`; (2) o overlay renderiza no `<body>` (fora do escopo `.bw-root` dos tokens) → resolvido
  com `cdkConnectedOverlayPanelClass="bw-root"` para os `--bw-*` resolverem no painel. **Isto destrava
  Menu, Select, Tooltip, Modal, Drawer e Snackbar.**
- **Componente:** `bui-popover` — trigger projetado (default), conteúdo em `[buiPopoverContent]`,
  `triggerType` click/hover, `placement` (13 → posições CDK), `isOpen` controlado ou stateful. Body
  `backgroundTertiary` + radius 8px + `shadow-600`, opacity transition.
- **Verificação (orig→clone):** `popover` (isOpen) — Body **bg `rgb(232,232,232)`**, radius 8px,
  `box-shadow 0 4px 16` (shadow600), opacity 1, conteúdo "content" posicionado **abaixo do trigger**
  (placement bottom). Visual idêntico. (posição absoluta difere = chrome do Ladle.)
- **Pendente:** as 12 stories de posicionamento/scroll/foco/arrow (comportamentais).
- **Commit:** _pendente_.
