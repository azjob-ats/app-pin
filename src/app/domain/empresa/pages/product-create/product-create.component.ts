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
  AbstractControl,
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
import { ProductType } from '@shared/enums/product-type.enum';
import {
  ProductDescriptionBlockResponse,
  ProductLearnMoreConfigResponse,
  ProductScreeningQuestionResponse,
} from '@shared/interfaces/dto/response/empresa-product';
import {
  PRODUCT_TYPES_IN_ORDER,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import {
  ctaLabelFor,
  DESCRIPTION_PRESETS,
  getSuggestedFieldIds,
  IDENTIFICATION_PRESETS,
  LearnMoreFieldOption,
  LEARN_MORE_FIELD_CATALOG,
  WizardDescriptionBlock,
  WizardField,
} from '@domain/empresa/constants/product-wizard-presets';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { ProductCreateFacade } from '@domain/empresa/services/product-create.facade';

interface LearnMoreSelection {
  readonly id: string;
  readonly required: boolean;
}

@Component({
  selector: 'app-product-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})
export class ProductCreateComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProductCreateFacade);
  private readonly context = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly types = PRODUCT_TYPES_IN_ORDER;
  readonly typeMeta = PRODUCT_TYPE_META;
  readonly catalog = LEARN_MORE_FIELD_CATALOG;

  readonly TOTAL_STEPS = 6;
  readonly currentStep = signal<number>(1);
  readonly showSuccess = signal<boolean>(false);

  readonly isSubmitting = this.facade.isSubmitting;
  readonly serverError = this.facade.error;
  readonly created = this.facade.created;

  // ---------- Forms ----------

  readonly stepTypeForm = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<ProductType | ''>('', [Validators.required]),
  });

  readonly stepIdentificationForm = this.fb.group({});
  readonly stepDescriptionForm = this.fb.group({});
  readonly stepLearnMoreForm = this.fb.nonNullable.group({
    fields: this.fb.array<FormGroup<{ id: FormControl<string>; required: FormControl<boolean> }>>(
      [],
      [Validators.required, Validators.minLength(1)],
    ),
  });
  readonly stepScreeningForm = this.fb.nonNullable.group({
    questions: this.fb.array<
      FormGroup<{
        question: FormControl<string>;
        idealAnswer: FormControl<string>;
        required: FormControl<boolean>;
      }>
    >([]),
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
  private readonly screeningStatus = toSignal(this.stepScreeningForm.statusChanges, {
    initialValue: this.stepScreeningForm.status,
  });

  // ---------- Derived ----------

  readonly selectedType = computed<ProductType | null>(() => {
    const raw = this.typeValue();
    return raw ? (raw as ProductType) : null;
  });

  readonly identificationFields = computed<readonly WizardField[]>(() => {
    const type = this.selectedType();
    return type ? IDENTIFICATION_PRESETS[type] : [];
  });

  readonly descriptionBlocks = computed<readonly WizardDescriptionBlock[]>(() => {
    const type = this.selectedType();
    return type ? DESCRIPTION_PRESETS[type] : [];
  });

  readonly availableLearnMoreFields = computed<readonly LearnMoreFieldOption[]>(() => {
    const type = this.selectedType();
    if (!type) return [];
    const suggested = new Set<string>(getSuggestedFieldIds(type));
    return [...this.catalog].sort((a, b) => {
      const sa = suggested.has(a.id) ? 0 : 1;
      const sb = suggested.has(b.id) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return a.label.localeCompare(b.label, 'pt-BR');
    });
  });

  readonly selectedLearnMoreIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly identificationSummary = computed<Array<{ label: string; value: string }>>(() => {
    const fields = this.identificationFields();
    const value = this.stepIdentificationForm.value as Record<string, string>;
    return fields.map((f) => ({ label: f.label, value: this.displayValue(f, value[f.key] ?? '') }));
  });

  readonly descriptionSummary = computed<Array<{ title: string; body: string }>>(() => {
    const blocks = this.descriptionBlocks();
    const value = this.stepDescriptionForm.value as Record<string, string>;
    return blocks
      .map((b) => ({ title: b.title, body: (value[b.key] ?? '').trim() }))
      .filter((b) => b.body.length > 0);
  });

  readonly screeningSummary = computed(() =>
    this.stepScreeningForm.controls.questions.controls.map((c) => ({
      question: c.controls.question.value,
      idealAnswer: c.controls.idealAnswer.value,
      required: c.controls.required.value,
    })),
  );

  // ---------- Validity per step ----------

  readonly isCurrentStepValid = computed<boolean>(() => {
    switch (this.currentStep()) {
      case 1:
        return this.typeStatus() === 'VALID';
      case 2:
        return this.identificationStatus() === 'VALID';
      case 3:
        return this.descriptionStatus() === 'VALID';
      case 4:
        return this.selectedLearnMoreIds().size > 0;
      case 5:
        return this.screeningStatus() === 'VALID';
      case 6:
        return true;
      default:
        return false;
    }
  });

  constructor() {
    // Load context if visiting directly (deep link) without going through the panel.
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug && this.context.organization()?.slug !== slug) {
      this.context.load(slug);
    }

    // Rebuild dynamic forms whenever the type changes.
    effect(() => {
      const type = this.selectedType();
      if (!type) return;
      this.rebuildIdentification(type);
      this.rebuildDescription(type);
      this.seedLearnMore(type);
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
  }

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
    this.router.navigateByUrl(this.listLink());
  }

  // ---------- Type step ----------

  protected selectType(type: ProductType): void {
    this.stepTypeForm.controls.type.setValue(type);
  }

  // ---------- Learn-more step ----------

  protected get learnMoreArray(): FormArray<
    FormGroup<{ id: FormControl<string>; required: FormControl<boolean> }>
  > {
    return this.stepLearnMoreForm.controls.fields;
  }

  protected isFieldSelected(id: string): boolean {
    return this.selectedLearnMoreIds().has(id);
  }

  protected toggleLearnMoreField(field: LearnMoreFieldOption): void {
    const set = new Set(this.selectedLearnMoreIds());
    const arr = this.learnMoreArray;
    if (set.has(field.id)) {
      set.delete(field.id);
      const idx = arr.controls.findIndex((c) => c.controls.id.value === field.id);
      if (idx >= 0) arr.removeAt(idx);
    } else {
      set.add(field.id);
      arr.push(
        this.fb.nonNullable.group({
          id: this.fb.nonNullable.control(field.id),
          required: this.fb.nonNullable.control(field.defaultRequired),
        }),
      );
    }
    this.selectedLearnMoreIds.set(set);
  }

  protected fieldRequiredControl(id: string): FormControl<boolean> | null {
    const grp = this.learnMoreArray.controls.find((c) => c.controls.id.value === id);
    return grp?.controls.required ?? null;
  }

  protected catalogLabel(id: string): string {
    return this.catalog.find((f) => f.id === id)?.label ?? id;
  }

  // ---------- Screening step ----------

  protected get screeningArray(): FormArray<
    FormGroup<{
      question: FormControl<string>;
      idealAnswer: FormControl<string>;
      required: FormControl<boolean>;
    }>
  > {
    return this.stepScreeningForm.controls.questions;
  }

  protected addScreeningQuestion(): void {
    this.screeningArray.push(
      this.fb.nonNullable.group({
        question: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
        idealAnswer: this.fb.nonNullable.control(''),
        required: this.fb.nonNullable.control(false),
      }),
    );
  }

  protected removeScreeningQuestion(index: number): void {
    this.screeningArray.removeAt(index);
  }

  // ---------- Submission ----------

  protected submit(): void {
    const slug = this.context.organization()?.slug;
    const type = this.selectedType();
    if (!slug || !type) return;
    if (!this.isCurrentStepValid()) return;

    const description = this.buildDescription(type);
    const learnMoreConfig = this.buildLearnMoreConfig(type);
    const screeningQuestions = this.buildScreeningQuestions();
    const identification = this.stepIdentificationForm.value as Record<string, string>;
    const title = identification['title'] ?? '';
    const subtitle = this.buildSubtitle(type, identification);
    const badges = this.buildBadges(type, identification);
    const location = identification['location'] ?? '';

    this.facade.submit(slug, {
      type,
      title,
      subtitle,
      badges,
      location,
      description,
      screeningQuestions,
      learnMoreConfig,
    });
  }

  // ---------- Display helpers (template-friendly) ----------

  protected goToProductsLink(): string {
    return `${this.basePath()}/produtos`;
  }

  protected listLink(): string {
    return `/${environment.ROUTES.EMPRESA.LIST}`;
  }

  protected basePath(): string {
    const slug = this.context.organization()?.slug;
    return slug ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}` : this.listLink();
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

  protected screeningHasError(index: number, key: 'question', error: string): boolean {
    const grp = this.screeningArray.at(index);
    if (!grp) return false;
    const c = grp.get(key) as AbstractControl | null;
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
        break;
      case 3:
        this.stepDescriptionForm.markAllAsTouched();
        break;
      case 5:
        this.stepScreeningForm.markAllAsTouched();
        break;
    }
  }

  private rebuildIdentification(type: ProductType): void {
    Object.keys(this.stepIdentificationForm.controls).forEach((k) =>
      this.stepIdentificationForm.removeControl(k),
    );
    for (const field of IDENTIFICATION_PRESETS[type]) {
      const validators = field.required ? [Validators.required] : [];
      this.stepIdentificationForm.addControl(
        field.key,
        this.fb.nonNullable.control('', validators),
      );
    }
  }

  private rebuildDescription(type: ProductType): void {
    Object.keys(this.stepDescriptionForm.controls).forEach((k) =>
      this.stepDescriptionForm.removeControl(k),
    );
    for (const block of DESCRIPTION_PRESETS[type]) {
      const validators = block.required ? [Validators.required, Validators.minLength(10)] : [];
      this.stepDescriptionForm.addControl(
        block.key,
        this.fb.nonNullable.control('', validators),
      );
    }
  }

  private seedLearnMore(type: ProductType): void {
    if (this.learnMoreArray.length > 0) return;
    const suggested = getSuggestedFieldIds(type);
    const set = new Set<string>();
    for (const id of suggested) {
      const field = this.catalog.find((f) => f.id === id);
      if (!field) continue;
      this.learnMoreArray.push(
        this.fb.nonNullable.group({
          id: this.fb.nonNullable.control(id),
          required: this.fb.nonNullable.control(field.defaultRequired),
        }),
      );
      set.add(id);
    }
    this.selectedLearnMoreIds.set(set);
  }

  private displayValue(field: WizardField, raw: string): string {
    if (!raw) return '—';
    if (field.kind === 'select' && field.options) {
      return field.options.find((o) => o.value === raw)?.label ?? raw;
    }
    return raw;
  }

  private buildDescription(type: ProductType): ProductDescriptionBlockResponse[] {
    const blocks = DESCRIPTION_PRESETS[type];
    const value = this.stepDescriptionForm.value as Record<string, string>;
    return blocks
      .map((b, i) => ({
        id: `${b.key}-${i}`,
        title: b.title,
        body: (value[b.key] ?? '').trim(),
      }))
      .filter((b) => b.body.length > 0);
  }

  private buildLearnMoreConfig(type: ProductType): ProductLearnMoreConfigResponse {
    const fields = this.learnMoreArray.controls.map((c) => {
      const id = c.controls.id.value;
      const def = this.catalog.find((f) => f.id === id);
      return {
        id,
        type: def?.type ?? 'text',
        label: def?.label ?? id,
        required: c.controls.required.value,
        options: def?.options ? def.options.map((o) => ({ ...o })) : undefined,
      };
    });
    return {
      steps: [{ id: 'main', title: 'Saiba mais', fields }],
      submitButtonLabel: ctaLabelFor(type),
      showCheckboxPrivacyPolicy: true,
      showRevisionStep: true,
    };
  }

  private buildScreeningQuestions(): ProductScreeningQuestionResponse[] {
    return this.screeningArray.controls.map((c, i) => ({
      id: `q${i + 1}`,
      question: c.controls.question.value,
      idealAnswer: c.controls.idealAnswer.value,
      required: c.controls.required.value,
    }));
  }

  private buildSubtitle(type: ProductType, identification: Record<string, string>): string {
    switch (type) {
      case ProductType.Job:
        return identification['employmentType']
          ? this.identificationOptionLabel('employmentType', identification['employmentType'])
          : '';
      case ProductType.Service:
        return identification['category'] ?? '';
      case ProductType.Training:
        return identification['schedule'] ?? '';
      case ProductType.News:
        return identification['editorialCategory'] ?? '';
      case ProductType.Experience:
        return identification['availableDates'] ?? '';
      default:
        return '';
    }
  }

  private buildBadges(type: ProductType, identification: Record<string, string>): string[] {
    const badges: string[] = [];
    const fields = IDENTIFICATION_PRESETS[type];
    for (const f of fields) {
      if (f.key === 'title' || f.key === 'location') continue;
      const raw = identification[f.key];
      if (!raw) continue;
      if (f.kind === 'select' && f.options) {
        const opt = f.options.find((o) => o.value === raw);
        if (opt) badges.push(opt.label);
      }
    }
    return badges;
  }

  private identificationOptionLabel(key: string, value: string): string {
    const type = this.selectedType();
    if (!type) return value;
    const field = IDENTIFICATION_PRESETS[type].find((f) => f.key === key);
    if (!field?.options) return value;
    return field.options.find((o) => o.value === value)?.label ?? value;
  }
}
