import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { ProductEligibilityMode } from '@shared/enums/product-eligibility-mode.enum';
import { ProductType } from '@shared/enums/product-type.enum';
import { CreatorGroup, OrganizationCreator } from '@shared/interfaces/entity/empresa-creator';
import { ProductDescriptionBlockResponse } from '@shared/interfaces/dto/response/empresa-product';
import {
  ProductLearnMoreConfig,
  ProductLearnMoreElementType,
  ProductLearnMoreStep,
} from '@shared/interfaces/entity/empresa-product';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { GenericStepperComponent } from '@shared/components/stepper/components/generic-stepper/generic-stepper.component';
import { StepRevisionComponent } from '@shared/components/stepper/components/step-revision/step-revision.component';
import { StepTextHtmlComponent } from '@shared/components/stepper/components/step-text-html/step-text-html.component';
import { StepperService } from '@shared/components/stepper/services/stepper.service';
import { Step, StepperConfig } from '@shared/components/stepper/interfaces/stepper.interface';
import { ProductLearnMoreAdapter } from '@domain/empresa/services/product-learn-more.adapter';
import {
  PRODUCT_TYPES_IN_ORDER,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import {
  ctaLabelFor,
  getSuggestedFieldIds,
  LEARN_MORE_FIELD_CATALOG,
} from '@domain/empresa/constants/product-wizard-presets';
import { CreatorFacade } from '@domain/empresa/services/creator.facade';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { ProductCreateFacade } from '@domain/empresa/services/product-create.facade';

type FieldClasses = 'col-12 md:col-6' | 'col-12';
type StepLayout = 'horizontal' | 'vertical';

interface BuilderOption {
  name: string;
  code: string;
}

interface BuilderElement {
  id: string;
  classes: FieldClasses;
  type: ProductLearnMoreElementType;
  value: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  required: boolean;
  options: BuilderOption[];
}

interface BuilderStep {
  id: string;
  title: string;
  layout: StepLayout;
  elements: BuilderElement[];
}

const FIELD_TYPE_OPTIONS: ReadonlyArray<{ value: ProductLearnMoreElementType; label: string }> = [
  { value: 'text', label: 'Texto' },
  { value: 'textHTML', label: 'Conteúdo (HTML)' },
  { value: 'email', label: 'E-mail' },
  { value: 'select', label: 'Seleção' },
  { value: 'uploadFile', label: 'Upload de arquivo' },
  { value: 'checkboxAuthorize', label: 'Autorização' },
];
const CLASS_OPTIONS: ReadonlyArray<{ value: FieldClasses; label: string }> = [
  { value: 'col-12 md:col-6', label: 'Metade (col-12 md:col-6)' },
  { value: 'col-12', label: 'Inteira (col-12)' },
];
const LAYOUT_OPTIONS: ReadonlyArray<StepLayout> = ['horizontal', 'vertical'];

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

@Component({
  selector: 'app-product-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DrawerComponent,
    DynamicFormComponent,
    GenericStepperComponent,
    StepRevisionComponent,
    StepTextHtmlComponent,
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})
export class ProductCreateComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProductCreateFacade);
  private readonly creatorFacade = inject(CreatorFacade);
  private readonly context = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lmAdapter = inject(ProductLearnMoreAdapter);
  protected readonly stepperService = inject(StepperService);

  readonly types = PRODUCT_TYPES_IN_ORDER;
  readonly typeMeta = PRODUCT_TYPE_META;
  readonly catalog = LEARN_MORE_FIELD_CATALOG;
  readonly EligibilityMode = ProductEligibilityMode;

  readonly TOTAL_STEPS = 6;
  readonly steps = [1, 2, 3, 4, 5, 6];
  readonly stepLabels = [
    'Tipo',
    'Título & descrição',
    'Saiba mais',
    'Configuração',
    'Quem vende',
    'Revisar',
  ];
  readonly currentStep = signal<number>(1);
  readonly showSuccess = signal<boolean>(false);

  // Preview do formulário (drawer com o stepper) na etapa de revisão
  readonly showPreviewDrawer = signal<boolean>(false);
  readonly previewConfig = signal<StepperConfig | null>(null);

  // ---------- Eligibility (etapa 6) ----------
  readonly creators = this.creatorFacade.creators;
  readonly creatorGroups = this.creatorFacade.groups;
  readonly eligibilityMode = signal<ProductEligibilityMode>(ProductEligibilityMode.Any);
  readonly selectedEligibilityIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly isSubmitting = this.facade.isSubmitting;
  readonly serverError = this.facade.error;
  readonly created = this.facade.created;

  // ---------- Forms ----------

  readonly stepTypeForm = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<ProductType | ''>('', [Validators.required]),
  });

  readonly stepIdentificationForm = this.fb.group({});
  readonly stepDescriptionForm = this.fb.nonNullable.group({
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
  });
  // Step 3 — Saiba Mais builder (signal-based)
  readonly lmSteps = signal<BuilderStep[]>([]);
  readonly currentBuilderStep = signal<number>(0);
  readonly lmElementCount = computed<number>(() =>
    this.lmSteps().reduce((acc, s) => acc + s.elements.length, 0),
  );
  readonly fieldTypeOptions = FIELD_TYPE_OPTIONS;
  readonly classOptions = CLASS_OPTIONS;
  readonly layoutOptions = LAYOUT_OPTIONS;

  // "Adicionar Elemento" modal
  readonly showElementModal = signal<boolean>(false);
  readonly modalView = signal<'menu' | 'step' | 'field'>('menu');
  readonly newStepForm = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('Informações de contato', [Validators.required]),
    layout: this.fb.nonNullable.control<StepLayout>('horizontal'),
  });
  readonly newFieldForm = this.fb.nonNullable.group({
    classes: this.fb.nonNullable.control<FieldClasses>('col-12 md:col-6'),
    type: this.fb.nonNullable.control<ProductLearnMoreElementType>('text'),
    value: this.fb.nonNullable.control(''),
    label: this.fb.nonNullable.control('', [Validators.required]),
    defaultValue: this.fb.nonNullable.control(''),
    placeholder: this.fb.nonNullable.control(''),
    required: this.fb.nonNullable.control(false),
    options: this.fb.array<FormGroup<{ name: FormControl<string>; code: FormControl<string> }>>([]),
  });

  // Step 4 — Configuração do stepper
  readonly configForm = this.fb.nonNullable.group({
    showStepProgress: this.fb.nonNullable.control(true),
    showCheckboxPrivacyPolicy: this.fb.nonNullable.control(true),
    nameLastButton: this.fb.nonNullable.control('Candidatar-se para a vaga', [Validators.required]),
    setRevisionStepper: this.fb.nonNullable.control(true),
  });
  // ---------- Form state bridged to signals ----------

  private readonly typeValue = toSignal(this.stepTypeForm.controls.type.valueChanges, {
    initialValue: this.stepTypeForm.controls.type.value,
  });
  private readonly typeStatus = toSignal(this.stepTypeForm.statusChanges, {
    initialValue: this.stepTypeForm.status,
  });
  private readonly identificationStatus = toSignal(this.stepIdentificationForm.statusChanges, {
    initialValue: this.stepIdentificationForm.status,
  });
  private readonly descriptionStatus = toSignal(this.stepDescriptionForm.statusChanges, {
    initialValue: this.stepDescriptionForm.status,
  });
  private readonly configStatus = toSignal(this.configForm.statusChanges, {
    initialValue: this.configForm.status,
  });

  // ---------- Derived ----------

  readonly selectedType = computed<ProductType | null>(() => {
    const raw = this.typeValue();
    return raw ? (raw as ProductType) : null;
  });

  readonly descriptionSummary = computed<Array<{ title: string; body: string }>>(() => {
    const body = (this.stepDescriptionForm.controls.description.value ?? '').trim();
    return body ? [{ title: 'Descrição', body }] : [];
  });

  // ---------- Validity per step ----------

  readonly isCurrentStepValid = computed<boolean>(() => {
    switch (this.currentStep()) {
      case 1:
        return this.typeStatus() === 'VALID';
      case 2:
        return this.identificationStatus() === 'VALID' && this.descriptionStatus() === 'VALID';
      case 3:
        return this.lmElementCount() > 0;
      case 4:
        return this.configStatus() === 'VALID';
      case 5:
        return (
          this.eligibilityMode() === ProductEligibilityMode.Any ||
          this.selectedEligibilityIds().size > 0
        );
      case 6:
        return true;
      default:
        return false;
    }
  });

  readonly eligibilitySummary = computed<string>(() => {
    const mode = this.eligibilityMode();
    if (mode === ProductEligibilityMode.Any) {
      return 'Qualquer creator institucionalizado do canal pode vender este produto.';
    }
    const ids = this.selectedEligibilityIds();
    if (mode === ProductEligibilityMode.Creators) {
      const names = this.creators()
        .filter((c) => ids.has(c.id))
        .map((c) => c.displayName);
      return names.length ? `Creators: ${names.join(', ')}.` : 'Nenhum creator selecionado.';
    }
    const names = this.creatorGroups()
      .filter((g) => ids.has(g.id))
      .map((g) => g.name);
    return names.length ? `Grupos: ${names.join(', ')}.` : 'Nenhum grupo selecionado.';
  });

  constructor() {
    // Load context if visiting directly (deep link) without going through the panel.
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug && this.context.organization()?.slug !== slug) {
      this.context.load(slug);
    }
    if (slug) {
      this.creatorFacade.load(slug);
    }

    // Rebuild dynamic forms whenever the type changes.
    effect(() => {
      const type = this.selectedType();
      if (!type) return;
      this.rebuildIdentification(type);
      this.seedLearnMore(type);
      if (!this.configForm.controls.nameLastButton.dirty) {
        this.configForm.controls.nameLastButton.setValue(ctaLabelFor(type), { emitEvent: false });
      }
    });

    // After successful submission, swap to the success view.
    effect(() => {
      if (this.created()) {
        this.showSuccess.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
    this.creatorFacade.reset();
  }

  // ---------- Eligibility step ----------

  protected setEligibilityMode(mode: ProductEligibilityMode): void {
    if (this.eligibilityMode() === mode) return;
    this.eligibilityMode.set(mode);
    this.selectedEligibilityIds.set(new Set<string>());
  }

  protected toggleEligibilityId(id: string): void {
    this.selectedEligibilityIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected isEligibilityIdSelected(id: string): boolean {
    return this.selectedEligibilityIds().has(id);
  }

  protected trackCreator = (_: number, c: OrganizationCreator): string => c.id;
  protected trackCreatorGroup = (_: number, g: CreatorGroup): string => g.id;

  // ---------- Step navigation ----------

  protected goNext(): void {
    if (!this.isCurrentStepValid()) {
      this.markCurrentTouched();
      return;
    }
    if (this.currentStep() < this.TOTAL_STEPS) {
      this.currentStep.update((n) => n + 1);
    } else {
      this.submit();
    }
  }

  protected goBack(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((n) => n - 1);
    }
  }

  protected jumpToStep(step: number): void {
    if (step < 1 || step > this.TOTAL_STEPS) return;
    // Only allow jumping back, or forward only if previous steps are valid.
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
      return;
    }
    for (let s = 1; s < step; s++) {
      if (!this.isStepValidByIndex(s)) return;
    }
    this.currentStep.set(step);
  }

  protected close(): void {
    this.router.navigateByUrl(this.goToProductsLink());
  }

  // ---------- Type step ----------

  protected selectType(type: ProductType): void {
    this.stepTypeForm.controls.type.setValue(type);
  }

  // ---------- Learn-more step (builder + "Adicionar Elemento" modal) ----------

  protected setCurrentBuilderStep(index: number): void {
    this.currentBuilderStep.set(index);
  }

  protected removeBuilderStep(index: number): void {
    this.lmSteps.update((steps) => steps.filter((_, i) => i !== index));
    if (this.currentBuilderStep() >= this.lmSteps().length) {
      this.currentBuilderStep.set(Math.max(0, this.lmSteps().length - 1));
    }
  }

  protected removeBuilderElement(stepIndex: number, elementIndex: number): void {
    this.lmSteps.update((steps) =>
      steps.map((s, i) =>
        i === stepIndex ? { ...s, elements: s.elements.filter((_, j) => j !== elementIndex) } : s,
      ),
    );
  }

  protected openElementModal(): void {
    this.modalView.set('menu');
    this.showElementModal.set(true);
  }

  protected closeElementModal(): void {
    this.showElementModal.set(false);
  }

  protected chooseNewStep(): void {
    this.newStepForm.reset({ title: 'Informações de contato', layout: 'horizontal' });
    this.modalView.set('step');
  }

  protected chooseNewField(): void {
    this.newFieldForm.reset({
      classes: 'col-12 md:col-6',
      type: 'text',
      value: '',
      label: '',
      defaultValue: '',
      placeholder: '',
      required: false,
    });
    this.newFieldOptions.clear();
    this.modalView.set('field');
  }

  protected get newFieldOptions(): FormArray<
    FormGroup<{ name: FormControl<string>; code: FormControl<string> }>
  > {
    return this.newFieldForm.controls.options;
  }

  protected addNewFieldOption(): void {
    const n = this.newFieldOptions.length + 1;
    this.newFieldOptions.push(
      this.fb.nonNullable.group({
        name: this.fb.nonNullable.control(`Opção ${n}`, [Validators.required]),
        code: this.fb.nonNullable.control(`opcao-${n}`, [Validators.required]),
      }),
    );
  }

  protected removeNewFieldOption(index: number): void {
    this.newFieldOptions.removeAt(index);
  }

  protected saveNewStep(): void {
    if (this.newStepForm.invalid) {
      this.newStepForm.markAllAsTouched();
      return;
    }
    const { title, layout } = this.newStepForm.getRawValue();
    const step: BuilderStep = { id: this.uniqueStepId(), title, layout, elements: [] };
    this.lmSteps.update((steps) => [...steps, step]);
    this.currentBuilderStep.set(this.lmSteps().length - 1);
    this.showElementModal.set(false);
  }

  protected saveNewField(): void {
    if (this.newFieldForm.invalid) {
      this.newFieldForm.markAllAsTouched();
      return;
    }
    if (this.lmSteps().length === 0) {
      this.lmSteps.set([
        { id: this.uniqueStepId(), title: 'Informações de contato', layout: 'horizontal', elements: [] },
      ]);
      this.currentBuilderStep.set(0);
    }
    const raw = this.newFieldForm.getRawValue();
    const element: BuilderElement = {
      id: this.uniqueElementId(raw.type),
      classes: raw.classes,
      type: raw.type,
      value: raw.value,
      label: raw.label,
      defaultValue: raw.defaultValue,
      placeholder: raw.placeholder,
      required: raw.required,
      options:
        raw.type === 'select' ? raw.options.map((o) => ({ name: o.name, code: o.code })) : [],
    };
    const idx = this.currentBuilderStep();
    this.lmSteps.update((steps) =>
      steps.map((s, i) => (i === idx ? { ...s, elements: [...s.elements, element] } : s)),
    );
    this.showElementModal.set(false);
  }

  private uniqueStepId(): string {
    return `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private uniqueElementId(type: string): string {
    const base =
      type === 'checkboxAuthorize' ? 'authorize' : type === 'uploadFile' ? 'upload' : type;
    const existing = new Set(this.lmSteps().flatMap((s) => s.elements.map((e) => e.id)));
    if (!existing.has(base)) return base;
    let i = 2;
    while (existing.has(`${base}-${i}`)) i++;
    return `${base}-${i}`;
  }

  // ---------- Preview do formulário (drawer) ----------

  protected openPreview(): void {
    const config = this.buildLearnMoreConfig();
    const stepper = this.lmAdapter.fromConfig(config, 'preview', this.previewTitle());
    this.stepperService.initializeStepper(stepper);
    this.previewConfig.set(stepper);
    this.showPreviewDrawer.set(true);
  }

  protected closePreview(): void {
    this.showPreviewDrawer.set(false);
  }

  protected onPreviewVisibleChange(visible: boolean): void {
    if (!visible) this.closePreview();
  }

  protected onPreviewFormChange(value: unknown, stepNumber: number): void {
    this.stepperService.updateStepData(value, stepNumber);
  }

  protected onPreviewPrivacyAccepted(accepted: boolean): void {
    const revision = this.stepperService
      .getAllData()
      .find((s) => s.identifier === 'revisionStepper');
    if (revision) this.stepperService.updateStepValidity(revision.step, accepted);
  }

  protected onPreviewDone(_steps: Step[]): void {
    this.closePreview();
  }

  private previewTitle(): string {
    const value: unknown = this.stepIdentificationForm.get('title')?.value;
    return typeof value === 'string' && value.length ? value : 'Saiba mais';
  }

  /** First step of the dynamic form: a textHTML element built from título + descrição. */
  private buildIntroStep(): ProductLearnMoreStep {
    const title = this.previewTitle();
    const desc = (this.stepDescriptionForm.controls.description.value ?? '').trim();
    const parts: string[] = [
      `<div class="text-center text-4xl font-medium">${escapeHtml(title)}</div>`,
    ];
    if (desc) parts.push(`<p>${escapeHtml(desc).replace(/\n/g, '<br>')}</p>`);
    return {
      id: 'first-content-step',
      title: '',
      layout: 'horizontal',
      elements: [{ id: 'intro', type: 'textHTML', value: parts.join('') }],
    };
  }

  // ---------- Submission ----------

  protected submit(): void {
    const slug = this.context.organization()?.slug ?? this.route.snapshot.paramMap.get('slug');
    const deptSlug = this.route.snapshot.paramMap.get('deptSlug') ?? undefined;
    const type = this.selectedType();
    if (!slug || !type) return;
    if (!this.isCurrentStepValid()) return;

    const description = this.buildDescription();
    const learnMoreConfig = this.buildLearnMoreConfig();
    const identification = this.stepIdentificationForm.value as Record<string, string>;
    const title = identification['title'] ?? '';
    const eligibility = this.buildEligibility();

    this.facade.submit(slug, {
      type,
      title,
      subtitle: '',
      badges: [],
      location: '',
      department: deptSlug,
      description,
      screeningQuestions: [],
      learnMoreConfig,
      eligibility,
    });
  }

  private buildEligibility() {
    const mode = this.eligibilityMode();
    const ids = [...this.selectedEligibilityIds()];
    return {
      mode,
      creatorIds: mode === ProductEligibilityMode.Creators ? ids : [],
      groupIds: mode === ProductEligibilityMode.Groups ? ids : [],
    };
  }

  // ---------- Display helpers (template-friendly) ----------

  protected goToProductsLink(): string {
    return `${this.basePath()}/produtos`;
  }

  protected listLink(): string {
    return `/${environment.ROUTES.EMPRESA.LIST}`;
  }

  protected basePath(): string {
    const slug = this.context.organization()?.slug ?? this.route.snapshot.paramMap.get('slug');
    const deptSlug = this.route.snapshot.paramMap.get('deptSlug');
    return slug && deptSlug
      ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}/${deptSlug}`
      : this.listLink();
  }

  protected typeLabel(type: ProductType): string {
    return PRODUCT_TYPE_META[type].label;
  }

  protected ctaLabel(type: ProductType): string {
    return ctaLabelFor(type);
  }

  protected hasError(form: FormGroup, key: string, error: string): boolean {
    const c = form.get(key);
    return !!c && c.touched && c.hasError(error);
  }

  // ---------- Internals ----------

  private isStepValidByIndex(step: number): boolean {
    const original = this.currentStep();
    this.currentStep.set(step);
    const valid = this.isCurrentStepValid();
    this.currentStep.set(original);
    return valid;
  }

  private markCurrentTouched(): void {
    switch (this.currentStep()) {
      case 1:
        this.stepTypeForm.markAllAsTouched();
        break;
      case 2:
        this.stepIdentificationForm.markAllAsTouched();
        this.stepDescriptionForm.markAllAsTouched();
        break;
      case 4:
        this.configForm.markAllAsTouched();
        break;
    }
  }

  private rebuildIdentification(_type: ProductType): void {
    // Step 2 is "Título + Descrição puro": only the title is captured here.
    if (!this.stepIdentificationForm.contains('title')) {
      this.stepIdentificationForm.addControl(
        'title',
        this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
      );
    }
  }

  private seedLearnMore(type: ProductType): void {
    if (this.lmSteps().length > 0) return;
    const suggested = getSuggestedFieldIds(type);
    const elements: BuilderElement[] = [];
    for (const id of suggested) {
      const def = this.catalog.find((f) => f.id === id);
      if (!def) continue;
      const elType = def.type as ProductLearnMoreElementType;
      elements.push({
        id: def.id,
        classes: elType === 'uploadFile' ? 'col-12' : 'col-12 md:col-6',
        type: elType,
        value: '',
        label: def.label,
        defaultValue: '',
        placeholder: '',
        required: def.defaultRequired,
        options: def.options ? def.options.map((o) => ({ name: o.label, code: o.value })) : [],
      });
    }
    this.lmSteps.set([
      { id: this.uniqueStepId(), title: 'Informações de contato', layout: 'horizontal', elements },
    ]);
    this.currentBuilderStep.set(0);
  }

  private buildDescription(): ProductDescriptionBlockResponse[] {
    const body = (this.stepDescriptionForm.controls.description.value ?? '').trim();
    return body ? [{ id: 'description', title: 'Descrição', body }] : [];
  }

  private buildLearnMoreConfig(): ProductLearnMoreConfig {
    const userSteps: ProductLearnMoreStep[] = this.lmSteps().map((step) => ({
      id: step.id,
      title: step.title,
      layout: step.layout,
      elements: step.elements.map((el) => ({
        id: el.id,
        classes: el.classes,
        type: el.type,
        value: el.value || '',
        label: el.label || undefined,
        defaultValue: el.defaultValue || null,
        placeholder: el.placeholder || undefined,
        validators: {
          required: el.required,
          errorRequired: el.required ? 'Campo obrigatório.' : undefined,
        },
        options: el.type === 'select' ? el.options.map((o) => ({ name: o.name, code: o.code })) : [],
      })),
    }));
    const cfg = this.configForm.getRawValue();
    return {
      stepperLearnMore: [this.buildIntroStep(), ...userSteps],
      stepperConfig: {
        showStepProgress: cfg.showStepProgress,
        showCheckboxPrivacyPolicy: cfg.showCheckboxPrivacyPolicy,
        nameLastButton: cfg.nameLastButton,
        setRevisionStepper: cfg.setRevisionStepper,
      },
    };
  }
}
