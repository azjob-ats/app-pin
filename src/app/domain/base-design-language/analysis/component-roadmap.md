# Roadmap — uma FASE por componente (Fase 5)

> Clone fiel Angular do Base Web. Cada componente = **uma fase** (implementar + scenarios no
> Ladle + doc page + conferir original × clone). Ordem: simples → complexo (deps de overlay por último).

## Workflow de cada fase (obrigatório)
1. Ler **source** `baseweb/src/<comp>/`.
2. Ler **render exato** `static/ladle/<Story> - <Comp> _ Ladle.html`.
3. Implementar `bui-<comp>` (tokens `--bw-*`, nome de classe Base Web).
4. Portar scenarios → Ladle (ids iguais).
5. Doc page (Yard).
6. Conferir `:61000/?story=…` × `:4200/bw/ladle?story=…`.

## Legenda: ✅ pronto · 🔨 em andamento · ⬜ a fazer · 🅽 N/A em Angular (só doc conceitual)

### Banda A — Primitivos de conteúdo
| # | Componente | Status |
|---|-----------|--------|
| 1 | Button | ✅ |
| 2 | Accordion | ✅ |
| 3 | Checkbox | ✅ |
| 4 | Divider | ✅ |
| 5 | Spinner | ✅ |
| 6 | Skeleton | ✅ |
| 7 | Heading | ✅ |
| 8 | Typography | ✅ |
| 9 | Icon | ✅ |
| 10 | Avatar | ✅ |
| 11 | Badge | ✅ |
| 12 | Badge · NotificationCircle | ✅ |
| 13 | Badge · HintDot | ✅ |
| 14 | Tag | ✅ |
| 15 | Tag Group | ✅ |
| 16 | Block | ✅ |
| 17 | AspectRatioBox | ✅ |

### Banda B — Form controls (CVA)
| # | Componente | Status |
|---|-----------|--------|
| 18 | Radio (+ RadioGroup) | ✅ |
| 19 | Radio v2 | ✅ |
| 20 | Switch | ✅ |
| 21 | Input | ✅ |
| 22 | Textarea | ✅ |
| 23 | Form Control | ✅ |
| 24 | Checkbox v2 | ✅ |
| 25 | Pin Code | ✅ |
| 26 | Segmented Control | ✅ |
| 27 | Slider | ✅ |
| 28 | Rating | ✅ |
| 29 | Payment Card | ✅ |

### Banda C — Layout & coleções
| # | Componente | Status |
|---|-----------|--------|
| 30 | Layout Grid | ✅ |
| 31 | FlexGrid | ✅ |
| 32 | List | ✅ |
| 33 | Tile | ✅ |
| 34 | Tree View | ✅ |

### Banda D — Feedback & progresso
| # | Componente | Status |
|---|-----------|--------|
| 35 | Banner | ✅ |
| 36 | System Banner | ✅ |
| 37 | Empty State | ✅ |
| 38 | Notification | ✅ |
| 39 | Progress Bar | ✅ |
| 40 | Progress Steps | ✅ |
| 41 | Stepper | ✅ |
| 42 | Message Card | ✅ |
| 43 | Link | ✅ |

### Banda E — Navegação
| # | Componente | Status |
|---|-----------|--------|
| 44 | Tabs | ✅ |
| 45 | Tabs Motion | ✅ |
| 46 | Breadcrumbs | ✅ |
| 47 | Pagination | ✅ |
| 48 | Page Control | ✅ |
| 49 | Side Navigation | ✅ |
| 50 | Header Navigation | ✅ |
| 51 | Navigation Bar (app-nav-bar) | ✅ |
| 52 | Mobile Header | ✅ |
| 53 | Bottom Navigation | ✅ |
| 54 | DnD List | ✅ |

### Banda F — Overlays (CSS posicionado + signals; sem CDK) — pré-req: 55 Layer
| # | Componente | Status |
|---|-----------|--------|
| 55 | Layer (overlay via CSS fixed/scrim) | ✅ |
| 56 | Popover | ✅ |
| 57 | Tooltip | ✅ |
| 58 | Modal | ✅ |
| 59 | Dialog | ✅ |
| 60 | Drawer | ✅ |
| 61 | Sheet | ✅ |
| 62 | Menu | ✅ |
| 63 | Card | ✅ |
| 64 | Snackbar | ✅ |
| 65 | Toast | ✅ |

### Banda G — Pickers & compostos
| # | Componente | Status |
|---|-----------|--------|
| 66 | Select | ✅ |
| 67 | Combobox | ✅ |
| 68 | File Uploader | ✅ |
| 69 | File Uploader Basic | ✅ |
| 70 | Phone Input | ✅ |
| 71 | Button Group | ✅ |
| 72 | Button Dock | ✅ |
| 73 | Button Timed | ✅ |
| 74 | Sliding Button | ✅ |

### Banda H — Date & Time
| # | Componente | Status |
|---|-----------|--------|
| 75 | Datepicker | ✅ |
| 76 | Time Picker | ✅ |
| 77 | Timezone Picker | ✅ |

### Banda I — Tables
| # | Componente | Status |
|---|-----------|--------|
| 78 | Table (semantic) | ✅ |
| 79 | Flex Table | ✅ |
| 80 | Grid Table | ✅ |
| 81 | Data Table | ✅ |

### Banda J — Map Markers + conceituais
| # | Componente | Status |
|---|-----------|--------|
| 82 | Fixed Marker | ✅ |
| 83 | Floating Marker | ✅ |
| 84 | Floating Route Marker | ✅ |
| 85 | Location Puck | ✅ |
| 86 | BaseProvider | 🅽 |
| 87 | UseStyletron | 🅽 |
| 88 | Styled | 🅽 |
| 89 | Tokens (→ Foundations) | 🅽 |
| 90 | A11y Validator | 🅽 |

---

**Total:** 90 fases (89 itens de nav + RadioGroup junto do Radio).
**Componentes implementados:** 85/85 ✅ (100%). **Conceituais N/A em Angular:** 5 🅽 (86–90).

Os 5 itens 86–90 não têm componente Angular por princípio (Regra de Independência
Arquitetural): são APIs do runtime React/Styletron do Base Web. Seus equivalentes no clone:
- **BaseProvider** → tema aplicado por `.bw-root` + `[data-bw-theme]` (sem provider React).
- **UseStyletron** → CSS custom properties `--bw-*` + SCSS scopado (sem hook CSS-in-JS).
- **Styled** → componentes Angular standalone idiomáticos (sem `styled()`).
- **Tokens** → `tokens/base-web-tokens.scss` (camada de tokens — ver Foundations).
- **A11y Validator** → checagens AXE/WCAG AA no próprio componente (sem validador runtime).

**Doc pages (Yard):** Button · Accordion · Checkbox prontas (`READY_PAGES`); demais usam
placeholder + Ladle. Próxima frente (Fase 6): expandir doc pages componente a componente.
