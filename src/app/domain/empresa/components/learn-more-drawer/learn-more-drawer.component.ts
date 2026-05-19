import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FormStructure } from '@shared/components/dynamic-form/interfaces/form-element.interface';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { EmpresaSubmissionApi } from '@shared/apis/empresa-submission.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { LearnMoreLauncherService } from '@domain/empresa/services/learn-more-launcher.service';
import { ProductLearnMoreAdapter } from '@domain/empresa/services/product-learn-more.adapter';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

interface FieldEntry {
  fieldId: string;
  value: string;
}

@Component({
  selector: 'app-learn-more-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DrawerComponent, DynamicFormComponent],
  templateUrl: './learn-more-drawer.component.html',
  styleUrl: './learn-more-drawer.component.scss',
})
export class LearnMoreDrawerComponent {
  private readonly launcher = inject(LearnMoreLauncherService);
  private readonly productApi = inject(EmpresaProductApi);
  private readonly submissionApi = inject(EmpresaSubmissionApi);
  private readonly adapter = inject(ProductLearnMoreAdapter);

  protected readonly target = this.launcher.target;
  protected readonly isOpen = this.launcher.isOpen;

  protected readonly product = signal<Product | null>(null);
  protected readonly structure = signal<FormStructure | null>(null);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly submitted = signal<boolean>(false);

  private currentValues: Record<string, unknown> = {};
  private currentValid = false;

  constructor() {
    effect(() => {
      const target = this.target();
      if (target) {
        this.loadProduct(target.slug, target.productId);
      } else {
        this.resetState();
      }
    });
  }

  protected onClose(): void {
    this.launcher.close();
  }

  protected onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.launcher.close();
    }
  }

  protected onFormChange(values: unknown): void {
    this.currentValues = (values as Record<string, unknown>) ?? {};
  }

  protected onFormStatus(event: { valid: boolean }): void {
    this.currentValid = event.valid;
  }

  protected onSubmit(): void {
    const target = this.target();
    const product = this.product();
    if (!target || !product) return;
    if (!this.currentValid) {
      this.error.set('Preencha os campos obrigatórios.');
      return;
    }
    const answers = this.buildAnswers();

    this.isSubmitting.set(true);
    this.error.set(null);

    this.submissionApi
      .create(target.slug, product.id, { answers })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.submitted.set(true);
          } else {
            this.error.set(response.message || 'Não foi possível enviar.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível enviar.');
          return EMPTY;
        }),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe();
  }

  protected get submitLabel(): string {
    return this.product()?.learnMoreConfig.submitButtonLabel ?? 'Enviar';
  }

  protected get title(): string {
    return this.product()?.title ?? this.target()?.productTitle ?? 'Saiba mais';
  }

  // ---------- internals ----------

  private loadProduct(slug: string, productId: string): void {
    this.resetState();
    this.isLoading.set(true);
    this.productApi
      .detail(slug, productId)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.product.set(response.data);
            this.structure.set(this.adapter.toFormStructure(response.data));
          } else {
            this.error.set(response.message || 'Produto não encontrado.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível carregar o formulário.');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  private resetState(): void {
    this.product.set(null);
    this.structure.set(null);
    this.isLoading.set(false);
    this.isSubmitting.set(false);
    this.error.set(null);
    this.submitted.set(false);
    this.currentValues = {};
    this.currentValid = false;
  }

  private buildAnswers(): FieldEntry[] {
    const product = this.product();
    if (!product) return [];
    const skipIds = new Set<string>(['privacyPolicy']);
    const fieldIds = new Set<string>(
      product.learnMoreConfig.steps.flatMap((s) => s.fields.map((f) => f.id)),
    );
    const result: FieldEntry[] = [];
    for (const [key, raw] of Object.entries(this.currentValues)) {
      if (skipIds.has(key)) continue;
      if (!fieldIds.has(key)) continue;
      const value = raw === null || raw === undefined ? '' : String(raw);
      result.push({ fieldId: key, value });
    }
    return result;
  }
}
