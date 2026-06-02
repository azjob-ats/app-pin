# Refatoração — `LearnMoreComponent` reutilizável (pinId **ou** config direto)

> **Status: proposta / não implementada.** Documenta o desenho para tornar o `LearnMoreComponent` o **único** orquestrador do "Saiba Mais", consumido tanto pelo `/watch` (por `pinId`) quanto pelo **preview** do wizard de criação de Produto (por um `StepperConfig` montado em memória).

---

## 1. Em uma frase

**Hoje o `LearnMoreComponent` só sabe carregar um formulário salvo via `pinId` (API). A refatoração faz ele aceitar também um `StepperConfig` pronto, para que o preview do wizard reutilize exatamente o mesmo componente — em vez de remontar o `GenericStepper` na mão.**

---

## 2. O problema que resolve

O "Saiba Mais" é renderizado por dois caminhos que **divergiram**:

| Caminho | Componente que orquestra | Fonte dos dados |
|---|---|---|
| **Watch** (`/watch`) | `app-learn-more` (`LearnMoreComponent`) | `GET /api/v1/learn-more/:pinId` |
| **Preview do wizard** (`/empresa/.../produtos/novo`) | `GenericStepper` fiado **direto** no `product-create` | `ProductLearnMoreAdapter.fromConfig(...)` em memória |

O preview teve que **reimplementar** a orquestração (loading → stepper → submit, navegação, revisão, política de privacidade) porque o `LearnMoreComponent` é **acoplado ao `pinId`/API**:

```ts
// learn-more.component.ts (hoje)
readonly pinId = input<string>('');
ngOnInit() { this.loadConfig(); }            // sempre busca por pinId
buildPayload(): { pinId: this.pinId(), ... } // submit sempre por pinId
```

Resultado: **duplicação de lógica** e risco de divergência visual/comportamental entre os dois (largura do drawer, estados, revisão, etc. — todos precisam ser mantidos em dois lugares).

---

## 3. Objetivo

- **Um único componente orquestrador** (`LearnMoreComponent`) usado por watch e preview.
- O preview deixa de fiar `GenericStepper` manualmente.
- Zero regressão no `/watch`.

---

## 4. Estado atual (resumo do componente)

`src/app/shared/components/learn-more/learn-more.component.ts`:

- **Inputs:** `pinId: string`
- **Outputs:** `onClose: void`, `onTrackApplication: void`
- **Providers:** `[DynamicLearnMoreService]` (escopo de componente)
- **ViewState:** `'loading' | 'stepper' | 'submitting' | 'success' | 'error'`
- **Fluxo:** `ngOnInit` → `DynamicLearnMoreService.buildStepperConfig(pinId)` → `StepperService.initializeStepper` → renderiza `GenericStepper`. No fim, `LearnMoreApi.submit({ pinId, fields })`.

Peças já existentes que ajudam:
- `ProductLearnMoreAdapter.fromConfig(config, id, title): StepperConfig` — já converte um config "solto" em `StepperConfig` (criado para o preview).
- `DynamicLearnMoreService.buildStepperConfig(pinId)` — o caminho por API.

---

## 5. Proposta de API

Tornar a **fonte** e a **submissão** plugáveis, mantendo `pinId` como atalho retrocompatível.

```ts
@Component({ selector: 'app-learn-more', ... })
export class LearnMoreComponent {
  // Fonte: um dos dois
  readonly pinId  = input<string>('');                 // modo API (watch) — inalterado
  readonly config = input<StepperConfig | null>(null);  // modo "config pronto" (preview)

  // Comportamento
  readonly submittable = input<boolean>(true);          // preview = false (não envia)

  // Outputs
  readonly onClose = output<void>();
  readonly onTrackApplication = output<void>();
  readonly submitted = output<LearnMoreSubmitRequest>(); // emite quando submittable=false
}
```

**Regra de resolução da fonte:**
- Se `config()` for fornecido → usa direto (`StepperService.initializeStepper(config())`), **sem** chamar a API.
- Senão → comportamento atual: `DynamicLearnMoreService.buildStepperConfig(pinId)`.

**Regra de submissão:**
- `submittable = true` (watch) → `LearnMoreApi.submit(payload)` (como hoje) → `success`/`error`.
- `submittable = false` (preview) → **não chama a API**; emite `submitted` (ou apenas fecha). O preview trata como "fim do preview".

---

## 6. Como cada tela passa a usar

### Watch (inalterado)
```html
<app-learn-more [pinId]="pin()?.id ?? ''" (onClose)="showLearnMoreDrawer.set(false)" />
```

### Preview do wizard (passa a reusar o componente)
```html
<app-drawer position="right" styleClass="learn-more-drawer preview-drawer" [visible]="showPreviewDrawer()" (visibleChange)="onPreviewVisibleChange($event)">
  <app-learn-more
    [config]="previewConfig()"
    [submittable]="false"
    (onClose)="closePreview()"
    (submitted)="closePreview()" />
</app-drawer>
```
`previewConfig()` continua sendo montado por `ProductLearnMoreAdapter.fromConfig(buildLearnMoreConfig(), 'preview', título)`.

---

## 7. Design técnico

- **`DynamicLearnMoreService`** é escopo de componente e só sabe `buildStepperConfig(pinId)`. Para o modo `config`, o componente **pula** o serviço e inicializa o stepper direto. Alternativa mais limpa: adicionar `buildFrom(config: StepperConfig): StepperConfig` (identidade/normalização) para manter um ponto único de entrada.
- **`ngOnInit`** vira um `resolveSource()`:
  ```ts
  if (this.config()) { this.stepperService.initializeStepper(this.config()!); this.viewState.set('stepper'); }
  else { /* fluxo atual por pinId */ }
  ```
- **Submissão** passa a checar `submittable()`:
  ```ts
  if (!this.submittable()) { this.submitted.emit(this.buildPayload(steps)); return; }
  // senão: LearnMoreApi.submit(...)
  ```
- **`buildPayload`** usa `pinId()` (vazio no preview, tudo bem — o payload não é enviado).

---

## 8. Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `shared/components/learn-more/learn-more.component.ts` | novos inputs `config`/`submittable`, output `submitted`, `resolveSource()`, submit condicional |
| `shared/components/learn-more/learn-more.component.html` | nenhuma (renderização do stepper é a mesma) ou ajuste mínimo dos estados |
| `domain/empresa/pages/product-create/product-create.component.{ts,html}` | troca o `GenericStepper` fiado na mão por `<app-learn-more [config] [submittable]>`; remove handlers duplicados (`onPreviewFormChange`, `onPreviewPrivacyAccepted`, etc.) |
| `domain/watch/pages/watch/watch.component.html` | inalterado |

> Possível bônus: remover do `product-create` os imports diretos de `GenericStepper`/`DynamicForm`/`StepRevision`/`StepTextHtml` e a dependência do `StepperService`, já que passam a viver dentro do `LearnMoreComponent`.

---

## 9. Edge cases

- **`config` e `pinId` ambos preenchidos** → `config` vence (definir e documentar a precedência).
- **`config` muda em runtime** (usuário edita o builder e reabre o preview) → re-inicializar o stepper a cada abertura (já é o caso: `previewConfig()` é remontado no `openPreview()`).
- **`StepperService` é singleton (root)** → preview e watch não coexistem em tela; reinicializar no open é suficiente. Validar que abrir o preview não "vaza" estado para um learn-more real aberto depois (reset no init).
- **Sem `setRevisionStepper`** → sem step de revisão; o botão final encerra direto. Já suportado pelo adapter.
- **Acessibilidade** → manter foco/scroll do stepper; AXE deve continuar passando.

---

## 10. Plano em fases

| Fase | Entrega |
|---|---|
| 1 | Adicionar inputs `config`/`submittable` + output `submitted` ao `LearnMoreComponent`, com `resolveSource()` e submit condicional. Watch continua igual (regressão zero). |
| 2 | Migrar o preview do `product-create` para `<app-learn-more [config] [submittable]>`; remover o `GenericStepper` fiado na mão e handlers duplicados. |
| 3 | Limpeza: remover imports/serviços agora não usados no `product-create`; conferir largura do drawer (`preview-drawer`) ainda igual ao watch. |
| 4 | Testes + AXE + build AOT. |

---

## 11. Critérios de aceite

- `/watch` renderiza e submete exatamente como antes (sem regressão).
- O preview do wizard usa `app-learn-more` e **não** remonta o stepper manualmente.
- Mesma aparência/comportamento (largura, estados, revisão, política de privacidade) nos dois.
- `tsc` + `ng build` (AOT) limpos; AXE sem violações.

---

## 12. Riscos

- **Acoplamento do `DynamicLearnMoreService` ao `pinId`** — mitigado pulando o serviço no modo `config` (ou adicionando `buildFrom(config)`).
- **`StepperService` global** — garantir reset/initialize a cada abertura para evitar vazamento de estado entre preview e learn-more real.
- **Divergência de estados** (success/submitting) — no preview (`submittable=false`) não há submit; definir o que o "último botão" faz (fechar vs. emitir `submitted`).

---

## 13. Onde aprofundar

- **Motor dinâmico (engine):** [DYNAMIC_ENGINE.md](DYNAMIC_ENGINE.md)
- **Adapter Produto → StepperConfig:** `src/app/domain/empresa/services/product-learn-more.adapter.ts` (`fromConfig`)
- **Builder do Saiba Mais (wizard):** `src/app/domain/empresa/pages/product-create/`
