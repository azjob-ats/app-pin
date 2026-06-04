# Architectural Independence Rule

> Regra vinculante para todo o projeto `base-design-language`. Em caso de conflito,
> **esta regra prevalece** sobre qualquer plano anterior.

## Princípio de decisão
Ao analisar o repositório Base Web, sempre perguntar:

> **Isto é exigido por causa do UX/UI?**
> - **SIM →** replicar.
> - **NÃO →** não replicar.

## O que DEVE ser clonado (fidelidade)
- **Visual:** spacing, sizing, colors, typography, elevation, motion, responsividade.
- **Comportamento:** interações, hover, focus, teclado, acessibilidade.
- **Componente:** variantes, estados, anatomia visual, **conceitos de API pública** (nomes/valores).
- **Documentação:** estrutura de navegação, categorias, examples, playground, showcase.
- **Tema:** light, dark, relações entre tokens.

## O que NÃO deve ser clonado (arquitetura React do repo)
- ❌ Organização de pastas do repo (`src/button`, `src/input`, …).
- ❌ Arquivos internos por componente: `styled-components.ts`, `constants.ts`, `types.ts`, `default-props.ts`, `index.ts` (barrel-por-pasta).
- ❌ Styletron / CSS-in-JS, React hooks, Next.js, pipeline de build, decisões técnicas específicas do repo.

## Tradução conceito ≠ arquivo (Angular idiomático)
| Base Web (React) | Em Angular |
|------------------|-----------|
| `constants.ts` (KIND/SIZE/SHAPE) | union types + `input()` (preserva os **valores/nomes** da API) |
| `styled-components.ts` (Styletron `$theme`) | SCSS + `var(--bw-*)` |
| `default-props.ts` | defaults nos `input()` |
| `types.ts` por pasta | tipos onde Angular preferir |
| `index.ts` barrel por pasta | barrels só onde fizer sentido |
| React context/hooks | signals + DI |

## Estrutura-alvo Angular (independente — substitui o "espelho do repo")
```text
src/app/domain/base-design-language/
├── analysis/        # auditoria + esta regra
├── tokens/          # base-web-tokens.scss (4 camadas) — fonte única de valores
├── themes/          # Theme (shape Base Web) + light/dark (var-based) + relações de token
├── components/      # 1 componente Angular por conceito (Button, Input… nomes preservados)
├── layouts/         # shells de página
├── playground/      # Yard (knobs + abas Props/Style Overrides/Theme + código)
├── documentation/   # casca do docs site + páginas
├── utilities/       # classes utilitárias (.u-*)
└── shared/          # helpers Angular (overrides, a11y, locale)
```

## Fontes de referência (ground truth)
Toda decisão é validada contra:
1. **Source React:** `/home/azjob/workspace/app-pin/base-design-language/baseweb` — lógica, props, branches de estilo (`styled-components.ts`, `constants.ts`).
2. **Render estático (HTML+CSS, sem JS):** `/home/azjob/workspace/app-pin/static`
   - `static/documentation-site/[DEV] Base Web - <Página>.html` — casca do docs site + páginas.
   - **`static/ladle/<Story> - <Componente> _ Ladle.html`** — **CSS RENDERIZADO de cada story** (valores computados exatos). Para um componente, achar suas stories: `ls static/ladle | grep "- <Componente> _ Ladle.html"`.

**Workflow por componente (Fase 5):** ler source → ler o(s) HTML(s) renderizado(s) em `static/ladle` → portar com **valores exatos** (cores/padding/borda/estado) → scenarios no Ladle → doc page → conferir.

## Meta final
> "Base Web foi projetado nativamente para Angular" — **não** "o repo React foi copiado para Angular".
