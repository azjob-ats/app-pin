# Dynamic Form Engine — Documentação Técnica

Motor que converte uma estrutura JSON da API em formulários multi-etapas totalmente dinâmicos, com validação reativa, revisão de dados e submissão.

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Arquitetura em camadas](#2-arquitetura-em-camadas)
3. [Camada 1 — API & DTO](#3-camada-1--api--dto)
4. [Camada 2 — Map (DTO → Entity)](#4-camada-2--map-dto--entity)
5. [Camada 3 — Dynamic Form Engine](#5-camada-3--dynamic-form-engine)
   - [COMPONENTS registry](#51-components-registry)
   - [DynamicFieldDirective](#52-dynamicfielddirective)
   - [DynamicFormService](#53-dynamicformservice)
   - [DynamicFormComponent](#54-dynamicformcomponent)
6. [Camada 4 — Stepper Engine](#6-camada-4--stepper-engine)
   - [StepperService](#61-stepperservice)
   - [DynamicFormAdapterService](#62-dynamicformadapterservice)
   - [GenericStepperComponent](#63-genericsteppercomponent)
   - [Tipos de step](#64-tipos-de-step)
7. [Camada 5 — LearnMore (consumidor)](#7-camada-5--learnmore-consumidor)
8. [Fluxo de dados ponta a ponta](#8-fluxo-de-dados-ponta-a-ponta)
9. [Como adicionar um novo tipo de campo](#9-como-adicionar-um-novo-tipo-de-campo)
10. [Como adicionar um novo tipo de step](#10-como-adicionar-um-novo-tipo-de-step)
11. [Referência de interfaces](#11-referência-de-interfaces)
12. [Demonstração — payload da API](#12-demonstração--payload-da-api)

---

## 1. Visão geral

O motor recebe um JSON da API, transforma essa estrutura em `FormGroup`s reativos do Angular e distribui cada campo para o componente visual correto sem nenhum `@switch` ou `@if` no template principal.

```
API JSON
  └─► LearnMoreMap          → transforma DTO em entidade
        └─► DynamicLearnMoreService → monta StepperConfig
              └─► DynamicFormAdapterService → cria FormGroup por step
                    └─► DynamicFormComponent  → renderiza campos
                          └─► DynamicFieldDirective → instancia o componente certo
                                └─► InputTextDynamic | InputSelectDynamic | ...
```

**Princípio central:** adicionar um novo tipo de campo = criar 1 componente + 1 linha no `COMPONENTS`. Nenhum outro arquivo precisa mudar.

---

## 2. Arquitetura em camadas

```
┌─────────────────────────────────────────────────────────────┐
│  API Server  (api-server/src/routes/learn-more.js)          │
│  GET /api/v1/learn-more/:pinId                              │
│  POST /api/v1/learn-more/:pinId/submit                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP JSON
┌──────────────────────────▼──────────────────────────────────┐
│  LearnMoreApi             (shared/apis/learn-more.api.ts)   │
│  LearnMoreMap             (shared/maps/learn-more.map.ts)   │
│  DTO interfaces           (interfaces/dto/response/)        │
│  Entity interfaces        (interfaces/entity/)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ LearnMoreConfig
┌──────────────────────────▼──────────────────────────────────┐
│  DynamicLearnMoreService  (learn-more/dynamic-learn-more.service.ts) │
│  DynamicFormAdapterService (stepper/services/)              │
│  StepperService            (stepper/services/)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ StepperConfig + FormGroups
┌──────────────────────────▼──────────────────────────────────┐
│  LearnMoreComponent       (learn-more/)                     │
│  GenericStepperComponent  (stepper/components/)             │
│  DynamicFormComponent     (dynamic-form/)                   │
│  DynamicFieldDirective    (dynamic-form/directives/)        │
│  Field Components         (dynamic-form/field-components/)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Camada 1 — API & DTO

### Endpoint

```
GET  /api/v1/learn-more/:pinId   → retorna estrutura do formulário
POST /api/v1/learn-more/:pinId/submit → recebe os dados preenchidos
```

### Shape do response (DTO)

```typescript
// interfaces/dto/response/learn-more.ts

interface LearnMoreConfigResponse {
  stepperLearnMore: LearnMoreStepResponse[];
  stepperConfig: {
    showStepProgress: boolean;
    showCheckboxPrivacyPolicy: boolean;
    nameLastButton: string;
    setRevisionStepper: boolean;  // se true, adiciona step de revisão automaticamente
  };
}

interface LearnMoreStepResponse {
  id: string;
  title: string;
  layout: string;
  elements: LearnMoreElementResponse[];
}

interface LearnMoreElementResponse {
  id: string;
  type: string;           // 'text' | 'email' | 'select' | 'uploadFile' | 'textHTML' | 'checkboxAuthorize'
  label?: string;
  placeholder?: string;
  value?: string;         // valor fixo (geralmente conteúdo HTML para textHTML)
  defaultValue?: unknown; // valor inicial pré-preenchido do FormControl
  classes?: string[];     // ex: ['col-12 md:col-6']
  options?: { name: string; code: string }[];
  validators?: {
    required?: boolean;
    erroRequired?: string;
    accept?: string;        // para uploadFile, ex: '.pdf'
    multiple?: boolean;
    allowedTypes?: string[];
    maxFileSizeMB?: number;
  };
}
```

### LearnMoreApi

```typescript
// shared/apis/learn-more.api.ts

@Injectable({ providedIn: 'root' })
export class LearnMoreApi {
  getConfig(pinId: string): Observable<ApiResponse<LearnMoreConfig>> {
    // GET /api/v1/learn-more/:pinId
    // Aplica LearnMoreMap.toConfig() no response antes de emitir
  }

  submit(payload: LearnMoreSubmitRequest): Observable<ApiResponse<void>> {
    // POST /api/v1/learn-more/:pinId/submit
    // payload: { pinId, fields: [{ id, value }] }
  }
}
```

---

## 4. Camada 2 — Map (DTO → Entity)

O `LearnMoreMap` isola o formato da API do formato interno. Se a API mudar, só o map muda.

```typescript
// shared/maps/learn-more.map.ts

LearnMoreMap.toConfig(response: LearnMoreConfigResponse): LearnMoreConfig
```

**O que faz:**
- Converte cada `stepperLearnMore[]` → `LearnMoreStep[]`
- Converte `options: { name, code }` → `{ value, label }` (padrão interno)
- Renomeia `erroRequired` → `errorRequired`
- Se `setRevisionStepper: true`, **injeta automaticamente** um step de revisão ao final
- Propaga `defaultValue` sem transformação

```
API response.stepperLearnMore[n].elements[m].options[k]
  { name: 'Brasil', code: 'br' }
         ↓ LearnMoreMap.toElement()
  { value: 'br', label: 'Brasil' }    ← padrão interno (LearnMoreElementOption)
         ↓ DynamicLearnMoreService.toFormElement()
  { name: 'Brasil', code: 'br' }      ← volta ao padrão FormElement (para app-select)
```

> **Nota:** O `FormElement.options` usa `{ name, code }` enquanto `LearnMoreElementOption` usa `{ value, label }`. A conversão acontece em `DynamicLearnMoreService.toFormElement()`.

---

## 5. Camada 3 — Dynamic Form Engine

Localização: `src/app/shared/components/dynamic-form/`

```
dynamic-form/
├── interfaces/
│   └── form-element.interface.ts   ← COMPONENTS registry + FormElement + FormStructure
├── directives/
│   └── dynamic-field.directive.ts  ← instancia o componente correto
├── services/
│   ├── dynamic-form.service.ts     ← cria FormGroup a partir de FormStructure
│   └── form-state.service.ts       ← estado global do formulário (BehaviorSubject)
├── field-components/
│   ├── input-text-dynamic.component.ts
│   ├── input-email-dynamic.component.ts
│   ├── input-select-dynamic.component.ts
│   ├── input-upload-dynamic.component.ts
│   └── input-checkbox-authorize-dynamic.component.ts
└── dynamic-form.component.ts       ← componente principal
```

### 5.1 COMPONENTS registry

```typescript
// interfaces/form-element.interface.ts

export const COMPONENTS: Record<string, Type<any>> = {
  text:              InputTextDynamicComponent,
  email:             InputEmailDynamicComponent,
  select:            InputSelectDynamicComponent,
  uploadFile:        InputUploadDynamicComponent,
  checkboxAuthorize: InputCheckboxAuthorizeDynamicComponent,
  // ↑ Para adicionar um novo tipo: uma linha aqui + um novo componente
};
```

**Por que isso importa:** é o único lugar onde o motor sabe qual componente usar para cada `type`. Não existe `@switch`, não existe cadeia de `if-else`. Zero acoplamento.

Tipos que **não** estão no registro (como `textHTML`) são silenciosamente ignorados pela diretiva — nenhum `FormControl` é criado para eles.

### 5.2 DynamicFieldDirective

```typescript
// directives/dynamic-field.directive.ts

@Directive({ selector: '[dynamicField]' })
export class DynamicFieldDirective implements OnChanges {
  @Input('element') element!: FormElement;
  @Input('form') form!: FormGroup;

  ngOnChanges(): void {
    const component = COMPONENTS[this.element.type];
    if (!component) return;           // tipo desconhecido → sem erro, sem renderização

    this.vcr.clear();
    const ref = this.vcr.createComponent(component);
    ref.setInput('element', this.element);  // passa a definição do campo
    ref.setInput('form', this.form);        // passa o FormGroup pai
    ref.changeDetectorRef.detectChanges();
  }
}
```

**Uso no template:**

```html
<ng-container dynamicField [element]="element" [form]="form" />
```

A diretiva usa `ViewContainerRef.createComponent()` — o componente é criado em runtime, não compilado estaticamente. Isso permite extensão sem alterar templates existentes.

### 5.3 DynamicFormService

```typescript
// services/dynamic-form.service.ts

createForm(structure: FormStructure): FormGroup
```

**Regras:**
- Itera `structure.elements`
- Só cria `FormControl` para tipos listados em `INPUT_FORM_CONTROLS` (`text`, `email`, `select`, `checkboxAuthorize`, `uploadFile`)
- `textHTML` e outros tipos não-interativos são ignorados (sem FormControl)
- Valor inicial: `defaultValue ?? value ?? ''`
- Validators Angular são criados a partir de `element.validators`

```typescript
// Prioridade do valor inicial:
controls[element.id] = [
  element.defaultValue ?? element.value ?? '',
  this.buildValidators(element)
];
```

**Validators suportados:**

| Campo no JSON     | Validator Angular         |
|-------------------|---------------------------|
| `required: true`  | `Validators.required`     |
| `minLength: N`    | `Validators.minLength(N)` |
| `maxLength: N`    | `Validators.maxLength(N)` |
| `pattern: string` | `Validators.pattern(s)`   |
| `email: true`     | `Validators.email`        |

### 5.4 DynamicFormComponent

```typescript
// dynamic-form.component.ts

@Input() formStructure!: FormStructure;

readonly formChange = output<unknown>();           // emite ao digitar
readonly formStatusChange = output<{ valid: boolean }>();  // emite ao mudar status
```

**Template:**

```html
<!-- dynamic-form.component.html -->
<form [formGroup]="form">
  <div class="grid">
    @for (element of formStructure.elements; track element.id) {
      <div [class]="element.classes?.join(' ') ?? 'col-12'">
        <ng-container dynamicField [element]="element" [form]="form" />
      </div>
    }
  </div>
</form>
```

**Ciclo de vida:**
1. `ngOnInit` → `DynamicFormService.createForm()` → `FormGroup` criado
2. `FormStateService.initializeState()` inicializado
3. Subscriptions em `valueChanges` e `statusChanges` emitem para o pai

---

## 6. Camada 4 — Stepper Engine

Localização: `src/app/shared/components/stepper/`

```
stepper/
├── interfaces/
│   └── stepper.interface.ts         ← Step, StepperConfig
├── services/
│   ├── stepper.service.ts           ← estado signal-based
│   └── dynamic-form-adapter.service.ts ← cria Step com FormGroup
└── components/
    ├── generic-stepper/             ← layout shell
    ├── step-text-html/              ← renderiza HTML sanitizado
    └── step-revision/               ← revisão de dados + política de privacidade
```

### 6.1 StepperService

Estado gerenciado com `signal()`. Nenhum `BehaviorSubject`, nenhum `NgRx`.

```typescript
@Injectable({ providedIn: 'root' })
export class StepperService {
  private readonly _config = signal<StepperConfig | null>(null);

  // Computed signals — reativos automaticamente
  readonly currentStep    = computed(() => this._config()?.currentStep ?? 1);
  readonly totalSteps     = computed(() => this._config()?.steps.length ?? 0);
  readonly isFirstStep    = computed(() => this.currentStep() === 1);
  readonly isLastStep     = computed(() => this.currentStep() === this.totalSteps());
  readonly currentStepConfig = computed(() => /* step atual */);
}
```

**API pública:**

| Método                                  | O que faz                                                        |
|-----------------------------------------|------------------------------------------------------------------|
| `initializeStepper(config)`             | Inicializa o estado, reseta para step 1                         |
| `nextStep(): boolean`                   | Avança se step atual for válido. Retorna `false` se inválido     |
| `previousStep()`                        | Retrocede sem validar                                            |
| `updateStepData(data, stepNumber)`      | Salva os valores do formulário no step                           |
| `updateStepValidity(stepNumber, valid)` | Atualiza manualmente a validade de um step (ex: revisão)        |
| `isStepValid(stepNumber): boolean`      | Verifica se o step é válido (via `FormGroup` ou flag `valid`)    |
| `getAllData(): Step[]`                   | Retorna todos os steps com os dados preenchidos                  |
| `reset()`                               | Limpa o estado (chamado no `ngOnDestroy` do GenericStepper)      |

**Regra de validação no `nextStep()`:**
```typescript
nextStep(): boolean {
  if (!this.isStepValid(cfg.currentStep)) {
    this.markCurrentStepTouched(); // dispara erros visuais
    return false;
  }
  // avança...
}
```

### 6.2 DynamicFormAdapterService

Faz a ponte entre `DynamicFormService` (cria FormGroup) e `StepperService` (gerencia estado).

```typescript
createStepWithForm(stepNumber, title, structure): { step: Step } {
  const formGroup = this.dynamicFormService.createForm(structure);

  // Subscription automática: quando o formulário muda de status,
  // atualiza a validade do step no StepperService
  formGroup.statusChanges.subscribe(() => {
    this.stepperService.updateStepValidity(stepNumber, formGroup.valid);
  });

  return { step: { identifier: 'dynamicForm', formGroup, dynamicForm: structure, ... } };
}
```

### 6.3 GenericStepperComponent

Layout shell: header (back + spinner + close) + `<ng-content>` + footer (Voltar + Próximo/Concluir).

**Não conhece** `DynamicFormComponent`, `StepRevisionComponent` nem nenhum tipo de step. É genérico.

```typescript
onNext(): void {
  if (this.isLastStep()) {
    this.allStepsCompleted.emit(this.stepperService.getAllData());
    return;
  }
  const stepBefore = this.currentStep();
  if (this.stepperService.nextStep()) {
    this.stepCompleted.emit({ step: stepBefore, data: this.stepperService.getAllData() });
  }
}
```

**Inputs:**

| Input              | Tipo      | Default     | Descrição                              |
|--------------------|-----------|-------------|----------------------------------------|
| `showStepProgress` | `boolean` | `true`      | Exibe o `SpinnerStepsComponent`        |
| `nameLastButton`   | `string`  | `'Concluir'`| Texto do botão no último step          |

**Outputs:**

| Output              | Tipo                            | Quando emite                         |
|---------------------|---------------------------------|--------------------------------------|
| `stepCompleted`     | `{ step: number; data: Step[] }`| Ao avançar de um step (não o último) |
| `allStepsCompleted` | `Step[]`                        | Ao clicar no botão do último step    |
| `close`             | `void`                          | Ao clicar no X                       |

### 6.4 Tipos de step

| `identifier`        | Componente renderizado     | Válido por padrão | Requer FormGroup |
|---------------------|----------------------------|-------------------|------------------|
| `dynamicForm`       | `DynamicFormComponent`     | Depende do form   | Sim              |
| `stepTextInContent` | `StepTextHtmlComponent`    | Sempre `true`     | Não              |
| `revisionStepper`   | `StepRevisionComponent`    | Depende do checkbox | Não            |

---

## 7. Camada 5 — LearnMore (consumidor)

Localização: `src/app/shared/components/learn-more/`

O `LearnMoreComponent` orquestra o fluxo completo com 5 estados de visualização:

```
loading → stepper → submitting → success
                  ↘             ↗
                    error → retry
```

### ViewState

```typescript
type ViewState = 'loading' | 'stepper' | 'submitting' | 'success' | 'error';
```

### DynamicLearnMoreService

Serviço com escopo de componente (`providers: [DynamicLearnMoreService]` no `@Component`). Não é singleton.

```typescript
buildStepperConfig(pinId: string): Observable<StepperConfig>
```

**Lógica de classificação de steps:**

```typescript
for (const learnMoreStep of config.steps) {
  if (learnMoreStep.isRevision) {
    // → identifier: 'revisionStepper', valid: false
  } else if (todos os elementos são textHTML) {
    // → identifier: 'stepTextInContent', valid: true
  } else {
    // → identifier: 'dynamicForm', cria FormGroup via DynamicFormAdapterService
  }
}
```

### Preservação de estado entre steps

Os steps são **todos mantidos no DOM** — apenas `display:none` para os inativos. Isso preserva o estado do `FormGroup` quando o usuário navega para frente e para trás.

```html
@for (step of config.steps; track step.step) {
  <div [style.display]="step.step === stepperService.currentStep() ? 'block' : 'none'">
    <!-- FormGroup permanece vivo mesmo quando oculto -->
  </div>
}
```

### Submissão

```typescript
private buildPayload(steps: Step[]): LearnMoreSubmitRequest {
  const fields = [];
  for (const step of steps) {
    if (step.identifier !== 'dynamicForm' || !step.data) continue;
    for (const [id, value] of Object.entries(step.data)) {
      fields.push({ id, value });
    }
  }
  return { pinId: this.pinId(), fields };
}
```

---

## 8. Fluxo de dados ponta a ponta

```
1. Usuário clica "Saiba Mais"
      ↓
2. LearnMoreComponent.ngOnInit() → loadConfig()
      ↓
3. DynamicLearnMoreService.buildStepperConfig(pinId)
      ↓
4. LearnMoreApi.getConfig(pinId)
   → GET /api/v1/learn-more/:pinId
      ↓
5. LearnMoreMap.toConfig(response)
   → DTO → LearnMoreConfig (entity)
      ↓
6. Para cada step com campos de formulário:
   DynamicFormAdapterService.createStepWithForm()
   → DynamicFormService.createForm(structure)
   → FormGroup criado com validators e defaultValues
   → statusChanges → StepperService.updateStepValidity()
      ↓
7. StepperService.initializeStepper(config)
   → viewState = 'stepper'
      ↓
8. GenericStepperComponent renderiza header/footer
   LearnMoreComponent renderiza o step ativo
      ↓
9. DynamicFormComponent recebe FormStructure
   → @for element → <ng-container dynamicField [element] [form]>
      ↓
10. DynamicFieldDirective
    → COMPONENTS['text'] → InputTextDynamicComponent criado em runtime
    → COMPONENTS['select'] → InputSelectDynamicComponent criado em runtime
    → 'textHTML' não existe no COMPONENTS → silenciosamente ignorado
      ↓
11. Usuário preenche o formulário
    → FormGroup.valueChanges → DynamicFormComponent.formChange.emit()
    → LearnMoreComponent.onFormChange() → StepperService.updateStepData()
      ↓
12. Usuário clica "Próximo"
    → GenericStepperComponent.onNext()
    → StepperService.nextStep()
    → isStepValid() verifica FormGroup.valid
    → Se inválido: markAllAsTouched() exibe erros
    → Se válido: currentStep++ 
      ↓
13. No último step (revisionStepper):
    → Usuário marca "Li e aceito a Política de Privacidade"
    → StepperService.updateStepValidity(step, true)
    → Botão "Candidatar-se para a vaga" habilitado
      ↓
14. Usuário clica o botão final
    → GenericStepperComponent.onNext() → isLastStep() === true
    → allStepsCompleted.emit(getAllData())
    → LearnMoreComponent.onAllStepsCompleted()
    → submitAllData() → viewState = 'submitting'
      ↓
15. LearnMoreApi.submit(payload)
    → POST /api/v1/learn-more/:pinId/submit
    → viewState = 'success' ou 'error'
```

---

## 9. Como adicionar um novo tipo de campo

Exemplo: adicionar um campo `textarea`.

**Passo 1 — Criar o componente**

```typescript
// dynamic-form/field-components/input-textarea-dynamic.component.ts

@Component({
  selector: 'app-input-textarea-dynamic',
  imports: [ReactiveFormsModule],
  template: `
    <div class="textarea-field">
      @if (element.label) {
        <label>
          @if (element.validators?.required) {
            <span class="required-star">*</span>
          }
          {{ element.label }}
        </label>
      }
      <textarea
        [formControl]="control"
        [placeholder]="element.placeholder ?? ''">
      </textarea>
    </div>
  `,
})
export class InputTextareaDynamicComponent implements OnChanges {
  @Input() element!: FormElement;
  @Input() form!: FormGroup;
  protected control!: FormControl;

  ngOnChanges(): void {
    this.control = this.form.get(this.element.id) as FormControl;
  }
}
```

**Passo 2 — Registrar no COMPONENTS**

```typescript
// interfaces/form-element.interface.ts

export const COMPONENTS: Record<string, Type<any>> = {
  text:              InputTextDynamicComponent,
  email:             InputEmailDynamicComponent,
  select:            InputSelectDynamicComponent,
  uploadFile:        InputUploadDynamicComponent,
  checkboxAuthorize: InputCheckboxAuthorizeDynamicComponent,
  textarea:          InputTextareaDynamicComponent,  // ← adicionar aqui
};
```

**Passo 3 — Adicionar ao INPUT_FORM_CONTROLS** (para que o `DynamicFormService` crie um `FormControl` para ele)

```typescript
export const INPUT_FORM_CONTROLS: FormElement['type'][] = [
  'text', 'email', 'select', 'checkbox', 'checkboxAuthorize', 'uploadFile',
  'textarea', // ← adicionar aqui
];
```

**Passo 4 — Adicionar ao tipo `FormElementType`**

```typescript
export type FormElementType =
  | 'text' | 'email' | 'select' | 'textarea'  // ← já existe
  | 'checkbox' | 'checkboxAuthorize' | 'uploadFile' | 'textHTML';
```

**Passo 5 — Usar na API**

```json
{
  "id": "bio",
  "type": "textarea",
  "label": "Sobre você",
  "placeholder": "Conte um pouco sobre sua experiência",
  "validators": { "required": false, "maxLength": 500 }
}
```

Nenhum outro arquivo precisa ser tocado.

---

## 10. Como adicionar um novo tipo de step

Exemplo: adicionar um step de `videoIntro` onde o usuário grava um vídeo.

**Passo 1 — Adicionar o identificador**

```typescript
// stepper/interfaces/stepper.interface.ts

export type StepIdentifier =
  | 'dynamicForm'
  | 'revisionStepper'
  | 'stepTextInContent'
  | 'videoIntro';  // ← novo
```

**Passo 2 — Criar o componente do step**

```typescript
// stepper/components/step-video-intro/step-video-intro.component.ts

@Component({ selector: 'app-step-video-intro', ... })
export class StepVideoIntroComponent {
  readonly stepCompleted = output<void>();
}
```

**Passo 3 — Adicionar ao template do LearnMoreComponent**

```html
@case ('videoIntro') {
  <app-step-video-intro (stepCompleted)="onVideoRecorded()" />
}
```

**Passo 4 — Classificar no DynamicLearnMoreService**

```typescript
} else if (learnMoreStep.layout === 'videoIntro') {
  steps.push({
    identifier: 'videoIntro',
    step: stepIndex++,
    title: learnMoreStep.title,
    valid: false,
  });
}
```

---

## 11. Referência de interfaces

### FormElement

```typescript
interface FormElement {
  id: string;              // chave do FormControl
  type: FormElementType;   // define qual componente será instanciado
  label?: string;          // texto do label
  placeholder?: string;    // placeholder do campo
  value?: unknown;         // valor fixo (conteúdo HTML para textHTML)
  defaultValue?: unknown;  // valor inicial do FormControl (prioridade sobre value)
  required?: boolean;      // atalho de validação (não usado pelo engine diretamente)
  disabled?: boolean;
  options?: { name: string; code: string }[];  // para select
  validators?: FormElementValidators;
  classes?: string[];      // CSS classes para o grid (ex: ['col-12 md:col-6'])
}
```

### FormStructure

```typescript
interface FormStructure {
  id: string;
  title?: string;
  elements: FormElement[];
  layout?: 'vertical' | 'horizontal' | 'grid';
}
```

### Step

```typescript
interface Step {
  identifier: 'dynamicForm' | 'revisionStepper' | 'stepTextInContent';
  step: number;           // posição (1-based)
  title: string;
  formGroup?: FormGroup;  // presente apenas em 'dynamicForm'
  dynamicForm?: FormStructure;  // estrutura para DynamicFormComponent
  valid?: boolean;        // flag de validade (para steps sem FormGroup)
  completed?: boolean;    // marcado true ao avançar além deste step
  text?: string;          // conteúdo HTML para 'stepTextInContent'
  data?: unknown;         // valores preenchidos pelo usuário
}
```

### StepperConfig

```typescript
interface StepperConfig {
  id: string;
  steps: Step[];
  currentStep: number;
  completed: boolean;
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy?: boolean;
  nameLastButton?: string;
}
```

---

## 12. Demonstração — payload da API

O JSON abaixo é o mínimo necessário para o motor gerar um formulário funcional de 2 steps:

```json
{
  "stepperLearnMore": [
    {
      "id": "intro",
      "title": "Sobre a vaga",
      "layout": "horizontal",
      "elements": [
        {
          "id": "description",
          "type": "textHTML",
          "value": "<h2>Desenvolvedor Frontend</h2><p>Vaga remota, regime CLT.</p>"
        }
      ]
    },
    {
      "id": "contact",
      "title": "Seus dados",
      "layout": "horizontal",
      "elements": [
        {
          "id": "name",
          "type": "text",
          "label": "Nome completo",
          "placeholder": "Seu nome",
          "classes": ["col-12 md:col-6"],
          "validators": { "required": true }
        },
        {
          "id": "email",
          "type": "email",
          "label": "E-mail",
          "placeholder": "email@exemplo.com",
          "classes": ["col-12 md:col-6"],
          "validators": { "required": true }
        },
        {
          "id": "seniority",
          "type": "select",
          "label": "Senioridade",
          "placeholder": "Selecione",
          "defaultValue": null,
          "classes": ["col-12"],
          "options": [
            { "name": "Júnior", "code": "junior" },
            { "name": "Pleno", "code": "mid" },
            { "name": "Sênior", "code": "senior" }
          ],
          "validators": { "required": true }
        },
        {
          "id": "terms",
          "type": "checkboxAuthorize",
          "label": "Concordo com os termos de uso.",
          "classes": ["col-12"],
          "validators": { "required": true }
        }
      ]
    }
  ],
  "stepperConfig": {
    "showStepProgress": true,
    "showCheckboxPrivacyPolicy": true,
    "nameLastButton": "Candidatar-se",
    "setRevisionStepper": true
  }
}
```

**O que o motor produz a partir desse JSON:**

```
Step 1 — "Sobre a vaga"     → identifier: 'stepTextInContent' (só textHTML, sem form)
Step 2 — "Seus dados"       → identifier: 'dynamicForm'
  FormGroup {
    name:       ['', [Validators.required]]
    email:      ['', [Validators.required, Validators.email]] ← type email adiciona validator
    seniority:  [null, [Validators.required]]
    terms:      ['', [Validators.required]]
  }
Step 3 — "Revisão"          → identifier: 'revisionStepper' (adicionado automaticamente)
  valid: false (até o checkbox de privacidade ser marcado)
```

**Payload enviado ao backend após preenchimento:**

```json
{
  "pinId": "pin-123",
  "fields": [
    { "id": "name",      "value": "João Silva" },
    { "id": "email",     "value": "joao@exemplo.com" },
    { "id": "seniority", "value": "senior" },
    { "id": "terms",     "value": true }
  ]
}
```
